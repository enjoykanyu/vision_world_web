<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <!-- 使用公用导航头组件 -->
    <NavHeader 
      :isLoggedIn="userStore.isLoggedIn" 
      :username="userStore.username" 
      @login="handleLogin"
    ></NavHeader>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 视频状态容器 -->
      <div>
        <!-- 加载状态 -->
        <div v-if="loading" class="text-center py-20">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p class="mt-4 text-gray-600">视频加载中...</p>
        </div>

        <!-- 视频错误状态 -->
        <div v-else-if="videoError" class="text-center py-20 bg-red-50 dark:bg-red-900/20 rounded-lg p-8">
          <i class="fas fa-exclamation-circle text-red-500 text-5xl mb-4"></i>
          <h3 class="text-xl font-bold text-red-600 dark:text-red-400 mb-2">{{ errorMessage }}</h3>
          <button @click="fetchVideoData" class="mt-4 bg-bilibili-primary hover:bg-bilibili-primary/90 text-white font-medium py-2 px-6 rounded-lg transition-colors">
            重试加载
          </button>
        </div>

        <!-- 视频内容 -->
        <div v-else-if="video" class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <!-- Left side: Video Player and Info -->
          <div class="lg:col-span-8">
            <!-- 视频播放器容器 -->
            <div class="relative bg-black rounded-lg overflow-hidden shadow-2xl group" @mouseenter="showPauseButton = true" @mouseleave="showPauseButton = false">
              <!-- 弹幕层 - B站风格 -->
              <div class="absolute inset-0 pointer-events-none overflow-hidden" ref="danmakuContainer">
                <div v-for="danmaku in danmakus" :key="danmaku.id" 
                     class="danmaku-item absolute font-bold select-none"
                     :style="{
                       color: danmaku.color,
                       top: danmaku.top + '%',
                       animationDelay: Math.random() * 2 + 's',
                       animationDuration: (8 + Math.random() * 4) + 's',
                       textShadow: '1px 1px 1px rgba(0,0,0,0.8), -1px -1px 1px rgba(0,0,0,0.8), 1px -1px 1px rgba(0,0,0,0.8), -1px 1px 1px rgba(0,0,0,0.8)',
                       fontFamily: 'Microsoft YaHei, SimHei, sans-serif'
                     }">
                  {{ danmaku.text }}
                </div>
              </div>

              <!-- 视频元素 -->
              <video 
                ref="videoPlayer"
                :src="video.src"
                :poster="video.poster"
                class="w-full aspect-video object-contain"
                @timeupdate="onTimeUpdate"
                @loadedmetadata="initPlayer"
                @loadeddata="onVideoLoaded"
                @loadstart="onVideoLoadStart"
                @waiting="onVideoWaiting"
                @canplay="onVideoCanPlay"
                @play="onVideoPlay"
                @pause="onVideoPause"
                @ended="onVideoEnded"
                @click="togglePlay"
                @error="handleVideoError"
                crossorigin="anonymous"
                preload="auto"
                playsinline
              ></video>
              
              <!-- 视频加载失败提示 -->
              <div v-if="videoLoadError" class="absolute inset-0 flex items-center justify-center bg-gray-900">
                <div class="text-center text-white">
                  <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                  <p class="mb-4">视频加载失败</p>
                  <p class="text-sm text-gray-300 mb-4">{{ errorMessage || '正在尝试备用视频源...' }}</p>
                  <button @click="retryLoadVideo" class="bg-bilibili-primary hover:bg-bilibili-primary/90 text-white px-4 py-2 rounded mr-2">
                    重试
                  </button>
                  <button @click="tryNextVideoSource" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
                    切换视频源
                  </button>
                </div>
              </div>

              <!-- 自定义视频控制栏 - B站风格 -->
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <!-- 弹幕预览区域（在进度条上方） -->
                <div v-if="showDanmakuPreview && danmakuPreviewText" class="absolute bottom-20 left-0 right-0 px-4">
                  <div class="bg-black/70 rounded px-3 py-2 text-white text-sm inline-block border border-white/20">
                    {{ danmakuPreviewText }}
                  </div>
                </div>
                
                <!-- 进度条容器 -->
                <div class="relative mb-3">
                  <!-- 弹幕发送提示 -->
                  <div v-if="showDanmakuSendTip" class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-bilibili-primary text-white text-xs px-3 py-1 rounded-full whitespace-nowrap shadow-lg">
                    点击发送弹幕
                  </div>
                  
                  <!-- 进度条 - B站风格 -->
                  <div class="relative h-2 bg-black/40 rounded-full cursor-pointer group/progress hover:h-3 transition-all duration-200" 
                       @click="seek" 
                       @mousedown="startSeeking"
                       @touchstart="startSeeking"
                       @mouseenter="showDanmakuSendTip = true"
                       @mouseleave="showDanmakuSendTip = false">
                    <!-- 弹幕发送区域（透明层） -->
                    <div class="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-200" 
                         @click="sendDanmakuAtProgress($event)">
                      <div class="h-full flex items-center justify-center">
                        <div class="text-white text-xs bg-black/60 px-2 py-1 rounded-full border border-white/30">
                          点击发送弹幕
                        </div>
                      </div>
                    </div>
                    
                    <!-- 已播放进度 -->
                    <div class="absolute h-full bg-bilibili-primary rounded-full transition-all duration-100 shadow-sm" 
                         :style="{ width: `${progress}%` }"></div>
                    
                    <!-- 缓冲进度 -->
                    <div class="absolute h-full bg-white/30 rounded-full" 
                         :style="{ width: `${bufferedProgress}%` }"></div>
                    
                    <!-- 进度点 -->
                    <div class="absolute h-3 w-3 bg-white rounded-full -mt-0.5 shadow-lg cursor-grab active:cursor-grabbing transition-all hover:h-4 hover:w-4" 
                         :style="{ left: `${progress}%` }"
                         @mousedown="startSeeking"
                         @touchstart="startSeeking"></div>
                  </div>
                </div>

                <!-- 控制按钮和时间 - B站布局 -->
                <div class="flex items-center justify-between text-white text-sm">
                  <!-- 左侧控制区 -->
                  <div class="flex items-center space-x-3">
                    <button @click="togglePlay" class="hover:text-bilibili-primary transition-colors p-1">
                      <i class="fas text-lg" :class="isPlaying ? 'fa-pause' : 'fa-play'"></i>
                    </button>
                    <div class="flex items-center space-x-2">
                      <button @click="toggleMute" class="hover:text-bilibili-primary transition-colors p-1">
                        <i class="fas" :class="isMuted ? 'fa-volume-mute' : 'fa-volume-up'"></i>
                      </button>
                      <div class="relative">
                        <input type="range" min="0" max="100" v-model="volume" class="w-16 h-1 accent-bilibili-primary bg-gray-600 rounded-full appearance-none cursor-pointer" @input="setVolume">
                      </div>
                    </div>
                    <div class="text-xs font-mono">
                      {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
                    </div>
                  </div>
                  
                  <!-- 右侧控制区 -->
                  <div class="flex items-center space-x-3">
                    <!-- 弹幕开关 -->
                    <button @click="toggleDanmaku" class="hover:text-bilibili-primary transition-colors p-1 relative" :class="danmakuEnabled ? 'text-bilibili-primary' : 'text-white/70'">
                      <i class="fas fa-comment-dots text-lg"></i>
                      <span class="absolute -top-1 -right-1 text-xs bg-bilibili-primary text-white rounded-full w-4 h-4 flex items-center justify-center text-xs" v-if="danmakuEnabled">{{ danmakus.length }}</span>
                    </button>
                    
                    <!-- 播放速度 -->
                    <div class="relative">
                      <select v-model="playbackRate" @change="setPlaybackRate(playbackRate)" class="bg-black/60 text-white text-xs border border-white/20 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-bilibili-primary hover:bg-black/80 transition-colors">
                        <option value="0.5">0.5x</option>
                        <option value="0.75">0.75x</option>
                        <option value="1">1x</option>
                        <option value="1.25">1.25x</option>
                        <option value="1.5">1.5x</option>
                        <option value="2">2x</option>
                      </select>
                    </div>
                    
                    <!-- 全屏 -->
                    <button @click="toggleFullscreen" class="hover:text-bilibili-primary transition-colors p-1">
                      <i class="fas fa-expand text-lg"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- 播放/暂停按钮覆盖层 - B站风格 -->
              <div v-if="showPauseButton || !isPlaying" 
                   class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                   @click="togglePlay">
                <div class="play-button-overlay w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95">
                  <i class="fas text-2xl text-white" :class="isPlaying ? 'fa-pause' : 'fa-play ml-1'"></i>
                </div>
              </div>
            </div>

            <!-- 视频信息 -->
            <div class="mt-6 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h1 class="text-2xl font-bold mb-2">{{ video.title }}</h1>
              <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span>播放量: {{ video.viewCount }}</span>
                <span class="mx-2">•</span>
                <span>点赞: {{ video.likeCount }}</span>
                <span class="mx-2">•</span>
                <span>时长: {{ video.duration }}</span>
              </div>
              
              <!-- 视频说明 -->
              <div v-if="video.note" class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p class="text-sm text-blue-800 dark:text-blue-200">{{ video.note }}</p>
              </div>
              <!-- 键盘快捷键提示 -->
              <div class="mb-4 p-3 bg-gray-50 dark:bg-gray-700/20 rounded-lg">
                <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">键盘快捷键：</p>
                <div class="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span class="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">空格键: 播放/暂停</span>
                  <span class="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">←: 后退10秒</span>
                  <span class="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">→: 前进10秒</span>
                  <span class="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">↑: 增加音量</span>
                  <span class="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">↓: 减少音量</span>
                  <span class="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">M: 静音切换</span>
                </div>
              </div>
              <!-- 弹幕输入区域 - B站风格 -->
              <div class="danmaku-input-container mt-4 flex items-center space-x-3 bg-black/20 rounded-lg p-3">
                <input
                  v-model="newDanmakuText"
                  @keyup.enter="sendDanmaku"
                  placeholder="发个弹幕见证当下"
                  class="danmaku-input flex-1 px-3 py-2 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-bilibili-primary bg-black/30 border border-white/20 text-sm"
                >
                <div class="flex items-center space-x-2">
                  <button
                    v-for="color in danmakuColors"
                    :key="color.value"
                    @click="selectedDanmakuColor = color.value"
                    class="color-picker-btn w-5 h-5 rounded-full border transition-all"
                    :class="selectedDanmakuColor === color.value ? 'border-white scale-110 shadow-lg' : 'border-white/30 hover:scale-110'"
                    :style="{ backgroundColor: color.value }"
                  ></button>
                </div>
                <button
                  @click="sendDanmaku"
                  :disabled="!newDanmakuText.trim()"
                  class="px-4 py-2 bg-bilibili-primary text-white rounded hover:bg-bilibili-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
                >
                  发送
                </button>
              </div>
            </div>
          </div>

          <!-- 右侧: 关联视频列表 -->
          <div class="lg:col-span-4">
            <h2 class="text-xl font-bold mb-4">相关视频</h2>
            <div class="space-y-4">
              <div v-for="relatedVideo in relatedVideos" :key="relatedVideo.id" class="flex space-x-3 group cursor-pointer">
                <div class="relative flex-shrink-0 w-48 h-27 rounded overflow-hidden">
                  <img :src="relatedVideo.poster" alt="{{ relatedVideo.title }}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                  <span class="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                    {{ relatedVideo.duration }}
                  </span>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-medium line-clamp-2 group-hover:text-bilibili-primary transition-colors">
                    {{ relatedVideo.title }}
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                    {{ relatedVideo.author }}
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                    {{ relatedVideo.viewCount }} 播放
                  </p>
                </div>
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
import { useRoute } from 'vue-router'
import NavHeader from '@/components/NavHeader.vue'

// 使用store
const userStore = {
  isLoggedIn: false,
  username: ''
}

// 响应式数据
const video = ref<any>(null)
const loading = ref(true)
const videoError = ref(false)
const errorMessage = ref('')
const videoPlayer = ref<HTMLVideoElement | null>(null)
const currentVideoSourceIndex = ref(0)
const playbackRate = ref(1)

// 路由
const route = useRoute()
const videoId = route.params.id as string

// 弹幕相关状态
const danmakus = ref<Array<{text: string, color: string, left: number, top: number, id: number, time?: number}>>([])
const newDanmakuText = ref('')
const danmakuEnabled = ref(true)
const danmakuContainer = ref<HTMLDivElement | null>(null)
const selectedDanmakuColor = ref('#FFFFFF')
const showDanmakuPreview = ref(false)
const danmakuPreviewText = ref('')
const showDanmakuSendTip = ref(false)
const showPauseButton = ref(false)
const bufferedProgress = ref(0)

// 视频控制状态
const isPlaying = ref(false)
const isMuted = ref(false) // 默认不静音
const volume = ref(80)
const isDanmakuEnabled = ref(true)
const currentTime = ref(0)
const duration = ref(0)
const isFullscreen = ref(false)
const progress = ref(0)
const isHovered = ref(false)
const videoLoadError = ref(false)

// 进度条拖动状态
const isSeeking = ref(false)

// 相关视频数据
const relatedVideos = ref([
  { id: 1, title: '测试相关视频 1', author: '测试作者', viewCount: '1.2万', duration: '10:23', poster: 'https://picsum.photos/320/180?random=1' },
  { id:2, title: '测试相关视频 2', author: '测试作者', viewCount: '8.5千', duration: '08:45', poster: 'https://picsum.photos/320/180?random=2' },
  { id: 3, title: '测试相关视频 3 这是一个比较长的标题用来测试多行显示效果', author: '测试作者', viewCount: '3.7万', duration: '15:12', poster: 'https://picsum.photos/320/180?random=3' },
  { id: 4, title: '测试相关视频 4', author: '测试作者', viewCount: '2.1万', duration: '05:30', poster: 'https://picsum.photos/320/180?random=4' },
  { id: 5, title: '测试相关视频 5', author: '测试作者', viewCount: '9.8千', duration: '12:48', poster: 'https://picsum.photos/320/180?random=5' },
])

// 弹幕颜色选项
const danmakuColors = ref([
  { value: '#FFFFFF', class: 'border-gray-400' },
  { value: '#FF6B6B', class: 'border-red-400' },
  { value: '#4ECDC4', class: 'border-teal-400' },
  { value: '#45B7D1', class: 'border-blue-400' },
  { value: '#FFA07A', class: 'border-orange-400' },
  { value: '#98D8C8', class: 'border-green-400' },
  { value: '#F7DC6F', class: 'border-yellow-400' },
  { value: '#BB8FCE', class: 'border-purple-400' }
])

// 方法
const handleLogin = () => {
  // 登录处理逻辑
  console.log('登录处理')
}

// 播放器初始化
const initPlayer = () => {
  if (videoPlayer.value) {
    duration.value = videoPlayer.value.duration || 30
    console.log('播放器初始化完成，视频时长:', duration.value)
  }
}

// 更新进度条
const updateProgress = () => {
  if (videoPlayer.value && duration.value > 0) {
    currentTime.value = videoPlayer.value.currentTime
    progress.value = (currentTime.value / duration.value) * 100
  }
}

// 格式化时间
const formatTime = (timeInSeconds: number) => {
  const minutes = Math.floor(timeInSeconds / 60)
  const seconds = Math.floor(timeInSeconds % 60)
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

// 切换静音状态
const toggleMute = () => {
  if (videoPlayer.value) {
    videoPlayer.value.muted = !videoPlayer.value.muted
    isMuted.value = videoPlayer.value.muted
    if (isMuted.value) {
      volume.value = 0
    } else if (volume.value === 0) {
      volume.value = 50 // 取消静音时恢复到50%
    }
  }
  console.log('静音状态:', isMuted.value ? '静音' : '开启')
}

// 设置音量
const setVolume = () => {
  if (videoPlayer.value) {
    videoPlayer.value.volume = volume.value / 100
    videoPlayer.value.muted = volume.value === 0
    isMuted.value = volume.value === 0
  }
  console.log('音量设置为:', volume.value)
}

// 设置播放速度
const setPlaybackRate = (rate: number) => {
  if (videoPlayer.value) {
    videoPlayer.value.playbackRate = rate
  }
  playbackRate.value = rate
  console.log('播放速度设置为:', rate)
}

// 跳转播放位置
const seek = (e: MouseEvent) => {
  if (!videoPlayer.value || !e.currentTarget) return
  
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const pos = (e.clientX - rect.left) / rect.width
  const newTime = pos * duration.value
  
  videoPlayer.value.currentTime = newTime
  currentTime.value = newTime
  progress.value = pos * 100
}

// 开始拖动进度条
const startSeeking = (e: MouseEvent | TouchEvent) => {
  e.preventDefault()
  isSeeking.value = true
  
  // 添加全局事件监听器
  document.addEventListener('mousemove', handleSeeking)
  document.addEventListener('mouseup', stopSeeking)
  document.addEventListener('touchmove', handleSeeking)
  document.addEventListener('touchend', stopSeeking)
  
  // 立即更新位置
  handleSeeking(e)
}

// 处理拖动过程
const handleSeeking = (e: MouseEvent | TouchEvent) => {
  if (!isSeeking.value || !videoPlayer.value) return
  
  // 获取进度条元素
  const progressBar = document.querySelector('.relative.h-1.bg-gray-500') as HTMLElement
  if (!progressBar) return
  
  const rect = progressBar.getBoundingClientRect()
  let clientX: number
  
  if ('touches' in e) {
    clientX = e.touches[0].clientX
  } else {
    clientX = e.clientX
  }
  
  const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
  const newTime = pos * duration.value
  
  // 更新进度条显示（拖动时只更新显示，不实际跳转）
  progress.value = pos * 100
  currentTime.value = newTime
}

// 停止拖动
const stopSeeking = () => {
  if (!isSeeking.value || !videoPlayer.value) return
  
  isSeeking.value = false
  
  // 在拖动结束时真正跳转到指定位置
  const targetTime = (progress.value / 100) * duration.value
  videoPlayer.value.currentTime = targetTime
  
  // 移除全局事件监听器
  document.removeEventListener('mousemove', handleSeeking)
  document.removeEventListener('mouseup', stopSeeking)
  document.removeEventListener('touchmove', handleSeeking)
  document.removeEventListener('touchend', stopSeeking)
}

// 切换全屏
const toggleFullscreen = () => {
  const container = videoPlayer.value?.parentElement
  if (!container) return

  if (!document.fullscreenElement) {
    container.requestFullscreen().catch(err => {
      console.error(`全屏错误: ${err.message}`)
    })
  } else {
    document.exitFullscreen()
  }
}

// 切换弹幕显示
const toggleDanmaku = () => {
  danmakuEnabled.value = !danmakuEnabled.value
  if (danmakuContainer.value) {
    danmakuContainer.value.style.pointerEvents = danmakuEnabled.value ? 'none' : 'auto'
  }
}

// 发送弹幕
const sendDanmaku = () => {
  if (!newDanmakuText.value.trim() || !danmakuEnabled.value) return

  const danmaku = {
    text: newDanmakuText.value,
    color: selectedDanmakuColor.value,
    left: 100,
    top: Math.random() * 80 + 10,
    id: Date.now() + Math.random(),
    time: currentTime.value
  }

  danmakus.value.push(danmaku)
  newDanmakuText.value = ''
  
  // 3秒后自动移除弹幕
  setTimeout(() => {
    const index = danmakus.value.findIndex(d => d.id === danmaku.id)
    if (index > -1) {
      danmakus.value.splice(index, 1)
    }
  }, 8000)
}

// 在进度条位置发送弹幕
const sendDanmakuAtProgress = (e: MouseEvent) => {
  if (!newDanmakuText.value.trim() || !danmakuEnabled.value) return
  
  e.stopPropagation()
  
  // 计算点击位置对应的时间
  const rect = (e.currentTarget as HTMLElement).parentElement!.getBoundingClientRect()
  const pos = (e.clientX - rect.left) / rect.width
  const targetTime = pos * duration.value
  
  const danmaku = {
    text: newDanmakuText.value,
    color: selectedDanmakuColor.value,
    left: 100,
    top: Math.random() * 80 + 10,
    id: Date.now() + Math.random(),
    time: targetTime
  }
  
  danmakus.value.push(danmaku)
  newDanmakuText.value = ''
  
  // 显示发送成功提示
  danmakuPreviewText.value = danmaku.text
  showDanmakuPreview.value = true
  
  setTimeout(() => {
    showDanmakuPreview.value = false
  }, 2000)
  
  // 3秒后自动移除弹幕
  setTimeout(() => {
    const index = danmakus.value.findIndex(d => d.id === danmaku.id)
    if (index > -1) {
      danmakus.value.splice(index, 1)
    }
  }, 8000)
}

// 模拟弹幕
const simulateDanmakus = () => {
  const sampleTexts = [
    '这个视频太棒了！', '前方高能！', '666', '主播加油！', '哈哈哈哈',
    '这个操作太秀了', '学习了', '打卡', '支持一下', '路过留名',
    '太精彩了', '收藏了', '分享一波', '感谢分享', '太厉害了',
    '弹幕护体', '保护保护', '来了来了', '前排围观', '太真实了'
  ]

  // 清空现有弹幕
  danmakus.value = []

  // 添加初始弹幕，使用更真实的B站风格
  for (let i = 0; i < 20; i++) {
    const danmaku = {
      text: sampleTexts[Math.floor(Math.random() * sampleTexts.length)],
      color: danmakuColors.value[Math.floor(Math.random() * danmakuColors.value.length)].value,
      left: 100,
      top: Math.random() * 70 + 10, // 避免顶部和底部
      id: Date.now() + Math.random() + i,
      time: Math.random() * 30
    }
    
    danmakus.value.push(danmaku)
    
    // 8秒后自动移除弹幕
    setTimeout(() => {
      const index = danmakus.value.findIndex(d => d.id === danmaku.id)
      if (index > -1) {
        danmakus.value.splice(index, 1)
      }
    }, 8000 + Math.random() * 4000) // 8-12秒随机时间
  }
}



// 切换播放状态
const togglePlay = () => {
  if (!videoPlayer.value) return
  
  if (videoPlayer.value.paused) {
    videoPlayer.value.play()
    isPlaying.value = true
  } else {
    videoPlayer.value.pause()
    isPlaying.value = false
  }
}

const fetchVideoData = async () => {
  loading.value = true
  videoError.value = false
  currentVideoSourceIndex.value = 0 // 重置视频源索引
  
  try {
    // 模拟API调用
    // 实际应用中应该调用真实的API获取视频数据
    console.log(`获取视频ID: ${videoId}的数据`)
    
    // 使用真实的视频文件
    video.value = {
      id: videoId,
      title: 'VisionWorld 示例视频',
      src: '/videos/sample.mp4', // 使用真实的视频文件
      poster: 'https://picsum.photos/seed/video123/800/450.jpg',
      viewCount: '1.2万',
      likeCount: '856',
      duration: '00:30',
      note: '这是一个真实的视频演示，展示了VisionWorld的视频播放功能。'
    }
  } catch (error) {
    videoError.value = true
    errorMessage.value = '视频加载失败，请稍后重试'
    console.error('视频加载错误:', error)
  } finally {
    loading.value = false
  }
}

// 键盘快捷键（模拟播放模式）
const handleKeydown = (e: KeyboardEvent) => {
  switch (e.code) {
    case 'Space':
      e.preventDefault()
      togglePlay()
      break
    case 'ArrowLeft':
      e.preventDefault()
      if (videoPlayer.value) {
        videoPlayer.value.currentTime = Math.max(0, videoPlayer.value.currentTime - 10)
      }
      break
    case 'ArrowRight':
      e.preventDefault()
      if (videoPlayer.value) {
        videoPlayer.value.currentTime = Math.min(duration.value, videoPlayer.value.currentTime + 10)
      }
      break
    case 'ArrowUp':
      e.preventDefault()
      volume.value = Math.min(100, volume.value + 5)
      setVolume()
      break
    case 'ArrowDown':
      e.preventDefault()
      volume.value = Math.max(0, volume.value - 5)
      setVolume()
      break
    case 'KeyM':
      e.preventDefault()
      toggleMute()
      break
  }
}

// 生命周期
onMounted(() => {
  fetchVideoData()
  simulateDanmakus()
  window.addEventListener('keydown', handleKeydown)
})

// 处理视频加载错误（现在为模拟播放，错误处理简化）
const handleVideoError = (event: Event) => {
  console.log('视频元素错误（模拟播放模式）:', event)
  // 在模拟播放模式下，不需要处理视频加载错误
}

// 重试加载视频（模拟播放模式下简化处理）
const retryLoadVideo = () => {
  videoLoadError.value = false
  console.log('模拟播放模式下，重试功能已简化')
}

// 尝试下一个视频源（模拟播放模式下简化处理）
const tryNextVideoSource = () => {
  console.log('模拟播放模式下，无需切换视频源')
}

// 视频加载状态处理
const onVideoLoadStart = () => {
  console.log('视频开始加载')
}

const onVideoLoaded = () => {
  console.log('视频数据加载完成')
  videoLoadError.value = false
}

const onVideoWaiting = () => {
  console.log('视频缓冲中...')
}

const onVideoCanPlay = () => {
  console.log('视频可以开始播放')
  videoLoadError.value = false
}

// 视频播放事件
const onVideoPlay = () => {
  console.log('视频开始播放')
  isPlaying.value = true
}

// 视频暂停事件
const onVideoPause = () => {
  console.log('视频暂停')
  isPlaying.value = false
}

// 视频结束事件
const onVideoEnded = () => {
  console.log('视频播放结束')
  isPlaying.value = false
  currentTime.value = 0
  progress.value = 0
}

// 监听视频时间更新事件
const onTimeUpdate = () => {
  if (videoPlayer.value && !isSeeking.value) {
    currentTime.value = videoPlayer.value.currentTime
    progress.value = (videoPlayer.value.currentTime / duration.value) * 100
  }
}

// 生命周期
onMounted(() => {
  fetchVideoData()
  simulateDanmakus()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (videoPlayer.value) {
    videoPlayer.value.pause()
  }
})
</script>

<style scoped>
/* B站风格弹幕样式 */
.danmaku-item {
  white-space: nowrap;
  font-weight: bold;
  font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
  pointer-events: none;
  user-select: none;
  letter-spacing: 0.5px;
}

/* B站风格播放按钮 */
.play-button-overlay {
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.8);
  transition: all 0.2s ease;
}

.play-button-overlay:hover {
  background: rgba(0, 0, 0, 0.7);
  border-color: rgba(255, 255, 255, 1);
}

/* B站风格进度条 */
.progress-bar {
  transition: all 0.2s ease;
}

.progress-bar:hover .progress-track {
  height: 6px;
}

.progress-bar:hover .progress-thumb {
  transform: scale(1.2);
}

/* B站风格控制栏 */
.control-button {
  transition: all 0.2s ease;
  border-radius: 4px;
}

.control-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.control-button:active {
  background: rgba(255, 255, 255, 0.2);
}

/* B站风格输入框 */
.danmaku-input {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  transition: all 0.3s ease;
  font-family: 'Microsoft YaHei', sans-serif;
}

.danmaku-input:focus {
  background: rgba(255, 255, 255, 0.15);
  border-color: #00a1d6;
  box-shadow: 0 0 0 2px rgba(0, 161, 214, 0.3);
}

/* B站风格颜色选择器 */
.color-picker-btn {
  transition: all 0.2s ease;
  border-radius: 50%;
}

.color-picker-btn:hover {
  transform: scale(1.15);
}

.color-picker-btn.active {
  box-shadow: 0 0 0 2px white, 0 0 0 4px #00a1d6;
}

/* B站风格动画 */
@keyframes danmaku-scroll {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(-100%);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .danmaku-input-container {
    flex-direction: column;
    gap: 8px;
  }
  
  .danmaku-controls {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .play-button-overlay {
    width: 3rem;
    height: 3rem;
  }
}

/* B站风格滚动条 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* B站主色调 */
:root {
  --bilibili-primary: #00a1d6;
  --bilibili-primary-hover: #00b5e5;
  --bilibili-bg: #f6f7f8;
  --bilibili-text: #212121;
}
</style>