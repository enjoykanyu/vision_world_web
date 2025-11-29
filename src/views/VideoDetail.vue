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
            <div class="relative bg-black rounded-lg overflow-hidden shadow-2xl group">
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

              <!-- 自定义视频控制栏 -->
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" :class="{ 'opacity-100': !isPlaying }">
                <!-- 进度条 -->
                <div class="relative h-1 bg-gray-500 rounded-full mb-4 cursor-pointer" 
                     @click="seek" 
                     @mousedown="startSeeking"
                     @touchstart="startSeeking">
                  <div class="absolute h-full bg-bilibili-primary rounded-full" :style="{ width: `${progress}%` }"></div>
                  <div class="absolute h-3 w-3 bg-white rounded-full -mt-1 cursor-grab active:cursor-grabbing" 
                       :style="{ left: `${progress}%` }"
                       @mousedown="startSeeking"
                       @touchstart="startSeeking"></div>
                </div>

                <!-- 控制按钮和时间 -->
                <div class="flex items-center justify-between text-white">
                  <div class="flex items-center space-x-4">
                    <button @click="togglePlay" class="hover:text-bilibili-primary transition-colors">
                      <i class="fas" :class="isPlaying ? 'fa-pause' : 'fa-play'"></i>
                    </button>
                    <div class="flex items-center space-x-2">
                      <button @click="toggleMute" class="hover:text-bilibili-primary transition-colors">
                        <i class="fas" :class="isMuted ? 'fa-volume-mute' : 'fa-volume-up'"></i>
                      </button>
                      <input type="range" min="0" max="100" v-model="volume" class="w-20 accent-bilibili-primary" @input="setVolume">
                    </div>
                    <div class="text-sm">
                      {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
                    </div>
                  </div>
                  <div class="flex items-center space-x-4">
                    <button @click="toggleDanmaku" class="hover:text-bilibili-primary transition-colors">
                      <i class="fas" :class="danmakuEnabled ? 'fa-comment-dots' : 'fa-comment-slash'"></i>
                    </button>
                    <button @click="toggleFullscreen" class="hover:text-bilibili-primary transition-colors">
                    <i class="fas fa-expand"></i>
                  </button>
                  <!-- 播放速度 -->
                  <div class="playback-speed flex items-center space-x-2">
                    <span class="speed-label text-sm">速度</span>
                    <select v-model="playbackRate" @change="setPlaybackRate(playbackRate)" class="speed-select bg-transparent text-white border border-gray-600 rounded px-1 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-bilibili-primary">
                      <option value="0.5">0.5x</option>
                      <option value="0.75">0.75x</option>
                      <option value="1">1x</option>
                      <option value="1.25">1.25x</option>
                      <option value="1.5">1.5x</option>
                      <option value="2">2x</option>
                    </select>
                  </div>
                  </div>
                </div>
              </div>

              <!-- 播放按钮覆盖层 - 只在未播放且鼠标未悬停时显示 -->
              <div v-if="!isPlaying" class="absolute inset-0 flex items-center justify-center pointer-events-none">
                <button @click="togglePlay" class="w-20 h-20 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors pointer-events-auto">
                  <i class="fas fa-play text-4xl text-white"></i>
                </button>
              </div>
            </div>

            <!-- 视频信息 -->
            <div class="mt-6 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <!-- 视频标题 -->
              <h1 class="text-2xl font-bold mb-3">{{ video.title }}</h1>
              
              <!-- 视频基本信息 -->
              <div class="flex flex-wrap items-center justify-between mb-4">
                <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                  <span>播放量: {{ video.viewCount }}</span>
                  <span>点赞: {{ video.likeCount }}</span>
                  <span>时长: {{ video.duration }}</span>
                </div>
              </div>
              
              <!-- 视频说明 -->
              <div v-if="video.note" class="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p class="text-sm text-blue-800 dark:text-blue-200">{{ video.note }}</p>
              </div>
              
              <!-- 弹幕控制面板 -->
              <div class="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">弹幕设置</h3>
                  <div class="flex items-center space-x-2">
                    <button
                      @click="toggleDanmaku"
                      class="px-3 py-1 text-xs rounded-full transition-colors"
                      :class="danmakuEnabled ? 'bg-bilibili-primary text-white' : 'bg-gray-200 text-gray-600'"
                    >
                      {{ danmakuEnabled ? '弹幕开启' : '弹幕关闭' }}
                    </button>
                    <select
                      v-model="danmakuDensity"
                      class="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700"
                    >
                      <option value="low">低密度</option>
                      <option value="normal">正常</option>
                      <option value="high">高密度</option>
                    </select>
                  </div>
                </div>
                
                <!-- 弹幕输入区域 -->
                <div class="flex items-center space-x-2">
                  <input
                    v-model="newDanmakuText"
                    @keyup.enter="sendDanmaku"
                    placeholder="发送弹幕..."
                    class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-bilibili-primary dark:bg-gray-700 dark:text-white"
                    :disabled="!danmakuEnabled"
                  >
                  <div class="flex items-center border-t border-b border-gray-300 dark:border-gray-600">
                    <!-- 颜色选择器 -->
                    <input
                      v-model="danmakuColor"
                      type="color"
                      class="w-10 h-10 border-none cursor-pointer"
                      title="弹幕颜色"
                    >
                    <!-- 速度选择 -->
                    <select
                      v-model="danmakuSpeed"
                      class="text-xs border-none bg-transparent px-2 py-1 dark:bg-gray-700 dark:text-white"
                      title="弹幕速度"
                    >
                      <option value="6">超快</option>
                      <option value="8">快</option>
                      <option value="10">正常</option>
                      <option value="12">慢</option>
                      <option value="15">超慢</option>
                    </select>
                  </div>
                  <button
                    @click="sendDanmaku"
                    :disabled="!danmakuEnabled || !newDanmakuText.trim()"
                    class="bg-bilibili-primary hover:bg-bilibili-secondary text-white px-4 py-2 rounded-r-lg font-medium transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-600"
                  >
                    发送
                  </button>
                </div>
                
                <!-- 弹幕统计 -->
                <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  当前弹幕: {{ danmakus.length }} | 速度: {{ danmakuSpeed }}秒
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧: 视频信息展示区域 -->
          <div class="lg:col-span-4">
            <!-- UP主信息卡片 -->
            <div class="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-600">
              <div class="flex items-center space-x-3 mb-4">
                <div class="w-12 h-12 bg-gradient-to-br from-bilibili-primary to-bilibili-secondary rounded-full flex items-center justify-center text-white font-bold">
                  U
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-gray-900 dark:text-white truncate">UP主名称</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ Math.floor(Math.random() * 100) }}万粉丝</p>
                </div>
                <button class="bg-bilibili-primary hover:bg-bilibili-secondary text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  关注
                </button>
              </div>
              
              <!-- 视频统计信息 -->
              <div class="grid grid-cols-3 gap-4 text-center mb-4">
                <div>
                  <div class="text-lg font-semibold text-gray-900 dark:text-white">{{ Math.floor(Math.random() * 500) + 100 }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">播放(万)</div>
                </div>
                <div>
                  <div class="text-lg font-semibold text-gray-900 dark:text-white">{{ Math.floor(Math.random() * 50) + 10 }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">弹幕(万)</div>
                </div>
                <div>
                  <div class="text-lg font-semibold text-gray-900 dark:text-white">{{ Math.floor(Math.random() * 20) + 5 }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">收藏(万)</div>
                </div>
              </div>
              
              <!-- 互动按钮 -->
              <div class="flex justify-between items-center space-x-2">
                <button class="flex-1 flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <svg class="w-5 h-5 text-gray-600 dark:text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                  <span class="text-xs text-gray-600 dark:text-gray-400">点赞</span>
                </button>
                <button class="flex-1 flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <svg class="w-5 h-5 text-gray-600 dark:text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                  </svg>
                  <span class="text-xs text-gray-600 dark:text-gray-400">投币</span>
                </button>
                <button class="flex-1 flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <svg class="w-5 h-5 text-gray-600 dark:text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                  </svg>
                  <span class="text-xs text-gray-600 dark:text-gray-400">收藏</span>
                </button>
                <button class="flex-1 flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <svg class="w-5 h-5 text-gray-600 dark:text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                  </svg>
                  <span class="text-xs text-gray-600 dark:text-gray-400">分享</span>
                </button>
              </div>
            </div>
            
            <!-- 推荐视频 -->
            <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">推荐视频</h3>
              <div class="space-y-4">
                <div v-for="relatedVideo in relatedVideos" :key="relatedVideo.id" class="flex space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors">
                  <div class="relative flex-shrink-0 w-32 h-20 rounded overflow-hidden">
                    <img :src="relatedVideo.poster" alt="{{ relatedVideo.title }}" class="w-full h-full object-cover">
                    <span class="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                      {{ relatedVideo.duration }}
                    </span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                      {{ relatedVideo.title }}
                    </h4>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ relatedVideo.author }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ relatedVideo.viewCount }} 播放</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 评论区 -->
        <div class="mt-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
          <div class="p-6 border-b border-gray-200 dark:border-gray-600">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">评论区</h2>
            
            <!-- 评论输入框 -->
            <div class="flex space-x-3 mb-6">
              <div class="w-10 h-10 bg-gradient-to-br from-bilibili-primary to-bilibili-secondary rounded-full flex items-center justify-center text-white font-bold text-sm">
                U
              </div>
              <div class="flex-1">
                <textarea
                  v-model="newComment"
                  placeholder="发表你的看法..."
                  class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-bilibili-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows="3"
                ></textarea>
                <div class="flex justify-between items-center mt-3">
                  <div class="flex space-x-2">
                    <button class="text-gray-500 dark:text-gray-400 hover:text-bilibili-primary transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </button>
                    <button class="text-gray-500 dark:text-gray-400 hover:text-bilibili-primary transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                      </svg>
                    </button>
                  </div>
                  <button
                    @click="addComment"
                    :disabled="!newComment.trim()"
                    class="bg-bilibili-primary hover:bg-bilibili-secondary disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    发表评论
                  </button>
                </div>
              </div>
            </div>
            
            <!-- 评论排序 -->
            <div class="flex items-center space-x-4 mb-4">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ comments.length }} 条评论</span>
              <div class="flex space-x-2">
                <button
                  v-for="sort in commentSortOptions"
                  :key="sort.value"
                  @click="currentCommentSort = sort.value"
                  :class="[
                    'text-sm px-3 py-1 rounded-full transition-colors',
                    currentCommentSort === sort.value
                      ? 'bg-bilibili-primary text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-bilibili-primary'
                  ]"
                >
                  {{ sort.label }}
                </button>
              </div>
            </div>
          </div>
          
          <!-- 评论列表 -->
          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            <div v-for="comment in comments" :key="comment.id" class="p-6">
              <div class="flex space-x-3">
                <div class="w-10 h-10 bg-gradient-to-br from-bilibili-primary to-bilibili-secondary rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {{ comment.user.charAt(0) }}
                </div>
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-2">
                    <span class="font-medium text-gray-900 dark:text-white">{{ comment.user }}</span>
                    <span class="text-xs text-gray-500 dark:text-gray-400">{{ comment.time }}</span>
                    <span v-if="comment.isUp" class="bg-bilibili-primary text-white text-xs px-2 py-0.5 rounded-full">UP主</span>
                  </div>
                  <p class="text-gray-700 dark:text-gray-300 mb-3">{{ comment.content }}</p>
                  <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <button
                      @click="likeComment(comment)"
                      class="flex items-center space-x-1 hover:text-bilibili-primary transition-colors"
                      :class="{ 'text-bilibili-primary': comment.liked }"
                    >
                      <svg class="w-4 h-4" :fill="comment.liked ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                      </svg>
                      <span>{{ comment.likes }}</span>
                    </button>
                    <button class="hover:text-bilibili-primary transition-colors">回复</button>
                    <button class="hover:text-bilibili-primary transition-colors">举报</button>
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
// 弹幕池 - 存储所有预生成的弹幕
const danmakuPool = ref<Array<{text: string, color: string, top: number, speed: number, timestamp: number, visible: boolean, translateX: number}>>([])
// 当前显示的弹幕
const danmakus = ref<Array<{text: string, color: string, top: number, speed: number, timestamp: number, visible: boolean, translateX: number}>>([])
const newDanmakuText = ref('')
const danmakuEnabled = ref(true)
const danmakuContainer = ref<HTMLDivElement | null>(null)
const danmakuColor = ref('#FFFFFF')
const danmakuSpeed = ref(10)
const danmakuDensity = ref('normal') // low, normal, high

