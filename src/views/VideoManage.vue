<template>
  <SideNav>
    <div class="min-h-screen bg-bilibili-bg-secondary">
      <!-- 主要内容区域 -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <!-- 创作中心标题 -->
        <div class="bg-white dark:bg-gray-800 rounded-bilibili-lg shadow-bilibili-sm border border-bilibili-border-primary mb-6 overflow-hidden">
          <div class="px-6 py-4 border-b border-bilibili-border-primary">
            <h1 class="text-xl font-semibold text-bilibili-primary">创作中心</h1>
          </div>
          <div class="px-6 py-2">
            <div class="flex space-x-8 border-b border-bilibili-border-primary">
              <button class="py-3 px-1 border-b-2 border-bilibili-primary text-bilibili-primary font-medium">我的投稿</button>
              <button class="py-3 px-1 border-b-2 border-transparent text-bilibili-gray-600 hover:text-bilibili-primary hover:border-bilibili-primary transition-colors">创作收益</button>
              <button class="py-3 px-1 border-b-2 border-transparent text-bilibili-gray-600 hover:text-bilibili-primary hover:border-bilibili-primary transition-colors">数据中心</button>
            </div>
          </div>
        </div>

        <!-- 视频列表 -->
        <div class="bg-white dark:bg-gray-800 rounded-bilibili-lg shadow-bilibili-sm border border-bilibili-border-primary p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-lg font-semibold text-bilibili-gray-800 dark:text-white">已发布的视频</h2>
            <div class="flex items-center space-x-3">
              <button 
                @click="refreshVideos" 
                class="px-3 py-2 bg-bilibili-gray-200 hover:bg-bilibili-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-bilibili-gray-700 dark:text-gray-300 rounded-bilibili-lg transition-all duration-200 font-medium shadow-bilibili-sm hover:shadow-bilibili-md flex items-center"
                :disabled="isLoading"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                刷新
              </button>
              <router-link to="/upload" class="px-4 py-2 bg-bilibili-primary hover:bg-bilibili-primary-dark text-white rounded-bilibili-lg transition-all duration-200 font-medium shadow-bilibili-sm hover:shadow-bilibili-md transform hover:-translate-y-0.5">
                <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                发布新视频
              </router-link>
            </div>
          </div>

          <!-- 错误提示 -->
          <div v-if="isError" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-bilibili-lg p-4 mb-6">
            <div class="flex items-center space-x-3">
              <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p class="text-sm text-red-600 dark:text-red-400">{{ errorMessage }}</p>
            </div>
          </div>

          <!-- 加载状态 -->
          <div v-if="isLoading && videos.length === 0" class="text-center py-12">
            <div class="w-24 h-24 bg-bilibili-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-12 h-12 text-bilibili-gray-400 dark:text-gray-500 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-bilibili-gray-800 dark:text-white mb-2">加载中...</h3>
            <p class="text-bilibili-gray-600 dark:text-gray-400">正在获取你的视频列表，请稍候</p>
          </div>

          <!-- 视频列表 -->
          <div v-else-if="videos.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div 
              v-for="video in videos" 
              :key="video.id" 
              class="video-card bg-white dark:bg-gray-800 rounded-bilibili-lg overflow-hidden shadow-bilibili-sm hover:shadow-bilibili-md transition-all duration-300 transform hover:-translate-y-1 border border-bilibili-border-primary"
            >
              <div class="relative video-cover-group">
                <img 
                  :src="video.cover" 
                  :alt="video.title" 
                  class="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                >
                <div class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-bilibili-sm">
                  {{ formatDuration(video.duration) }}
                </div>
                <!-- 视频状态标签 -->
                <div v-if="video.status" class="absolute top-2 left-2">
                  <span 
                    class="text-xs px-2 py-1 rounded-bilibili-sm" 
                    :class="getVideoStatusClass(video.status)"
                  >
                    {{ getVideoStatusText(video.status) }}
                  </span>
                </div>
                <!-- 播放按钮遮罩 -->
                <div class="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div class="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/50 transition-all duration-300">
                    <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div class="p-4">
                <h3 class="text-base font-medium text-bilibili-gray-800 dark:text-white mb-2 line-clamp-2 hover:text-bilibili-primary transition-colors duration-200 cursor-pointer">{{ video.title }}</h3>
                <div class="flex items-center justify-between text-sm text-bilibili-gray-600 dark:text-gray-400 mb-3">
                  <div class="flex items-center space-x-4">
                    <span class="flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                      {{ formatNumber(video.views) }}
                    </span>
                    <span class="flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                      </svg>
                      {{ formatNumber(video.likes) }}
                    </span>
                    <span class="flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                      </svg>
                      {{ formatNumber(video.comments || 0) }}
                    </span>
                  </div>
                </div>
                <div class="flex justify-between items-center">
                  <div class="flex items-center">
                    <div class="w-6 h-6 bg-bilibili-primary rounded-full flex items-center justify-center text-white text-xs font-semibold mr-2">
                      {{ (userStore.username || 'U').charAt(0).toUpperCase() }}
                    </div>
                    <span class="text-sm text-bilibili-gray-600 dark:text-gray-300">{{ userStore.username || '未知用户' }}</span>
                  </div>
                  <span class="text-xs text-bilibili-gray-500 dark:text-gray-400">{{ formatDate(video.publishedAt) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-else class="text-center py-12">
            <div class="w-24 h-24 bg-bilibili-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-12 h-12 text-bilibili-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-bilibili-gray-800 dark:text-white mb-2">还没有发布过视频</h3>
            <p class="text-bilibili-gray-600 dark:text-gray-400 mb-6">发布你的第一个视频，让更多人看到你的创作吧</p>
            <router-link to="/upload" class="px-6 py-3 bg-bilibili-primary hover:bg-bilibili-primary-dark text-white rounded-bilibili-lg transition-all duration-200 font-medium shadow-bilibili-sm hover:shadow-bilibili-md transform hover:-translate-y-0.5">
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              发布第一个视频
            </router-link>
          </div>

          <!-- 加载更多 -->
          <div v-if="hasMore && videos.length > 0" class="text-center py-6">
            <button 
              @click="loadMoreVideos" 
              class="px-6 py-2 bg-bilibili-gray-200 hover:bg-bilibili-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-bilibili-gray-700 dark:text-gray-300 rounded-bilibili-lg transition-all duration-200 font-medium shadow-bilibili-sm hover:shadow-bilibili-md flex items-center mx-auto"
              :disabled="isLoading"
            >
              <svg v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isLoading ? '加载中...' : '加载更多' }}
            </button>
          </div>

          <!-- 分页信息 -->
          <div v-if="videos.length > 0" class="text-center py-4 text-sm text-bilibili-gray-600 dark:text-gray-400">
            <p>共 {{ totalVideos }} 个视频，当前显示第 {{ currentPage }} 页</p>
          </div>
        </div>
      </div>
    </div>
  </SideNav>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { videoAPI, transformApiVideoToLocal } from '@/api/video'
