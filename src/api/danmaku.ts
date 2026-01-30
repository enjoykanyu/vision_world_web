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

// 获取弹幕列表响应
export interface GetDanmakusResponse {
  danmakus: Danmaku[]
  total: number
}

// 弹幕API
export const danmakuAPI = {
  // 发送弹幕
  sendDanmaku: async (data: SendDanmakuRequest): Promise<SendDanmakuResponse> => {
    const response = await http.post('/api/danmaku/send', data)
    return response.data
  },
  
  // 获取视频弹幕列表
  getDanmakus: async (videoId: string, page: number = 1, pageSize: number = 20): Promise<GetDanmakusResponse> => {
    const response = await http.get(`/api/danmaku/${videoId}`, {
      params: {
        page,
        page_size: pageSize
      }
    })
    return response.data
  }
}
