/**
 * 视频分析统计组合式函数
 * 集成播放量统计、观看进度追踪、完播检测
 * 
 * 功能：
 * 1. 自动记录视频播放（用户点击播放时触发）
 * 2. 定时上报观看进度
 * 3. 检测完整观看
 * 4. 防刷机制（设备ID、会话ID去重）
 */

import { ref, onUnmounted, type Ref } from 'vue'
import { playCountAPI, retryRequest } from '@/api/playCount'
import { sessionManager, getViewSource, isNewSession, getDeviceInfo } from '@/utils/device'
import type { SessionInfo } from '@/types/playCount'

export interface UseVideoAnalyticsOptions {
  videoId: Ref<string | number>
  videoElement: Ref<HTMLVideoElement | null>
  onPlayRecorded?: () => void
  onProgressReported?: (progress: number) => void
  onCompleteWatch?: () => void
}

export interface UseVideoAnalyticsReturn {
  // 状态
  isPlayRecorded: Ref<boolean>
  isCompleteWatch: Ref<boolean>
  currentProgress: Ref<number>
  currentTime: Ref<number>
  sessionInfo: Ref<SessionInfo | null>
  
  // 方法
  recordPlay: () => Promise<void>
  reportProgress: (action?: string) => Promise<void>
  markComplete: () => Promise<void>
  reset: () => void
}

/**
 * 视频分析统计Hook
 * @param options 配置选项
 * @returns 统计方法和状态
 */
