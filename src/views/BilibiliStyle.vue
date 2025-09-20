<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <header class="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- 左侧Logo和导航 -->
          <div class="flex items-center space-x-6">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-br from-pink-500 to-blue-400 rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <span class="text-white font-bold text-lg">B</span>
              </div>
              <span class="text-2xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">哔哩哔哩</span>
            </div>
            
            <!-- 桌面端导航 -->
            <nav class="hidden md:flex items-center space-x-8">
              <a href="#" class="relative text-pink-500 font-semibold text-lg group">
                首页
                <span class="absolute -bottom-1 left-0 w-full h-0.5 bg-pink-500 transform scale-x-100 transition-transform duration-300"></span>
              </a>
              <a href="#" class="relative text-gray-700 hover:text-pink-500 font-medium text-lg transition-colors duration-300 group">
                番剧
                <span class="absolute -bottom-1 left-0 w-full h-0.5 bg-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </a>
              <a href="#" class="relative text-gray-700 hover:text-pink-500 font-medium text-lg transition-colors duration-300 group">
                直播
                <span class="absolute -bottom-1 left-0 w-full h-0.5 bg-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </a>
              <a href="#" class="relative text-gray-700 hover:text-pink-500 font-medium text-lg transition-colors duration-300 group">
                游戏中心
                <span class="absolute -bottom-1 left-0 w-full h-0.5 bg-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </a>
              <a href="#" class="relative text-gray-700 hover:text-pink-500 font-medium text-lg transition-colors duration-300 group">
                会员购
                <span class="absolute -bottom-1 left-0 w-full h-0.5 bg-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </a>
            </nav>
          </div>

          <!-- 右侧搜索和用户 -->
          <div class="flex items-center space-x-4">
            <!-- 搜索框 -->
            <div class="hidden md:flex items-center bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-pink-300 rounded-full px-5 py-3 transition-all duration-300 focus-within:border-pink-500 focus-within:shadow-lg focus-within:shadow-pink-100">
              <input type="text" placeholder="搜索视频、直播、用户" class="bg-transparent text-gray-700 placeholder-gray-400 outline-none text-base w-80 font-medium">
              <svg class="w-5 h-5 text-gray-400 hover:text-pink-500 cursor-pointer transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            
            <!-- 用户头像和操作按钮 -->
            <div class="flex items-center space-x-4">
              <!-- 投稿按钮 -->
              <button class="hidden md:flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-blue-400 text-white px-4 py-2 rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all duration-300">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                <span>投稿</span>
              </button>
              <!-- 用户头像 -->
              <div class="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                <span class="text-white font-semibold text-lg">U</span>
              </div>
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
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- 轮播图区域 -->
      <div class="mb-8">
        <div class="relative bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 h-60 md:h-72 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 group">
          <div class="absolute inset-0 bg-black/20"></div>
          <div class="absolute inset-0 flex items-center justify-center text-white">
            <div class="text-center transform group-hover:scale-105 transition-transform duration-500">
              <h2 class="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">热门推荐</h2>
              <p class="text-lg md:text-xl opacity-90 drop-shadow-md">发现精彩内容，遇见更大的世界</p>
              <button class="mt-6 bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/30 transition-all duration-300 hover:scale-105">
                立即探索
              </button>
            </div>
          </div>
          <!-- 装饰性元素 -->
          <div class="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div class="absolute bottom-8 left-8 w-16 h-16 bg-white/10 rounded-full blur-lg animate-bounce"></div>
        </div>
      </div>

      <!-- 分区导航 -->
      <div class="mb-8">
        <div class="flex items-center space-x-3 overflow-x-auto pb-4 scrollbar-hide">
          <button v-for="category in categories" :key="category.id"
                  @click="activeCategory = category.id"
                  :class="['px-6 py-3 rounded-full whitespace-nowrap transition-all duration-300 font-medium text-base border-2 transform hover:scale-105',
                           activeCategory === category.id 
                             ? 'bg-gradient-to-r from-pink-500 to-blue-400 text-white border-transparent shadow-lg shadow-pink-200' 
                             : 'bg-white text-gray-700 border-gray-200 hover:border-pink-300 hover:text-pink-500 hover:shadow-md']">
            {{ category.name }}
          </button>
        </div>
      </div>

      <!-- 视频网格 -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <div v-for="video in videos" :key="video.id"
             class="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 hover:scale-105">
          <!-- 视频封面 -->
          <div class="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
            <img :src="video.cover" :alt="video.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
            <!-- 时长标签 -->
            <div class="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium">
              {{ video.duration }}
            </div>
            <!-- 播放量标签 -->
            <div class="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg">
              {{ video.views }}
            </div>
            <!-- hover时显示的播放按钮 -->
            <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div class="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                <svg class="w-8 h-8 text-pink-500 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <!-- 视频信息 -->
          <div class="p-4">
            <h3 class="text-sm font-semibold text-gray-800 mb-3 line-clamp-2 leading-relaxed group-hover:text-pink-600 transition-colors duration-300">{{ video.title }}</h3>
            <div class="flex items-center space-x-3 mb-3">
              <div class="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex-shrink-0 flex items-center justify-center">
                <span class="text-white text-xs font-bold">{{ video.uploader.charAt(0) }}</span>
              </div>
              <span class="text-sm text-gray-600 truncate font-medium hover:text-pink-500 transition-colors duration-300 cursor-pointer">{{ video.uploader }}</span>
            </div>
            <div class="flex items-center justify-between text-xs text-gray-500">
              <div class="flex items-center space-x-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>{{ video.playCount }}</span>
              </div>
              <div class="flex items-center space-x-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
                <span>{{ video.danmaku }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 直播区域 -->
      <div class="mt-12">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-800 flex items-center">
            <span class="w-3 h-3 bg-red-500 rounded-full mr-3 animate-pulse shadow-lg shadow-red-300"></span>
            热门直播
            <span class="ml-3 text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">实时更新</span>
          </h2>
          <a href="#" class="text-base text-pink-500 hover:text-pink-600 font-medium transition-colors duration-300 flex items-center group">
            查看更多
            <svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div v-for="live in lives" :key="live.id"
               class="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 hover:scale-105">
            <div class="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
              <img :src="live.cover" :alt="live.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
              <!-- 直播状态 -->
              <div class="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1.5 rounded-full flex items-center font-medium shadow-lg">
                <span class="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                直播中
              </div>
              <!-- 人气值 -->
              <div class="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium flex items-center">
                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                {{ live.popularity }}
              </div>
              <!-- hover时的播放按钮 -->
              <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div class="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                  <svg class="w-8 h-8 text-red-500 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </div>
            <div class="p-4">
              <h3 class="text-sm font-semibold text-gray-800 mb-2 line-clamp-2 leading-relaxed group-hover:text-pink-600 transition-colors duration-300">{{ live.title }}</h3>
              <div class="flex items-center space-x-2 mb-2">
                <div class="w-6 h-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                  <span class="text-white text-xs font-bold">{{ live.streamer.charAt(0) }}</span>
                </div>
                <span class="text-sm text-gray-600 font-medium hover:text-pink-500 transition-colors duration-300 cursor-pointer">{{ live.streamer }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full font-medium">{{ live.category }}</span>
                <div class="flex items-center text-xs text-red-500 font-medium">
                  <span class="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5 animate-pulse"></span>
                  LIVE
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部导航（移动端） -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl">
      <div class="flex items-center justify-around py-3">
        <button class="flex flex-col items-center p-2 text-pink-500 transform hover:scale-110 transition-all duration-300">
          <div class="relative">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            <span class="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
          </div>
          <span class="text-xs mt-1 font-medium">首页</span>
        </button>
        <button class="flex flex-col items-center p-2 text-gray-600 hover:text-pink-500 transform hover:scale-110 transition-all duration-300">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span class="text-xs mt-1 font-medium">动态</span>
        </button>
        <button class="flex flex-col items-center p-2 text-gray-600 hover:text-pink-500 transform hover:scale-110 transition-all duration-300">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <span class="text-xs mt-1 font-medium">会员购</span>
        </button>
        <button class="flex flex-col items-center p-2 text-gray-600 hover:text-pink-500 transform hover:scale-110 transition-all duration-300">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          <span class="text-xs mt-1 font-medium">我的</span>
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
    padding-bottom: 80px;
  }
}

