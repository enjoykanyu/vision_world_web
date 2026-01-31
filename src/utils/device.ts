/**
 * 设备ID和会话管理工具
 * 用于播放量统计的去重和用户追踪
 */

import type { DeviceInfo, SessionInfo } from '@/types/playCount'

const DEVICE_ID_KEY = 'vw_device_id'
const SESSION_PREFIX = 'vw_session_'

/**
 * 生成唯一ID
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * 生成短ID（用于会话ID）
 */
export function generateShortId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

/**
 * 获取或创建设备ID
 * 设备ID用于未登录用户的去重
 */
export function getDeviceId(): string {
  // 优先从 localStorage 获取
  let deviceId = localStorage.getItem(DEVICE_ID_KEY)
  
  if (!deviceId) {
    // 从 sessionStorage 获取（用于隐私模式）
    deviceId = sessionStorage.getItem(DEVICE_ID_KEY)
  }
  
  if (!deviceId) {
    // 生成新的设备ID
    deviceId = generateUUID()
    
    // 尝试存储到 localStorage
    try {
      localStorage.setItem(DEVICE_ID_KEY, deviceId)
    } catch (e) {
      // 隐私模式下使用 sessionStorage
      sessionStorage.setItem(DEVICE_ID_KEY, deviceId)
    }
  }
  
  return deviceId
}

/**
 * 获取设备信息
 */
export function getDeviceInfo(): DeviceInfo {
  const ua = navigator.userAgent
  
  // 检测浏览器
  let browser = 'Unknown'
  if (ua.includes('Chrome')) browser = 'Chrome'
  else if (ua.includes('Firefox')) browser = 'Firefox'
  else if (ua.includes('Safari')) browser = 'Safari'
  else if (ua.includes('Edge')) browser = 'Edge'
  else if (ua.includes('Opera')) browser = 'Opera'
  
  // 检测平台
  let platform = 'Unknown'
  if (ua.includes('Windows')) platform = 'Windows'
  else if (ua.includes('Mac')) platform = 'MacOS'
  else if (ua.includes('Linux')) platform = 'Linux'
  else if (ua.includes('Android')) platform = 'Android'
  else if (ua.includes('iPhone') || ua.includes('iPad')) platform = 'iOS'
  
  return {
    deviceId: getDeviceId(),
    userAgent: ua,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    platform,
    browser
  }
}

/**
 * 会话管理器
 * 管理视频播放会话
 */
export const sessionManager = {
  /**
   * 创建新会话
   */
  createSession(videoId: number | string): SessionInfo {
    const sessionId = generateShortId()
    const now = Date.now()
    
    const session: SessionInfo = {
      sessionId,
      deviceId: getDeviceId(),
      videoId,
      startTime: now,
      lastReportTime: now,
      isPlayRecorded: false
    }
    
    // 存储到 sessionStorage
    sessionStorage.setItem(
      `${SESSION_PREFIX}${videoId}`,
      JSON.stringify(session)
    )
    
    return session
  },
  
  /**
   * 获取会话
   */
  getSession(videoId: number | string): SessionInfo | null {
    const data = sessionStorage.getItem(`${SESSION_PREFIX}${videoId}`)
    if (data) {
      try {
        return JSON.parse(data) as SessionInfo
      } catch (e) {
        console.error('解析会话信息失败:', e)
        return null
      }
    }
    return null
  },
  
  /**
   * 更新会话
   */
  updateSession(sessionId: string, updates: Partial<SessionInfo>): void {
    // 遍历所有会话找到匹配的 sessionId
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      if (key && key.startsWith(SESSION_PREFIX)) {
        const data = sessionStorage.getItem(key)
        if (data) {
          try {
            const session: SessionInfo = JSON.parse(data)
            if (session.sessionId === sessionId) {
              const updatedSession = { ...session, ...updates }
              sessionStorage.setItem(key, JSON.stringify(updatedSession))
              break
            }
          } catch (e) {
            console.error('更新会话失败:', e)
          }
        }
      }
    }
  },
  
  /**
   * 标记播放已记录
   */
  markPlayRecorded(videoId: number | string): void {
    const session = this.getSession(videoId)
    if (session) {
      session.isPlayRecorded = true
      sessionStorage.setItem(
        `${SESSION_PREFIX}${videoId}`,
        JSON.stringify(session)
      )
    }
  },
  
  /**
   * 清除会话
   */
  clearSession(videoId: number | string): void {
    sessionStorage.removeItem(`${SESSION_PREFIX}${videoId}`)
  },
  
  /**
   * 清除所有会话
   */
  clearAllSessions(): void {
    const keysToRemove: string[] = []
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      if (key && key.startsWith(SESSION_PREFIX)) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(key => sessionStorage.removeItem(key))
  }
}

/**
 * 获取观看来源
 * 根据当前页面路由判断
 */
export function getViewSource(): string {
  const path = window.location.pathname
  const referrer = document.referrer
  
  if (path.includes('/search')) return 'search'
  if (path.includes('/follow')) return 'follow'
  if (referrer.includes('/search')) return 'search'
  if (referrer.includes('/follow')) return 'follow'
  if (referrer.includes('/home') || referrer.includes('/index')) return 'home'
  
  return 'recommend'
}

/**
 * 检查是否是新会话
 * 用于判断是否需要记录播放
 */
export function isNewSession(videoId: number | string): boolean {
  const session = sessionManager.getSession(videoId)
  if (!session) return true
  
  // 会话超过24小时视为新会话
  const now = Date.now()
  const sessionAge = now - session.startTime
  const ONE_DAY = 24 * 60 * 60 * 1000
  
  return sessionAge > ONE_DAY
}