import SideNav from '@/components/SideNav.vue'

const router = useRouter()
const userStore = useUserStore()

// 视频列表数据
const videos = ref<Array<{
  id: string
  title: string
  cover: string
  duration: number
  views: number
  likes: number
  comments?: number
  publishedAt: Date
  type?: string
  source?: string
  status?: string
}>>([])

// 分页数据
const currentPage = ref(1)
const pageSize = ref(10)
const totalVideos = ref(0)
const hasMore = ref(false)

// 加载状态
const isLoading = ref(false)
const isError = ref(false)
const errorMessage = ref('')

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

// 格式化数字（如1.2万）
const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toString()
}

// 获取视频状态文本
const getVideoStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'uploading': '上传中',
    'reviewing': '审核中',
    'published': '已发布',
    'rejected': '已驳回',
    'banned': '已下架',
    'draft': '草稿'
  }
  return statusMap[status] || status
}

// 获取视频状态样式类
const getVideoStatusClass = (status: string) => {
  const statusClassMap: Record<string, string> = {
    'uploading': 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    'reviewing': 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    'published': 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    'rejected': 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    'banned': 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    'draft': 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
  }
  return statusClassMap[status] || 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
}

// 加载用户发布的视频列表
const loadUserVideos = async (page: number = 1, shouldReset: boolean = false) => {
  if (isLoading.value) return
  
  try {
    isLoading.value = true
    isError.value = false
    errorMessage.value = ''
    
    const response = await videoAPI.getUserPublishedVideos({
      page,
      page_size: pageSize.value
    })
    
    // 根据ApiResponse接口，数据应该在response.data.data中
    const apiResponse = response.data
    const videoResponse = apiResponse.data
    
    // 检查业务状态码
    if (apiResponse.code === 0) {
      // 确保videoResponse有正确的结构
      if (videoResponse && Array.isArray(videoResponse.videos)) {
        const transformedVideos = videoResponse.videos.map((video: any) => {
              const localVideo = transformApiVideoToLocal(video)
              return {
                id: localVideo.id,
                title: localVideo.title,
                cover: localVideo.poster,
                duration: parseInt(video.duration as any),
                views: parseInt(video.view_count as any),
                likes: parseInt(video.like_count as any),
                comments: parseInt(video.comment_count as any) || 0,
                publishedAt: new Date(video.published_at),
                type: video.type,
                source: video.source,
                status: video.status || 'published' // 添加视频状态，默认为已发布
              }
            })
        
        if (shouldReset) {
          videos.value = transformedVideos
        } else {
          videos.value = [...videos.value, ...transformedVideos]
        }
        
        totalVideos.value = videoResponse.total || 0
        hasMore.value = videoResponse.has_more || false
        currentPage.value = page
      } else {
        throw new Error('视频列表数据格式不正确')
      }
    } else {
      throw new Error(apiResponse.message || '获取视频列表失败')
    }
  } catch (error) {
    console.error('获取用户发布的视频列表失败:', error)
    isError.value = true
    errorMessage.value = error instanceof Error ? error.message : '获取视频列表失败，请稍后重试'
  } finally {
    isLoading.value = false
  }
}

// 加载更多视频
const loadMoreVideos = () => {
  if (hasMore.value && !isLoading.value) {
    loadUserVideos(currentPage.value + 1)
  }
}

// 刷新视频列表
const refreshVideos = () => {
  loadUserVideos(1, true)
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
  } else {
    // 加载用户发布的视频列表
    loadUserVideos()
  }
})
</script>

<style scoped>
/* 样式保持与现有设计一致 */
</style>