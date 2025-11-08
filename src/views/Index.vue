<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
    <!-- 使用导航头组件 -->
    <NavHeader 
      :isLoggedIn="userStore.isLoggedIn" 
      :username="userStore.username" 
      @login="showLoginModal = true"
      @toggleDarkMode="toggleDarkMode"
    />

    <!-- 主要内容 -->
    <main class="max-w-screen-xl mx-auto px-4 py-6">
      <!-- 轮播图区域 -->
      <div class="mb-8">
        <div class="relative h-64 md:h-80 rounded-xl overflow-hidden shadow-lg">
          <div v-for="(slide, index) in carouselSlides" :key="index"
               :class="['absolute inset-0 transition-all duration-700', 
                       currentSlide === index ? 'opacity-100 scale-100' : 'opacity-0 scale-105']">
            <img :src="slide.image" :alt="slide.title" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div class="absolute bottom-8 left-8 text-white max-w-lg">
              <h2 class="text-2xl md:text-3xl font-bold mb-2 drop-shadow-md">{{ slide.title }}</h2>
              <p class="text-sm md:text-base opacity-90 drop-shadow-md">{{ slide.subtitle }}</p>
              <button class="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                立即观看
              </button>
            </div>
          </div>
          
          <!-- 轮播指示器 -->
          <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
            <div v-for="(slide, index) in carouselSlides" :key="index" 
                 @click="currentSlide = index"
                 :class="['w-3 h-3 rounded-full transition-all duration-300 cursor-pointer shadow-md', 
                         currentSlide === index ? 'bg-purple-600 scale-110' : 'bg-white/70 hover:bg-white']">
            </div>
          </div>
          
          <!-- 轮播控制按钮 -->
          <button @click="prevSlide" class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <button @click="nextSlide" class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- 视频列表 -->

      <!-- 推荐视频网格 -->
      <div class="mb-10" v-if="!isMobile">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-xl font-bold text-gray-800 dark:text-white flex items-center">
            <span class="w-1 h-6 bg-purple-600 rounded-full mr-2"></span>
            热门推荐
          </h2>
          <button class="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 flex items-center group">
            <span>查看更多</span>
            <svg class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          <div v-for="video in recommendedVideos" :key="video.id"
               class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
               @click="handleVideoClick(video); router.push(`/video/${video.id}`)">
            <div class="relative aspect-video group">
              <img :src="video.cover" :alt="video.title" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
              <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div class="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-md">
                {{ video.duration }}
              </div>
              <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div class="w-12 h-12 bg-purple-600/90 rounded-full flex items-center justify-center" @click.stop="handleVideoPlay(video)">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"></path>
                  </svg>
                </div>
              </div>
            </div>
            <div class="p-4">
              <h3 class="text-sm font-medium text-gray-800 dark:text-gray-100 mb-2 line-clamp-2 h-10">{{ video.title }}</h3>
              <div class="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <span class="flex items-center">
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z"/>
                  </svg>
                  {{ video.uploader }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分区导航 -->
      <div class="mb-8" v-if="!isMobile">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-xl font-bold text-gray-800 dark:text-white flex items-center">
            <span class="w-1 h-6 bg-purple-600 rounded-full mr-2"></span>
            分区推荐
          </h2>
          <button class="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 flex items-center group">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span>换一换</span>
          </button>
        </div>

        <!-- 分类标签 -->
        <div class="flex overflow-x-auto scrollbar-hide space-x-3 pb-2 mb-6">
          <button v-for="category in categories" :key="category.id"
                  @click="activeCategory = category.id"
                  :class="['px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap',
                           activeCategory === category.id 
                             ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md' 
                             : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700']">
            {{ category.name }}
          </button>
        </div>
      </div>

      <!-- 用户标签区域 -->
      <div class="mb-8" v-if="userStore.isLoggedIn">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
              <span class="w-1 h-5 bg-purple-600 rounded-full mr-2"></span>
              我的兴趣标签
            </h3>
            <button @click="toggleTagPanel" 
                    class="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              管理标签
            </button>
          </div>
          
          <!-- 用户标签展示 -->
          <div class="flex flex-wrap gap-2 mb-4" v-if="userStore.userTags.length > 0">
            <span v-for="tag in userStore.userTags" :key="tag"
                  class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
              {{ tag }}
              <button @click="handleRemoveTag(tag)" class="ml-2 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
              </button>
            </span>
          </div>
          
          <div v-else class="text-gray-500 dark:text-gray-400 text-sm mb-4">
            您还没有添加任何兴趣标签，点击"管理标签"添加您的兴趣标签
          </div>
          
          <!-- 标签管理面板 -->
          <div v-if="showTagPanel" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div class="mb-4">
              <div class="flex space-x-2">
                <input v-model="newTag" 
                       @keyup.enter="handleAddTag"
                       type="text" 
                       placeholder="输入新标签" 
                       class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                <button @click="handleAddTag" 
                        class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                  添加
                </button>
              </div>
            </div>
            
            <!-- 推荐标签 -->
            <div class="mb-4">
              <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">推荐标签</h4>
              <div class="flex flex-wrap gap-2">
                <button v-for="tag in recommendedTags" :key="tag"
                        @click="userStore.addUserTag(tag)"
                        :class="['px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                                 userStore.userTags.includes(tag) 
                                   ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' 
                                   : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600']">
                  {{ tag }}
                </button>
              </div>
            </div>
            
            <!-- 所有可用标签 -->
            <div>
              <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">所有标签</h4>
              <div class="flex flex-wrap gap-2">
                <button v-for="tag in availableTags" :key="tag"
                        @click="userStore.addUserTag(tag)"
                        :class="['px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                                 userStore.userTags.includes(tag) 
                                   ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' 
                                   : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600']">
                  {{ tag }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 视频网格 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6" v-if="!isMobile">
        <div v-for="video in videos" :key="video.id"
             class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
             @click="handleVideoClick(video); router.push(`/video/${video.id}`)">
          <div class="relative aspect-video group">
            <img :src="video.cover" :alt="video.title" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
            <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            <div class="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-md">
              {{ video.duration }}
            </div>
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div class="w-12 h-12 bg-pink-500/90 rounded-full flex items-center justify-center" @click.stop="handleVideoPlay(video)">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"></path>
                </svg>
              </div>
            </div>
          </div>
          <div class="p-4">
            <h3 class="text-sm font-medium text-gray-800 dark:text-gray-100 mb-2 line-clamp-2 h-10">{{ video.title }}</h3>
            <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span class="flex items-center">
                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z"/>
                </svg>
                {{ video.uploader }}
              </span>
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
    <div v-if="showLoginModal" class="fixed inset-0 z-50 overflow-y-auto animate-fade-in" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- 背景遮罩 -->
        <div class="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" aria-hidden="true" @click="closeLoginModal"></div>
        
        <!-- 模态框居中技巧 -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <!-- 登录卡片 -->
        <div 
          class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full animate-fade-in-up"
          @click.stop
        >
          <!-- 顶部装饰条 -->
          <div class="h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"></div>
          
          <!-- 标题和关闭按钮 -->
          <div class="flex justify-between items-center px-8 pt-6 pb-4">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-800 dark:text-white">登录账号</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">登录后享受更多精彩内容</p>
              </div>
            </div>
            <button 
              @click="closeLoginModal" 
              class="rounded-full p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <!-- 登录方式切换 -->
          <div class="px-8 pb-4">
            <div class="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button 
                @click="loginType = 'phone'"
                :class="['flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200', 
                         loginType === 'phone' 
                           ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                           : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white']"
              >
                手机验证码登录
              </button>
              <button 
                @click="loginType = 'qr'"
                :class="['flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200', 
                         loginType === 'qr' 
                           ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                           : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white']"
              >
                扫码登录
              </button>
            </div>
          </div>
          
          <!-- 登录表单 -->
          <div v-if="loginType === 'phone'" class="px-8 pb-6 space-y-5">
            <!-- 手机号输入框 -->
            <div class="space-y-2">
              <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300">手机号</label>
              <div class="relative rounded-lg shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input 
                  type="tel" 
                  id="phone" 
                  v-model="loginForm.phone" 
                  class="form-input block w-full pl-10 pr-3 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200"
                  :class="loginForm.phone && !isValidPhone(loginForm.phone) ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'"
                  placeholder="请输入手机号"
                >
              </div>
              <p v-if="loginForm.phone && !isValidPhone(loginForm.phone)" class="mt-1 text-sm text-red-500">请输入有效的手机号码</p>
            </div>
            
            <!-- 验证码输入框 -->
            <div class="space-y-2">
              <label for="verificationCode" class="block text-sm font-medium text-gray-700 dark:text-gray-300">验证码</label>
              <div class="flex space-x-3">
                <div class="relative rounded-lg shadow-sm flex-1">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input 
                  type="text" 
                  id="verificationCode" 
                  v-model="loginForm.verificationCode" 
                  class="form-input block w-full pl-10 pr-3 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200"
                  :class="loginForm.verificationCode && loginForm.verificationCode.length !== 6 ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'"
                  placeholder="请输入验证码"
                >
                </div>
                <button 
                  @click="sendVerificationCode" 
                  :disabled="!isValidPhone(loginForm.phone) || isSendingCode || countdown > 0"
                  class="px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 whitespace-nowrap"
                >
                  {{ isSendingCode ? '发送中...' : countdown > 0 ? `${countdown}秒后重试` : '发送验证码' }}
                </button>
              </div>
              <p v-if="loginForm.verificationCode && loginForm.verificationCode.length !== 6" class="mt-1 text-sm text-red-500">请输入6位验证码</p>
            </div>
            
            <!-- 记住我和忘记密码 -->
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded">
                <label for="remember-me" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">记住我</label>
              </div>
              <div class="text-sm">
                <a href="#" class="font-medium text-pink-500 hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-300">忘记密码?</a>
              </div>
            </div>
            
            <!-- 错误提示 -->
            <div v-if="loginError" class="p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm rounded-lg border border-red-200 dark:border-red-800/50">
              <div class="flex">
                <svg class="h-5 w-5 text-red-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                {{ loginError }}
              </div>
            </div>
            
            <!-- 登录按钮 -->
            <button 
              @click="handleLogin" 
              :disabled="!isValidPhone(loginForm.phone) || !loginForm.verificationCode || loginForm.verificationCode.length !== 6 || isSendingCode"
              class="btn-primary w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none"
            >
              <span v-if="isSendingCode" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                登录中...
              </span>
              <span v-else>登录</span>
            </button>
            
            <!-- 注册链接 -->
            <div class="text-center text-sm text-gray-600 dark:text-gray-400">
              <span>还没有账号？</span>
              <a href="#" class="font-medium text-pink-500 hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-300">立即注册</a>
            </div>
          </div>
          
          <!-- 扫码登录 -->
          <div v-if="loginType === 'qr'" class="px-8 pb-6">
            <div class="flex flex-col items-center space-y-4">
              <div class="w-48 h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 opacity-70"></div>
                <div class="relative z-10 text-center">
                  <svg class="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
                  </svg>
                  <p class="text-sm text-gray-500 dark:text-gray-400">二维码加载中...</p>
                </div>
              </div>
              <div class="text-center">
                <p class="text-sm text-gray-600 dark:text-gray-400">打开手机APP扫描二维码</p>
                <button class="mt-2 text-sm text-pink-500 hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-300 transition-colors duration-200">
                  刷新二维码
                </button>
              </div>
            </div>
          </div>
          
          <!-- 分隔线 -->
          <div class="relative px-8 py-4">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">其他登录方式</span>
            </div>
          </div>
          
          <!-- 社交登录按钮 -->
          <div class="px-8 pb-8">
            <div class="flex items-center justify-center space-x-6">
              <button class="social-btn flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110 active:scale-95">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
                </svg>
              </button>
              <button class="social-btn flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110 active:scale-95">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
              </button>
              <button class="social-btn flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-red-600 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110 active:scale-95">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import NavHeader from '../components/NavHeader.vue'
import { useUserStore } from '../stores/userStore'
import { homeAPI } from '../api/home'


// 使用全局用户状态
const userStore = useUserStore()

// 用户标签相关状态
const showTagPanel = ref(false)
const newTag = ref('')
const availableTags = [
  '科技', '娱乐', '音乐', '游戏', '美食', '旅行', 
  '教育', '体育', '动漫', '电影', '时尚', '生活',
  '编程', '设计', '摄影', '健身', '财经', '历史'
]

// 用户标签相关方法
const toggleTagPanel = () => {
  showTagPanel.value = !showTagPanel.value
}

const handleAddTag = () => {
  if (newTag.value.trim() && !userStore.userTags.includes(newTag.value.trim())) {
    userStore.addUserTag(newTag.value.trim())
    newTag.value = ''
  }
}

const handleRemoveTag = (tag: string) => {
  userStore.removeUserTag(tag)
}

const handleVideoClick = (video: any) => {
  // 当用户点击视频时，更新标签偏好权重
  if (video.tags && video.tags.length > 0) {
    video.tags.forEach((tag: string) => {
      userStore.updateTagPreference(tag, 1)
    })
  }
}

const handleVideoPlay = (video: any) => {
  // 当用户播放视频时，增加标签偏好权重
  if (video.tags && video.tags.length > 0) {
    video.tags.forEach((tag: string) => {
      userStore.updateTagPreference(tag, 2)
    })
  }
}

// 推荐标签计算属性
const recommendedTags = computed(() => {
  if (!userStore.isLoggedIn) return []
  
  // 获取用户偏好权重最高的标签
  const sortedTags = Object.entries(userStore.tagPreferences)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([tag]) => tag)
  
  // 如果用户标签少于5个，补充可用标签
  if (sortedTags.length < 5) {
    const additionalTags = availableTags
      .filter(tag => !sortedTags.includes(tag) && !userStore.userTags.includes(tag))
      .slice(0, 5 - sortedTags.length)
    
    return [...sortedTags, ...additionalTags]
  }
  
  return sortedTags
})

const router = useRouter()

const activeCategory = ref(1)
const currentSlide = ref(0)
let slideInterval: NodeJS.Timeout | null = null

const isMobile = ref(window.innerWidth <= 768)
const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 768
}




