<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
    <!-- 顶部导航栏 -->
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
      <div class="max-w-screen-xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center space-x-8">
            <div class="flex items-center">
              <svg class="w-8 h-8 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.51.556-2.764 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.920-.373.347 0 .653.124.920.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .160-.213l2.853-2.747c.267-.249.573-.373.920-.373.347 0 .662.151.929.400.267.249.391.551.391.907 0 .356-.124.657-.373.906l-1.174 1.120zM5.333 7.24c-.746.018-1.373.276-1.880.773-.506.498-.769 1.13-.789 1.894v7.52c.02.764.283 1.395.789 1.893.507.498 1.134.756 1.880.773h13.334c.746-.017 1.373-.275 1.880-.773.506-.498.769-1.129.789-1.893v-7.52c-.02-.765-.283-1.396-.789-1.894-.507-.497-1.134-.755-1.880-.773H5.333zM8 11.107c.373 0 .684.124.933.373.249.249.373.560.373.933v1.173c0 .373-.124.684-.373.933-.249.249-.560.373-.933.373s-.684-.124-.933-.373c-.249-.249-.373-.560-.373-.933V12.413c0-.373.124-.684.373-.933.249-.249.560-.373.933-.373zm8 0c.373 0 .684.124.933.373.249.249.373.560.373.933v1.173c0 .373-.124.684-.373.933-.249.249-.560.373-.933.373s-.684-.124-.933-.373c-.249-.249-.373-.560-.373-.933V12.413c0-.373.124-.684.373-.933.249-.249.560-.373.933-.373z"/>
              </svg>
              <span class="ml-2 text-xl font-bold text-gray-900 dark:text-white">bilibili</span>
            </div>
            
            <!-- 主导航 -->
            <nav class="hidden md:flex items-center space-x-6 text-sm">
              <a href="#" class="text-pink-500 font-medium relative group">
                首页
                <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#" class="text-gray-600 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 relative group">
                番剧
                <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#" class="text-gray-600 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 relative group">
                直播
                <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#" class="text-gray-600 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 relative group">
                游戏中心
                <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#" class="text-gray-600 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 relative group">
                会员购
                <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 group-hover:w-full transition-all duration-300"></span>
              </a>
            </nav>
          </div>

          <!-- 搜索和用户 -->
          <div class="flex items-center space-x-4">
            <!-- 深色模式切换 -->
            <button @click="toggleDarkMode" class="text-gray-500 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400">
              <svg v-if="isDarkMode" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fill-rule="evenodd" clip-rule="evenodd"></path>
              </svg>
              <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
              </svg>
            </button>
            
            <!-- 搜索框 -->
            <div class="hidden md:block relative">
              <div 
                class="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 w-80 transition-colors duration-300 group focus-within:ring-2 focus-within:ring-pink-500 focus-within:ring-opacity-50"
                :class="{'rounded-b-none': showSearchTrending}"
              >
                <input 
                  type="text" 
                  placeholder="搜索视频、番剧、UP主..." 
                  class="bg-transparent text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 outline-none text-sm flex-1 transition-colors duration-300"
                  @focus="showSearchTrending = true"
                  @blur="handleSearchBlur"
                  v-model="searchQuery"
                >
                <svg 
                  class="w-4 h-4 text-gray-400 dark:text-gray-500 cursor-pointer group-focus-within:text-pink-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  @click="handleSearch"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              
              <!-- 搜索热度排行榜 -->
              <div 
                v-if="showSearchTrending" 
                class="absolute top-full left-0 w-full bg-white dark:bg-gray-800 rounded-b-lg shadow-lg z-50 overflow-hidden border border-gray-200 dark:border-gray-700 border-t-0"
                @mousedown.prevent
              >
                <div class="p-3 border-b border-gray-200 dark:border-gray-700">
                  <div class="flex items-center justify-between">
                    <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">热搜榜</h3>
                    <div class="flex items-center space-x-2">
                      <span class="text-xs text-gray-500 dark:text-gray-400">每小时更新</span>
                      <button class="text-xs text-pink-500 hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-300 flex items-center">
                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                        </svg>
                        <span>换一换</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div class="max-h-80 overflow-y-auto">
                  <div 
                    v-for="(item, index) in trendingSearches" 
                    :key="item.id"
                    class="flex items-center px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                    @click="selectTrendingSearch(item)"
                  >
                    <!-- 排名 -->
                    <div 
                      class="w-6 h-6 flex items-center justify-center mr-3 font-medium text-sm"
                      :class="[
                        index < 3 
                          ? 'text-white' 
                          : 'text-gray-500 dark:text-gray-400',
                        index === 0 ? 'bg-red-500' : 
                        index === 1 ? 'bg-orange-500' : 
                        index === 2 ? 'bg-yellow-500' : 
                        'bg-gray-200 dark:bg-gray-600'
                      ]"
                    >
                      {{ index + 1 }}
                    </div>
                    
                    <!-- 内容 -->
                    <div class="flex-1">
                      <div class="flex items-center">
                        <span class="text-sm text-gray-800 dark:text-gray-200 mr-2">{{ item.title }}</span>
                        <span 
                          v-if="item.tag" 
                          :class="[
                            'text-xs px-1.5 py-0.5 rounded',
                            item.tag === '新' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                            item.tag === '热' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                            item.tag === '推荐' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          ]"
                        >
                          {{ item.tag }}
                        </span>
                      </div>
                      <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {{ item.heat }}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="p-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <button class="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                    查看完整榜单
                  </button>
                  <button 
                    class="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    @click="showSearchTrending = false"
                  >
                    关闭
                  </button>
                </div>
              </div>
            </div>
            
            <!-- 通知图标 -->
            <div class="relative hidden sm:block">
              <button class="text-gray-500 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
              </button>
              <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">3</span>
            </div>
            
            <!-- 投稿按钮 -->
            <button class="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              投稿
            </button>
            
            <!-- 用户头像 -->
            <div 
              class="w-9 h-9 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center cursor-pointer border-2 border-white dark:border-gray-800 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
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
              <button class="mt-4 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center">
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
                         currentSlide === index ? 'bg-pink-500 scale-110' : 'bg-white/70 hover:bg-white']">
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

      <!-- 推荐视频网格 -->
      <div class="mb-10">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-xl font-bold text-gray-800 dark:text-white flex items-center">
            <span class="w-1 h-6 bg-pink-500 rounded-full mr-2"></span>
            热门推荐
          </h2>
          <button class="text-sm text-pink-500 hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-300 flex items-center group">
            <span>查看更多</span>
            <svg class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          <div v-for="video in recommendedVideos" :key="video.id"
               class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
               @click="router.push(`/video/${video.id}`)">
            <div class="relative aspect-video group">
              <img :src="video.cover" :alt="video.title" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
              <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div class="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-md">
                {{ video.duration }}
              </div>
              <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div class="w-12 h-12 bg-pink-500/90 rounded-full flex items-center justify-center">
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
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z"></path>
                  </svg>
                  {{ video.uploader }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分区导航 -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-xl font-bold text-gray-800 dark:text-white flex items-center">
            <span class="w-1 h-6 bg-pink-500 rounded-full mr-2"></span>
            分区推荐
          </h2>
          <button class="text-sm text-pink-500 hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-300 flex items-center group">
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
                             ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md' 
                             : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700']">
            {{ category.name }}
          </button>
        </div>
      </div>

      <!-- 视频网格 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        <div v-for="video in videos" :key="video.id"
             class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
             @click="router.push(`/video/${video.id}`)">
          <div class="relative aspect-video group">
            <img :src="video.cover" :alt="video.title" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
            <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            <div class="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-md">
              {{ video.duration }}
            </div>
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div class="w-12 h-12 bg-pink-500/90 rounded-full flex items-center justify-center">
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
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z"></path>
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
    <div v-if="showLoginModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- 背景遮罩 -->
        <div class="fixed inset-0 bg-black bg-opacity-60 transition-opacity" aria-hidden="true" @click="closeLoginModal"></div>
        
        <!-- 模态框居中技巧 -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <!-- 登录卡片 -->
        <div 
          class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md w-full p-6 sm:p-8 animate-fade-in-up"
          @click.stop
        >
          <!-- 标题和关闭按钮 -->
          <div class="flex justify-between items-center mb-8">
            <h3 class="text-2xl font-bold text-gray-800 dark:text-white">欢迎回来</h3>
            <button 
              @click="closeLoginModal" 
              class="rounded-full p-1.5 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <!-- 登录表单 -->
          <div class="space-y-6">
            <!-- 用户名输入框 -->
            <div class="space-y-2">
              <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300">用户名</label>
              <div class="relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input 
                  type="text" 
                  id="username" 
                  v-model="loginForm.username" 
                  class="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200"
                  placeholder="请输入用户名"
                >
              </div>
            </div>
            
            <!-- 密码输入框 -->
            <div class="space-y-2">
              <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">密码</label>
              <div class="relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input 
                  type="password" 
                  id="password" 
                  v-model="loginForm.password" 
                  class="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200"
                  placeholder="请输入密码"
                >
              </div>
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
              class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              登录
            </button>
            
            <!-- 注册链接 -->
            <div class="text-center text-sm text-gray-600 dark:text-gray-400">
              <span>还没有账号？</span>
              <a href="#" class="font-medium text-pink-500 hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-300">立即注册</a>
            </div>
            
            <!-- 分隔线 -->
            <div class="relative my-6">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">其他登录方式</span>
              </div>
            </div>
            
            <!-- 社交登录按钮 -->
            <div class="flex items-center justify-center space-x-6">
              <button class="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.07 16.57l-4.24-4.24 1.41-1.41 2.83 2.83 6.59-6.59 1.41 1.41-8 8z"></path>
                </svg>
              </button>
              <button class="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"></path>
                </svg>
              </button>
              <button class="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-red-600 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.01 4.44c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm3.5 9.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5z"></path>
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const activeCategory = ref(1)
const currentSlide = ref(0)
let slideInterval: NodeJS.Timeout | null = null

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
    // 已登录状态下跳转到用户主页
    router.push(`/user/${isLoggedIn.value ? '12345678' : ''}`)
  }
}

