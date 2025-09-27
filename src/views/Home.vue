<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- 使用共用导航头组件 -->
    <NavHeader 
      :isLoggedIn="userStore.isLoggedIn" 
      :username="userStore.username" 
      @login="showLoginModal = true"
      @toggleDarkMode="toggleDarkMode"
    />

    <!-- 主要内容区域 -->
    <main class="relative">
      <!-- 英雄区域 -->
      <section class="relative py-20 lg:py-32 overflow-hidden">
        <!-- 背景装饰 -->
        <div class="absolute inset-0">
          <div class="absolute top-20 left-10 w-72 h-72 bg-bilibili-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div class="absolute bottom-20 right-10 w-96 h-96 bg-bilibili-secondary/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-bilibili-primary/5 to-bilibili-secondary/5 rounded-full blur-2xl"></div>
        </div>
        
        <!-- 浮动元素 -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div v-for="i in 12" :key="i" 
               class="absolute animate-float opacity-20"
               :style="{
                 left: Math.random() * 100 + '%',
                 top: Math.random() * 100 + '%',
                 animationDelay: Math.random() * 6 + 's',
                 animationDuration: (Math.random() * 4 + 6) + 's'
               }">
            <div class="w-3 h-3 bg-gradient-to-br from-bilibili-primary to-bilibili-secondary rounded-full shadow-lg"></div>
          </div>
        </div>

        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <!-- 主标题 -->
          <div class="mb-12 animate-fade-in">
            <h1 class="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
              <span class="bg-gradient-to-r from-bilibili-primary via-purple-500 to-bilibili-secondary bg-clip-text text-transparent animate-glow">
                Vision World
              </span>
            </h1>
            <p class="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              体验 <span class="text-bilibili-primary font-semibold">哔哩哔哩</span> 风格UI设计，
              感受二次元文化的无限魅力与创意灵感
            </p>
            <div class="flex items-center justify-center space-x-2 mb-8">
              <div class="w-2 h-2 bg-bilibili-primary rounded-full animate-pulse"></div>
              <div class="w-16 h-0.5 bg-gradient-to-r from-bilibili-primary to-bilibili-secondary rounded-full"></div>
              <div class="w-2 h-2 bg-bilibili-secondary rounded-full animate-pulse" style="animation-delay: 0.5s"></div>
            </div>
          </div>

          <!-- 特色标签 -->
          <div class="flex flex-wrap items-center justify-center gap-3 mb-16 animate-slide-up">
            <span v-for="tag in featureTags" :key="tag.name"
                  class="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-bilibili-primary/30 hover:text-bilibili-primary transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md">
              <component :is="tag.icon" class="w-4 h-4 mr-2"/>
              {{ tag.name }}
            </span>
          </div>
        </div>
      </section>

      <!-- 风格选择区域 -->
      <section class="py-16 lg:py-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- 区域标题 -->
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              选择你的 <span class="text-bilibili-primary">专属风格</span>
            </h2>
            <p class="text-lg text-gray-600 max-w-2xl mx-auto">
              每一种风格都是一次全新的视觉体验，探索属于你的数字世界
            </p>
          </div>

          <!-- 风格卡片网格 -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            <!-- B站风格卡片 -->
            <div @click="navigateToStyle('bilibili')"
                 class="group cursor-pointer animate-scale-in">
              <div class="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 border border-gray-100 hover:border-bilibili-primary/20 overflow-hidden">
                <!-- 背景装饰 -->
                <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-bilibili-primary/10 to-bilibili-secondary/10 rounded-full blur-2xl transform translate-x-8 -translate-y-8"></div>
                
                <!-- 图标区域 -->
                <div class="relative mb-6">
                  <div class="w-20 h-20 mx-auto bg-gradient-to-br from-bilibili-primary to-bilibili-secondary rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.51.556-2.764 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .356-.124.657-.373.906l-1.174 1.12zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.789 1.894v7.52c.02.764.283 1.395.789 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.789-1.893v-7.52c-.02-.765-.283-1.396-.789-1.894-.507-.497-1.134-.755-1.88-.773H5.333zM8 11.107c.373 0 .684.124.933.373.249.249.373.56.373.933v1.173c0 .373-.124.684-.373.933-.249.249-.56.373-.933.373s-.684-.124-.933-.373c-.249-.249-.373-.56-.373-.933V12.413c0-.373.124-.684.373-.933.249-.249.56-.373.933-.373zm8 0c.373 0 .684.124.933.373.249.249.373.56.373.933v1.173c0 .373-.124.684-.373.933-.249.249-.56.373-.933.373s-.684-.124-.933-.373c-.249-.249-.373-.56-.373-.933V12.413c0-.373.124-.684.373-.933.249-.249.56-.373.933-.373z"/>
                    </svg>
                  </div>
                  <!-- 热门标签 -->
                  <div class="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg animate-pulse">
                    热门
                  </div>
                </div>

                <!-- 内容区域 -->
                <div class="text-center">
                  <h3 class="text-2xl font-bold text-gray-900 mb-3 group-hover:text-bilibili-primary transition-colors duration-300">
                    哔哩哔哩风格
                  </h3>
                  <p class="text-gray-600 mb-6 leading-relaxed">
                    二次元文化聚集地，弹幕互动、UP主创作、番剧追番，体验年轻人的娱乐社区
                  </p>
                  
                  <!-- 特性标签 -->
                  <div class="flex flex-wrap gap-2 mb-6 justify-center">
                    <span class="px-3 py-1 bg-bilibili-primary/10 text-bilibili-primary text-xs rounded-full font-medium">弹幕互动</span>
                    <span class="px-3 py-1 bg-bilibili-secondary/10 text-bilibili-secondary text-xs rounded-full font-medium">二次元</span>
                    <span class="px-3 py-1 bg-purple-100 text-purple-600 text-xs rounded-full font-medium">创作社区</span>
                  </div>

                  <!-- 按钮 -->
                  <button class="w-full bg-gradient-to-r from-bilibili-primary to-bilibili-secondary text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center group">
                    <span>立即体验</span>
                    <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- 视频智能分析助手卡片 -->
            <div @click="navigateToStyle('video-assistant')"
                 class="group cursor-pointer animate-scale-in" style="animation-delay: 0.1s">
              <div class="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 border border-gray-100 hover:border-purple-200 overflow-hidden">
                <!-- 背景装饰 -->
                <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-full blur-2xl transform translate-x-8 -translate-y-8"></div>
                
                <!-- 图标区域 -->
                <div class="relative mb-6">
                  <div class="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                    </svg>
                  </div>
                  <!-- AI标签 -->
                  <div class="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg">
                    AI
                  </div>
                </div>

                <!-- 内容区域 -->
                <div class="text-center">
                  <h3 class="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                    视频智能分析
                  </h3>
                  <p class="text-gray-600 mb-6 leading-relaxed">
                    AI驱动的视频内容分析工具，提供专业的智能解析、数据洞察和优化建议
                  </p>
                  
                  <!-- 特性标签 -->
                  <div class="flex flex-wrap gap-2 mb-6 justify-center">
                    <span class="px-3 py-1 bg-purple-100 text-purple-600 text-xs rounded-full font-medium">智能分析</span>
                    <span class="px-3 py-1 bg-indigo-100 text-indigo-600 text-xs rounded-full font-medium">数据洞察</span>
                    <span class="px-3 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-medium">AI助手</span>
                  </div>

                  <!-- 按钮 -->
                  <button class="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center group">
                    <span>立即体验</span>
                    <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- 即将推出卡片 -->
            <div class="group cursor-not-allowed animate-scale-in" style="animation-delay: 0.2s">
              <div class="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 shadow-lg border border-gray-200 overflow-hidden opacity-75">
                <!-- 背景装饰 -->
                <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-300/20 to-gray-400/20 rounded-full blur-2xl transform translate-x-8 -translate-y-8"></div>
                
                <!-- 图标区域 -->
                <div class="relative mb-6">
                  <div class="w-20 h-20 mx-auto bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
                    </svg>
                  </div>
                  <!-- 即将推出标签 -->
                  <div class="absolute -top-2 -right-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg">
                    敬请期待
                  </div>
                </div>

                <!-- 内容区域 -->
                <div class="text-center">
                  <h3 class="text-2xl font-bold text-gray-700 mb-3">
                    更多风格
                  </h3>
                  <p class="text-gray-500 mb-6 leading-relaxed">
                    抖音、小红书、微博等更多平台风格正在开发中，敬请期待...
                  </p>
                  
                  <!-- 特性标签 -->
                  <div class="flex flex-wrap gap-2 mb-6 justify-center">
                    <span class="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full font-medium">抖音风格</span>
                    <span class="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full font-medium">小红书</span>
                    <span class="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full font-medium">微博</span>
                  </div>

                  <!-- 按钮 -->
                  <button disabled class="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-xl font-medium cursor-not-allowed">
                    敬请期待
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 特性展示区域 -->
      <section class="py-16 lg:py-24 bg-gradient-to-r from-bilibili-primary/5 via-purple-50 to-bilibili-secondary/5">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              为什么选择 <span class="text-bilibili-primary">Vision World</span>
            </h2>
            <p class="text-lg text-gray-600 max-w-2xl mx-auto">
              我们致力于为开发者和设计师提供最优质的UI风格体验
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div v-for="(feature, index) in features" :key="feature.title"
                 class="text-center animate-fade-in"
                 :style="{ animationDelay: index * 0.1 + 's' }">
              <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-bilibili-primary/10 to-bilibili-secondary/10 rounded-2xl flex items-center justify-center">
                <component :is="feature.icon" class="w-8 h-8 text-bilibili-primary"/>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ feature.title }}</h3>
              <p class="text-gray-600 text-sm leading-relaxed">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- 登录弹窗 -->
    <div v-if="showLoginModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg w-96 p-6 shadow-xl" @click.stop>
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-gray-800">登录</h3>
          <button @click="showLoginModal = false" class="text-gray-500 hover:text-gray-700">
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

    <!-- 底部区域 -->
    <footer class="bg-white border-t border-gray-100 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="flex items-center justify-center space-x-2 mb-4">
          <div class="w-8 h-8 bg-gradient-to-br from-bilibili-primary to-bilibili-secondary rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">V</span>
          </div>
          <span class="text-xl font-bold bg-gradient-to-r from-bilibili-primary to-bilibili-secondary bg-clip-text text-transparent">
            Vision World
          </span>
        </div>
        <p class="text-gray-500 text-sm mb-6">
          探索视觉世界，感受设计之美 · 让每一次交互都充满惊喜
        </p>
        <div class="flex items-center justify-center space-x-6 text-sm text-gray-400">
          <span>© 2024 Vision World</span>
          <span>·</span>
          <span>用心设计，用爱创造</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import { useRouter } from 'vue-router'
