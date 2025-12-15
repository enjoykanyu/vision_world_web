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

    <!-- 用户主页内容 -->
    <main class="max-w-screen-xl mx-auto px-4 py-8">
      <!-- 用户信息卡片 -->
      <div class="relative rounded-2xl overflow-hidden shadow-2xl mb-8 group">
        <!-- 背景图片 -->
        <img src="https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=1471&q=80" alt="User Banner" class="w-full h-56 md:h-72 object-cover transition-transform duration-500 group-hover:scale-105">
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

        <!-- Glassmorphism 用户信息卡片 -->
        <div class="absolute bottom-0 left-0 right-0 p-6 flex flex-col md:flex-row items-center glass-card">
          <!-- 头像 -->
          <div class="relative -mt-24 md:-mt-16 flex-shrink-0">
            <img :src="userAvatar" alt="User Avatar" class="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-gray-800/50 shadow-lg avatar-glow">
          </div>

          <!-- 用户信息 -->
          <div class="md:ml-6 mt-4 md:mt-0 text-center md:text-left flex-grow">
            <h1 class="text-2xl md:text-3xl font-bold text-white tracking-wider">{{ userStore.username || '用户' }}</h1>
            <p class="text-sm text-blue-300 font-mono mt-1">UID: {{ userStore.userId }}</p>
            <div class="mt-4 flex items-center justify-center md:justify-start space-x-6 text-sm">
              <span class="flex flex-col items-center">
                <span class="font-bold text-lg text-white">{{ userStats.following }}</span>
                <span class="text-gray-400">关注</span>
              </span>
              <span class="flex flex-col items-center">
                <span class="font-bold text-lg text-white">{{ userStats.followers }}</span>
                <span class="text-gray-400">粉丝</span>
              </span>
              <span class="flex flex-col items-center">
                <span class="font-bold text-lg text-white">{{ userStats.likes }}</span>
                <span class="text-gray-400">获赞</span>
              </span>
            </div>
          </div>
          
          <!-- 操作按钮 -->
          <div class="mt-6 md:mt-0 flex items-center space-x-3 flex-shrink-0">
            <button class="follow-button">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"></path></svg>
              关注
            </button>
            <button class="share-button">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- 内容导航栏 -->
      <div class="mb-8 flex justify-center">
        <div class="glass-tab-container p-1 flex space-x-1">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="['tab-segment', { 'active': activeTab === tab.id }]"
          >
            <span>{{ tab.name }}</span>
            <span class="tab-count">{{ tab.count }}</span>
          </button>
        </div>
      </div>
      
      <!-- 视频列表 -->
      <div v-if="activeTab === 'videos'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="video in userVideos" :key="video.id"
             class="video-card group"
             @click="router.push(`/video/${video.id}`)">
          <div class="relative aspect-video overflow-hidden rounded-lg">
            <img :src="video.cover" :alt="video.title" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110">
            <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <svg class="w-12 h-12 text-white/80" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg>
            </div>
            <div class="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-mono">
              {{ video.duration }}
            </div>
          </div>
          <div class="p-3">
            <h3 class="font-semibold text-gray-100 mb-2 line-clamp-2">{{ video.title }}</h3>
            <div class="flex items-center justify-between text-xs text-gray-400">
              <span>{{ video.uploadTime }}</span>
              <div class="flex items-center space-x-3">
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                  {{ video.playCount }}
                </span>
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>
                  {{ video.danmaku }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <!-- 登录弹窗 (样式保持不变) -->
    <div v-if="showLoginModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-bilibili-xl w-96 p-6 shadow-bilibili-xl" @click.stop>
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
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">手机号</label>
            <input type="tel" id="phone" v-model="loginForm.phone" class="w-full px-3 py-2 border border-bilibili-gray-200 rounded-bilibili-md focus:outline-none focus:ring-2 focus:ring-bilibili-primary focus:border-bilibili-primary" placeholder="请输入手机号">
          </div>
          <div class="mb-4">
            <label for="verificationCode" class="block text-sm font-medium text-gray-700 mb-1">验证码</label>
            <div class="flex space-x-3">
              <input type="text" id="verificationCode" v-model="loginForm.code" class="flex-1 px-3 py-2 border border-bilibili-gray-200 rounded-bilibili-md focus:outline-none focus:ring-2 focus:ring-bilibili-primary focus:border-bilibili-primary" placeholder="请输入验证码">
              <button 
                @click="sendVerificationCode" 
                :disabled="isSendingCode || countdown > 0"
                class="px-4 py-2 bg-bilibili-primary hover:bg-bilibili-primary-dark text-white rounded-bilibili-md text-sm font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ countdown > 0 ? `${countdown}秒后重试` : '发送验证码' }}
              </button>
            </div>
          </div>
          <div v-if="loginError" class="mb-4 text-sm text-red-500">{{ loginError }}</div>
          <button @click="handleLogin" class="w-full bg-bilibili-primary hover:bg-bilibili-primary-dark text-white py-2 rounded-bilibili-md font-medium transition-colors duration-300">登录</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import NavHeader from '../components/NavHeader.vue'
import { useUserStore } from '../stores/userStore'

// 使用全局用户状态
const userStore = useUserStore()

// 计算用户头像
const userAvatar = computed(() => {
  return userStore.avatar || `https://i.pravatar.cc/150?u=${userStore.userId}`
})

// 深色模式状态
const isDarkMode = ref(true) // 默认为深色模式
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
const loginForm = ref({ phone: '', code: '' })
const loginError = ref('')
const isSendingCode = ref(false)
const countdown = ref(0)

const handleLogin = async () => {
  if (!loginForm.value.phone || !loginForm.value.code) {
    loginError.value = '请输入手机号和验证码'
    return
  }

  try {
    await userStore.login({
      phone: loginForm.value.phone,
      verificationCode: loginForm.value.code
    })
    showLoginModal.value = false
    loginError.value = ''
    loginForm.value = { phone: '', code: '' }
  } catch (error) {
    loginError.value = '登录失败，请检查手机号和验证码'
  }
}

const sendVerificationCode = async () => {
  if (!loginForm.value.phone) {
    loginError.value = '请输入手机号'
    return
  }

  if (!/^1[3-9]\d{9}$/.test(loginForm.value.phone)) {
    loginError.value = '请输入正确的手机号'
    return
  }

  isSendingCode.value = true
  loginError.value = ''

  try {
    const result = await userStore.sendVerificationCode(loginForm.value.phone)
    if (result.success) {
      // 开始倒计时
      countdown.value = result.expireSeconds || 60
      const timer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
          clearInterval(timer)
        }
      }, 1000)
    } else {
      loginError.value = result.error || '发送验证码失败'
    }
  } catch (error) {
    loginError.value = '发送验证码失败'
  } finally {
    isSendingCode.value = false
  }
}

