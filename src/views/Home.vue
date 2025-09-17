<template>
  <div class="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
    <!-- 背景动画 -->
    <div class="absolute inset-0 tech-grid opacity-20"></div>
    <div class="absolute inset-0 bg-animated opacity-10"></div>
    
    <!-- 浮动粒子效果 -->
    <div class="absolute inset-0">
      <div v-for="i in 20" :key="i" 
           class="absolute w-2 h-2 bg-white rounded-full opacity-30 animate-float"
           :style="{
             left: Math.random() * 100 + '%',
             top: Math.random() * 100 + '%',
             animationDelay: Math.random() * 6 + 's',
             animationDuration: (Math.random() * 4 + 4) + 's'
           }">
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
      <!-- 标题区域 -->
      <div class="text-center mb-16 animate-float">
        <h1 class="text-6xl md:text-8xl font-bold mb-6 gradient-text">
          Vision World
        </h1>
        <p class="text-xl md:text-2xl text-white/80 mb-8">
          体验仿B站风格UI，感受二次元文化的魅力
        </p>
        <div class="w-32 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full animate-glow"></div>
      </div>

      <!-- 风格选择卡片 -->
      <div class="card-grid max-w-4xl w-full">
        <!-- B站风格 -->
        <div @click="navigateToStyle('bilibili')"
             class="group cursor-pointer animate-scale-in">
          <div class="glass-card p-8 text-center">
            <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-500 to-blue-500 flex items-center justify-center group-hover:animate-pulse-slow shadow-glow">
              <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm6 8h-4v-2h4v2zm0-4h-4v-2h4v2zm0-4h-4V7h4v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-white mb-3">B站风格</h3>
            <p class="text-white/80 mb-6 text-sm leading-relaxed">二次元、弹幕、社区，年轻文化的聚集地</p>
            <button class="btn-secondary w-full">
              <span class="flex items-center justify-center">
                立即体验
                <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </span>
            </button>
          </div>
        </div>

        <!-- 视频智能分析助手 -->
        <div @click="navigateToStyle('video-assistant')"
             class="group cursor-pointer animate-scale-in" style="animation-delay: 0.1s">
          <div class="glass-card p-8 text-center">
            <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center group-hover:animate-pulse-slow shadow-glow">
              <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-white mb-3">视频智能分析助手</h3>
            <p class="text-white/80 mb-6 text-sm leading-relaxed">AI驱动的视频内容分析，提供专业的智能解析和建议</p>
            <button class="btn-secondary w-full">
              <span class="flex items-center justify-center">
                立即体验
                <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- 底部装饰 -->
      <div class="mt-16 text-center">
        <p class="text-white/50 text-sm">
          进入B站世界，探索无限可能
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateToStyle = (style: string) => {
  router.push({ name: style })
}
</script>

<style scoped>
/* 添加额外的动画效果 */
.glass-effect {
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.card-hover:hover {
  transform: translateY(-10px) scale(1.05);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.gradient-text {
  background: linear-gradient(45deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 8s ease infinite;
}

@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
</style>