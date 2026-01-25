import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authAPI, LoginRequest, LoginResponse, UserInfo } from '@/api/auth'



export interface UserProfileInfo {
  name: string
  avatar: string
  signature: string
  avatar_url?: string
  background_image?: string
}

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
  
  // 用户标签相关状态
  const userTags = ref<string[]>([])
  const tagPreferences = ref<Record<string, number>>({}) // 标签偏好权重
  const tagHistory = ref<string[]>([]) // 用户浏览过的视频标签历史

  // 计算属性
  const isAuthenticated = computed(() => isLoggedIn.value && !!accessToken.value)
  const tokenExpired = computed(() => {
    if (!expiresIn.value || !accessToken.value) return true
    // 这里简化处理，实际应该解析JWT token的过期时间
    return false
  })
  const avatar = computed(() => avatarUrl.value || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId.value || 'default'}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`)

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
      console.log('响应数据结构:', JSON.stringify(response, null, 2))
      
      // 检查响应数据结构 - 处理不同的响应格式
      if (!response || !response.data) {
        throw new Error('登录响应数据格式错误')
      }
      
      // 尝试不同的响应结构
      let loginDataRes = response.data.data || response.data
      
      if (!loginDataRes) {
        throw new Error('登录响应数据缺少data字段。实际结构: ' + JSON.stringify(response.data))
      }
      
      if (!loginDataRes.user) {
        throw new Error('登录响应数据缺少用户信息。实际结构: ' + JSON.stringify(loginDataRes))
      }
      
      if (!loginDataRes.token) {
        throw new Error('登录响应数据缺少token信息。实际结构: ' + JSON.stringify(loginDataRes))
      }
      
      // 保存用户信息
      updateUserInfo(loginDataRes.user, loginDataRes.token)
      
      // 如果响应中有refresh token，也保存它
      if (loginDataRes.refresh_token) {
        refreshToken.value = loginDataRes.refresh_token
      }
      
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
      if (isAuthenticated.value && accessToken.value) {
        // 确保退出登录请求携带token
        await authAPI.logout()
      }
    } catch (error) {
      console.error('退出登录API调用失败:', error)
    } finally {
      // 清除用户信息和token
      clearUserInfo()
      clearLocalStorage()
      // 清除localStorage中的token
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
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
      console.log('User info response:', response)
      const userInfo: UserInfo = response.data.data
      // 更新用户信息（保持token不变）
      updateUserInfo(userInfo, accessToken.value)
      saveUserToLocalStorage()
      return true
    } catch (error) {
      return false
    }
  }

  // 获取用户公开信息（用于编辑页面）
  async function fetchUserProfile(): Promise<UserProfileInfo | null> {
    if (!isAuthenticated.value) return null
    
    try {
      const response = await authAPI.getUserInfo()
      const userInfo: UserInfo = response.data.data
      console.log('User info:', userInfo)
      return {
        name: userInfo.name || '',
        avatar: userInfo.avatar || '',
        signature: userInfo.signature || '',
        avatar_url: userInfo.avatar,
        background_image: userInfo.background_image
      }
    } catch (error) {
      return null
    }
  }

  // 首次登录获取用户信息
  async function initUserInfo() {
    if (isAuthenticated.value && !nickname.value) {
      const profile = await fetchUserProfile()
      if (profile) {
        nickname.value = profile.nickname
        avatarUrl.value = profile.avatar || profile.avatar_url || ''
      }
    }
  }

  // 更新用户信息
  async function updateUserProfile(data: {
    name?: string
    signature?: string
    avatar?: string
  }): Promise<{ status_code: number; status_msg: string }> {
    if (!isAuthenticated.value) {
      return { status_code: 401, status_msg: '未登录' }
    }
    
    try {
      const response = await authAPI.updateUserProfile(data)
      const result = response.data?.data || response.data
      
      if (result.status_code === 0) {
        nickname.value = data.name || nickname.value
        avatarUrl.value = data.avatar || avatarUrl.value
        signature.value = data.signature || signature.value
        saveUserToLocalStorage()
      }
      
      return result
    } catch (error: any) {
      console.error('更新用户信息失败:', error)
      return { status_code: 400, status_msg: error.message || '更新失败' }
    }
  }

  // 验证Token有效性
  async function verifyToken(): Promise<boolean> {
    if (!accessToken.value) return false
    
    try {
      const response = await authAPI.verifyToken(accessToken.value)
      const verifyData = response.data
      console.log('Token验证响应:', verifyData)
      if (verifyData.code === 0) {
        // Token有效，获取用户信息
        return await fetchUserInfo()
      } else {
        // Token无效，但不清除登录状态，让用户下次操作时再处理
        console.log('Token验证失败，但保持登录状态')
        // 可以尝试刷新token
        if (refreshToken.value) {
          console.log('尝试使用刷新token获取新token')
          const refreshed = await refreshAccessToken()
          if (refreshed) {
            console.log('Token刷新成功')
            return true
          }
        }
        return false
      }
    } catch (error) {
      console.error('验证Token失败:', error)
      // 网络错误或服务器错误，不清除登录状态
      console.log('Token验证遇到网络问题，但保持登录状态')
      // 如果有刷新token，可以尝试刷新
      if (refreshToken.value) {
        try {
          const refreshed = await refreshAccessToken()
          if (refreshed) {
            console.log('网络问题后Token刷新成功')
            return true
          }
        } catch (refreshError) {
          console.log('Token刷新也失败:', refreshError)
        }
      }
      return false
    }
  }

  // 更新用户信息
  function updateUserInfo(user: UserInfo, token: string) {
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
    
    // 添加对token的空值检查
    if (token) {
      accessToken.value = token
      // 同时保存到localStorage，确保请求拦截器能够获取到token
      localStorage.setItem('access_token', token)
    } else {
      console.error('Token is undefined in updateUserInfo')
      accessToken.value = ''
      // 清除localStorage中的token
      localStorage.removeItem('access_token')
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
    
    // 清除localStorage中的token
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
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

  // 用户标签相关方法
  
  // 设置用户标签
  function setUserTags(tags: string[]) {
    userTags.value = tags
    saveUserTagsToLocalStorage()
  }
  
  // 添加用户标签
  function addUserTag(tag: string) {
    if (!userTags.value.includes(tag)) {
      userTags.value.push(tag)
      saveUserTagsToLocalStorage()
    }
  }
  
  // 移除用户标签
  function removeUserTag(tag: string) {
    const index = userTags.value.indexOf(tag)
    if (index > -1) {
      userTags.value.splice(index, 1)
      saveUserTagsToLocalStorage()
    }
  }
  
  // 更新标签偏好权重
  function updateTagPreference(tag: string, weight: number) {
    tagPreferences.value[tag] = weight
    saveUserTagsToLocalStorage()
  }
  
  // 增加标签偏好权重
  function increaseTagPreference(tag: string, increment: number = 1) {
    if (tagPreferences.value[tag]) {
      tagPreferences.value[tag] += increment
    } else {
      tagPreferences.value[tag] = increment
    }
    saveUserTagsToLocalStorage()
  }
  
  // 添加标签到历史记录
  function addToTagHistory(tag: string) {
    // 如果标签已存在，先移除
    const index = tagHistory.value.indexOf(tag)
    if (index > -1) {
      tagHistory.value.splice(index, 1)
    }
    // 添加到开头
    tagHistory.value.unshift(tag)
    // 限制历史记录数量
    if (tagHistory.value.length > 50) {
      tagHistory.value = tagHistory.value.slice(0, 50)
    }
    saveUserTagsToLocalStorage()
  }
  
  // 获取推荐标签（基于偏好权重和历史记录）
  function getRecommendedTags(limit: number = 10): string[] {
    // 合并偏好标签和历史标签
    const allTags = new Set([
      ...Object.keys(tagPreferences.value),
      ...tagHistory.value,
      ...userTags.value
    ])
    
    // 计算每个标签的综合得分
    const tagScores = Array.from(allTags).map(tag => {
      const preferenceScore = tagPreferences.value[tag] || 0
      const historyScore = tagHistory.value.includes(tag) ? (tagHistory.value.length - tagHistory.value.indexOf(tag)) : 0
      const userTagScore = userTags.value.includes(tag) ? 10 : 0
      
      return {
        tag,
        score: preferenceScore + historyScore * 0.5 + userTagScore
      }
    })
    
    // 按得分排序并返回前N个
    return tagScores
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.tag)
  }
  
  // 保存用户标签到localStorage
  function saveUserTagsToLocalStorage() {
    const tagsData = {
      userTags: userTags.value,
      tagPreferences: tagPreferences.value,
      tagHistory: tagHistory.value
    }
    localStorage.setItem('user_tags', JSON.stringify(tagsData))
  }
  
  // 从localStorage加载用户标签
  function loadUserTagsFromLocalStorage() {
    const savedTags = localStorage.getItem('user_tags')
    if (savedTags) {
      try {
        const tagsData = JSON.parse(savedTags)
        userTags.value = tagsData.userTags || []
        tagPreferences.value = tagsData.tagPreferences || {}
        tagHistory.value = tagsData.tagHistory || []
      } catch (e) {
        console.error('Failed to parse user tags from localStorage', e)
        localStorage.removeItem('user_tags')
      }
    }
  }
  
  // 清除用户标签
  function clearUserTags() {
    userTags.value = []
    tagPreferences.value = {}
    tagHistory.value = []
    localStorage.removeItem('user_tags')
  }

  // 初始化
  async function init() {
    // 从localStorage加载用户信息
    loadUserFromLocalStorage()
    // 从localStorage加载用户标签
    loadUserTagsFromLocalStorage()
    
    // 如果有token，尝试验证其有效性
    if (accessToken.value) {
      try {
        // 延迟验证，避免页面初始化时立即验证
        setTimeout(async () => {
          try {
            const isValid = await verifyToken()
            if (!isValid) {
              console.log('Token验证失败，但保持登录状态，直到用户主动操作')
              // 不清除登录状态，等待用户触发API请求时再验证
            }
            
            // 检查token是否即将过期
            const now = Date.now()
            const expiryTime = expiresIn.value * 1000 // 转换为毫秒
            
            // 如果token在10分钟内过期，尝试刷新
            if (expiryTime && expiryTime - now < 10 * 60 * 1000) {
              console.log('Token即将过期，尝试刷新')
              await refreshAccessToken()
            }
          } catch (error) {
            console.log('初始化时token验证遇到网络问题，但保持登录状态:', error)
            // 网络问题不清除登录状态，让用户后续再试
          }
        }, 100)
      } catch (error) {
        console.error('初始化登录状态时发生错误:', error)
      }
    }
  }

  // 初始化
  init()

  // 模拟登录（开发测试用）
  function mockLogin() {
    const mockUser = {
      id: 12345,
      username: 'VisionUser',
      nickname: '视觉世界探索者',
      email: 'user@visionworld.com',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=VisionUser12345&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
      background_image: 'https://picsum.photos/800/400?random=1',
      signature: '探索视觉世界的无限可能 🌟',
      gender: 1,
      birthday: '1995-08-15',
      following_count: 128,
      followers_count: 256,
      total_favorited: 1024,
      work_count: 48,
      favorite_count: 256,
      is_verified: true,
      user_type: 'verified',
      status: 1,
      last_login_at: Date.now(),
      created_at: Date.now() - 86400000 * 365,
      updated_at: Date.now(),
      phone: '138****8888'
    }

    const mockToken = {
      access_token: 'mock_access_token_12345',
      refresh_token: 'mock_refresh_token_12345',
      expires_in: 7200
    }

    updateUserInfo(mockUser, mockToken.access_token)
    refreshToken.value = mockToken.refresh_token
    expiresIn.value = mockToken.expires_in
    saveUserToLocalStorage()
    
    console.log('模拟登录成功:', mockUser)
    return { success: true }
  }

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
    
    // 用户标签相关状态
    userTags,
    tagPreferences,
    tagHistory,
    
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
    fetchUserProfile,
    updateUserProfile,
    verifyToken,
    init,
    mockLogin,
    clearUserInfo,
    clearLocalStorage,
    saveUserToLocalStorage,
    loadUserFromLocalStorage,
    
    // 用户标签相关方法
      setUserTags,
      addUserTag,
      removeUserTag,
      updateTagPreference,
      increaseTagPreference,
      addToTagHistory,
      getRecommendedTags,
      saveUserTagsToLocalStorage,
      loadUserTagsFromLocalStorage,
      clearUserTags
  }
})