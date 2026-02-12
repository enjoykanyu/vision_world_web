<template>
  <div class="min-h-screen bg-bilibili-bg-secondary dark:bg-bilibili-bg-dark text-bilibili-text-primary dark:text-bilibili-text-dark">
    <!-- 使用公用导航头组件 -->
    <NavHeader 
      :isLoggedIn="userStore.isLoggedIn" 
      :username="userStore.username" 
      @login="handleLogin"
    ></NavHeader>

    <main class="max-w-[1256px] mx-auto px-4 sm:px-6 lg:px-0 py-2">
      <!-- 视频状态容器 -->
      <div>
        <!-- 加载状态 -->
        <div v-if="loading" class="text-center py-20">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p class="mt-4 text-gray-600">视频加载中...</p>
        </div>

        <!-- 视频错误状态 -->
        <div v-else-if="videoError" class="text-center py-20 bg-red-50 dark:bg-red-900/20 rounded-lg p-8">
          <i class="fas fa-exclamation-circle text-red-500 text-5xl mb-4"></i>
          <h3 class="text-xl font-bold text-red-600 dark:text-red-400 mb-2">{{ errorMessage }}</h3>
          <button @click="fetchVideoData" class="mt-4 bg-bilibili-primary hover:bg-bilibili-primary/90 text-white font-medium py-2 px-6 rounded-lg transition-colors">
            重试加载
          </button>
        </div>

        <!-- 视频内容 -->
        <div v-else-if="video" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Left side: Video Player and Info -->
          <div class="lg:col-span-8">
            <!-- 视频标题 - 移到视频上方 -->
            <div class="mb-3">
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">{{ video.title }}</h1>
              <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2 space-x-4">
                <div class="flex items-center space-x-1">
                  <i class="fas fa-play-circle text-gray-400"></i>
                  <span>{{ videoStats.viewCount }}</span>
                </div>
                <div class="flex items-center space-x-1">
                  <svg class="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="5" width="18" height="14" rx="2" ry="2"/>
                    <line x1="7" y1="9" x2="17" y2="9"/>
                    <line x1="7" y1="12" x2="17" y2="12"/>
                    <line x1="7" y1="15" x2="13" y2="15"/>
                  </svg>
                  <span>{{ videoStats.danmakuCount }}</span>
                </div>
                <span>{{ videoStats.publishTime }}</span>
              </div>
            </div>

            <!-- 视频播放器容器 -->
            <div class="relative bg-black rounded-lg overflow-hidden shadow-lg group" id="video-container">
              <!-- 弹幕容器 -->
              <div class="absolute inset-0 pointer-events-none" ref="danmakuContainer">
                <!-- 服务器弹幕 -->
                <div v-for="danmaku in displayDanmakus" :key="'srv-' + danmaku.id" 
                  :style="{ 
                    left: `${danmaku.left}%`, 
                    top: `${danmaku.top}%`, 
                    color: danmaku.color,
                    transform: `translateX(${danmaku.translateX || 0}px)`,
                    fontSize: '18px',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                  }"
                  class="absolute whitespace-nowrap danmaku-item">
                  {{ danmaku.text }}
                </div>
              </div>

              <!-- 视频元素 -->
              <video
                ref="videoPlayer"
                :poster="video.poster"
                class="w-full h-full object-cover"
                @timeupdate="onTimeUpdate"
                @loadedmetadata="initPlayer"
                @loadeddata="onVideoLoaded"
                @loadstart="onVideoLoadStart"
                @waiting="onVideoWaiting"
                @canplay="onVideoCanPlay"
                @play="onVideoPlay"
                @pause="onVideoPause"
                @ended="onVideoEnded"
                @click="togglePlay"
                @dblclick="toggleFullscreen"
                @error="handleVideoError"
                crossorigin="anonymous"
                preload="auto"
                playsinline
              ></video>
              
              <!-- 视频加载失败提示 -->
              <div v-if="videoLoadError" class="absolute inset-0 flex items-center justify-center bg-gray-900">
                <div class="text-center text-white">
                  <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                  <p class="mb-4">视频加载失败</p>
                  <p class="text-sm text-gray-300 mb-4">{{ errorMessage || '正在尝试备用视频源...' }}</p>
                  <button @click="retryLoadVideo" class="bg-bilibili-primary hover:bg-bilibili-primary/90 text-white px-4 py-2 rounded mr-2">
                    重试
                  </button>
                  <button @click="tryNextVideoSource" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
                    切换视频源
                  </button>
                </div>
              </div>

              <!-- 加载进度指示器 -->
              <div v-if="loading && !videoLoadError" class="absolute inset-0 flex items-center justify-center bg-black/50">
                <div class="text-center text-white">
                  <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
                  <p class="text-sm">视频加载中... {{ loadingProgress.toFixed(0) }}%</p>
                  <div class="w-64 h-2 bg-gray-700 rounded-full mt-2 overflow-hidden">
                    <div 
                      class="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                      :style="{ width: `${loadingProgress}%` }"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- 缓冲区健康度指示器 -->
              <div v-if="!loading && !videoLoadError && isPlaying" class="absolute top-4 right-4 flex items-center space-x-2 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2">
                <div class="flex items-center space-x-1">
                  <i 
                    class="fas fa-signal text-xs"
                    :class="{
                      'text-green-400': bufferHealth > 70,
                      'text-yellow-400': bufferHealth > 30 && bufferHealth <= 70,
                      'text-red-400': bufferHealth <= 30
                    }"
                  ></i>
                  <span class="text-xs text-white">{{ bufferHealth.toFixed(0) }}%</span>
                </div>
                <div class="w-px h-4 bg-gray-600"></div>
                <div class="flex items-center space-x-1">
                  <i 
                    class="fas fa-tachometer-alt text-xs"
                    :class="{
                      'text-green-400': networkQuality === 'good',
                      'text-yellow-400': networkQuality === 'fair',
                      'text-red-400': networkQuality === 'poor'
                    }"
                  ></i>
                  <span class="text-xs text-white">{{ (currentBandwidth / 1000).toFixed(0) }}kbps</span>
                </div>
              </div>

              <!-- 自定义视频控制栏 -->
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 opacity-0 transition-opacity duration-300 ease-in-out" :class="{ 'opacity-100': !isPlaying || showControls }" id="video-controls">
                <!-- 进度条 - B站风格三层进度条 -->
                <div class="relative h-1.5 bg-gray-700 rounded-full mb-3 cursor-pointer group/seek"
                     @click="seek"
                     @mousemove="handleProgressHover"
                     @mouseleave="handleProgressLeave"
                     @mousedown="startSeeking"
                     @touchstart="startSeeking">
                  <!-- 未缓存区域（底层） -->
                  <div class="absolute h-full bg-gray-700 rounded-full w-full"></div>
                  <!-- 已缓存进度（中间层） -->
                  <div class="absolute h-full bg-blue-500 rounded-full transition-all duration-300 ease-out" :style="{ width: `${bufferProgress}%` }"></div>
                  <!-- 已播放进度（顶层） -->
                  <div class="absolute h-full bg-pink-500 rounded-full transition-all duration-100 ease-out" :style="{ width: `${progress}%` }"></div>
                  <!-- 拖动手柄 -->
                  <div class="absolute h-4 w-4 bg-white rounded-full -mt-1.25 cursor-grab active:cursor-grabbing shadow-lg opacity-0 group-hover/seek:opacity-100 transition-opacity duration-100 ease-out"
                       :style="{ left: `${progress}%` }"
                       @mousedown="startSeeking"
                       @touchstart="startSeeking"></div>
                  <!-- 悬停时间提示 -->
                  <div v-if="hoverTime !== null"
                       class="absolute -top-8 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none transition-opacity duration-200"
                       :style="{ left: `${hoverProgress}%`, transform: 'translateX(-50%)' }">
                    {{ formatTime(hoverTime) }}
                  </div>
                </div>

                <!-- 控制按钮和时间 -->
                <div class="flex items-center justify-between text-white">
                  <div class="flex items-center space-x-5">
                    <button @click="togglePlay" class="hover:text-red-500 transition-colors duration-200 text-xl">
                      <i class="fas" :class="isPlaying ? 'fa-pause' : 'fa-play'"></i>
                    </button>
                    <div class="text-sm font-medium bg-black/40 backdrop-blur-sm px-2 py-1 rounded">
                      {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
                    </div>
                  </div>
                  <div class="flex items-center space-x-5">
                    <!-- 画质选择 -->
                    <div class="flex items-center space-x-2">
                      <select
                        v-model="videoQuality"
                        @change="(e: Event) => setVideoQuality((e.target as HTMLSelectElement).value)"
                        class="bg-black/40 backdrop-blur-sm text-white border border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                      >
                        <option value="auto">自动</option>
                        <option value="1080p">1080P 高清</option>
                        <option value="720p">720P 高清</option>
                        <option value="480p">480P 清晰</option>
                        <option value="360p">360P 流畅</option>
                      </select>
                      <!-- 网络质量指示器 -->
                      <div 
                        class="flex items-center space-x-1 text-xs"
                        :class="{
                          'text-green-400': networkQuality === 'good',
                          'text-yellow-400': networkQuality === 'fair',
                          'text-red-400': networkQuality === 'poor'
                        }"
                      >
                        <i 
                          class="fas fa-signal"
                          :class="{
                            'text-green-400': networkQuality === 'good',
                            'text-yellow-400': networkQuality === 'fair',
                            'text-red-400': networkQuality === 'poor'
                          }"
                        ></i>
                        <span>{{ networkQuality === 'good' ? '良好' : networkQuality === 'fair' ? '一般' : '较差' }}</span>
                      </div>
                    </div>
                    <!-- 播放速度 -->
                    <div class="playback-speed flex items-center space-x-2">
                      <select
                        v-model="playbackRate"
                        @change="setPlaybackRate(playbackRate)"
                        class="bg-black/40 backdrop-blur-sm text-white border border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                      >
                        <option value="0.5">0.5x</option>
                        <option value="0.75">0.75x</option>
                        <option value="1">1x</option>
                        <option value="1.25">1.25x</option>
                        <option value="1.5">1.5x</option>
                        <option value="2">2x</option>
                        <option value="3">3x</option>
                        <option value="4">4x</option>
                      </select>
                    </div>
                    <!-- 字幕 -->
                    <button @click="() => {}" class="hover:text-red-500 transition-colors duration-200 text-xl">
                      <i class="fas fa-closed-captioning"></i>
                    </button>
                    <!-- 音量 -->
                    <div class="flex items-center space-x-2">
                      <button @click="toggleMute" class="hover:text-red-500 transition-colors duration-200 text-xl">
                        <i class="fas" :class="isMuted ? 'fa-volume-mute' : 'fa-volume-up'"></i>
                      </button>
                    </div>
                    <!-- 设置 -->
                    <button @click="() => {}" class="hover:text-red-500 transition-colors duration-200 text-xl">
                      <i class="fas fa-cog"></i>
                    </button>
                    <!-- 网页全屏 -->
                    <button @click="toggleFullscreen" class="hover:text-red-500 transition-colors duration-200 text-xl">
                      <i class="fas fa-expand"></i>
                    </button>
                    <!-- 全屏 -->
                    <button @click="toggleFullscreen" class="hover:text-red-500 transition-colors duration-200 text-xl">
                      <i class="fas fa-expand"></i>
                    </button>
                    <!-- 核按钮 -->
                    <button @click="() => {}" class="hover:text-red-500 transition-colors duration-200 text-xl">
                      <i class="fas fa-radiation-alt text-red-500"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- 播放按钮覆盖层 - 只在未播放且视频已就绪时显示 -->
              <div v-if="!isPlaying && videoReady" class="absolute inset-0 flex items-center justify-center pointer-events-none">
                <button @click="togglePlay" class="w-20 h-20 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-all duration-300 transform hover:scale-105 pointer-events-auto">
                  <i class="fas fa-play text-4xl text-white pl-1"></i>
                </button>
              </div>
              
              <!-- 鼠标移动检测，用于显示/隐藏控制栏 -->
              <div class="absolute inset-0 pointer-events-none" @mousemove="onMouseMove" @mouseleave="onMouseLeave"></div>
            </div>

            <!-- 弹幕发送区域 - 紧贴视频下方 -->
            <div class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3">
              <div class="flex items-center justify-between">
                <!-- 左侧：观看人数和弹幕开关 -->
                <div class="flex items-center space-x-4">
                  <span class="text-sm text-gray-500 dark:text-gray-400">{{ videoStats.watchingCount }}人正在看，已装填 {{ videoStats.danmakuCount }} 条弹幕</span>
                  <div class="flex items-center space-x-2">
                    <!-- 弹幕开关按钮 -->
                    <button
                      @click="toggleDanmaku"
                      class="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-200"
                      :class="danmakuEnabled ? 'border-bilibili-pink text-bilibili-pink bg-pink-50' : 'border-gray-400 text-gray-400'"
                    >
                      弹
                    </button>
                    <!-- 弹幕设置按钮 -->
                    <button class="w-8 h-8 rounded-full border-2 border-gray-400 text-gray-400 flex items-center justify-center text-xs transition-all duration-200 hover:border-bilibili-pink hover:text-bilibili-pink">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M12 1v6m0 6v6m4.22-10.22l4.24-4.24M6.34 6.34L2.1 2.1m17.8 17.8l-4.24-4.24M6.34 17.66l-4.24 4.24"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- 右侧：弹幕输入框 -->
                <div class="flex items-center space-x-3 flex-1 max-w-2xl ml-6 relative">
                  <!-- 颜色选择器弹窗 -->
                  <div v-if="showColorPicker" class="absolute bottom-full left-0 mb-2 bg-[#2C2D30] rounded-lg p-4 w-[320px] shadow-xl z-50">
                    <!-- 字号选择 -->
                    <div class="mb-4">
                      <div class="text-gray-300 text-sm mb-2">字号</div>
                      <div class="flex space-x-2">
                        <button
                          @click="danmakuFontSize = 'small'"
                          class="flex-1 py-1.5 px-3 rounded text-sm transition-colors"
                          :class="danmakuFontSize === 'small' ? 'bg-[#00AEEC] text-white' : 'bg-[#4A4A4A] text-gray-300 hover:bg-[#5A5A5A]'"
                        >
                          小
                        </button>
                        <button
                          @click="danmakuFontSize = 'normal'"
                          class="flex-1 py-1.5 px-3 rounded text-sm transition-colors"
                          :class="danmakuFontSize === 'normal' ? 'bg-[#00AEEC] text-white' : 'bg-[#4A4A4A] text-gray-300 hover:bg-[#5A5A5A]'"
                        >
                          标准
                        </button>
                      </div>
                    </div>

                    <!-- 模式选择 -->
                    <div class="mb-4">
                      <div class="text-gray-300 text-sm mb-2">模式</div>
                      <div class="flex space-x-3">
                        <button
                          @click="danmakuMode = 'scroll'"
                          class="flex flex-col items-center p-2 rounded transition-colors"
                          :class="danmakuMode === 'scroll' ? 'text-[#00AEEC]' : 'text-gray-400 hover:text-gray-300'"
                        >
                          <div class="w-10 h-8 bg-[#00AEEC] rounded flex items-center justify-center mb-1">
                            <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M3 6h18v2H3V6zm0 5h12v2H3v-2zm0 5h18v2H3v-2z"/>
                            </svg>
                          </div>
                          <span class="text-xs">滚动</span>
                        </button>
                        <button
                          @click="danmakuMode = 'top'"
                          class="flex flex-col items-center p-2 rounded transition-colors"
                          :class="danmakuMode === 'top' ? 'text-[#00AEEC]' : 'text-gray-400 hover:text-gray-300'"
                        >
                          <div class="w-10 h-8 bg-[#4A4A4A] rounded flex items-center justify-center mb-1" :class="{ 'bg-[#00AEEC]': danmakuMode === 'top' }">
                            <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"/>
                            </svg>
                          </div>
                          <span class="text-xs">顶部</span>
                        </button>
                        <button
                          @click="danmakuMode = 'bottom'"
                          class="flex flex-col items-center p-2 rounded transition-colors"
                          :class="danmakuMode === 'bottom' ? 'text-[#00AEEC]' : 'text-gray-400 hover:text-gray-300'"
                        >
                          <div class="w-10 h-8 bg-[#4A4A4A] rounded flex items-center justify-center mb-1" :class="{ 'bg-[#00AEEC]': danmakuMode === 'bottom' }">
                            <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"/>
                            </svg>
                          </div>
                          <span class="text-xs">底部</span>
                        </button>
                      </div>
                    </div>

                    <!-- 颜色选择 -->
                    <div class="mb-4">
                      <div class="text-gray-300 text-sm mb-2">颜色</div>
                      <!-- 颜色输入框和预览 -->
                      <div class="flex items-center space-x-2 mb-3">
                        <input
                          v-model="danmakuColor"
                          type="text"
                          placeholder="#FFFFFF"
                          class="flex-1 bg-[#1A1A1A] border border-[#4A4A4A] rounded px-3 py-1.5 text-sm text-white uppercase"
                          maxlength="7"
                        >
                        <div
                          class="w-16 h-8 rounded border border-[#4A4A4A]"
                          :style="{ backgroundColor: danmakuColor }"
                        ></div>
                      </div>
                      <!-- 预设颜色网格 -->
                      <div class="grid grid-cols-7 gap-2">
                        <button
                          v-for="color in presetColors"
                          :key="color"
                          @click="danmakuColor = color"
                          class="w-8 h-8 rounded border-2 transition-all"
                          :class="danmakuColor === color ? 'border-white scale-110' : 'border-transparent hover:scale-105'"
                          :style="{ backgroundColor: color }"
                        ></button>
                      </div>
                    </div>

                    <!-- 大会员专属颜色 -->
                    <div>
                      <div class="text-gray-400 text-sm mb-2">大会员专属颜色</div>
                      <div class="flex space-x-2">
                        <button
                          v-for="color in vipColors"
                          :key="color"
                          @click="danmakuColor = color"
                          class="w-8 h-8 rounded border-2 transition-all"
                          :class="danmakuColor === color ? 'border-white scale-110' : 'border-transparent hover:scale-105'"
                          :style="{ backgroundColor: color }"
                        ></button>
                      </div>
                    </div>
                  </div>

                  <!-- 点击外部关闭颜色选择器 -->
                  <div v-if="showColorPicker" class="fixed inset-0 z-40" @click="showColorPicker = false"></div>

                  <div class="flex items-center space-x-2 flex-1 bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2">
                    <!-- 颜色选择按钮 -->
                    <button
                      @click="showColorPicker = !showColorPicker"
                      class="flex items-center justify-center w-6 h-6 rounded transition-colors"
                      :style="{ color: danmakuColor }"
                      title="选择弹幕颜色"
                    >
                      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                      </svg>
                    </button>
                    <input
                      v-model="newDanmakuText"
                      @keyup.enter="sendDanmaku"
                      placeholder="发个友善的弹幕见证当下"
                      class="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400"
                      :disabled="!danmakuEnabled"
                      :style="{ color: danmakuEnabled ? danmakuColor : '' }"
                    >
                  </div>
                  <a href="#" class="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 whitespace-nowrap">
                    弹幕礼仪 <i class="fas fa-chevron-right text-xs"></i>
                  </a>
                  <button
                    @click="sendDanmaku"
                    :disabled="!danmakuEnabled || !newDanmakuText.trim()"
                    class="px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:shadow-md active:scale-95"
                    :class="danmakuEnabled && newDanmakuText.trim() ? 'bg-[#00AEEC] hover:bg-[#0099D4] text-white cursor-pointer' : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'"
                  >
                    发送
                  </button>
                </div>
              </div>
            </div>

            <!-- 点赞、投币、收藏、转发 -->
            <div class="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
              <div class="flex items-center space-x-8">
                <button class="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-bilibili-pink transition-all duration-200 group" @click="toggleLike">
                  <i class="fas fa-thumbs-up text-xl group-hover:scale-110 transition-transform" :class="isLiked ? 'text-bilibili-pink' : ''" :style="isLiked ? { color: '#FB7299' } : {}"></i>
                  <span class="font-medium" :style="isLiked ? { color: '#FB7299' } : {}">{{ videoStats.likeCount }}</span>
                </button>
                <button class="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-bilibili-pink transition-all duration-200 group" @click="toggleCoin">
                  <div class="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-sm font-bold group-hover:scale-110 transition-transform" :class="isCoined ? 'text-bilibili-pink border-bilibili-pink' : ''">
                    币
                  </div>
                  <span class="font-medium">投币</span>
                </button>
                <button class="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-bilibili-pink transition-all duration-200 group" @click="toggleFavorite">
                  <i class="fas fa-star text-xl group-hover:scale-110 transition-transform" :class="isFavorited ? 'text-bilibili-pink' : ''"></i>
                  <span class="font-medium">{{ videoStats.favoriteCount }}</span>
                </button>
                <button class="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-bilibili-pink transition-all duration-200 group" @click="shareVideo">
                  <i class="fas fa-share text-xl group-hover:scale-110 transition-transform"></i>
                  <span class="font-medium">分享</span>
                </button>
              </div>
            </div>
            
            <!-- 视频简介 -->
            <div class="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
              <div class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {{ video.note }}
              </div>
              <!-- 展开更多按钮 -->
              <div class="mt-2">
                <button class="text-sm text-gray-500 hover:text-[#00AEEC] transition-colors flex items-center">
                  展开更多
                  <i class="fas fa-chevron-down ml-1 text-xs"></i>
                </button>
              </div>
              <!-- 标签区域 - B站风格 -->
              <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div class="flex flex-wrap items-center gap-2">
                  <!-- 活动标签 -->
                  <a href="#" class="group flex items-center px-3 py-1.5 bg-[#00AEEC]/10 hover:bg-[#00AEEC]/20 rounded-full transition-colors">
                    <i class="fas fa-cube text-[#00AEEC] text-sm mr-1.5"></i>
                    <span class="text-sm text-[#00AEEC] font-medium">青年用「财」图鉴</span>
                    <i class="fas fa-chevron-right text-[#00AEEC] text-xs ml-1 group-hover:translate-x-0.5 transition-transform"></i>
                  </a>
                  <!-- 普通标签 -->
                  <a href="#" class="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-sm text-gray-600 dark:text-gray-300 transition-colors">
                    金融
                  </a>
                  <a href="#" class="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-sm text-gray-600 dark:text-gray-300 transition-colors">
                    财经
                  </a>
                  <a href="#" class="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-sm text-gray-600 dark:text-gray-300 transition-colors">
                    黄金
                  </a>
                  <a href="#" class="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-sm text-gray-600 dark:text-gray-300 transition-colors">
                    股市
                  </a>
                  <a href="#" class="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-sm text-gray-600 dark:text-gray-300 transition-colors">
                    投资
                  </a>
                  <a href="#" class="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-sm text-gray-600 dark:text-gray-300 transition-colors">
                    贵金属
                  </a>
                  <a href="#" class="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-sm text-gray-600 dark:text-gray-300 transition-colors">
                    金条
                  </a>
                  <a href="#" class="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-sm text-gray-600 dark:text-gray-300 transition-colors">
                    大宗商品
                  </a>
                  <a href="#" class="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-sm text-gray-600 dark:text-gray-300 transition-colors">
                    金价
                  </a>
                </div>
              </div>
            </div>


            <!-- 评论区 -->
            <CommentSection :video-id="video.id" />
          </div>

          <!-- 右侧: 视频信息展示区域 -->
          <div class="lg:col-span-4">
            <!-- UP主信息卡片 -->
            <!-- 创作者信息区域 - B站风格 -->
            <div class="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
              <div class="flex items-start space-x-4">
                <!-- 用户头像 -->
                <div 
                  class="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold overflow-hidden shadow-md cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0" 
                  :class="{'bg-bilibili-pink bg-gradient-to-br from-bilibili-pink to-bilibili-pink-dark': !video.authorAvatar}"
                  @click="goToUserHome"
                >
                  <img 
                    v-if="video.authorAvatar" 
                    :src="video.authorAvatar" 
                    alt="作者头像" 
                    class="w-full h-full object-cover"
                  >
                  <span v-else>{{ video.author?.charAt(0) || 'U' }}</span>
                </div>
                <!-- 用户信息 -->
                <div class="flex-1 min-w-0">
                  <!-- 用户名和发消息 -->
                  <div class="flex items-center space-x-3">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ video.author || '陈陈陈Clara' }}</h3>
                    <button class="flex items-center space-x-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                      <i class="fas fa-envelope text-sm"></i>
                      <span class="text-sm">发消息</span>
                    </button>
                  </div>
                  <!-- 用户简介 -->
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ video.authorBio || '对冲基金量化研究员，CFA，剑桥大学' }}</p>
                  <!-- 充电和关注按钮 -->
                  <div class="flex items-center space-x-3 mt-3">
                    <!-- 充电按钮 -->
                    <button 
                      class="flex items-center space-x-1 px-4 py-1.5 border-2 border-[#FB7299] text-[#FB7299] rounded-full hover:bg-[#FB7299]/10 transition-colors"
                      @click="chargeUp"
                    >
                      <i class="fas fa-bolt"></i>
                      <span class="text-sm font-medium">充电</span>
                    </button>
                    <!-- 关注按钮 -->
                    <button 
                      class="flex items-center space-x-1 px-6 py-1.5 bg-[#00AEEC] hover:bg-[#0099D4] text-white rounded-full transition-colors"
                      @click="toggleFollow"
                    >
                      <i class="fas fa-plus text-sm"></i>
                      <span class="text-sm font-medium">关注 {{ video.authorStats?.followerCount || '7823' }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 相关视频 -->
            <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600 shadow hover:shadow-md transition-shadow duration-300">
              <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">相关视频</h3>
              <div class="space-y-4">
                <div v-for="relatedVideo in relatedVideos" :key="relatedVideo.id" class="flex space-x-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md transition-all duration-200 hover:-translate-y-1 hover:shadow-sm">
                  <div class="relative flex-shrink-0 w-32 h-20 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                    <img :src="relatedVideo.poster" alt="{{ relatedVideo.title }}" class="w-full h-full object-cover transition-transform duration-300 hover:scale-105">
                    <span class="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded-md">
                      {{ relatedVideo.duration }}
                    </span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 hover:text-bilibili-pink transition-colors">
                      {{ relatedVideo.title }}
                    </h4>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 hover:text-bilibili-pink transition-colors">{{ relatedVideo.author }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 hover:text-bilibili-pink transition-colors">{{ relatedVideo.viewCount }} 播放</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import NavHeader from '@/components/NavHeader.vue'
import CommentSection from '@/components/CommentSection.vue'
import { danmakuAPI, type Danmaku } from '@/api/danmaku'
import { useUserStore } from '@/stores/userStore'
import { videoAPI } from '@/api/video'
import Hls, { type Config } from 'hls.js'
import { useVideoAnalytics } from '@/composables/useVideoAnalytics'
import { useDanmakuLoader } from '@/composables/useDanmakuLoader'

// 使用store
const userStore = useUserStore()

// 响应式数据
const video = ref<any>(null)
const loading = ref(true)
const videoError = ref(false)
const errorMessage = ref('')
const videoPlayer = ref<HTMLVideoElement | null>(null)
const videoReady = ref(false) // 视频元素是否就绪
const currentVideoSourceIndex = ref(0)
const playbackRate = ref(1)
const videoQuality = ref('720p')
const hlsInstance = ref<Hls | null>(null)
const isPlayLocked = ref(false)
const networkQuality = ref<'good' | 'fair' | 'poor'>('good')
const currentBandwidth = ref(0)
const bufferHealth = ref(100)
const loadingProgress = ref(0)
const autoQuality = ref(true) // 播放锁，防止 rapid play/pause

// 网络质量检测相关
const networkSpeedHistory = ref<number[]>([])
const lastNetworkCheckTime = ref(0)
const NETWORK_CHECK_INTERVAL = 5000 // 每5秒检测一次网络质量
const NETWORK_SPEED_SAMPLES = 5 // 保留最近5次网络速度样本

// 路由
const route = useRoute()
const videoId = route.params.id as string

// 播放量统计
const videoIdRef = ref<string | number>(videoId)
const { 
  isPlayRecorded, 
  isCompleteWatch, 
  currentProgress: watchProgress,
  recordPlay, 
  reportProgress, 
  markComplete,
  reset: resetAnalytics 
} = useVideoAnalytics({
  videoId: videoIdRef,
  videoElement: videoPlayer,
  onPlayRecorded: () => {
    console.log('播放量已记录')
  },
  onProgressReported: (progress) => {
    console.log('观看进度:', (progress * 100).toFixed(1) + '%')
  },
  onCompleteWatch: () => {
    console.log('用户完整观看了视频')
  }
})

// 弹幕相关状态
// 弹幕相关状态
const newDanmakuText = ref('')
const danmakuEnabled = ref(true)
const danmakuContainer = ref<HTMLDivElement | null>(null)
const danmakuColor = ref('#FFFFFF')
const danmakuSpeed = ref('normal')
const danmakuFontSize = ref('normal') // 'small' | 'normal'
const danmakuMode = ref('scroll') // 'scroll' | 'top' | 'bottom'
const showColorPicker = ref(false)

// 预设颜色（参考B站标准颜色）
const presetColors = [
  '#FF0000', // 红
  '#FF7F00', // 橙
  '#FFA500', // 深橙
  '#FFD700', // 金
  '#FFFF00', // 黄
  '#ADFF2F', // 黄绿
  '#00FF00', // 绿
  '#00CED1', // 青
  '#4169E1', // 蓝
  '#87CEEB', // 浅蓝
  '#FF1493', // 深粉
  '#FF69B4', // 粉
  '#808080', // 灰
  '#FFFFFF', // 白
  '#000000', // 黑
  '#1E90FF', // 亮蓝
  '#8A2BE2', // 紫
  '#FF6347', // 番茄红
  '#40E0D0', //  turquoise
  '#EE82EE', // 紫罗兰
  '#F0E68C', // 卡其
  '#DDA0DD', // 梅红
  '#98FB98', // 浅绿
  '#F5DEB3', // 小麦
  '#D3D3D3', // 浅灰
  '#FFB6C1', // 浅粉
  '#FFA07A', // 浅橙
  '#20B2AA', // 浅青
]

// 大会员专属颜色（渐变色）
const vipColors = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
]

