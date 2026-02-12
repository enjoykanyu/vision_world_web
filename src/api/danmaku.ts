import { http } from '@/utils/request'

// 弹幕类型定义
export interface Danmaku {
  id: number
  user_id: number
  video_id: string
  text: string
  color: string
  video_timestamp: number
  speed: string
  created_at: number
}

// 发送弹幕请求参数
export interface SendDanmakuRequest {
  video_id: string
  text: string
  color: string
  video_timestamp: number
  speed: string
}

// 发送弹幕响应
export interface SendDanmakuResponse {
  success: boolean
  message: string
  danmaku: Danmaku
}

// 获取弹幕列表响应（后端 proto 定义）
export interface GetDanmakusResponse {
  danmakus: Danmaku[]
  total: number
  status_code: number
  status_msg: string
}

// 弹幕API
export const danmakuAPI = {
  // 发送弹幕
  sendDanmaku: async (data: SendDanmakuRequest): Promise<SendDanmakuResponse> => {
    const response = await http.post('/api/danmaku/send', data)
    // 后端返回 { code, message, data: { success, message, danmaku } }
    return response.data.data || { success: false, message: '发送失败', danmaku: null as any }
  },

  // 获取视频弹幕列表
  getDanmakus: async (videoId: string, page: number = 1, pageSize: number = 20): Promise<GetDanmakusResponse> => {
    const response = await http.get(`/api/danmaku/${videoId}`, {
      // params: {
      //   page,
      //   page_size: pageSize
      // }
    })
    // 后端返回 { code, message, data: { danmakus, total, status_code, status_msg } }
    return response.data.data || { danmakus: [], total: 0, status_code: 0, status_msg: '' }
  }
}
