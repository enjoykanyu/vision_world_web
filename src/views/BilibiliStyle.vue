<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-screen-xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center space-x-8">
            <div class="flex items-center">
              <svg class="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.51.556-2.764 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.920-.373.347 0 .653.124.920.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .160-.213l2.853-2.747c.267-.249.573-.373.920-.373.347 0 .662.151.929.400.267.249.391.551.391.907 0 .356-.124.657-.373.906l-1.174 1.120zM5.333 7.24c-.746.018-1.373.276-1.880.773-.506.498-.769 1.13-.789 1.894v7.52c.02.764.283 1.395.789 1.893.507.498 1.134.756 1.880.773h13.334c.746-.017 1.373-.275 1.880-.773.506-.498.769-1.129.789-1.893v-7.52c-.02-.765-.283-1.396-.789-1.894-.507-.497-1.134-.755-1.880-.773H5.333zM8 11.107c.373 0 .684.124.933.373.249.249.373.560.373.933v1.173c0 .373-.124.684-.373.933-.249.249-.560.373-.933.373s-.684-.124-.933-.373c-.249-.249-.373-.560-.373-.933V12.413c0-.373.124-.684.373-.933.249-.249.560-.373.933-.373zm8 0c.373 0 .684.124.933.373.249.249.373.560.373.933v1.173c0 .373-.124.684-.373.933-.249.249-.560.373-.933.373s-.684-.124-.933-.373c-.249-.249-.373-.560-.373-.933V12.413c0-.373.124-.684.373-.933.249-.249.560-.373.933-.373z"/>
              </svg>
              <span class="ml-2 text-xl font-bold text-gray-900">bilibili</span>
            </div>
            
            <!-- 主导航 -->
            <nav class="hidden md:flex items-center space-x-6 text-sm">
              <a href="#" class="text-blue-500 font-medium">首页</a>
              <a href="#" class="text-gray-600 hover:text-blue-500">番剧</a>
              <a href="#" class="text-gray-600 hover:text-blue-500">直播</a>
              <a href="#" class="text-gray-600 hover:text-blue-500">游戏中心</a>
              <a href="#" class="text-gray-600 hover:text-blue-500">会员购</a>
              <a href="#" class="text-gray-600 hover:text-blue-500">漫画</a>
              <a href="#" class="text-gray-600 hover:text-blue-500">赛事</a>
            </nav>
          </div>

          <!-- 搜索和用户 -->
          <div class="flex items-center space-x-4">
            <!-- 搜索框 -->
            <div class="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-80">
              <input type="text" placeholder="搜索视频、番剧、UP主..." class="bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm flex-1">
              <svg class="w-4 h-4 text-gray-400 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            
            <!-- 投稿按钮 -->
            <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium">
              投稿
            </button>
            
            <!-- 用户头像 -->
            <div class="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center cursor-pointer">
              <span class="text-white text-sm font-semibold">U</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="max-w-screen-xl mx-auto px-4 py-6">
      <!-- 轮播图区域 -->
      <div class="mb-6">
        <div class="relative h-64 rounded-lg overflow-hidden">
          <div v-for="(slide, index) in carouselSlides" :key="index"
               :class="['absolute inset-0 transition-opacity duration-500', 
                       currentSlide === index ? 'opacity-100' : 'opacity-0']">
            <img :src="slide.image" :alt="slide.title" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div class="absolute bottom-6 left-6 text-white">
              <h2 class="text-xl font-bold mb-2">{{ slide.title }}</h2>
              <p class="text-sm opacity-90">{{ slide.subtitle }}</p>
            </div>
          </div>
          
          <!-- 轮播指示器 -->
          <div class="absolute bottom-4 right-4 flex space-x-2">
            <div v-for="(slide, index) in carouselSlides" :key="index" 
                 @click="currentSlide = index"
                 :class="['w-2 h-2 rounded-full transition-all duration-300 cursor-pointer', 
                         currentSlide === index ? 'bg-white' : 'bg-white/50']">
            </div>
          </div>
        </div>
      </div>

      <!-- 推荐视频网格 -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
        <div v-for="video in recommendedVideos" :key="video.id"
             class="bg-white rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer">
          <div class="relative aspect-video">
            <img :src="video.cover" :alt="video.title" class="w-full h-full object-cover">
            <div class="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
              {{ video.duration }}
            </div>
          </div>
          <div class="p-3">
            <h3 class="text-sm font-medium text-gray-800 mb-2 line-clamp-2">{{ video.title }}</h3>
            <div class="flex items-center text-xs text-gray-500">
              <span>{{ video.uploader }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 分区导航 -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-800">推荐</h2>
          <button class="text-sm text-blue-500 hover:text-blue-600 flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            换一换
          </button>
        </div>

        <!-- 分类标签 -->
        <div class="flex flex-wrap gap-2">
          <button v-for="category in categories" :key="category.id"
                  @click="activeCategory = category.id"
                  :class="['px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                           activeCategory === category.id 
                             ? 'bg-blue-500 text-white' 
                             : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200']">
            {{ category.name }}
          </button>
        </div>
      </div>

      <!-- 视频网格 -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <div v-for="video in videos" :key="video.id"
             class="bg-white rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer">
          <div class="relative aspect-video">
            <img :src="video.cover" :alt="video.title" class="w-full h-full object-cover">
            <div class="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
              {{ video.duration }}
            </div>
          </div>
          <div class="p-3">
            <h3 class="text-sm font-medium text-gray-800 mb-2 line-clamp-2">{{ video.title }}</h3>
            <div class="flex items-center justify-between text-xs text-gray-500">
              <span>{{ video.uploader }}</span>
              <div class="flex items-center space-x-2">
                <span class="flex items-center">
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clip-rule="evenodd"/>
                  </svg>
                  {{ video.playCount }}
                </span>
                <span class="flex items-center">
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"/>
                  </svg>
                  {{ video.danmaku }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const activeCategory = ref(1)
const currentSlide = ref(0)
let slideInterval: NodeJS.Timeout | null = null

const carouselSlides = [
  {
    id: 1,
    title: '千杯音乐节官宣啦！',
    subtitle: '2025.10.18-19 上海静安·星梦PARK',
    image: 'https://via.placeholder.com/800x300/3B82F6/FFFFFF?text=千杯音乐节官宣啦！'
  },
  {
    id: 2,
    title: '餐饮企业"国改"梦永活',
    subtitle: '17万赞 · 老北京Official · 11小时前',
    image: 'https://via.placeholder.com/800x300/10B981/FFFFFF?text=餐饮企业国改梦永活'
  },
  {
    id: 3,
    title: '静音&无线缆等的标准答案',
    subtitle: '3590 · 8 · Metalion · 12小时前',
    image: 'https://via.placeholder.com/800x300/EF4444/FFFFFF?text=Spark+Neo无线耳机'
  }
]

const recommendedVideos = [
  {
    id: 1,
    title: '老婆第一次测魅力，如何得后悔了！！！',
    cover: 'https://via.placeholder.com/300x200/FF69B4/FFFFFF?text=视频1',
    duration: '10:44',
    uploader: '哔哩哔哩'
  },
  {
    id: 2,
    title: '餐饮企业"国改"梦永活',
    cover: 'https://via.placeholder.com/300x200/4169E1/FFFFFF?text=视频2',
    duration: '13:17',
    uploader: '老北京Official'
  },
  {
    id: 3,
    title: '静音&无线缆等的标准答案',
    cover: 'https://via.placeholder.com/300x200/32CD32/FFFFFF?text=视频3',
    duration: '11:36',
    uploader: 'Metalion'
  },
  {
    id: 4,
    title: '在从生活的脚步当导游！',
    cover: 'https://via.placeholder.com/300x200/FF4500/FFFFFF?text=视频4',
    duration: '08:19',
    uploader: '竹鼠洞洞的向导'
  },
  {
    id: 5,
    title: '第一次犯罪测谎仪得么准！',
    cover: 'https://via.placeholder.com/300x200/FFD700/FFFFFF?text=视频5',
    duration: '12:34',
    uploader: '十五里堡'
  }
]

const categories = [
  { id: 1, name: '推荐' },
  { id: 2, name: '动画' },
  { id: 3, name: '番剧' },
  { id: 4, name: '国创' },
  { id: 5, name: '音乐' },
  { id: 6, name: '舞蹈' },
  { id: 7, name: '游戏' },
  { id: 8, name: '知识' }
]

const videos = [
  {
    id: 1,
    title: '老婆第一次测魅力，如何得后悔了！！！',
    cover: 'https://via.placeholder.com/300x200/FF69B4/FFFFFF?text=视频1',
    duration: '04:15',
    uploader: '哔哩哔哩',
    playCount: '10万',
    danmaku: '774'
  },
  {
    id: 2,
    title: '小林信一 吉他他入门只需两周！',
    cover: 'https://via.placeholder.com/300x200/4169E1/FFFFFF?text=视频2',
    duration: '28:04',
    uploader: '吉他情报长',
    playCount: '9807',
    danmaku: '0'
  },
  {
    id: 3,
    title: 'B站唯一一次得最高Claude Code人！',
    cover: 'https://via.placeholder.com/300x200/32CD32/FFFFFF?text=视频3',
    duration: '06:40',
    uploader: 'AI学习TV',
    playCount: '3万',
    danmaku: '163'
  },
  {
    id: 4,
    title: '一瞬间，我似乎明白了她的意义所在！',
    cover: 'https://via.placeholder.com/300x200/FF4500/FFFFFF?text=视频4',
    duration: '08:19',
    uploader: '竹鼠洞洞的向导',
    playCount: '817万',
    danmaku: '162'
  },
  {
    id: 5,
    title: '【原神】雷电将军：10小时前更新',
    cover: 'https://via.placeholder.com/300x200/FFD700/FFFFFF?text=视频5',
    duration: '12:34',
    uploader: '原神官方',
    playCount: '145万',
    danmaku: '3.2万'
  },
  {
    id: 6,
    title: '【音乐MV】最新热门歌曲合集',
    cover: 'https://via.placeholder.com/300x200/9370DB/FFFFFF?text=视频6',
    duration: '15:30',
    uploader: '音乐分享',
    playCount: '92万',
    danmaku: '1.5万'
  },
  {
    id: 7,
    title: '【科技评测】最新黑科技产品体验',
    cover: 'https://via.placeholder.com/300x200/20B2AA/FFFFFF?text=视频7',
    duration: '18:45',
    uploader: '科技博主',
    playCount: '178万',
    danmaku: '4.1万'
  },
  {
    id: 8,
    title: '【搞笑合集】爆笑视频精选',
    cover: 'https://via.placeholder.com/300x200/FF6347/FFFFFF?text=视频8',
    duration: '25:18',
    uploader: '搞笑日常',
    playCount: '234万',
    danmaku: '6.7万'
  }
]

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % carouselSlides.length
}

const startAutoSlide = () => {
  slideInterval = setInterval(nextSlide, 4000)
}

onMounted(() => {
  startAutoSlide()
})

onUnmounted(() => {
  if (slideInterval) {
    clearInterval(slideInterval)
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>