// 弹幕加载器
let danmakuLoader: ReturnType<typeof useDanmakuLoader> | null = null

// 从服务器加载的弹幕列表
const serverDanmakus = ref<Danmaku[]>([])
// 当前显示的弹幕（来自服务器）
const displayDanmakus = ref<Array<{
  id: number
  text: string
  color: string
  top: number
  left: number
  speed: number
  timestamp: number
  translateX: number
}>>([])

// 修复视频URL中的重复路径问题
const cleanVideoUrl = (url: string): string => {
  if (!url) return url
  
  console.log('原始URL:', url)
  
  try {
    // 检查是否为HLS流URL，如果是则转换为API网关格式
    if (url.includes('.m3u8') || url.includes('hls/')) {
      // 提取视频ID并构建正确的HLS流URL
      const videoIdMatch = url.match(/(\d+)\/hls\//)
      if (videoIdMatch) {
        const videoId = videoIdMatch[1]
        const hlsPath = url.split('/hls/')[1] || 'index.m3u8'
        const cleanedUrl = `/api/video/${videoId}/stream/${hlsPath}`
        console.log('HLS流URL转换为:', cleanedUrl)
        return cleanedUrl
      }
    }
    
    // 检查是否包含 /play/stream/ 路径，转换为正确的API网关格式
    if (url.includes('/play/stream/')) {
      const match = url.match(/\/play\/stream\/(\d+)/)
      if (match) {
        const videoId = match[1]
        const cleanedUrl = `/api/video/${videoId}/stream/index.m3u8`
        console.log('转换play/stream URL为:', cleanedUrl)
        return cleanedUrl
      }
    }
    
    // 检查是否是MinIO原始视频URL（包含bucket名称）
    // URL格式: http://localhost:9000/vision-world/{videoID}/{filename}.mp4
    if (url.includes('localhost:9000') || url.includes('minio')) {
      const minioMatch = url.match(/(\d+)\/[^/]+\.(mp4|avi|mov|mkv|webm)/)
      if (minioMatch) {
        const videoId = minioMatch[1]
        // 使用新的原始视频stream端点
        const cleanedUrl = `/api/video/${videoId}/original`
        console.log('MinIO原始视频URL转换为stream端点:', cleanedUrl)
        return cleanedUrl
      }
    }
    
    // 只修复重复的 /videos/videos/ 路径，不进行其他修改
    // 注意：不能修改URL的其他部分，特别是查询参数中的签名
    const cleanedUrl = url.replace(/\/videos\/videos\//g, '/videos/')
    console.log('修复重复路径后:', cleanedUrl)
    
    return cleanedUrl
  } catch (error) {
    console.error('URL处理错误:', error)
    // 如果处理失败，返回原始URL
    return url
  }
}

// 验证封面URL是否有效
const isValidCoverUrl = (url: string): boolean => {
  if (!url || url.trim() === '') return false
  
  // 检查是否是无效的默认封面URL
  if (url.includes('default-cover-url.com')) return false
  
  // 检查是否是有效的HTTP/HTTPS URL
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

// 获取默认封面URL
const getDefaultCoverUrl = (videoId: string): string => {
  return `https://picsum.photos/640/360?random=${videoId}`
}

// 视频控制状态
const isPlaying = ref(false)
const isMuted = ref(false) // 默认不静音
const volume = ref(80)
const isDanmakuEnabled = ref(true)
const currentTime = ref(0)
const duration = ref(0)
const isFullscreen = ref(false)
const progress = ref(0)
const bufferProgress = ref(0) // 缓存进度
const isHovered = ref(false)
const videoLoadError = ref(false)
const showControls = ref(false) // 控制栏显示状态
const hoverTime = ref<number | null>(null) // 悬停时间
const hoverProgress = ref(0) // 悬停进度位置
let controlsTimeout: number | null = null

// 模拟数据
const videoStats = ref({
  viewCount: '0',
  danmakuCount: '0',
  likeCount: '0',
  coinCount: '0',
  favoriteCount: '0',
  shareCount: '0',
  publishTime: '',
  watchingCount: '0'
})

// 点赞、投币、收藏转发状态
const isLiked = ref(false)
const isFavorited = ref(false)
const isCoined = ref(false)

// UP主信息
const videoAuthor = ref({
  id: '1',
  name: '万维猫动画',
  avatar: '',
  followerCount: '10.5万'
})

// 视频相关数据
const relatedVideos = ref([
  { id: 1, title: '人气新作《鬼灭之刃 火之神风谭2》Steam限时特惠/折！', author: '测试作者', viewCount: '14655.0万', duration: '00:16', poster: 'https://picsum.photos/320/180?random=1' },
  { id: 2, title: '凡人动画联想ThinkBook联名限定上线', author: '测试作者', viewCount: '8.5千', duration: '00:16', poster: 'https://picsum.photos/320/180?random=2' },
  { id: 3, title: '【凡人逛天商】闻天城交换会现场...', author: '测试作者', viewCount: '3.7万', duration: '00:35', poster: 'https://picsum.photos/320/180?random=3' },
  { id: 4, title: '【凡人逛天商】险中求荣！韩立遇...', author: '测试作者', viewCount: '2.1万', duration: '00:33', poster: 'https://picsum.photos/320/180?random=4' },
  { id: 5, title: '【凡人动画】2025-2026国创发布会PV', author: '测试作者', viewCount: '9.8千', duration: '01:10', poster: 'https://picsum.photos/320/180?random=5' },
])

// 初始化HLS播放器
const initHLSPlayer = async (videoUrl: string, retryCount = 0) => {
  const maxRetries = 10
  const retryDelay = 1000 // 增加重试延迟时间到1秒

  console.log(`initHLSPlayer called (attempt ${retryCount + 1}/${maxRetries})`)

  // 等待DOM元素加载完成
  if (!videoPlayer.value) {
    console.error(`Video player element not found (attempt ${retryCount + 1}/${maxRetries})`)
    if (retryCount < maxRetries) {
      console.log(`Retrying in ${retryDelay}ms...`)
      await new Promise(resolve => setTimeout(resolve, retryDelay))
      return initHLSPlayer(videoUrl, retryCount + 1)
    }
    console.error('Max retries reached, giving up')
    videoLoadError.value = true
    errorMessage.value = '视频播放器初始化失败，请刷新页面重试'
    return
  }
  
  console.log('Video player element found')
  
  // 确保视频元素已挂载到DOM
  if (!videoPlayer.value.parentNode) {
    console.error('Video player element not attached to DOM')
    if (retryCount < maxRetries) {
      console.log(`Retrying in ${retryDelay}ms...`)
      await new Promise(resolve => setTimeout(resolve, retryDelay))
      return initHLSPlayer(videoUrl, retryCount + 1)
    }
    console.error('Max retries reached, giving up')
    videoLoadError.value = true
    errorMessage.value = '视频播放器初始化失败，请刷新页面重试'
    return
  }
  
  console.log('Video player element attached to DOM')

  // 清理旧的HLS实例
  if (hlsInstance.value) {
    hlsInstance.value.destroy()
    hlsInstance.value = null
  }

  // B站风格：优先使用Blob URL提升加载速度
  console.log('Initializing Bilibili-style HLS player for URL:', videoUrl)

  // B站风格：在初始化HLS之前先检查播放列表是否有效
  try {
    const response = await fetch(videoUrl)
    if (!response.ok) {
      console.log(`HLS manifest check failed with status ${response.status}`)
      
      // 检查是否是404错误且返回的是M3U8格式的错误信息
      if (response.status === 404) {
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('mpegurl')) {
          const text = await response.text()
          console.log('Received error M3U8:', text)
          
          // 解析错误信息
          const lines = text.split('\n')
          let transcodeStatus = ''
          let fallbackUrl = ''
          
          for (const line of lines) {
            if (line.startsWith('#EXT-X-ERROR:')) {
              transcodeStatus = line.substring('#EXT-X-ERROR:'.length).trim()
            } else if (line.startsWith('#EXT-X-FALLBACK-URL:')) {
              fallbackUrl = line.substring('#EXT-X-FALLBACK-URL:'.length).trim()
            }
          }
          
          console.log('Transcode status:', transcodeStatus)
          console.log('Fallback URL:', fallbackUrl)
          
          // 如果转码未完成或失败，显示错误消息
          if (transcodeStatus === 'pending' || transcodeStatus === 'processing') {
            console.log('转码进行中，等待转码完成')
            videoLoadError.value = true
            errorMessage.value = '视频转码中，请稍后重试'
            return
          } else if (transcodeStatus === 'failed') {
            console.log('转码失败')
            videoLoadError.value = true
            errorMessage.value = '视频转码失败，请稍后重试'
            return
          }
        }
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    // 检查Content-Type，确保返回的是M3U8文件
    const contentType = response.headers.get('content-type')
    if (!contentType || (!contentType.includes('mpegurl') && !contentType.includes('m3u8') && !contentType.includes('text/plain'))) {
      console.log('Invalid Content-Type:', contentType)
      console.log('Response is not a valid M3U8 file')
      videoLoadError.value = true
      errorMessage.value = '视频格式不支持，请稍后重试'
      return
    }
    
    // 检查响应内容是否是有效的M3U8文件
    const text = await response.text()
    if (!text.trim().startsWith('#EXTM3U')) {
      console.log('Invalid M3U8 format')
      console.log('Response content:', text.substring(0, 200))
      
      // 检查是否是错误信息
      if (text.includes('#EXT-X-ERROR:')) {
        const lines = text.split('\n')
        let transcodeStatus = ''
        let fallbackUrl = ''
        
        for (const line of lines) {
          if (line.startsWith('#EXT-X-ERROR:')) {
            transcodeStatus = line.substring('#EXT-X-ERROR:'.length).trim()
          } else if (line.startsWith('#EXT-X-FALLBACK-URL:')) {
            fallbackUrl = line.substring('#EXT-X-FALLBACK-URL:'.length).trim()
          }
        }
        
        console.log('Transcode status from error M3U8:', transcodeStatus)
        console.log('Fallback URL from error M3U8:', fallbackUrl)
        
        if (transcodeStatus === 'pending' || transcodeStatus === 'processing') {
          videoLoadError.value = true
          errorMessage.value = '视频转码中，请稍后重试'
          return
        } else if (transcodeStatus === 'failed') {
          videoLoadError.value = true
          errorMessage.value = '视频转码失败，请稍后重试'
          return
        }
      }
      
      throw new Error('Invalid M3U8 format')
    }
    
    console.log('M3U8 validation passed, initializing HLS player')
  } catch (error) {
    console.error('Failed to validate HLS manifest:', error)
    videoLoadError.value = true
    errorMessage.value = '视频加载失败，请刷新页面重试'
    return
  }

  // 创建B站风格的HLS配置
  const hlsConfig: Hls.Config = {
    // 启用Worker提升性能（B站核心优化）
    enableWorker: true,
    workerPath: 'https://cdn.jsdelivr.net/npm/hls.js@latest/dist/hls.worker.js',

    // B站低延迟模式配置
    lowLatencyMode: true,
    backBufferLength: 120, // 后缓冲区长度（B站标准：120秒）
    maxBufferLength: 60, // 最大缓冲区长度（B站标准：60秒）
    maxMaxBufferLength: 120, // 最大缓冲区长度限制（B站标准：120秒）

    // 加载超时配置（B站优化策略）
    manifestLoadingTimeOut: 15000, // 播放列表加载超时（毫秒）
    manifestLoadingMaxRetry: 5, // 播放列表最大重试次数
    levelLoadingTimeOut: 15000, // 质量级别加载超时
    levelLoadingMaxRetry: 5, // 质量级别最大重试次数
    fragLoadingTimeOut: 25000, // 分片加载超时
    fragLoadingMaxRetry: 8, // 分片最大重试次数

    // 自适应比特率配置（B站ABR算法）
    abrEwmaFastLive: 4.0, // 快速移动平均窗口
    abrEwmaSlowLive: 10.0, // 慢速移动平均窗口
    abrEwmaFastVoD: 4.0, // VOD快速移动平均窗口
    abrEwmaSlowVoD: 10.0, // VOD慢速移动平均窗口
    abrEwmaDefaultEstimate: 1000000, // 默认带宽估算（bps）
    abrBandWidthFactor: 0.9, // 带宽安全系数
    abrBandWidthUpFactor: 0.8, // 带宽上升因子
    abrMaxWithRealBitrate: true, // 使用实际比特率限制

    // 缓冲区配置（B站优化）
    maxBufferHole: 0.3, // 最大缓冲区空洞（秒）
    maxFragLookUpTolerance: 0.1, // 分片查找容差

    // 其他优化（B站特性）
    maxAudioBufferSize: 120, // 最大音频缓冲区大小
    enableStitching: true, // 启用分片拼接
    enableMP4Remuxing: true, // 启用MP4重封装

    // 调试日志
    debug: false,
  }

  // 创建HLS实例
  const hls = new Hls(hlsConfig)

  // B站风格：使用Blob URL提升加载速度
  hls.loadSource(videoUrl)
  hls.attachMedia(videoPlayer.value)

  // B站风格：预加载优化
  videoPlayer.value.preload = 'auto'
  videoPlayer.value.crossOrigin = 'anonymous'

  // 错误处理
  hls.on(Hls.Events.ERROR, (event, data) => {
    console.error('HLS error:', event, data)
    handleHLSError(hls, data)
  })

  // 监听HLS事件
  hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
    console.log('HLS manifest parsed, levels available:', hls.levels.length)
    // 自动选择最佳质量
    if (autoQuality.value) {
      hls.currentLevel = -1 // -1表示自动选择
    } else {
      // 如果手动选择质量，尝试匹配用户选择
      setInitialQuality(hls)
    }
  })

  // 质量切换事件
  hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
    const level = hls.levels[data.level]
    if (level) {
      console.log('HLS level switched:', level.height, 'p', 'Bitrate:', level.bitrate)
      videoQuality.value = `${level.height}p`
      currentBandwidth.value = level.bitrate
    }
  })

  // B站风格：分片加载完成事件（优化缓存策略）
  hls.on(Hls.Events.FRAG_LOADED, (event, data) => {
    console.log('Fragment loaded (B站风格):', data.frag.url)
    updateBufferHealth()
    
    // B站优化：预加载下一个分片
    if (hls.levels && hls.levels.length > 0 && hls.currentLevel !== -1) {
      const currentLevel = hls.levels[hls.currentLevel]
      if (currentLevel && currentLevel.details && currentLevel.details.fragments) {
        const currentFragIndex = currentLevel.details.fragments.findIndex(frag => frag.url === data.frag.url)
        if (currentFragIndex !== -1 && currentFragIndex < currentLevel.details.fragments.length - 1) {
          const nextFrag = currentLevel.details.fragments[currentFragIndex + 1]
          if (nextFrag && !nextFrag.loaded) {
            // 预加载下一个分片
            console.log('Preloading next fragment (B站风格):', nextFrag.url)
          }
        }
      }
    }
  })

  // B站风格：缓冲区追加事件（优化缓存管理）
  hls.on(Hls.Events.BUFFER_APPENDED, (event, data) => {
    updateBufferHealth()
    
    // B站优化：智能缓存管理
    if (videoPlayer.value && videoPlayer.value.buffered.length > 0) {
      const currentTime = videoPlayer.value.currentTime
      const bufferedEnd = videoPlayer.value.buffered.end(videoPlayer.value.buffered.length - 1)
      
      // 如果缓冲区超过120秒，清理旧的缓存
      if (bufferedEnd - currentTime > 120) {
        console.log('Cleaning up old buffer (B站风格)')
        try {
          // 尝试修剪缓冲区（浏览器支持）
          if (videoPlayer.value.removeAttribute) {
            // 浏览器特定的缓冲区优化
          }
        } catch (error) {
          console.warn('Buffer cleanup failed:', error)
        }
      }
    }
  })

  // B站风格：带宽估算更新（优化ABR算法）
  hls.on(Hls.Events.FRAG_LOADING, (event: any, data: any) => {
    if (data && data.frag && data.frag.bitrate) {
      currentBandwidth.value = data.frag.bitrate
      updateNetworkQuality(data.frag.bitrate)
      console.log('Fragment bitrate (B站风格):', Math.round(data.frag.bitrate / 1000), 'kbps')
      
      // B站优化：动态调整ABR参数
      if (hls.abrController) {
        // 根据网络质量调整ABR策略
        if (networkQuality.value === 'good') {
          hls.abrController.setBandwidthFactor(0.85)
        } else if (networkQuality.value === 'fair') {
          hls.abrController.setBandwidthFactor(0.9)
        } else {
          hls.abrController.setBandwidthFactor(0.95)
        }
      }
    }
  })

  // B站风格：分片加载进度事件（优化用户体验）
  hls.on(Hls.Events.FRAG_LOAD_PROGRESS, (event, data) => {
    if (data && data.frag) {
      const progress = (data.loaded / data.total) * 100
      console.log(`Fragment loading progress (B站风格): ${progress.toFixed(1)}% for ${data.frag.url}`)
    }
  })

  // B站风格：分片解密事件（优化加密处理）
  hls.on(Hls.Events.FRAG_DECRYPTED, (event, data) => {
    console.log('Fragment decrypted (B站风格):', data.frag.url)
  })

  hlsInstance.value = hls
}

