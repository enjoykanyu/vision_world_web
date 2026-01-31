/**
 * 播放量统计API服务
 * 对应功能一：视频播放量统计技术文档
 */

import { http } from '@/utils/request'
import type {
  RecordPlayRequest,
  RecordPlayResponse,
  ReportProgressRequest,
  ReportProgressResponse,
  VideoPlayStats
} from '@/types/playCount'

/**
 * 播放量统计相关API
 */
export const playCountAPI = {
  /**
   * 记录视频播放
   * 用户点击播放时调用，用于统计播放量
   * @param params 播放记录参数
   * @returns 播放记录响应
   */
  recordPlay(params: RecordPlayRequest) {
    return http.post<RecordPlayResponse>('/api/video/play', {
      video_id: params.video_id,
      session_id: params.session_id,
      device_id: params.device_id,
      view_source: params.view_source || 'recommend',
      timestamp: params.timestamp || Date.now()
    })
  },

  /**
   * 上报观看进度
   * 定时上报观看进度，用于计算观看时长和完播率
   * @param params 进度上报参数
   * @returns 进度上报响应
   */
  reportProgress(params: ReportProgressRequest) {
    return http.post<ReportProgressResponse>('/api/video/progress', {
      video_id: params.video_id,
      session_id: params.session_id,
      current_time: params.current_time,
      progress: params.progress,
      action: params.action,
      timestamp: params.timestamp || Date.now()
    })
  },

  /**
   * 获取视频播放统计
   * @param videoId 视频ID
   * @returns 视频播放统计信息
   */
  getVideoPlayStats(videoId: number | string) {
    return http.get<{ code: number; message: string; data: VideoPlayStats }>(
      `/api/video/${videoId}/stats`
    )
  },

  /**
   * 批量获取视频播放统计
   * @param videoIds 视频ID数组
   * @returns 视频播放统计信息数组
   */
  getBatchVideoPlayStats(videoIds: (number | string)[]) {
    return http.post<{ code: number; message: string; data: VideoPlayStats[] }>(
      '/api/videos/stats/batch',
      { video_ids: videoIds }
    )
  }
}

/**
 * 带重试的请求封装
 * @param requestFn 请求函数
 * @param maxRetries 最大重试次数
 * @param delay 重试延迟（毫秒）
 * @returns 请求结果
 */
export async function retryRequest<T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error | null = null
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn()
    } catch (error) {
      lastError = error as Error
      
      if (attempt < maxRetries) {
        console.warn(`请求失败，${delay}ms后重试 (${attempt + 1}/${maxRetries}):`, error)
        await new Promise(resolve => setTimeout(resolve, delay))
        // 指数退避
        delay *= 2
      }
    }
  }
  
  throw lastError
}

/**
 * 防抖函数
 * 用于限制频繁触发的事件
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null
  
  return function (this: any, ...args: Parameters<T>) {
    if (timer) {
      clearTimeout(timer)
    }
    
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}

/**
 * 节流函数
 * 用于限制请求频率
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false
  
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      fn.apply(this, args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}
