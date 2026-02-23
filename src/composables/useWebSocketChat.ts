import { ref, computed, onUnmounted } from 'vue'
import { useUserStore } from '@/stores/userStore'

// 消息类型定义
export interface ChatMessage {
  type: 'message' | 'gift' | 'like' | 'system' | 'enter' | 'leave' | 'ping' | 'pong' | 'stream_end'
  user_id: string
  username: string
  avatar: string
  content: string
  room_id: string
  timestamp: number
  seq_id?: number
}

// WebSocket连接状态
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error'

// WebSocket配置
const WS_CONFIG = {
  url: import.meta.env.VITE_WS_URL || 'ws://localhost:8088',
  reconnectInterval: 3000,    // 重连间隔
  maxReconnectAttempts: 5,    // 最大重连次数
  heartbeatInterval: 30000,   // 心跳间隔
  messageBufferSize: 100      // 消息缓冲区大小
}

/**
 * WebSocket聊天组合式函数
 * 
 * 功能特性：
 * 1. 自动连接/重连机制
 * 2. 心跳保活
 * 3. 消息队列缓冲
 * 4. 断线消息恢复
 * 5. 弹幕渲染优化
 * 
 * 使用示例：
 * const { messages, sendMessage, onlineCount, connectionStatus } = useWebSocketChat(roomId)
 */