// 搜索相关
const searchQuery = ref('')
const showSearchTrending = ref(false)
const trendingSearches = [
  { id: 1, title: '原神3.0版本更新', heat: '6,582,145热度', tag: '新' },
  { id: 2, title: '2025年高考志愿填报指南', heat: '5,421,897热度', tag: '热' },
  { id: 3, title: '华为Mate 60 Pro评测', heat: '4,987,632热度', tag: '热' },
  { id: 4, title: '周杰伦新歌发布', heat: '3,854,721热度', tag: null },
  { id: 5, title: '国庆节旅游攻略', heat: '3,245,689热度', tag: '推荐' },
  { id: 6, title: 'AI绘画教程', heat: '2,987,456热度', tag: null },
  { id: 7, title: '如何提高编程效率', heat: '2,654,321热度', tag: null },
  { id: 8, title: '健身减脂30天挑战', heat: '2,321,456热度', tag: '推荐' },
  { id: 9, title: '最新电影推荐', heat: '1,987,654热度', tag: null },
  { id: 10, title: '学习方法分享', heat: '1,654,321热度', tag: null }
]

// 处理搜索框失焦
const handleSearchBlur = (e: FocusEvent) => {
  // 使用setTimeout防止点击搜索结果项时因为blur事件导致无法选中
  setTimeout(() => {
    showSearchTrending.value = false
  }, 200)
}

