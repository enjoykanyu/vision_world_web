<template>
  <div class="min-h-screen bg-gray-100">
    <!-- 顶部导航栏 -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between h-14">
          <!-- 左侧Logo和导航 -->
          <div class="flex items-center space-x-6">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-pink-500 rounded flex items-center justify-center">
                <span class="text-white font-bold text-sm">B</span>
              </div>
              <span class="text-xl font-bold text-gray-900">哔哩哔哩</span>
            </div>
            
            <!-- 桌面端导航 -->
            <nav class="hidden md:flex items-center space-x-6">
              <a href="#" class="text-pink-500 font-medium">首页</a>
              <a href="#" class="text-gray-600 hover:text-gray-900">番剧</a>
              <a href="#" class="text-gray-600 hover:text-gray-900">直播</a>
              <a href="#" class="text-gray-600 hover:text-gray-900">游戏中心</a>
              <a href="#" class="text-gray-600 hover:text-gray-900">会员购</a>
            </nav>
          </div>

          <!-- 右侧搜索和用户 -->
          <div class="flex items-center space-x-4">
            <!-- 搜索框 -->
            <div class="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2">
              <input type="text" placeholder="搜索视频、用户" class="bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm w-64">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            
            <!-- 用户头像 -->
            <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span class="text-gray-600 text-sm">U</span>
            </div>
            
            <!-- 移动端菜单按钮 -->
            <button @click="toggleMobileMenu" class="md:hidden">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- 移动端菜单 -->
      <div v-if="isMobileMenuOpen" class="md:hidden bg-white border-t">
        <div class="px-4 py-2 space-y-2">
          <a href="#" class="block py-2 text-pink-500 font-medium">首页</a>
          <a href="#" class="block py-2 text-gray-600">番剧</a>
          <a href="#" class="block py-2 text-gray-600">直播</a>
          <a href="#" class="block py-2 text-gray-600">游戏中心</a>
          <a href="#" class="block py-2 text-gray-600">会员购</a>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <div class="max-w-7xl mx-auto px-4 py-6">
      <!-- 轮播图区域 -->
      <div class="mb-6">
        <div class="bg-gradient-to-r from-pink-500 to-blue-500 h-48 rounded-lg flex items-center justify-center text-white">
          <div class="text-center">
            <h2 class="text-2xl font-bold mb-2">热门推荐</h2>
            <p class="text-sm opacity-90">发现精彩内容</p>
          </div>
        </div>
      </div>

      <!-- 分区导航 -->
      <div class="mb-6">
        <div class="flex items-center space-x-4 overflow-x-auto pb-2">
          <button v-for="category in categories" :key="category.id"
                  @click="activeCategory = category.id"
                  :class="['px-4 py-2 rounded-full whitespace-nowrap transition-colors',
                           activeCategory === category.id 
                             ? 'bg-pink-500 text-white' 
                             : 'bg-gray-200 text-gray-700 hover:bg-gray-300']">
            {{ category.name }}
          </button>
        </div>
      </div>

      <!-- 视频网格 -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <div v-for="video in videos" :key="video.id"
             class="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <!-- 视频封面 -->
          <div class="relative aspect-video bg-gray-200">
            <img :src="video.cover" :alt="video.title" class="w-full h-full object-cover">
            <div class="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
              {{ video.duration }}
            </div>
            <div class="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              {{ video.views }}
            </div>
          </div>
          
          <!-- 视频信息 -->
          <div class="p-3">
            <h3 class="text-sm font-medium text-gray-900 mb-2 line-clamp-2">{{ video.title }}</h3>
            <div class="flex items-center space-x-2">
              <div class="w-6 h-6 bg-gray-300 rounded-full flex-shrink-0"></div>
              <span class="text-xs text-gray-600 truncate">{{ video.uploader }}</span>
            </div>
            <div class="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>{{ video.playCount }}播放</span>
              <span>{{ video.danmaku }}弹幕</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 直播区域 -->
      <div class="mt-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-900 flex items-center">
            <span class="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
            热门直播
          </h2>
          <a href="#" class="text-sm text-pink-500 hover:text-pink-600">查看更多</a>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div v-for="live in lives" :key="live.id"
               class="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div class="relative aspect-video bg-gray-200">
              <img :src="live.cover" :alt="live.title" class="w-full h-full object-cover">
              <div class="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded flex items-center">
                <span class="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
                直播中
              </div>
              <div class="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                {{ live.popularity }}
              </div>
            </div>
            <div class="p-3">
              <h3 class="text-sm font-medium text-gray-900 mb-1">{{ live.title }}</h3>
              <p class="text-xs text-gray-600">{{ live.streamer }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ live.category }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部导航（移动端） -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t">
      <div class="flex items-center justify-around py-2">
        <button class="flex flex-col items-center p-2 text-pink-500">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          <span class="text-xs mt-1">首页</span>
        </button>
        <button class="flex flex-col items-center p-2 text-gray-600">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span class="text-xs mt-1">动态</span>
        </button>
        <button class="flex flex-col items-center p-2 text-gray-600">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <span class="text-xs mt-1">会员购</span>
        </button>
        <button class="flex flex-col items-center p-2 text-gray-600">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          <span class="text-xs mt-1">我的</span>
        </button>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isMobileMenuOpen = ref(false)