// 处理登录
const handleLogin = () => {
  // 这里应该是实际的登录API调用
  // 这里使用模拟登录逻辑
  if (loginForm.value.username && loginForm.value.password) {
    if (loginForm.value.password === '123456') { // 简单的密码验证
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

const carouselSlides = [
  {
    id: 1,
    title: '千杯音乐节官宣啦！',
    subtitle: '2025.10.18-19 上海静安·星梦PARK',
    image: 'https://via.placeholder.com/800x300/3B82F6/FFFFFF?text=千杯音乐节官宣啦！'
  },
  {
    id: 2,
    title: '餐饮企业"国改"梦永活',
    subtitle: '17万赞 · 老北京Official · 11小时前',
    image: 'https://via.placeholder.com/800x300/10B981/FFFFFF?text=餐饮企业国改梦永活'
  },
  {
    id: 3,
    title: '静音&无线缆等的标准答案',
    subtitle: '3590 · 8 · Metalion · 12小时前',
    image: 'https://via.placeholder.com/800x300/EF4444/FFFFFF?text=Spark+Neo无线耳机'
  }
]

const recommendedVideos = [
  {
    id: 1,
    title: '老婆第一次测魅力，如何得后悔了！！！',
    cover: 'https://via.placeholder.com/300x200/FF69B4/FFFFFF?text=视频1',
    duration: '10:44',
    uploader: '哔哩哔哩'
  },
  {
    id: 2,
    title: '餐饮企业"国改"梦永活',
    cover: 'https://via.placeholder.com/300x200/4169E1/FFFFFF?text=视频2',
    duration: '13:17',
    uploader: '老北京Official'
  },
  {
    id: 3,
    title: '静音&无线缆等的标准答案',
    cover: 'https://via.placeholder.com/300x200/32CD32/FFFFFF?text=视频3',
    duration: '11:36',
    uploader: 'Metalion'
  },
  {
    id: 4,
    title: '在从生活的脚步当导游！',
    cover: 'https://via.placeholder.com/300x200/FF4500/FFFFFF?text=视频4',
    duration: '08:19',
    uploader: '竹鼠洞洞的向导'
  },
  {
    id: 5,
    title: '第一次犯罪测谎仪得么准！',
    cover: 'https://via.placeholder.com/300x200/FFD700/FFFFFF?text=视频5',
    duration: '12:34',
    uploader: '十五里堡'
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
    title: '老婆第一次测魅力，如何得后悔了！！！',
    cover: 'https://via.placeholder.com/300x200/FF69B4/FFFFFF?text=视频1',
    duration: '04:15',
    uploader: '哔哩哔哩',
    playCount: '10万',
    danmaku: '774'
  },
  {
    id: 2,
    title: '小林信一 吉他他入门只需两周！',
    cover: 'https://via.placeholder.com/300x200/4169E1/FFFFFF?text=视频2',
    duration: '28:04',
    uploader: '吉他情报长',
    playCount: '9807',
    danmaku: '0'
  },
  {
    id: 3,
    title: 'B站唯一一次得最高Claude Code人！',
    cover: 'https://via.placeholder.com/300x200/32CD32/FFFFFF?text=视频3',
    duration: '06:40',
    uploader: 'AI学习TV',
    playCount: '3万',
    danmaku: '163'
  },
  {
    id: 4,
    title: '一瞬间，我似乎明白了她的意义所在！',
    cover: 'https://via.placeholder.com/300x200/FF4500/FFFFFF?text=视频4',
    duration: '08:19',
    uploader: '竹鼠洞洞的向导',
    playCount: '817万',
    danmaku: '162'
  },
  {
    id: 5,
    title: '【原神】雷电将军：10小时前更新',
    cover: 'https://via.placeholder.com/300x200/FFD700/FFFFFF?text=视频5',
    duration: '12:34',
    uploader: '原神官方',
    playCount: '145万',
    danmaku: '3.2万'
  },
  {
    id: 6,
    title: '【音乐MV】最新热门歌曲合集',
    cover: 'https://via.placeholder.com/300x200/9370DB/FFFFFF?text=视频6',
    duration: '15:30',
    uploader: '音乐分享',
    playCount: '92万',
    danmaku: '1.5万'
  },
  {
    id: 7,
    title: '【科技评测】最新黑科技产品体验',
    cover: 'https://via.placeholder.com/300x200/20B2AA/FFFFFF?text=视频7',
    duration: '18:45',
    uploader: '科技博主',
    playCount: '178万',
    danmaku: '4.1万'
  },
  {
    id: 8,
    title: '【搞笑合集】爆笑视频精选',
    cover: 'https://via.placeholder.com/300x200/FF6347/FFFFFF?text=视频8',
    duration: '25:18',
    uploader: '搞笑日常',
    playCount: '234万',
    danmaku: '6.7万'
  }
]

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % carouselSlides.length
}

const startAutoSlide = () => {
  slideInterval = setInterval(nextSlide, 4000)
}

onMounted(() => {
  startAutoSlide()
})

onUnmounted(() => {
  if (slideInterval) {
    clearInterval(slideInterval)
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>