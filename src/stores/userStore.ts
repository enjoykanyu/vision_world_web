import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authAPI, LoginRequest, LoginResponse, UserInfo } from '@/api/auth'

export const useUserStore = defineStore('user', () => {
  // 状态
  const isLoggedIn = ref(false)
  const username = ref('')
  const userId = ref('')
  const avatar = ref('')
  const phone = ref('')
  const status = ref(0)
  const createdAt = ref('')
  const accessToken = ref('')
  const refreshToken = ref('')
  const expiresIn = ref(0)
  const loading = ref(false)

  // 计算属性
  const isAuthenticated = computed(() => isLoggedIn.value && !!accessToken.value)
  const tokenExpired = computed(() => {
    if (!expiresIn.value || !accessToken.value) return true
    // 这里简化处理，实际应该解析JWT token的过期时间
    return false
  })

  // 发送验证码
  async function sendVerificationCode(phone: string) {
    console.log('开始发送验证码，手机号:', phone)
    loading.value = true
    try {
      const response = await authAPI.sendCode({
        phone,
        sms_type: 'login'
      })
      
      console.log('验证码发送成功，完整响应:', response)
      console.log('响应数据结构:', JSON.stringify(response, null, 2))
      
      // 尝试不同的数据访问路径
      let expireSeconds = 60 // 默认值
      if (response && response.data) {
        if (response.data.expire_seconds) {
          expireSeconds = response.data.expire_seconds
        } else if (response.data.data && response.data.data.expire_seconds) {
          expireSeconds = response.data.data.expire_seconds
        }
      }
      
      return { 
        success: true, 
        expireSeconds 
      }
    } catch (error: any) {
      console.error('发送验证码失败:', error)
      console.error('错误详情:', JSON.stringify(error, null, 2))
      return { 
        success: false, 
        error: error.message || '发送验证码失败，请重试'
      }
    } finally {
      loading.value = false
    }
  }

  // 登录
  async function login(loginData: { phone: string; verificationCode: string }) {
    loading.value = true
    try {
      // 构建设备信息
      const deviceInfo: LoginRequest = {
        phone: loginData.phone,
        verification_code: loginData.verificationCode,
        device_id: generateDeviceId(),
        device_info: {
          platform: 'web',
          os_version: navigator.platform,
          app_version: '1.0.0',
          device_model: navigator.userAgent
        }
      }

      // 调用登录API
      const response = await authAPI.login(deviceInfo)
      const loginDataRes: LoginResponse = response.data.data
      
      // 保存用户信息
      updateUserInfo(loginDataRes.user, loginDataRes.tokens)
      
      // 保存到localStorage
      saveUserToLocalStorage()
      
      // 使用自定义通知或console.log替代ElementPlus的消息提示
      console.log('登录成功')
      // 可以在这里添加自定义的成功通知组件
      
      // 派发全局登录成功事件
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('login-success', { 
          detail: { 
            username: loginDataRes.user.username, 
            userId: loginDataRes.user.user_id 
          } 
        }))
      }
      
      return { success: true }
    } catch (error: any) {
      console.error('登录失败:', error)
      // 使用自定义错误处理替代ElementPlus的消息提示
      console.error('登录失败:', error.message || '登录失败，请重试')
      // 可以在这里添加自定义的错误通知组件
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  // 退出登录
  async function logout() {
    loading.value = true
    try {
      if (isAuthenticated.value) {
        await authAPI.logout()
      }
    } catch (error) {
      console.error('退出登录API调用失败:', error)
    } finally {
      // 清除用户信息
      clearUserInfo()
      clearLocalStorage()
      // 使用console.log替代ElementPlus的消息提示
      console.log('退出登录成功')
      // 可以在这里添加自定义的成功通知组件
      loading.value = false
    }
  }

  // 刷新token
  async function refreshAccessToken(): Promise<boolean> {
    if (!refreshToken.value) return false
    
    try {
      const response = await authAPI.refreshToken(refreshToken.value)
      const tokenData = response.data.data
      
      accessToken.value = tokenData.access_token
      expiresIn.value = tokenData.expires_in
      
      // 更新localStorage
      saveUserToLocalStorage()
      
      return true
    } catch (error) {
      console.error('Token刷新失败:', error)
      // 刷新失败，需要重新登录
      await logout()
      return false
    }
  }

  // 获取用户信息
  async function fetchUserInfo(): Promise<boolean> {
    if (!isAuthenticated.value) return false
    
    try {
      const response = await authAPI.getUserInfo()
      const userInfo: { user: UserInfo } = response.data.data
      
      // 更新用户信息（保持token不变）
      updateUserInfo(userInfo.user, {
        access_token: accessToken.value,
        refresh_token: refreshToken.value,
        expires_in: expiresIn.value
      })
      
      saveUserToLocalStorage()
      return true
    } catch (error) {
      console.error('获取用户信息失败:', error)
      return false
    }
  }

  // 更新用户信息
  function updateUserInfo(user: UserInfo, tokens: { access_token: string; refresh_token: string; expires_in: number }) {
    isLoggedIn.value = true
    username.value = user.username
    userId.value = user.user_id
    avatar.value = user.avatar
    phone.value = user.phone
    status.value = user.status
    createdAt.value = user.created_at
    accessToken.value = tokens.access_token
    refreshToken.value = tokens.refresh_token
    expiresIn.value = tokens.expires_in
  }

  // 清除用户信息
  function clearUserInfo() {
    isLoggedIn.value = false
    username.value = ''
    userId.value = ''
    avatar.value = ''
    phone.value = ''
    status.value = 0
    createdAt.value = ''
    accessToken.value = ''
    refreshToken.value = ''
    expiresIn.value = 0
  }

  // 保存用户信息到localStorage
  function saveUserToLocalStorage() {
    const userData = {
      isLoggedIn: isLoggedIn.value,
      username: username.value,
      userId: userId.value,
      avatar: avatar.value,
      phone: phone.value,
      status: status.value,
      createdAt: createdAt.value,
      accessToken: accessToken.value,
      refreshToken: refreshToken.value,
      expiresIn: expiresIn.value
    }
    localStorage.setItem('user', JSON.stringify(userData))
  }

  // 从localStorage加载用户信息
  function loadUserFromLocalStorage() {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        const userInfo = JSON.parse(savedUser)
        if (userInfo.isLoggedIn) {
          isLoggedIn.value = userInfo.isLoggedIn
          username.value = userInfo.username || ''
          userId.value = userInfo.userId || ''
          avatar.value = userInfo.avatar || ''
          phone.value = userInfo.phone || ''
          status.value = userInfo.status || 0
          createdAt.value = userInfo.createdAt || ''
          accessToken.value = userInfo.accessToken || ''
          refreshToken.value = userInfo.refreshToken || ''
          expiresIn.value = userInfo.expiresIn || 0
        }
      } catch (e) {
        console.error('Failed to parse user info from localStorage', e)
        localStorage.removeItem('user')
      }
    }
  }

  // 清除localStorage
  function clearLocalStorage() {
    localStorage.removeItem('user')
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  // 生成设备ID
  function generateDeviceId(): string {
    const existingId = localStorage.getItem('device_id')
    if (existingId) return existingId
    
    const newId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    localStorage.setItem('device_id', newId)
    return newId
  }

  // 初始化
  function init() {
    loadUserFromLocalStorage()
  }

  // 初始化
  init()

  return {
    // 状态
    isLoggedIn,
    username,
    userId,
    avatar,
    phone,
    status,
    createdAt,
    accessToken,
    refreshToken,
    expiresIn,
    loading,
    
    // 计算属性
    isAuthenticated,
    tokenExpired,
    
    // 方法
    login,
    logout,
    sendVerificationCode,
    refreshAccessToken,
    fetchUserInfo,
    init
  }
})