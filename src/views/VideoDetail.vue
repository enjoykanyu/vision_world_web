<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 使用共用导航头组件 -->
    <NavHeader 
      :isLoggedIn="userStore.isLoggedIn" 
      :username="userStore.username" 
      @login="showLoginModal = true"
      @toggleDarkMode="toggleDarkMode"
    />

    <!-- 主要内容 -->
    <main class="max-w-screen-xl mx-auto px-4 py-6">
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- 左侧视频区域 -->
        <div class="lg:w-9/12">
          <!-- 视频播放器 -->
          <div class="bg-black rounded-lg overflow-hidden mb-4">
            <div class="aspect-video relative group">
              <!-- 视频元素或图片 -->
              <video 
                v-if="isPlaying"
                ref="videoRef"
                :src="videoData.videoUrl"
                class="w-full h-full object-cover"
                @timeupdate="updateProgress"
                @loadedmetadata="onVideoLoaded"
                @touchstart="onVideoTouchStart"
                @touchmove="onVideoTouchMove"
                @touchend="onVideoTouchEnd"
                @click="onVideoClick"
              ></video>
              <img 
                v-else
                :src="videoData.cover" 
                :alt="videoData.title" 
                class="w-full h-full object-cover cursor-pointer"
                @click="startPlay"
                @touchstart="onVideoTouchStart"
                @touchmove="onVideoTouchMove"
                @touchend="onVideoTouchEnd"
              >
              
              <!-- 播放/暂停按钮 -->
              <div 
                v-if="!isPlaying || showControls" 
                class="absolute inset-0 flex items-center justify-center pointer-events-none"
                @touchstart.passive="onControlTouchStart"
                @touchend.passive="onControlTouchEnd"
              >
                <button 
                  @click="togglePlay" 
                  class="w-16 h-16 md:w-20 md:h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-300 pointer-events-auto"
                >
                  <svg v-if="!isPlaying" class="w-8 h-8 md:w-12 md:h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  <svg v-else class="w-8 h-8 md:w-12 md:h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                </button>
              </div>
              
              <!-- 视频控制栏 -->
              <div 
                v-if="isPlaying && (showControls || isProgressVisible)"
                class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 md:p-4 transition-opacity duration-300"
                :class="{ 'opacity-0': !showControls && !isDragging }"
              >
                <!-- 进度条 -->
                <div class="mb-2 md:mb-3">
                  <div 
                    ref="progressBarRef"
                    class="relative h-1 md:h-2 bg-white/30 rounded-full cursor-pointer touch-action-none"
                    @click="seekToPosition"
                    @touchstart="startDrag"
                    @touchmove="onDrag"
                    @touchend="endDrag"
                    @mousedown="startDrag"
                    @mousemove="onDrag"
                    @mouseup="endDrag"
                    @mouseleave="endDrag"
                  >
                    <!-- 缓冲进度 -->
                    <div 
                      class="absolute top-0 left-0 h-full bg-white/50 rounded-full"
                      :style="{ width: bufferedProgress + '%' }"
                    ></div>
                    
                    <!-- 播放进度 -->
                    <div 
                      class="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                      :style="{ width: playProgress + '%' }"
                    ></div>
                    
                    <!-- 拖拽圆点 -->
                    <div 
                      class="absolute top-1/2 w-3 h-3 md:w-4 md:h-4 bg-blue-500 rounded-full transform -translate-y-1/2 -translate-x-1/2 transition-transform duration-200"
                      :class="{ 'scale-125': isDragging }"
                      :style="{ left: playProgress + '%' }"
                    ></div>
                  </div>
                </div>
                
                <!-- 控制按钮和时间 -->
                <div class="flex items-center justify-between text-white text-xs md:text-sm">
                  <div class="flex items-center space-x-2 md:space-x-4">
                    <button @click="togglePlay" class="hover:text-blue-400 transition-colors">
                      <svg v-if="!isPlaying" class="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                      <svg v-else class="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                      </svg>
                    </button>
                    
                    <span>{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
                  </div>
                  
                  <div class="flex items-center space-x-2 md:space-x-4">
                    <!-- 音量控制 -->
                    <button @click="toggleMute" class="hover:text-blue-400 transition-colors">
                      <svg v-if="!isMuted" class="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                      </svg>
                      <svg v-else class="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                      </svg>
                    </button>
                    
                    <!-- 全屏按钮 -->
                    <button @click="toggleFullscreen" class="hover:text-blue-400 transition-colors">
                      <svg class="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 视频信息 -->
          <div class="bg-white rounded-lg p-4 mb-4">
            <h1 class="text-xl font-bold text-gray-900 mb-2">{{ videoData.title }}</h1>
            
            <div class="flex items-center text-sm text-gray-500 mb-4">
              <span>{{ videoData.playCount }} 播放</span>
              <span class="mx-2">·</span>
              <span>{{ videoData.danmaku }} 弹幕</span>
              <span class="mx-2">·</span>
              <span>{{ videoData.publishDate }}</span>
            </div>
            
            <div class="border-t border-b border-gray-100 py-4 flex items-center justify-between">
              <!-- UP主信息 -->
              <div class="flex items-center">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-red-500 flex items-center justify-center text-white font-bold mr-3">
                  {{ videoData.uploader.charAt(0) }}
                </div>
                <div>
                  <div class="font-medium text-gray-900">{{ videoData.uploader }}</div>
                  <div class="text-xs text-gray-500">{{ videoData.followerCount }} 粉丝</div>
                </div>
              </div>
              
              <!-- 关注按钮 -->
              <button class="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors duration-300">
                + 关注
              </button>
            </div>
            
            <!-- 视频操作栏 -->
            <div class="flex items-center justify-between pt-4">
              <div class="flex items-center space-x-4">
                <!-- 点赞 -->
                <button class="flex items-center space-x-1 text-gray-600 hover:text-blue-500">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/>
                  </svg>
                  <span>{{ videoData.likes }}</span>
                </button>
                
                <!-- 投币 -->
                <button class="flex items-center space-x-1 text-gray-600 hover:text-blue-500">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>投币</span>
                </button>
                
                <!-- 收藏 -->
                <button class="flex items-center space-x-1 text-gray-600 hover:text-blue-500">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                  </svg>
                  <span>收藏</span>
                </button>
                
                <!-- 分享 -->
                <button class="flex items-center space-x-1 text-gray-600 hover:text-blue-500">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                  </svg>
                  <span>分享</span>
                </button>
              </div>
              
              <!-- 一键三连 -->
              <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors duration-300">
                一键三连
              </button>
            </div>
          </div>
          
          <!-- 视频简介 -->
          <div class="bg-white rounded-lg p-4 mb-4">
            <h3 class="font-medium text-gray-900 mb-2">简介</h3>
            <p class="text-sm text-gray-700 whitespace-pre-line">{{ videoData.description }}</p>
            <div class="mt-3 flex flex-wrap gap-2">
              <span v-for="(tag, index) in videoData.tags" :key="index" 
                    class="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-md hover:bg-blue-100 cursor-pointer">
                {{ tag }}
              </span>
            </div>
          </div>
          
          <!-- 评论区 -->
          <div class="bg-white rounded-lg p-4">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-medium text-gray-900">评论 ({{ videoData.commentCount }})</h3>
              <div class="text-sm text-gray-500">
                <span class="cursor-pointer hover:text-blue-500">最新</span>
                <span class="mx-2">|</span>
                <span class="cursor-pointer hover:text-blue-500">最热</span>
              </div>
            </div>
            
            <!-- 评论输入框 -->
            <div class="flex items-start space-x-3 mb-6">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm">
                {{ isLoggedIn ? username.charAt(0).toUpperCase() : 'U' }}
              </div>
              <div class="flex-1">
                <textarea 
                  placeholder="发一条友善的评论" 
                  class="w-full border border-gray-200 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="2"
                ></textarea>
                <div class="flex justify-between mt-2">
                  <div class="flex items-center space-x-3 text-gray-500">
                    <button class="hover:text-blue-500">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </button>
                  </div>
                  <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded text-sm transition-colors duration-300">
                    发布
                  </button>
                </div>
              </div>
            </div>
            
            <!-- 评论列表 -->
            <div class="space-y-6">
              <div v-for="(comment, index) in videoData.comments" :key="index" class="flex space-x-3">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-red-500 flex items-center justify-center text-white text-sm">
                  {{ comment.username.charAt(0) }}
                </div>
                <div class="flex-1">
                  <div class="flex items-center">
                    <span class="font-medium text-sm text-gray-900">{{ comment.username }}</span>
                    <span class="mx-2 text-xs text-gray-400">·</span>
                    <span class="text-xs text-gray-400">{{ comment.time }}</span>
                  </div>
                  <p class="mt-1 text-sm text-gray-700">{{ comment.content }}</p>
                  <div class="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                    <button class="flex items-center space-x-1 hover:text-blue-500">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/>
                      </svg>
                      <span>{{ comment.likes }}</span>
                    </button>
                    <button class="hover:text-blue-500">回复</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 右侧推荐区域 -->
        <div class="lg:w-3/12">
          <div class="bg-white rounded-lg p-4 mb-4">
            <h3 class="font-medium text-gray-900 mb-3">相关推荐</h3>
            
            <div class="space-y-4">
              <div v-for="(video, index) in recommendedVideos" :key="index" 
                   class="flex space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                   @click="goToVideo(video.id)">
                <div class="w-24 h-16 relative rounded overflow-hidden flex-shrink-0">
                  <img :src="video.cover" :alt="video.title" class="w-full h-full object-cover">
                  <div class="absolute bottom-0.5 right-0.5 bg-black/80 text-white text-xs px-1 rounded">
                    {{ video.duration }}
                  </div>
                </div>
                <div class="flex-1">
                  <h4 class="text-xs font-medium text-gray-900 line-clamp-2 mb-1">{{ video.title }}</h4>
                  <div class="text-xs text-gray-500">
                    <div>{{ video.uploader }}</div>
                    <div>{{ video.playCount }} 播放</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <!-- 登录弹窗 -->
    <div v-if="showLoginModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg w-96 p-6 shadow-xl" @click.stop>
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-gray-800">登录</h3>
          <button @click="closeLoginModal" class="text-gray-500 hover:text-gray-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="mb-6">
          <div class="mb-4">
            <label for="username" class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
            <input 
              type="text" 
              id="username" 
              v-model="loginForm.username" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="请输入用户名"
            >
          </div>
          
          <div class="mb-4">
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">密码</label>
            <input 
              type="password" 
              id="password" 
              v-model="loginForm.password" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="请输入密码"
            >
          </div>
          
          <div v-if="loginError" class="mb-4 text-sm text-red-500">
            {{ loginError }}
          </div>
          
          <button 
            @click="handleLogin" 
            class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-medium transition-colors duration-300"
          >
            登录
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavHeader from '../components/NavHeader.vue'
import { useUserStore } from '../stores/userStore'

// 使用全局用户状态
const userStore = useUserStore()

// 深色模式状态
const isDarkMode = ref(false)
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

const route = useRoute()
const router = useRouter()
const videoId = ref(route.params.id)

// 视频播放相关状态
const videoRef = ref<HTMLVideoElement | null>(null)
const progressBarRef = ref<HTMLDivElement | null>(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const playProgress = ref(0)
const bufferedProgress = ref(0)
const isMuted = ref(false)
const showControls = ref(true)
const isProgressVisible = ref(true)
const isDragging = ref(false)
const controlsTimer = ref<number | null>(null)

// 触摸相关
const touchStartTime = ref(0)
const touchStartX = ref(0)
const touchStartY = ref(0)
const isTouchMove = ref(false)

// 登录相关
const showLoginModal = ref(false)
const loginForm = ref({
  username: '',
  password: ''
})
const loginError = ref('')

// 处理用户头像点击
const handleUserIconClick = () => {
  if (!userStore.isLoggedIn) {
    showLoginModal.value = true
  } else {
    console.log('用户已登录，显示用户菜单')
  }
}

// 处理登录
const handleLogin = () => {
  if (loginForm.value.username && loginForm.value.password) {
    if (loginForm.value.password === '123456') {
      // 使用全局用户状态存储
      userStore.login({
        username: loginForm.value.username,
        userId: '12345678' // 模拟用户ID
      })
      showLoginModal.value = false
      loginError.value = ''
      loginForm.value = { username: '', password: '' }
    } else {
      loginError.value = '用户名或密码错误'
    }
  } else {
    loginError.value = '请输入用户名和密码'
  }
}

// 关闭登录弹窗
const closeLoginModal = () => {
  showLoginModal.value = false
  loginError.value = ''
  loginForm.value = { username: '', password: '' }
}

// 跳转到其他视频
const goToVideo = (id: number) => {
  router.push(`/video/${id}`)
}

// 视频播放功能
const startPlay = () => {
  isPlaying.value = true
  nextTick(() => {
    if (videoRef.value) {
      videoRef.value.play()
      resetControlsTimer()
    }
  })
}

const togglePlay = () => {
  if (!videoRef.value) {
    startPlay()
    return
  }
  
  if (videoRef.value.paused) {
    videoRef.value.play()
    isPlaying.value = true
  } else {
    videoRef.value.pause()
    isPlaying.value = false
  }
  
  showControls.value = true
  resetControlsTimer()
}

// 视频点击事件（桌面端）
const onVideoClick = (e: MouseEvent) => {
  // 如果不是触摸设备才响应点击事件
  if (!('ontouchstart' in window)) {
    e.preventDefault()
    togglePlay()
  }
}

// 视频触摸事件处理
const onVideoTouchStart = (e: TouchEvent) => {
  touchStartTime.value = Date.now()
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
  isTouchMove.value = false
}

const onVideoTouchMove = (e: TouchEvent) => {
  if (e.touches.length > 0) {
    const touch = e.touches[0]
    const deltaX = Math.abs(touch.clientX - touchStartX.value)
    const deltaY = Math.abs(touch.clientY - touchStartY.value)
    
    // 如果移动距离超过10px，认为是滑动而不是点击
    if (deltaX > 10 || deltaY > 10) {
      isTouchMove.value = true
    }
  }
}

const onVideoTouchEnd = (e: TouchEvent) => {
  const touchEndTime = Date.now()
  const touchDuration = touchEndTime - touchStartTime.value
  
  // 如果是短暂点击且没有移动，则切换播放状态
  if (touchDuration < 500 && !isTouchMove.value) {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isPlaying.value) {
      startPlay()
    } else {
      togglePlay()
    }
  }
}

// 控制按钮触摸事件处理
const onControlTouchStart = (e: TouchEvent) => {
  // 阻止事件冒泡，防止触发视频的触摸事件
  e.stopPropagation()
}

const onControlTouchEnd = (e: TouchEvent) => {
  // 阻止事件冒泡
  e.stopPropagation()
}

// 原有的触摸事件处理（用于进度条等其他元素）
const onTouchStart = (e: TouchEvent) => {
  touchStartTime.value = Date.now()
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
  isTouchMove.value = false
}

const onTouchEnd = (e: TouchEvent) => {
  const touchEndTime = Date.now()
  const touchDuration = touchEndTime - touchStartTime.value
  
  // 如果是短暂点击且没有移动，则切换播放状态
  if (touchDuration < 300 && !isTouchMove.value) {
    e.preventDefault()
    togglePlay()
  }
}

// 视频加载完成
const onVideoLoaded = () => {
  if (videoRef.value) {
    duration.value = videoRef.value.duration
  }
}

// 更新播放进度
const updateProgress = () => {
  if (videoRef.value && !isDragging.value) {
    currentTime.value = videoRef.value.currentTime
    playProgress.value = (currentTime.value / duration.value) * 100
    
    // 更新缓冲进度
    if (videoRef.value.buffered.length > 0) {
      const bufferedEnd = videoRef.value.buffered.end(videoRef.value.buffered.length - 1)
      bufferedProgress.value = (bufferedEnd / duration.value) * 100
    }
  }
}

// 进度条拖拽功能
const startDrag = (e: MouseEvent | TouchEvent) => {
  isDragging.value = true
  showControls.value = true
  updateProgressFromEvent(e)
  
  if (e.type === 'mousedown') {
    document.addEventListener('mousemove', onDrag)
    document.addEventListener('mouseup', endDrag)
  }
}

const onDrag = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return
  
  e.preventDefault()
  updateProgressFromEvent(e)
  
  // 检测触摸移动
  if (e.type === 'touchmove') {
    const touch = (e as TouchEvent).touches[0]
    const deltaX = Math.abs(touch.clientX - touchStartX.value)
    const deltaY = Math.abs(touch.clientY - touchStartY.value)
    if (deltaX > 5 || deltaY > 5) {
      isTouchMove.value = true
    }
  }
}

