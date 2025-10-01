<template>
  <div class="min-h-screen bg-gray-900 text-gray-200 font-sans">
    <!-- 使用共用导航头组件 -->
    <NavHeader 
      :isLoggedIn="userStore.isLoggedIn" 
      :username="userStore.username" 
      @login="showLoginModal = true"
      @toggleDarkMode="toggleDarkMode"
      :is-dark-mode-prop="true"
    />

    <!-- 直播页面内容 -->
    <main class="max-w-screen-xl mx-auto px-4 py-8">
      <header class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-4xl font-bold text-white tracking-wider">正在直播</h1>
          <p class="text-lg text-gray-400 mt-2">探索充满活力的直播世界</p>
        </div>
        <button 
          @click="goToStreamSetup"
          class="start-streaming-btn group relative overflow-hidden"
        >
          <div class="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div class="relative z-10 flex items-center space-x-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
            </svg>
            <span class="font-semibold">开始直播</span>
          </div>
        </button>
      </header>

      <!-- 直播列表 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="stream in liveStreams" :key="stream.id"
             class="live-card group"
             @click="goToLiveRoom(stream.id)">
          <div class="relative aspect-video overflow-hidden rounded-lg">
            <img :src="stream.cover" :alt="stream.title" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110">
            
            <div class="absolute top-2 left-2">
              <span class="live-badge">LIVE</span>
            </div>

            <div class="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent flex justify-between items-center">
              <div class="flex items-center">
                <svg class="w-4 h-4 text-white mr-1.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.523 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path></svg>
                <span class="text-white text-sm font-semibold">{{ stream.viewers }}</span>
              </div>
            </div>
            
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <svg class="w-14 h-14 text-white/80" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg>
            </div>
          </div>
          
          <div class="flex items-start mt-4">
            <img :src="stream.streamer.avatar" :alt="stream.streamer.name" class="w-10 h-10 rounded-full object-cover flex-shrink-0">
            <div class="ml-3">
              <h3 class="font-semibold text-gray-100 mb-1 line-clamp-1 group-hover:text-blue-400 transition-colors">{{ stream.title }}</h3>
              <p class="text-sm text-gray-400">{{ stream.streamer.name }}</p>
              <span class="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full mt-1 inline-block">{{ stream.category }}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import NavHeader from '../components/NavHeader.vue'
import { useUserStore } from '../stores/userStore'

const router = useRouter()
const userStore = useUserStore()

// 登录和深色模式相关 (假设已在NavHeader中处理)
const showLoginModal = ref(false)
const isDarkMode = ref(true)
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  // ...
}

// 模拟直播数据
const liveStreams = ref([
  {
    id: 'live-1',
    title: '赛博朋克2077：夜之城深度探索',
    cover: 'https://images.unsplash.com/photo-1605098195882-b6819b8555b6?auto=format&fit=crop&w=600&q=80',
    viewers: '1.2万',
    streamer: {
      name: 'V',
      avatar: 'https://i.pravatar.cc/150?u=v'
    },
    category: '游戏'
  },
  {
    id: 'live-2',
    title: '深夜编码：用Vue和Three.js构建3D网页',
    cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    viewers: '8.6千',
    streamer: {
      name: 'CodeWizard',
      avatar: 'https://i.pravatar.cc/150?u=codewizard'
    },
    category: '科技'
  },
  {
    id: 'live-3',
    title: '东京街头摄影第一视角',
    cover: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=600&q=80',
    viewers: '2.3万',
    streamer: {
      name: 'TokyoExplorer',
      avatar: 'https://i.pravatar.cc/150?u=tokyo'
    },
    category: '生活'
  },
  {
    id: 'live-4',
    title: '电子音乐制作：从零到一创作一首Lo-Fi',
    cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&q=80',
    viewers: '5.1千',
    streamer: {
      name: 'BeatMaker',
      avatar: 'https://i.pravatar.cc/150?u=beatmaker'
    },
    category: '音乐'
  },
  {
    id: 'live-5',
    title: '健身挑战：1小时高强度间歇训练',
    cover: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
    viewers: '9.8千',
    streamer: {
      name: 'FitLife',
      avatar: 'https://i.pravatar.cc/150?u=fitlife'
    },
    category: '运动'
  },
  {
    id: 'live-6',
    title: '数字绘画：创作一幅未来城市插画',
    cover: 'https://images.unsplash.com/photo-1534237716524-7319a3a9b132?auto=format&fit=crop&w=600&q=80',
    viewers: '1.5万',
    streamer: {
      name: 'ArtStation',
      avatar: 'https://i.pravatar.cc/150?u=art'
    },
    category: '绘画'
  },
  {
    id: 'live-7',
    title: '美食烹饪：在家制作米其林级牛排',
    cover: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=600&q=80',
    viewers: '2.1万',
    streamer: {
      name: 'ChefMaster',
      avatar: 'https://i.pravatar.cc/150?u=chef'
    },
    category: '美食'
  },
  {
    id: 'live-8',
    title: '虚拟现实旅行：探索冰岛的奇幻风光',
    cover: 'https://images.unsplash.com/photo-1500049242042-739925941883?auto=format&fit=crop&w=600&q=80',
    viewers: '7.2千',
    streamer: {
      name: 'VRTraveler',
      avatar: 'https://i.pravatar.cc/150?u=vr'
    },
    category: '虚拟现实'
  }
])

const goToLiveRoom = (id: string) => {
  // 实际应用中会跳转到具体的直播间页面
  console.log(`Navigating to live room: ${id}`)
  // router.push(`/live/${id}`)
}

const goToStreamSetup = () => {
  router.push('/stream-setup')
}
</script>

<style scoped>
.live-card {
  @apply bg-gray-800/50 rounded-lg overflow-hidden transition-all duration-300 cursor-pointer;
  border: 1px solid transparent;
}
.live-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
  border-color: rgba(59, 130, 246, 0.5);
}

.live-badge {
  @apply bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md tracking-wider;
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.7);
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.start-streaming-btn {
  @apply bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg;
}
.start-streaming-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.4);
}
</style>