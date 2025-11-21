import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/css/tailwind.css'
import { useUserStore } from '@/stores/userStore'

// 注释掉mock数据（开发环境）- 使用真实后端
// if (import.meta.env.DEV) {
//   import('@/mock/index')
// }

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 添加全局事件监听器，处理token失效导致的登出
window.addEventListener('auth-logout', () => {
  try {
    // 获取userStore实例
    const userStore = useUserStore()
    if (userStore) {
      // 清除用户信息和token
      userStore.clearUserInfo()
      userStore.clearLocalStorage()
      
      // 清除localStorage中的token
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      
      // 重定向到登录页
      router.push('/login')
    }
  } catch (error) {
    console.error('处理auth-logout事件失败:', error)
    // 即使出错也要清除localStorage并跳转
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    router.push('/login')
  }
})

// 初始化用户状态
const initializeApp = async () => {
  try {
    const userStore = useUserStore()
    await userStore.init()
    console.log('用户状态初始化完成')
  } catch (error) {
    console.error('用户状态初始化失败:', error)
  }
}

// 在应用挂载前初始化用户状态
initializeApp().then(() => {
  app.mount('#app')
})