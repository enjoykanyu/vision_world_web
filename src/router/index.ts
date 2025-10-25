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
import VideoUpload from '@/views/VideoUpload.vue'
import { useUserStore } from '@/stores/userStore'

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
        title: '私信 - Vision World',
        requiresAuth: true
      }
    },
    {
      path: '/upload',
      name: 'videoUpload',
      component: VideoUpload,
      meta: {
        title: '投稿 - Vision World',
        requiresAuth: true
      }
    },
    {
      path: '/stream-setup',
      name: 'streamSetup',
      component: StreamSetup,
      meta: {
        title: '开播设置 - Vision World',
        requiresAuth: true
      }
    }
  ]
})

// 路由守卫，设置页面标题和登录检查
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title as string || 'Vision World'
  
  // 检查是否需要登录
  const userStore = useUserStore()
  const requiresAuth = to.matched.some(record => record.meta?.requiresAuth)
  
  if (requiresAuth && !userStore.isAuthenticated) {
    // 需要登录但未登录，重定向到首页并显示登录弹窗
    next('/')
    // 延迟显示登录弹窗，确保路由切换完成
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('show-login-required'))
    }, 100)
  } else {
    next()
  }
})

export default router