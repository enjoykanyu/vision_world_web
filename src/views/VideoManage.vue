<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 头部导航 -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-4">
            <router-link to="/" class="flex items-center group">
              <div class="w-10 h-10 bg-pink-500 rounded flex items-center justify-center">
                <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm-1 14.5v-9l7 4.5-7 4.5z"/>
                </svg>
              </div>
              <span class="ml-2 text-xl font-semibold text-gray-900 dark:text-white">VisionWorld</span>
            </router-link>
            <div class="hidden md:flex items-center space-x-1">
              <span class="text-gray-400">/</span>
              <span class="text-gray-600 dark:text-gray-300 ml-1">创作中心</span>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <button class="p-2 text-gray-600 dark:text-gray-300 hover:text-pink-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </button>
            <button class="p-2 text-gray-600 dark:text-gray-300 hover:text-pink-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>
            <!-- 用户头像下拉菜单 -->
            <div class="relative group">
              <div class="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-pink-600 transition-colors">
                <span class="text-white text-base font-semibold">{{ (userStore.username || 'U').charAt(0).toUpperCase() }}</span>
              </div>
              
              <!-- 下拉菜单 -->
              <div class="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible z-50">
                <div class="py-1">
                  <router-link to="/profile" class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    个人账号中心
                  </router-link>
                  
                  <router-link to="/manage/videos" class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                    投稿管理
                  </router-link>
                  
                  <hr class="my-1 border-gray-200 dark:border-gray-600">
                  
                  <button @click="handleLogout" class="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    退出登录
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- 创作中心标题 -->
      <div class="bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h1 class="text-xl font-semibold text-pink-600 dark:text-pink-400">创作中心</h1>
        </div>
        <div class="px-6 py-2">
          <div class="flex space-x-8 border-b border-gray-200 dark:border-gray-700">
            <button class="py-3 px-1 border-b-2 border-pink-500 text-pink-600 dark:text-pink-400 font-medium">我的投稿</button>
            <button class="py-3 px-1 border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 hover:border-pink-300 dark:hover:border-pink-700 transition-colors">创作收益</button>
            <button class="py-3 px-1 border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 hover:border-pink-300 dark:hover:border-pink-700 transition-colors">数据中心</button>
          </div>
        </div>
      </div>

      <!-- 视频列表 -->
      <div class="bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">已发布的视频</h2>
          <router-link to="/upload" class="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
            <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            发布新视频
          </router-link>
        </div>

        <!-- 视频列表 -->
        <div v-if="videos.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="video in videos" :key="video.id" class="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div class="relative">
              <img :src="video.cover" :alt="video.title" class="w-full h-48 object-cover">
              <div class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {{ formatDuration(video.duration) }}
              </div>
            </div>
            <div class="p-4">
              <h3 class="text-base font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">{{ video.title }}</h3>
              <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                <span class="flex items-center mr-4">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  {{ video.views }}
                </span>
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                  </svg>
                  {{ video.likes }}
                </span>
              </div>
              <div class="flex justify-between items-center">
                <div class="flex items-center">
                  <div class="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs font-semibold mr-2">
                    {{ (userStore.username || 'U').charAt(0).toUpperCase() }}
                  </div>
                  <span class="text-sm text-gray-600 dark:text-gray-300">{{ userStore.username || '未知用户' }}</span>
                </div>
                <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(video.publishedAt) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="text-center py-12">
          <div class="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">还没有发布过视频</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-6">发布你的第一个视频，让更多人看到你的创作吧</p>
          <router-link to="/upload" class="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
            <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            发布第一个视频
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const userStore = useUserStore()

// 模拟视频数据
const videos = ref([
  {
    id: '1',
    title: '测试视频1',
    cover: 'https://picsum.photos/400/225?random=1',
    duration: 120,
    views: 100,
    likes: 10,
    publishedAt: new Date()
  },
  {
    id: '2',
    title: '测试视频2',
    cover: 'https://picsum.photos/400/225?random=2',
    duration: 180,
    views: 200,
    likes: 20,
    publishedAt: new Date()
  }
])

// 格式化视频时长
const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// 格式化发布日期
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString()
}

// 处理退出登录
const handleLogout = async () => {
  try {
    await userStore.logout()
    // 退出登录后跳转到首页
    router.push('/')
  } catch (error) {
    console.error('退出登录失败:', error)
  }
}

// 生命周期
onMounted(() => {
  // 检查用户是否已登录，如果未登录则跳转到登录页面
  if (!userStore.isLoggedIn) {
    router.push('/')
  }
})
</script>

<style scoped>
/* 样式保持与现有设计一致 */
</style>