import NavHeader from '../components/NavHeader.vue'
import { useUserStore } from '../stores/userStore'

const router = useRouter()

/** 全局用户状态 */
const userStore = useUserStore()

/** 深色模式（供 NavHeader 触发） */
const isDarkMode = ref(false)
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

/** 登录弹窗与登录逻辑（使用全局 userStore） */
const showLoginModal = ref(false)
const loginForm = ref({ username: '', password: '' })
const loginError = ref('')

const handleLogin = () => {
  if (loginForm.value.username && loginForm.value.password) {
    if (loginForm.value.password === '123456') {
      userStore.login({
        username: loginForm.value.username,
        userId: '12345678'
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

const navigateToStyle = (style: string) => {
  router.push({ name: style })
}

// 特色标签数据
const featureTags = [
  {
    name: '响应式设计',
    icon: () => h('svg', { class: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' })
    ])
  },
  {
    name: '现代化UI',
    icon: () => h('svg', { class: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z' })
    ])
  },
  {
    name: '流畅动画',
    icon: () => h('svg', { class: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M13 10V3L4 14h7v7l9-11h-7z' })
    ])
  },
  {
    name: '开源免费',
    icon: () => h('svg', { class: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' })
    ])
  }
]

// 特性数据
const features = [
  {
    title: '精美设计',
    description: '参考主流平台设计语言，提供精美的视觉体验',
    icon: () => h('svg', { class: 'w-8 h-8', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z' })
    ])
  },
  {
    title: '响应式布局',
    description: '完美适配各种设备尺寸，提供一致的用户体验',
    icon: () => h('svg', { class: 'w-8 h-8', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' })
    ])
  },
  {
    title: '流畅交互',
    description: '丰富的动画效果和交互反馈，提升用户体验',
    icon: () => h('svg', { class: 'w-8 h-8', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M13 10V3L4 14h7v7l9-11h-7z' })
    ])
  },
  {
    title: '易于定制',
    description: '模块化设计，轻松定制和扩展功能',
    icon: () => h('svg', { class: 'w-8 h-8', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }),
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' })
    ])
  }
]
</script>

<style scoped>
/* B站风格的自定义样式 */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* 卡片悬停效果增强 */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

.group:hover .group-hover\:translate-x-1 {
  transform: translateX(0.25rem);
}

/* 渐变动画 */
@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.animate-glow {
  animation: glow-pulse 3s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% {
    filter: brightness(1) saturate(1);
  }
  50% {
    filter: brightness(1.1) saturate(1.2);
  }
}

/* 浮动动画优化 */
.animate-float {
  animation: float-gentle 8s ease-in-out infinite;
}

@keyframes float-gentle {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-10px) rotate(1deg);
  }
  50% {
    transform: translateY(-5px) rotate(0deg);
  }
  75% {
    transform: translateY(-15px) rotate(-1deg);
  }
}

/* 特殊阴影效果 */
.shadow-bilibili {
  box-shadow: 0 10px 30px rgba(251, 114, 153, 0.2);
}

.shadow-bilibili:hover {
  box-shadow: 0 20px 40px rgba(251, 114, 153, 0.3);
}

/* 按钮按下效果 */
button:active {
  transform: scale(0.98);
}

/* 响应式优化 */
@media (max-width: 640px) {
  .text-5xl {
    font-size: 2.5rem;
  }
  
  .text-7xl {
    font-size: 3.5rem;
  }
  
  .text-8xl {
    font-size: 4rem;
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(251, 114, 153, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, #FB7299, #00A1D6);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(45deg, #E85A8A, #0091C2);
}
</style>