const endDrag = () => {
  if (isDragging.value && videoRef.value) {
    videoRef.value.currentTime = (playProgress.value / 100) * duration.value
  }
  
  isDragging.value = false
  resetControlsTimer()
  
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', endDrag)
}

// 点击进度条跳转
const seekToPosition = (e: MouseEvent) => {
  if (isDragging.value) return
  updateProgressFromEvent(e)
  
  if (videoRef.value) {
    videoRef.value.currentTime = (playProgress.value / 100) * duration.value
  }
}

// 从事件更新进度
const updateProgressFromEvent = (e: MouseEvent | TouchEvent) => {
  if (!progressBarRef.value) return
  
  const rect = progressBarRef.value.getBoundingClientRect()
  let clientX: number
  
  if (e.type.startsWith('touch')) {
    clientX = (e as TouchEvent).touches[0]?.clientX || (e as TouchEvent).changedTouches[0].clientX
  } else {
    clientX = (e as MouseEvent).clientX
  }
  
  const progress = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
  playProgress.value = progress
}

// 静音控制
const toggleMute = () => {
  if (videoRef.value) {
    videoRef.value.muted = !videoRef.value.muted
    isMuted.value = videoRef.value.muted
  }
}

// 全屏控制
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    videoRef.value?.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

// 控制栏显示/隐藏
const resetControlsTimer = () => {
  if (controlsTimer.value) {
    clearTimeout(controlsTimer.value)
  }
  
  showControls.value = true
  
  if (isPlaying.value) {
    controlsTimer.value = setTimeout(() => {
      showControls.value = false
    }, 3000)
  }
}

