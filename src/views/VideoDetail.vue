<template>
  <div class="min-h-screen bg-bilibili-bg-secondary dark:bg-bilibili-bg-dark text-bilibili-text-primary dark:text-bilibili-text-dark">
    <!-- 使用公用导航头组件 -->
    <NavHeader 
      :isLoggedIn="userStore.isLoggedIn" 
      :username="userStore.username" 
      @login="handleLogin"
    ></NavHeader>

    <main class="max-w-[1256px] mx-auto px-4 sm:px-6 lg:px-0 py-2">
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
        <div v-else-if="video" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Left side: Video Player and Info -->
          <div class="lg:col-span-8">
            <!-- 视频播放器容器 -->
            <div class="relative bg-black rounded-lg overflow-hidden shadow-lg group" id="video-container">
              <!-- 弹幕容器 -->
              <div class="absolute inset-0 pointer-events-none" ref="danmakuContainer">
                <div v-for="(danmaku, index) in danmakus" :key="index" 
                  :style="{ left: '100%', top: `${danmaku.top}%`, color: danmaku.color, transform: `translateX(${danmaku.translateX || 0}px)` }"
                  class="absolute whitespace-nowrap text-white danmaku-item">
                  {{ danmaku.text }}
                </div>
              </div>

              <!-- 视频元素 -->
              <video
                ref="videoPlayer"
                :poster="video.poster"
                class="w-full h-full object-cover"
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
                @dblclick="toggleFullscreen"
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

              <!-- 加载进度指示器 -->
              <div v-if="loading && !videoLoadError" class="absolute inset-0 flex items-center justify-center bg-black/50">
                <div class="text-center text-white">
                  <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
                  <p class="text-sm">视频加载中... {{ loadingProgress.toFixed(0) }}%</p>
                  <div class="w-64 h-2 bg-gray-700 rounded-full mt-2 overflow-hidden">
                    <div 
                      class="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                      :style="{ width: `${loadingProgress}%` }"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- 缓冲区健康度指示器 -->
              <div v-if="!loading && !videoLoadError && isPlaying" class="absolute top-4 right-4 flex items-center space-x-2 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2">
                <div class="flex items-center space-x-1">
                  <i 
                    class="fas fa-signal text-xs"
                    :class="{
                      'text-green-400': bufferHealth > 70,
                      'text-yellow-400': bufferHealth > 30 && bufferHealth <= 70,
                      'text-red-400': bufferHealth <= 30
                    }"
                  ></i>
                  <span class="text-xs text-white">{{ bufferHealth.toFixed(0) }}%</span>
                </div>
                <div class="w-px h-4 bg-gray-600"></div>
                <div class="flex items-center space-x-1">
                  <i 
                    class="fas fa-tachometer-alt text-xs"
                    :class="{
                      'text-green-400': networkQuality === 'good',
                      'text-yellow-400': networkQuality === 'fair',
                      'text-red-400': networkQuality === 'poor'
                    }"
                  ></i>
                  <span class="text-xs text-white">{{ (currentBandwidth / 1000).toFixed(0) }}kbps</span>
                </div>
              </div>

              <!-- 用户头像和关注按钮 -->
              <div class="absolute top-4 left-4 flex items-center space-x-2">
                <div 
                  class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold overflow-hidden shadow-md" 
                  :class="{'bg-bilibili-pink bg-gradient-to-br from-bilibili-pink to-bilibili-pink-dark': !video.authorAvatar}"
                >
                  <img 
                    v-if="video.authorAvatar" 
                    :src="video.authorAvatar" 
                    alt="作者头像" 
                    class="w-full h-full object-cover"
                  >
                  <span v-else>{{ video.author?.charAt(0) || 'U' }}</span>
                </div>
                <button 
                  class="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-3 py-1 rounded-md text-sm font-medium transition-all duration-200"
                  @click="toggleFollow"
                >
                  {{ video.isFollowed ? '已关注' : '+ 关注' }}
                </button>
              </div>

              <!-- 自定义视频控制栏 -->
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 opacity-0 transition-opacity duration-300 ease-in-out" :class="{ 'opacity-100': !isPlaying || showControls }" id="video-controls">
                <!-- 进度条 -->
                <div class="relative h-1.5 bg-gray-700 rounded-full mb-3 cursor-pointer group/seek" 
                     @click="seek" 
                     @mousedown="startSeeking"
                     @touchstart="startSeeking">
                  <div class="absolute h-full bg-gray-500 rounded-full" :style="{ width: `${progress}%` }">
                    <div class="absolute h-full bg-red-500 rounded-full transition-all duration-100 ease-out" :style="{ width: `${progress}%` }"></div>
                  </div>
                  <div class="absolute h-4 w-4 bg-white rounded-full -mt-1.25 cursor-grab active:cursor-grabbing shadow-lg opacity-0 group-hover/seek:opacity-100 transition-opacity duration-100 ease-out" 
                       :style="{ left: `${progress}%` }"
                       @mousedown="startSeeking"
                       @touchstart="startSeeking"></div>
                </div>

                <!-- 控制按钮和时间 -->
                <div class="flex items-center justify-between text-white">
                  <div class="flex items-center space-x-5">
                    <button @click="togglePlay" class="hover:text-red-500 transition-colors duration-200 text-xl">
                      <i class="fas" :class="isPlaying ? 'fa-pause' : 'fa-play'"></i>
                    </button>
                    <div class="text-sm font-medium bg-black/40 backdrop-blur-sm px-2 py-1 rounded">
                      {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
                    </div>
                  </div>
                  <div class="flex items-center space-x-5">
                    <!-- 画质选择 -->
                    <div class="flex items-center space-x-2">
                      <select
                        v-model="videoQuality"
                        @change="(e: Event) => setVideoQuality((e.target as HTMLSelectElement).value)"
                        class="bg-black/40 backdrop-blur-sm text-white border border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                      >
                        <option value="auto">自动</option>
                        <option value="1080p">1080P 高清</option>
                        <option value="720p">720P 高清</option>
                        <option value="480p">480P 清晰</option>
                        <option value="360p">360P 流畅</option>
                      </select>
                      <!-- 网络质量指示器 -->
                      <div 
                        class="flex items-center space-x-1 text-xs"
                        :class="{
                          'text-green-400': networkQuality === 'good',
                          'text-yellow-400': networkQuality === 'fair',
                          'text-red-400': networkQuality === 'poor'
                        }"
                      >
                        <i 
                          class="fas fa-signal"
                          :class="{
                            'text-green-400': networkQuality === 'good',
                            'text-yellow-400': networkQuality === 'fair',
                            'text-red-400': networkQuality === 'poor'
                          }"
                        ></i>
                        <span>{{ networkQuality === 'good' ? '良好' : networkQuality === 'fair' ? '一般' : '较差' }}</span>
                      </div>
                    </div>
                    <!-- 播放速度 -->
                    <div class="playback-speed flex items-center space-x-2">
                      <select
                        v-model="playbackRate"
                        @change="setPlaybackRate(playbackRate)"
                        class="bg-black/40 backdrop-blur-sm text-white border border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                      >
                        <option value="0.5">0.5x</option>
                        <option value="0.75">0.75x</option>
                        <option value="1">1x</option>
                        <option value="1.25">1.25x</option>
                        <option value="1.5">1.5x</option>
                        <option value="2">2x</option>
                        <option value="3">3x</option>
                        <option value="4">4x</option>
                      </select>
                    </div>
                    <!-- 字幕 -->
                    <button @click="() => {}" class="hover:text-red-500 transition-colors duration-200 text-xl">
                      <i class="fas fa-closed-captioning"></i>
                    </button>
                    <!-- 音量 -->
                    <div class="flex items-center space-x-2">
                      <button @click="toggleMute" class="hover:text-red-500 transition-colors duration-200 text-xl">
                        <i class="fas" :class="isMuted ? 'fa-volume-mute' : 'fa-volume-up'"></i>
                      </button>
                    </div>
                    <!-- 设置 -->
                    <button @click="() => {}" class="hover:text-red-500 transition-colors duration-200 text-xl">
                      <i class="fas fa-cog"></i>
                    </button>
                    <!-- 网页全屏 -->
                    <button @click="toggleFullscreen" class="hover:text-red-500 transition-colors duration-200 text-xl">
                      <i class="fas fa-expand"></i>
                    </button>
                    <!-- 全屏 -->
                    <button @click="toggleFullscreen" class="hover:text-red-500 transition-colors duration-200 text-xl">
                      <i class="fas fa-expand"></i>
                    </button>
                    <!-- 核按钮 -->
                    <button @click="() => {}" class="hover:text-red-500 transition-colors duration-200 text-xl">
                      <i class="fas fa-radiation-alt text-red-500"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- 播放按钮覆盖层 - 只在未播放且视频已就绪时显示 -->
              <div v-if="!isPlaying && videoReady" class="absolute inset-0 flex items-center justify-center pointer-events-none">
                <button @click="togglePlay" class="w-20 h-20 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-all duration-300 transform hover:scale-105 pointer-events-auto">
                  <i class="fas fa-play text-4xl text-white pl-1"></i>
                </button>
              </div>
              
              <!-- 鼠标移动检测，用于显示/隐藏控制栏 -->
              <div class="absolute inset-0 pointer-events-none" @mousemove="onMouseMove" @mouseleave="onMouseLeave"></div>
            </div>
            
            <!-- 视频标题 -->
            <div class="mt-4">
              <h1 class="text-2xl font-bold">{{ video.title }}</h1>
              <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                <span>{{ videoStats.viewCount }}播放</span>
                <span class="mx-2">•</span>
                <span>{{ videoStats.danmakuCount }}弹幕</span>
                <span class="mx-2">•</span>
                <span>{{ videoStats.publishTime }}</span>
              </div>
            </div>
            
            <!-- 点赞、投币、收藏、转发 -->
            <div class="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
              <div class="flex items-center space-x-8">
                <button class="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-bilibili-pink transition-all duration-200 group" @click="toggleLike">
                  <i class="fas fa-thumbs-up text-xl group-hover:scale-110 transition-transform" :class="isLiked ? 'text-bilibili-pink' : ''"></i>
                  <span class="font-medium">{{ videoStats.likeCount }}</span>
                </button>
                <button class="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-bilibili-pink transition-all duration-200 group" @click="toggleCoin">
                  <i class="fas fa-coins text-xl group-hover:scale-110 transition-transform" :class="isCoined ? 'text-bilibili-pink' : ''"></i>
                  <span class="font-medium">{{ videoStats.coinCount }}</span>
                </button>
                <button class="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-bilibili-pink transition-all duration-200 group" @click="toggleFavorite">
                  <i class="fas fa-bookmark text-xl group-hover:scale-110 transition-transform" :class="isFavorited ? 'text-bilibili-pink' : ''"></i>
                  <span class="font-medium">{{ videoStats.favoriteCount }}</span>
                </button>
                <button class="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-bilibili-pink transition-all duration-200 group" @click="shareVideo">
                  <i class="fas fa-share text-xl group-hover:scale-110 transition-transform"></i>
                  <span class="font-medium">{{ videoStats.shareCount }}</span>
                </button>
              </div>
            </div>
            
            <!-- 正在观看人数和弹幕发送 -->
            <div class="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <i class="fas fa-eye mr-1"></i> {{ videoStats.watchingCount }}人正在看，已装填{{ videoStats.danmakuCount }}条弹幕
                </div>
                <div class="flex items-center space-x-2">
                  <button class="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors">
                    <i class="fas fa-shield-alt mr-1"></i> 防挡弹幕
                  </button>
                  <button class="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors">
                    <i class="fas fa-list mr-1"></i> 弹幕列表
                  </button>
                </div>
              </div>
              
              <!-- 弹幕发送组件 -->
              <div class="flex items-center space-x-2">
                <input
                  v-model="newDanmakuText"
                  @keyup.enter="sendDanmaku"
                  placeholder="发个友善的弹幕见证当下"
                  class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-bilibili-pink dark:bg-gray-700 dark:text-white transition-all duration-200 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:border-gray-200 dark:disabled:border-gray-700"
                  :disabled="!danmakuEnabled"
                >
                <!-- 弹幕颜色选择器 -->
                <input
                  type="color"
                  v-model="danmakuColor"
                  class="w-10 h-10 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-bilibili-pink transition-all duration-200"
                  :disabled="!danmakuEnabled"
                >
                <select
                  v-model="danmakuSpeed"
                  class="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-2 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-bilibili-pink transition-all duration-200"
                  :disabled="!danmakuEnabled"
                >
                  <option value="slow">慢</option>
                  <option value="normal">正常</option>
                  <option value="fast">快</option>
                </select>
                <button
                  @click="sendDanmaku"
                  :disabled="!danmakuEnabled || !newDanmakuText.trim()"
                  class="bg-bilibili-pink hover:bg-bilibili-pink-dark text-white px-4 py-2 rounded-md font-medium transition-all duration-200 disabled:bg-gray-300 dark:disabled:bg-gray-600 hover:shadow-md active:scale-95"
                >
                  发送
                </button>
              </div>
            </div>
            
            <!-- 视频简介 -->
            <div class="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
              <div class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {{ video.note }}
              </div>
              <div class="mt-4 flex flex-wrap items-center">
                <span 
                  v-for="(tag, index) in video.tags" 
                  :key="index" 
                  class="mr-3 mb-2 px-3 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-bilibili-pink hover:text-white transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md active:scale-95"
                >
                  {{ tag }}
                </span>
                <div class="flex items-center ml-auto text-xs text-gray-500 dark:text-gray-400 space-x-4">
                  <span>{{ video.author }}</span>
                  <span>{{ video.category }}</span>
                </div>
              </div>
            </div>

            <!-- 评论区 -->
            <CommentSection :video-id="video.id" />
          </div>

          <!-- 右侧: 视频信息展示区域 -->
          <div class="lg:col-span-4">
            <!-- UP主信息卡片 -->
            <div class="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-600 shadow hover:shadow-md transition-shadow duration-300">
              <div class="flex items-center space-x-3">
                <div 
                  class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold overflow-hidden shadow-md cursor-pointer hover:opacity-90 transition-opacity"
                  :class="{'bg-bilibili-pink bg-gradient-to-br from-bilibili-pink to-bilibili-pink-dark': !video.authorAvatar}"
                  @click="goToUserHome"
                >
                  <img 
                    v-if="video.authorAvatar" 
                    :src="video.authorAvatar" 
                    alt="作者头像" 
                    class="w-full h-full object-cover"
                  >
                  <span v-else>{{ video.author.charAt(0) }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-gray-900 dark:text-white truncate">{{ video.author }}</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ video.authorStats.followerCount }}粉丝</p>
                </div>
                <div class="flex space-x-2">
                  <button class="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:shadow active:scale-95">
                    <i class="fas fa-envelope"></i>
                  </button>
                  <button 
                    class="bg-bilibili-pink hover:bg-bilibili-pink-dark text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:shadow-md active:scale-95"
                    @click="toggleFollow"
                  >
                    {{ video.isFollowed ? '已关注' : '+ 关注' }}
                  </button>
                </div>
              </div>
            </div>
            
            <!-- 相关视频 -->
            <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600 shadow hover:shadow-md transition-shadow duration-300">
              <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">相关视频</h3>
              <div class="space-y-4">
                <div v-for="relatedVideo in relatedVideos" :key="relatedVideo.id" class="flex space-x-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md transition-all duration-200 hover:-translate-y-1 hover:shadow-sm">
                  <div class="relative flex-shrink-0 w-32 h-20 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                    <img :src="relatedVideo.poster" alt="{{ relatedVideo.title }}" class="w-full h-full object-cover transition-transform duration-300 hover:scale-105">
                    <span class="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded-md">
                      {{ relatedVideo.duration }}
                    </span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 hover:text-bilibili-pink transition-colors">
                      {{ relatedVideo.title }}
                    </h4>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 hover:text-bilibili-pink transition-colors">{{ relatedVideo.author }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 hover:text-bilibili-pink transition-colors">{{ relatedVideo.viewCount }} 播放</p>
                  </div>
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
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import NavHeader from '@/components/NavHeader.vue'
import CommentSection from '@/components/CommentSection.vue'
import { danmakuAPI } from '@/api/danmaku'
import { useUserStore } from '@/stores/userStore'
import { videoAPI } from '@/api/video'
import Hls from 'hls.js'

// 使用store
const userStore = useUserStore()

// 响应式数据
const video = ref<any>(null)
const loading = ref(true)
const videoError = ref(false)
const errorMessage = ref('')
const videoPlayer = ref<HTMLVideoElement | null>(null)
const videoReady = ref(false) // 视频元素是否就绪
const currentVideoSourceIndex = ref(0)
const fallbackVideoUrl = ref('') // 降级视频URL
const playbackRate = ref(1)
const videoQuality = ref('720p')
const hlsInstance = ref<Hls | null>(null)
const isPlayLocked = ref(false)
const networkQuality = ref<'good' | 'fair' | 'poor'>('good')
const currentBandwidth = ref(0)
const bufferHealth = ref(100)
const loadingProgress = ref(0)
const autoQuality = ref(true) // 播放锁，防止 rapid play/pause

// 路由
const route = useRoute()
const videoId = route.params.id as string



// 弹幕相关状态
// 弹幕池 - 存储所有预生成的弹幕
const danmakuPool = ref<Array<{text: string, color: string, top: number, speed: number, timestamp: number, visible: boolean, translateX: number}>>([])
// 当前显示的弹幕
const danmakus = ref<Array<{text: string, color: string, top: number, speed: number, timestamp: number, visible: boolean, translateX: number}>>([])
const newDanmakuText = ref('')
const danmakuEnabled = ref(true)
const danmakuContainer = ref<HTMLDivElement | null>(null)
const danmakuColor = ref('#FFFFFF')
const danmakuSpeed = ref('normal')
const danmakuDensity = ref('normal') // low, normal, high

// 修复视频URL中的重复路径问题
const cleanVideoUrl = (url: string): string => {
  if (!url) return url
  
  console.log('原始URL:', url)
  
  try {
    // 检查是否为HLS流URL，如果是则转换为API网关格式
    if (url.includes('.m3u8') || url.includes('hls/')) {
      // 提取视频ID并构建正确的HLS流URL
      const videoIdMatch = url.match(/(\d+)\/hls\//)
      if (videoIdMatch) {
        const videoId = videoIdMatch[1]
        const hlsPath = url.split('/hls/')[1] || 'index.m3u8'
        const cleanedUrl = `/api/video/${videoId}/stream/${hlsPath}`
        console.log('HLS流URL转换为:', cleanedUrl)
        return cleanedUrl
      }
    }
    
    // 检查是否包含 /play/stream/ 路径，转换为正确的API网关格式
    if (url.includes('/play/stream/')) {
      const match = url.match(/\/play\/stream\/(\d+)/)
      if (match) {
        const videoId = match[1]
        const cleanedUrl = `/api/video/${videoId}/stream/index.m3u8`
        console.log('转换play/stream URL为:', cleanedUrl)
        return cleanedUrl
      }
    }
    
    // 只修复重复的 /videos/videos/ 路径，不进行其他修改
    // 注意：不能修改URL的其他部分，特别是查询参数中的签名
    const cleanedUrl = url.replace(/\/videos\/videos\//g, '/videos/')
    console.log('修复重复路径后:', cleanedUrl)
    
    return cleanedUrl
  } catch (error) {
    console.error('URL处理错误:', error)
    // 如果处理失败，返回原始URL
    return url
  }
}

// 验证封面URL是否有效
const isValidCoverUrl = (url: string): boolean => {
  if (!url || url.trim() === '') return false
  
  // 检查是否是无效的默认封面URL
  if (url.includes('default-cover-url.com')) return false
  
  // 检查是否是有效的HTTP/HTTPS URL
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

// 获取默认封面URL
const getDefaultCoverUrl = (videoId: string): string => {
  return `https://picsum.photos/640/360?random=${videoId}`
}

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
const showControls = ref(false) // 控制栏显示状态
let controlsTimeout: number | null = null

// 模拟数据
const videoStats = ref({
  viewCount: '9.8万',
  danmakuCount: '666',
  likeCount: '1.7万',
  coinCount: '370',
  favoriteCount: '3',
  shareCount: '970',
  publishTime: '2025-11-28 23:06:47',
  watchingCount: '268'
})

// 点赞收藏转发状态
const isLiked = ref(false)
const isFavorited = ref(false)
const isCoined = ref(false)

// UP主信息
const videoAuthor = ref({
  id: '1',
  name: '万维猫动画',
  avatar: '',
  followerCount: '10.5万'
})

// 视频相关数据
const relatedVideos = ref([
  { id: 1, title: '人气新作《鬼灭之刃 火之神风谭2》Steam限时特惠/折！', author: '测试作者', viewCount: '14655.0万', duration: '00:16', poster: 'https://picsum.photos/320/180?random=1' },
  { id: 2, title: '凡人动画联想ThinkBook联名限定上线', author: '测试作者', viewCount: '8.5千', duration: '00:16', poster: 'https://picsum.photos/320/180?random=2' },
  { id: 3, title: '【凡人逛天商】闻天城交换会现场...', author: '测试作者', viewCount: '3.7万', duration: '00:35', poster: 'https://picsum.photos/320/180?random=3' },
  { id: 4, title: '【凡人逛天商】险中求荣！韩立遇...', author: '测试作者', viewCount: '2.1万', duration: '00:33', poster: 'https://picsum.photos/320/180?random=4' },
  { id: 5, title: '【凡人动画】2025-2026国创发布会PV', author: '测试作者', viewCount: '9.8千', duration: '01:10', poster: 'https://picsum.photos/320/180?random=5' },
])

// 初始化HLS播放器（优化版）
const initHLSPlayer = async (videoUrl: string, retryCount = 0) => {
  const maxRetries = 5
  const retryDelay = 100

  if (!videoPlayer.value) {
    console.error(`Video player element not found (attempt ${retryCount + 1}/${maxRetries})`)
    if (retryCount < maxRetries) {
      console.log(`Retrying in ${retryDelay}ms...`)
      await new Promise(resolve => setTimeout(resolve, retryDelay))
      return initHLSPlayer(videoUrl, retryCount + 1)
    }
    console.error('Max retries reached, giving up')
    videoLoadError.value = true
    errorMessage.value = '视频播放器初始化失败，请刷新页面重试'
    return
  }

  // 清理旧的HLS实例
  if (hlsInstance.value) {
    hlsInstance.value.destroy()
    hlsInstance.value = null
  }

  // 强制使用HLS播放器
  console.log('Initializing HLS player for URL:', videoUrl)

  // 创建优化的HLS配置
  const hlsConfig: Hls.Config = {
    // 启用Worker提升性能
    enableWorker: true,
    workerPath: 'https://cdn.jsdelivr.net/npm/hls.js@latest/dist/hls.worker.js',
    
    // 低延迟模式配置
    lowLatencyMode: true,
    backBufferLength: 90, // 后缓冲区长度（秒）
    maxBufferLength: 30, // 最大缓冲区长度（秒）
    maxMaxBufferLength: 60, // 最大缓冲区长度限制（秒）
    
    // 加载超时配置
    manifestLoadingTimeOut: 10000, // 播放列表加载超时（毫秒）
    manifestLoadingMaxRetry: 3, // 播放列表最大重试次数
    levelLoadingTimeOut: 10000, // 质量级别加载超时
    levelLoadingMaxRetry: 3, // 质量级别最大重试次数
    fragLoadingTimeOut: 20000, // 分片加载超时
    fragLoadingMaxRetry: 6, // 分片最大重试次数
    
    // 自适应比特率配置
    abrEwmaFastLive: 3.0, // 快速移动平均窗口
    abrEwmaSlowLive: 9.0, // 慢速移动平均窗口
    abrEwmaFastVoD: 3.0, // VOD快速移动平均窗口
    abrEwmaSlowVoD: 9.0, // VOD慢速移动平均窗口
    abrEwmaDefaultEstimate: 500000, // 默认带宽估算（bps）
    abrBandWidthFactor: 0.95, // 带宽安全系数
    abrBandWidthUpFactor: 0.7, // 带宽上升因子
    abrMaxWithRealBitrate: false, // 不使用实际比特率限制
    
    // 缓冲区配置
    maxBufferHole: 0.5, // 最大缓冲区空洞（秒）
    maxFragLookUpTolerance: 0.25, // 分片查找容差
    
    // 其他优化
    maxAudioBufferSize: 60, // 最大音频缓冲区大小
    
    // 调试日志
    debug: false,
  }

  // 创建HLS实例
  const hls = new Hls(hlsConfig)

  // 加载视频源
  hls.loadSource(videoUrl)
  hls.attachMedia(videoPlayer.value)

  // 错误处理
  hls.on(Hls.Events.ERROR, (event, data) => {
    console.error('HLS error:', event, data)
    handleHLSError(hls, data)
  })

  // 监听HLS事件
  hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
    console.log('HLS manifest parsed, levels available:', hls.levels.length)
    // 自动选择最佳质量
    if (autoQuality.value) {
      hls.currentLevel = -1 // -1表示自动选择
    } else {
      // 如果手动选择质量，尝试匹配用户选择
      setInitialQuality(hls)
    }
  })

  // 质量切换事件
  hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
    const level = hls.levels[data.level]
    if (level) {
      console.log('HLS level switched:', level.height, 'p', 'Bitrate:', level.bitrate)
      videoQuality.value = `${level.height}p`
      currentBandwidth.value = level.bitrate
    }
  })

  // 分片加载完成事件
  hls.on(Hls.Events.FRAG_LOADED, (event, data) => {
    console.log('Fragment loaded:', data.frag.url)
    updateBufferHealth()
  })

  // 缓冲区追加事件
  hls.on(Hls.Events.BUFFER_APPENDED, (event, data) => {
    updateBufferHealth()
  })

  // 带宽估算更新
  hls.on(Hls.Events.FRAG_LOADING, (event: any, data: any) => {
    if (data && data.frag && data.frag.bitrate) {
      currentBandwidth.value = data.frag.bitrate
      updateNetworkQuality(data.frag.bitrate)
      console.log('Fragment bitrate:', Math.round(data.frag.bitrate / 1000), 'kbps')
    }
  })

  hlsInstance.value = hls
}