/* 隐藏滚动条 */
.scrollbar-hide {
  -ms-overflow-style: none;  /* Internet Explorer 10+ */
  scrollbar-width: none;  /* Firefox */
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;  /* Safari and Chrome */
}

/* B站风格的渐变动画 */
@keyframes bilibili-glow {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-bilibili-glow {
  animation: bilibili-glow 2s infinite;
}

@keyframes bilibili-float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-4px);
  }
}

.animate-bilibili-float {
  animation: bilibili-float 3s ease-in-out infinite;
}

/* 卡片hover效果 */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

.group:hover .group-hover\:translate-x-1 {
  transform: translateX(0.25rem);
}

/* 渐变文字效果 */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* 按钮按下效果 */
.transform:active {
  transform: scale(0.95);
}

/* 特殊阴影效果 */
.shadow-3xl {
  box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
}

/* 动画延迟 */
.animate-scale-in {
  animation: scale-in 0.5s ease-out;
}

@keyframes scale-in {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* 直播标签闪烁效果 */
.animate-pulse-slow {
  animation: pulse-slow 3s infinite;
}

@keyframes pulse-slow {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* 响应式设计优化 */
@media (max-width: 640px) {
  .grid {
    gap: 1rem;
  }
  
  .px-4 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* 高级动画效果 */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

.backdrop-blur-md {
  backdrop-filter: blur(12px);
}

/* 文字阴影 */
.drop-shadow-lg {
  filter: drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));
}

.drop-shadow-md {
  filter: drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06));
}

/* 视频卡片特殊效果 */
.video-card {
  position: relative;
  overflow: hidden;
}

.video-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
  z-index: 1;
}

.video-card:hover::before {
  left: 100%;
}
</style>