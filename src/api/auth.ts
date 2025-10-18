import { http } from '@/utils/request'

// 用户登录请求参数接口
export interface LoginRequest {
  phone: string
  code: string
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
  },

  /**
   * 验证访问令牌
   * @param token 访问令牌
   * @returns 验证结果，包含是否有效、用户ID和过期时间
   */
  verifyToken(token: string) {
    return http.post<{ 
      valid: boolean; 
      user_id: number; 
      expire_time: number;
      status_code: number;
      status_msg: string;
    }>('/api/user/token/verify', {
      token
    })
  },

  /**
   * 直接刷新访问令牌（使用后端API路径）
   * @param refreshToken 刷新令牌
   * @returns 新的访问令牌和相关信息
   */
  directRefreshToken(refreshToken: string) {
    return http.post<{ 
      token: string;
      expire_time: number;
      refresh_token?: string;
      status_code: number;
      status_msg: string;
    }>('/api/user/token/refresh', {
      refresh_token: refreshToken
    })
  }
}