import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/css/tailwind.css'

// 引入mock数据（开发环境）
if (import.meta.env.DEV) {
  import('@/mock/index')
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')