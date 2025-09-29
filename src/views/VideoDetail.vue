<template>
  <div class="min-h-screen bg-gray-50">
    <NavHeader 
      :isLoggedIn="userStore.isLoggedIn" 
      :username="userStore.username" 
      @login="showLoginModal = true"
    />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="video" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left side: Video Player and Info -->
        <div class="lg:col-span-2">
          <div class="aspect-w-16 aspect-h-9 mb-4">
            <video 
              ref="videoPlayer"
              :src="video.src" 
              :poster="video.poster" 
              controls 
              autoplay
              class="w-full rounded-lg shadow-lg"
              @loadstart="handleVideoLoad"
            ></video>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ video.title }}</h1>
          <div class="flex items-center text-sm text-gray-500 mb-4">
            <span>{{ video.views }} 观看</span>
            <span class="mx-2">·</span>
            <span>{{ video.publishedAt }}</span>
          </div>
          <div class="flex items-center mb-6">
            <img :src="video.authorAvatar" alt="author" class="w-12 h-12 rounded-full mr-4">
            <div>
              <p class="font-semibold text-gray-800">{{ video.author }}</p>
              <button class="text-sm bg-bilibili-primary text-white px-4 py-1 rounded-full">+ 关注</button>
            </div>
          </div>
          <p class="text-gray-700 leading-relaxed">{{ video.description }}</p>
          <div class="mt-4">
            <span v-for="tag in video.tags" :key="tag" class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{{ tag }}</span>
          </div>
        </div>

        <!-- Right side: Recommended Videos -->
        <div class="lg:col-span-1">
          <h2 class="text-xl font-bold text-gray-900 mb-4">推荐视频</h2>
          <div class="space-y-4">
            <div v-for="recVideo in recommendedVideos" :key="recVideo.id" class="flex items-start space-x-4 cursor-pointer" @click="goToVideo(recVideo.id)">
              <div class="w-32 flex-shrink-0">
                <img :src="recVideo.poster" :alt="recVideo.title" class="rounded-lg aspect-video object-cover">
              </div>
              <div>
                <h3 class="text-sm font-semibold text-gray-800 leading-tight mb-1">{{ recVideo.title }}</h3>
                <p class="text-xs text-gray-500">{{ recVideo.author }}</p>
                <p class="text-xs text-gray-500">{{ recVideo.views }} 观看</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-20">
        <h1 class="text-2xl text-gray-600">视频加载中或未找到...</h1>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavHeader from '../components/NavHeader.vue'
import { useUserStore } from '../stores/userStore'
import { mockVideos, type Video } from '../stores/mockVideos'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const videoId = ref(route.params.id as string)
const showLoginModal = ref(false)
const videoPlayer = ref<HTMLVideoElement | null>(null)

const video = computed(() => {
  return mockVideos.find(v => v.id === videoId.value)
})

const recommendedVideos = computed(() => {
  return mockVideos.filter(v => v.id !== videoId.value).slice(0, 5)
})

const goToVideo = (id: string) => {
  router.push({ name: 'videoDetail', params: { id } })
}

const handleVideoLoad = () => {
  // 视频开始加载时的处理
  console.log('视频开始加载')
}

const playVideo = async () => {
  if (videoPlayer.value) {
    try {
      await videoPlayer.value.play()
      console.log('视频开始播放')
    } catch (error) {
      console.log('自动播放被阻止，用户需要手动点击播放:', error)
    }
  }
}

// 监听路由变化，切换视频时自动播放
watch(() => route.params.id, async (newId) => {
  videoId.value = newId as string
  window.scrollTo(0, 0)
  
  // 等待DOM更新后尝试播放视频
  await nextTick()
  setTimeout(() => {
    playVideo()
  }, 500) // 给视频一些时间加载
})

// 组件挂载时尝试播放视频
onMounted(() => {
  setTimeout(() => {
    playVideo()
  }, 500)
})
</script>

<style scoped>
.aspect-w-16 {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
}
.aspect-h-9 {
  /* This class is a companion for aspect-w-16 */
}
.aspect-video {
    aspect-ratio: 16 / 9;
}
video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>