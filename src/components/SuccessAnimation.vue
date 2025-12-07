<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-500 scale-100 opacity-100 animate-bounce-in">
      <!-- 成功图标 -->
      <div class="flex justify-center mb-6">
        <div class="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center animate-pulse">
          <svg class="w-12 h-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      </div>
      
      <!-- 成功文字 -->
      <div class="text-center">
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">投稿成功！</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">视频已进入审核流程，审核通过后将在首页展示</p>
        
        <!-- 视频信息 -->
        <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
          <div class="flex items-center space-x-3">
            <div class="w-16 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden flex items-center justify-center">
              <svg class="w-8 h-8 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div class="flex-1">
              <div class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ videoTitle }}</div>
              <div class="text-xs text-green-600 dark:text-green-400">审核中</div>
            </div>
          </div>
        </div>
        
        <!-- 跳转提示 -->
        <div class="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400 mb-6">
          <span class="mr-2">即将跳转至</span>
          <span class="text-pink-500 dark:text-pink-400 font-medium">创作中心</span>
          <span class="ml-2">...</span>
        </div>
        
        <!-- 进度条 -->
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6 overflow-hidden">
          <div 
            class="bg-pink-500 h-full rounded-full transition-all duration-300" 
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="flex space-x-4">
          <button 
            @click="goToCenter"
            class="flex-1 px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            前往创作中心
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Props
const props = defineProps<{
  visible: boolean
  videoTitle?: string
}>()

// Emits
const emit = defineEmits<{
  close: []
}>()

// State
const progress = ref(0)
let progressInterval: number | null = null

// Watch visible prop
watch(() => props.visible, (newVal) => {
  if (newVal) {
    startProgress()
  } else {
    stopProgress()
  }
})

// Start progress animation
const startProgress = () => {
  progress.value = 0
  stopProgress()
  
  progressInterval = window.setInterval(() => {
    if (progress.value < 100) {
      progress.value += 1
    } else {
      stopProgress()
      // 自动跳转到创作中心
      setTimeout(() => {
        goToCenter()
      }, 500)
    }
  }, 30)
}

// Stop progress animation
const stopProgress = () => {
  if (progressInterval) {
    clearInterval(progressInterval)
    progressInterval = null
  }
}

// Go to creator center
const goToCenter = () => {
  stopProgress()
  emit('close')
  router.push('/manage/videos')
}

// Cleanup
onMounted(() => {
  if (props.visible) {
    startProgress()
  }
})
</script>

<style scoped>
@keyframes bounce-in {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
</style>