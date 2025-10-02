import { createRouter, createWebHistory } from 'vue-router'
import VisionWorld from '@/views/VisionWorld.vue'
import Index from '@/views/Index.vue'
import VideoAssistant from '@/views/VideoAssistant.vue'
import VideoDetail from '@/views/VideoDetail.vue'
import SmartVideoDetail from '@/components/SmartVideoDetail.vue'
import UserProfile from '@/views/UserProfile.vue'
import Messages from '@/views/Messages.vue'
import Live from '@/views/Live.vue'
import StreamSetup from '@/views/StreamSetup.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
      meta: {
        title: 'B站风格 - Vision World'
      }
    },
    {
      path: '/live',
      name: 'live',
      component: Live,
      meta: {
        title: '正在直播 - Vision World'
      }
    },
    {
      path: '/stream-setup',
      name: 'streamSetup',
      component: StreamSetup,
      meta: {
        title: '开播设置 - Vision World'
      }
    },
    {
      path: '/video-assistant',
      name: 'videoAssistant',
      component: VideoAssistant,
      meta: {
        title: '视频智能分析助手 - Vision World'
      }
    },
    {
      path: '/video/:id',
      name: 'videoDetail',
      component: VideoDetail,
      meta: {
        title: '视频详情 - Vision World'
      }
    },
    {
      path: '/user/:id',
      name: 'userProfile',
      component: UserProfile,
      meta: {
        title: '用户主页 - Vision World'
      }
    },
    {
      path: '/messages',
      name: 'messages',
      component: Messages,
      meta: {
        title: '私信 - Vision World'
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