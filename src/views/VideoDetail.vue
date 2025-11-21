<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
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
          <!-- 视频播放器 - B站风格布局 -->
          <div class="w-full bg-black mb-6 shadow-lg rounded-lg overflow-hidden">
            <!-- 视频容器 -->
            <div class="relative aspect-video w-full">
              <!-- 视频元素 -->
              <video 
                ref="videoPlayer"
                :src="video.src" 
                :poster="video.poster" 
                class="absolute inset-0 w-full h-full object-contain bg-black"
                controls
                @loadstart="handleVideoLoad"
                @error="handleVideoError"
              ></video>
              
              <!-- 弹幕容器 - B站风格 -->
              <div ref="danmakuContainer" class="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-20">
                <!-- 弹幕会动态添加到这里 -->
              </div>
              
              <!-- 顶部信息栏 -->
              <div class="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 text-white bg-gradient-to-b from-black/70 to-transparent z-30">
                <div class="flex items-center space-x-3">
                  <span class="text-sm font-medium bg-black/50 px-2 py-1 rounded">1080P</span>
                  <span class="text-sm bg-black/50 px-2 py-1 rounded">{{ video.views }} 观看</span>
                </div>
                <div class="flex items-center space-x-2">
                  <button class="w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-black/70 rounded-full transition-colors">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"></path>
                    </svg>
                  </button>
                  <button class="w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-black/70 rounded-full transition-colors">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              <!-- 底部控制栏 - B站风格 -->
              <div class="absolute bottom-0 left-0 right-0 z-30">
                <!-- 进度条 -->
                <div class="px-4 pb-2">
                  <div class="w-full h-1 bg-white/30 rounded-full cursor-pointer group">
                    <div class="h-full bg-bilibili-primary rounded-full w-1/3 relative">
                      <div class="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  </div>
                </div>
                
                <!-- 控制按钮栏 -->
                <div class="flex items-center justify-between px-4 pb-3 text-white">
                  <!-- 左侧控制 -->
                  <div class="flex items-center space-x-4">
                    <button class="w-10 h-10 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors">
                      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path>
                      </svg>
                    </button>
                    
                    <div class="flex items-center space-x-3">
                      <span class="text-sm font-medium">00:00</span>
                      <span class="text-sm text-white/70">/</span>
                      <span class="text-sm text-white/70">10:25</span>
                    </div>
                  </div>
                  
                  <!-- 右侧控制 -->
                  <div class="flex items-center space-x-3">
                    <!-- 弹幕控制 -->
                    <div class="flex items-center space-x-2">
                      <button @click="toggleDanmaku" class="flex items-center space-x-1 hover:text-bilibili-primary transition-colors text-sm">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                          <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
                        </svg>
                        <span>弹幕</span>
                      </button>
                      <div v-if="showDanmaku" class="w-20 h-1 bg-white/30 rounded-full relative">
                        <input
                          type="range"
                          min="30"
                          max="100"
                          v-model="danmakuOpacity"
                          class="w-full h-1 bg-transparent rounded-lg appearance-none cursor-pointer accent-bilibili-primary"
                          @input="updateDanmakuOpacity"
                        >
                      </div>
                    </div>
                    
                    <!-- 设置菜单 -->
                    <div class="relative group">
                      <button class="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.696-2.942.724-2.656 2.05l.548 3.063a1.532 1.532 0 01-2.286.948c-1.372-.696-2.942.724-2.656 2.05l.548 3.063c.286 1.328 2.288 2.75 4.929 2.75h10.734c2.64-0 4.643-1.422 4.929-2.75l.548-3.063c.286-1.328-2.288-2.75-4.929-2.75h-10.734c-2.64 0-4.643 1.422-4.929 2.75l-.548 3.063zM10 15a2 2 0 100-4 2 2 0 000 4zm-6-5a2 2 0 114 0 2 2 0 01-4 0zm12 0a2 2 0 114 0 2 2 0 01-4 0z" clip-rule="evenodd"></path>
                        </svg>
                      </button>
                    </div>
                    
                    <!-- 音量控制 -->
                    <div class="flex items-center space-x-2">
                      <button class="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.617 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.793a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clip-rule="evenodd"></path>
                        </svg>
                      </button>
                      <div class="w-16 h-1 bg-white/30 rounded-full">
                        <div class="h-full bg-bilibili-primary rounded-full w-2/3"></div>
                      </div>
                    </div>
                    
                    <!-- 全屏 -->
                    <button class="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L15.586 5H14a1 1 0 010-2zm-9 12a1 1 0 011 1v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 17H8a1 1 0 010 2H4a1 1 0 01-1-1v-4a1 1 0 012 0zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L17 13.586V12a1 1 0 011-1z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 移动端样式直接集成到组件类中，避免内联style标签问题 -->
          
          <!-- 视频信息区 - B站风格 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow-sm hover:shadow-md transition-shadow">
            <!-- 标题和统计信息 -->
            <div class="mb-4">
              <h1 class="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 hover:text-bilibili-primary transition-colors cursor-pointer">{{ video.title }}</h1>
              <div class="flex items-center justify-between flex-wrap gap-2">
                <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span class="flex items-center hover:text-bilibili-primary transition-colors cursor-pointer"><i class="far fa-eye mr-1"></i>{{ video.views }}</span>
                  <span class="flex items-center hover:text-bilibili-primary transition-colors cursor-pointer"><i class="far fa-calendar mr-1"></i>{{ video.publishedAt }}</span>
                </div>
                <div class="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                  <span class="hover:text-bilibili-primary transition-colors cursor-pointer">未经作者授权，禁止转载</span>
                </div>
              </div>
            </div>
            
            <!-- 互动按钮区 - B站风格 -->
            <div class="flex items-center justify-between py-3 border-t border-b border-gray-100 dark:border-gray-700">
              <div class="flex items-center space-x-6">
                <button @click="handleLike" class="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-bilibili-primary transition-colors group">
                  <div class="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-bilibili-primary/10 rounded-full transition-colors">
                    <i :class="video.isLiked ? 'fas fa-thumbs-up text-bilibili-primary' : 'far fa-thumbs-up'" class="text-lg"></i>
                  </div>
                  <span class="text-sm font-medium">{{ formatNumber(video.likes) }}</span>
                </button>
                
                <button class="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-bilibili-primary transition-colors">
                  <div class="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-bilibili-primary/10 rounded-full transition-colors">
                    <i class="far fa-coins text-lg"></i>
                  </div>
                  <span class="text-sm font-medium">投币</span>
                </button>
                
                <button class="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-bilibili-primary transition-colors">
                  <div class="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-bilibili-primary/10 rounded-full transition-colors">
                    <i class="far fa-star text-lg"></i>
                  </div>
                  <span class="text-sm font-medium">收藏</span>
                </button>
                
                <button class="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-bilibili-primary transition-colors">
                  <div class="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-bilibili-primary/10 rounded-full transition-colors">
                    <i class="far fa-share text-lg"></i>
                  </div>
                  <span class="text-sm font-medium">分享</span>
                </button>
              </div>
              
              <div class="flex items-center space-x-2">
                <button class="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-bilibili-primary/10 rounded-full transition-colors">
                  <i class="far fa-ellipsis-h text-gray-600 dark:text-gray-400"></i>
                </button>
              </div>
            </div>
            
            <!-- 作者信息 -->
            <div class="flex items-center justify-between pt-3">
              <div class="flex items-center space-x-3">
                <img :src="video.authorAvatar" alt="Author avatar" class="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-600 hover:border-bilibili-primary transition-colors cursor-pointer">
                <div>
                  <p class="font-medium text-gray-900 dark:text-white hover:text-bilibili-primary transition-colors cursor-pointer">{{ video.author }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400 hover:text-bilibili-primary transition-colors cursor-pointer">粉丝 1.2万</p>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <button class="px-4 py-2 bg-bilibili-primary text-white rounded-full text-sm hover:bg-bilibili-primary/90 transition-colors">
                  发消息
                </button>
                <button 
                  @click="handleFollow"
                  class="px-4 py-2 border border-bilibili-primary text-bilibili-primary rounded-full text-sm hover:bg-bilibili-primary/10 transition-colors"
                  :class="video.isFollowed ? 'bg-bilibili-primary/10' : 'bg-transparent'"
                >
                  {{ video.isFollowed ? '已关注' : '关注' }}
                </button>
              </div>
            </div>
          </div>
          
          <!-- 视频标签 - B站风格 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow-sm">
            <div class="flex items-center space-x-2 mb-3">
              <span class="text-sm text-gray-600 dark:text-gray-400">标签</span>
            </div>
            <div class="flex flex-wrap gap-2">
              <span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-bilibili-primary/10 hover:text-bilibili-primary transition-colors cursor-pointer">#科技</span>
              <span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-bilibili-primary/10 hover:text-bilibili-primary transition-colors cursor-pointer">#编程</span>
              <span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-bilibili-primary/10 hover:text-bilibili-primary transition-colors cursor-pointer">#前端</span>
              <span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-bilibili-primary/10 hover:text-bilibili-primary transition-colors cursor-pointer">#Vue</span>
            </div>
          </div>
          
          <!-- 视频简介 - B站风格 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">视频简介</h3>
              <button class="text-bilibili-primary text-sm hover:text-bilibili-primary/80 transition-colors">
                展开
              </button>
            </div>
            <div class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              <p class="mb-3">这是一个关于前端开发的视频教程，主要介绍Vue.js框架的使用方法和最佳实践。</p>
              <p class="mb-3">在本视频中，你将学习到：</p>
              <ul class="list-disc list-inside space-y-1 mb-3 ml-4">
                <li>Vue.js基础概念和核心特性</li>
                <li>组件化开发思想</li>
                <li>状态管理和路由配置</li>
                <li>项目实战案例分析</li>
              </ul>
              <p>如果你觉得这个视频对你有帮助，记得点赞、投币、收藏哦！</p>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div class="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                <span>未经作者授权，禁止转载</span>
                <span>·</span>
                <span>https://www.bilibili.com</span>
              </div>
            </div>
          </div>
          
          <!-- 视频描述 -->
          <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6">
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{{ video.description }}</p>
            <div class="mt-4 flex flex-wrap gap-2">
              <span v-for="tag in video.tags" :key="tag" class="inline-block bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300">#{{ tag }}</span>
            </div>
          </div>

          <!-- 弹幕输入 -->
          <div class="flex items-center space-x-2 p-2 bg-white rounded-md mb-6 shadow-sm border border-gray-100">
            <img :src="userStore.avatar || 'https://picsum.photos/100/100'" alt="Your avatar" class="w-8 h-8 rounded-full">
            <input 
              type="text" 
              v-model="danmakuText"
              placeholder="发送弹幕..."
              class="flex-1 px-4 py-2.5 rounded-full bg-gray-100 focus:outline-none focus:bg-white border border-transparent focus:border-blue-300 transition-all"
              @keyup.enter="addDanmaku"
            >
            <button 
              @click="addDanmaku" 
              class="px-5 py-2.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors font-medium text-sm"
              :disabled="!danmakuText.trim()"
            >
              发送
            </button>
          </div>

          <!-- 评论区 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-8">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ formatNumber(video.comments || 0) }} 条评论</h2>
            </div>
            <div class="p-4">
              <div class="flex mb-6">
                <img :src="userStore.avatar || 'https://picsum.photos/100/100'" alt="Your avatar" class="w-10 h-10 rounded-full mr-3">
                <div class="flex-1">
                  <textarea 
                    placeholder="写下你的评论..."
                    class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-bilibili-primary resize-none"
                    rows="3"
                  ></textarea>
                  <div class="flex justify-end mt-2">
                    <button class="bg-bilibili-primary text-white px-5 py-2 rounded-full hover:bg-purple-700 transition-colors text-sm font-medium">
                      发布评论
                    </button>
                  </div>
                </div>
              </div>

              <!-- 热门评论 -->
              <div class="space-y-6">
                <div class="flex">
                  <img src="https://picsum.photos/id/1005/100/100" alt="Comment author" class="w-10 h-10 rounded-full mr-3">
                  <div class="flex-1">
                    <div class="flex items-center mb-1">
                      <span class="font-semibold text-gray-900 dark:text-white">用户昵称</span>
                      <span class="ml-2 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded">官方</span>
                    </div>
                    <p class="text-gray-700 dark:text-gray-300 mb-2">这是一条热门评论，内容非常精彩，值得大家点赞和回复。</p>
                    <div class="flex items-center text-sm text-gray-500 mb-3">
                      <span>2023-10-01</span>
                      <span class="mx-2">·</span>
                      <button class="hover:text-bilibili-primary transition-colors">回复</button>
                    </div>
                    <div class="flex items-center space-x-4">
                      <button class="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
                        </svg>
                        <span>1.2K</span>
                      </button>
                      <button class="flex items-center space-x-1 text-gray-500 hover:text-bilibili-primary transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01"></path>
                        </svg>
                        <span>回复</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="flex">
                  <img src="https://picsum.photos/id/1012/100/100" alt="Comment author" class="w-10 h-10 rounded-full mr-3">
                  <div class="flex-1">
                    <div class="flex items-center mb-1">
                      <span class="font-semibold text-gray-900 dark:text-white">另一位用户</span>
                    </div>
                    <p class="text-gray-700 dark:text-gray-300 mb-2">这个视频真不错，支持一下UP主！希望能看到更多类似内容。</p>
                    <div class="flex items-center text-sm text-gray-500 mb-3">
                      <span>2023-10-02</span>
                      <span class="mx-2">·</span>
                      <button class="hover:text-bilibili-primary transition-colors">回复</button>
                    </div>
                    <div class="flex items-center space-x-4">
                      <button class="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
                        </svg>
                        <span>865</span>
                      </button>
                      <button class="flex items-center space-x-1 text-gray-500 hover:text-bilibili-primary transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01"></path>
                        </svg>
                        <span>回复</span>
                      </button>
                    </div>

                    <!-- 回复 -->
                    <div class="mt-4 ml-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                      <div class="flex mb-4">
                        <img src="https://picsum.photos/id/1025/100/100" alt="Reply author" class="w-8 h-8 rounded-full mr-2">
                        <div class="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                          <div class="flex items-center mb-1">
                            <span class="font-semibold text-gray-900 dark:text-white text-sm">UP主</span>
                            <span class="ml-2 text-xs bg-bilibili-primary/20 text-bilibili-primary px-2 py-0.5 rounded">作者</span>
                          </div>
                          <p class="text-gray-700 dark:text-gray-300 text-sm">感谢支持！会继续努力创作的~</p>
                          <div class="flex items-center text-xs text-gray-500 mt-2">
                            <span>2023-10-02</span>
                            <span class="mx-2">·</span>
                            <button class="hover:text-bilibili-primary transition-colors">回复</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button class="w-full py-3 text-bilibili-primary hover:text-purple-700 transition-colors text-sm font-medium">
                查看更多评论
              </button>
            </div>
          </div>
        </div>

        <!-- 右侧推荐视频 - B站风格 -->
        <div class="lg:col-span-1">
          <!-- 推荐视频标题 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 shadow-sm">
            <h3 class="text-lg font-bold flex items-center text-gray-900 dark:text-white">
              <i class="fas fa-fire mr-2 text-bilibili-primary"></i>推荐视频
            </h3>
          </div>
          
          <!-- 推荐视频列表 -->
          <div class="space-y-3">
            <div v-for="recVideo in recommendedVideos" :key="recVideo.id" @click="goToVideo(recVideo.id)" class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group">
              <div class="flex">
                <div class="relative w-40 h-24 flex-shrink-0 overflow-hidden">
                  <img :src="recVideo.poster" alt="Video thumbnail" class="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300">
                  <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <i class="fas fa-play text-white text-xl"></i>
                  </div>
                  <span v-if="recVideo.duration" class="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium backdrop-blur-sm">{{ recVideo.duration }}</span>
                </div>
                <div class="flex-1 p-3 overflow-hidden">
                  <h4 class="font-medium text-sm line-clamp-2 text-gray-900 dark:text-white group-hover:text-bilibili-primary transition-colors mb-2">{{ recVideo.title }}</h4>
                  <div class="flex items-center justify-between">
                    <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{{ recVideo.author }}</p>
                    <div class="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <i class="far fa-play-circle mr-1"></i>
                      <span>{{ recVideo.views }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 加载更多 -->
            <div class="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
              <button class="text-bilibili-primary hover:text-bilibili-primary/80 transition-colors text-sm font-medium">
                查看更多推荐
              </button>
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
import { useVideoStore } from '../stores/videoStore'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const videoId = ref(route.params.id as string)
const videoPlayer = ref<HTMLVideoElement | null>(null)
const danmakuContainer = ref<HTMLElement | null>(null)
const loading = ref(false)

// 视频数据
const video = ref(null)
const recommendedVideos = ref([])
const danmakus = ref([])
const danmakuText = ref('')
const showDanmaku = ref(true)
const danmakuOpacity = ref(100)

// 获取推荐视频 - 使用真实后端API
const getRecommendedVideos = async () => {
  try {
    const videoStore = useVideoStore()
    const result = await videoStore.fetchRecommendedVideos({ page: 1, pageSize: 4 })
    if (result.success && result.data) {
      return result.data.map(video => ({
        id: video.video_id,
        title: video.title,
        poster: video.thumbnail_url,
        author: video.author_name,
        views: video.view_count ? `${(video.view_count / 1000).toFixed(1)}K` : '0'
      }))
    }
    return []
  } catch (error: any) {
    console.error('获取推荐视频失败:', error)
    
    // 处理认证错误（如401错误）
    if (error.message?.includes('refresh token') || error.message?.includes('认证')) {
      console.log('认证错误，使用匿名模式显示推荐视频')
    }
    
    // 返回空数组，不影响主视频播放
    return []
  }
}

// 处理登录
const handleLogin = () => {
  router.push('/login')
}

// 添加弹幕
const addDanmaku = () => {
  if (!danmakuText.value.trim()) return;
  
  // 创建新弹幕
  const newDanmaku = {
    id: Date.now(),
    text: danmakuText.value,
    color: getRandomColor(),
    position: Math.random() * 80 + 10,
    time: videoPlayer.value?.currentTime || 0
  };
  
  danmakus.value.push(newDanmaku);
  danmakuText.value = '';
  
  // 渲染弹幕
  renderDanmaku(newDanmaku);
};

const updateDanmakuOpacity = () => {
  if (danmakuContainer.value) {
    const danmakuElements = danmakuContainer.value.querySelectorAll('.danmaku');
    danmakuElements.forEach(el => {
      el.style.opacity = danmakuOpacity.value / 100;
    });
  }
};

// 随机颜色生成
const getRandomColor = () => {
  const colors = ['#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
  return colors[Math.floor(Math.random() * colors.length)];
};

// 渲染弹幕
const renderDanmaku = (danmaku) => {
  const container = danmakuContainer.value;
  if (!container || !videoPlayer.value) return;
  
  const danmakuElement = document.createElement('div');
    danmakuElement.className = 'danmaku-item absolute whitespace-nowrap text-white';
    danmakuElement.style.color = danmaku.color;
    danmakuElement.style.left = '100%';
    danmakuElement.style.top = `${danmaku.position}%`;
    danmakuElement.style.transform = 'translateY(-50%)';
    danmakuElement.style.opacity = danmakuOpacity.value / 100;

  danmakuElement.textContent = danmaku.text;
  
  container.appendChild(danmakuElement);
  
  // 移除过期弹幕
  setTimeout(() => {
    danmakuElement.remove();
  }, 8000);
};

// 切换弹幕显示
const toggleDanmaku = () => {
  console.log('切换弹幕显示状态');
}

// 处理点赞
const handleLike = () => {
  if (!video.value) return;
  video.value.isLiked = !video.value.isLiked;
  video.value.likes += video.value.isLiked ? 1 : -1;
}

// 获取视频详情和推荐视频
const fetchVideoData = async () => {
  if (!videoId.value) return
  
  loading.value = true
  try {
    // 使用真实后端API获取视频详情
    const videoStore = useVideoStore()
    const result = await videoStore.fetchVideoDetail(videoId.value)
    
    // 正确处理fetchVideoDetail的返回值格式
    if (result && result.success && result.data) {
      // videoStore已经将API数据转换为了本地格式
      video.value = {
        ...result.data,
        // 确保视图计数格式正确
        views: result.data.views ? `${(result.data.views / 1000).toFixed(1)}K` : '0'
      }
    } else {
      console.error('获取视频详情失败:', result?.error || '未知错误')
      // 如果API调用失败，使用mock数据
      video.value = {
        id: videoId.value,
        title: '示例视频标题',
        src: 'https://www.w3schools.com/html/mov_bbb.mp4',
        poster: 'https://picsum.photos/1280/720',
        views: '0.1K',
        publishedAt: '今天',
        author: '示例作者',
        authorAvatar: 'https://picsum.photos/100/100',
        description: '这是一个示例视频描述，用于测试视频详情页的显示效果。',
        tags: ['示例', '测试', '视频'],
        likes: 100,
        comments: 10,
        shares: 5,
        isLiked: false,
        isFollowed: false
      }
    }
    
    // 获取推荐视频
    recommendedVideos.value = await getRecommendedVideos()
    
  } catch (error: any) {
    console.error('获取视频数据失败:', error)
    
    // 处理认证错误（如401错误）
    if (error.message?.includes('refresh token') || error.message?.includes('认证')) {
      console.log('认证错误，使用匿名模式显示视频')
      // 认证错误时仍然显示mock数据，但不影响用户体验
    }
    
    // 错误情况下也提供mock数据，确保用户可以观看视频
    video.value = {
      id: videoId.value,
      title: '示例视频标题',
      src: 'https://www.w3schools.com/html/mov_bbb.mp4',
      poster: 'https://picsum.photos/1280/720',
      views: '0.1K',
      publishedAt: '今天',
      author: '示例作者',
      authorAvatar: 'https://picsum.photos/100/100',
      description: '这是一个示例视频描述，用于测试视频详情页的显示效果。',
      tags: ['示例', '测试', '视频'],
      likes: 100,
      comments: 10,
      shares: 5,
      isLiked: false,
      isFollowed: false
    }
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

// 处理视频加载错误，切换到备用视频
const handleVideoError = (event) => {
  console.error('视频加载失败，尝试加载备用视频:', event);
  if (video.value && video.value.altSrc) {
    video.value.src = video.value.altSrc;
    videoPlayer.value.load();
  }
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

// 格式化数字为K/M表示法
const formatNumber = (num) => {
  if (!num) return '0';
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// 监听路由变化
watch(() => route.params.id, (newId) => {
  if (newId) {
    videoId.value = newId as string
    fetchVideoData()
  }
})

// 组件挂载时获取数据
onMounted(() => {
  fetchVideoData()
})
</script>

<style scoped>
.danmaku {
  animation: danmaku-move 8s linear;
}

@keyframes danmaku-move {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(-100%);
  }
}

.related-videos {
  position: sticky;
  top: 2rem;
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
}

@media (max-width: 1024px) {
  .related-videos {
    position: relative;
    top: 0;
    max-height: none;
  }
}

/* B站风格样式 */
.text-bilibili-primary {
  color: #FB7299;
}

.bg-bilibili-primary {
  background-color: #FB7299;
}

.border-bilibili-primary {
  border-color: #FB7299;
}

.hover\:text-bilibili-primary:hover {
  color: #FB7299;
}

.hover\:bg-bilibili-primary\/10:hover {
  background-color: rgba(251, 114, 153, 0.1);
}

.hover\:bg-bilibili-primary\/90:hover {
  background-color: rgba(251, 114, 153, 0.9);
}

.bg-bilibili-primary\/10 {
  background-color: rgba(251, 114, 153, 0.1);
}

/* 视频控制栏样式 */
.video-controls {
  background: linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.3), transparent);
}

.control-button {
  transition: all 0.2s ease;
}

.control-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

/* 进度条样式 */
.progress-bar {
  background: rgba(255, 255, 255, 0.3);
  height: 3px;
  border-radius: 2px;
  cursor: pointer;
  transition: height 0.2s ease;
}

.progress-bar:hover {
  height: 6px;
}

.progress-filled {
  background: #FB7299;
  height: 100%;
  border-radius: 2px;
  position: relative;
}

.progress-filled::after {
  content: '';
  position: absolute;
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  background: #FB7299;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.progress-bar:hover .progress-filled::after {
  opacity: 1;
}

/* 弹幕样式 */
.danmaku-item {
  font-size: 18px;
  font-weight: 500;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
  margin-right: 8px;
  margin-bottom: 4px;
}

input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #FB7299;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #FB7299;
  cursor: pointer;
  border: none;
}
</style>