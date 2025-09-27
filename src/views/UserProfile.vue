<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 使用共用导航头组件 -->
    <NavHeader 
      :isLoggedIn="userStore.isLoggedIn" 
      :username="userStore.username" 
      @login="showLoginModal = true"
      @toggleDarkMode="toggleDarkMode"
    />

    <!-- 用户主页内容 -->
    <main class="max-w-screen-xl mx-auto px-4 py-6">
      <!-- 用户信息卡片 -->
      <div class="bg-white rounded-lg overflow-hidden shadow-sm mb-6">
        <!-- 用户封面 -->
        <div class="relative h-48 md:h-64 bg-gradient-to-r from-blue-400 to-purple-500">
          <div class="absolute inset-0 bg-black opacity-20"></div>
          <button class="absolute right-4 bottom-4 bg-white/80 hover:bg-white text-gray-800 px-3 py-1 rounded text-sm">
            编辑资料
          </button>
        </div>
        
        <!-- 用户基本信息 -->
        <div class="relative px-6 py-4">
          <!-- 头像 -->
          <div class="absolute -top-16 left-6 w-24 h-24 md:w-28 md:h-28 bg-white rounded-full p-1 shadow-md">
            <div class="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <span class="text-white text-3xl font-bold">{{ userStore.username.charAt(0).toUpperCase() }}</span>
            </div>
          </div>
          
          <!-- 用户名和关注信息 -->
          <div class="ml-28 md:ml-32 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 class="text-xl md:text-2xl font-bold text-gray-900">{{ userStore.username }}</h1>
              <p class="text-sm text-gray-500">UID: {{ userStore.userId }}</p>
              <div class="mt-2 flex items-center space-x-4 text-sm">
                <span class="flex items-center">
                  <span class="font-medium text-gray-900">{{ userStats.following }}</span>
                  <span class="ml-1 text-gray-600">关注</span>
                </span>
                <span class="flex items-center">
                  <span class="font-medium text-gray-900">{{ userStats.followers }}</span>
                  <span class="ml-1 text-gray-600">粉丝</span>
                </span>
                <span class="flex items-center">
                  <span class="font-medium text-gray-900">{{ userStats.likes }}</span>
                  <span class="ml-1 text-gray-600">获赞</span>
                </span>
              </div>
            </div>
            
            <div class="mt-4 md:mt-0 flex items-center space-x-3">
              <button class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium">
                + 关注
              </button>
              <button class="border border-gray-300 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-full text-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <!-- 个人签名 -->
          <div class="mt-6 text-sm text-gray-600">
            <p>{{ userInfo.bio || '这个人很懒，什么都没有写~' }}</p>
          </div>
        </div>
      </div>
      
      <!-- 内容导航栏 -->
      <div class="bg-white rounded-lg shadow-sm mb-6">
        <div class="flex overflow-x-auto scrollbar-hide">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="['px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
                    activeTab === tab.id 
                      ? 'border-blue-500 text-blue-500' 
                      : 'border-transparent text-gray-600 hover:text-gray-900']"
          >
            {{ tab.name }}
            <span class="ml-1 text-xs text-gray-500">{{ tab.count }}</span>
          </button>
        </div>
      </div>
      
      <!-- 视频列表 -->
      <div v-if="activeTab === 'videos'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div v-for="video in userVideos" :key="video.id"
             class="bg-white rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
             @click="router.push(`/video/${video.id}`)">
          <div class="relative aspect-video">
            <img :src="video.cover" :alt="video.title" class="w-full h-full object-cover">
            <div class="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
              {{ video.duration }}
            </div>
          </div>
          <div class="p-3">
            <h3 class="text-sm font-medium text-gray-800 mb-2 line-clamp-2">{{ video.title }}</h3>
            <div class="flex items-center justify-between text-xs text-gray-500">
              <span>{{ video.uploadTime }}</span>
              <div class="flex items-center space-x-2">
                <span class="flex items-center">
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clip-rule="evenodd"/>
                  </svg>
                  {{ video.playCount }}
                </span>
                <span class="flex items-center">
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"/>
                  </svg>
                  {{ video.danmaku }}
                </span>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
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

// 登录相关
const showLoginModal = ref(false)
const loginForm = ref({
  username: '',
  password: ''
})
const loginError = ref('')

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

const router = useRouter()
const showMobileMenu = ref(false)
const activeTab = ref('videos')

// 用户信息 - 使用全局状态
const userInfo = ref({
  bio: '哔哩哔哩 (゜-゜)つロ 干杯~'
})

// 用户统计
const userStats = ref({
  following: 233,
  followers: '1.2万',
  likes: '8.6万'
})

// 标签页
const tabs = [
  { id: 'videos', name: '视频', count: 42 },
  { id: 'favorites', name: '收藏', count: 18 },
  { id: 'moments', name: '动态', count: 126 },
  { id: 'subscriptions', name: '订阅', count: 36 }
]

// 用户视频
const userVideos = [
  {
    id: 101,
    title: '【原神】3.0版本全任务攻略合集',
    cover: 'https://via.placeholder.com/300x200/FF69B4/FFFFFF?text=原神攻略',
    duration: '18:24',
    uploadTime: '2周前',
    playCount: '12.5万',
    danmaku: '3452'
  },
  {
    id: 102,
    title: '5分钟学会Vue3的10个实用技巧',
    cover: 'https://via.placeholder.com/300x200/4169E1/FFFFFF?text=Vue3技巧',
    duration: '05:16',
    uploadTime: '1个月前',
    playCount: '8.7万',
    danmaku: '1024'
  },
  {
    id: 103,
    title: '2025年值得关注的十大科技趋势',
    cover: 'https://via.placeholder.com/300x200/32CD32/FFFFFF?text=科技趋势',
    duration: '12:42',
    uploadTime: '3个月前',
    playCount: '32.1万',
    danmaku: '5689'
  },
  {
    id: 104,
    title: '自制超简单美味的日式咖喱饭',
    cover: 'https://via.placeholder.com/300x200/FF4500/FFFFFF?text=咖喱饭',
    duration: '08:37',
    uploadTime: '4个月前',
    playCount: '15.3万',
    danmaku: '2341'
  }
]

// 切换移动端菜单
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>