// 评论数据
const comments = ref<Array<{
  id: number
  user: string
  content: string
  time: string
  likes: number
  liked: boolean
  isUp: boolean
}>>([
  {
    id: 1,
    user: '用户123',
    content: '这个视频制作得太棒了！内容很精彩，期待更多优质内容。',
    time: '2小时前',
    likes: 128,
    liked: false,
    isUp: false
  },
  {
    id: 2,
    user: 'UP主',
    content: '感谢大家的支持！会继续努力的！',
    time: '3小时前',
    likes: 256,
    liked: true,
    isUp: true
  },
  {
    id: 3,
    user: '观众A',
    content: '第一次看这个系列，感觉很有意思，已经关注了！',
    time: '5小时前',
    likes: 89,
    liked: false,
    isUp: false
  }
])

// 弹幕轨道系统
const danmakuTracks = [10, 20, 30, 40, 50, 60, 70, 80] // 8个轨道
let currentTrackIndex = 0
let danmakuInterval: number | null = null

// 评论相关状态
const newComment = ref('')
const currentCommentSort = ref('hot')
const commentSortOptions = [
  { value: 'hot', label: '最热' },
  { value: 'new', label: '最新' }
]

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
  { id: 2, title: '测试相关视频 2', author: '测试作者', viewCount: '8.5千', duration: '08:45', poster: 'https://picsum.photos/320/180?random=2' },
  { id: 3, title: '测试相关视频 3 这是一个比较长的标题用来测试多行显示效果', author: '测试作者', viewCount: '3.7万', duration: '15:12', poster: 'https://picsum.photos/320/180?random=3' },
  { id: 4, title: '测试相关视频 4', author: '测试作者', viewCount: '2.1万', duration: '05:30', poster: 'https://picsum.photos/320/180?random=4' },
  { id: 5, title: '测试相关视频 5', author: '测试作者', viewCount: '9.8千', duration: '12:48', poster: 'https://picsum.photos/320/180?random=5' },
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
const sendDanmaku = () => {
  if (!newDanmakuText.value.trim() || !danmakuEnabled.value) return

  // 使用轨道系统避免重叠
  const track = danmakuTracks[currentTrackIndex]
  currentTrackIndex = (currentTrackIndex + 1) % danmakuTracks.length
  
  // 用户发送的弹幕，时间戳为当前视频时间
  const currentVideoTime = videoPlayer.value?.currentTime || 0

  const newDanmaku = {
    text: newDanmakuText.value,
    color: danmakuColor.value,
    top: track,
    speed: danmakuSpeed.value,
    timestamp: currentVideoTime,
    visible: true,
    translateX: 0
  }
  
  danmakus.value.push(newDanmaku)
  // 也添加到弹幕池，以便进度条跳转时能找到
  danmakuPool.value.push(newDanmaku)

  newDanmakuText.value = ''
}

