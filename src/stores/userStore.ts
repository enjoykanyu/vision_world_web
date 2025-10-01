import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 状态
  const isLoggedIn = ref(false)
  const username = ref('')
  const userId = ref('')
  const avatar = ref('')

  // 动作
  function login(user: { username: string, userId?: string, avatar?: string }) {
    isLoggedIn.value = true
    username.value = user.username
    if (user.userId) userId.value = user.userId
    if (user.avatar) avatar.value = user.avatar
    
    // 可以在这里添加将用户信息保存到localStorage的逻辑，以实现持久化
    localStorage.setItem('user', JSON.stringify({
      isLoggedIn: true,
      username: username.value,
      userId: userId.value,
      avatar: avatar.value
    }))

    // 方案B：派发全局登录成功事件，由 App 统一触发动画
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('login-success', { detail: { username: username.value, userId: userId.value } }))
    }
  }

  function logout() {
    isLoggedIn.value = false
    username.value = ''
    userId.value = ''
    avatar.value = ''
    
    // 清除localStorage中的用户信息
    localStorage.removeItem('user')
  }

  // 初始化：从localStorage加载用户信息
  function init() {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        const userInfo = JSON.parse(savedUser)
        if (userInfo.isLoggedIn) {
          isLoggedIn.value = true
          username.value = userInfo.username || ''
          userId.value = userInfo.userId || ''
          avatar.value = userInfo.avatar || ''
        }
      } catch (e) {
        console.error('Failed to parse user info from localStorage', e)
        localStorage.removeItem('user')
      }
    }
  }

  // 初始化
  init()

  return {
    isLoggedIn,
    username,
    userId,
    avatar,
    login,
    logout,
    init
  }
})