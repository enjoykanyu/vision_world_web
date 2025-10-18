import { http } from '@/utils/request'

// 用户登录请求参数接口
export interface LoginRequest {
  phone: string
  verification_code: string
  device_id: string
  device_info: {
    platform: string
    os_version: string
    app_version: string
    device_model?: string
  }
}

// 用户登录响应数据接口
export interface LoginResponse {
  user: {
    user_id: string
    username: string
    phone: string
    avatar: string
    status: number
    created_at: string
  }
  tokens: {
    access_token: string
    refresh_token: string
    expires_in: number
  }
}

// 用户信息接口
export interface UserInfo {
  user_id: string
  username: string
  phone: string
  avatar: string
  status: number
  created_at: string
}

// 发送验证码请求参数接口
export interface SendCodeRequest {
  phone: string
  sms_type: 'login' | 'register' | 'reset_password'
}

// 发送验证码响应数据接口
export interface SendCodeResponse {
  expire_seconds: number
}

// 用户认证相关API
export const authAPI = {
  /**
   * 手机号登录
   * @param data 登录请求数据
   * @returns 登录响应数据
   */
  login(data: LoginRequest) {
    return http.post<LoginResponse>('/api/auth/login', data)
  },

  /**
   * 发送短信验证码
   * @param data 发送验证码请求数据
   * @returns 发送验证码响应数据
   */
  sendCode(data: SendCodeRequest) {
    return http.post<SendCodeResponse>('/api/user/sms/send', data)
  },

  /**
   * 退出登录
   * @returns 退出登录响应
   */
  logout() {
    return http.post('/api/auth/logout')
  },

  /**
   * 刷新访问令牌
   * @param refreshToken 刷新令牌
   * @returns 新的访问令牌
   */
  refreshToken(refreshToken: string) {
    return http.post<{ access_token: string; expires_in: number }>('/api/auth/refresh', {
      refresh_token: refreshToken
    })
  },

  /**
   * 获取用户信息
   * @returns 用户信息
   */
  getUserInfo() {
    return http.get<{ user: UserInfo }>('/api/auth/userinfo')
  }
}