import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { authAPI } from '@/api/auth'

// API基础配置
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://visionworld.com/v1'
const TIMEOUT = 30000 // 30秒超时

// 响应数据接口
interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp: number
  request_id: string
}

// 创建axios实例
const request: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'X-Client-Version': '1.0.0',
    'X-Platform': 'web'
  }
})

// 标记是否正在刷新token，防止重复刷新
let isRefreshing = false
// 存储等待token刷新的请求
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: any) => void
}> = []

// 处理等待队列
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token!)
    }
  })
  
  failedQueue = []
}

// 请求拦截器
request.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 添加请求ID
    config.headers = config.headers || {}
    config.headers['X-Request-ID'] = generateRequestId()
    
    // 添加认证token - 优先从localStorage获取，确保与userStore的同步
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response
    
    // 业务状态码为0表示成功
    if (data.code === 0) {
      return response
    } else {
      // 处理业务错误
      handleBusinessError(data.code, data.message)
      return Promise.reject(new Error(data.message || '请求失败'))
    }
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }
    
    // 处理HTTP错误，特别是401未授权错误
    if (error.response?.status === 401 && !originalRequest._retry) {
      // 如果正在刷新token，将请求加入队列
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${token}`
          }
          return request(originalRequest)
        }).catch(err => {
          return Promise.reject(err)
        })
      }
      
      // 标记为正在刷新token
      isRefreshing = true
      originalRequest._retry = true
      
      try {
        // 获取刷新令牌
        const refreshToken = localStorage.getItem('refresh_token')
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }
        
        // 调用token刷新API
        const response = await authAPI.directRefreshToken(refreshToken)
        const newToken = response.data.data.token
        
        // 更新本地存储的token
        localStorage.setItem('access_token', newToken)
        
        // 如果返回了新的refresh token，也更新它
        if (response.data.data.refresh_token) {
          localStorage.setItem('refresh_token', response.data.data.refresh_token)
        }
        
        // 处理等待队列
        processQueue(null, newToken)
        
        // 重试原始请求
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`
        }
        return request(originalRequest)
      } catch (refreshError) {
        // 刷新失败，清除token并重定向到登录页
        processQueue(refreshError, null)
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        
        // 可以在这里触发全局登出事件或重定向到登录页
        window.dispatchEvent(new CustomEvent('auth-logout'))
        
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
    
    // 处理其他HTTP错误
    handleHttpError(error)
    return Promise.reject(error)
  }
)

// 生成请求ID
function generateRequestId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// 业务错误处理
const handleBusinessError = (code: number, message: string) => {
  console.error(`业务错误 [${code}]: ${message}`)
  
  // 根据错误码进行特殊处理
  switch (code) {
    case 20001: // 未登录
    case 20002: // 登录过期
      // 清除本地token
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      
      // 触发全局登出事件
      window.dispatchEvent(new CustomEvent('auth-logout'))
      break
    default:
      // 其他业务错误可以在这里统一处理
      break
  }
}

// Token同步函数 - 确保userStore和localStorage中的token保持一致
export const syncTokenWithLocalStorage = () => {
  const token = localStorage.getItem('access_token')
  return token
}

// 处理HTTP错误
const handleHttpError = (error: AxiosError) => {
  if (error.response) {
    // 服务器响应错误
    const status = error.response.status
    switch (status) {
      case 400:
      // 使用console.error替代ElementPlus的消息提示
      console.error('HTTP错误:', '请求参数错误')
      // 可以在这里添加自定义的错误通知组件
      break
    case 401:
      // 使用console.error替代ElementPlus的消息提示
      console.error('HTTP错误:', '未授权，请重新登录')
      localStorage.removeItem('access_token')
      // 可以在这里添加自定义的错误通知组件
      break
    case 403:
      // 使用console.error替代ElementPlus的消息提示
      console.error('HTTP错误:', '权限不足')
      // 可以在这里添加自定义的错误通知组件
      break
    case 404:
      // 使用console.error替代ElementPlus的消息提示
      console.error('HTTP错误:', '请求的资源不存在')
      // 可以在这里添加自定义的错误通知组件
      break
    case 429:
      // 使用console.error替代ElementPlus的消息提示
      console.error('HTTP错误:', '请求过于频繁，请稍后重试')
      // 可以在这里添加自定义的错误通知组件
      break
    case 500:
      // 使用console.error替代ElementPlus的消息提示
      console.error('HTTP错误:', '服务器内部错误')
      // 可以在这里添加自定义的错误通知组件
      break
    case 502:
      // 使用console.error替代ElementPlus的消息提示
      console.error('HTTP错误:', '网关错误')
      // 可以在这里添加自定义的错误通知组件
      break
    case 503:
      // 使用console.error替代ElementPlus的消息提示
      console.error('HTTP错误:', '服务不可用')
      // 可以在这里添加自定义的错误通知组件
      break
    default:
      // 使用console.error替代ElementPlus的消息提示
      console.error('HTTP错误:', `请求失败: ${status}`)
      // 可以在这里添加自定义的错误通知组件
    }
  } else if (error.request) {
    // 请求未收到响应
    // 使用console.error替代ElementPlus的消息提示
    console.error('网络错误:', '网络连接失败，请检查网络设置')
    // 可以在这里添加自定义的错误通知组件
  } else {
    // 请求配置错误
    // 使用console.error替代ElementPlus的消息提示
    console.error('请求错误:', '请求配置错误')
    // 可以在这里添加自定义的错误通知组件
  }
}

// 封装请求方法
export const http = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return request.get(url, config)
  },
  
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return request.post(url, data, config)
  },
  
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return request.put(url, data, config)
  },
  
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return request.delete(url, config)
  }
}

// 导出token验证方法，供其他组件使用
export const verifyToken = async (token: string) => {
  try {
    return await authAPI.verifyToken(token)
  } catch (error) {
    console.error('Token验证失败:', error)
    throw error
  }
}

// 导出token刷新方法，供其他组件使用
export const refreshToken = async (refreshToken: string) => {
  try {
    return await authAPI.directRefreshToken(refreshToken)
  } catch (error) {
    console.error('Token刷新失败:', error)
    throw error
  }
}

export default request