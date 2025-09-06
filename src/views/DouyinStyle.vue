<template>
  <div class="min-h-screen bg-gradient-to-br from-douyin-dark via-purple-900 to-douyin-primary relative overflow-hidden">
    <!-- 背景动画 -->
    <div class="absolute inset-0 opacity-20">
      <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-douyin-primary to-douyin-secondary animate-pulse-slow"></div>
    </div>
    
    <!-- 浮动元素 -->
    <div class="absolute inset-0">
      <div v-for="i in 15" :key="i" 
           class="absolute w-1 h-1 bg-white rounded-full opacity-40 animate-float"
           :style="{
             left: Math.random() * 100 + '%',
             top: Math.random() * 100 + '%',
             animationDelay: Math.random() * 6 + 's',
             animationDuration: (Math.random() * 3 + 3) + 's'
           }">
      </div>
    </div>

    <!-- 导航栏 -->
    <nav class="relative z-10 p-6">
      <div class="flex items-center justify-between">
        <button @click="goBack" class="text-white hover:text-douyin-secondary transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 class="text-2xl font-bold text-white">抖音风格</h1>
        <div class="w-6"></div>
      </div>
    </nav>

    <!-- 主要内容 -->
    <div class="relative z-10 container mx-auto px-6 py-8">
      <!-- 视频区域 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div v-for="i in 6" :key="i" 
             class="group cursor-pointer transform transition-all duration-500 hover:scale-105">
          <div class="glass-effect rounded-2xl overflow-hidden">
            <div class="relative h-64 bg-gradient-to-br from-douyin-primary to-douyin-secondary flex items-center justify-center">
              <div class="text-center text-white">
                <svg class="w-16 h-16 mx-auto mb-4 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <p class="text-lg font-semibold">视频 {{ i }}</p>
              </div>
              <div class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
            </div>
            <div class="p-4">
              <h3 class="text-white font-semibold mb-2">精彩视频标题 {{ i }}</h3>
              <div class="flex items-center justify-between text-white/70 text-sm">
                <span>@创作者{{ i }}</span>
                <div class="flex items-center space-x-4">
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    {{ Math.floor(Math.random() * 10000) }}
                  </span>
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    {{ Math.floor(Math.random() * 100000) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 直播区域 -->
      <div class="mb-12">
        <h2 class="text-3xl font-bold text-white mb-6 text-center">热门直播</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="i in 4" :key="i" 
               class="group cursor-pointer transform transition-all duration-500 hover:scale-105">
            <div class="glass-effect rounded-2xl overflow-hidden">
              <div class="relative h-48 bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center">
                <div class="text-center text-white">
                  <div class="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
                    <span class="text-xs font-bold">LIVE</span>
                  </div>
                  <p class="text-sm font-semibold">主播 {{ i }}</p>
                </div>
                <div class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
              </div>
              <div class="p-4">
                <h3 class="text-white font-semibold mb-2">直播间标题 {{ i }}</h3>
                <p class="text-white/70 text-sm">{{ Math.floor(Math.random() * 10000) }} 观看</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 音乐区域 -->
      <div>
        <h2 class="text-3xl font-bold text-white mb-6 text-center">热门音乐</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 6" :key="i" 
               class="group cursor-pointer transform transition-all duration-500 hover:scale-105">
            <div class="glass-effect rounded-2xl p-6 flex items-center space-x-4">
              <div class="w-16 h-16 bg-gradient-to-br from-douyin-primary to-douyin-secondary rounded-lg flex items-center justify-center group-hover:animate-spin-slow">
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="text-white font-semibold mb-1">热门歌曲 {{ i }}</h3>
                <p class="text-white/70 text-sm">艺术家 {{ i }}</p>
                <div class="flex items-center mt-2">
                  <div class="flex space-x-1">
                    <div v-for="j in 5" :key="j" 
                         class="w-1 h-4 bg-douyin-secondary rounded-full animate-bounce"
                         :style="{ animationDelay: j * 0.1 + 's' }">
                    </div>
                  </div>
                  <span class="text-white/70 text-xs ml-2">{{ Math.floor(Math.random() * 1000000) }} 使用</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部导航 -->
    <div class="fixed bottom-0 left-0 right-0 glass-effect border-t border-white/20">
      <div class="flex items-center justify-around py-4">
        <button class="flex flex-col items-center space-y-1 text-douyin-secondary">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          <span class="text-xs">首页</span>
        </button>
        <button class="flex flex-col items-center space-y-1 text-white/70 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span class="text-xs">关注</span>
        </button>
        <button class="flex flex-col items-center space-y-1 text-white/70 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <span class="text-xs">消息</span>
        </button>
        <button class="flex flex-col items-center space-y-1 text-white/70 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          <span class="text-xs">我</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.push({ name: 'home' })
}
</script>

<style scoped>
.glass-effect {
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

@keyframes music-wave {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.5); }
}

.animate-bounce {
  animation: music-wave 1s ease-in-out infinite;
}
</style>