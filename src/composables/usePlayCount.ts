/**
 * 播放量统计组合式函数
 * 对应功能一：视频播放量统计技术文档
 * 
 * 功能：
 * 1. 自动记录视频播放
 * 2. 定时上报观看进度
 * 3. 检测完整观看
 * 4. 防刷机制
 */

import { ref, onUnmounted, type Ref } from 'vue'
import { playCountAPI, retryRequest } from '@/api/playCount'
import { sessionManager, getViewSource, isNewSession } from '@/utils/device'
import type { 
  SessionInfo, 
  PlayCountConfig, 
  PlayEvent,
  PlayEventType 
} from '@/types/playCount'
import { DEFAULT_PLAY_COUNT_CONFIG } from '@/types/playCount'

export interface UsePlayCountOptions {
  videoId: number | string
  config?: Partial<PlayCountConfig>
  onPlayRecorded?: () => void
  onProgressReported?: (progress: number) => void
  onCompleteWatch?: () => void
}

export interface UsePlayCountReturn {
  // 状态
  isPlayRecorded: Ref<boolean>
  isCompleteWatch: Ref<boolean>
  currentProgress: Ref<number>
  currentTime: Ref<number>
  sessionInfo: Ref<SessionInfo | null>
  
  // 方法
  recordPlay: () => Promise<void>
  reportProgress: (action?: PlayEventType) => Promise<void>
  updateProgress: (currentTime: number, duration: number) => void
  markComplete: () => Promise<void>
  reset: () => void
}

/**
 * 播放量统计Hook
 * @param options 配置选项
 * @returns 播放量统计方法和状态
 */
export function usePlayCount(options: UsePlayCountOptions): UsePlayCountReturn {
  const { videoId, config: userConfig, onPlayRecorded, onProgressReported, onCompleteWatch } = options
  
  // 合并配置
  const config = { ...DEFAULT_PLAY_COUNT_CONFIG, ...userConfig }
  
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
  
  /**
   * 记录播放
   * 用户点击播放时调用
   */
  const recordPlay = async (): Promise<void> => {
    // 防止重复记录
    if (isPlayRecorded.value || isRecording) {
      console.log('播放已记录，跳过')
      return
    }
    
    // 检查是否是新会话
    if (!isNewSession(videoId)) {
      const existingSession = sessionManager.getSession(videoId)
      if (existingSession?.isPlayRecorded) {
        console.log('同一会话内已记录播放，跳过')
        sessionInfo.value = existingSession
        isPlayRecorded.value = true
        return
      }
    }
    
    isRecording = true
    
    try {
      // 创建新会话
      const session = sessionManager.createSession(videoId)
      sessionInfo.value = session
      
      // 调用API记录播放
      const response = await retryRequest(
        () => playCountAPI.recordPlay({
          video_id: videoId,
          session_id: session.sessionId,
          device_id: session.deviceId,
          view_source: getViewSource()
        }),
        config.maxRetryCount,
        config.retryDelay
      )
      
      if (response.data?.code === 0) {
        isPlayRecorded.value = true
        session.isPlayRecorded = true
        sessionManager.updateSession(session.sessionId, { isPlayRecorded: true })
        
        console.log('播放记录成功:', response.data.data)
        onPlayRecorded?.()
        
        // 开始定时上报进度
        startProgressReporting()
      }
    } catch (error) {
      console.error('记录播放失败:', error)
    } finally {
      isRecording = false
    }
  }
  
  /**
   * 上报观看进度
   */
  const reportProgress = async (action: PlayEventType = 'play_start'): Promise<void> => {
    if (!sessionInfo.value) {
      console.warn('无会话信息，无法上报进度')
      return
    }
    
    // 进度没有变化时不重复上报
    if (Math.abs(currentProgress.value - lastReportedProgress) < 0.05) {
      return
    }
    
    try {
      const mappedAction = mapEventTypeToAction(action)
      const response = await retryRequest(
        () => playCountAPI.reportProgress({
          video_id: videoId,
          session_id: sessionInfo.value!.sessionId,
          current_time: Math.floor(currentTime.value),
          progress: currentProgress.value,
          action: mappedAction as 'play' | 'pause' | 'seek' | 'complete' | 'buffer'
        }),
        2,
        config.retryDelay
      )
      
      if (response.data?.code === 0) {
        lastReportedProgress = currentProgress.value
        sessionManager.updateSession(sessionInfo.value.sessionId, {
          lastReportTime: Date.now()
        })
        
        console.log('进度上报成功:', currentProgress.value)
        onProgressReported?.(currentProgress.value)
        
        // 检查是否完整观看
        const responseData = response.data?.data as { is_complete?: boolean } | undefined
        if (responseData?.is_complete && !isCompleteWatch.value) {
          isCompleteWatch.value = true
          onCompleteWatch?.()
        }
      }
    } catch (error) {
      console.error('上报进度失败:', error)
    }
  }
  
  /**
   * 更新进度
   * 由视频播放器调用
   */
  const updateProgress = (time: number, duration: number): void => {
    currentTime.value = time
    currentProgress.value = duration > 0 ? time / duration : 0
  }
  
  /**
   * 标记完整观看
   */
  const markComplete = async (): Promise<void> => {
    if (!sessionInfo.value || isCompleteWatch.value) return
    
    try {
      await reportProgress('play_complete')
      isCompleteWatch.value = true
      onCompleteWatch?.()
    } catch (error) {
      console.error('标记完整观看失败:', error)
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
        reportProgress('play_start')
      }
    }, config.progressReportInterval)
  }
  
  /**
   * 停止定时上报
   */
  const stopProgressReporting = (): void => {
    if (progressReportTimer) {
      clearInterval(progressReportTimer)
      progressReportTimer = null
    }
  }
  
  /**
   * 重置状态
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
  }
  
  /**
   * 事件类型映射
   */
  const mapEventTypeToAction = (eventType: PlayEventType): string => {
    const mapping: Record<PlayEventType, string> = {
      'play_start': 'play',
      'play_pause': 'pause',
      'play_resume': 'play',
      'play_seek': 'seek',
      'play_complete': 'complete',
      'play_buffer': 'buffer',
      'play_error': 'pause',
      'play_exit': 'pause'
    }
    return mapping[eventType] || 'play'
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
    updateProgress,
    markComplete,
    reset
  }
}