export function useWebSocketChat(roomId: string) {
  const userStore = useUserStore()
  
  // 状态
  const ws = ref<WebSocket | null>(null)
  const connectionStatus = ref<ConnectionStatus>('disconnected')
  const messages = ref<ChatMessage[]>([])
  const onlineCount = ref(0)
  const reconnectAttempts = ref(0)
  const messageQueue = ref<ChatMessage[]>([])
  
  // 计算属性
  const isConnected = computed(() => connectionStatus.value === 'connected')
  const sortedMessages = computed(() => {
    return [...messages.value].sort((a, b) => a.timestamp - b.timestamp)
  })
  
  // 定时器
  let heartbeatTimer: ReturnType<typeof setInterval> | null = null
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null
  
  /**
   * 建立WebSocket连接
   */
  const connect = async () => {
    if (ws.value?.readyState === WebSocket.OPEN) {
      console.log('[WebSocket] 已连接，无需重复连接')
      return
    }
    
    connectionStatus.value = 'connecting'
    
    // 等待用户信息加载（最多等待2秒）
    let waitCount = 0
    while (!userStore.userId && waitCount < 20) {
      await new Promise(resolve => setTimeout(resolve, 100))
      waitCount++
    }
    
    // 重新获取用户信息，确保是最新的
    const userId = userStore.userId?.toString() || '0'
    const username = userStore.nickname || userStore.username || '匿名用户'
    const avatar = userStore.avatarUrl || ''
    
    console.log('[WebSocket] User info after wait:', { 
      userId: userStore.userId, 
      nickname: userStore.nickname, 
      username: userStore.username,
      avatarUrl: userStore.avatarUrl,
      waitCount
    })
    
    // 构建WebSocket URL
    const wsUrl = `${WS_CONFIG.url}/ws/chat?` + 
      `room_id=${roomId}&` +
      `user_id=${userId}&` +
      `username=${encodeURIComponent(username)}&` +
      `avatar=${encodeURIComponent(avatar)}`
    
    console.log('[WebSocket] 连接中...', wsUrl)
    
    try {
      ws.value = new WebSocket(wsUrl)
      
      // 连接建立
      ws.value.onopen = () => {
        console.log('[WebSocket] 连接成功')
        connectionStatus.value = 'connected'
        reconnectAttempts.value = 0
        
        // 启动心跳
        startHeartbeat()
        
        // 发送队列中的消息
        flushMessageQueue()
      }
      
      // 接收消息
      ws.value.onmessage = (event) => {
        try {
          const message: ChatMessage = JSON.parse(event.data)
          handleMessage(message)
        } catch (error) {
          console.error('[WebSocket] 消息解析失败:', error)
        }
      }
      
      // 连接关闭
      ws.value.onclose = (event) => {
        console.log('[WebSocket] 连接关闭', event.code, event.reason)
        connectionStatus.value = 'disconnected'
        stopHeartbeat()
        
        // 非主动关闭，尝试重连
        if (!event.wasClean && reconnectAttempts.value < WS_CONFIG.maxReconnectAttempts) {
          scheduleReconnect()
        }
      }
      
      // 连接错误
      ws.value.onerror = (error) => {
        console.error('[WebSocket] 连接错误:', error)
        connectionStatus.value = 'error'
      }
      
    } catch (error) {
      console.error('[WebSocket] 创建连接失败:', error)
      connectionStatus.value = 'error'
      scheduleReconnect()
    }
  }
  
  /**
   * 处理收到的消息
   */
  const handleMessage = (message: ChatMessage) => {
    // 忽略心跳消息
    if (message.type === 'ping' || message.type === 'pong') {
      return
    }
    
    // 对系统消息（进入/退出）进行去重检查
    if (message.type === 'enter' || message.type === 'leave') {
      // 检查最近10条消息中是否已有相同的系统消息
      const recentMessages = messages.value.slice(-10)
      const isDuplicate = recentMessages.some(
        msg => msg.type === message.type && 
               msg.user_id === message.user_id &&
               Math.abs(msg.timestamp - message.timestamp) < 5000 // 5秒内重复
      )
      if (isDuplicate) {
        console.log('[WebSocket] 忽略重复的系统消息:', message)
        return
      }
    }
    
    // 添加到消息列表
    messages.value.push(message)
    
    // 限制消息数量，防止内存溢出
    if (messages.value.length > WS_CONFIG.messageBufferSize) {
      messages.value = messages.value.slice(-WS_CONFIG.messageBufferSize)
    }
  }
  
  /**
   * 发送消息
   */
  const sendMessage = (content: string, type: ChatMessage['type'] = 'message'): boolean => {
    // 每次发送时重新获取用户信息，确保是最新的
    const currentUserId = userStore.userId?.toString() || '0'
    const currentUsername = userStore.nickname || userStore.username || '匿名用户'
    const currentAvatar = userStore.avatarUrl || ''
    
    console.log('[WebSocket] sendMessage user info:', {
      userId: currentUserId,
      username: currentUsername,
      avatar: currentAvatar
    })
    
    if (!ws.value || ws.value.readyState !== WebSocket.OPEN) {
      console.warn('[WebSocket] 连接未建立，消息已缓存')
      // 缓存消息，连接成功后发送
      messageQueue.value.push({
        type,
        user_id: currentUserId,
        username: currentUsername,
        avatar: currentAvatar,
        content,
        room_id: roomId,
        timestamp: Date.now()
      })
      return false
    }
    
    const message: ChatMessage = {
      type,
      user_id: currentUserId,
      username: currentUsername,
      avatar: currentAvatar,
      content,
      room_id: roomId,
      timestamp: Date.now()
    }
    
    try {
      ws.value.send(JSON.stringify(message))
      return true
    } catch (error) {
      console.error('[WebSocket] 发送消息失败:', error)
      messageQueue.value.push(message)
      return false
    }
  }
  
  /**
   * 发送弹幕消息
   */
  const sendDanmaku = (content: string): boolean => {
    return sendMessage(content, 'message')
  }
  
  /**
   * 发送点赞
   */
  const sendLike = (): boolean => {
    return sendMessage('1', 'like')
  }
  
  /**
   * 发送礼物
   */
  const sendGift = (giftId: string, giftName: string): boolean => {
    return sendMessage(JSON.stringify({ giftId, giftName }), 'gift')
  }
  
  /**
   * 启动心跳
   */
  const startHeartbeat = () => {
    stopHeartbeat()
    heartbeatTimer = setInterval(() => {
      if (ws.value?.readyState === WebSocket.OPEN) {
        // 发送ping帧（浏览器WebSocket自动处理）
        // 这里可以发送自定义心跳消息
        ws.value.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }))
      }
    }, WS_CONFIG.heartbeatInterval)
  }
  
  /**
   * 停止心跳
   */
  const stopHeartbeat = () => {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer)
      heartbeatTimer = null
    }
  }
  
  /**
   * 计划重连
   */
  const scheduleReconnect = () => {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
    }
    
    reconnectAttempts.value++
    const delay = WS_CONFIG.reconnectInterval * reconnectAttempts.value
    
    console.log(`[WebSocket] ${delay}ms后尝试第${reconnectAttempts.value}次重连...`)
    
    reconnectTimer = setTimeout(() => {
      connect()
    }, delay)
  }
  
  /**
   * 刷新消息队列
   */
  const flushMessageQueue = () => {
    while (messageQueue.value.length > 0) {
      const message = messageQueue.value.shift()
      if (message) {
        sendMessage(message.content, message.type)
      }
    }
  }
  
  /**
   * 断开连接
   */
  const disconnect = () => {
    stopHeartbeat()
    
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
    
    if (ws.value) {
      ws.value.close(1000, '用户主动断开')
      ws.value = null
    }
    
    connectionStatus.value = 'disconnected'
  }
  
  /**
   * 清空消息
   */
  const clearMessages = () => {
    messages.value = []
  }
  
  // 组件卸载时断开连接
  onUnmounted(() => {
    disconnect()
  })
  
  return {
    // 状态
    ws,
    connectionStatus,
    isConnected,
    messages,
    sortedMessages,
    onlineCount,
    reconnectAttempts,
    
    // 方法
    connect,
    disconnect,
    sendMessage,
    sendDanmaku,
    sendLike,
    sendGift,
    clearMessages
  }
}

export default useWebSocketChat
