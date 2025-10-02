<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 使用公用导航头组件 -->
    <NavHeader 
      :isLoggedIn="userStore.isLoggedIn" 
      :username="userStore.username" 
      @login="handleLogin"
    />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        <p class="mt-4 text-gray-600">视频加载中...</p>
      </div>
      
      <!-- 视频内容 -->
      <div v-else-if="video" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
              <button 
                @click="handleFollow"
                :class="[
                  'text-sm px-4 py-1 rounded-full transition-colors',
                  video.isFollowed 
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                    : 'bg-bilibili-primary text-white hover:bg-purple-700'
                ]"
              >
                {{ video.isFollowed ? '已关注' : '+ 关注' }}
              </button>
            </div>
          </div>
          
          <!-- 互动按钮 -->
          <div class="flex items-center space-x-4 mb-6">
            <button 
              @click="handleLike"
              :class="[
                'flex items-center space-x-2 px-4 py-2 rounded-full transition-colors',
                video.isLiked 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
              </svg>
              <span>{{ video.likes || 0 }}</span>
            </button>
            
            <button class="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              <span>{{ video.comments || 0 }}</span>
            </button>
            
            <button class="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
              </svg>
              <span>{{ video.shares || 0 }}</span>
            </button>
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

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const videoId = ref(route.params.id as string)
const videoPlayer = ref<HTMLVideoElement | null>(null)
const loading = ref(false)

// Mock 视频数据
const video = ref(null)
const recommendedVideos = ref([])

// 获取 Mock 视频详情
const getMockVideoDetail = (id: string) => {
  return {
    id: id,
    title: `精彩视频内容 - ${id}`,
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    poster: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80',
    views: '1.2M',
    publishedAt: '2天前',
    author: '创作者名称',
    authorAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    description: '这是一个精彩的视频内容，展示了令人惊叹的画面和故事。视频制作精良，内容丰富，值得观看和分享。在这个视频中，您将看到精美的画面、动人的故事情节，以及专业的制作水准。',
    tags: ['精彩', '推荐', '热门', '必看'],
    likes: 8520,
    comments: 156,
    shares: 89,
    isLiked: false,
    isFollowed: false
  }
}

// 获取 Mock 推荐视频
const getMockRecommendedVideos = () => {
  return [
    {
      id: '2',
      title: '另一个精彩视频',
      poster: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=600&q=80',
      author: '音乐创作者',
      views: '890K'
    },
    {
      id: '3',
      title: '街头艺术表演',
      poster: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
      author: '街头艺术家',
      views: '3.5M'
    },
    {
      id: '4',
      title: '电子音乐混音',
      poster: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
      author: 'DJ制作人',
      views: '450K'
    },
    {
      id: '5',
      title: '自然风光纪录片',
      poster: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80',
      author: '自然频道',
      views: '1.1M'
    }
  ]
}

// 处理登录
const handleLogin = () => {
  router.push('/login')
}

// 获取视频详情和推荐视频
const fetchVideoData = async () => {
  if (!videoId.value) return
  
  loading.value = true
  try {
    // 模拟 API 延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 使用 Mock 数据
    video.value = getMockVideoDetail(videoId.value)
    recommendedVideos.value = getMockRecommendedVideos()
    
  } catch (error: any) {
    console.error('获取视频数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 跳转到视频详情页
const goToVideo = (id: string) => {
  router.push({ name: 'videoDetail', params: { id } })
}

// 处理视频加载
const handleVideoLoad = () => {
  console.log('视频开始加载')
}

// 播放视频
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

// 关注/取消关注
const handleFollow = async () => {
  if (!video.value) return
  
  try {
    video.value.isFollowed = !video.value.isFollowed
    console.log(video.value.isFollowed ? '关注成功' : '取消关注成功')
  } catch (error: any) {
    console.error('操作失败:', error.message || '操作失败')
  }
}

// 点赞/取消点赞
const handleLike = async () => {
  if (!video.value) return
  
  try {
    video.value.isLiked = !video.value.isLiked
    video.value.likes += video.value.isLiked ? 1 : -1
    console.log(video.value.isLiked ? '点赞成功' : '取消点赞成功')
  } catch (error: any) {
    console.error('操作失败:', error.message || '操作失败')
  }
}

// 监听路由变化
watch(() => route.params.id, async (newId) => {
  if (newId && newId !== videoId.value) {
    videoId.value = newId as string
    window.scrollTo(0, 0)
    await fetchVideoData()
    
    // 等待DOM更新后尝试播放视频
    await nextTick()
    setTimeout(() => {
      playVideo()
    }, 500)
  }
})

// 组件挂载时加载数据
onMounted(async () => {
  await fetchVideoData()
  
  // 尝试播放视频
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

/* 添加缺失的样式类 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.bg-bilibili-primary {
  background-color: #00a1d6;
}

.bg-bilibili-primary:hover {
  background-color: #0085b3;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .grid-cols-1.lg\\:grid-cols-3 {
    grid-template-columns: 1fr;
  }
}
</style>