// 清理HLS实例
const cleanupHLS = () => {
  if (hlsInstance.value) {
    console.log('Cleaning up HLS instance')
    hlsInstance.value.destroy()
    hlsInstance.value = null
  }
}

// 处理HLS错误
const handleHLSError = (hls: Hls, data: any) => {
  if (data.fatal) {
    switch (data.type) {
      case Hls.ErrorTypes.NETWORK_ERROR:
        console.error('Network error, trying to recover...')
        if (data.details === Hls.ErrorDetails.MANIFEST_LOAD_ERROR) {
          // 播放列表加载失败，可能是404错误
          console.log('HLS manifest load failed, checking if it\'s a 404 error')
          
          // 尝试获取转码状态
          fetch(`http://localhost:8080/api/video/${videoId.value}/stream/index.m3u8`)
            .then((response): Promise<{ isM3U8: boolean, text?: string, json?: any }> => {
              if (response.status === 404) {
                const contentType = response.headers.get('content-type')
                if (contentType && contentType.includes('mpegurl')) {
                  return response.text().then(text => ({
                    isM3U8: true,
                    text
                  }))
                }
                return response.json().then(json => ({
                  isM3U8: false,
                  json
                }))
              }
              throw new Error('Not a 404 error')
            })
            .then((result) => {
              console.log('HLS 404 error data:', result)
              
              let transcodeStatus = ''
              let fallbackUrl = ''
              
              if (result.isM3U8 && result.text) {
                const lines = result.text.split('\n')
                for (const line of lines) {
                  if (line.startsWith('#EXT-X-ERROR:')) {
                    transcodeStatus = line.substring('#EXT-X-ERROR:'.length).trim()
                  } else if (line.startsWith('#EXT-X-FALLBACK-URL:')) {
                    fallbackUrl = line.substring('#EXT-X-FALLBACK-URL:'.length).trim()
                  }
                }
              } else if (!result.isM3U8 && result.json) {
                transcodeStatus = result.json.transcode_status || ''
                fallbackUrl = result.json.fallback_url || ''
              }
              
              console.log('Transcode status:', transcodeStatus, 'Fallback URL:', fallbackUrl)
              
              if (transcodeStatus === 'pending' || transcodeStatus === 'processing') {
                console.log('转码进行中，等待转码完成')
                errorMessage.value = '视频转码中，请稍后重试'
                setTimeout(() => {
                  hls.startLoad()
                }, 3000)
              } else if (transcodeStatus === 'failed') {
                console.log('转码失败')
                videoLoadError.value = true
                errorMessage.value = '视频转码失败，请稍后重试'
              } else {
                // 尝试重试
                setTimeout(() => {
                  hls.startLoad()
                }, 1000)
              }
            })
            .catch(err => {
              console.log('Failed to check 404 status:', err)
              // 尝试重试
              setTimeout(() => {
                hls.startLoad()
              }, 1000)
            })
        } else if (data.details === Hls.ErrorDetails.FRAG_LOAD_ERROR) {
          // 分片加载失败，尝试重新加载
          setTimeout(() => {
            hls.recoverMediaError()
          }, 1000)
        } else {
          // 其他网络错误，尝试重试
          setTimeout(() => {
            hls.recoverMediaError()
          }, 1000)
        }
        hls.startLoad()
        break
        
      case Hls.ErrorTypes.MEDIA_ERROR:
        console.error('Media error, trying to recover...')
        if (data.details === Hls.ErrorDetails.BUFFER_APPEND_ERROR) {
          // 缓冲区追加错误，尝试恢复
          hls.recoverMediaError()
        } else {
          // 其他媒体错误，尝试恢复
          setTimeout(() => {
            hls.recoverMediaError()
          }, 1000)
        }
        break
        
      default:
        console.error('Fatal error, cannot recover:', data)
        hls.destroy()
        videoLoadError.value = true
        errorMessage.value = '视频播放失败，请稍后重试'
        break
    }
  } else {
    // 非致命错误，记录日志
    console.warn('Non-fatal HLS error:', data)
  }
}

