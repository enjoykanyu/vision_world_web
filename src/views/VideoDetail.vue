<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 - 复用BilibiliStyle.vue的导航栏 -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-screen-xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center space-x-8">
            <div class="flex items-center">
              <svg class="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.51.556-2.764 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.920-.373.347 0 .653.124.920.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .160-.213l2.853-2.747c.267-.249.573-.373.920-.373.347 0 .662.151.929.400.267.249.391.551.391.907 0 .356-.124.657-.373.906l-1.174 1.120zM5.333 7.24c-.746.018-1.373.276-1.880.773-.506.498-.769 1.13-.789 1.894v7.52c.02.764.283 1.395.789 1.893.507.498 1.134.756 1.880.773h13.334c.746-.017 1.373-.275 1.880-.773.506-.498.769-1.129.789-1.893v-7.52c-.02-.765-.283-1.396-.789-1.894-.507-.497-1.134-.755-1.880-.773H5.333z"/>
              </svg>
              <span class="ml-2 text-xl font-bold text-gray-900">bilibili</span>
            </div>
            
            <!-- 主导航 -->
            <nav class="hidden md:flex items-center space-x-6 text-sm">
              <router-link to="/bilibili" class="text-blue-500 font-medium">首页</router-link>
              <a href="#" class="text-gray-600 hover:text-blue-500">番剧</a>
              <a href="#" class="text-gray-600 hover:text-blue-500">直播</a>
              <a href="#" class="text-gray-600 hover:text-blue-500">游戏中心</a>
            </nav>
          </div>

          <!-- 搜索和用户 -->
          <div class="flex items-center space-x-4">
            <!-- 搜索框 -->
            <div class="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-80">
              <input type="text" placeholder="搜索视频、番剧、UP主..." class="bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm flex-1">
              <svg class="w-4 h-4 text-gray-400 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            
            <!-- 用户头像 -->
            <div 
              class="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center cursor-pointer"
              @click="handleUserIconClick"
            >
              <span class="text-white text-sm font-semibold">{{ isLoggedIn ? username.charAt(0).toUpperCase() : 'U' }}</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="max-w-screen-xl mx-auto px-4 py-6">
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- 左侧视频区域 -->
        <div class="lg:w-9/12">
          <!-- 视频播放器 -->
          <div class="bg-black rounded-lg overflow-hidden mb-4">
            <div class="aspect-video relative">
              <img 
                :src="videoData.cover" 
                :alt="videoData.title" 
                class="w-full h-full object-cover"
              >
              <!-- 播放按钮 -->
              <div class="absolute inset-0 flex items-center justify-center">
                <button class="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-300">
                  <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
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
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const videoId = ref(route.params.id)

// 登录状态管理
const isLoggedIn = ref(false)
const username = ref('')
const showLoginModal = ref(false)
const loginForm = ref({
  username: '',
  password: ''
})
const loginError = ref('')

// 处理用户头像点击
const handleUserIconClick = () => {
  if (!isLoggedIn.value) {
    showLoginModal.value = true
  } else {
    console.log('用户已登录，显示用户菜单')
  }
}

// 处理登录
const handleLogin = () => {
  if (loginForm.value.username && loginForm.value.password) {
    if (loginForm.value.password === '123456') {
      isLoggedIn.value = true
      username.value = loginForm.value.username
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

// 视频数据
const videoData = ref({
  id: videoId.value,
  title: 'B站唯一一次得最高Claude Code人！AI编程能力测试',
  cover: 'https://via.placeholder.com/800x450/32CD32/FFFFFF?text=视频3',
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
</style>