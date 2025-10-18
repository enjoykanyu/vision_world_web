<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
    <!-- 登录成功动画 -->
    <LoginSuccessAnimation 
      :visible="showLoginAnimation" 
      :consecutive-days="consecutiveLoginDays"
      @close="closeLoginAnimation" 
    />
    <!-- 顶部导航栏 -->
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
      <div class="max-w-screen-xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center space-x-8">
            <div class="flex items-center">
              <svg class="w-8 h-8 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm-1 14.5v-9l7 4.5-7 4.5z"/>
                <path d="M12 5.5c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5 6.5-2.91 6.5-6.5-2.91-6.5-6.5-6.5zm3.5 6.5l-5 3v-6l5 3z" fill-opacity="0.6"/>
              </svg>
              <span class="ml-2 text-xl font-bold text-gray-900 dark:text-white">VisionWorld</span>
            </div>
          </div>

          <!-- 主导航 -->
          <nav class="hidden md:flex items-center space-x-6 text-sm">
            <a href="#" class="text-purple-600 font-medium relative group">
              首页
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#" class="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 relative group">
              发现
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#" class="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 relative group">
              直播
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#" class="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 relative group">
              创作者
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#" class="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 relative group">
              会员
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
            </a>
          </nav>

          <!-- 搜索和用户 -->
          <div class="flex items-center space-x-4">
            <!-- 测试登录动画按钮 -->
            <button @click="handleTestLogin" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
              测试登录动画
            </button>
            
            <!-- 深色模式切换 -->
            <button @click="toggleDarkMode" class="text-gray-500 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
              <svg v-if="isDarkMode" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fill-rule="evenodd" clip-rule="evenodd"></path>
              </svg>
              <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
              </svg>
            </button>
            
            <!-- 搜索框 -->
            <div class="hidden md:block relative">
              <div 
                class="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 w-80 transition-colors duration-300 group focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-opacity-50"
                :class="{'rounded-b-none': showSearchTrending}"
              >
                <input 
                  type="text" 
                  placeholder="搜索视频、创作者..." 
                  class="bg-transparent text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 outline-none text-sm flex-1 transition-colors duration-300"
                  @focus="showSearchTrending = true"
                  @blur="handleSearchBlur"
                  v-model="searchQuery"
                >
                <svg 
                  class="w-4 h-4 text-gray-400 dark:text-gray-500 cursor-pointer group-focus-within:text-purple-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  @click="handleSearch"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
            </div>
            
            <!-- 通知图标 -->
            <div class="relative hidden sm:block">
              <button class="text-gray-500 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-400">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
              </button>
              <span class="absolute -top-1 -right-1 bg-purple-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">3</span>
            </div>
            
            <!-- 上传按钮 -->
            <button class="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              上传
            </button>
            
            <!-- 用户头像 -->
            <div 
              class="w-9 h-9 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center cursor-pointer border-2 border-white dark:border-gray-800 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              @click="handleUserIconClick"
            >
              <span class="text-white text-sm font-semibold">{{ isLoggedIn ? username.charAt(0).toUpperCase() : 'V' }}</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <div class="max-w-screen-xl mx-auto px-4 py-6">
      <!-- 轮播图区域 -->
      <div class="mb-8">
        <div class="relative h-64 md:h-80 rounded-xl overflow-hidden shadow-lg">
          <div v-for="(slide, index) in carouselSlides" :key="index"
               :class="['absolute inset-0 transition-all duration-700', 
                       currentSlide === index ? 'opacity-100 scale-100' : 'opacity-0 scale-105']">
            <img :src="slide.image" :alt="slide.title" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div class="absolute bottom-8 left-8 text-white max-w-lg">
              <h2 class="text-2xl md:text-3xl font-bold mb-2 drop-shadow-md">{{ slide.title }}</h2>
              <p class="text-sm md:text-base opacity-90 drop-shadow-md">{{ slide.subtitle }}</p>
              <button class="mt-4 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                立即观看
              </button>
            </div>
          </div>
          
          <!-- 轮播指示器 -->
          <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
            <div v-for="(slide, index) in carouselSlides" :key="index" 
                 @click="currentSlide = index"
                 :class="['w-3 h-3 rounded-full transition-all duration-300 cursor-pointer shadow-md', 
                         currentSlide === index ? 'bg-purple-500 scale-110' : 'bg-white/70 hover:bg-white']">
            </div>
          </div>
          
          <!-- 轮播控制按钮 -->
          <button @click="prevSlide" class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <button @click="nextSlide" class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- 视频网格 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div v-for="(video, index) in videos" :key="index" 
             class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
             @click="router.push(`/video/${video.id}`)">
          <div class="relative">
            <img :src="video.cover" :alt="video.title" class="w-full aspect-video object-cover">
            <div class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">{{ video.duration }}</div>
          </div>
          <div class="p-3">
            <h3 class="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-2">{{ video.title }}</h3>
            <div class="flex items-center">
              <img :src="video.authorAvatar" alt="Author" class="w-6 h-6 rounded-full mr-2">
              <span class="text-xs text-gray-600 dark:text-gray-400">{{ video.author }}</span>
            </div>
            <div class="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span>{{ video.views }}次观看</span>
              <span class="mx-1">•</span>
              <span>{{ video.uploadTime }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 底部导航栏 (移动端) -->
    <div class="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
      <div class="flex justify-around items-center h-14">
        <a href="#" class="flex flex-col items-center justify-center text-purple-600">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
          </svg>
          <span class="text-xs mt-1">首页</span>
        </a>
        <a href="#" class="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
          </svg>
          <span class="text-xs mt-1">发现</span>
        </a>
        <a href="#" class="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
          <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </div>
        </a>
        <a href="#" class="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
          </svg>
          <span class="text-xs mt-1">通知</span>
        </a>
        <a href="#" class="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd"></path>
          </svg>
          <span class="text-xs mt-1">我的</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import LoginSuccessAnimation from '@/components/LoginSuccessAnimation.vue'
import { useLoginAnimation } from '@/composables/useLoginAnimation'

const router = useRouter()

// 登录成功动画
const { 
  showLoginAnimation, 
  consecutiveLoginDays, 
  triggerLoginSuccessAnimation, 
  closeLoginAnimation,
  performLogin 
} = useLoginAnimation()

// 模拟登录触发（用于测试，实际应该在登录表单中调用）
const handleTestLogin = async () => {
  try {
    await performLogin({ username: 'testuser', password: 'password' })
    await triggerLoginSuccessAnimation()
  } catch (error) {
    console.error('登录失败:', error)
  }
}

// 深色模式
const isDarkMode = ref(localStorage.getItem('darkMode') === 'true' || window.matchMedia('(prefers-color-scheme: dark)').matches)

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('darkMode', isDarkMode.value.toString())
  
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// 初始化深色模式
onMounted(() => {
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  }
})

