import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/css/tailwind.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/userStore'

// 注释掉mock数据（开发环境）- 使用真实后端
// if (import.meta.env.DEV) {
//   import('@/mock/index')
// }

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(ElementPlus)

// 注册所有Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

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
      
      // 检查当前路由是否需要登录
      const currentRoute = router.currentRoute.value
      const requiresAuth = currentRoute.matched.some(record => record.meta?.requiresAuth)
      
      // 只有当前页面需要登录时，才重定向到登录页
      if (requiresAuth) {
        router.push('/')
      }
    }
  } catch (error) {
    console.error('处理auth-logout事件失败:', error)
    // 即使出错也要清除localStorage
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    
    // 检查当前路由是否需要登录
    try {
      const currentRoute = router.currentRoute.value
      const requiresAuth = currentRoute.matched.some(record => record.meta?.requiresAuth)
      
      // 只有当前页面需要登录时，才重定向到登录页
      if (requiresAuth) {
        router.push('/')
      }
    } catch (routeError) {
      console.error('处理路由重定向失败:', routeError)
    }
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