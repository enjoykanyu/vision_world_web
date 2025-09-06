<template>
  <div class="min-h-screen bg-gradient-to-br from-bilibili-dark via-gray-900 to-bilibili-primary relative overflow-hidden">
    <!-- 背景动画 -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-bilibili-primary to-bilibili-secondary animate-pulse-slow"></div>
    </div>
    
    <!-- 弹幕效果 -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div v-for="i in 20" :key="i" 
           class="absolute text-white/60 text-sm whitespace-nowrap animate-barrage"
           :style="{
             top: Math.random() * 100 + '%',
             left: '-100%',
             animationDelay: Math.random() * 10 + 's',
             animationDuration: (Math.random() * 10 + 10) + 's'
           }">
        {{ barrageTexts[i % barrageTexts.length] }}
      </div>
    </div>

    <!-- 导航栏 -->
    <nav class="relative z-10 p-6">
      <div class="flex items-center justify-between">
        <button @click="goBack" class="text-white hover:text-bilibili-secondary transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 class="text-2xl font-bold text-white">B站风格</h1>
        <div class="w-6"></div>
      </div>
    </nav>

    <!-- 主要内容 -->
    <div class="relative z-10 container mx-auto px-6 py-8">
      <!-- 推荐视频 -->
      <div class="mb-12">
        <h2 class="text-3xl font-bold text-white mb-6 flex items-center">
          <span class="bg-bilibili-primary text-white px-3 py-1 rounded-lg text-sm mr-3">推荐</span>
          为你推荐
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="i in 8" :key="i" 
               class="group cursor-pointer transform transition-all duration-500 hover:scale-105">
            <div class="glass-effect rounded-2xl overflow-hidden">
              <div class="relative h-40 bg-gradient-to-br from-bilibili-primary to-bilibili-secondary flex items-center justify-center">
                <div class="text-center text-white">
                  <svg class="w-12 h-12 mx-auto mb-2 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  <p class="text-sm font-semibold">{{ Math.floor(Math.random() * 100) + ':' + (Math.floor(Math.random() * 60)).toString().padStart(2, '0') }}</p>
                </div>
                <div class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                <div class="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  {{ Math.floor(Math.random() * 1000) }}万
                </div>
              </div>
              <div class="p-4">
                <h3 class="text-white font-semibold mb-2 line-clamp-2">
                  {{ videoTitles[i % videoTitles.length] }} {{ i }}
                </h3>
                <div class="flex items-center justify-between text-white/70 text-xs">
                  <span>UP主 {{ i }}</span>
                  <div class="flex items-center space-x-2">
                    <span>{{ Math.floor(Math.random() * 100) }}万播放</span>
                    <span>{{ Math.floor(Math.random() * 10000) }}弹幕</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分区内容 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <!-- 动画区 -->
        <div class="glass-effect rounded-2xl p-6">
          <h3 class="text-xl font-bold text-white mb-4 flex items-center">
            <span class="w-3 h-3 bg-bilibili-primary rounded-full mr-2 animate-pulse"></span>
            动画区
          </h3>
          <div class="space-y-4">
            <div v-for="i in 3" :key="i" 
                 class="flex items-center space-x-3 cursor-pointer group">
              <div class="w-20 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex-shrink-0"></div>
              <div class="flex-1">
                <h4 class="text-white text-sm font-semibold group-hover:text-bilibili-secondary transition-colors">
                  动画视频 {{ i }}
                </h4>
                <p class="text-white/60 text-xs">{{ Math.floor(Math.random() * 100) }}万播放</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 游戏区 -->
        <div class="glass-effect rounded-2xl p-6">
          <h3 class="text-xl font-bold text-white mb-4 flex items-center">
            <span class="w-3 h-3 bg-bilibili-secondary rounded-full mr-2 animate-pulse"></span>
            游戏区
          </h3>
          <div class="space-y-4">
            <div v-for="i in 3" :key="i" 
                 class="flex items-center space-x-3 cursor-pointer group">
              <div class="w-20 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex-shrink-0"></div>
              <div class="flex-1">
                <h4 class="text-white text-sm font-semibold group-hover:text-bilibili-secondary transition-colors">
                  游戏视频 {{ i }}
                </h4>
                <p class="text-white/60 text-xs">{{ Math.floor(Math.random() * 100) }}万播放</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 音乐区 -->
        <div class="glass-effect rounded-2xl p-6">
          <h3 class="text-xl font-bold text-white mb-4 flex items-center">
            <span class="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            音乐区
          </h3>
          <div class="space-y-4">
            <div v-for="i in 3" :key="i" 
                 class="flex items-center space-x-3 cursor-pointer group">
              <div class="w-20 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex-shrink-0"></div>
              <div class="flex-1">
                <h4 class="text-white text-sm font-semibold group-hover:text-bilibili-secondary transition-colors">
                  音乐视频 {{ i }}
                </h4>
                <p class="text-white/60 text-xs">{{ Math.floor(Math.random() * 100) }}万播放</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 直播间 -->
      <div>
        <h2 class="text-3xl font-bold text-white mb-6 flex items-center">
          <span class="bg-red-500 text-white px-3 py-1 rounded-lg text-sm mr-3 animate-pulse">LIVE</span>
          热门直播
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="i in 4" :key="i" 
               class="group cursor-pointer transform transition-all duration-500 hover:scale-105">
            <div class="glass-effect rounded-2xl overflow-hidden">
              <div class="relative h-48 bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                <div class="text-center text-white">
                  <div class="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
                    <span class="text-xs font-bold">直播</span>
                  </div>
                  <p class="text-sm font-semibold">主播 {{ i }}</p>
                </div>
                <div class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                <div class="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  {{ Math.floor(Math.random() * 10000) }}人气
                </div>
              </div>
              <div class="p-4">
                <h3 class="text-white font-semibold mb-2">直播间 {{ i }}</h3>
                <p class="text-white/70 text-sm">{{ gameCategories[i % gameCategories.length] }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部导航 -->
    <div class="fixed bottom-0 left-0 right-0 glass-effect border-t border-white/20">
      <div class="flex items-center justify-around py-4">
        <button class="flex flex-col items-center space-y-1 text-bilibili-primary">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          <span class="text-xs">首页</span>
        </button>
        <button class="flex flex-col items-center space-y-1 text-white/70 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z"/>
          </svg>
          <span class="text-xs">动态</span>
        </button>
        <button class="flex flex-col items-center space-y-1 text-white/70 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span class="text-xs">会员购</span>
        </button>
        <button class="flex flex-col items-center space-y-1 text-white/70 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          <span class="text-xs">我的</span>
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

const barrageTexts = [
  '前方高能预警！！！',
  '2333333333',
  '太厉害了！',
  'UP主加油！',
  '这个视频太棒了',
  '笑死我了哈哈哈',
  '学到了学到了',
  '一键三连支持',
  'UP主辛苦了',
  '期待更多内容',
  '这个操作太秀了',
  '6666666666',
  '太精彩了',
  '支持UP主',
  '干货满满',
  '收藏了',
  '分享给朋友',
  '关注了',
  '点赞了',
  '投币了'
]

const videoTitles = [
  '【原创动画】超燃战斗场面',
  '【游戏实况】极限操作秀翻全场',
  '【音乐MV】最新热门歌曲',
  '【科技评测】黑科技产品体验',
  '【美食制作】教你做网红美食',
  '【旅行Vlog】探索未知世界',
  '【知识科普】有趣的科学知识',
  '【搞笑合集】笑到肚子疼'
]

const gameCategories = [
  '英雄联盟',
  '王者荣耀',
  '原神',
  '绝地求生',
  'CS:GO',
  '守望先锋',
  'DOTA2',
  '炉石传说'
]
</script>

<style scoped>
.glass-effect {
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

@keyframes barrage {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(100vw + 100%));
  }
}

.animate-barrage {
  animation: barrage linear infinite;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>