const closeLoginModal = () => {
  showLoginModal.value = false
  loginError.value = ''
  loginForm.value = { phone: '', code: '' }
  countdown.value = 0
}

const router = useRouter()
const activeTab = ref('videos')

const userStats = ref({
  following: 233,
  followers: '1.2万',
  likes: '8.6万'
})

const tabs = [
  { id: 'videos', name: '视频', count: 42 },
  { id: 'favorites', name: '收藏', count: 18 },
  { id: 'moments', name: '动态', count: 126 },
  { id: 'subscriptions', name: '订阅', count: 36 }
]

const userVideos = [
  { id: 1, title: '人工智能如何改变我们的未来生活', cover: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=300&q=80', duration: '15:42', uploadTime: '2周前', playCount: '102万', danmaku: '1.8万' },
  { id: 2, title: '2025年最受欢迎的十大游戏', cover: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=300&q=80', duration: '20:18', uploadTime: '1个月前', playCount: '78万', danmaku: '2.5万' },
  { id: 3, title: '现代流行音乐制作全攻略', cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=300&q=80', duration: '32:10', uploadTime: '3个月前', playCount: '45万', danmaku: '9800' },
  { id: 4, title: '量子计算机入门教程', cover: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=300&q=80', duration: '28:45', uploadTime: '4个月前', playCount: '32万', danmaku: '1.1万' }
]
</script>

<style scoped>
.glass-card {
  background: rgba(17, 24, 39, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid rgba(107, 114, 128, 0.3);
}

.avatar-glow {
  box-shadow: 0 0 15px 2px rgba(59, 130, 246, 0.5), 0 0 30px 5px rgba(129, 140, 248, 0.3);
  transition: box-shadow 0.3s ease-in-out;
}
.avatar-glow:hover {
  box-shadow: 0 0 20px 4px rgba(59, 130, 246, 0.7), 0 0 45px 8px rgba(129, 140, 248, 0.5);
}

.follow-button {
  @apply flex items-center bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30;
}

.share-button {
  @apply border border-gray-600 hover:bg-gray-700/50 text-gray-300 hover:text-white w-10 h-10 rounded-full text-sm flex items-center justify-center transition-all duration-300 transform hover:scale-105;
}

.glass-tab-container {
  background: rgba(31, 41, 55, 0.5); /* bg-gray-800/50 */
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 9999px; /* rounded-full */
  border: 1px solid rgba(55, 65, 81, 0.7); /* border-gray-700/70 */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
}

.tab-segment {
  @apply relative px-5 py-2.5 text-sm font-semibold text-gray-300 rounded-full transition-colors duration-300 ease-in-out flex items-center space-x-2;
}

.tab-segment:not(.active):hover {
  background-color: rgba(55, 65, 81, 0.5); /* bg-gray-700/50 */
}

.tab-segment.active {
  @apply bg-blue-500 text-white shadow-md;
}

.tab-count {
  @apply ml-2 min-w-[24px] px-1.5 py-0.5 text-xs font-mono rounded-full transition-colors duration-300;
  background-color: rgba(255, 255, 255, 0.1);
}

.tab-segment.active .tab-count {
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.video-card {
  @apply bg-gray-800/50 rounded-lg overflow-hidden transition-all duration-300 cursor-pointer;
  border: 1px solid transparent;
}
.video-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
  border-color: rgba(59, 130, 246, 0.5);
}

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