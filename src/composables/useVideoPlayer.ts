/**
 * 视频播放器组合式函数
 * 集成播放量统计功能
 * 
 * 功能：
 * 1. 视频播放控制
 * 2. 自动记录播放量
 * 3. 观看进度追踪
 * 4. 完整观看检测
 */

import { ref, computed, onUnmounted, watch, type Ref } from 'vue'
import { usePlayCount, type UsePlayCountOptions } from './usePlayCount'
import type { PlayEventType } from '@/types/playCount'

export interface UseVideoPlayerOptions {
  videoId: number | string
  videoElement: Ref<HTMLVideoElement | null>
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
  onTimeUpdate?: (currentTime: number, duration: number) => void
  onError?: (error: Error) => void
  playCountOptions?: Partial<UsePlayCountOptions>
}

export interface UseVideoPlayerReturn {
  // 播放状态
  isPlaying: Ref<boolean>
  isPaused: Ref<boolean>
  isEnded: Ref<boolean>
  isLoading: Ref<boolean>
  currentTime: Ref<number>
  duration: Ref<number>
  progress: Ref<number>
  buffered: Ref<number>
  volume: Ref<number>
  isMuted: Ref<boolean>
  playbackRate: Ref<number>
  
  // 播放量统计状态
  isPlayRecorded: Ref<boolean>
  isCompleteWatch: Ref<boolean>
  watchProgress: Ref<number>
  
  // 控制方法
  play: () => Promise<void>
  pause: () => void
  togglePlay: () => Promise<void>
  seek: (time: number) => void
  setVolume: (value: number) => void
  toggleMute: () => void
  setPlaybackRate: (rate: number) => void
  
  // 格式化方法
  formatTime: (seconds: number) => string
}

/**
 * 视频播放器Hook
 * @param options 配置选项
 * @returns 播放器控制方法和状态
 */