// 检查进度条是否可见
const checkProgressVisibility = () => {
  if (!progressBarRef.value) return
  
  const rect = progressBarRef.value.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  
  isProgressVisible.value = rect.top < viewportHeight && rect.bottom > 0
}

// 时间格式化
const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return '0:00'
  
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// 监听滚动事件检查进度条可见性
const handleScroll = () => {
  checkProgressVisibility()
}

// 生命周期
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  checkProgressVisibility()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (controlsTimer.value) {
    clearTimeout(controlsTimer.value)
  }
})

// 视频数据
const videoData = ref({
  id: videoId.value,
  title: 'B站唯一一次得最高Claude Code人！AI编程能力测试',
  cover: 'https://via.placeholder.com/800x450/32CD32/FFFFFF?text=视频3',
  videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // 示例视频URL
  duration: '06:40',
  uploader: 'AI学习TV',
  followerCount: '128.5万',
  playCount: '3万',
  danmaku: '163',
  publishDate: '2025-09-20',
  likes: '2.8万',
  description: '在这个视频中，我们测试了Claude的编程能力，结果令人惊讶！Claude不仅能够理解复杂的编程概念，还能够编写高质量的代码。本视频详细展示了测试过程和结果分析。',
  tags: ['AI', '编程', 'Claude', '人工智能', '代码测试'],
  commentCount: 326,
  comments: [
    {
      username: '编程爱好者',
      time: '3小时前',
      content: '这个测试太厉害了，Claude的代码能力确实超出我的预期！',
      likes: 128
    },
    {
      username: 'AI研究员',
      time: '5小时前',
      content: '作为一个从事AI研究的人，我认为这个测试设计得很合理，能够真实反映AI的编程能力。',
      likes: 89
    },
    {
      username: '前端小王',
      time: '昨天',
      content: '我用Claude写了一个Vue组件，质量比我自己写的还好，哈哈！',
      likes: 56
    }
  ]
})