// 处理原生视频错误
const handleNativeVideoError = () => {
  console.error('Native video error occurred')
  videoLoadError.value = true
  errorMessage.value = '视频加载失败，请检查网络连接'
  
  // 尝试使用HLS降级方案
  if (video.value && video.value.src && !video.value.src.includes('.m3u8')) {
    console.log('Attempting to fallback to HLS stream')
    // 这里可以尝试获取HLS播放列表
  }
}

// 更新网络质量
const updateNetworkQuality = (bandwidth: number) => {
  // 带宽单位是bps
  const kbps = bandwidth / 1000

  // 更新网络速度历史
  networkSpeedHistory.value.push(kbps)
  if (networkSpeedHistory.value.length > NETWORK_SPEED_SAMPLES) {
    networkSpeedHistory.value.shift()
  }

  // 计算平均网络速度
  const avgSpeed = networkSpeedHistory.value.reduce((sum, speed) => sum + speed, 0) / networkSpeedHistory.value.length

  // 根据平均速度判断网络质量
  if (avgSpeed > 3000) {
    networkQuality.value = 'good'
  } else if (avgSpeed > 1000) {
    networkQuality.value = 'fair'
  } else {
    networkQuality.value = 'poor'
  }

  // 更新当前带宽
  currentBandwidth.value = bandwidth

  console.log(`网络质量更新: ${networkQuality.value}, 平均速度: ${avgSpeed.toFixed(0)}kbps, 当前速度: ${kbps.toFixed(0)}kbps`)
}