// 预生成弹幕池
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
  // 清空现有弹幕
  danmakus.value = []
  
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

// 添加新弹幕（用户发送）
const addNewDanmaku = () => {
  const sampleTexts = [
    '这个视频太棒了！', '前方高能！', '666', '主播加油！', '哈哈哈哈',
    '这个操作太秀了', '学习了', '打卡', '支持一下', '路过留名'
  ]
  
  const track = danmakuTracks[currentTrackIndex]
  currentTrackIndex = (currentTrackIndex + 1) % danmakuTracks.length
  
  // 用户发送的弹幕，时间戳为当前视频时间
  const currentVideoTime = videoPlayer.value?.currentTime || 0
  
  const newDanmaku = {
    text: sampleTexts[Math.floor(Math.random() * sampleTexts.length)],
    color: ['#FFFFFF', '#FB7299', '#00A1D6', '#FFD700', '#FF6B6B', '#4ECDC4'][Math.floor(Math.random() * 6)],
    top: track,
    speed: 8 + Math.random() * 4,
    timestamp: currentVideoTime,
    visible: true,
    translateX: 0
  }
  
  danmakus.value.push(newDanmaku)
  // 也添加到弹幕池，以便进度条跳转时能找到
  danmakuPool.value.push(newDanmaku)
}