// 清理HLS实例
const cleanupHLS = () => {
  if (hlsInstance.value) {
    console.log('Cleaning up HLS instance')
    hlsInstance.value.destroy()
    hlsInstance.value = null
  }
}

// 处理HLS错误
const handleHLSError = (hls: Hls, data: any) => {
  if (data.fatal) {
    switch (data.type) {
      case Hls.ErrorTypes.NETWORK_ERROR:
        console.error('Network error, trying to recover...')
        if (data.details === Hls.ErrorDetails.MANIFEST_LOAD_ERROR) {
          // 播放列表加载失败，尝试降级到原始视频
          if (fallbackVideoUrl.value && fallbackVideoUrl.value.trim() !== '') {
            console.log('HLS manifest load failed, falling back to original video')
            hls.destroy()
            hlsInstance.value = null
            // 直接使用原生video元素播放原始视频
            if (videoPlayer.value) {
              videoPlayer.value.src = fallbackVideoUrl.value
              videoPlayer.value.load()
              console.log('Loaded fallback video URL:', fallbackVideoUrl.value)
            }
            return
          }
          // 没有降级URL，尝试重试
          setTimeout(() => {
            hls.startLoad()
          }, 1000)
        } else if (data.details === Hls.ErrorDetails.FRAG_LOAD_ERROR) {
          // 分片加载失败，尝试重新加载
          setTimeout(() => {
            hls.recoverMediaError()
          }, 1000)
        } else {
          // 其他网络错误，尝试降级
          if (fallbackVideoUrl.value && fallbackVideoUrl.value.trim() !== '') {
            console.log('HLS network error, falling back to original video')
            hls.destroy()
            hlsInstance.value = null
            if (videoPlayer.value) {
              videoPlayer.value.src = fallbackVideoUrl.value
              videoPlayer.value.load()
              console.log('Loaded fallback video URL:', fallbackVideoUrl.value)
            }
            return
          }
          hls.startLoad()
        }
        break
        
      case Hls.ErrorTypes.MEDIA_ERROR:
        console.error('Media error, trying to recover...')
        if (data.details === Hls.ErrorDetails.BUFFER_APPEND_ERROR) {
          // 缓冲区追加错误，尝试恢复
          hls.recoverMediaError()
        } else {
          // 其他媒体错误，尝试降级
          if (fallbackVideoUrl.value && fallbackVideoUrl.value.trim() !== '') {
            console.log('HLS media error, falling back to original video')
            hls.destroy()
            hlsInstance.value = null
            if (videoPlayer.value) {
              videoPlayer.value.src = fallbackVideoUrl.value
              videoPlayer.value.load()
              console.log('Loaded fallback video URL:', fallbackVideoUrl.value)
            }
            return
          }
          setTimeout(() => {
            hls.recoverMediaError()
          }, 1000)
        }
        break
        
      default:
        console.error('Fatal error, cannot recover:', data)
        // 尝试降级到原始视频
        if (fallbackVideoUrl.value && fallbackVideoUrl.value.trim() !== '') {
          console.log('Fatal HLS error, falling back to original video')
          hls.destroy()
          hlsInstance.value = null
          if (videoPlayer.value) {
            videoPlayer.value.src = fallbackVideoUrl.value
            videoPlayer.value.load()
            console.log('Loaded fallback video URL:', fallbackVideoUrl.value)
          }
        } else {
          hls.destroy()
          videoLoadError.value = true
          errorMessage.value = '视频播放失败，请稍后重试'
        }
        break
    }
  } else {
    // 非致命错误，记录日志
    console.warn('Non-fatal HLS error:', data)
  }
}

