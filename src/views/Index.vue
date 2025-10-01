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

      <!-- 移动端全屏Feed（抖音/哔哩哔哩/小红书风格） -->
      <section v-if="isMobile" class="mobile-feed">
        <div 
          ref="feedContainer" 
          class="feed-container" 
          @touchstart="handleTouchStart" 
          @touchmove="handleTouchMove" 
          @touchend="handleTouchEnd"
          @scroll="handleScroll"
        >
          <div 
            v-for="(video, index) in displayedVideos" 
            :key="video.id" 
            :ref="el => { if (el) videoRefs[index] = el }" 
            class="feed-item"
            :class="{ 'active': currentVideoIndex === index }"
            :style="getVideoStyle(index)"
          >
            <!-- 视频/图片区域 -->
            <div class="feed-media-container">
              <template v-if="Math.abs(currentVideoIndex - index) <= 1">
                <video 
                  class="feed-media" 
                  :src="video.videoUrl || 'https://media.w3.org/2010/05/sintel/trailer.mp4'" 
                  :poster="video.cover"
                  :muted="isMuted"
                  :loop="true"
                  :autoplay="currentVideoIndex === index"
                  :playsinline="true"
                  ref="videoElements"
                ></video>
                
                <!-- 添加一个覆盖层用于捕获点击和触摸事件 -->
                <div 
                  class="feed-video-overlay"
                  @click="toggleVideoPlay($event, index)"
                  @touchstart="handleVideoTouchStart($event, index)"
                  @touchend="handleVideoTouchEnd($event, index)"
                ></div>
              </template>
              <img 
                v-else
                :src="video.cover" 
                :alt="video.title" 
                class="feed-media" 
              />
              
              <!-- 播放按钮覆盖 -->
              <div class="feed-play-overlay" v-if="!isPlaying[video.id]">
                <div class="feed-play-btn">
                  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="24" r="24" fill="white" fill-opacity="0.3"/>
                    <path d="M32 24L20 32V16L32 24Z" fill="white"/>
                  </svg>
                </div>
              </div>
              
              <!-- 音量控制按钮 -->
              <div class="feed-volume-control" @click.stop="toggleMute">
                <svg v-if="isMuted" viewBox="0 0 24 24" fill="white">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="white">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>
              </div>
              
              <!-- 音量调节滑块 (显示在非静音状态) -->
              <div class="feed-volume-slider" v-if="showVolumeSlider && !isMuted" @click.stop>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.1" 
                  v-model="volumeLevel" 
                  @input="updateVolume"
                  class="volume-range"
                >
              </div>
              
              <!-- 进度条 -->
              <div 
                class="feed-progress" 
                @click="handleProgressClick($event, video.id)"
                @mousedown="startProgressDrag($event, video.id)"
                @touchstart="startProgressDrag($event, video.id)"
                :class="{'dragging': isDraggingProgress && currentDraggingVideoId === video.id}"
              >
                <div class="feed-progress-inner" :style="{width: videoProgress[video.id] || '0%'}"></div>
              </div>
            </div>
            
            <!-- 内容信息覆盖层 -->
            <div class="feed-content-overlay">
              <!-- 底部作者信息和描述 -->
              <div class="feed-author-info">
                <div class="feed-avatar">
                  <img :src="`https://via.placeholder.com/40/FF69B4/FFFFFF?text=${video.uploader.charAt(0)}`" alt="avatar" />
                </div>
                <div class="feed-user-info">
                  <div class="feed-username">@{{ video.uploader }}</div>
                  <div class="feed-description">{{ video.title }}</div>
                  <div class="feed-tags">
                    <span class="feed-tag">#推荐</span>
                    <span class="feed-tag">#热门</span>
                  </div>
                </div>
                <button class="feed-follow-btn">关注</button>
              </div>
              
              <!-- 右侧操作栏 -->
              <div class="feed-actions">
                <button 
                  class="action-btn" 
                  @click.stop="toggleLike(video.id)"
                  @touchstart.stop="handleActionTouchStart"
                  @touchend.stop="(e) => handleActionTouchEnd(e, () => toggleLike(video.id))"
                >
                  <div class="action-icon" :class="{ 'liked': isLiked[video.id] }">
                    <svg viewBox="0 0 24 24"><path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5A4.5 4.5 0 016.5 4 5.5 5.5 0 0112 6a5.5 5.5 0 015.5-2 4.5 4.5 0 014.5 4.5c0 3.78-3.4 6.86-8.55 11.18L12 21z" /></svg>
                  </div>
                  <span class="action-count">{{ formatCount(likeCounts[video.id]) }}</span>
                </button>
                
                <button 
                  class="action-btn" 
                  @click.stop="openComments(video.id)"
                  @touchstart.stop="handleActionTouchStart"
                  @touchend.stop="(e) => handleActionTouchEnd(e, () => openComments(video.id))"
                >
                  <div class="action-icon">
                    <svg viewBox="0 0 24 24"><path d="M21 15a4 4 0 01-4 4H7l-4 4V5a4 4 0 014-4h10a4 4 0 014 4v10z" /></svg>
                  </div>
                  <span class="action-count">{{ formatCount(commentCounts[video.id]) }}</span>
                </button>
                
                <button 
                  class="action-btn" 
                  @click.stop="toggleFavorite(video.id)"
                  @touchstart.stop="handleActionTouchStart"
                  @touchend.stop="(e) => handleActionTouchEnd(e, () => toggleFavorite(video.id))"
                >
                  <div class="action-icon" :class="{ 'favorited': isFavorited[video.id] }">
                    <svg viewBox="0 0 24 24"><path d="M6 2a2 2 0 00-2 2v16l8-4 8 4V4a2 2 0 00-2-2H6z" /></svg>
                  </div>
                  <span class="action-count">{{ formatCount(favoriteCounts[video.id]) }}</span>
                </button>
                
                <button class="action-btn">
                  <div class="action-icon">
                    <svg viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" /></svg>
                  </div>
                  <span class="action-count">分享</span>
                </button>
              </div>
            </div>
          </div>
          
          <!-- 加载更多指示器 -->
          <div v-if="isLoading" class="feed-loading">
            <div class="feed-loading-spinner"></div>
            <span>加载中...</span>
          </div>
        </div>
        
        <!-- 底部导航栏 -->
        <div class="feed-bottom-nav">
          <div class="nav-item active">
            <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
            <span>首页</span>
          </div>
          <div class="nav-item">
            <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
            <span>发现</span>
          </div>
          <div class="nav-item">
            <div class="nav-add-btn">
              <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
            </div>
          </div>
          <div class="nav-item">
            <svg viewBox="0 0 24 24"><path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z" /></svg>
            <span>动态</span>
          </div>
          <div class="nav-item">
            <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
            <span>我的</span>
          </div>
        </div>
      </section>

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
               @click="router.push(`/video/${video.id}`)">
            <div class="relative aspect-video group">
              <img :src="video.cover" :alt="video.title" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
              <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div class="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-md">
                {{ video.duration }}
              </div>
              <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div class="w-12 h-12 bg-purple-600/90 rounded-full flex items-center justify-center">
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

      <!-- 视频网格 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6" v-if="!isMobile">
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
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import NavHeader from '../components/NavHeader.vue'
import { useUserStore } from '../stores/userStore'