// 搜索功能
const searchQuery = ref('')
const showSearchTrending = ref(false)

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchQuery.value)}`)
    showSearchTrending.value = false
  }
}

const handleSearchBlur = () => {
  // 延迟关闭，以便点击搜索趋势项
  setTimeout(() => {
    showSearchTrending.value = false
  }, 200)
}

// 用户相关
const isLoggedIn = ref(false)
const username = ref('用户')

const handleUserIconClick = () => {
  if (isLoggedIn.value) {
    router.push('/user/profile')
  } else {
    router.push('/login')
  }
}

// 轮播图
const carouselSlides = ref([
  {
    id: 1,
    title: '探索宇宙的奥秘',
    subtitle: '跟随NASA最新探测器，揭开太阳系外行星的神秘面纱',
    image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 2,
    title: '2025全球科技峰会',
    subtitle: '直播全球顶尖科技公司的最新产品发布会',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 3,
    title: '自然纪录片：深海探秘',
    subtitle: '潜入海洋最深处，探索未知的海底世界',
    image: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&w=1200&q=80'
  }
])

const currentSlide = ref(0)

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % carouselSlides.value.length
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + carouselSlides.value.length) % carouselSlides.value.length
}

// 自动轮播
onMounted(() => {
  const interval = setInterval(() => {
    nextSlide()
  }, 5000)

  return () => clearInterval(interval)
})

// 分类
const categories = ref([
  { id: 'all', name: '全部' },
  { id: 'tech', name: '科技' },
  { id: 'gaming', name: '游戏' },
  { id: 'music', name: '音乐' },
  { id: 'education', name: '教育' },
  { id: 'entertainment', name: '娱乐' },
  { id: 'sports', name: '体育' },
  { id: 'travel', name: '旅行' },
  { id: 'food', name: '美食' },
  { id: 'fashion', name: '时尚' }
])

const currentCategory = ref('all')

// 推荐视频数据
const recommendedVideos = ref([
  {
    id: 1,
    title: '2025年最值得期待的十大科技产品',
    cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    duration: '12:34',
    author: '科技前沿',
    authorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    views: '128万',
    uploadTime: '3天前'
  },
  {
    id: 2,
    title: '如何在30天内掌握Vue 3和TypeScript',
    cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    duration: '25:12',
    author: '编程学院',
    authorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    views: '45万',
    uploadTime: '1周前'
  },
  {
    id: 3,
    title: '探秘世界上最神奇的十大自然现象',
    cover: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80',
    duration: '18:45',
    author: '自然探索',
    authorAvatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    views: '89万',
    uploadTime: '2周前'
  },
  {
    id: 4,
    title: '2025年最热门的旅游目的地推荐',
    cover: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80',
    duration: '14:22',
    author: '环球旅行',
    authorAvatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    views: '56万',
    uploadTime: '5天前'
  }
])

// 视频列表数据
const allVideos = ref([
  {
    id: '1',
    title: '大自然的声音 - 森林小溪',
    cover: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80',
    duration: '0:05',
    author: '自然之声',
    authorAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    views: '1.2M',
    uploadTime: '1天前',
    category: 'music'
  },
  {
    id: '2',
    title: '钢琴独奏 - 月光奏鸣曲',
    cover: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=600&q=80',
    duration: '0:10',
    author: '古典音乐频道',
    authorAvatar: 'https://randomuser.me/api/portraits/men/85.jpg',
    views: '890K',
    uploadTime: '2天前',
    category: 'music'
  },
  {
    id: '3',
    title: '城市街头音乐表演',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    duration: '0:15',
    author: '街头艺术家',
    authorAvatar: 'https://randomuser.me/api/portraits/women/76.jpg',
    views: '3.5M',
    uploadTime: '3天前',
    category: 'entertainment'
  },
  {
    id: '4',
    title: '电子音乐混音 - 未来之声',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
    duration: '0:20',
    author: 'DJ电音制作人',
    authorAvatar: 'https://randomuser.me/api/portraits/men/29.jpg',
    views: '450K',
    uploadTime: '1周前',
    category: 'music'
  },
  {
    id: '5',
    title: '雨声 - 自然白噪音',
    cover: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80',
    duration: '0:30',
    author: '冥想音乐频道',
    authorAvatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    views: '1.1M',
    uploadTime: '4天前',
    category: 'education'
  },
  {
    id: '6',
    title: '民谣吉他弹唱 - 乡间小路',
    cover: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=600&q=80',
    duration: '0:05',
    author: '民谣歌手',
    authorAvatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    views: '780K',
    uploadTime: '5天前',
    category: 'music'
  }
])

// 根据当前分类筛选视频
const videos = computed(() => {
  if (currentCategory.value === 'all') {
    return allVideos.value
  } else {
    return allVideos.value.filter(video => video.category === currentCategory.value)
  }
})

// 格式化数字（预留）
const formatNumber = (num: string) => {
  return num
}
</script>

<style scoped>
/* 隐藏滚动条但保留功能 */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}

/* 文本截断 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>