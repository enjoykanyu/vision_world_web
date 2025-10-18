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
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            user: {
              id: '12345678',
              username: credentials.username,
              avatar: 'https://i.pravatar.cc/150?img=68'
            }
          })
        }, 1000)
      })
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