// 处理搜索
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('搜索:', searchQuery.value)
    // 这里可以添加实际的搜索逻辑
    showSearchTrending.value = false
  }
}

// 选择热搜项
const selectTrendingSearch = (item: any) => {
  searchQuery.value = item.title
  handleSearch()
}

// 深色模式状态
const isDarkMode = ref(false)
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  // 这里可以添加实际的深色模式切换逻辑，如修改document.documentElement.classList
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// 登录相关
const showLoginModal = ref(false)
const loginType = ref('phone') // 'phone' 或 'qr'
const loginForm = ref({
  phone: '',
  verificationCode: ''
})
const loginError = ref('')
const isSendingCode = ref(false)
const countdown = ref(0)

// 手机号验证函数
const isValidPhone = (phone: string) => {
  return /^1[3-9]\d{9}$/.test(phone)
}

// 处理用户头像点击
const handleUserIconClick = () => {
  if (!userStore.isLoggedIn) {
    showLoginModal.value = true
  } else {
    // 已登录状态下跳转到用户主页
    router.push(`/user/${userStore.userId || '12345678'}`)
  }
}

// 发送验证码
const sendVerificationCode = async () => {
  if (!loginForm.value.phone) {
    loginError.value = '请输入手机号'
    return
  }
  
  if (!isValidPhone(loginForm.value.phone)) {
    loginError.value = '请输入有效的手机号码'
    return
  }
  
  isSendingCode.value = true
  
  try {
    // 调用真实的短信API
    console.log(loginForm)
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
      
      loginError.value = ''
    } else {
      loginError.value = result.error || '发送验证码失败，请稍后重试'
    }
  } catch (error) {
    loginError.value = '网络错误，请检查网络连接'
  } finally {
    isSendingCode.value = false
  }
}

