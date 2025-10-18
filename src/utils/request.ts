import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

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

// 请求拦截器
request.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 添加请求ID
    config.headers = config.headers || {}
    config.headers['X-Request-ID'] = generateRequestId()
    
    // 添加认证token
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
  (error: AxiosError) => {
    // 处理HTTP错误
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

// 处理业务错误
function handleBusinessError(code: number, message: string) {
  switch (code) {
    case 20001: // 用户未登录
    case 20002: // 登录已过期
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      // 可以在这里触发重新登录的逻辑
      break
    case 20003: // 账号或密码错误
    case 20004: // 用户不存在
    case 10001: // 参数错误
    case 10002: // 缺少必要参数
      // 使用console.error替代ElementPlus的消息提示
      console.error('业务错误:', message)
      // 可以在这里添加自定义的错误通知组件
      break
    default:
      // 使用console.error替代ElementPlus的消息提示
      console.error('请求失败:', message || '请求失败')
      // 可以在这里添加自定义的错误通知组件
  }
}

// 处理HTTP错误
function handleHttpError(error: AxiosError) {
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

export default request