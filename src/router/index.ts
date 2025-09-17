import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import BilibiliStyle from '@/views/BilibiliStyle.vue'
import VideoAssistant from '@/views/VideoAssistant.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        title: 'Vision World - 选择你的风格'
      }
    },
    {
      path: '/bilibili',
      name: 'bilibili',
      component: BilibiliStyle,
      meta: {
        title: 'B站风格 - Vision World'
      }
    },
    {
      path: '/video-assistant',
      name: 'videoAssistant',
      component: VideoAssistant,
      meta: {
        title: '视频智能分析助手 - Vision World'
      }
    }
  ]
})

// 路由守卫，设置页面标题
router.beforeEach((to, from, next) => {
  document.title = to.meta.title as string || 'Vision World'
  next()
})

export default router