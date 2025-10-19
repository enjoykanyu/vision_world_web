import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/css/tailwind.css'

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
  // 获取userStore实例
  const userStore = pinia._s.get('user')
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
})

app.mount('#app')