// 处理登录
const handleLogin = async () => {
  if (!loginForm.value.phone) {
    loginError.value = '请输入手机号'
    return
  }
  
  if (!isValidPhone(loginForm.value.phone)) {
    loginError.value = '请输入有效的手机号码'
    return
  }
  
  if (!loginForm.value.verificationCode) {
    loginError.value = '请输入验证码'
    return
  }
  
  if (loginForm.value.verificationCode.length !== 6) {
    loginError.value = '请输入6位验证码'
    return
  }

  try {
    await userStore.login({
      phone: loginForm.value.phone,
      verificationCode: loginForm.value.verificationCode
    })
    showLoginModal.value = false
    loginError.value = ''
    loginForm.value = { phone: '', verificationCode: '' }
  } catch (error) {
    loginError.value = '登录失败，请检查手机号和验证码是否正确'
  }
}

// 关闭登录弹窗
const closeLoginModal = () => {
  showLoginModal.value = false
  loginError.value = ''
  loginForm.value = { phone: '', verificationCode: '' }
}

// 从事件显示登录弹窗
const showLoginModalFromEvent = () => {
  showLoginModal.value = true
}

const carouselSlides = [
  {
    id: 1,
    title: '探索宇宙的奥秘',
    subtitle: '跟随NASA最新探测器，揭开太阳系外行星的神秘面纱',
    image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    title: '2025全球科技峰会',
    subtitle: '直播全球顶尖科技公司的最新产品发布会',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    title: '自然纪录片：深海探秘',
    subtitle: '潜入海洋最深处，探索未知的海底世界',
    image: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&w=800&q=80'
  }
]