// 处理原生视频错误
const handleNativeVideoError = () => {
  console.error('Native video error occurred')
  videoLoadError.value = true
  errorMessage.value = '视频加载失败，请检查网络连接'
  
  // 尝试使用HLS降级方案
  if (video.value && video.value.src && !video.value.src.includes('.m3u8')) {
    console.log('Attempting to fallback to HLS stream')
    // 这里可以尝试获取HLS播放列表
  }
}

// 更新网络质量
const updateNetworkQuality = (bandwidth: number) => {
  // 带宽单位是bps
  const kbps = bandwidth / 1000
  
  if (kbps > 3000) {
    networkQuality.value = 'good'
  } else if (kbps > 1000) {
    networkQuality.value = 'fair'
  } else {
    networkQuality.value = 'poor'
  }
}

// 更新缓冲区健康度
const updateBufferHealth = () => {
  if (!videoPlayer.value || !hlsInstance.value) return
  
  try {
    const bufferedRanges = videoPlayer.value.buffered
    if (bufferedRanges.length > 0) {
      const currentTime = videoPlayer.value.currentTime
      const bufferedEnd = bufferedRanges.end(bufferedRanges.length - 1)
      const bufferedDuration = bufferedEnd - currentTime
      
      // 计算缓冲区健康度（0-100）
      const targetBuffer = 30 // 目标缓冲30秒
      bufferHealth.value = Math.min(100, (bufferedDuration / targetBuffer) * 100)
      
      console.log('Buffer health:', bufferHealth.value.toFixed(1), '%, buffered:', bufferedDuration.toFixed(1), 's')
    }
  } catch (error) {
    console.error('Error updating buffer health:', error)
  }
}