export function useVideoPlayer(options: UseVideoPlayerOptions): UseVideoPlayerReturn {
  const { 
    videoId, 
    videoElement, 
    onPlay, 
    onPause, 
    onEnded, 
    onTimeUpdate, 
    onError,
    playCountOptions 
  } = options

  // 播放器状态
  const isPlaying = ref(false)
  const isPaused = ref(false)
  const isEnded = ref(false)
  const isLoading = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const progress = ref(0)
  const buffered = ref(0)
  const volume = ref(1)
  const isMuted = ref(false)
  const playbackRate = ref(1)
  
  // 内部状态
  let hasPlayed = false
  let progressTimer: ReturnType<typeof setInterval> | null = null

  // 初始化播放量统计
  const playCount = usePlayCount({
    videoId,
    ...playCountOptions,
    onPlayRecorded: () => {
      console.log('播放量已记录')
      playCountOptions?.onPlayRecorded?.()
    },
    onProgressReported: (p) => {
      console.log('进度已上报:', p)
      playCountOptions?.onProgressReported?.(p)
    },
    onCompleteWatch: () => {
      console.log('完整观看')
      playCountOptions?.onCompleteWatch?.()
    }
  })

  /**
   * 播放视频
   */
  const play = async (): Promise<void> => {
    const video = videoElement.value
    if (!video) return

    try {
      // 首次播放时记录播放量
      if (!hasPlayed) {
        await playCount.recordPlay()
        hasPlayed = true
      }

      await video.play()
      isPlaying.value = true
      isPaused.value = false
      isEnded.value = false
      
      // 开始进度追踪
      startProgressTracking()
      
      onPlay?.()
    } catch (error) {
      console.error('播放失败:', error)
      onError?.(error as Error)
    }
  }

  /**
   * 暂停视频
   */
  const pause = (): void => {
    const video = videoElement.value
    if (!video) return

    video.pause()
    isPlaying.value = false
    isPaused.value = true
    
    // 停止进度追踪
    stopProgressTracking()
    
    // 上报暂停事件
    playCount.reportProgress('play_pause')
    
    onPause?.()
  }

  /**
   * 切换播放/暂停
   */
  const togglePlay = async (): Promise<void> => {
    if (isPlaying.value) {
      pause()
    } else {
      await play()
    }
  }

  /**
   * 跳转到指定时间
   */
  const seek = (time: number): void => {
    const video = videoElement.value
    if (!video) return

    const clampedTime = Math.max(0, Math.min(time, duration.value))
    video.currentTime = clampedTime
    currentTime.value = clampedTime
    progress.value = duration.value > 0 ? clampedTime / duration.value : 0
    
    // 上报拖动事件
    playCount.reportProgress('play_seek')
  }

  /**
   * 设置音量
   */
  const setVolume = (value: number): void => {
    const video = videoElement.value
    if (!video) return

    const clampedValue = Math.max(0, Math.min(1, value))
    video.volume = clampedValue
    volume.value = clampedValue
    
    if (clampedValue > 0 && isMuted.value) {
      isMuted.value = false
      video.muted = false
    }
  }

  /**
   * 切换静音
   */
  const toggleMute = (): void => {
    const video = videoElement.value
    if (!video) return

    isMuted.value = !isMuted.value
    video.muted = isMuted.value
  }

  /**
   * 设置播放速度
   */
  const setPlaybackRate = (rate: number): void => {
    const video = videoElement.value
    if (!video) return

    video.playbackRate = rate
    playbackRate.value = rate
  }

  /**
   * 格式化时间
   */
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return '00:00'
    
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  /**
   * 开始进度追踪
   */
  const startProgressTracking = (): void => {
    if (progressTimer) {
      clearInterval(progressTimer)
    }

    progressTimer = setInterval(() => {
      const video = videoElement.value
      if (!video) return

      currentTime.value = video.currentTime
      duration.value = video.duration || 0
      progress.value = duration.value > 0 ? currentTime.value / duration.value : 0
      
      // 更新播放量统计的进度
      playCount.updateProgress(currentTime.value, duration.value)
      
      // 回调
      onTimeUpdate?.(currentTime.value, duration.value)
    }, 1000)
  }

  /**
   * 停止进度追踪
   */
  const stopProgressTracking = (): void => {
    if (progressTimer) {
      clearInterval(progressTimer)
      progressTimer = null
    }
  }

  /**
   * 视频事件处理
   */
  const setupVideoEvents = (): void => {
    const video = videoElement.value
    if (!video) return

    // 播放事件
    video.addEventListener('play', () => {
      isPlaying.value = true
      isPaused.value = false
      startProgressTracking()
    })

    // 暂停事件
    video.addEventListener('pause', () => {
      isPlaying.value = false
      isPaused.value = true
      stopProgressTracking()
    })

    // 结束事件
    video.addEventListener('ended', () => {
      isPlaying.value = false
      isEnded.value = true
      stopProgressTracking()
      
      // 标记完整观看
      playCount.markComplete()
      
      onEnded?.()
    })

    // 时间更新事件
    video.addEventListener('timeupdate', () => {
      currentTime.value = video.currentTime
      duration.value = video.duration || 0
      progress.value = duration.value > 0 ? currentTime.value / duration.value : 0
      
      // 更新播放量统计
      playCount.updateProgress(currentTime.value, duration.value)
    })

    // 进度事件
    video.addEventListener('progress', () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1)
        buffered.value = duration.value > 0 ? bufferedEnd / duration.value : 0
      }
    })

    // 加载事件
    video.addEventListener('waiting', () => {
      isLoading.value = true
    })

    video.addEventListener('canplay', () => {
      isLoading.value = false
    })

    // 错误事件
    video.addEventListener('error', () => {
      const error = video.error
      if (error) {
        console.error('视频播放错误:', error)
        onError?.(new Error(`视频播放错误: ${error.message}`))
      }
    })

    // 元数据加载完成
    video.addEventListener('loadedmetadata', () => {
      duration.value = video.duration || 0
    })
  }

  // 监听视频元素变化
  watch(videoElement, (newVideo) => {
    if (newVideo) {
      setupVideoEvents()
    }
  }, { immediate: true })

  // 组件卸载时清理
  onUnmounted(() => {
    stopProgressTracking()
    playCount.reset()
  })

  return {
    // 播放状态
    isPlaying,
    isPaused,
    isEnded,
    isLoading,
    currentTime,
    duration,
    progress,
    buffered,
    volume,
    isMuted,
    playbackRate,
    
    // 播放量统计状态
    isPlayRecorded: playCount.isPlayRecorded,
    isCompleteWatch: playCount.isCompleteWatch,
    watchProgress: playCount.currentProgress,
    
    // 控制方法
    play,
    pause,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    setPlaybackRate,
    
    // 格式化方法
    formatTime
  }
}