const recommendedVideos = [
  {
    id: 1,
    title: '2025年最值得期待的十大科技产品',
    cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=300&q=80',
    duration: '12:34',
    uploader: '科技前沿',
    tags: ['科技', '创新', '数码']
  },
  {
    id: 2,
    title: '如何在30天内掌握Vue 3和TypeScript',
    cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=300&q=80',
    duration: '25:12',
    uploader: '编程学院',
    tags: ['编程', '教育', '技术']
  },
  {
    id: 3,
    title: '探秘世界上最神奇的十大自然现象',
    cover: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=300&q=80',
    duration: '18:45',
    uploader: '自然探索',
    tags: ['自然', '旅行', '科普']
  },
  {
    id: 4,
    title: '2025年最热门的旅游目的地推荐',
    cover: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=300&q=80',
    duration: '14:22',
    uploader: '环球旅行',
    tags: ['旅行', '美食', '文化']
  },
  {
    id: 5,
    title: '美食博主带你探店：城市里的隐藏菜单',
    cover: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=300&q=80',
    duration: '09:55',
    uploader: '吃货小分队',
    tags: ['美食', '生活', '探店']
  }
]

const categories = [
  { id: 1, name: '推荐' },
  { id: 2, name: '动画' },
  { id: 3, name: '番剧' },
  { id: 4, name: '国创' },
  { id: 5, name: '音乐' },
  { id: 6, name: '舞蹈' },
  { id: 7, name: '游戏' },
  { id: 8, name: '知识' }
]

