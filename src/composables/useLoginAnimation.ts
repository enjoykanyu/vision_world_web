import { ref } from 'vue'
import axios from 'axios'

// 全局状态
const showLoginAnimation = ref(false)
const consecutiveLoginDays = ref(1)

export const useLoginAnimation = () => {
  // 获取连续登录天数（模拟后端请求）
  const fetchConsecutiveLoginDays = async (): Promise<number> => {
    try {
      // 模拟API请求
      // const response = await axios.get('/api/user/consecutive-login-days')
      // return response.data.days
      
      // 暂时使用mock数据
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockDays = Math.floor(Math.random() * 30) + 1 // 1-30天随机
          resolve(mockDays)
        }, 500)
      })
    } catch (error) {
      console.error('获取连续登录天数失败:', error)
      return 1 // 默认返回1天
    }
  }

  // 触发登录成功动画
  const triggerLoginSuccessAnimation = async () => {
    try {
      // 获取连续登录天数
      const days = await fetchConsecutiveLoginDays()
      consecutiveLoginDays.value = days
      
      // 显示动画
      showLoginAnimation.value = true
      
      console.log(`登录成功！连续登录 ${days} 天`)
    } catch (error) {
      console.error('触发登录动画失败:', error)
    }
  }

  // 关闭动画
  const closeLoginAnimation = () => {
    showLoginAnimation.value = false
  }

  // 模拟登录过程
  const performLogin = async (credentials: { username: string; password: string }) => {
    try {
      // 模拟登录API请求
      // const response = await axios.post('/api/auth/login', credentials)
      
      // 暂时使用mock登录
      // 调用后端userinfo接口获取真实用户信息
      try {
        const response = await fetch('/api/auth/userinfo', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        const data = await response.json()
        if (data.code === 0) {
          return {
            success: true,
            user: {
              id: data.data.id,
              username: data.data.name,
              avatar: data.data.avatar || data.data.avatar_url || 'https://i.pravatar.cc/150?img=68'
            }
          }
        } else {
          throw new Error('获取用户信息失败')
        }
      } catch (error) {
        console.error('获取用户信息失败:', error)
      }
    } catch (error) {
      console.error('登录失败:', error)
      throw error
    }
  }

  return {
    showLoginAnimation,
    consecutiveLoginDays,
    triggerLoginSuccessAnimation,
    closeLoginAnimation,
    performLogin,
    fetchConsecutiveLoginDays
  }
}