// 设置初始质量
const setInitialQuality = (hls: Hls) => {
  if (!hls.levels || hls.levels.length === 0) return
  
  const targetHeight = parseInt(videoQuality.value.replace('p', ''))
  
  // 查找匹配的质量级别
  for (let i = 0; i < hls.levels.length; i++) {
    const level = hls.levels[i]
    if (level.height === targetHeight) {
      hls.currentLevel = i
      console.log('Set initial quality:', level.height, 'p')
      return
    }
  }
  
  // 如果没有精确匹配，选择最接近的
  let closestLevel = 0
  let minDiff = Infinity
  
  for (let i = 0; i < hls.levels.length; i++) {
    const diff = Math.abs(hls.levels[i].height - targetHeight)
    if (diff < minDiff) {
      minDiff = diff
      closestLevel = i
    }
  }
  
  hls.currentLevel = closestLevel
  console.log('Set closest quality:', hls.levels[closestLevel].height, 'p')
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

// 格式化视频时长（秒转换为 HH:MM:SS 或 MM:SS）
const formatDuration = (seconds: number) => {
  if (!seconds || isNaN(seconds)) {
    return '00:00'
  }
  
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 切换关注状态
const toggleFollow = async () => {
  if (!video.value || !videoAuthor.value.id) return
  
  try {
    if (video.value.isFollowed) {
      // 取消关注
      await videoAPI.unfollowUser(videoAuthor.value.id)
    } else {
      // 关注
      await videoAPI.followUser(videoAuthor.value.id)
    }
    
    // 更新本地状态
  video.value.isFollowed = !video.value.isFollowed

  // 更新关注数
  if (video.value.isFollowed) {
    // 增加关注数
    const currentFollowers = typeof videoAuthor.value.followerCount === 'string'
      ? parseInt(videoAuthor.value.followerCount)
      : videoAuthor.value.followerCount
    videoAuthor.value.followerCount = currentFollowers + 1
    
    const currentVideoFollowers = typeof video.value.authorStats.followerCount === 'string'
      ? parseInt(video.value.authorStats.followerCount)
      : video.value.authorStats.followerCount
    video.value.authorStats.followerCount = currentVideoFollowers + 1
  } else {
    // 减少关注数
    const currentFollowers = typeof videoAuthor.value.followerCount === 'string'
      ? parseInt(videoAuthor.value.followerCount)
      : videoAuthor.value.followerCount
    videoAuthor.value.followerCount = currentFollowers - 1
    
    const currentVideoFollowers = typeof video.value.authorStats.followerCount === 'string'
      ? parseInt(video.value.authorStats.followerCount)
      : video.value.authorStats.followerCount
    video.value.authorStats.followerCount = currentVideoFollowers - 1
  }
  } catch (error) {
    console.error('关注操作失败:', error)
  }
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

// 设置视频质量（优化版）
const setVideoQuality = (quality: string) => {
  console.log('设置视频质量:', quality)
  
  // 如果选择"自动"，启用自适应
  if (quality === 'auto') {
    autoQuality.value = true
    if (hlsInstance.value) {
      hlsInstance.value.currentLevel = -1 // -1表示自动选择
      console.log('启用自动质量选择')
    }
    return
  }
  
  // 手动选择质量
  autoQuality.value = false
  videoQuality.value = quality

  // 如果使用HLS播放器,切换HLS质量级别
  if (hlsInstance.value) {
    const levels = hlsInstance.value.levels
    if (!levels || levels.length === 0) {
      console.warn('No HLS levels available')
      return
    }

    // 根据质量名称查找对应的HLS级别
    let targetLevel = -1
    const qualityHeight = parseInt(quality.replace('p', ''))

    for (let i = 0; i < levels.length; i++) {
      const level = levels[i]
      const levelHeight = level.height

      if (levelHeight === qualityHeight) {
        targetLevel = i
        console.log(`Found matching level: ${i}, height: ${levelHeight}p, bitrate: ${level.bitrate}`)
        break
      }
    }

    if (targetLevel !== -1) {
      // 平滑切换到指定质量
      smoothQualitySwitch(targetLevel)
    } else {
      console.warn(`Quality ${quality} not found in HLS levels, using auto`)
      autoQuality.value = true
      hlsInstance.value.currentLevel = -1
    }
  } else {
    // 如果视频有多个质量选项，切换到对应的质量
    if (video.value && video.value.quality_options && video.value.quality_options.length > 0) {
      const qualityOption = video.value.quality_options.find((opt: any) =>
        opt.quality === quality || opt.label === quality
      )

      if (qualityOption && qualityOption.url) {
        const currentTime = videoPlayer.value?.currentTime || 0
        const wasPlaying = !videoPlayer.value?.paused

        // 更新视频源
        video.value.src = cleanVideoUrl(qualityOption.url)

        // 重新加载视频
        if (videoPlayer.value) {
          videoPlayer.value.load()

          // 恢复播放位置
          videoPlayer.value.currentTime = currentTime

          // 如果之前在播放，恢复播放
          if (wasPlaying) {
            videoPlayer.value.play().catch(err => {
              console.error('切换画质后播放失败:', err)
            })
          }
        }

        console.log('已切换到画质:', quality)
      }
    }
  }
}

// 平滑质量切换
const smoothQualitySwitch = (targetLevel: number) => {
  if (!hlsInstance.value || !videoPlayer.value) return
  
  const hls = hlsInstance.value
  const currentLevel = hls.currentLevel
  
  // 如果已经是目标质量，不需要切换
  if (currentLevel === targetLevel) {
    console.log('Already at target quality level')
    return
  }
  
  // 保存当前播放状态
  const currentTime = videoPlayer.value.currentTime
  const wasPlaying = !videoPlayer.value.paused
  
  console.log(`Switching from level ${currentLevel} to ${targetLevel}`)
  
  // 切换质量级别
  hls.currentLevel = targetLevel
  
  // 等待质量切换完成
  const checkSwitchComplete = setInterval(() => {
    if (hls.currentLevel === targetLevel) {
      clearInterval(checkSwitchComplete)
      
      // 恢复播放位置
      if (videoPlayer.value) {
        videoPlayer.value.currentTime = currentTime
        
        // 如果之前在播放，恢复播放
        if (wasPlaying) {
          videoPlayer.value.play().catch(err => {
            console.error('Failed to resume playback after quality switch:', err)
          })
        }
      }
      
      console.log('Quality switch completed successfully')
    }
  }, 100)
  
  // 超时保护
  setTimeout(() => {
    clearInterval(checkSwitchComplete)
    console.warn('Quality switch timeout')
  }, 5000)
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
  
  // 跳转时，根据新的视频时间更新弹幕
  if (danmakuEnabled.value) {
    updateDanmakusOnSeek(newTime)
  }
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
  
  // 跳转时，根据新的视频时间更新弹幕
  if (danmakuEnabled.value) {
    updateDanmakusOnSeek(targetTime)
  }
  
  // 移除全局事件监听器
  document.removeEventListener('mousemove', handleSeeking)
  document.removeEventListener('mouseup', stopSeeking)
  document.removeEventListener('touchmove', handleSeeking)
  document.removeEventListener('touchend', stopSeeking)
}

// 切换全屏
const toggleFullscreen = () => {
  const container = document.getElementById('video-container')
  if (!container) return

  if (!document.fullscreenElement) {
    container.requestFullscreen().catch(err => {
      console.error(`全屏错误: ${err.message}`)
    })
  } else {
    document.exitFullscreen()
  }
}

// 进度条跳转时更新弹幕
const updateDanmakusOnSeek = (newTime: number) => {
  // 清空当前显示的弹幕
  danmakus.value = []
  
  // 重置弹幕池中的visible状态
  danmakuPool.value.forEach(danmaku => {
    danmaku.visible = false
    danmaku.translateX = 0
  })
  
  // 根据新的视频时间，添加应该显示的弹幕
  const containerWidth = danmakuContainer.value?.offsetWidth || 0
  
  // 找到所有时间戳 <= 新视频时间的弹幕
  const visibleDanmakus = danmakuPool.value.filter(danmaku => danmaku.timestamp <= newTime)
  
  // 更新这些弹幕的状态和位置
  visibleDanmakus.forEach(danmaku => {
    danmaku.visible = true
    
    // 计算弹幕应该移动的距离
    const elapsedTimeSec = newTime - danmaku.timestamp
    const distancePerSecond = containerWidth / danmaku.speed
    const totalDistance = distancePerSecond * elapsedTimeSec
    
    danmaku.translateX = -totalDistance
    
    // 只有当弹幕还在屏幕内时，才添加到显示列表
    if (totalDistance <= containerWidth + 200) {
      danmakus.value.push(danmaku)
    }
  })
}

// 切换弹幕显示
const toggleDanmaku = () => {
  danmakuEnabled.value = !danmakuEnabled.value
  if (!danmakuEnabled.value) {
    // 关闭弹幕时清空
    danmakus.value = []
    if (danmakuInterval) {
      clearInterval(danmakuInterval)
      danmakuInterval = null
    }
  } else if (isPlaying.value) {
    // 重新开启弹幕时重新生成
    simulateDanmakus()
  }
  
  if (danmakuContainer.value) {
    danmakuContainer.value.style.pointerEvents = danmakuEnabled.value ? 'none' : 'auto'
  }
}

// 发送弹幕
const sendDanmaku = async () => {
  if (!newDanmakuText.value.trim() || !danmakuEnabled.value) return

  // 检查用户是否已登录
  if (!userStore.isAuthenticated) {
    // 未登录，触发登录弹窗
    window.dispatchEvent(new CustomEvent('show-login-modal'))
    return
  }

  // 用户发送的弹幕，时间戳为当前视频时间
  const currentVideoTime = videoPlayer.value?.currentTime || 0

  try {
    // 调用API发送弹幕
    const response = await danmakuAPI.sendDanmaku({
      video_id: videoId,
      text: newDanmakuText.value,
      color: danmakuColor.value,
      video_timestamp: currentVideoTime,
      speed: danmakuSpeed.value
    })

    if (response.success) {
      // 使用轨道系统避免重叠
      const danmakuTracks = [10, 20, 30, 40, 50, 60, 70, 80] // 8个轨道
      let currentTrackIndex = 0
      const track = danmakuTracks[currentTrackIndex]
      currentTrackIndex = (currentTrackIndex + 1) % danmakuTracks.length

      // 创建本地弹幕对象
      const newDanmaku = {
        text: response.danmaku.text,
        color: response.danmaku.color,
        top: track,
        speed: response.danmaku.speed === 'normal' ? 10 : response.danmaku.speed === 'fast' ? 8 : 12,
        timestamp: response.danmaku.video_timestamp,
        visible: true,
        translateX: 0
      }

      // 添加到当前显示的弹幕列表
      danmakus.value.push(newDanmaku)
      // 也添加到弹幕池，以便进度条跳转时能找到
      danmakuPool.value.push(newDanmaku)

      // 清空输入框
      newDanmakuText.value = ''
    } else {
      console.error('发送弹幕失败:', response.message)
    }
  } catch (error) {
    console.error('发送弹幕出错:', error)
  }
}

// 模拟弹幕
const generateDanmakuPool = () => {
  const sampleTexts = [
    '这个视频太棒了！', '前方高能！', '666', '主播加油！', '哈哈哈哈',
    '这个操作太秀了', '学习了', '打卡', '支持一下', '路过留名',
    '太厉害了', '收藏了', '已投币', '一键三连', '质量很高',
    '制作精良', '内容很棒', '继续加油', '期待更新', '支持UP主'
  ]

  // 清空现有弹幕池
  danmakuPool.value = []

  // 预生成30条弹幕，分布在视频整个时长内
  const videoDuration = duration.value || 30 // 默认30秒
  
  for (let i = 0; i < 30; i++) {
    const danmakuTracks = [10, 20, 30, 40, 50, 60, 70, 80] // 8个轨道
    const track = danmakuTracks[i % danmakuTracks.length]
    // 随机时间戳，分布在视频整个时长内
    const timestamp = Math.random() * videoDuration
    
    danmakuPool.value.push({
      text: sampleTexts[Math.floor(Math.random() * sampleTexts.length)],
      color: ['#FFFFFF', '#FB7299', '#00A1D6', '#FFD700', '#FF6B6B', '#4ECDC4'][Math.floor(Math.random() * 6)],
      top: track,
      speed: 8 + Math.random() * 4, // 8-12秒随机速度
      timestamp: timestamp,
      visible: false,
      translateX: 0
    })
  }
  
  // 按时间戳排序
  danmakuPool.value.sort((a, b) => a.timestamp - b.timestamp)
}

// 模拟弹幕 - 现在改为根据视频时间从弹幕池获取
const simulateDanmakus = () => {
  // 预生成弹幕池
  generateDanmakuPool()

  // 持续生成弹幕 - 改为根据视频时间动态添加
  const danmakuDensityMap = {
    low: 3000,
    normal: 1500,
    high: 800
  }
  
  const interval = danmakuDensityMap[danmakuDensity.value as keyof typeof danmakuDensityMap]
  
  if (danmakuInterval) {
    clearInterval(danmakuInterval)
  }
  
  danmakuInterval = setInterval(() => {
    if (isPlaying.value && danmakus.value.length < 30) {
      // 根据视频时间从弹幕池添加新弹幕
      addDanmakusByTime()
    }
  }, interval)
}

// 根据视频时间从弹幕池添加新弹幕
const addDanmakusByTime = () => {
  if (!videoPlayer.value) return
  
  const currentVideoTime = videoPlayer.value.currentTime
  
  // 从弹幕池找到符合条件的弹幕：
  // 1. 时间戳 <= 当前视频时间
  // 2. 尚未显示
  // 3. 数量不超过30
  const newDanmakus = danmakuPool.value.filter(danmaku => {
    return danmaku.timestamp <= currentVideoTime && !danmaku.visible && danmakus.value.length < 30
  })
  
  // 添加到当前显示的弹幕列表
  newDanmakus.forEach(danmaku => {
    danmaku.visible = true
    danmakus.value.push(danmaku)
  })
}

let danmakuInterval: number | null = null

// 鼠标移动事件，显示控制栏
const onMouseMove = () => {
  showControls.value = true
  
  // 清除之前的定时器
  if (controlsTimeout) {
    clearTimeout(controlsTimeout)
  }
  
  // 0.5秒后自动隐藏控制栏
  controlsTimeout = window.setTimeout(() => {
    if (isPlaying.value) {
      showControls.value = false
    }
  }, 500)
}

// 鼠标离开事件，隐藏控制栏
const onMouseLeave = () => {
  if (isPlaying.value) {
    showControls.value = false
  }
}

// 跳转到用户主页
const goToUserHome = () => {
  console.log('跳转到用户主页')
  // 实际应用中应该使用router.push或window.location.href
}

// 点赞功能
const toggleLike = () => {
  isLiked.value = !isLiked.value
  if (isLiked.value) {
    videoStats.value.likeCount = (parseInt(videoStats.value.likeCount) + 1).toString()
  } else {
    videoStats.value.likeCount = (parseInt(videoStats.value.likeCount) - 1).toString()
  }
}

// 投币功能
const toggleCoin = () => {
  isCoined.value = !isCoined.value
  if (isCoined.value) {
    videoStats.value.coinCount = (parseInt(videoStats.value.coinCount) + 1).toString()
  } else {
    videoStats.value.coinCount = (parseInt(videoStats.value.coinCount) - 1).toString()
  }
}

// 收藏功能
const toggleFavorite = () => {
  isFavorited.value = !isFavorited.value
  if (isFavorited.value) {
    videoStats.value.favoriteCount = (parseInt(videoStats.value.favoriteCount) + 1).toString()
  } else {
    videoStats.value.favoriteCount = (parseInt(videoStats.value.favoriteCount) - 1).toString()
  }
}

// 分享功能
const shareVideo = () => {
  videoStats.value.shareCount = (parseInt(videoStats.value.shareCount) + 1).toString()
  // 实际应用中应该调用分享API
  console.log('分享视频')
}

// 切换播放状态
const togglePlay = async () => {
  if (!videoPlayer.value) return
  
  if (videoPlayer.value.paused) {
    // 使用播放锁防止 rapid play/pause
    if (isPlayLocked.value) {
      console.log('播放操作被锁定，忽略')
      return
    }
    isPlayLocked.value = true
    
    try {
      await videoPlayer.value.play()
      isPlaying.value = true
      if (danmakuEnabled.value && danmakuPool.value.length === 0) {
        simulateDanmakus()
      }
    } catch (err) {
      console.error('播放失败:', err)
      isPlaying.value = false
    } finally {
      // 100ms 后解锁，防止 AbortError
      setTimeout(() => {
        isPlayLocked.value = false
      }, 100)
    }
  } else {
    videoPlayer.value.pause()
    isPlaying.value = false
    
    if (danmakuInterval) {
      clearInterval(danmakuInterval)
      danmakuInterval = null
    }
  }
}

const fetchVideoData = async () => {
  loading.value = true
  videoError.value = false
  currentVideoSourceIndex.value = 0 // 重置视频源索引
  
  try {
    // 调用真实的视频详情API
    console.log(`获取视频ID: ${videoId}的数据`)
    
    const response = await videoAPI.getVideoDetail(videoId)
    
    // 检查是否有降级响应
    if (response.data && 'fallback_url' in response.data) {
      console.log('API返回降级URL:', (response.data as any).fallback_url)
      // 使用降级URL作为视频源
      const cleanedFallbackUrl = cleanVideoUrl((response.data as any).fallback_url)
      console.log('使用降级视频URL:', cleanedFallbackUrl)
      
      // 创建简化的视频数据
      video.value = {
        id: videoId,
        title: '视频加载中...',
        src: cleanedFallbackUrl,
        poster: getDefaultCoverUrl(videoId),
        note: response.data.message || '正在使用备用视频源播放',
        viewCount: '0',
        likeCount: '0',
        duration: '00:00',
        author: '系统',
        authorAvatar: '',
        authorStats: { followerCount: 0 },
        tags: [],
        category: '',
        isFollowed: false
      }
      
      // 加载基础视频信息
      try {
        const basicInfoResponse = await videoAPI.getVideoDetail(videoId)
        if (basicInfoResponse.data && basicInfoResponse.data.data && (basicInfoResponse.data.data as any).video) {
          const basicVideo = (basicInfoResponse.data.data as any).video
          video.value.title = basicVideo.title || '未知标题'
          video.value.poster = isValidCoverUrl(basicVideo.cover_url) ? basicVideo.cover_url : getDefaultCoverUrl(videoId)
          video.value.note = basicVideo.description || video.value.note
          video.value.author = basicVideo.author?.username || '未知作者'
          video.value.authorAvatar = basicVideo.author?.avatar || ''
        }
      } catch (infoError) {
        console.warn('获取基础视频信息失败:', infoError)
      }
      
      return
    }
    
    const videoData = response.data.data.video
    
    // 生成HLS播放URL - 优先使用API Gateway代理
    let finalVideoUrl = ''
    const playlistUrl = videoData.playlist_url
    const originalVideoUrl = videoData.video_url
    
    console.log('HLS播放列表URL:', playlistUrl)
    console.log('原始视频URL:', originalVideoUrl)
    
    // 如果有HLS播放列表URL，使用API Gateway代理
    if (playlistUrl && playlistUrl.trim() !== '') {
      // 从playlist_url中提取视频ID
      const videoIdMatch = playlistUrl.match(/(\d+)\/hls\//)
      if (videoIdMatch) {
        const extractedVideoId = videoIdMatch[1]
        finalVideoUrl = `http://localhost:8080/api/video/${extractedVideoId}/stream/index.m3u8`
        console.log('使用HLS代理URL:', finalVideoUrl)
      } else {
        // 如果无法提取视频ID，尝试直接使用playlist_url
        finalVideoUrl = cleanVideoUrl(playlistUrl)
        console.log('使用清理后的HLS URL:', finalVideoUrl)
      }
    } else {
      // 没有HLS播放列表，尝试使用API Gateway代理生成HLS URL
      finalVideoUrl = `http://localhost:8080/api/video/${videoId}/stream/index.m3u8`
      console.log('生成HLS代理URL:', finalVideoUrl)
      
      // 保存原始视频URL作为降级选项
      if (originalVideoUrl && originalVideoUrl.trim() !== '') {
        fallbackVideoUrl.value = cleanVideoUrl(originalVideoUrl)
        console.log('设置降级URL:', fallbackVideoUrl.value)
      }
    }
    
    console.log('最终使用的视频URL:', finalVideoUrl)
    
    const cleanedVideoUrl = cleanVideoUrl(finalVideoUrl)
    console.log('修复后的视频URL:', cleanedVideoUrl)
    
    // 清理所有质量选项的URL
    if (videoData.quality_options && videoData.quality_options.length > 0) {
      videoData.quality_options.forEach((option: any, index: number) => {
        if (option.url) {
          videoData.quality_options[index].url = cleanVideoUrl(option.url)
        }
      })
    }
    
    video.value = {
      id: videoData.video_id,
      title: videoData.title,
      src: cleanedVideoUrl,
      poster: isValidCoverUrl(videoData.cover_url) ? videoData.cover_url : getDefaultCoverUrl(videoId),
      note: videoData.description,
      viewCount: videoData.view_count.toString(),
      likeCount: videoData.like_count.toString(),
      duration: formatDuration(videoData.duration),
      author: videoData.author?.username || '未知作者',
      authorAvatar: videoData.author?.avatar || '',
      authorStats: {
        followerCount: videoData.author?.follower_count || 0
      },
      tags: videoData.tags || [],
      category: videoData.category || '',
      isFollowed: videoData.is_followed || false
    }

    // 使用nextTick确保video元素已渲染,然后初始化HLS播放器
    await nextTick()
    initHLSPlayer(cleanedVideoUrl)
    
    // 更新视频作者信息
    videoAuthor.value = {
      id: videoData.author?.user_id || '1',
      name: videoData.author?.username || '未知作者',
      avatar: videoData.author?.avatar || '',
      followerCount: videoData.author?.follower_count || 0
    }

    // 加载弹幕数据
    try {
      const response = await danmakuAPI.getDanmakus(videoId)
      if (response.danmakus) {
        // 清空现有的弹幕池
        danmakuPool.value = []
        
        // 初始化弹幕池
        const danmakuTracks = [10, 20, 30, 40, 50, 60, 70, 80] // 8个轨道
        let currentTrackIndex = 0

        response.danmakus.forEach(danmaku => {
          const track = danmakuTracks[currentTrackIndex]
          currentTrackIndex = (currentTrackIndex + 1) % danmakuTracks.length

          danmakuPool.value.push({
            text: danmaku.text,
            color: danmaku.color,
            top: track,
            speed: danmaku.speed === 'normal' ? 10 : danmaku.speed === 'fast' ? 8 : 12,
            timestamp: danmaku.video_timestamp,
            visible: false,
            translateX: 0
          })
        })

        // 按时间戳排序
        danmakuPool.value.sort((a, b) => a.timestamp - b.timestamp)
      }
    } catch (error) {
      console.error('加载弹幕失败:', error)
      // 弹幕加载失败不影响视频播放，继续执行
    }
  } catch (error: any) {
    videoError.value = true
    errorMessage.value = error.message || '视频加载失败，请稍后重试'
    console.error('视频加载错误:', error)
    
    // 检查是否有降级选项
    if (error.response?.data?.fallback_url) {
      console.log('检测到降级URL:', error.response.data.fallback_url)
      // 可以尝试使用降级URL
      errorMessage.value = error.response.data.message || '正在使用备用视频源...'
    }
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

// 处理视频加载错误
const handleVideoError = (event: Event) => {
  console.log('视频元素错误:', event)
  videoLoadError.value = true
  
  // 尝试切换到备用视频源
  if (currentVideoSourceIndex.value < 2) { // 最多尝试3个源
    currentVideoSourceIndex.value++
    console.log(`尝试切换到备用视频源 ${currentVideoSourceIndex.value}`)
    
    // 延迟重试，给浏览器时间处理错误
    setTimeout(() => {
      if (videoPlayer.value) {
        // 尝试重新加载视频
        videoPlayer.value.load()
        // 尝试静音播放以避免浏览器阻止自动播放
        videoPlayer.value.muted = true
        isMuted.value = true
        videoPlayer.value.play().catch(err => {
          console.error('自动播放失败:', err)
          // 如果静音播放也失败，尝试普通播放
          if (videoPlayer.value) {
            videoPlayer.value.muted = false
            isMuted.value = false
          }
        })
      }
    }, 1000)
  } else {
    errorMessage.value = '视频加载失败，请稍后重试'
  }
}

// 重试加载视频
const retryLoadVideo = () => {
  videoLoadError.value = false
  errorMessage.value = ''
  
  if (videoPlayer.value) {
    // 重置视频源索引
    currentVideoSourceIndex.value = 0
    
    // 重新加载视频
    videoPlayer.value.load()
    
    // 尝试播放
    videoPlayer.value.play().catch(err => {
      console.error('重试播放失败:', err)
      videoLoadError.value = true
      errorMessage.value = '视频加载失败，请检查网络连接'
    })
  }
}

// 尝试下一个视频源
const tryNextVideoSource = () => {
  if (video.value && video.value.quality_options && currentVideoSourceIndex.value < video.value.quality_options.length - 1) {
    currentVideoSourceIndex.value++
    const nextSource = video.value.quality_options[currentVideoSourceIndex.value]
    
    if (nextSource && nextSource.url) {
      console.log(`切换到视频源 ${currentVideoSourceIndex.value}:`, nextSource.quality)
      
      // 更新视频源
      const cleanedUrl = cleanVideoUrl(nextSource.url)
      video.value.src = cleanedUrl
      
      // 重置错误状态
      videoLoadError.value = false
      errorMessage.value = ''
      
      // 重新加载视频
      if (videoPlayer.value) {
        videoPlayer.value.load()
        videoPlayer.value.play().catch(err => {
          console.error('切换视频源后播放失败:', err)
        })
      }
    }
  } else {
    console.log('没有更多可用的视频源')
    errorMessage.value = '所有视频源都不可用，请稍后重试'
  }
}

// 视频加载状态处理
const onVideoLoadStart = () => {
  console.log('视频开始加载')
}

const onVideoLoaded = () => {
  console.log('视频数据加载完成')
  videoLoadError.value = false
  videoReady.value = true // 标记视频已就绪
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
  // 开始更新弹幕位置
  if (danmakuEnabled.value && danmakuPool.value.length === 0) {
    // 只有当弹幕池为空时，才重新生成弹幕
    simulateDanmakus()
  }
}

// 视频暂停事件
const onVideoPause = () => {
  console.log('视频暂停')
  isPlaying.value = false
  
  // 暂停时停止生成新弹幕
  if (danmakuInterval) {
    clearInterval(danmakuInterval)
    danmakuInterval = null
  }
}

// 视频结束事件
const onVideoEnded = () => {
  console.log('视频播放结束')
  isPlaying.value = false
  currentTime.value = 0
  progress.value = 0
  
  // 视频结束时重置弹幕状态
  danmakus.value = []
  // 重置弹幕池中的visible状态
  danmakuPool.value.forEach(danmaku => {
    danmaku.visible = false
    danmaku.translateX = 0
  })
  
  if (danmakuInterval) {
    clearInterval(danmakuInterval)
    danmakuInterval = null
  }
}

// 监听视频时间更新事件
const onTimeUpdate = () => {
  if (videoPlayer.value && !isSeeking.value) {
    currentTime.value = videoPlayer.value.currentTime
    progress.value = (videoPlayer.value.currentTime / duration.value) * 100
    
    // 更新弹幕位置
    updateDanmakusPosition()
  }
}

// 更新弹幕位置
const updateDanmakusPosition = () => {
  if (!danmakuEnabled.value || !videoPlayer.value || !isPlaying.value) return
  
  const containerWidth = danmakuContainer.value?.offsetWidth || 0
  const currentVideoTime = videoPlayer.value.currentTime
  
  // 首先根据当前视频时间添加应该出现的弹幕
  addDanmakusByTime()
  
  // 遍历所有弹幕，更新位置
  danmakus.value.forEach((danmaku, index) => {
    // 只有当视频时间 >= 弹幕时间戳时，弹幕才会移动
    if (currentVideoTime >= danmaku.timestamp) {
      // 计算弹幕已经移动的时间（秒）= 视频当前时间 - 弹幕时间戳
      const elapsedTimeSec = currentVideoTime - danmaku.timestamp
      
      // 计算弹幕应该移动的距离（像素）
      // 速度单位为秒，所以每秒移动 containerWidth / speed 像素
      const distancePerSecond = containerWidth / danmaku.speed
      const totalDistance = distancePerSecond * elapsedTimeSec
      
      // 更新弹幕的translateX属性
      danmaku.translateX = -totalDistance
      
      // 检查弹幕是否超出屏幕左侧，超出则移除
      if (totalDistance > containerWidth + 200) { // 200为缓冲值，确保完全移出屏幕
        danmakus.value.splice(index, 1)
        // 重置visible状态，以便下次进度条跳转到该位置时能重新显示
        const poolIndex = danmakuPool.value.findIndex(poolDanmaku => poolDanmaku === danmaku)
        if (poolIndex !== -1) {
          danmakuPool.value[poolIndex].visible = false
        }
      }
    }
  })
}

// 进度条拖动状态
const isSeeking = ref(false)

// 处理登录事件
const handleLogin = () => {
  // 派发事件给父组件或全局监听
  window.dispatchEvent(new CustomEvent('show-login-modal'))
}

// 生命周期
onMounted(() => {
  fetchVideoData()
  simulateDanmakus()
  window.addEventListener('keydown', handleKeydown)
  
  // 开始定时更新弹幕位置
  const danmakuUpdateInterval = setInterval(updateDanmakusPosition, 16) // 约60fps
  
  onUnmounted(() => {
    clearInterval(danmakuUpdateInterval)
    window.removeEventListener('keydown', handleKeydown)
    if (danmakuInterval) {
      clearInterval(danmakuInterval)
    }
    if (controlsTimeout) {
      clearTimeout(controlsTimeout)
    }
    // 清理HLS实例
    cleanupHLS()
  })
})
</script>

<style scoped>
/* B站品牌色彩变量 */
:root {
  /* 主色调 */
  --bilibili-pink: #FB7299;
  --bilibili-pink-light: #FF85A2;
  --bilibili-pink-dark: #F25D8E;
  /* 辅助色 */
  --bilibili-blue: #00A1D6;
  --bilibili-blue-light: #26B8E9;
  --bilibili-blue-dark: #0084B7;
  /* 灰色系统 */
  --bilibili-gray: #9499A0;
  --bilibili-gray-light: #C9CCD0;
  --bilibili-gray-dark: #61666D;
  --bilibili-gray-extra-light: #E0E0E0;
  --bilibili-gray-extra-dark: #2C2D30;
  /* 背景色 */
  --bilibili-bg-primary: #FFFFFF;
  --bilibili-bg-secondary: #F6F7F8;
  --bilibili-bg-tertiary: #F1F2F3;
  --bilibili-bg-dark: #18191C;
  /* 文字颜色 */
  --bilibili-text-primary: #18191C;
  --bilibili-text-secondary: #61666D;
  --bilibili-text-tertiary: #9499A0;
  --bilibili-text-dark: #F5F5F5;
  --bilibili-text-dark-secondary: #C9CCD0;
  --bilibili-text-dark-tertiary: #9499A0;
  /* 边框颜色 */
  --bilibili-border: #E0E0E0;
  --bilibili-border-dark: #2C2D30;
  /* 阴影 */
  --bilibili-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  --bilibili-shadow-md: 0 4px 16px rgba(0, 0, 0, 0.12);
  /* 圆角 */
  --bilibili-radius: 8px;
  --bilibili-radius-sm: 4px;
  --bilibili-radius-lg: 12px;
  /* 过渡 */
  --bilibili-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 弹幕样式 */
.danmaku-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 10;
}

/* 基本样式 */
.bg-bilibili-primary {
  background-color: var(--bilibili-pink);
}

.text-bilibili-primary {
  color: var(--bilibili-pink);
}

.text-shadow {
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.8);
}

/* 点赞投币收藏按钮动画 */
@keyframes btnClick {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes likePop {
  0% {
    transform: scale(1);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

/* 平滑滚动效果 */
html {
  scroll-behavior: smooth;
}

/* 响应式调整 */
@media (max-width: 1024px) {
  /* 调整网格布局 */
  #video-container + .grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  /* 调整视频播放器高度 */
  #video-container {
    aspect-ratio: 16 / 9;
  }
  
  /* 调整互动按钮布局 */
  .space-x-8 {
    flex-wrap: wrap;
    justify-content: space-around;
    gap: 1rem;
  }
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  background-color: var(--bilibili-pink);
  border-radius: 3px;
}

::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.1);
}

/* 页面加载动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 为所有卡片添加进入动画 */
.bg-white.rounded-lg {
  animation: fadeIn 0.3s ease-out;
}

/* 点赞投币收藏按钮点击动画 */
button:active {
  animation: btnClick 0.2s ease-out;
}

/* 弹幕发送成功反馈 */
@keyframes danmakuSendSuccess {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.1);
    opacity: 0;
  }
}

/* 视频卡片悬停效果增强 */
.cursor-pointer:hover {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 按钮点击效果 */
button:active {
  transform: scale(0.95);
  transition: transform 0.1s ease-out;
}

/* 控制栏进度条悬停效果 */
.group\/seek:hover .absolute.h-full.bg-gray-500 {
  height: 100%;
}

/* 弹幕动画 */
@keyframes danmakuSlide {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(-100%);
  }
}
</style>