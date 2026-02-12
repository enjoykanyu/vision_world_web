import { ref, computed, onUnmounted } from 'vue'
import { danmakuAPI, type Danmaku } from '@/api/danmaku'

// 弹幕轨道配置
interface DanmakuTrack {
  id: number
  y: number
  occupied: boolean
  lastDanmakuEndTime: number
}

// 弹幕显示状态
interface DisplayDanmaku extends Omit<Danmaku, 'speed'> {
  top: number
  left: number
  width: number
  speed: number
  element?: HTMLElement
  isVisible: boolean
}

// 缓存时间段
interface CacheRange {
  start: number
  end: number
  danmakus: Danmaku[]
}

export function useDanmakuLoader(videoId: string, videoElement: HTMLVideoElement | null) {
  // 状态
  const allDanmakus = ref<Danmaku[]>([]) // 所有已加载的弹幕
  const displayDanmakus = ref<DisplayDanmaku[]>([]) // 当前显示的弹幕
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const totalCount = ref(0)
  
  // 缓存管理
  const cachedRanges = ref<CacheRange[]>([])
  const CACHE_AHEAD = 60 // 预加载60秒
  const CACHE_BEHIND = 30 // 保留30秒历史
  
  // 轨道管理
  const tracks = ref<DanmakuTrack[]>([])
  const TRACK_HEIGHT = 30
  const trackCount = computed(() => {
    if (!videoElement) return 8
    return Math.floor((videoElement.clientHeight || 360) / TRACK_HEIGHT) - 2
  })
  
  // 配置
  const config = ref({
    enabled: true,
    opacity: 0.8,
    fontSize: 25,
    density: 100, // 屏幕最大弹幕数
    filterKeywords: [] as string[],
    blockedUsers: [] as number[]
  })
  
  // 初始化轨道
  const initTracks = () => {
    const count = trackCount.value
    tracks.value = Array.from({ length: count }, (_, i) => ({
      id: i,
      y: (i + 1) * TRACK_HEIGHT,
      occupied: false,
      lastDanmakuEndTime: 0
    }))
  }
  
  // 检查时间段是否已缓存
  const isRangeCached = (start: number, end: number): boolean => {
    return cachedRanges.value.some(range => 
      range.start <= start && range.end >= end
    )
  }
  
  // 合并缓存区间
  const mergeCacheRanges = () => {
    if (cachedRanges.value.length <= 1) return
    
    cachedRanges.value.sort((a, b) => a.start - b.start)
    const merged: CacheRange[] = [cachedRanges.value[0]]
    
    for (let i = 1; i < cachedRanges.value.length; i++) {
      const current = cachedRanges.value[i]
      const last = merged[merged.length - 1]
      
      if (current.start <= last.end + 10) {
        // 合并区间
        last.end = Math.max(last.end, current.end)
        // 合并弹幕列表并去重
        const danmakuMap = new Map<number, Danmaku>()
        last.danmakus.forEach(d => danmakuMap.set(d.id, d))
        current.danmakus.forEach(d => danmakuMap.set(d.id, d))
        last.danmakus = Array.from(danmakuMap.values())
      } else {
        merged.push(current)
      }
    }
    
    cachedRanges.value = merged
  }
  
  // 清理过期缓存
  const cleanExpiredCache = (currentTime: number) => {
    const expireBefore = currentTime - CACHE_BEHIND - 120
    cachedRanges.value = cachedRanges.value.filter(range => range.end > expireBefore)
  }
  
  // 加载弹幕数据
  const loadDanmakus = async (startTime: number, endTime: number) => {
    // 检查是否已缓存
    if (isRangeCached(startTime, endTime)) {
      console.log('弹幕数据已缓存，跳过请求:', startTime, '-', endTime)
      return
    }
    
    if (isLoading.value) return
    
    isLoading.value = true
    error.value = null
    
    try {
      console.log('请求弹幕数据:', startTime, '-', endTime)
      
      // 计算需要加载的页数（每页100条）
      const pageSize = 100
      let page = 1
      let hasMore = true
      const newDanmakus: Danmaku[] = []
      
      while (hasMore && newDanmakus.length < 500) {
        const response = await danmakuAPI.getDanmakus(videoId, page, pageSize)

        console.log('API原始响应:', response)

        if (response.danmakus && response.danmakus.length > 0) {
          console.log(`获取到 ${response.danmakus.length} 条弹幕，时间范围 ${startTime}-${endTime}`)
          // 过滤在时间段内的弹幕
          const filtered = response.danmakus.filter(d =>
            d.video_timestamp >= startTime && d.video_timestamp <= endTime
          )
          console.log(`过滤后剩余 ${filtered.length} 条弹幕`)
          // 调试：打印30秒附近的弹幕
          const danmakuAt30 = response.danmakus.filter(d => Math.abs(d.video_timestamp - 30) < 5)
          if (danmakuAt30.length > 0) {
            console.log('API返回的30秒附近弹幕:', danmakuAt30)
          }
          newDanmakus.push(...filtered)

          // 如果返回的数据不足pageSize，说明没有更多数据了
          if (response.danmakus.length < pageSize) {
            hasMore = false
          }
          page++
        } else {
          console.log('API返回的弹幕为空或不存在，danmakus:', response.danmakus)
          hasMore = false
        }
      }
      
      // 添加到缓存
      cachedRanges.value.push({
        start: startTime,
        end: endTime,
        danmakus: newDanmakus
      })
      
      // 合并缓存区间
      mergeCacheRanges()
      
      // 更新总列表
      const danmakuMap = new Map<number, Danmaku>()
      allDanmakus.value.forEach(d => danmakuMap.set(d.id, d))
      newDanmakus.forEach(d => danmakuMap.set(d.id, d))
      allDanmakus.value = Array.from(danmakuMap.values())
        .sort((a, b) => a.video_timestamp - b.video_timestamp)
      
      console.log('弹幕数据加载完成，当前总数:', allDanmakus.value.length)
      
    } catch (err) {
      console.error('加载弹幕失败:', err)
      error.value = '加载弹幕失败'
    } finally {
      isLoading.value = false
    }
  }
  
  // 根据视频时间获取应显示的弹幕
  const getDanmakusForTime = (currentTime: number): Danmaku[] => {
    // 从缓存中获取该时间段的弹幕
    const timeWindow = 0.5 // 0.5秒时间窗口
    return allDanmakus.value.filter(d => 
      d.video_timestamp >= currentTime - timeWindow && 
      d.video_timestamp <= currentTime + timeWindow
    )
  }
  
  // 预加载检查
  const checkPreload = (currentTime: number) => {
    const preloadStart = currentTime
    const preloadEnd = currentTime + CACHE_AHEAD
    
    if (!isRangeCached(preloadStart, preloadEnd)) {
      loadDanmakus(preloadStart, preloadEnd)
    }
    
    // 清理过期缓存
    cleanExpiredCache(currentTime)
  }
  
  // 找到可用轨道
  const findAvailableTrack = (danmaku: Danmaku): DanmakuTrack | null => {
    const now = Date.now()
    
    for (const track of tracks.value) {
      // 轨道空闲
      if (!track.occupied) {
        return track
      }
      
      // 轨道即将空闲（2秒内）
      if (now > track.lastDanmakuEndTime - 2000) {
        return track
      }
    }
    
    return null
  }
  
  // 计算弹幕速度
  const calculateSpeed = (danmaku: Danmaku, containerWidth: number): number => {
    const speedMap: Record<string, number> = {
      'slow': 50,    // 50px/s
      'normal': 100, // 100px/s
      'fast': 150    // 150px/s
    }
    return speedMap[danmaku.speed] || speedMap['normal']
  }
  
  // 创建弹幕元素
  const createDanmakuElement = (danmaku: Danmaku, track: DanmakuTrack): DisplayDanmaku | null => {
    if (!videoElement) return null
    
    const containerWidth = videoElement.clientWidth || 640
    const speed = calculateSpeed(danmaku, containerWidth)
    
    // 计算文字宽度
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.font = `${config.value.fontSize}px Arial`
      const textWidth = ctx.measureText(danmaku.text).width
      
      return {
        ...danmaku,
        top: track.y,
        left: containerWidth,
        width: textWidth,
        speed: speed,
        isVisible: true
      }
    }
    
    return null
  }
  
  // 显示弹幕
  const showDanmaku = (danmaku: Danmaku) => {
    if (!config.value.enabled) return
    
    // 过滤检查
    if (config.value.filterKeywords.some(keyword => 
      danmaku.text.includes(keyword)
    )) return
    
    if (config.value.blockedUsers.includes(danmaku.user_id)) return
    
    // 密度检查
    if (displayDanmakus.value.length >= config.value.density) return
    
    // 找到可用轨道
    const track = findAvailableTrack(danmaku)
    if (!track) return
    
    // 创建弹幕元素
    const displayDanmaku = createDanmakuElement(danmaku, track)
    if (!displayDanmaku) return
    
    // 标记轨道占用
    track.occupied = true
    const duration = (displayDanmaku.left + displayDanmaku.width) / displayDanmaku.speed * 1000
    track.lastDanmakuEndTime = Date.now() + duration
    
    // 添加到显示列表
    displayDanmakus.value.push(displayDanmaku)
    
    // 动画结束后释放
    setTimeout(() => {
      const index = displayDanmakus.value.findIndex(d => d.id === danmaku.id)
      if (index > -1) {
        displayDanmakus.value.splice(index, 1)
      }
      track.occupied = false
    }, duration)
  }
  
  // 更新弹幕位置（每帧调用）
  const updateDanmakuPositions = (deltaTime: number) => {
    displayDanmakus.value.forEach(danmaku => {
      // 更新位置
      danmaku.left -= danmaku.speed * deltaTime
    })
    
    // 移除已经移出屏幕的弹幕
    displayDanmakus.value = displayDanmakus.value.filter(d => 
      d.left + d.width > -100
    )
  }
  
  // 清空显示
  const clearDisplay = () => {
    displayDanmakus.value = []
    tracks.value.forEach(track => {
      track.occupied = false
      track.lastDanmakuEndTime = 0
    })
  }
  
  // 切换弹幕开关
  const toggleDanmaku = (enabled?: boolean) => {
    if (enabled !== undefined) {
      config.value.enabled = enabled
    } else {
      config.value.enabled = !config.value.enabled
    }
    
    if (!config.value.enabled) {
      clearDisplay()
    }
  }
  
  // 设置配置
  const setConfig = (newConfig: Partial<typeof config.value>) => {
    Object.assign(config.value, newConfig)
  }
  
  // 初始化
  const init = () => {
    initTracks()
    // 加载初始弹幕（前60秒）
    loadDanmakus(0, CACHE_AHEAD)
  }
  
  // 销毁
  onUnmounted(() => {
    clearDisplay()
    allDanmakus.value = []
    cachedRanges.value = []
  })
  
  return {
    // 状态
    allDanmakus,
    displayDanmakus,
    isLoading,
    error,
    totalCount,
    config,
    tracks,
    
    // 方法
    init,
    loadDanmakus,
    getDanmakusForTime,
    checkPreload,
    showDanmaku,
    updateDanmakuPositions,
    clearDisplay,
    toggleDanmaku,
    setConfig,
    isRangeCached
  }
}