const activeCategory = ref(1)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const categories = [
  { id: 1, name: '推荐' },
  { id: 2, name: '动画' },
  { id: 3, name: '音乐' },
  { id: 4, name: '舞蹈' },
  { id: 5, name: '游戏' },
  { id: 6, name: '知识' },
  { id: 7, name: '科技' },
  { id: 8, name: '运动' },
  { id: 9, name: '生活' },
  { id: 10, name: '美食' }
]

const videos = [
  {
    id: 1,
    title: '【原创动画】超燃战斗场面，特效炸裂',
    cover: 'https://via.placeholder.com/300x200/FF69B4/FFFFFF?text=视频1',
    duration: '12:34',
    views: '128万',
    uploader: '动画UP主',
    playCount: '128万',
    danmaku: '2.3万'
  },
  {
    id: 2,
    title: '【游戏实况】极限操作秀翻全场，队友都惊呆了',
    cover: 'https://via.placeholder.com/300x200/4169E1/FFFFFF?text=视频2',
    duration: '25:18',
    views: '89万',
    uploader: '游戏达人',
    playCount: '89万',
    danmaku: '1.8万'
  },
  {
    id: 3,
    title: '【音乐MV】最新热门歌曲，太好听了',
    cover: 'https://via.placeholder.com/300x200/32CD32/FFFFFF?text=视频3',
    duration: '4:23',
    views: '256万',
    uploader: '音乐分享',
    playCount: '256万',
    danmaku: '5.6万'
  },
  {
    id: 4,
    title: '【科技评测】黑科技产品体验，未来已来',
    cover: 'https://via.placeholder.com/300x200/FF4500/FFFFFF?text=视频4',
    duration: '18:45',
    views: '67万',
    uploader: '科技博主',
    playCount: '67万',
    danmaku: '9800'
  },
  {
    id: 5,
    title: '【美食制作】教你做网红美食，简单易学',
    cover: 'https://via.placeholder.com/300x200/FFD700/FFFFFF?text=视频5',
    duration: '8:12',
    views: '145万',
    uploader: '美食达人',
    playCount: '145万',
    danmaku: '3.2万'
  },
  {
    id: 6,
    title: '【旅行Vlog】探索未知世界，美景如画',
    cover: 'https://via.placeholder.com/300x200/9370DB/FFFFFF?text=视频6',
    duration: '15:30',
    views: '92万',
    uploader: '旅行博主',
    playCount: '92万',
    danmaku: '1.5万'
  },
  {
    id: 7,
    title: '【知识科普】有趣的科学知识，长见识了',
    cover: 'https://via.placeholder.com/300x200/20B2AA/FFFFFF?text=视频7',
    duration: '10:15',
    views: '178万',
    uploader: '知识分享',
    playCount: '178万',
    danmaku: '4.1万'
  },
  {
    id: 8,
    title: '【搞笑合集】笑到肚子疼，太搞笑了',
    cover: 'https://via.placeholder.com/300x200/FF6347/FFFFFF?text=视频8',
    duration: '6:45',
    views: '234万',
    uploader: '搞笑日常',
    playCount: '234万',
    danmaku: '6.7万'
  }
]

const lives = [
  {
    id: 1,
    title: '今晚一起打游戏，超欢乐',
    cover: 'https://via.placeholder.com/300x200/FF0000/FFFFFF?text=直播1',
    streamer: '游戏主播',
    category: '英雄联盟',
    popularity: '12.3万'
  },
  {
    id: 2,
    title: '唱歌聊天，欢迎来到直播间',
    cover: 'https://via.placeholder.com/300x200/FF1493/FFFFFF?text=直播2',
    streamer: '音乐主播',
    category: '唱歌',
    popularity: '8.7万'
  },
  {
    id: 3,
    title: '绘画教学，从零开始学画画',
    cover: 'https://via.placeholder.com/300x200/00CED1/FFFFFF?text=直播3',
    streamer: '绘画老师',
    category: '绘画',
    popularity: '5.2万'
  },
  {
    id: 4,
    title: '户外直播，探索城市美景',
    cover: 'https://via.placeholder.com/300x200/FF8C00/FFFFFF?text=直播4',
    streamer: '户外主播',
    category: '户外',
    popularity: '3.8万'
  }
]
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 移动端底部导航占位 */
@media (max-width: 768px) {
  body {
    padding-bottom: 60px;
  }
}
</style>