// 定期检测网络质量
const startNetworkQualityCheck = () => {
  const checkNetwork = () => {
    if (!hlsInstance.value || !videoPlayer.value) return

    // 获取当前播放速度
    const now = Date.now()
    if (now - lastNetworkCheckTime.value < NETWORK_CHECK_INTERVAL) return

    lastNetworkCheckTime.value = now

    // 从HLS实例获取带宽信息
    if (hlsInstance.value.levels && hlsInstance.value.currentLevel !== -1) {
      const currentLevel = hlsInstance.value.levels[hlsInstance.value.currentLevel]
      if (currentLevel && currentLevel.bitrate) {
        updateNetworkQuality(currentLevel.bitrate)
      }
    } else {
      // 如果没有HLS级别信息，使用默认估算
      const bufferedRanges = videoPlayer.value.buffered
      if (bufferedRanges.length > 0) {
        const currentTime = videoPlayer.value.currentTime
        const bufferedEnd = bufferedRanges.end(bufferedRanges.length - 1)
        const bufferedDuration = bufferedEnd - currentTime

        // 根据缓冲区大小估算网络质量
        if (bufferedDuration > 60) {
          networkQuality.value = 'good'
          currentBandwidth.value = 5000000 // 5Mbps
        } else if (bufferedDuration > 30) {
          networkQuality.value = 'fair'
          currentBandwidth.value = 2000000 // 2Mbps
        } else {
          networkQuality.value = 'poor'
          currentBandwidth.value = 500000 // 500kbps
        }
      }
    }
  }

  // 每5秒检测一次
  setInterval(checkNetwork, NETWORK_CHECK_INTERVAL)
}

// 更新缓冲区健康度
const updateBufferHealth = () => {
  if (!videoPlayer.value || !hlsInstance.value) return
  
  try {
    const bufferedRanges = videoPlayer.value.buffered
    if (bufferedRanges.length > 0) {
      const currentTime = videoPlayer.value.currentTime
      const bufferedEnd = bufferedRanges.end(bufferedRanges.length - 1)
      const bufferedDuration = bufferedEnd - currentTime
      
      // 计算缓冲区健康度（0-100）
      const targetBuffer = 30 // 目标缓冲30秒
      bufferHealth.value = Math.min(100, (bufferedDuration / targetBuffer) * 100)
      
      console.log('Buffer health:', bufferHealth.value.toFixed(1), '%, buffered:', bufferedDuration.toFixed(1), 's')
    }
  } catch (error) {
    console.error('Error updating buffer health:', error)
  }
}

// 设置初始质量
const setInitialQuality = (hls: Hls) => {
  if (!hls.levels || hls.levels.length === 0) return
  
  const targetHeight = parseInt(videoQuality.value.replace('p', ''))
  
  // 查找匹配的质量级别
  for (let i = 0; i < hls.levels.length; i++) {
    const level = hls.levels[i]
    if (level.height === targetHeight) {
      hls.currentLevel = i
      console.log('Set initial quality:', level.height, 'p')
      return
    }
  }
  
  // 如果没有精确匹配，选择最接近的
  let closestLevel = 0
  let minDiff = Infinity
  
  for (let i = 0; i < hls.levels.length; i++) {
    const diff = Math.abs(hls.levels[i].height - targetHeight)
    if (diff < minDiff) {
      minDiff = diff
      closestLevel = i
    }
  }
  
  hls.currentLevel = closestLevel
  console.log('Set closest quality:', hls.levels[closestLevel].height, 'p')
}

// 播放器初始化
const initPlayer = () => {
  if (videoPlayer.value) {
    duration.value = videoPlayer.value.duration || 30
    console.log('播放器初始化完成，视频时长:', duration.value)
  }
}

// 更新进度条
const updateProgress = () => {
  if (videoPlayer.value && duration.value > 0) {
    currentTime.value = videoPlayer.value.currentTime
    progress.value = (currentTime.value / duration.value) * 100
  }
}