// 使用全局用户状态
const userStore = useUserStore()

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
const loginForm = ref({
  username: '',
  password: ''
})
const loginError = ref('')

// 处理用户头像点击
const handleUserIconClick = () => {
  if (!userStore.isLoggedIn) {
    showLoginModal.value = true
  } else {
    // 已登录状态下跳转到用户主页
    router.push(`/user/${userStore.userId || '12345678'}`)
  }
}

// 处理登录
const handleLogin = () => {
  // 这里应该是实际的登录API调用
  // 这里使用模拟登录逻辑
  if (loginForm.value.username && loginForm.value.password) {
    if (loginForm.value.password === '123456') { // 简单的密码验证
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
    uploader: '科技前沿'
  },
  {
    id: 2,
    title: '如何在30天内掌握Vue 3和TypeScript',
    cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=300&q=80',
    duration: '25:12',
    uploader: '编程学院'
  },
  {
    id: 3,
    title: '探秘世界上最神奇的十大自然现象',
    cover: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=300&q=80',
    duration: '18:45',
    uploader: '自然探索'
  },
  {
    id: 4,
    title: '2025年最热门的旅游目的地推荐',
    cover: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=300&q=80',
    duration: '14:22',
    uploader: '环球旅行'
  },
  {
    id: 5,
    title: '美食博主带你探店：城市里的隐藏菜单',
    cover: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=300&q=80',
    duration: '09:55',
    uploader: '吃货小分队'
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
    danmaku: '1.8万'
  },
  {
    id: 2,
    title: '2025年最受欢迎的十大游戏',
    cover: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=300&q=80',
    duration: '20:18',
    uploader: '游戏玩家',
    playCount: '78万',
    danmaku: '2.5万'
  },
  {
    id: 3,
    title: '现代流行音乐制作全攻略',
    cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=300&q=80',
    duration: '32:10',
    uploader: '音乐制作人',
    playCount: '45万',
    danmaku: '9800'
  },
  {
    id: 4,
    title: '量子计算机入门教程',
    cover: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=300&q=80',
    duration: '28:45',
    uploader: '量子科学',
    playCount: '32万',
    danmaku: '1.1万'
  },
  {
    id: 5,
    title: '2025年春季时尚趋势预测',
    cover: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=300&q=80',
    duration: '16:20',
    uploader: '时尚前沿',
    playCount: '67万',
    danmaku: '2.3万'
  },
  {
    id: 6,
    title: '世界杯精彩瞬间回顾',
    cover: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=300&q=80',
    duration: '22:30',
    uploader: '体育频道',
    playCount: '120万',
    danmaku: '5.6万'
  },
  {
    id: 7,
    title: '亚洲美食之旅：日本篇',
    cover: 'https://images.unsplash.com/photo-1540648639573-8c848de23f0a?auto=format&fit=crop&w=300&q=80',
    duration: '19:15',
    uploader: '美食家',
    playCount: '56万',
    danmaku: '1.9万'
  },
  {
    id: 8,
    title: '探索北欧隐秘的自然风光',
    cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=300&q=80',
    duration: '24:50',
    uploader: '旅行达人',
    playCount: '43万',
    danmaku: '1.4万'
  }
]

/* Feed视频相关状态 */
// 视频数据源 - 模拟API数据
const allVideos = ref<any[]>([])
const pageSize = 5 // 每次加载5条视频
const currentPage = ref(1)
const isLoading = ref(false)
const hasMore = ref(true)
const feedContainer = ref<HTMLElement | null>(null)
const videoRefs = ref<HTMLElement[]>([])
const currentVideoIndex = ref(0)
const isPlaying = ref<Record<number, boolean>>({})
const videoProgress = ref<Record<string, string>>({})
const touchStartY = ref(0)
const touchDeltaY = ref(0)
const isDragging = ref(false)
const dragThreshold = 50 // 拖动阈值，超过这个值才会触发翻页
const animating = ref(false)

// 视频点击相关变量
const touchStartTime = ref(0)
const touchStartX = ref(0)
const touchMoved = ref(false)

// 音频控制相关状态
const isMuted = ref(false) // 默认不静音
const volumeLevel = ref(0.7) // 默认音量70%
const showVolumeSlider = ref(false) // 控制音量滑块显示
let volumeSliderTimeout: number | null = null // 用于控制音量滑块自动隐藏

// 生成更多视频数据
const generateMoreVideos = (page: number, size: number) => {
  const startId = (page - 1) * size + 1
  const newVideos = []
  
  for (let i = 0; i < size; i++) {
    const id = startId + i + 100 // 避免ID冲突
    newVideos.push({
      id,
      title: `${page}页第${i+1}个视频 - ${['抖音热门', '哔哩哔哩精选', '小红书爆款'][Math.floor(Math.random() * 3)]}视频内容`,
      cover: `https://picsum.photos/1080/1920?random=${id}`,
      duration: `${Math.floor(Math.random() * 2) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      uploader: ['哔哩哔哩', '抖音达人', '小红书博主', '视频创作者', '热门UP主'][Math.floor(Math.random() * 5)],
      playCount: `${Math.floor(Math.random() * 100) + 1}万`,
      danmaku: `${Math.floor(Math.random() * 1000) + 1}`,
      videoUrl: null // 实际项目中这里应该是真实视频URL
    })
  }
  
  return newVideos
}

// 初始化视频数据
const initVideos = () => {
  // 首先使用已有的videos数据
  allVideos.value = [...videos]
  
  // 然后添加更多视频以确保有足够数据
  const additionalVideos = generateMoreVideos(1, pageSize)
  allVideos.value = [...allVideos.value, ...additionalVideos]
  
  // 初始化视频状态
  allVideos.value.forEach(v => {
    likeCounts.value[v.id] = Math.floor(Math.random() * 50000) + 1000
    favoriteCounts.value[v.id] = Math.floor(Math.random() * 30000) + 500
    commentCounts.value[v.id] = Math.floor(Math.random() * 10000) + 100
    isLiked.value[v.id] = false
    isFavorited.value[v.id] = false
    isPlaying.value[v.id] = false
    videoProgress.value[v.id] = '0%'
  })
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
      
      // 初始化新视频的状态
      newVideos.forEach(v => {
        likeCounts.value[v.id] = Math.floor(Math.random() * 50000) + 1000
        favoriteCounts.value[v.id] = Math.floor(Math.random() * 30000) + 500
        commentCounts.value[v.id] = Math.floor(Math.random() * 10000) + 100
        isLiked.value[v.id] = false
        isFavorited.value[v.id] = false
        isPlaying.value[v.id] = false
        videoProgress.value[v.id] = '0%'
      })
    }
  } catch (error) {
    console.error('加载视频失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 处理滚动事件，检测是否需要加载更多视频
const handleScroll = () => {
  if (!feedContainer.value) return
  
  const container = feedContainer.value
  const scrollPosition = container.scrollTop
  const containerHeight = container.clientHeight
  const contentHeight = container.scrollHeight
  
  // 当滚动到接近底部时加载更多
  if (contentHeight - (scrollPosition + containerHeight) < containerHeight * 0.5) {
    loadMoreVideos()
  }
  
  // 确定当前视频索引
  const videoHeight = containerHeight
  const currentIndex = Math.floor(scrollPosition / videoHeight)
  
  if (currentVideoIndex.value !== currentIndex && !animating.value) {
    updateCurrentVideo(currentIndex)
  }
}

// 更新当前视频
const updateCurrentVideo = (index: number) => {
  if (index < 0 || index >= displayedVideos.value.length) return
  
  // 暂停当前视频
  pauseAllVideos()
  
  // 更新索引
  currentVideoIndex.value = index
  
  // 播放新的当前视频
  nextTick(() => {
    const videoElements = document.querySelectorAll('.feed-item.active video') as NodeListOf<HTMLVideoElement>
    if (videoElements && videoElements.length > 0) {
      const video = videoElements[0]
      if (video) {
        // 设置音量和静音状态
        video.muted = isMuted.value
        video.volume = parseFloat(volumeLevel.value.toString())
        video.currentTime = 0
        
        video.play()
          .then(() => {
            const videoId = displayedVideos.value[index].id
            isPlaying.value[videoId] = true
            
            // 更新进度条
            updateVideoProgress(video, videoId)
          })
          .catch(err => console.error('视频播放失败:', err))
      }
    }
  })
}

// 暂停所有视频
const pauseAllVideos = () => {
  const videos = document.querySelectorAll('.feed-item video') as NodeListOf<HTMLVideoElement>
  videos.forEach(video => {
    video.pause()
    if (video.parentElement?.parentElement) {
      const feedItem = video.parentElement.parentElement
      const index = Array.from(feedItem.parentElement?.children || []).indexOf(feedItem)
      if (index >= 0 && index < displayedVideos.value.length) {
        const videoId = displayedVideos.value[index].id
        isPlaying.value[videoId] = false
      }
    }
  })
}

// 更新视频进度条
const updateVideoProgress = (video: HTMLVideoElement, videoId: number) => {
  const updateProgress = () => {
    if (video.duration) {
      const progress = (video.currentTime / video.duration) * 100
      videoProgress.value[videoId] = `${progress}%`
    }
    
    if (!video.paused) {
      requestAnimationFrame(updateProgress)
    }
  }
  
  requestAnimationFrame(updateProgress)
}

// 进度条拖动相关变量
const isDraggingProgress = ref(false)
const currentDraggingVideoId = ref<number | null>(null)
let currentDraggingVideo: HTMLVideoElement | null = null

// 处理进度条点击
const handleProgressClick = (event: MouseEvent | TouchEvent, videoId: number) => {
  event.stopPropagation()
  
  // 获取当前视频元素
  const videoElements = document.querySelectorAll(`.feed-item.active video`) as NodeListOf<HTMLVideoElement>
  if (!videoElements || videoElements.length === 0) return
  
  const video = videoElements[0]
  if (!video || !video.duration) return
  
  // 获取进度条元素
  const progressBar = (event.currentTarget as HTMLElement)
  const rect = progressBar.getBoundingClientRect()
  
  // 计算点击位置相对于进度条的百分比
  let clientX: number
  if ('touches' in event) {
    // 触摸事件
    clientX = event.touches[0].clientX
  } else {
    // 鼠标事件
    clientX = event.clientX
  }
  
  const clickPosition = (clientX - rect.left) / rect.width
  const newTime = video.duration * Math.max(0, Math.min(1, clickPosition))
  
  // 更新视频时间
  video.currentTime = newTime
  
  // 更新进度条显示
  const progress = (newTime / video.duration) * 100
  videoProgress.value[videoId] = `${progress}%`
}

// 开始拖动进度条
const startProgressDrag = (event: MouseEvent | TouchEvent, videoId: number) => {
  event.stopPropagation()
  event.preventDefault()
  
  // 获取当前视频元素
  const videoElements = document.querySelectorAll(`.feed-item.active video`) as NodeListOf<HTMLVideoElement>
  if (!videoElements || videoElements.length === 0) return
  
  const video = videoElements[0]
  if (!video) return
  
  // 设置拖动状态
  isDraggingProgress.value = true
  currentDraggingVideoId.value = videoId
  currentDraggingVideo = video
  
  // 暂停视频播放
  const wasPlaying = !video.paused
  if (wasPlaying) {
    video.pause()
    isPlaying.value[videoId] = false
  }
  
  // 添加拖动样式
  const progressBar = (event.currentTarget as HTMLElement)
  progressBar.classList.add('dragging')
  
  // 添加事件监听
  const handleMove = (e: MouseEvent | TouchEvent) => updateProgressDrag(e, videoId, progressBar)
  const handleEnd = (e: MouseEvent | TouchEvent) => endProgressDrag(e, videoId, wasPlaying, progressBar)
  
  document.addEventListener('mousemove', handleMove as any)
  document.addEventListener('touchmove', handleMove as any, { passive: false })
  document.addEventListener('mouseup', handleEnd as any)
  document.addEventListener('touchend', handleEnd as any)
  
  // 初始更新位置
  updateProgressDrag(event, videoId, progressBar)
}

// 更新拖动中的进度条
const updateProgressDrag = (event: MouseEvent | TouchEvent, videoId: number, progressBar: HTMLElement) => {
  if (!isDraggingProgress.value || !currentDraggingVideo || currentDraggingVideoId.value !== videoId) return
  
  event.preventDefault()
  
  const rect = progressBar.getBoundingClientRect()
  
  // 获取触摸/鼠标位置
  let clientX: number
  if ('touches' in event) {
    clientX = event.touches[0].clientX
  } else {
    clientX = event.clientX
  }
  
  // 计算新的进度
  const position = (clientX - rect.left) / rect.width
  const clampedPosition = Math.max(0, Math.min(1, position))
  
  // 更新视频时间
  if (currentDraggingVideo.duration) {
    const newTime = currentDraggingVideo.duration * clampedPosition
    currentDraggingVideo.currentTime = newTime
    
    // 更新进度条显示
    const progress = (newTime / currentDraggingVideo.duration) * 100
    videoProgress.value[videoId] = `${progress}%`
  }
}

// 结束拖动进度条
const endProgressDrag = (event: MouseEvent | TouchEvent, videoId: number, wasPlaying: boolean, progressBar: HTMLElement) => {
  if (!isDraggingProgress.value || currentDraggingVideoId.value !== videoId) return
  
  // 移除事件监听
  document.removeEventListener('mousemove', updateProgressDrag as any)
  document.removeEventListener('touchmove', updateProgressDrag as any)
  document.removeEventListener('mouseup', endProgressDrag as any)
  document.removeEventListener('touchend', endProgressDrag as any)
  
  // 重置状态
  isDraggingProgress.value = false
  currentDraggingVideoId.value = null
  
  // 移除拖动样式
  progressBar.classList.remove('dragging')
  
  // 如果之前在播放，则恢复播放
  if (wasPlaying && currentDraggingVideo) {
    currentDraggingVideo.play()
      .then(() => {
        isPlaying.value[videoId] = true
      })
      .catch(err => console.error('恢复视频播放失败:', err))
  }
  
  currentDraggingVideo = null
}

// 切换视频播放/暂停
const toggleVideoPlay = (event: Event, index: number) => {
  // 阻止事件冒泡，防止触发其他点击事件
  event.stopPropagation()
  
  // 如果正在拖动进度条，不处理点击事件
  if (isDraggingProgress.value) return
  
  // 获取当前视频ID和元素
  const videoId = displayedVideos.value[index].id
  
  // 使用更可靠的选择器，确保在移动端也能正确找到视频元素
  const videoElements = document.querySelectorAll(`.feed-item.active video`) as NodeListOf<HTMLVideoElement>
  
  if (videoElements && videoElements.length > 0) {
    const video = videoElements[0]
    
    console.log('切换视频播放状态:', video.paused ? '播放' : '暂停')
    
    if (video.paused) {
      // 播放视频
      video.play()
        .then(() => {
          isPlaying.value[videoId] = true
          updateVideoProgress(video, videoId)
          console.log('视频开始播放')
        })
        .catch(err => {
          console.error('视频播放失败:', err)
          // 在移动端，可能需要用户交互才能播放
          // 显示提示或其他反馈
        })
    } else {
      // 暂停视频
      video.pause()
      isPlaying.value[videoId] = false
      console.log('视频已暂停')
    }
  } else {
    console.warn('未找到视频元素')
  }
}

// 处理视频触摸开始事件
const handleVideoTouchStart = (event: TouchEvent, index: number) => {
  // 记录触摸开始时间和位置
  touchStartTime.value = Date.now()
  touchStartX.value = event.touches[0].clientX
  touchStartY.value = event.touches[0].clientY
  touchMoved.value = false
}

// 处理视频触摸结束事件
const handleVideoTouchEnd = (event: TouchEvent, index: number) => {
  // 如果触摸移动距离很小，且时间短，则视为点击
  const touchEndTime = Date.now()
  const touchDuration = touchEndTime - touchStartTime.value
  
  // 如果触摸时间小于300ms且没有明显移动，则视为点击
  if (touchDuration < 300 && !touchMoved.value) {
    event.preventDefault()
    event.stopPropagation()
    toggleVideoPlay(event, index)
  }
}

// 处理操作按钮的触摸事件
const handleActionTouchStart = (event: TouchEvent) => {
  event.stopPropagation()
  touchStartTime.value = Date.now()
  touchMoved.value = false
}

const handleActionTouchEnd = (event: TouchEvent, callback: () => void) => {
  event.stopPropagation()
  const touchEndTime = Date.now()
  const touchDuration = touchEndTime - touchStartTime.value
  
  if (touchDuration < 300 && !touchMoved.value) {
    callback()
  }
}

// 切换静音状态
const toggleMute = (event: Event) => {
  event.stopPropagation()
  isMuted.value = !isMuted.value
  
  // 更新所有视频的静音状态
  const videos = document.querySelectorAll('.feed-item video') as NodeListOf<HTMLVideoElement>
  videos.forEach(video => {
    video.muted = isMuted.value
  })
  
  // 显示音量滑块
  if (!isMuted.value) {
    showVolumeSlider.value = true
    
    // 5秒后自动隐藏音量滑块
    if (volumeSliderTimeout) {
      clearTimeout(volumeSliderTimeout)
    }
    
    volumeSliderTimeout = window.setTimeout(() => {
      showVolumeSlider.value = false
    }, 5000)
  } else {
    showVolumeSlider.value = false
  }
}

// 更新音量
const updateVolume = () => {
  const videos = document.querySelectorAll('.feed-item video') as NodeListOf<HTMLVideoElement>
  videos.forEach(video => {
    video.volume = parseFloat(volumeLevel.value.toString())
  })
  
  // 重置自动隐藏计时器
  if (volumeSliderTimeout) {
    clearTimeout(volumeSliderTimeout)
  }
  
  volumeSliderTimeout = window.setTimeout(() => {
    showVolumeSlider.value = false
  }, 5000)
}

// 触摸事件处理
const handleTouchStart = (e: TouchEvent) => {
  touchStartY.value = e.touches[0].clientY
  isDragging.value = true
  touchDeltaY.value = 0
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return
  
  const currentY = e.touches[0].clientY
  touchDeltaY.value = currentY - touchStartY.value
  
  // 如果拖动距离超过阈值，应用变换效果
  if (Math.abs(touchDeltaY.value) > 20) {
    e.preventDefault() // 阻止默认滚动
  }
}

const handleTouchEnd = () => {
  if (!isDragging.value) return
  
  isDragging.value = false
  
  // 如果拖动距离超过阈值，切换视频
  if (Math.abs(touchDeltaY.value) > dragThreshold) {
    animating.value = true
    
    if (touchDeltaY.value > 0 && currentVideoIndex.value > 0) {
      // 向下拖动，显示上一个视频
      smoothScrollToVideo(currentVideoIndex.value - 1)
    } else if (touchDeltaY.value < 0 && currentVideoIndex.value < displayedVideos.value.length - 1) {
      // 向上拖动，显示下一个视频
      smoothScrollToVideo(currentVideoIndex.value + 1)
    } else {
      // 回弹到当前视频
      smoothScrollToVideo(currentVideoIndex.value)
    }
  } else {
    // 拖动距离不够，回弹到当前视频
    smoothScrollToVideo(currentVideoIndex.value)
  }
  
  touchDeltaY.value = 0
}

// 平滑滚动到指定视频
const smoothScrollToVideo = (index: number) => {
  if (!feedContainer.value) return
  
  const targetPosition = index * feedContainer.value.clientHeight
  
  feedContainer.value.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
  })
  
  // 动画结束后重置状态
  setTimeout(() => {
    animating.value = false
    updateCurrentVideo(index)
  }, 300)
}

// 获取视频样式（用于拖动效果）
const getVideoStyle = (index: number) => {
  if (!isDragging.value || index !== currentVideoIndex.value) return {}
  
  // 计算拖动时的变换效果
  const translateY = touchDeltaY.value * 0.5 // 减小拖动效果，使其更自然
  const scale = Math.max(0.95, 1 - Math.abs(touchDeltaY.value) * 0.001) // 缩小效果
  
  return {
    transform: `translateY(${translateY}px) scale(${scale})`,
    transition: isDragging.value ? 'none' : 'transform 0.3s ease'
  }
}

/* 互动计数与操作（示例） */
const likeCounts = ref<Record<number, number>>({})
const favoriteCounts = ref<Record<number, number>>({})
const commentCounts = ref<Record<number, number>>({})
const isLiked = ref<Record<number, boolean>>({})
const isFavorited = ref<Record<number, boolean>>({})
const showComments = ref(false)
const currentVideoId = ref<number | null>(null)

// 格式化数字显示（例如：1.2k, 3.5w）
const formatCount = (count: number): string => {
  if (!count) return '0';
  if (count < 1000) return String(count);
  if (count < 10000) return (count / 1000).toFixed(1) + 'k';
  return (count / 10000).toFixed(1) + 'w';
}

const toggleLike = (id: number) => {
  isLiked.value[id] = !isLiked.value[id]
  if (isLiked.value[id]) {
    likeCounts.value[id] = (likeCounts.value[id] || 0) + 1
  } else {
    likeCounts.value[id] = Math.max(0, (likeCounts.value[id] || 0) - 1)
  }
}

const toggleFavorite = (id: number) => {
  isFavorited.value[id] = !isFavorited.value[id]
  if (isFavorited.value[id]) {
    favoriteCounts.value[id] = (favoriteCounts.value[id] || 0) + 1
  } else {
    favoriteCounts.value[id] = Math.max(0, (favoriteCounts.value[id] || 0) - 1)
  }
}

const openComments = (id: number) => {
  currentVideoId.value = id
  showComments.value = true
  // 这里可以打开评论面板；暂时模拟数量递增
  commentCounts.value[id] = (commentCounts.value[id] || 0) + 1
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % carouselSlides.length
}

const startAutoSlide = () => {
  slideInterval = setInterval(nextSlide, 4000)
}

onMounted(() => {
  startAutoSlide()
  window.addEventListener('resize', updateIsMobile)
  
  // 初始化Feed视频数据
  initVideos()
  
  // 设置初始视频
  nextTick(() => {
    if (isMobile.value) {
      updateCurrentVideo(0)
      
      // 初始化音频控制
      // 由于自动播放策略，首次可能需要用户交互才能播放声音
      const videos = document.querySelectorAll('.feed-item video') as NodeListOf<HTMLVideoElement>
      videos.forEach(video => {
        video.muted = isMuted.value
        video.volume = parseFloat(volumeLevel.value.toString())
      })
      
      // 添加音量滑块自动隐藏
      document.addEventListener('click', () => {
        if (showVolumeSlider.value) {
          showVolumeSlider.value = false
        }
      })
    }
  })
})

onUnmounted(() => {
  if (slideInterval) {
    clearInterval(slideInterval)
  }
  window.removeEventListener('resize', updateIsMobile)
  
  // 暂停所有视频
  pauseAllVideos()
  
  // 清理音量滑块计时器
  if (volumeSliderTimeout) {
    clearTimeout(volumeSliderTimeout)
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
/* 移动端 Feed 样式 - 抖音/哔哩哔哩/小红书风格 */
.mobile-feed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 40;
  background-color: #000;
}

.feed-container {
  height: 100%;
  width: 100%;
  position: relative;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  -webkit-overflow-scrolling: touch;
  /* 隐藏滚动条但保留功能 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.feed-container::-webkit-scrollbar {
  display: none; /* Chrome/Safari/Opera */
}

.feed-item {
  position: relative;
  height: 100%;
  width: 100%;
  scroll-snap-align: start;
  overflow: hidden;
  will-change: transform; /* 优化性能 */
  transition: transform 0.3s ease;
}

.feed-item.active {
  z-index: 2;
}

.feed-media-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.feed-media {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background-color: #000;
}

.feed-video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3; /* 确保覆盖层在视频上方，但在其他控件下方 */
  cursor: pointer;
  -webkit-tap-highlight-color: transparent; /* 移除移动端点击高亮 */
  touch-action: manipulation; /* 优化触摸响应 */
}

.feed-play-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 3;
}

.feed-play-btn {
  width: 64px;
  height: 64px;
  opacity: 0.8;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
}

/* 音量控制样式 */
.feed-volume-control {
  position: absolute;
  bottom: 20px;
  left: 20px;
  width: 36px;
  height: 36px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  cursor: pointer;
  pointer-events: auto;
}

.feed-volume-control svg {
  width: 24px;
  height: 24px;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5));
}

.feed-volume-slider {
  position: absolute;
  bottom: 20px;
  left: 65px;
  width: 100px;
  height: 36px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  padding: 0 10px;
  pointer-events: auto;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}

.volume-range {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  outline: none;
}

.volume-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #FF2B54;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}

.volume-range::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #FF2B54;
  cursor: pointer;
  border: none;
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}

.feed-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px; /* 移动端适中的高度 */
  background: rgba(255, 255, 255, 0.3);
  z-index: 4;
  cursor: pointer;
  padding: 12px 0; /* 增大触摸区域 */
  margin-bottom: -12px; /* 负边距补偿 */
  -webkit-tap-highlight-color: transparent; /* 移除移动端点击高亮 */
}

/* 移动端进度条增强 */
@media (max-width: 768px) {
  .feed-progress {
    height: 6px; /* 移动端稍微增加高度 */
    padding: 15px 0; /* 更大的触摸区域 */
    margin-bottom: -15px;
    background: rgba(255, 255, 255, 0.4); /* 增加可见度 */
  }
  
  .feed-progress-inner::after {
    width: 16px !important; /* 移动端更大的拖动手柄 */
    height: 16px !important;
    right: -8px !important;
    display: block !important; /* 移动端始终显示拖动手柄 */
  }
}

.feed-progress-inner {
  height: 100%;
  background: #FF2B54;
  transition: width 0.1s linear;
  border-radius: 5px; /* 圆角边框 */
  position: relative;
}

.feed-progress-inner::after {
  content: '';
  position: absolute;
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  background: #FF2B54;
  border-radius: 50%;
  box-shadow: 0 0 5px rgba(255, 43, 84, 0.8);
  display: none; /* 默认隐藏，拖动时显示 */
}

.feed-progress:hover .feed-progress-inner::after,
.feed-progress.dragging .feed-progress-inner::after {
  display: block; /* 悬停或拖动时显示拖动手柄 */
}

.feed-content-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  pointer-events: none;
  background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0) 60%);
  z-index: 2;
}

.feed-author-info {
  display: flex;
  align-items: flex-end;
  padding: 16px;
  margin-bottom: 48px;
  pointer-events: auto;
}

.feed-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #fff;
  margin-right: 12px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.feed-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.feed-user-info {
  flex: 1;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}

.feed-username {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.feed-description {
  font-size: 14px;
  margin-bottom: 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.feed-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.feed-tag {
  font-size: 12px;
  color: #fff;
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 4px;
  backdrop-filter: blur(4px);
}

.feed-follow-btn {
  background: #7C3AED;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 14px;
  font-weight: 600;
  margin-left: 12px;
  pointer-events: auto;
  box-shadow: 0 2px 8px rgba(124,58,237,0.5);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.feed-follow-btn:active {
  transform: scale(0.95);
  box-shadow: 0 1px 4px rgba(124,58,237,0.5);
}

.feed-actions {
  position: absolute;
  right: 12px;
  bottom: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  pointer-events: auto;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: transparent;
  border: none;
  color: #fff;
  padding: 0;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.action-btn:active {
  transform: scale(0.9);
}

.action-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
  position: relative;
}

.action-icon svg {
  width: 32px;
  height: 32px;
  fill: #fff;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5));
}

.action-count {
  font-size: 12px;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}

.liked svg {
  fill: #7C3AED;
  animation: like-animation 0.5s ease;
}

.favorited svg {
  fill: #4F46E5;
  animation: favorite-animation 0.5s ease;
}

@keyframes like-animation {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

@keyframes favorite-animation {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

/* 加载更多指示器 */
.feed-loading {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
  gap: 10px;
}

.feed-loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 底部导航栏 */
.feed-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 50;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 10px;
  transition: transform 0.2s ease, color 0.2s ease;
}

.nav-item:active {
  transform: scale(0.9);
}

.nav-item svg {
  width: 24px;
  height: 24px;
  fill: currentColor;
  margin-bottom: 2px;
}

.nav-item.active {
  color: #FF2B54;
}

.nav-add-btn {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #FF2B54, #FF4F8B);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: -10px;
  box-shadow: 0 4px 10px rgba(255,43,84,0.5);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.nav-add-btn:active {
  transform: scale(0.95);
  box-shadow: 0 2px 5px rgba(255,43,84,0.5);
}

.nav-add-btn svg {
  width: 24px;
  height: 24px;
  fill: #fff;
  margin: 0;
}

@media (min-width: 769px) {
  .mobile-feed {
    display: none;
  }
}
</style>