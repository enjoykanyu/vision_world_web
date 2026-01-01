<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 使用导航头组件 -->
    <NavHeader 
      :isLoggedIn="userStore.isLoggedIn" 
      :username="userStore.username" 
      :showSearchBox="false"
      @login="showLoginModal = true"
      @toggleDarkMode="toggleDarkMode"
    />

    <!-- 顶部搜索框 -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-6">
      <div class="max-w-screen-xl mx-auto px-4">
        <div class="flex items-center justify-center">
          <div class="w-full max-w-3xl">
            <div class="flex items-center space-x-2">
              <!-- 搜索输入框 -->
              <div class="flex-1 relative">
                <input 
                  type="text" 
                  placeholder="搜索视频、创作者..." 
                  class="w-full px-5 py-3 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700" 
                  v-model="searchQuery"
                >
                <svg class="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <!-- 搜索按钮 -->
              <button 
                class="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-full transition-colors duration-200 shadow-md hover:shadow-lg" 
                @click="handleSearch"
              >
                搜索
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索结果页面头部 -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4">
      <div class="max-w-screen-xl mx-auto px-4">

        <!-- 搜索结果统计 -->
        <div class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          共找到 {{ totalResults }} 个结果
        </div>

        <!-- 搜索分类 -->
        <div class="flex items-center space-x-1 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          <button
            v-for="tab in searchTabs"
            :key="tab.key"
            class="px-5 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 relative"
            :class="[
              activeTab === tab.key
                ? 'text-purple-600 dark:text-purple-400'
                : 'text-gray-600 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-300'
            ]"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
            <span v-if="tab.count" class="ml-1 text-xs text-gray-500 dark:text-gray-400">({{ tab.count }})</span>
            <!-- 激活状态下划线 -->
            <span
              v-if="activeTab === tab.key"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400 transition-all duration-200"
            ></span>
          </button>
        </div>

        <!-- 排序选项 -->
        <div class="flex items-center space-x-2 mb-4">
          <span class="text-sm text-gray-600 dark:text-gray-400">排序：</span>
          <div class="flex items-center space-x-1">
            <button
              v-for="sort in sortOptions"
              :key="sort.value"
              class="px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all duration-200 rounded-md"
              :class="[
                sortBy === sort.value
                  ? 'bg-purple-600 dark:bg-purple-700 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              ]"
              @click="sortBy = sort.value"
            >
              {{ sort.label }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索结果内容 -->
    <div class="max-w-screen-xl mx-auto px-4 py-6">
      <!-- 搜索结果列表 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <!-- 单个视频卡片 -->
        <div
          v-for="video in videos"
          :key="video.id"
          class="bg-white dark:bg-gray-800 rounded-bilibili-lg overflow-hidden transition-all duration-300 hover:shadow-bilibili-md transform hover:-translate-y-0.5 hover:scale-105"
        >
          <!-- 视频封面 -->
          <div class="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              :src="video.cover_url || 'https://via.placeholder.com/300x169'"
              alt="视频封面"
              class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            >
            <!-- 视频时长 -->
            <div class="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-0.5 rounded-bilibili-sm">
              {{ formatDuration(video.duration) }}
            </div>
          </div>

          <!-- 视频信息 -->
          <div class="p-3">
            <!-- 视频标题 -->
            <h3 class="text-base font-medium text-bilibili-text-primary dark:text-white line-clamp-2 mb-2 hover:text-bilibili-primary transition-colors duration-200 cursor-pointer">
              {{ video.title }}
            </h3>

            <!-- 作者信息 -->
            <div class="flex items-center mb-2">
              <div class="w-6 h-6 bg-gradient-to-br from-bilibili-primary to-bilibili-secondary rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                <span class="text-white text-xs font-semibold">{{ (video.author.username || 'U').charAt(0).toUpperCase() }}</span>
              </div>
              <span class="text-sm text-bilibili-text-secondary dark:text-gray-400 line-clamp-1 hover:text-bilibili-primary transition-colors">{{ video.author.username || '未知UP主' }}</span>
            </div>

            <!-- 播放量和发布时间 -->
            <div class="flex items-center text-sm text-bilibili-text-secondary dark:text-gray-500 space-x-4">
              <span>{{ formatPlayCount(video.view_count || 0) }}播放</span>
              <span>{{ formatPublishTime(video.create_time || Date.now() / 1000) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载更多按钮 -->
        <div class="flex justify-center mt-8">
          <button
            v-if="hasMore"
            :disabled="isLoading"
            class="px-8 py-3 bg-gradient-to-r from-bilibili-primary to-bilibili-secondary text-white rounded-bilibili-lg font-medium transition-all duration-200 hover:from-bilibili-primary-dark hover:to-bilibili-secondary-dark disabled:opacity-50 disabled:cursor-not-allowed"
            @click="loadMore"
          >
          加载更多
        </button>
        <div v-else class="text-sm text-gray-500 dark:text-gray-400">没有更多内容了</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { videoAPI } from '../api/video'
import NavHeader from '../components/NavHeader.vue'
import { useUserStore } from '../stores/userStore'

const userStore = useUserStore()

const router = useRouter()
const route = useRoute()

// 登录模态框控制
const showLoginModal = ref(false)

// 深色模式切换
const toggleDarkMode = () => {
  // 深色模式切换逻辑
}

// 搜索参数
const searchQuery = ref('')
const activeTab = ref('all')
const sortBy = ref('relevance')
const page = ref(1)
const pageSize = ref(20)
const hasMore = ref(true)
const totalResults = ref(0)

// 搜索结果
interface SearchVideo {
  id: string
  title: string
  description: string
  cover_url: string
  video_url: string
  duration: number
  view_count: number
  create_time: number
  author: {
    username: string
  }
}

const videos = ref<SearchVideo[]>([])
const isLoading = ref(false)

// 搜索历史和推荐
const searchHistory = ref(['原神', '华为Mate 60', 'AI绘画', '美食教程'])
const trendingSearches = ref(['原神3.0版本更新', '2025年高考志愿填报指南', '华为Mate 60 Pro评测', '周杰伦新歌发布', '国庆节旅游攻略'])

// 搜索分类标签
const searchTabs = [
  { key: 'all', label: '综合', count: 99 },
  { key: 'video', label: '视频', count: 88 },
  { key: 'anime', label: '番剧', count: 0 },
  { key: 'movie', label: '影视', count: 0 },
  { key: 'live', label: '直播', count: 1 },
  { key: 'article', label: '专栏', count: 9 },
  { key: 'user', label: '用户', count: 9 },
]

// 排序选项
const sortOptions = [
  { value: 'relevance', label: '综合排序' },
  { value: 'play_count', label: '最多播放' },
  { value: 'created_at', label: '最新发布' },
  { value: 'danmu_count', label: '最多弹幕' },
  { value: 'favorite_count', label: '最多收藏' },
]

// 从路由参数获取搜索关键词
onMounted(() => {
  if (route.params.keyword) {
    searchQuery.value = route.params.keyword as string
    fetchSearchResults()
  }
})

// 处理搜索
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    page.value = 1
    videos.value = []
    fetchSearchResults()
    // 更新路由
    router.push({ path: `/search/${searchQuery.value}`, query: { sort: sortBy.value } })
  }
}

// 选择历史记录
const selectHistoryItem = (item: string) => {
  searchQuery.value = item
  handleSearch()
}

// 选择热门搜索
const selectTrendingItem = (item: string) => {
  searchQuery.value = item
  handleSearch()
}

// 获取搜索结果
const fetchSearchResults = async () => {
  if (isLoading.value) return
  isLoading.value = true
  try {
    const response = await videoAPI.searchVideos(searchQuery.value, { page: page.value, page_size: pageSize.value })
    const data = response.data.data
    
    if (page.value === 1) {
      videos.value = data.videos as unknown as SearchVideo[]
    } else {
      videos.value = [...videos.value, ...(data.videos as unknown as SearchVideo[])]
    }
    
    totalResults.value = data.pagination.total
    hasMore.value = data.pagination.has_next
    page.value++
  } catch (error) {
    console.error('搜索失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 加载更多
const loadMore = () => {
  if (hasMore.value && !isLoading.value) {
    fetchSearchResults()
  }
}

// 格式化视频时长
const formatDuration = (seconds: number) => {
  if (seconds < 60) {
    return `${seconds}秒`
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  } else {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }
}

// 格式化播放量
const formatPlayCount = (count: number) => {
  if (count < 10000) {
    return count.toString()
  } else if (count < 100000000) {
    return `${(count / 10000).toFixed(1)}万`
  } else {
    return `${(count / 100000000).toFixed(1)}亿`
  }
}

// 格式化发布时间
const formatPublishTime = (timestamp: number) => {
  const now = Date.now()
  const diff = now - timestamp * 1000
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 60) {
    return `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else if (days < 30) {
    return `${days}天前`
  } else {
    const date = new Date(timestamp * 1000)
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
  }
}
</script>

<style scoped>
/* 滚动条样式 */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 搜索框聚焦效果 */
input:focus {
  box-shadow: 0 0 0 2px rgba(147, 51, 234, 0.2);
  transition: all 0.3s ease;
}

/* 平滑过渡动画 */
* {
  transition: all 0.3s ease;
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 4px;
  }
  
  .px-5 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .space-x-1 > * + * {
    margin-left: 0.25rem;
  }
  
  .space-x-1 > *:last-child {
    margin-right: 1rem;
  }
}

@media (max-width: 480px) {
  .grid {
    grid-template-columns: 1fr;
  }
  
  .py-6 {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
  
  .text-base {
    font-size: 0.875rem;
  }
  
  .text-sm {
    font-size: 0.75rem;
  }
}
</style>