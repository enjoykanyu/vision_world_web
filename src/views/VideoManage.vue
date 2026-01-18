<template>
  <div class="video-manage">
    <div class="bg-white rounded-xl shadow-sm border border-bilibili-gray-200 p-6">
      <h2 class="text-2xl font-bold text-bilibili-gray-900 mb-6">稿件管理</h2>
      
      <!-- 内容类型导航 -->
      <div class="border-b border-bilibili-gray-200 mb-6">
        <ul class="flex space-x-8">
          <li>
            <button class="py-3 px-1 border-b-2 border-bilibili-primary text-bilibili-primary font-medium">
              视频
            </button>
          </li>
          <li>
            <button class="py-3 px-1 border-b-2 border-transparent text-bilibili-gray-600 hover:text-bilibili-gray-900 transition-colors">
              专栏
            </button>
          </li>
          <li>
            <button class="py-3 px-1 border-b-2 border-transparent text-bilibili-gray-600 hover:text-bilibili-gray-900 transition-colors">
              动态
            </button>
          </li>
          <li>
            <button class="py-3 px-1 border-b-2 border-transparent text-bilibili-gray-600 hover:text-bilibili-gray-900 transition-colors">
              音频
            </button>
          </li>
        </ul>
      </div>
      
      <!-- 筛选和搜索 -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-3 md:space-y-0">
        <div class="flex space-x-3">
          <button class="border border-bilibili-gray-300 text-bilibili-gray-700 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-bilibili-gray-50 transition-colors">
            全部
          </button>
          <button class="border border-bilibili-gray-300 text-bilibili-gray-700 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-bilibili-gray-50 transition-colors">
            待审核
          </button>
          <button class="border border-bilibili-gray-300 text-bilibili-gray-700 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-bilibili-gray-50 transition-colors">
            审核通过
          </button>
          <button class="border border-bilibili-gray-300 text-bilibili-gray-700 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-bilibili-gray-50 transition-colors">
            审核未通过
          </button>
          <button class="border border-bilibili-gray-300 text-bilibili-gray-700 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-bilibili-gray-50 transition-colors">
            草稿箱
          </button>
        </div>
        <div class="flex space-x-3">
          <div class="relative">
            <input 
              type="text" 
              class="w-full md:w-64 border border-bilibili-gray-300 rounded-lg px-4 py-1.5 pr-10 focus:outline-none focus:ring-2 focus:ring-bilibili-primary/50 text-sm"
              placeholder="搜索视频标题"
            >
            <button class="absolute right-3 top-1/2 transform -translate-y-1/2 text-bilibili-gray-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
          </div>
          <button class="bg-bilibili-primary text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-bilibili-primary/90 transition-colors">
            筛选
          </button>
        </div>
      </div>
      
      <!-- 表格 -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-bilibili-gray-200">
              <th class="text-left py-3 px-4 text-sm font-semibold text-bilibili-gray-700">
                <input type="checkbox" class="rounded border-bilibili-gray-300 text-bilibili-primary focus:ring-bilibili-primary/50">
              </th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-bilibili-gray-700">视频信息</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-bilibili-gray-700">播放量</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-bilibili-gray-700">点赞数</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-bilibili-gray-700">状态</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-bilibili-gray-700">发布时间</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-bilibili-gray-700">操作</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="loading">
              <tr>
                <td colspan="7" class="py-8 px-4 text-center">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-bilibili-primary mx-auto"></div>
                  <p class="mt-2 text-sm text-bilibili-gray-500">加载中...</p>
                </td>
              </tr>
            </template>
            <template v-else-if="videos.length === 0">
              <tr>
                <td colspan="7" class="py-8 px-4 text-center">
                  <div class="w-16 h-16 bg-bilibili-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <svg class="w-8 h-8 text-bilibili-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <p class="mt-3 text-sm text-bilibili-gray-500">暂无视频</p>
                </td>
              </tr>
            </template>
            <template v-else>
              <tr 
                v-for="video in videos" 
                :key="video.id" 
                class="border-b border-bilibili-gray-100 hover:bg-bilibili-gray-50 transition-colors"
              >
                <td class="py-4 px-4">
                  <input type="checkbox" class="rounded border-bilibili-gray-300 text-bilibili-primary focus:ring-bilibili-primary/50">
                </td>
                <td class="py-4 px-4">
                  <div class="flex items-center space-x-4">
                    <div class="w-24 h-14 bg-bilibili-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        v-if="video.cover_url" 
                        :src="video.cover_url.replace(/`/g, '')" 
                        :alt="video.title" 
                        class="w-full h-full object-cover"
                      >
                      <div 
                        v-else 
                        class="w-full h-full bg-gradient-to-br from-bilibili-primary/20 to-bilibili-secondary/20 flex items-center justify-center"
                      >
                        <svg class="w-8 h-8 text-bilibili-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                    </div>
                    <div>
                      <div class="font-medium text-bilibili-gray-900 text-sm line-clamp-2">{{ video.title }}</div>
                      <div class="text-xs text-bilibili-gray-600 mt-1">视频ID: {{ video.id }}</div>
                    </div>
                  </div>
                </td>
                <td class="py-4 px-4 text-sm text-bilibili-gray-600">{{ video.play_count }}</td>
                <td class="py-4 px-4 text-sm text-bilibili-gray-600">{{ video.like_count || 0 }}</td>
                <td class="py-4 px-4">
                  <span class="px-2 py-0.5 text-xs bg-bilibili-success/10 text-bilibili-success rounded-full">已发布</span>
                </td>
                <td class="py-4 px-4 text-sm text-bilibili-gray-600">{{ new Date(video.create_time * 1000).toLocaleString() }}</td>
                <td class="py-4 px-4">
                  <div class="flex space-x-2">
                    <button class="text-bilibili-primary text-xs hover:underline">编辑</button>
                    <button class="text-bilibili-primary text-xs hover:underline" @click="viewVideo(video.id)">查看</button>
                    <button class="text-bilibili-gray-600 text-xs hover:underline">更多</button>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      
      <!-- 分页 -->
      <div class="flex justify-center items-center mt-6">
        <div class="flex space-x-1">
          <button 
            class="px-3 py-1 border border-bilibili-gray-300 rounded-lg text-sm text-bilibili-gray-600 hover:bg-bilibili-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" 
            :disabled="currentPage <= 1"
            @click="prevPage"
          >
            上一页
          </button>
          <button 
            class="px-3 py-1 border border-bilibili-primary bg-bilibili-primary text-white rounded-lg text-sm"
          >
            {{ currentPage }}
          </button>
          <button 
            class="px-3 py-1 border border-bilibili-gray-300 rounded-lg text-sm text-bilibili-gray-600 hover:bg-bilibili-gray-50"
            :disabled="!hasMore"
          >
            {{ currentPage + 1 }}
          </button>
          <button 
            class="px-3 py-1 border border-bilibili-gray-300 rounded-lg text-sm text-bilibili-gray-600 hover:bg-bilibili-gray-50"
            :disabled="!hasMore"
          >
            {{ currentPage + 2 }}
          </button>
          <button 
            class="px-3 py-1 border border-bilibili-gray-300 rounded-lg text-sm text-bilibili-gray-600 hover:bg-bilibili-gray-50"
            :disabled="!hasMore"
          >
            下一页
          </button>
        </div>
        <div class="ml-4 text-sm text-bilibili-gray-500">
          共 {{ total }} 条，第 {{ currentPage }} 页
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'
import { videoAPI } from '@/api/video'