export function useVideoAnalytics(options: UseVideoAnalyticsOptions): UseVideoAnalyticsReturn {
  const { videoId, videoElement, onPlayRecorded, onProgressReported, onCompleteWatch } = options
  
  // 状态
  const isPlayRecorded = ref(false)
  const isCompleteWatch = ref(false)
  const currentProgress = ref(0)
  const currentTime = ref(0)
  const sessionInfo = ref<SessionInfo | null>(null)
  
  // 内部状态
  let progressReportTimer: ReturnType<typeof setInterval> | null = null
  let lastReportedProgress = 0
  let isRecording = false
  let hasStartedPlaying = false
  
  // 配置
  const PROGRESS_REPORT_INTERVAL = 30000 // 30秒上报一次
  const MIN_WATCH_TIME_FOR_VALID_PLAY = 5 // 至少观看5秒才算有效播放
  const COMPLETE_WATCH_THRESHOLD = 0.9 // 观看90%算完整观看
  const MAX_RETRY_COUNT = 3
  const RETRY_DELAY = 1000
  
  /**
   * 记录播放
   * 用户点击播放时调用，防刷机制确保同一设备同一天只记录一次
   */
  const recordPlay = async (): Promise<void> => {
    // 防止重复记录
    if (isPlayRecorded.value || isRecording) {
      console.log('[播放量统计] 播放已记录或正在记录中，跳过')
      return
    }
    
    // 检查是否是新会话
    if (!isNewSession(videoId.value)) {
      const existingSession = sessionManager.getSession(videoId.value)
      if (existingSession?.isPlayRecorded) {
        console.log('[播放量统计] 同一会话内已记录播放，跳过')
        sessionInfo.value = existingSession
        isPlayRecorded.value = true
        return
      }
    }
    
    isRecording = true
    
    try {
      // 创建新会话
      const session = sessionManager.createSession(videoId.value)
      sessionInfo.value = session
      
      console.log('[播放量统计] 开始记录播放:', {
        videoId: videoId.value,
        sessionId: session.sessionId,
        deviceId: session.deviceId,
        viewSource: getViewSource()
      })
      
      // 调用API记录播放
      const response = await retryRequest(
        () => playCountAPI.recordPlay({
          video_id: videoId.value,
          session_id: session.sessionId,
          device_id: session.deviceId,
          view_source: getViewSource()
        }),
        MAX_RETRY_COUNT,
        RETRY_DELAY
      )
      
      if (response.data?.code === 0) {
        isPlayRecorded.value = true
        session.isPlayRecorded = true
        sessionManager.updateSession(session.sessionId, { isPlayRecorded: true })
        
        console.log('[播放量统计] 播放记录成功:', response.data.data)
        onPlayRecorded?.()
        
        // 开始定时上报进度
        startProgressReporting()
      }
    } catch (error) {
      console.error('[播放量统计] 记录播放失败:', error)
    } finally {
      isRecording = false
    }
  }
  
  /**
   * 上报观看进度
   * 定时调用，用于计算观看时长和完播率
   */
  const reportProgress = async (action: string = 'play'): Promise<void> => {
    if (!sessionInfo.value) {
      console.warn('[播放量统计] 无会话信息，无法上报进度')
      return
    }
    
    const video = videoElement.value
    if (!video) return
    
    // 更新当前进度
    currentTime.value = video.currentTime
    const duration = video.duration || 0
    currentProgress.value = duration > 0 ? currentTime.value / duration : 0
    
    // 进度没有显著变化时不重复上报（变化小于5%）
    if (Math.abs(currentProgress.value - lastReportedProgress) < 0.05) {
      return
    }
    
    try {
      const response = await retryRequest(
        () => playCountAPI.reportProgress({
          video_id: videoId.value,
          session_id: sessionInfo.value!.sessionId,
          current_time: Math.floor(currentTime.value),
          progress: currentProgress.value,
          action: action as 'play' | 'pause' | 'seek' | 'complete' | 'buffer'
        }),
        2,
        RETRY_DELAY
      )
      
      if (response.data?.code === 0) {
        lastReportedProgress = currentProgress.value
        sessionManager.updateSession(sessionInfo.value.sessionId, {
          lastReportTime: Date.now()
        })
        
        console.log('[播放量统计] 进度上报成功:', {
          progress: currentProgress.value,
          time: currentTime.value
        })
        onProgressReported?.(currentProgress.value)
        
        // 检查是否完整观看
        const responseData = response.data?.data as { is_complete?: boolean } | undefined
        if (responseData?.is_complete && !isCompleteWatch.value) {
          isCompleteWatch.value = true
          onCompleteWatch?.()
        }
      }
    } catch (error) {
      console.error('[播放量统计] 上报进度失败:', error)
    }
  }
  
  /**
   * 标记完整观看
   * 视频播放结束时调用
   */
  const markComplete = async (): Promise<void> => {
    if (!sessionInfo.value || isCompleteWatch.value) {
      console.log('[播放量统计] 无需标记完整观看')
      return
    }
    
    try {
      await reportProgress('complete')
      
      // 本地判断是否完整观看
      if (currentProgress.value >= COMPLETE_WATCH_THRESHOLD) {
        isCompleteWatch.value = true
        console.log('[播放量统计] 标记完整观看成功')
        onCompleteWatch?.()
      }
    } catch (error) {
      console.error('[播放量统计] 标记完整观看失败:', error)
    }
  }
  
  /**
   * 开始定时上报进度
   */
  const startProgressReporting = (): void => {
    if (progressReportTimer) {
      clearInterval(progressReportTimer)
    }
    
    progressReportTimer = setInterval(() => {
      if (isPlayRecorded.value && currentProgress.value > 0) {
        reportProgress('play')
      }
    }, PROGRESS_REPORT_INTERVAL)
    
    console.log('[播放量统计] 开始定时上报进度，间隔:', PROGRESS_REPORT_INTERVAL, 'ms')
  }
  
  /**
   * 停止定时上报
   */
  const stopProgressReporting = (): void => {
    if (progressReportTimer) {
      clearInterval(progressReportTimer)
      progressReportTimer = null
      console.log('[播放量统计] 停止定时上报进度')
    }
  }
  
  /**
   * 重置状态
   * 切换视频时调用
   */
  const reset = (): void => {
    stopProgressReporting()
    isPlayRecorded.value = false
    isCompleteWatch.value = false
    currentProgress.value = 0
    currentTime.value = 0
    lastReportedProgress = 0
    sessionInfo.value = null
    isRecording = false
    hasStartedPlaying = false
    console.log('[播放量统计] 状态已重置')
  }
  
  // 组件卸载时清理
  onUnmounted(() => {
    stopProgressReporting()
  })
  
  return {
    // 状态
    isPlayRecorded,
    isCompleteWatch,
    currentProgress,
    currentTime,
    sessionInfo,
    
    // 方法
    recordPlay,
    reportProgress,
    markComplete,
    reset
  }
}
