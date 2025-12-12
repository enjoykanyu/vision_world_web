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
import VideoManage from '@/views/VideoManage.vue'
import CreatorHome from '@/views/CreatorHome.vue'
import CreatorLayout from '@/layouts/CreatorLayout.vue'
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
    // 创作中心路由
    {
      path: '/creator',
      name: 'creator',
      component: CreatorLayout,
      meta: {
        requiresAuth: true,
        title: '创作中心 - Vision World'
      },
      children: [
        {
          path: 'home',
          name: 'creatorHome',
          component: CreatorHome,
          meta: {
            title: '创作中心首页 - Vision World'
          }
        },
        {
          path: 'upload',
          name: 'creatorUpload',
          component: VideoUpload,
          meta: {
            title: '发布视频 - Vision World'
          }
        },
        {
          path: 'manage/videos',
          name: 'creatorVideoManage',
          component: VideoManage,
          meta: {
            title: '稿件管理 - Vision World'
          }
        },
        {
          path: 'data/overview',
          name: 'dataOverview',
          component: () => import('@/views/DataCenter.vue'),
          meta: {
            title: '数据概览 - Vision World'
          }
        },
        {
          path: 'data/content',
          name: 'dataContent',
          component: () => import('@/views/DataCenter.vue'),
          meta: {
            title: '内容数据 - Vision World'
          }
        },
        {
          path: 'data/audience',
          name: 'dataAudience',
          component: () => import('@/views/DataCenter.vue'),
          meta: {
            title: '观众分析 - Vision World'
          }
        },
        {
          path: 'earnings/overview',
          name: 'earningsOverview',
          component: () => import('@/views/Earnings.vue'),
          meta: {
            title: '收益概览 - Vision World'
          }
        },
        {
          path: 'earnings/detail',
          name: 'earningsDetail',
          component: () => import('@/views/Earnings.vue'),
          meta: {
            title: '收益明细 - Vision World'
          }
        },
        {
          path: 'earnings/withdraw',
          name: 'earningsWithdraw',
          component: () => import('@/views/Earnings.vue'),
          meta: {
            title: '提现管理 - Vision World'
          }
        },
        {
          path: 'settings/profile',
          name: 'settingsProfile',
          component: () => import('@/views/UserProfile.vue'),
          meta: {
            title: '账号资料 - Vision World'
          }
        },
        {
          path: 'settings/security',
          name: 'settingsSecurity',
          component: () => import('@/views/UserProfile.vue'),
          meta: {
            title: '安全设置 - Vision World'
          }
        },
        {
          path: 'settings/notifications',
          name: 'settingsNotifications',
          component: () => import('@/views/UserProfile.vue'),
          meta: {
            title: '通知设置 - Vision World'
          }
        }
      ]
    },
    // 保留原有路由作为备用
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
      path: '/manage/videos',
      name: 'videoManage',
      component: VideoManage,
      meta: {
        title: '创作中心 - Vision World',
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
    // 需要登录但未登录，不重定向，而是直接显示登录弹窗
    // 先允许路由加载，但显示登录弹窗覆盖
    next()
    // 延迟显示登录弹窗，确保路由切换完成
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('show-login-required'))
    }, 100)
  } else {
    next()
  }
})

export default router