// 初始化用户store
const userStore = useUserStore()
const router = useRouter()

// 视频列表数据
const videos = ref<any[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const hasMore = ref(true)
const loading = ref(false)

// 获取用户发布的视频列表
const fetchUserVideos = async () => {
  if (loading.value) return
  
  loading.value = true
  
  try {
    const response = await videoAPI.getUserPublishedVideos({
      page: currentPage.value,
      page_size: pageSize.value
    })
    
    if (response.data.status_code === 0) {
      videos.value = response.data.videos
      total.value = response.data.total
      hasMore.value = response.data.has_more
    } else {
      console.error('获取视频列表失败:', response.data.status_msg)
    }
  } catch (error) {
    console.error('获取视频列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 页码变化
const changePage = (page: number) => {
  currentPage.value = page
  fetchUserVideos()
}

// 上一页
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchUserVideos()
  }
}

// 下一页
const nextPage = () => {
  if (hasMore.value) {
    currentPage.value++
    fetchUserVideos()
  }
}

// 查看视频详情
const viewVideo = (videoId: number) => {
  router.push(`/video/${videoId}`)
}

// 组件挂载时获取视频列表
onMounted(() => {
  fetchUserVideos()
})
</script>

<style scoped>
/* 表格样式 */
table {
  border-collapse: collapse;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>