// 评论相关方法
const addComment = () => {
  if (!newComment.value.trim()) return
  
  const comment = {
    id: Date.now(),
    user: '我',
    content: newComment.value.trim(),
    time: '刚刚',
    likes: 0,
    liked: false,
    isUp: false
  }
  
  comments.value.unshift(comment)
  newComment.value = ''
}

const likeComment = (comment: any) => {
  comment.liked = !comment.liked
  comment.likes += comment.liked ? 1 : -1
}



// 切换播放状态
const togglePlay = () => {
  if (!videoPlayer.value) return
  
  if (videoPlayer.value.paused) {
    videoPlayer.value.play()
    isPlaying.value = true
    // 暂停后播放，不重新生成弹幕，继续之前的弹幕移动
    if (danmakuEnabled.value && danmakuPool.value.length === 0) {
      // 只有当弹幕池为空时，才重新生成弹幕
      simulateDanmakus()
    }
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

// 监听视频时间更新事件
const onTimeUpdate = () => {
  if (videoPlayer.value && !isSeeking.value) {
    currentTime.value = videoPlayer.value.currentTime
    progress.value = (videoPlayer.value.currentTime / duration.value) * 100
    
    // 更新弹幕位置
    updateDanmakusPosition()
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

// 生命周期
onMounted(() => {
  fetchVideoData()
  simulateDanmakus()
  window.addEventListener('keydown', handleKeydown)
  
  // 开始定时更新弹幕位置
  const danmakuUpdateInterval = setInterval(updateDanmakusPosition, 16) // 约60fps
  
  onUnmounted(() => {
    clearInterval(danmakuUpdateInterval)
  })
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (videoPlayer.value) {
    videoPlayer.value.pause()
  }
  if (danmakuInterval) {
    clearInterval(danmakuInterval)
  }
  // 清空弹幕
  danmakus.value = []
})
</script>

<style scoped>
/* B站品牌色彩变量 */
:root {
  --bilibili-pink: #FB7299;
  --bilibili-pink-light: #FF85A2;
  --bilibili-blue: #00A1D6;
  --bilibili-blue-light: #26B8E9;
  --bilibili-gray: #9499A0;
  --bilibili-gray-light: #C9CCD0;
  --bilibili-bg-primary: #FFFFFF;
  --bilibili-bg-secondary: #F6F7F8;
  --bilibili-bg-tertiary: #F1F2F3;
  --bilibili-text-primary: #18191C;
  --bilibili-text-secondary: #61666D;
  --bilibili-text-tertiary: #9499A0;
}

/* 弹幕样式 */
.danmaku-item {
  font-size: 20px;
  line-height: 1.2;
  white-space: nowrap;
  position: absolute;
  z-index: 10;
  font-weight: 500;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  will-change: transform;
}

.danmaku-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 10;
}

/* B站风格视频播放器 */
.video-player-container {
  position: relative;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 控制栏样式 */
.video-controls {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  backdrop-filter: blur(10px);
}

.control-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-size: 14px;
}

.control-button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: var(--bilibili-pink);
  color: var(--bilibili-pink-light);
}

/* 进度条样式 */
.progress-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  cursor: pointer;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: var(--bilibili-pink);
  border-radius: 2px;
  transition: width 0.1s ease;
}

.progress-thumb {
  width: 12px;
  height: 12px;
  background: white;
  border: 2px solid var(--bilibili-pink);
  border-radius: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  cursor: grab;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.progress-thumb:active {
  cursor: grabbing;
  transform: translate(-50%, -50%) scale(1.2);
}

/* 播放按钮样式 */
.play-button {
  width: 80px;
  height: 80px;
  background: rgba(0, 0, 0, 0.6);
  border: 3px solid rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.play-button:hover {
  background: rgba(251, 114, 153, 0.8);
  border-color: white;
  transform: scale(1.1);
}

.play-icon {
  color: white;
  font-size: 32px;
  margin-left: 4px;
}

/* 弹幕输入框样式 */
.danmaku-input-container {
  display: flex;
  background: var(--bilibili-bg-secondary);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--bilibili-gray-light);
}

.danmaku-input {
  flex: 1;
  padding: 12px 16px;
  border: none;
  background: transparent;
  font-size: 14px;
  color: var(--bilibili-text-primary);
  outline: none;
}

.danmaku-input::placeholder {
  color: var(--bilibili-text-tertiary);
}

.danmaku-input:focus {
  background: white;
}

.danmaku-send-button {
  background: var(--bilibili-pink);
  color: white;
  border: none;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.danmaku-send-button:hover {
  background: var(--bilibili-pink-light);
}

/* 视频信息卡片 */
.video-info-card {
  background: var(--bilibili-bg-primary);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.video-title {
  font-size: 18px;
  font-weight: 500;
  color: var(--bilibili-text-primary);
  line-height: 1.4;
}

.video-stats {
  color: var(--bilibili-text-tertiary);
  font-size: 13px;
}

/* 相关视频卡片 */
.related-video-card {
  background: var(--bilibili-bg-primary);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s ease;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.related-video-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  border-color: var(--bilibili-pink);
}

.related-video-thumbnail {
  position: relative;
  overflow: hidden;
}

.related-video-thumbnail img {
  transition: transform 0.3s ease;
}

.related-video-card:hover .related-video-thumbnail img {
  transform: scale(1.05);
}

.duration-badge {
  position: absolute;
  bottom: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .video-player-container {
    border-radius: 0;
  }
  
  .control-button {
    padding: 6px 8px;
    font-size: 12px;
  }
  
  .play-button {
    width: 60px;
    height: 60px;
  }
  
  .play-icon {
    font-size: 24px;
  }
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  :root {
    --bilibili-bg-primary: #1C1C1C;
    --bilibili-bg-secondary: #2B2B2B;
    --bilibili-bg-tertiary: #3A3A3A;
    --bilibili-text-primary: #E8E8E8;
    --bilibili-text-secondary: #B8B8B8;
    --bilibili-text-tertiary: #888888;
  }
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

/* 响应式调整 */
@media (max-width: 1024px) {
  .grid-cols-12 {
    grid-template-columns: 1fr;
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
</style>