// 推荐视频
const recommendedVideos = [
  {
    id: 1,
    title: '老婆第一次测魅力，如何得后悔了！！！',
    cover: 'https://via.placeholder.com/300x200/FF69B4/FFFFFF?text=视频1',
    duration: '10:44',
    uploader: '哔哩哔哩',
    playCount: '10万'
  },
  {
    id: 2,
    title: '餐饮企业"国改"梦永活',
    cover: 'https://via.placeholder.com/300x200/4169E1/FFFFFF?text=视频2',
    duration: '13:17',
    uploader: '老北京Official',
    playCount: '5.2万'
  },
  {
    id: 4,
    title: '在从生活的脚步当导游！',
    cover: 'https://via.placeholder.com/300x200/FF4500/FFFFFF?text=视频4',
    duration: '08:19',
    uploader: '竹鼠洞洞的向导',
    playCount: '817万'
  },
  {
    id: 5,
    title: '第一次犯罪测谎仪得么准！',
    cover: 'https://via.placeholder.com/300x200/FFD700/FFFFFF?text=视频5',
    duration: '12:34',
    uploader: '十五里堡',
    playCount: '23万'
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

/* 移动端适配 */
@media (max-width: 768px) {
  .aspect-video {
    border-radius: 0;
  }
  
  .bg-black.rounded-lg {
    border-radius: 0;
    margin-bottom: 0;
  }
  
  /* 移动端视频控制栏优化 */
  .group:hover .group-hover\:opacity-100 {
    opacity: 1;
  }
  
  /* 触摸友好的进度条 */
  .touch-action-none {
    touch-action: none;
  }
  
  /* 移动端按钮大小调整 */
  .mobile-control-btn {
    min-width: 44px;
    min-height: 44px;
  }
  
  /* 移动端视频播放区域优化 */
  .aspect-video {
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    -webkit-user-select: none;
  }
  
  /* 移动端触摸优化 */
  video, img {
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
}

/* 进度条拖拽动画 */
.progress-bar {
  transition: transform 0.2s ease;
}

.progress-bar:active {
  transform: scaleY(1.5);
}

/* 控制栏渐显动画 */
.controls-fade {
  transition: opacity 0.3s ease-in-out;
}

/* 全屏模式样式 */
:fullscreen .aspect-video {
  aspect-ratio: unset;
  height: 100vh;
}

:fullscreen .bg-black.rounded-lg {
  border-radius: 0;
  height: 100vh;
}
</style>