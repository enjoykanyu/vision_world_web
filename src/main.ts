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

app.use(createPinia())
app.use(router)

app.mount('#app')