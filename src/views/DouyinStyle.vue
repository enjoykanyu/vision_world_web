<template>
  <div class="min-h-screen bg-douyin-bg relative overflow-hidden">
    <!-- 背景动画 -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-douyin-primary to-douyin-secondary animate-pulse-slow"></div>
    </div>
    
    <!-- 移动端顶部导航 -->
    <nav class="relative z-10 p-4 bg-black/30 backdrop-blur-md border-b border-white/10">
      <div class="flex items-center justify-between">
        <button @click="goBack" class="text-white hover:text-douyin-primary transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <div class="flex items-center space-x-6">
          <button class="text-white font-medium text-lg">推荐</button>
          <button class="text-white/60 hover:text-white transition-colors">关注</button>
          <button class="text-white/60 hover:text-white transition-colors">同城</button>
        </div>
        <button class="text-white hover:text-douyin-primary transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </button>
      </div>
    </nav>

    <!-- 主要内容 - 移动端垂直滑动 -->
    <div class="relative z-10 h-screen overflow-y-auto snap-y snap-mandatory">
      <!-- 视频卡片 -->
      <div v-for="i in 6" :key="i" 
           class="h-screen flex items-center justify-center snap-start relative">
        <!-- 视频背景 -->
        <div class="absolute inset-0 bg-gradient-to-br from-douyin-primary/20 to-douyin-secondary/20">
          <div class="absolute inset-0 bg-black/40"></div>
        </div>
        
        <!-- 视频内容 -->
        <div class="relative z-10 w-full max-w-md mx-auto px-4">
          <!-- 视频播放区域 -->
          <div class="aspect-[9/16] bg-gradient-to-br from-douyin-primary to-douyin-secondary rounded-2xl flex items-center justify-center mb-4 relative overflow-hidden">
            <div class="text-center text-white">
              <svg class="w-16 h-16 mx-auto mb-4 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <p class="text-lg font-semibold">视频 {{ i }}</p>
            </div>
            <!-- 播放进度条 -->
            <div class="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
              <div class="h-full w-1/3 bg-douyin-secondary rounded-full"></div>
            </div>
          </div>
          
          <!-- 视频信息 -->
          <div class="text-white mb-4">
            <h3 class="text-lg font-semibold mb-2">@创作者{{ i }}</h3>
            <p class="text-sm opacity-90">这是第{{ i }}个精彩视频内容，描述了一些有趣的事情和生活分享。</p>
          </div>
          
          <!-- 右侧操作栏 -->
          <div class="absolute right-4 bottom-32 flex flex-col space-y-6">
            <!-- 头像 -->
            <div class="w-12 h-12 bg-gradient-to-br from-douyin-primary to-douyin-secondary rounded-full border-2 border-white flex items-center justify-center">
              <span class="text-white font-bold text-sm">{{ i }}</span>
            </div>
            
            <!-- 点赞 -->
            <button class="flex flex-col items-center space-y-1">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span class="text-white text-xs">{{ Math.floor(Math.random() * 10000) }}</span>
            </button>
            
            <!-- 评论 -->
            <button class="flex flex-col items-center space-y-1">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
              <span class="text-white text-xs">{{ Math.floor(Math.random() * 1000) }}</span>
            </button>
            
            <!-- 分享 -->
            <button class="flex flex-col items-center space-y-1">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
              </svg>
              <span class="text-white text-xs">{{ Math.floor(Math.random() * 500) }}</span>
            </button>
            
            <!-- 音乐 -->
            <button class="w-12 h-12 bg-gradient-to-br from-douyin-primary to-douyin-secondary rounded-full flex items-center justify-center animate-spin-slow">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部导航 -->
    <div class="fixed bottom-0 left-0 right-0 glass-card border-t border-white/10">
      <div class="flex items-center justify-around py-2">
        <button class="flex flex-col items-center space-y-1 text-douyin-primary">
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
          <div class="w-12 h-12 bg-gradient-to-br from-douyin-primary to-douyin-secondary rounded-full flex items-center justify-center -mt-4 shadow-glow">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </div>
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

/* 隐藏滚动条但保持滚动功能 */
.overflow-y-auto {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.overflow-y-auto::-webkit-scrollbar {
  display: none;
}

/* 移动端全屏滚动 */
.snap-y {
  scroll-snap-type: y mandatory;
}

.snap-start {
  scroll-snap-align: start;
}

.h-screen {
  height: 100vh;
}
</style>