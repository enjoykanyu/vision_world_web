import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import DouyinStyle from '@/views/DouyinStyle.vue'
import BilibiliStyle from '@/views/BilibiliStyle.vue'
import XiaohongshuStyle from '@/views/XiaohongshuStyle.vue'

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
      path: '/douyin',
      name: 'douyin',
      component: DouyinStyle,
      meta: {
        title: '抖音风格 - Vision World'
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
      path: '/xiaohongshu',
      name: 'xiaohongshu',
      component: XiaohongshuStyle,
      meta: {
        title: '小红书风格 - Vision World'
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