const videos = [
  {
    id: 1,
    title: '人工智能如何改变我们的未来生活',
    cover: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=300&q=80',
    duration: '15:42',
    uploader: '未来科技',
    playCount: '102万',
    danmaku: '1.8万',
    tags: ['科技', '人工智能', '未来']
  },
  {
    id: 2,
    title: '2025年最受欢迎的十大游戏',
    cover: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=300&q=80',
    duration: '20:18',
    uploader: '游戏玩家',
    playCount: '78万',
    danmaku: '2.5万',
    tags: ['游戏', '娱乐', '评测']
  },
  {
    id: 3,
    title: '现代流行音乐制作全攻略',
    cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=300&q=80',
    duration: '32:10',
    uploader: '音乐制作人',
    playCount: '45万',
    danmaku: '9800',
    tags: ['音乐', '制作', '教程']
  },
  {
    id: 4,
    title: '量子计算机入门教程',
    cover: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=300&q=80',
    duration: '28:45',
    uploader: '量子科学',
    playCount: '32万',
    danmaku: '1.1万',
    tags: ['科技', '教育', '量子物理']
  },
  {
    id: 5,
    title: '2025年春季时尚趋势预测',
    cover: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=300&q=80',
    duration: '16:20',
    uploader: '时尚前沿',
    playCount: '67万',
    danmaku: '2.3万',
    tags: ['时尚', '潮流', '预测']
  },
  {
    id: 6,
    title: '世界杯精彩瞬间回顾',
    cover: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=300&q=80',
    duration: '22:30',
    uploader: '体育频道',
    playCount: '120万',
    danmaku: '5.6万',
    tags: ['体育', '足球', '世界杯']
  },
  {
    id: 7,
    title: '亚洲美食之旅：日本篇',
    cover: 'https://images.unsplash.com/photo-1540648639573-8c848de23f0a?auto=format&fit=crop&w=300&q=80',
    duration: '19:15',
    uploader: '美食家',
    playCount: '56万',
    danmaku: '1.9万',
    tags: ['美食', '旅行', '日本']
  },
  {
    id: 8,
    title: '探索北欧隐秘的自然风光',
    cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=300&q=80',
    duration: '24:50',
    uploader: '旅行达人',
    playCount: '43万',
    danmaku: '1.4万',
    tags: ['旅行', '自然', '北欧']
  }
]

/* 视频相关状态 */
// 视频数据源 - 模拟API数据
const allVideos = ref<any[]>([])
const pageSize = 5 // 每次加载5条视频
const currentPage = ref(1)
const isLoading = ref(false)
const hasMore = ref(true)



// 首页数据加载
const isLoadingHome = ref(false)
const homeDataLoaded = ref(false)