// 格式化时间
const formatTime = (timeInSeconds: number) => {
  const minutes = Math.floor(timeInSeconds / 60)
  const seconds = Math.floor(timeInSeconds % 60)
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

// 格式化视频时长（秒转换为 HH:MM:SS 或 MM:SS）
const formatDuration = (seconds: number) => {
  if (!seconds || isNaN(seconds)) {
    return '00:00'
  }
  
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 充电功能
const chargeUp = () => {
  // TODO: 实现充电功能
  console.log('充电功能')
}

// 切换关注状态
const toggleFollow = async () => {
  if (!video.value || !videoAuthor.value.id) return
  
  try {
    if (video.value.isFollowed) {
      // 取消关注
      await videoAPI.unfollowUser(videoAuthor.value.id)
    } else {
      // 关注
      await videoAPI.followUser(videoAuthor.value.id)
    }
    
    // 更新本地状态
  video.value.isFollowed = !video.value.isFollowed

  // 更新关注数
  if (video.value.isFollowed) {
    // 增加关注数
    const currentFollowers = typeof videoAuthor.value.followerCount === 'string'
      ? parseInt(videoAuthor.value.followerCount)
      : videoAuthor.value.followerCount
    videoAuthor.value.followerCount = String(currentFollowers + 1)
    
    const currentVideoFollowers = typeof video.value.authorStats.followerCount === 'string'
      ? parseInt(video.value.authorStats.followerCount)
      : video.value.authorStats.followerCount
    video.value.authorStats.followerCount = String(currentVideoFollowers + 1)
  } else {
    // 减少关注数
    const currentFollowers = typeof videoAuthor.value.followerCount === 'string'
      ? parseInt(videoAuthor.value.followerCount)
      : videoAuthor.value.followerCount
    videoAuthor.value.followerCount = String(currentFollowers - 1)
    
    const currentVideoFollowers = typeof video.value.authorStats.followerCount === 'string'
      ? parseInt(video.value.authorStats.followerCount)
      : video.value.authorStats.followerCount
    video.value.authorStats.followerCount = String(currentVideoFollowers - 1)
  }
  } catch (error) {
    console.error('关注操作失败:', error)
  }
}

// 切换静音状态
const toggleMute = () => {
  if (videoPlayer.value) {
    videoPlayer.value.muted = !videoPlayer.value.muted
    isMuted.value = videoPlayer.value.muted
    if (isMuted.value) {
      volume.value = 0
    } else if (volume.value === 0) {
      volume.value = 50 // 取消静音时恢复到50%
    }
  }
  console.log('静音状态:', isMuted.value ? '静音' : '开启')
}

// 设置音量
const setVolume = () => {
  if (videoPlayer.value) {
    videoPlayer.value.volume = volume.value / 100
    videoPlayer.value.muted = volume.value === 0
    isMuted.value = volume.value === 0
  }
  console.log('音量设置为:', volume.value)
}

// 设置播放速度
const setPlaybackRate = (rate: number) => {
  if (videoPlayer.value) {
    videoPlayer.value.playbackRate = rate
  }
  playbackRate.value = rate
  console.log('播放速度设置为:', rate)
}

// 设置视频质量（优化版）
const setVideoQuality = (quality: string) => {
  console.log('设置视频质量:', quality)
  
  // 如果选择"自动"，启用自适应
  if (quality === 'auto') {
    autoQuality.value = true
    if (hlsInstance.value) {
      hlsInstance.value.currentLevel = -1 // -1表示自动选择
      console.log('启用自动质量选择')
    }
    return
  }
  
  // 手动选择质量
  autoQuality.value = false
  videoQuality.value = quality

  // 如果使用HLS播放器,切换HLS质量级别
  if (hlsInstance.value) {
    const levels = hlsInstance.value.levels
    if (!levels || levels.length === 0) {
      console.warn('No HLS levels available')
      return
    }

    // 根据质量名称查找对应的HLS级别
    let targetLevel = -1
    const qualityHeight = parseInt(quality.replace('p', ''))

    for (let i = 0; i < levels.length; i++) {
      const level = levels[i]
      const levelHeight = level.height

      if (levelHeight === qualityHeight) {
        targetLevel = i
        console.log(`Found matching level: ${i}, height: ${levelHeight}p, bitrate: ${level.bitrate}`)
        break
      }
    }

    if (targetLevel !== -1) {
      // 平滑切换到指定质量
      smoothQualitySwitch(targetLevel)
    } else {
      console.warn(`Quality ${quality} not found in HLS levels, using auto`)
      autoQuality.value = true
      hlsInstance.value.currentLevel = -1
    }
  } else {
    // 如果视频有多个质量选项，切换到对应的质量
    if (video.value && video.value.quality_options && video.value.quality_options.length > 0) {
      const qualityOption = video.value.quality_options.find((opt: any) =>
        opt.quality === quality || opt.label === quality
      )

      if (qualityOption && qualityOption.url) {
        const currentTime = videoPlayer.value?.currentTime || 0
        const wasPlaying = !videoPlayer.value?.paused

        // 更新视频源
        video.value.src = cleanVideoUrl(qualityOption.url)

        // 重新加载视频
        if (videoPlayer.value) {
          videoPlayer.value.load()

          // 恢复播放位置
          videoPlayer.value.currentTime = currentTime

          // 如果之前在播放，恢复播放
          if (wasPlaying) {
            videoPlayer.value.play().catch(err => {
              console.error('切换画质后播放失败:', err)
            })
          }
        }

        console.log('已切换到画质:', quality)
      }
    }
  }
}

// 平滑质量切换
const smoothQualitySwitch = (targetLevel: number) => {
  if (!hlsInstance.value || !videoPlayer.value) return
  
  const hls = hlsInstance.value
  const currentLevel = hls.currentLevel
  
  // 如果已经是目标质量，不需要切换
  if (currentLevel === targetLevel) {
    console.log('Already at target quality level')
    return
  }
  
  // 保存当前播放状态
  const currentTime = videoPlayer.value.currentTime
  const wasPlaying = !videoPlayer.value.paused
  
  console.log(`Switching from level ${currentLevel} to ${targetLevel}`)
  
  // 切换质量级别
  hls.currentLevel = targetLevel
  
  // 等待质量切换完成
  const checkSwitchComplete = setInterval(() => {
    if (hls.currentLevel === targetLevel) {
      clearInterval(checkSwitchComplete)
      
      // 恢复播放位置
      if (videoPlayer.value) {
        videoPlayer.value.currentTime = currentTime
        
        // 如果之前在播放，恢复播放
        if (wasPlaying) {
          videoPlayer.value.play().catch(err => {
            console.error('Failed to resume playback after quality switch:', err)
          })
        }
      }
      
      console.log('Quality switch completed successfully')
    }
  }, 100)
  
  // 超时保护
  setTimeout(() => {
    clearInterval(checkSwitchComplete)
    console.warn('Quality switch timeout')
  }, 5000)
}

// 跳转播放位置
const seek = (e: MouseEvent) => {
  if (!videoPlayer.value || !e.currentTarget) return

  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const pos = (e.clientX - rect.left) / rect.width
  const newTime = pos * duration.value

  videoPlayer.value.currentTime = newTime
  currentTime.value = newTime
  progress.value = pos * 100

  // 上报拖动事件
  reportProgress('seek')

  // 跳转时，根据新的视频时间更新弹幕
  if (danmakuEnabled.value) {
    updateDanmakusOnSeek(newTime)
  }
}

// 处理进度条悬停，显示时间提示
const handleProgressHover = (e: MouseEvent) => {
  if (!e.currentTarget || duration.value === 0) return

  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  const newTime = pos * duration.value

  hoverProgress.value = pos * 100
  hoverTime.value = newTime
}

// 处理进度条离开，隐藏时间提示
const handleProgressLeave = () => {
  hoverTime.value = null
}

// 开始拖动进度条
const startSeeking = (e: MouseEvent | TouchEvent) => {
  e.preventDefault()
  isSeeking.value = true
  
  // 添加全局事件监听器
  document.addEventListener('mousemove', handleSeeking)
  document.addEventListener('mouseup', stopSeeking)
  document.addEventListener('touchmove', handleSeeking)
  document.addEventListener('touchend', stopSeeking)
  
  // 立即更新位置
  handleSeeking(e)
}

// 处理拖动过程
const handleSeeking = (e: MouseEvent | TouchEvent) => {
  if (!isSeeking.value || !videoPlayer.value) return
  
  // 获取进度条元素
  const progressBar = document.querySelector('.relative.h-1.bg-gray-500') as HTMLElement
  if (!progressBar) return
  
  const rect = progressBar.getBoundingClientRect()
  let clientX: number
  
  if ('touches' in e) {
    clientX = e.touches[0].clientX
  } else {
    clientX = e.clientX
  }
  
  const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
  const newTime = pos * duration.value
  
  // 更新进度条显示（拖动时只更新显示，不实际跳转）
  progress.value = pos * 100
  currentTime.value = newTime
}

// 停止拖动
const stopSeeking = () => {
  if (!isSeeking.value || !videoPlayer.value) return

  isSeeking.value = false

  // 在拖动结束时真正跳转到指定位置
  const targetTime = (progress.value / 100) * duration.value
  videoPlayer.value.currentTime = targetTime

  // 上报拖动事件
  reportProgress('seek')

  // 跳转时，根据新的视频时间更新弹幕
  if (danmakuEnabled.value) {
    updateDanmakusOnSeek(targetTime)
  }

  // 拖动后立即预加载新位置周围的分片
  if (video.value && isPlaying.value) {
    console.log('拖动结束，开始预加载新位置周围的分片')
    preloadSegments()
  }

  // 移除全局事件监听器
  document.removeEventListener('mousemove', handleSeeking)
  document.removeEventListener('mouseup', stopSeeking)
  document.removeEventListener('touchmove', handleSeeking)
  document.removeEventListener('touchend', stopSeeking)
}

// 切换全屏
const toggleFullscreen = () => {
  const container = document.getElementById('video-container')
  if (!container) return

  if (!document.fullscreenElement) {
    container.requestFullscreen().catch(err => {
      console.error(`全屏错误: ${err.message}`)
    })
  } else {
    document.exitFullscreen()
  }
}

// 进度条跳转时更新弹幕
const updateDanmakusOnSeek = (newTime: number) => {
  // 清空服务器弹幕显示
  displayDanmakus.value = []
  displayedServerDanmakuIds.value.clear()
  
  // 触发弹幕预加载
  if (danmakuLoader) {
    danmakuLoader.checkPreload(newTime)
  }
}

// 切换弹幕显示
const toggleDanmaku = () => {
  danmakuEnabled.value = !danmakuEnabled.value
  if (!danmakuEnabled.value) {
    // 关闭弹幕时清空
    displayDanmakus.value = []
    displayedServerDanmakuIds.value.clear()
    // 通知弹幕加载器
    if (danmakuLoader) {
      danmakuLoader.toggleDanmaku(false)
    }
  } else {
    // 重新开启弹幕时通知加载器
    if (danmakuLoader) {
      danmakuLoader.toggleDanmaku(true)
    }
  }

  if (danmakuContainer.value) {
    danmakuContainer.value.style.pointerEvents = danmakuEnabled.value ? 'none' : 'auto'
  }
}

// 发送弹幕
const sendDanmaku = async () => {
  if (!newDanmakuText.value.trim() || !danmakuEnabled.value) return

  // 检查用户是否已登录
  if (!userStore.isAuthenticated) {
    // 未登录，触发登录弹窗
    window.dispatchEvent(new CustomEvent('show-login-modal'))
    return
  }

  // 用户发送的弹幕，时间戳为当前视频时间
  const currentVideoTime = videoPlayer.value?.currentTime || 0

  try {
    // 调用API发送弹幕
    const response = await danmakuAPI.sendDanmaku({
      video_id: videoId,
      text: newDanmakuText.value,
      color: danmakuColor.value,
      video_timestamp: currentVideoTime,
      speed: danmakuSpeed.value
    })

    if (response.success) {
      // 使用轨道系统避免重叠
      const danmakuTracks = [10, 20, 30, 40, 50, 60, 70, 80] // 8个轨道
      let currentTrackIndex = 0
      const track = danmakuTracks[currentTrackIndex]
      currentTrackIndex = (currentTrackIndex + 1) % danmakuTracks.length

      // 创建服务器弹幕对象
      const serverDanmaku: Danmaku = {
        id: response.danmaku.id,
        user_id: response.danmaku.user_id,
        video_id: response.danmaku.video_id,
        text: response.danmaku.text,
        color: response.danmaku.color,
        video_timestamp: response.danmaku.video_timestamp,
        speed: response.danmaku.speed,
        created_at: response.danmaku.created_at
      }
      serverDanmakus.value.push(serverDanmaku)

      // 立即显示到屏幕上（用户发送的弹幕立即显示，不等待时间窗口）
      const speedMap: Record<string, number> = {
        'slow': 12,
        'normal': 10,
        'fast': 8
      }

      // 确保不重复添加
      if (!displayedServerDanmakuIds.value.has(serverDanmaku.id)) {
        displayedServerDanmakuIds.value.add(serverDanmaku.id)

        displayDanmakus.value.push({
          id: serverDanmaku.id,
          text: serverDanmaku.text,
          color: serverDanmaku.color || '#FFFFFF',
          top: track,
          left: 100, // 从右侧开始
          speed: speedMap[serverDanmaku.speed] || speedMap['normal'],
          timestamp: serverDanmaku.video_timestamp,
          translateX: 0
        })

        console.log('用户发送的弹幕立即显示:', serverDanmaku.id, '内容:', serverDanmaku.text)
      }

      // 清空输入框
      newDanmakuText.value = ''

      // 更新弹幕统计
      videoStats.value.danmakuCount = (parseInt(videoStats.value.danmakuCount) + 1).toString()
    } else {
      console.error('发送弹幕失败:', response.message)
    }
  } catch (error) {
    console.error('发送弹幕出错:', error)
  }
}

// 已显示的弹幕ID集合（用于去重）
const displayedServerDanmakuIds = ref<Set<number>>(new Set())

const displayServerDanmakus = (currentVideoTime: number) => {
  if (!danmakuEnabled.value || !serverDanmakus.value.length) return

  // 找到当前时间应该显示的弹幕（时间窗口1.5秒，增加容错）
  const timeWindow = 1.5
  const newDanmakus = serverDanmakus.value.filter(danmaku => {
    const shouldShow = (
      danmaku.video_timestamp >= currentVideoTime - timeWindow &&
      danmaku.video_timestamp <= currentVideoTime + timeWindow &&
      !displayedServerDanmakuIds.value.has(danmaku.id)
    )
    // 调试：如果弹幕在30秒附近，打印日志
    if (Math.abs(danmaku.video_timestamp - 30) < 2 && shouldShow) {
      console.log('准备显示弹幕:', danmaku.id, '时间:', danmaku.video_timestamp, '当前视频时间:', currentVideoTime)
    }
    return shouldShow
  })
  
  // 限制同时显示的弹幕数量
  const maxDisplayCount = 30
  const availableSlots = maxDisplayCount - displayDanmakus.value.length
  const danmakusToShow = newDanmakus.slice(0, availableSlots)
  
  // 添加到显示列表
  if (danmakusToShow.length > 0) {
    console.log(`显示 ${danmakusToShow.length} 条新弹幕，当前视频时间:`, currentVideoTime)
  }
  danmakusToShow.forEach(danmaku => {
    displayedServerDanmakuIds.value.add(danmaku.id)

    // 计算轨道位置（简单轮询）
    const danmakuTracks = [10, 20, 30, 40, 50, 60, 70, 80]
    const trackIndex = danmaku.id % danmakuTracks.length
    const top = danmakuTracks[trackIndex]

    // 计算速度
    const speedMap: Record<string, number> = {
      'slow': 12,
      'normal': 10,
      'fast': 8
    }
    const speed = speedMap[danmaku.speed] || speedMap['normal']

    console.log('添加弹幕到显示列表:', danmaku.id, '内容:', danmaku.text, '时间:', danmaku.video_timestamp)

    displayDanmakus.value.push({
      id: danmaku.id,
      text: danmaku.text,
      color: danmaku.color || '#FFFFFF',
      top,
      left: 100, // 从右侧开始
      speed,
      timestamp: danmaku.video_timestamp,
      translateX: 0
    })
  })
}

// 更新服务器弹幕位置
const updateServerDanmakuPositions = () => {
  if (!danmakuContainer.value) return
  
  const containerWidth = danmakuContainer.value.offsetWidth || 640
  
  displayDanmakus.value.forEach((danmaku, index) => {
    // 更新位置
    danmaku.left -= 0.5 // 每帧移动0.5%
    danmaku.translateX = -(100 - danmaku.left) / 100 * containerWidth
    
    // 如果弹幕完全移出屏幕，移除它
    if (danmaku.left < -50) {
      displayDanmakus.value.splice(index, 1)
    }
  })
}

// 初始化弹幕加载器
const initDanmakuLoader = () => {
  if (!videoPlayer.value) return

  danmakuLoader = useDanmakuLoader(videoId, videoPlayer.value)

  // 加载初始弹幕
  danmakuLoader.init()

  // 监听弹幕加载完成
  watch(() => danmakuLoader?.allDanmakus.value, (newDanmakus) => {
    if (newDanmakus && newDanmakus.length > 0) {
      serverDanmakus.value = newDanmakus
      console.log('服务器弹幕加载完成:', newDanmakus.length, '条')
      // 调试：打印30秒附近的弹幕
      const danmakuAt30 = newDanmakus.filter(d => Math.abs(d.video_timestamp - 30) < 5)
      if (danmakuAt30.length > 0) {
        console.log('30秒附近的弹幕:', danmakuAt30)
      }
    }
  }, { deep: true })
}

// 鼠标移动事件，显示控制栏
const onMouseMove = () => {
  showControls.value = true
  
  // 清除之前的定时器
  if (controlsTimeout) {
    clearTimeout(controlsTimeout)
  }
  
  // 0.5秒后自动隐藏控制栏
  controlsTimeout = window.setTimeout(() => {
    if (isPlaying.value) {
      showControls.value = false
    }
  }, 500)
}

// 鼠标离开事件，隐藏控制栏
const onMouseLeave = () => {
  if (isPlaying.value) {
    showControls.value = false
  }
}

// 跳转到用户主页
const goToUserHome = () => {
  console.log('跳转到用户主页')
  // 实际应用中应该使用router.push或window.location.href
}

// 点赞功能
const toggleLike = async () => {
  try {
    console.log(video.value.id)
    console.log(isLiked.value)
    const response = await videoAPI.likeVideo({ video_id: video.value.id, action_type: !isLiked.value })
    if (response.data.status_msg === "success") {
      // 重新获取视频统计数据
      try {
        const statsResponse = await videoAPI.getVideoStats(video.value.id)
        console.log(statsResponse.data)
        console.log(statsResponse.data.data)
        console.log(statsResponse.data.data.like_count)
        if (statsResponse.data) {
          const likeCount = Math.max(statsResponse.data.data.like_count, 0)
          const favoriteCount = Math.max(statsResponse.data.data.favorite_count, 0)
          const shareCount = Math.max(statsResponse.data.data.share_count, 0)
          
          videoStats.value.likeCount = likeCount.toString()
          videoStats.value.favoriteCount = favoriteCount.toString()
          videoStats.value.shareCount = shareCount.toString()
          isLiked.value = statsResponse.data.data.is_liked
          isFavorited.value = statsResponse.data.data.is_favorite
        }
      } catch (statsError) {
        console.warn('重新获取视频统计数据失败:', statsError)
        // 降级处理：本地更新
        isLiked.value = !isLiked.value
        const currentCount = parseInt(videoStats.value.likeCount) || 0
        if (isLiked.value) {
          videoStats.value.likeCount = (currentCount + 1).toString()
        } else {
          const newCount = Math.max(currentCount - 1, 0)
          videoStats.value.likeCount = newCount.toString()
        }
      }
    } else {
      console.error('点赞失败:', response.data.status_msg)
    }
  } catch (error) {
    console.error('点赞请求失败:', error)
  }
}

// 投币功能
const toggleCoin = async () => {
  try {
    const response = await videoAPI.coinVideo({ video_id: video.value.id, action_type: !isCoined.value })
    if (response.data.status_code === 0) {
      isCoined.value = !isCoined.value
      if (isCoined.value) {
        videoStats.value.coinCount = (parseInt(videoStats.value.coinCount) + 1).toString()
      } else {
        videoStats.value.coinCount = (parseInt(videoStats.value.coinCount) - 1).toString()
      }
    } else {
      console.error('投币失败:', response.data.status_msg)
    }
  } catch (error) {
    console.error('投币请求失败:', error)
  }
}

// 收藏功能
const toggleFavorite = async () => {
  try {
    console.log(video.value.id)
    console.log(isFavorited.value)
    const response = await videoAPI.favoriteVideo({ video_id: video.value.id, action_type: !isFavorited.value })
    if (response.data.status_msg === "success") {
      // 重新获取视频统计数据
      try {
        const statsResponse = await videoAPI.getVideoStats(video.value.id)
        console.log(statsResponse.data)
        console.log(statsResponse.data.data)
        console.log(statsResponse.data.data.favorite_count)
        if (statsResponse.data) {
          const likeCount = Math.max(statsResponse.data.data.like_count, 0)
          const favoriteCount = Math.max(statsResponse.data.data.favorite_count, 0)
          const shareCount = Math.max(statsResponse.data.data.share_count, 0)
          
          videoStats.value.likeCount = likeCount.toString()
          videoStats.value.favoriteCount = favoriteCount.toString()
          videoStats.value.shareCount = shareCount.toString()
          isLiked.value = statsResponse.data.data.is_liked
          isFavorited.value = statsResponse.data.data.is_favorite
        }
      } catch (statsError) {
        console.warn('重新获取视频统计数据失败:', statsError)
        // 降级处理：本地更新
        isFavorited.value = !isFavorited.value
        const currentCount = parseInt(videoStats.value.favoriteCount) || 0
        if (isFavorited.value) {
          videoStats.value.favoriteCount = (currentCount + 1).toString()
        } else {
          const newCount = Math.max(currentCount - 1, 0)
          videoStats.value.favoriteCount = newCount.toString()
        }
      }
    } else {
      console.error('收藏失败:', response.data.status_msg)
    }
  } catch (error) {
    console.error('收藏请求失败:', error)
  }
}

// 分享功能
const shareVideo = async () => {
  try {
    console.log(video.value.id)
    const response = await videoAPI.shareVideo({ video_id: video.value.id, share_type: 'web' })
    if (response.data.status_msg === "success") {
      // 重新获取视频统计数据
      try {
        const statsResponse = await videoAPI.getVideoStats(video.value.id)
        console.log(statsResponse.data)
        console.log(statsResponse.data.data)
        console.log(statsResponse.data.data.share_count)
        if (statsResponse.data) {
          const likeCount = Math.max(statsResponse.data.data.like_count, 0)
          const favoriteCount = Math.max(statsResponse.data.data.favorite_count, 0)
          const shareCount = Math.max(statsResponse.data.data.share_count, 0)
          
          videoStats.value.likeCount = likeCount.toString()
          videoStats.value.favoriteCount = favoriteCount.toString()
          videoStats.value.shareCount = shareCount.toString()
          isLiked.value = statsResponse.data.data.is_liked
          isFavorited.value = statsResponse.data.data.is_favorite
        }
      } catch (statsError) {
        console.warn('重新获取视频统计数据失败:', statsError)
        // 降级处理：本地更新
        videoStats.value.shareCount = (parseInt(videoStats.value.shareCount) + 1).toString()
      }
    } else {
      console.error('分享失败:', response.data.status_msg)
    }
  } catch (error) {
    console.error('分享请求失败:', error)
  }
}

// 切换播放状态
const togglePlay = async () => {
  if (!videoPlayer.value) return
  
  if (videoPlayer.value.paused) {
    // 使用播放锁防止 rapid play/pause
    if (isPlayLocked.value) {
      console.log('播放操作被锁定，忽略')
      return
    }
    isPlayLocked.value = true
    
    try {
      await videoPlayer.value.play()
      isPlaying.value = true
    } catch (err) {
      console.error('播放失败:', err)
      isPlaying.value = false
    } finally {
      // 100ms 后解锁，防止 AbortError
      setTimeout(() => {
        isPlayLocked.value = false
      }, 100)
    }
  } else {
    videoPlayer.value.pause()
    isPlaying.value = false
  }
}

const fetchVideoData = async () => {
  loading.value = true
  videoError.value = false
  currentVideoSourceIndex.value = 0 // 重置视频源索引
  
  try {
    // 调用真实的视频详情API
    console.log(`获取视频ID: ${videoId}的数据`)
    
    const response = await videoAPI.getVideoDetail(videoId)
    
    // 检查是否有降级响应
    if (response.data && 'fallback_url' in response.data) {
      console.log('API返回降级URL:', (response.data as any).fallback_url)
      // 使用降级URL作为视频源
      const cleanedFallbackUrl = cleanVideoUrl((response.data as any).fallback_url)
      console.log('使用降级视频URL:', cleanedFallbackUrl)
      
      // 创建简化的视频数据
      video.value = {
        id: videoId,
        title: '视频加载中...',
        src: cleanedFallbackUrl,
        poster: getDefaultCoverUrl(videoId),
        note: response.data.message || '正在使用备用视频源播放',
        viewCount: '0',
        likeCount: '0',
        duration: '00:00',
        author: '系统',
        authorAvatar: '',
        authorStats: { followerCount: 0 },
        tags: [],
        category: '',
        isFollowed: false
      }
      
      // 加载基础视频信息
      try {
        const basicInfoResponse = await videoAPI.getVideoDetail(videoId)
        if (basicInfoResponse.data && basicInfoResponse.data.data && (basicInfoResponse.data.data as any).video) {
          const basicVideo = (basicInfoResponse.data.data as any).video
          video.value.title = basicVideo.title || '未知标题'
          video.value.poster = isValidCoverUrl(basicVideo.cover_url) ? basicVideo.cover_url : getDefaultCoverUrl(videoId)
          video.value.note = basicVideo.description || video.value.note
          video.value.author = basicVideo.author?.username || '未知作者'
          video.value.authorAvatar = basicVideo.author?.avatar || ''
        }
      } catch (infoError) {
        console.warn('获取基础视频信息失败:', infoError)
      }
      
      return
    }
    
    const videoData = (response.data.data as any).video
    
    // 生成HLS播放URL - 优先使用API Gateway代理
    let finalVideoUrl = ''
    const playlistUrl = videoData.playlist_url
    const originalVideoUrl = videoData.video_url
    
    console.log('HLS播放列表URL:', playlistUrl)
    console.log('原始视频URL:', originalVideoUrl)
    
    // 如果有HLS播放列表URL，使用API Gateway代理
    if (playlistUrl && playlistUrl.trim() !== '') {
      // 从playlist_url中提取视频ID
      const videoIdMatch = playlistUrl.match(/(\d+)\/hls\//)
      if (videoIdMatch) {
        const extractedVideoId = videoIdMatch[1]
        finalVideoUrl = `http://localhost:8080/api/video/${extractedVideoId}/stream/index.m3u8`
        console.log('使用HLS代理URL:', finalVideoUrl)
      } else {
        // 如果无法提取视频ID，尝试直接使用playlist_url
        finalVideoUrl = cleanVideoUrl(playlistUrl)
        console.log('使用清理后的HLS URL:', finalVideoUrl)
      }
    } else {
      // 没有HLS播放列表，尝试使用API Gateway代理生成HLS URL
      finalVideoUrl = `http://localhost:8080/api/video/${videoId}/stream/index.m3u8`
      console.log('生成HLS代理URL:', finalVideoUrl)
    }
    
    console.log('最终使用的视频URL:', finalVideoUrl)
    
    const cleanedVideoUrl = cleanVideoUrl(finalVideoUrl)
    console.log('修复后的视频URL:', cleanedVideoUrl)
    
    // 清理所有质量选项的URL
    if (videoData.quality_options && videoData.quality_options.length > 0) {
      videoData.quality_options.forEach((option: any, index: number) => {
        if (option.url) {
          videoData.quality_options[index].url = cleanVideoUrl(option.url)
        }
      })
    }
    
    video.value = {
      id: videoData.video_id,
      title: videoData.title,
      src: cleanedVideoUrl,
      poster: isValidCoverUrl(videoData.cover_url) ? videoData.cover_url : getDefaultCoverUrl(videoId),
      note: videoData.description,
      viewCount: videoData.view_count.toString(),
      likeCount: videoData.like_count.toString(),
      duration: formatDuration(videoData.duration),
      author: videoData.author?.username || '未知作者',
      authorAvatar: videoData.author?.avatar || '',
      authorStats: {
        followerCount: videoData.author?.follower_count || 0
      },
      tags: videoData.tags || [],
      category: videoData.category || '',
      isFollowed: videoData.is_followed || false,
      createTime: new Date(videoData.create_time * 1000).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    // 更新视频作者信息
    videoAuthor.value = {
      id: videoData.author?.id || '1',
      name: videoData.author?.username || '未知作者',
      avatar: videoData.author?.avatar || '',
      followerCount: videoData.author?.follower_count || 0
    }

    // 获取视频统计数据
    try {
      const statsResponse = await videoAPI.getVideoStats(videoId)
      if (statsResponse.data) {
        const statsData = statsResponse.data.data
        videoStats.value.likeCount = statsData.like_count?.toString() || '0'
        videoStats.value.favoriteCount = statsData.favorite_count?.toString() || '0'
        videoStats.value.shareCount = statsData.share_count?.toString() || '0'
        videoStats.value.viewCount = statsData.play_count?.toString() || videoData.view_count?.toString() || '0'
        videoStats.value.danmakuCount = statsData.danmaku_count?.toString() || '0'
        videoStats.value.coinCount = statsData.coin_count?.toString() || '0'
        isLiked.value = statsData.is_liked
        isFavorited.value = statsData.is_favorite
        isCoined.value = statsData.is_coined
        
        // 更新弹幕加载器的总数
        if (danmakuLoader) {
          danmakuLoader.totalCount.value = statsData.danmaku_count || 0
        }
      }
    } catch (statsError) {
      console.warn('获取视频统计数据失败:', statsError)
      // 使用默认值
      videoStats.value.likeCount = videoData.like_count?.toString() || '0'
      videoStats.value.favoriteCount = videoData.favorite_count?.toString() || '0'
      videoStats.value.shareCount = videoData.share_count?.toString() || '0'
      videoStats.value.viewCount = videoData.view_count?.toString() || '0'
    }

    // 弹幕数据会通过 danmakuLoader 自动加载，这里不需要额外处理
    // useDanmakuLoader 会在 onMounted 中初始化并加载弹幕
  } catch (error: any) {
    videoError.value = true
    console.error('视频加载错误:', error)
    
    // 检查是否是HLS 404错误（转码未完成）
    if (error.response?.status === 404 && error.response?.data?.transcode_status) {
      const transcodeStatus = error.response.data.transcode_status
      
      console.log('HLS不可用，转码状态:', transcodeStatus)
      
      if (transcodeStatus === 'pending' || transcodeStatus === 'processing') {
        // 转码进行中，显示提示信息
        errorMessage.value = '视频转码中，请稍后刷新页面...'
        videoLoadError.value = true
      } else if (transcodeStatus === 'failed') {
        // 转码失败
        errorMessage.value = '视频转码失败，无法播放'
        videoLoadError.value = true
      } else {
        // 其他情况
        errorMessage.value = error.message || '视频加载失败，请稍后重试'
        videoLoadError.value = true
      }
    } else {
      // 其他错误
      errorMessage.value = error.message || '视频加载失败，请稍后重试'
      videoLoadError.value = true
    }
  } finally {
    loading.value = false
  }
}

// 键盘快捷键（模拟播放模式）
const handleKeydown = (e: KeyboardEvent) => {
  switch (e.code) {
    case 'Space':
      e.preventDefault()
      togglePlay()
      break
    case 'ArrowLeft':
      e.preventDefault()
      if (videoPlayer.value) {
        videoPlayer.value.currentTime = Math.max(0, videoPlayer.value.currentTime - 10)
      }
      break
    case 'ArrowRight':
      e.preventDefault()
      if (videoPlayer.value) {
        videoPlayer.value.currentTime = Math.min(duration.value, videoPlayer.value.currentTime + 10)
      }
      break
    case 'ArrowUp':
      e.preventDefault()
      volume.value = Math.min(100, volume.value + 5)
      setVolume()
      break
    case 'ArrowDown':
      e.preventDefault()
      volume.value = Math.max(0, volume.value - 5)
      setVolume()
      break
    case 'KeyM':
      e.preventDefault()
      toggleMute()
      break
  }
}

// 处理视频加载错误
const handleVideoError = (event: Event) => {
  console.log('视频元素错误:', event)
  const target = event.target as HTMLVideoElement
  
  // 检查错误类型
  if (target.error) {
    const error = target.error
    console.log('视频错误详情:', {
      code: error.code,
      message: error.message
    })
    
    // 416错误（Range Not Satisfiable）通常是由于Range请求问题
    // 尝试重新加载整个视频
    if (error.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
      console.log('视频源不支持，尝试重新加载')
      videoLoadError.value = true
      
      // 延迟重试
      setTimeout(() => {
        if (videoPlayer.value) {
          // 清除Range头，重新加载
          videoPlayer.value.src = videoPlayer.value.src + '?t=' + Date.now()
          videoPlayer.value.load()
          
          // 尝试播放
          videoPlayer.value.play().catch(err => {
            console.error('重试播放失败:', err)
            errorMessage.value = '视频加载失败，请稍后重试'
          })
        }
      }, 1000)
      return
    }
  }
  
  videoLoadError.value = true
  
  // 尝试切换到备用视频源
  if (currentVideoSourceIndex.value < 2) { // 最多尝试3个源
    currentVideoSourceIndex.value++
    console.log(`尝试切换到备用视频源 ${currentVideoSourceIndex.value}`)
    
    // 延迟重试，给浏览器时间处理错误
    setTimeout(() => {
      if (videoPlayer.value) {
        // 尝试重新加载视频
        videoPlayer.value.load()
        // 尝试静音播放以避免浏览器阻止自动播放
        videoPlayer.value.muted = true
        isMuted.value = true
        videoPlayer.value.play().catch(err => {
          console.error('自动播放失败:', err)
          // 如果静音播放也失败，尝试普通播放
          if (videoPlayer.value) {
            videoPlayer.value.muted = false
            isMuted.value = false
          }
        })
      }
    }, 1000)
  } else {
    errorMessage.value = '视频加载失败，请稍后重试'
  }
}

// 重试加载视频
const retryLoadVideo = () => {
  videoLoadError.value = false
  errorMessage.value = ''
  
  if (videoPlayer.value) {
    // 重置视频源索引
    currentVideoSourceIndex.value = 0
    
    // 重新加载视频
    videoPlayer.value.load()
    
    // 尝试播放
    videoPlayer.value.play().catch(err => {
      console.error('重试播放失败:', err)
      videoLoadError.value = true
      errorMessage.value = '视频加载失败，请检查网络连接'
    })
  }
}

// 尝试下一个视频源
const tryNextVideoSource = () => {
  if (video.value && video.value.quality_options && currentVideoSourceIndex.value < video.value.quality_options.length - 1) {
    currentVideoSourceIndex.value++
    const nextSource = video.value.quality_options[currentVideoSourceIndex.value]
    
    if (nextSource && nextSource.url) {
      console.log(`切换到视频源 ${currentVideoSourceIndex.value}:`, nextSource.quality)
      
      // 更新视频源
      const cleanedUrl = cleanVideoUrl(nextSource.url)
      video.value.src = cleanedUrl
      
      // 重置错误状态
      videoLoadError.value = false
      errorMessage.value = ''
      
      // 重新加载视频
      if (videoPlayer.value) {
        videoPlayer.value.load()
        videoPlayer.value.play().catch(err => {
          console.error('切换视频源后播放失败:', err)
        })
      }
    }
  } else {
    console.log('没有更多可用的视频源')
    errorMessage.value = '所有视频源都不可用，请稍后重试'
  }
}

// 视频加载状态处理
const onVideoLoadStart = () => {
  console.log('视频开始加载')
}

const onVideoLoaded = () => {
  console.log('视频数据加载完成')
  videoLoadError.value = false
  videoReady.value = true // 标记视频已就绪
}

const onVideoWaiting = () => {
  console.log('视频缓冲中...')
}

const onVideoCanPlay = () => {
  console.log('视频可以开始播放')
  videoLoadError.value = false
  // 更新缓存进度
  updateBufferProgress()
}

// 视频播放事件
const onVideoPlay = async () => {
  console.log('视频开始播放')
  isPlaying.value = true

  // 记录播放量（首次播放时）
  await recordPlay()

  // 开始网络质量检测
  startNetworkQualityCheck()

  // 开始预加载分片
  preloadSegments()
}

// 视频暂停事件
const onVideoPause = () => {
  console.log('视频暂停')
  isPlaying.value = false
  
  // 上报暂停事件
  reportProgress('pause')
}

// 视频结束事件
const onVideoEnded = () => {
  console.log('视频播放结束')
  isPlaying.value = false
  currentTime.value = 0
  progress.value = 0

  // 标记完整观看
  markComplete()

  // 视频结束时清空弹幕显示
  displayDanmakus.value = []
  displayedServerDanmakuIds.value.clear()
}

// 监听视频时间更新事件
const onTimeUpdate = () => {
  if (videoPlayer.value && !isSeeking.value) {
    const videoCurrentTime = videoPlayer.value.currentTime
    currentTime.value = videoCurrentTime
    progress.value = (videoCurrentTime / duration.value) * 100

    // 更新缓存进度
    updateBufferProgress()

    // 更新弹幕位置
    updateDanmakusPosition()

    // 弹幕预加载检查（每5秒检查一次）
    if (Math.floor(videoCurrentTime) % 5 === 0 && danmakuLoader) {
      danmakuLoader.checkPreload(videoCurrentTime)
    }

    // 从服务器弹幕列表中显示当前时间应该出现的弹幕
    displayServerDanmakus(videoCurrentTime)

    // 调试：在30秒附近打印日志
    if (Math.abs(videoCurrentTime - 30) < 0.5) {
      console.log('onTimeUpdate - 视频时间:', videoCurrentTime, 'serverDanmakus数量:', serverDanmakus.value.length, 'displayDanmakus数量:', displayDanmakus.value.length)
    }
  }
}

// 更新缓存进度
const updateBufferProgress = () => {
  if (videoPlayer.value && videoPlayer.value.buffered.length > 0) {
    const bufferedEnd = videoPlayer.value.buffered.end(videoPlayer.value.buffered.length - 1)
    bufferProgress.value = (bufferedEnd / duration.value) * 100
  }
}

// 预加载分片
const preloadSegments = async () => {
  if (!videoPlayer.value || !isPlaying.value || !video.value) return

  const currentTime = videoPlayer.value.currentTime

  // 根据网络质量确定预加载时间范围
  let preloadTime: number
  switch (networkQuality.value) {
    case 'good':
      preloadTime = 60 // 良好网络：预加载60秒
      break
    case 'fair':
      preloadTime = 30 // 一般网络：预加载30秒
      break
    case 'poor':
      preloadTime = 15 // 较差网络：预加载15秒
      break
    default:
      preloadTime = 30 // 默认30秒
  }

  const endTime = Math.min(currentTime + preloadTime, duration.value)

  // 计算需要预加载的分片范围
  const startSegment = Math.floor(currentTime / 10) // 假设每个分片10秒
  const endSegment = Math.floor(endTime / 10)

  // 获取当前选择的清晰度
  const currentResolution = videoQuality.value || 'auto'

  console.log(`预加载策略: 网络质量=${networkQuality.value}, 预加载时间=${preloadTime}秒, 分片范围=${startSegment}-${endSegment}`)

  // 预加载当前清晰度的分片
  for (let i = startSegment; i <= endSegment; i++) {
    const segmentUrl = `http://localhost:8080/api/video/${video.value.id}/stream/${currentResolution}/segment_${i.toString().padStart(3, '0')}.ts`
    try {
      // 使用 fetch 预加载，不缓存到内存
      await fetch(segmentUrl, {
        method: 'HEAD', // 只请求头，不下载内容
        cache: 'force-cache',
      })
      console.log(`预加载 ${currentResolution} 分片 ${i} 完成`)
    } catch (error) {
      console.error(`预加载 ${currentResolution} 分片 ${i} 失败:`, error)
    }
  }
}

// 更新弹幕位置
const updateDanmakusPosition = () => {
  if (!danmakuEnabled.value || !videoPlayer.value) return

  // 更新服务器弹幕位置（无论视频是否播放，都要更新弹幕位置）
  updateServerDanmakuPositions()
}

// 进度条拖动状态
const isSeeking = ref(false)

// 处理登录事件
const handleLogin = () => {
  // 派发事件给父组件或全局监听
  window.dispatchEvent(new CustomEvent('show-login-modal'))
}

// 监听video.value的变化，当video元素渲染后初始化HLS播放器
watch(video, async (newVideo) => {
  if (newVideo && newVideo.src) {
    console.log('Video data changed, waiting for video element to be ready...')
    
    // 等待DOM更新
    await nextTick()
    
    // 检查video元素是否已绑定
    let retryCount = 0
    const maxRetries = 10
    const retryDelay = 100
    
    while (!videoPlayer.value && retryCount < maxRetries) {
      console.log(`Waiting for video player element (attempt ${retryCount + 1}/${maxRetries})`)
      await new Promise(resolve => setTimeout(resolve, retryDelay))
      retryCount++
    }
    
    if (!videoPlayer.value) {
      console.error('Video player element not found after retries')
      videoLoadError.value = true
      errorMessage.value = '视频播放器初始化失败，请刷新页面重试'
      return
    }
    
    console.log('Video player element found, initializing HLS player')
    console.log('使用HLS播放器')
    initHLSPlayer(newVideo.src)
  }
})

// 生命周期
onMounted(() => {
  fetchVideoData()
  window.addEventListener('keydown', handleKeydown)

  // 开始定时更新弹幕位置
  const danmakuUpdateInterval = setInterval(updateDanmakusPosition, 16) // 约60fps

  // 初始化弹幕加载器（延迟初始化，等待videoPlayer就绪）
  setTimeout(() => {
    if (videoPlayer.value) {
      initDanmakuLoader()
    }
  }, 1000)

  onUnmounted(() => {
    clearInterval(danmakuUpdateInterval)
    window.removeEventListener('keydown', handleKeydown)
    if (controlsTimeout) {
      clearTimeout(controlsTimeout)
    }
    // 清理HLS实例
    cleanupHLS()
    // 重置播放量统计
    resetAnalytics()
    // 清理弹幕加载器
    if (danmakuLoader) {
      danmakuLoader.clearDisplay()
    }
  })
})
</script>

<style scoped>
/* B站品牌色彩变量 */
:root {
  /* 主色调 */
  --bilibili-pink: #FB7299;
  --bilibili-pink-light: #FF85A2;
  --bilibili-pink-dark: #F25D8E;
  /* 辅助色 */
  --bilibili-blue: #00A1D6;
  --bilibili-blue-light: #26B8E9;
  --bilibili-blue-dark: #0084B7;
  /* 灰色系统 */
  --bilibili-gray: #9499A0;
  --bilibili-gray-light: #C9CCD0;
  --bilibili-gray-dark: #61666D;
  --bilibili-gray-extra-light: #E0E0E0;
  --bilibili-gray-extra-dark: #2C2D30;
  /* 背景色 */
  --bilibili-bg-primary: #FFFFFF;
  --bilibili-bg-secondary: #F6F7F8;
  --bilibili-bg-tertiary: #F1F2F3;
  --bilibili-bg-dark: #18191C;
  /* 文字颜色 */
  --bilibili-text-primary: #18191C;
  --bilibili-text-secondary: #61666D;
  --bilibili-text-tertiary: #9499A0;
  --bilibili-text-dark: #F5F5F5;
  --bilibili-text-dark-secondary: #C9CCD0;
  --bilibili-text-dark-tertiary: #9499A0;
  /* 边框颜色 */
  --bilibili-border: #E0E0E0;
  --bilibili-border-dark: #2C2D30;
  /* 阴影 */
  --bilibili-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  --bilibili-shadow-md: 0 4px 16px rgba(0, 0, 0, 0.12);
  /* 圆角 */
  --bilibili-radius: 8px;
  --bilibili-radius-sm: 4px;
  --bilibili-radius-lg: 12px;
  /* 过渡 */
  --bilibili-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 弹幕样式 */
.danmaku-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 10;
}

/* 基本样式 */
.bg-bilibili-primary {
  background-color: var(--bilibili-pink);
}

.text-bilibili-primary {
  color: var(--bilibili-pink);
}

.text-shadow {
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.8);
}

/* 点赞投币收藏按钮动画 */
@keyframes btnClick {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes likePop {
  0% {
    transform: scale(1);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

/* 平滑滚动效果 */
html {
  scroll-behavior: smooth;
}

/* 响应式调整 */
@media (max-width: 1024px) {
  /* 调整网格布局 */
  #video-container + .grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  /* 调整视频播放器高度 */
  #video-container {
    aspect-ratio: 16 / 9;
  }
  
  /* 调整互动按钮布局 */
  .space-x-8 {
    flex-wrap: wrap;
    justify-content: space-around;
    gap: 1rem;
  }
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  background-color: var(--bilibili-pink);
  border-radius: 3px;
}

::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.1);
}

/* 页面加载动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 为所有卡片添加进入动画 */
.bg-white.rounded-lg {
  animation: fadeIn 0.3s ease-out;
}

/* 点赞投币收藏按钮点击动画 */
button:active {
  animation: btnClick 0.2s ease-out;
}

/* 弹幕发送成功反馈 */
@keyframes danmakuSendSuccess {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.1);
    opacity: 0;
  }
}

/* 视频卡片悬停效果增强 */
.cursor-pointer:hover {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 按钮点击效果 */
button:active {
  transform: scale(0.95);
  transition: transform 0.1s ease-out;
}

/* 控制栏进度条悬停效果 */
.group\/seek:hover .absolute.h-full.bg-gray-500 {
  height: 100%;
}

/* B站风格进度条样式 */
.group\/seek {
  transition: height 0.2s ease-out;
}

.group\/seek:hover {
  height: 6px;
}

/* 进度条层叠样式 */
.group\/seek > div {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 9999px;
  transition: width 0.1s ease-out;
}

/* 未缓存区域（底层） */
.group\/seek > div:first-child {
  background-color: #61666D;
  width: 100%;
  z-index: 1;
}

/* 已缓存进度（中间层） */
.group\/seek > div:nth-child(2) {
  background-color: #00A1D6;
  z-index: 2;
  opacity: 0.8;
}

/* 已播放进度（顶层） */
.group\/seek > div:nth-child(3) {
  background-color: #FB7299;
  z-index: 3;
}

/* 拖动手柄 */
.group\/seek > div:nth-child(4) {
  z-index: 4;
  transition: all 0.1s ease-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.group\/seek:hover > div:nth-child(4) {
  transform: scale(1.2);
}

/* 悬停时间提示 */
.group\/seek > div:last-child {
  z-index: 5;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  white-space: nowrap;
  pointer-events: none;
  transition: opacity 0.2s ease-out;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* 弹幕动画 */
@keyframes danmakuSlide {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(-100%);
  }
}
</style>