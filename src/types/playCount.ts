/**
 * 播放量统计类型定义
 * 对应功能一：视频播放量统计技术文档
 */

// 播放记录请求参数
export interface RecordPlayRequest {
  video_id: number | string
  session_id: string
  device_id: string
  view_source?: string // 观看来源: recommend, search, follow, home
  timestamp?: number
}

// 播放记录响应
export interface RecordPlayResponse {
  code: number
  message: string
  data?: {
    play_count: number
    is_new_play: boolean // 是否为新播放（去重后）
  }
}

// 观看进度上报请求
export interface ReportProgressRequest {
  video_id: number | string
  session_id: string
  current_time: number // 当前播放时间（秒）
  progress: number // 观看进度（0-1）
  action: 'play' | 'pause' | 'seek' | 'complete' | 'buffer'
  timestamp?: number
}

// 观看进度响应
export interface ReportProgressResponse {
  code: number
  message: string
  data?: {
    is_complete: boolean // 是否标记为完整观看
  }
}

// 视频播放统计信息
export interface VideoPlayStats {
  video_id: number | string
  play_count: number
  real_play_count: number // 去重后的真实播放数
  avg_watch_time: number // 平均观看时长（秒）
  complete_rate: number // 完播率（0-1）
  today_play_count?: number // 今日播放数
}

// 会话信息
export interface SessionInfo {
  sessionId: string
  deviceId: string
  videoId: number | string
  startTime: number
  lastReportTime: number
  isPlayRecorded: boolean // 是否已记录播放
}

// 设备信息
export interface DeviceInfo {
  deviceId: string
  userAgent: string
  screenResolution: string
  platform: string
  browser: string
}

// 播放事件类型
export type PlayEventType = 
  | 'play_start'      // 开始播放
  | 'play_pause'      // 暂停
  | 'play_resume'     // 恢复播放
  | 'play_seek'       // 拖动进度
  | 'play_complete'   // 播放完成
  | 'play_buffer'     // 缓冲
  | 'play_error'      // 播放错误
  | 'play_exit'       // 退出播放

// 播放事件
export interface PlayEvent {
  type: PlayEventType
  videoId: number | string
  sessionId: string
  timestamp: number
  currentTime?: number
  progress?: number
  duration?: number
  metadata?: Record<string, any>
}

// 播放配置
export interface PlayCountConfig {
  // 进度上报间隔（毫秒）
  progressReportInterval: number
  // 视为有效播放的最小观看时长（秒）
  minWatchTimeForValidPlay: number
  // 视为完整观看的进度阈值（0-1）
  completeWatchThreshold: number
  // 最大重试次数
  maxRetryCount: number
  // 重试延迟（毫秒）
  retryDelay: number
}

// 默认配置
export const DEFAULT_PLAY_COUNT_CONFIG: PlayCountConfig = {
  progressReportInterval: 30000, // 30秒上报一次
  minWatchTimeForValidPlay: 5,   // 至少观看5秒才算有效播放
  completeWatchThreshold: 0.9,   // 观看90%算完整观看
  maxRetryCount: 3,
  retryDelay: 1000
}