// 加载首页数据
const loadHomeData = async () => {
  if (isLoadingHome.value) return
  
  isLoadingHome.value = true
  
  try {
    // 获取用户标签字符串，用于API请求
    const userTagsStr = userStore.userTags.join(',')
    
    // 准备请求参数
    const params: any = {
      page: 1,
      page_size: 10,
      user_tags: userTagsStr
    }
    
    // 如果用户已登录，添加token
    if (userStore.isAuthenticated) {
      params.token = userStore.accessToken
    }
    
    // 调用首页API获取数据
    const response = await homeAPI.getHomeData(params)
    
    if (response.status_code === 0 && response.data) {
      // 更新轮播图数据
      if (response.data.carousels && response.data.carousels.length > 0) {
        carouselSlides.value = response.data.carousels
      }
      
      // 更新分类数据
      if (response.data.categories && response.data.categories.length > 0) {
        categories.value = response.data.categories
      }
      
      // 更新推荐视频数据
      if (response.data.recommendedVideos && response.data.recommendedVideos.length > 0) {
        recommendedVideos.value = response.data.recommendedVideos
      }
      
      // 更新热门视频数据
      if (response.data.hotVideos && response.data.hotVideos.length > 0) {
        videos.value = response.data.hotVideos
      }
      
      // 更新个性化推荐视频（仅登录用户）
      if (userStore.isAuthenticated && response.data.personalizedVideos && response.data.personalizedVideos.length > 0) {
        // 可以将个性化推荐添加到推荐视频列表中
        recommendedVideos.value = [...response.data.personalizedVideos, ...recommendedVideos.value]
      }
      
      homeDataLoaded.value = true
    }
  } catch (error) {
    console.error('加载首页数据失败:', error)
  } finally {
    isLoadingHome.value = false
  }
}

// 计算当前显示的视频
const displayedVideos = computed(() => {
  return allVideos.value.slice(0, currentPage.value * pageSize)
})

// 加载更多视频
const loadMoreVideos = async () => {
  if (isLoading.value || !hasMore.value) return
  
  isLoading.value = true
  
  try {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const nextPage = currentPage.value + 1
    const newVideos = generateMoreVideos(nextPage, pageSize)
    
    // 如果已经加载了很多页，模拟没有更多数据
    if (nextPage > 5) {
      hasMore.value = false
    } else {
      allVideos.value = [...allVideos.value, ...newVideos]
      currentPage.value = nextPage
      
      
    }
  } catch (error) {
    console.error('加载视频失败:', error)
  } finally {
    isLoading.value = false
  }
}




















    











const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % carouselSlides.length
}

const startAutoSlide = () => {
  slideInterval = setInterval(nextSlide, 4000)
}

onMounted(async () => {
  startAutoSlide()
  window.addEventListener('resize', updateIsMobile)
  
  // 监听显示登录弹窗事件
  window.addEventListener('show-login-modal', showLoginModalFromEvent)
  
  // 进入首页时的数据加载逻辑
  try {
    // 如果用户已登录，先验证Token有效性
    if (userStore.isAuthenticated) {
      await userStore.verifyToken()
    }
    
    // 加载首页数据
    await loadHomeData()
  } catch (error) {
    console.error('初始化首页数据失败:', error)
    // 如果Token验证失败，仍然加载未登录用户的首页数据
    await loadHomeData()
  }
})

onUnmounted(() => {
  if (slideInterval) {
    clearInterval(slideInterval)
  }
  window.removeEventListener('resize', updateIsMobile)
  window.removeEventListener('show-login-modal', showLoginModalFromEvent)
})
</script>

<style scoped>
/* 登录弹窗动画 */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-down {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(20px);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}

.animate-slide-down {
  animation: slide-down 0.3s ease-out;
}

/* 输入框聚焦动画 */
.form-input {
  transition: all 0.3s ease;
}

.form-input:focus {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

/* 按钮点击动画 */
.btn-primary {
  transition: all 0.2s ease;
}

.btn-primary:active {
  transform: scale(0.98);
}

/* 社交登录按钮悬停效果 */
.social-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.social-btn:hover {
  transform: translateY(-3px) scale(1.05);
}

.social-btn:active {
  transform: translateY(-1px) scale(0.98);
}
</style>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

</style>