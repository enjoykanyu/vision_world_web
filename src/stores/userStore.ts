import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authAPI, LoginRequest, LoginResponse, UserInfo } from '@/api/auth'

export const useUserStore = defineStore('user', () => {
  // 状态
  const isLoggedIn = ref(false)
  const username = ref('')
  const nickname = ref('')
  const userId = ref(0)
  const email = ref('')
  const avatarUrl = ref('')
  const backgroundImage = ref('')
  const signature = ref('')
  const gender = ref(0) // 0-未知,1-男,2-女
  const birthday = ref('')
  const followingCount = ref(0)
  const followersCount = ref(0)
  const totalFavorited = ref(0)
  const workCount = ref(0)
  const favoriteCount = ref(0)
  const isVerified = ref(false)
  const userType = ref('normal') // normal, verified, official
  const status = ref(0) // 0-禁用,1-正常
  const lastLoginAt = ref(0) // 时间戳
  const createdAt = ref(0) // 时间戳
  const updatedAt = ref(0) // 时间戳
  const phone = ref('')
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
  const avatar = computed(() => avatarUrl.value || `https://i.pravatar.cc/150?u=${userId.value}`)

  // 发送验证码
  async function sendVerificationCode(phone: string) {
    loading.value = true
    try {
      alert(333)
      const response = await authAPI.sendCode({
        phone,
        sms_type: 'login'
      })
      
      // console.log('验证码发送成功，完整响应:', response)
      // console.log('响应数据结构:', JSON.stringify(response, null, 2))
      
      // 尝试不同的数据访问路径
      let expireSeconds = 60 // 默认值
      // if (response && response.data) {
      //   if (response.data.expire_seconds) {
      //     expireSeconds = response.data.expire_seconds
      //   } else if (response.data.data && response.data.data.expire_seconds) {
      //     expireSeconds = response.data.data.expire_seconds
      //   }
      // }
      
      return { 
        success: true, 
        expireSeconds
      }
    } catch (error: any) {
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
        code: loginData.verificationCode,
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
      console.log('登录API响应:', response)
      
      // 检查响应数据结构
      if (!response || !response.data) {
        throw new Error('登录响应数据格式错误')
      }
      
      const loginDataRes = response.data.data
      if (!loginDataRes) {
        throw new Error('登录响应数据缺少data字段')
      }
      
      if (!loginDataRes.user) {
        throw new Error('登录响应数据缺少用户信息')
      }
      
      if (!loginDataRes.token) {
        throw new Error('登录响应数据缺少token信息')
      }
      
      // 保存用户信息
      updateUserInfo(loginDataRes.user, loginDataRes.token)
      
      // 保存到localStorage
      saveUserToLocalStorage()
      
      // 使用自定义通知或console.log替代ElementPlus的消息提示
      // 可以在这里添加自定义的成功通知组件
      
      // 派发全局登录成功事件
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('login-success', { 
          detail: { 
            username: loginDataRes.user.username, 
            userId: loginDataRes.user.id
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
      console.log(userInfo)
      // const token = response.data
      // // 更新用户信息（保持token不变）
      // updateUserInfo(userInfo.user, )
      //
      saveUserToLocalStorage()
      return true
    } catch (error) {
      console.error('获取用户信息失败:', error)
      return false
    }
  }

  // 更新用户信息
  function updateUserInfo(user: UserInfo, token:"") {
    isLoggedIn.value = true
    username.value = user.username || ''
    nickname.value = user.nickname || ''
    userId.value = user.id || 0
    email.value = user.email || ''
    avatarUrl.value = user.avatar_url || ''
    backgroundImage.value = user.background_image || ''
    signature.value = user.signature || ''
    gender.value = user.gender || 0
    birthday.value = user.birthday || ''
    followingCount.value = user.following_count || 0
    followersCount.value = user.followers_count || 0
    totalFavorited.value = user.total_favorited || 0
    workCount.value = user.work_count || 0
    favoriteCount.value = user.favorite_count || 0
    isVerified.value = user.is_verified || false
    userType.value = user.user_type || 'normal'
    status.value = user.status || 0
    lastLoginAt.value = user.last_login_at || 0
    createdAt.value = user.created_at || 0
    updatedAt.value = user.updated_at || 0
    phone.value = user.phone || ''
    
    // 添加对tokens的空值检查
    if (token) {
      accessToken.value = token
    } else {
      console.error('Tokens is undefined in updateUserInfo')
      accessToken.value = ''
      // refreshToken.value = ''
      // expiresIn.value = 0
    }
  }

  // 清除用户信息
  function clearUserInfo() {
    isLoggedIn.value = false
    username.value = ''
    nickname.value = ''
    userId.value = 0
    email.value = ''
    avatarUrl.value = ''
    backgroundImage.value = ''
    signature.value = ''
    gender.value = 0
    birthday.value = ''
    followingCount.value = 0
    followersCount.value = 0
    totalFavorited.value = 0
    workCount.value = 0
    favoriteCount.value = 0
    isVerified.value = false
    userType.value = 'normal'
    status.value = 0
    lastLoginAt.value = 0
    createdAt.value = 0
    updatedAt.value = 0
    phone.value = ''
    accessToken.value = ''
    refreshToken.value = ''
    expiresIn.value = 0
  }

  // 保存用户信息到localStorage
  function saveUserToLocalStorage() {
    const userData = {
      isLoggedIn: isLoggedIn.value,
      username: username.value,
      nickname: nickname.value,
      userId: userId.value,
      email: email.value,
      avatarUrl: avatarUrl.value,
      backgroundImage: backgroundImage.value,
      signature: signature.value,
      gender: gender.value,
      birthday: birthday.value,
      followingCount: followingCount.value,
      followersCount: followersCount.value,
      totalFavorited: totalFavorited.value,
      workCount: workCount.value,
      favoriteCount: favoriteCount.value,
      isVerified: isVerified.value,
      userType: userType.value,
      status: status.value,
      lastLoginAt: lastLoginAt.value,
      createdAt: createdAt.value,
      updatedAt: updatedAt.value,
      phone: phone.value,
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
          nickname.value = userInfo.nickname || ''
          userId.value = userInfo.userId || 0
          email.value = userInfo.email || ''
          avatarUrl.value = userInfo.avatarUrl || ''
          backgroundImage.value = userInfo.backgroundImage || ''
          signature.value = userInfo.signature || ''
          gender.value = userInfo.gender || 0
          birthday.value = userInfo.birthday || ''
          followingCount.value = userInfo.followingCount || 0
          followersCount.value = userInfo.followersCount || 0
          totalFavorited.value = userInfo.totalFavorited || 0
          workCount.value = userInfo.workCount || 0
          favoriteCount.value = userInfo.favoriteCount || 0
          isVerified.value = userInfo.isVerified || false
          userType.value = userInfo.userType || 'normal'
          status.value = userInfo.status || 0
          lastLoginAt.value = userInfo.lastLoginAt || 0
          createdAt.value = userInfo.createdAt || 0
          updatedAt.value = userInfo.updatedAt || 0
          phone.value = userInfo.phone || ''
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
    nickname,
    userId,
    email,
    avatarUrl,
    backgroundImage,
    signature,
    gender,
    birthday,
    followingCount,
    followersCount,
    totalFavorited,
    workCount,
    favoriteCount,
    isVerified,
    userType,
    status,
    lastLoginAt,
    createdAt,
    updatedAt,
    phone,
    accessToken,
    refreshToken,
    expiresIn,
    loading,
    
    // 计算属性
    isAuthenticated,
    tokenExpired,
    avatar,
    
    // 方法
    login,
    logout,
    sendVerificationCode,
    refreshAccessToken,
    fetchUserInfo,
    init
  }
})