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
        <div v-else-if="video" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left side: Video Player and Info -->
          <div class="lg:col-span-2">
            <!-- 视频播放器 -->
            <div class="w-full bg-black mb-6 shadow-2xl rounded-lg overflow-hidden">
              <div class="relative aspect-video w-full overflow-hidden">
                <video 
                  ref="videoPlayer"
                  :src="video.src" 
                  :poster="video.poster" 
                  class="absolute inset-0 w-full h-full object-contain bg-black cursor-pointer"
                  @click="togglePlay"
                ></video>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
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

// 路由
const route = useRoute()
const videoId = route.params.id as string

// 方法
const handleLogin = () => {
  // 登录处理逻辑
  console.log('登录处理')
}

const togglePlay = () => {
  if (videoPlayer.value) {
    if (videoPlayer.value.paused) {
      videoPlayer.value.play()
    } else {
      videoPlayer.value.pause()
    }
  }
}

const fetchVideoData = async () => {
  loading.value = true
  videoError.value = false
  
  try {
    // 模拟API调用
    // 实际应用中应该调用真实的API获取视频数据
    console.log(`获取视频ID: ${videoId}的数据`)
    
    // 模拟数据
    video.value = {
      id: videoId,
      title: '示例视频',
      src: 'https://example.com/sample-video.mp4', // 替换为真实视频URL
      poster: 'https://example.com/video-poster.jpg', // 替换为真实封面URL
      // 其他视频信息
    }
  } catch (error) {
    videoError.value = true
    errorMessage.value = '视频加载失败，请稍后重试'
    console.error('视频加载错误:', error)
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(() => {
  fetchVideoData()
})
</script>

<style scoped>
/* 基本样式 */
.bg-bilibili-primary {
  background-color: #FB7299;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .grid-cols-1 {
    display: block;
  }
}
</style>