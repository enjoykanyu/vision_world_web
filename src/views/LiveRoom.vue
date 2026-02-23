<template>
  <div class="min-h-screen bg-[#1a1a2e] text-white">
    <!-- 使用公用导航头组件 -->
    <NavHeader
      :isLoggedIn="userStore.isLoggedIn"
      :username="userStore.username"
      @login="showLoginModal = true"
    ></NavHeader>

    <!-- 直播间顶部信息栏 -->
    <header class="h-14 bg-[#232342] border-b border-white/10 flex items-center justify-between px-4 shrink-0">
      <!-- 左侧：主播信息 -->
      <div class="flex items-center space-x-3">
        <div class="relative">
          <img :src="streamInfo.streamer.avatar" class="w-10 h-10 rounded-full object-cover" :class="streamInfo.isLive ? 'border-2 border-pink-500' : 'border-2 border-gray-500'">
          <div v-if="streamInfo.isLive" class="absolute -bottom-1 -right-1 w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center">
            <svg class="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
              <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.523 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
        <div>
          <div class="flex items-center space-x-2">
            <h1 class="font-bold text-white">{{ streamInfo.streamer.name }}</h1>
            <span v-if="streamInfo.isLive" class="px-2 py-0.5 bg-pink-500 text-white text-xs rounded-full">直播中</span>
            <span v-else class="px-2 py-0.5 bg-gray-500 text-white text-xs rounded-full">未开播</span>
          </div>
          <p class="text-xs text-gray-400">{{ streamInfo.title }}</p>
        </div>
        <button class="ml-4 px-4 py-1.5 bg-pink-500 hover:bg-pink-600 text-white text-sm rounded-full transition-colors">
          关注
        </button>
      </div>

      <!-- 中间：观看数据 -->
      <div class="flex items-center space-x-6 text-sm">
        <div class="flex items-center space-x-1.5 text-gray-300 bg-white/5 px-3 py-1.5 rounded-full">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
          <span class="text-white font-medium">{{ onlineCount }}人在线</span>
        </div>
      </div>

      <!-- 右侧：操作按钮 -->
      <div class="flex items-center space-x-4">
        <button class="flex items-center space-x-1.5 text-gray-300 hover:text-white transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <span class="text-sm">举报</span>
        </button>
        <button class="flex items-center space-x-1.5 text-gray-300 hover:text-white transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
          </svg>
          <span class="text-sm">更多</span>
        </button>
        <button @click="goBack" class="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </header>

    <!-- 主体内容 -->
    <div class="flex h-[calc(100vh-56px-64px)]">
      <!-- 左侧：视频区域 -->
      <div class="flex-1 flex flex-col bg-black">
        <!-- 视频播放器 -->
        <div class="flex-1 relative flex items-center justify-center group">
          <video
            ref="videoPlayer"
            autoplay
            :muted="streamInfo.isMuted"
            playsinline
            class="w-full h-full object-contain"
          ></video>

          <!-- 手动播放按钮 -->
          <div v-if="showPlayButton" class="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <button
              @click="manualPlay"
              class="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-full flex items-center space-x-2 transition-colors"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/>
              </svg>
              <span>点击播放</span>
            </button>
          </div>

          <!-- 下播状态覆盖层 -->
          <div v-if="!streamInfo.isLive" class="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 z-20">
            <img :src="streamInfo.cover" class="absolute inset-0 w-full h-full object-cover opacity-30">
            <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-gray-900/50"></div>
            <div class="relative z-10 flex flex-col items-center text-center px-8">
              <!-- 主播头像 -->
              <div class="relative mb-6">
                <img :src="streamInfo.streamer.avatar" class="w-24 h-24 rounded-full object-cover border-4 border-gray-600 shadow-2xl">
                <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </div>
              </div>
              <!-- 下播提示 -->
              <h2 class="text-3xl font-bold text-white mb-2">主播已下播</h2>
              <p class="text-gray-400 mb-6">感谢观看，下次再见 👋</p>
              <!-- 主播信息 -->
              <div class="flex items-center space-x-4 mb-8">
                <span class="text-white font-medium">{{ streamInfo.streamer.name }}</span>
                <span class="text-gray-500">|</span>
                <span class="text-gray-400">{{ streamInfo.title }}</span>
              </div>
              <!-- 操作按钮 -->
              <div class="flex items-center space-x-4">
                <button class="px-6 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-medium transition-colors flex items-center space-x-2">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.523 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                  </svg>
                  <span>查看回放</span>
                </button>
                <button class="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-full font-medium transition-colors">
                  关注主播
                </button>
              </div>
            </div>
          </div>

          <!-- 弹幕层 -->
          <div class="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              v-for="danmaku in floatingDanmaku"
              :key="danmaku.id"
              class="absolute text-white text-lg font-medium whitespace-nowrap will-change-transform"
              :style="{
                top: danmaku.top + '%',
                left: 0,
                transform: `translateX(${danmaku.position}px)`,
                color: danmaku.color,
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
              }"
            >
              {{ danmaku.text }}
            </div>
          </div>

          <!-- 礼物动画层 - 右下角显示 (已注释) -->
          <!--
          <div class="absolute bottom-24 right-4 pointer-events-none overflow-hidden">
            <div v-for="heart in activeHearts" :key="heart.id" class="gift-animation">
              <div class="fan-badge-burst">
                <div class="fan-badge-main">
                  <div class="fan-badge-card pink">
                    <div class="fan-badge-avatar">
                      <img src="https://i.pravatar.cc/150?u=me" class="w-full h-full rounded-full">
                    </div>
                    <div class="fan-badge-content">
                      <div class="fan-badge-title">粉丝团灯牌</div>
                      <div class="fan-badge-gift">💝 小心心 x1</div>
                    </div>
                    <div class="fan-badge-level">1</div>
                  </div>
                </div>
                <div v-for="n in 8" :key="n" class="fan-badge-particle" :style="{ '--i': n }">💝</div>
              </div>
            </div>
            <div v-for="ticket in activeTickets" :key="ticket.id" class="gift-animation">
              <div class="fan-badge-burst">
                <div class="fan-badge-main">
                  <div class="fan-badge-card blue">
                    <div class="fan-badge-avatar">
                      <img src="https://i.pravatar.cc/150?u=me" class="w-full h-full rounded-full">
                    </div>
                    <div class="fan-badge-content">
                      <div class="fan-badge-title">粉丝团灯牌</div>
                      <div class="fan-badge-gift">🎫 人气票 x1</div>
                    </div>
                    <div class="fan-badge-level">1</div>
                  </div>
                </div>
                <div v-for="n in 8" :key="n" class="fan-badge-particle" :style="{ '--i': n }">🎫</div>
              </div>
            </div>
            <div v-for="flower in activeFlowers" :key="flower.id" class="gift-animation">
              <div class="fan-badge-burst">
                <div class="fan-badge-main">
                  <div class="fan-badge-card rose">
                    <div class="fan-badge-avatar">
                      <img src="https://i.pravatar.cc/150?u=me" class="w-full h-full rounded-full">
                    </div>
                    <div class="fan-badge-content">
                      <div class="fan-badge-title">粉丝团灯牌</div>
                      <div class="fan-badge-gift">🌸 小花花 x1</div>
                    </div>
                    <div class="fan-badge-level">1</div>
                  </div>
                </div>
                <div v-for="n in 8" :key="n" class="fan-badge-particle" :style="{ '--i': n }">🌸</div>
              </div>
            </div>
          </div>
          -->

          <!-- 直播状态 -->
          <div class="absolute top-4 left-4 flex items-center space-x-2">
            <span class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">LIVE</span>
            <span class="bg-black/50 text-white text-xs px-2 py-1 rounded">{{ streamDuration }}</span>
          </div>

          <!-- Hover 时显示的控制栏 -->
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 pb-4 pt-12">
            <div class="flex items-center justify-between">
              <!-- 左侧控制按钮 -->
              <div class="flex items-center space-x-3">
                <!-- 暂停/播放 -->
                <button class="text-white hover:text-pink-400 transition-colors">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                  </svg>
                </button>
                <!-- 刷新 -->
                <button class="text-white hover:text-pink-400 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                </button>
                <!-- 音量 -->
                <button @click="toggleMute" class="text-white hover:text-pink-400 transition-colors">
                  <svg v-if="streamInfo.isMuted" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/>
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
                  </svg>
                </button>
                <!-- 播放时长 -->
                <span class="text-white text-sm font-medium">{{ streamDuration }}</span>
              </div>

              <!-- 右侧控制按钮 -->
              <div class="flex items-center space-x-3">
                <!-- 清晰度 -->
                <button class="text-white text-sm hover:text-pink-400 transition-colors">
                  720P 原画
                </button>
                <!-- 画中画 -->
                <button class="text-white hover:text-pink-400 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"/>
                  </svg>
                </button>
                <!-- 弹幕开关 -->
                <button class="text-white hover:text-pink-400 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
                  </svg>
                </button>
                <!-- 设置 -->
                <button class="text-white hover:text-pink-400 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </button>
                <!-- 全屏 -->
                <button @click="toggleFullscreen" class="text-white hover:text-pink-400 transition-colors">
                  <svg v-if="!isFullscreen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部礼物栏 -->
        <div class="h-24 bg-gradient-to-r from-[#2d1b3d] via-[#3d1f4d] to-[#2d1b3d] border-t border-white/10 flex items-center px-4">
          <!-- 礼物列表 -->
          <div class="flex items-center space-x-1 overflow-x-auto scrollbar-hide flex-1">
            <button
              v-for="gift in gifts"
              :key="gift.id"
              @click="sendGift(gift)"
              class="flex flex-col items-center px-3 py-2 rounded-xl hover:bg-white/10 transition-all duration-200 min-w-[72px] group relative"
            >
              <!-- 礼物图标容器 -->
              <div class="relative">
                <!-- 礼物背景光晕 -->
                <div class="absolute inset-0 blur-md opacity-50 group-hover:opacity-80 transition-opacity" :class="gift.glowColor"></div>
                <!-- 礼物图标 -->
                <div class="relative w-12 h-12 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200" :class="gift.bgGradient">
                  <svg v-if="gift.svg" class="w-7 h-7" viewBox="0 0 24 24" fill="none" v-html="gift.svg"></svg>
                  <span v-else class="text-2xl">{{ gift.icon }}</span>
                </div>
                <!-- 特殊标签 -->
                <div v-if="gift.tag" class="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] rounded-full font-bold" :class="gift.tagClass">
                  {{ gift.tag }}
                </div>
              </div>
              <!-- 礼物名称 -->
              <span class="text-xs text-gray-200 mt-1.5 font-medium">{{ gift.name }}</span>
              <!-- 价格 -->
              <span class="text-xs text-gray-400">{{ gift.price }}电池</span>
            </button>

            <!-- 包裹按钮 -->
            <button class="flex flex-col items-center px-3 py-2 rounded-xl hover:bg-white/10 transition-all min-w-[60px] ml-2">
              <div class="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
              </div>
              <span class="text-xs text-gray-300 mt-1">包裹</span>
              <svg class="w-3 h-3 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>

          <!-- 右侧余额和充值 -->
          <div class="flex items-center space-x-4 pl-4 border-l border-white/10 ml-2">
            <!-- 余额 -->
            <div class="flex flex-col items-center">
              <div class="flex items-center space-x-1">
                <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
                </svg>
                <span class="text-sm text-gray-400">余额:</span>
                <span class="text-sm text-yellow-400 font-bold">{{ userCoins }}</span>
              </div>
              <button class="mt-1 px-4 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 text-xs rounded-full transition-colors border border-yellow-500/30">
                立即充值 >
              </button>
            </div>

            <!-- 大航海 -->
            <div class="flex flex-col items-center">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2l2.5 6.5L18 9l-5 4 1.5 6.5L10 14l-4.5 5.5L7 13 2 9l5.5-.5L10 2z"/>
                </svg>
              </div>
              <span class="text-xs text-gray-300 mt-1">大航海</span>
              <button class="text-[10px] text-gray-500 hover:text-gray-300 transition-colors">
                立即上船 >
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：互动区域 -->
      <aside class="w-80 bg-[#232342] border-l border-white/10 flex flex-col">
        <!-- 标签页 -->
        <div class="flex border-b border-white/10">
          <button 
            @click="activeTab = 'chat'"
            class="flex-1 py-3 text-sm font-medium transition-colors relative"
            :class="activeTab === 'chat' ? 'text-pink-400' : 'text-gray-400 hover:text-white'"
          >
            弹幕
            <div v-if="activeTab === 'chat'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500"></div>
          </button>
          <button
            @click="switchToAudienceTab"
            class="flex-1 py-3 text-sm font-medium transition-colors relative"
            :class="activeTab === 'audience' ? 'text-pink-400' : 'text-gray-400 hover:text-white'"
          >
            在线观众({{ onlineCount }})
            <div v-if="activeTab === 'audience'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500"></div>
          </button>
        </div>

        <!-- 弹幕列表 -->
        <div v-if="activeTab === 'chat'" class="flex-1 overflow-y-auto p-3 space-y-2" ref="chatContainer">
          <div 
            v-for="(msg, index) in chatMessages" 
            :key="index"
            class="text-sm"
            :class="{ 
              'chat-gift-animation': msg.isGift,
              'text-center': msg.isSystem
            }"
          >
            <!-- 系统消息（进入/退出直播间） -->
            <template v-if="msg.isSystem">
              <span class="text-gray-500 text-xs">{{ msg.content }}</span>
            </template>
            <!-- 礼物消息特殊样式 -->
            <template v-else-if="msg.isGift">
              <div class="flex items-center">
                <span :class="['chat-gift-badge', msg.giftType === 'heart' ? 'pink' : msg.giftType === 'ticket' ? 'blue' : 'rose']">
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  粉丝团灯牌
                </span>
                <span class="text-gray-300">{{ msg.username }}:</span>
                <span class="text-white ml-1">{{ msg.content }}</span>
              </div>
            </template>
            <!-- 主播消息 -->
            <template v-else-if="msg.isAnchor">
              <span class="text-yellow-400 font-bold">[主播] </span>
              <span v-if="msg.level" class="text-pink-400">[{{ msg.level }}] </span>
              <span class="text-yellow-200">{{ msg.username }}:</span>
              <span class="text-yellow-100">{{ msg.content }}</span>
            </template>
            <!-- 普通用户消息 -->
            <template v-else>
              <span v-if="msg.level" class="text-pink-400">[{{ msg.level }}] </span>
              <span class="text-gray-300">{{ msg.username }}:</span>
              <span class="text-white">{{ msg.content }}</span>
            </template>
          </div>
        </div>

        <!-- 在线观众列表 -->
        <div v-else class="flex-1 overflow-y-auto p-3">
          <div class="grid grid-cols-4 gap-2">
            <div 
              v-for="user in audienceList" 
              :key="user.id"
              class="flex flex-col items-center p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors"
              @click="goToUserProfile(user.id)"
            >
              <img :src="user.avatar" class="w-10 h-10 rounded-full object-cover hover:ring-2 hover:ring-pink-500 transition-all">
              <span class="text-xs text-gray-400 mt-1 truncate w-full text-center">{{ user.name }}</span>
            </div>
          </div>
        </div>

        <!-- 弹幕输入 -->
        <div class="p-3 border-t border-white/10 bg-[#1a1a2e]">
          <!-- 下播时显示提示 -->
          <div v-if="!streamInfo.isLive" class="flex items-center justify-center py-2">
            <span class="text-gray-500 text-sm">主播已下播，无法发送弹幕</span>
          </div>
          <!-- 直播中显示输入框 -->
          <div v-else class="flex items-center space-x-2">
            <div class="flex-1 relative">
              <input 
                v-model="chatInput"
                @keyup.enter="sendChat"
                type="text" 
                placeholder="发个弹幕呗~"
                class="w-full bg-[#2a2a4a] border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500"
              />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">{{ chatInput.length }}/40</span>
            </div>
            <button 
              @click="sendChat"
              class="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm rounded-full transition-colors"
            >
              发送
            </button>
          </div>
          <div v-if="streamInfo.isLive" class="flex items-center justify-between mt-2">
            <div class="flex items-center space-x-2">
              <button class="text-gray-400 hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </button>
              <button class="text-gray-400 hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </button>
            </div>
            <label class="flex items-center space-x-1 text-xs text-gray-400 cursor-pointer">
              <input type="checkbox" v-model="isDanmakuMode" class="rounded border-gray-600 text-pink-500 focus:ring-pink-500">
              <span>弹幕模式</span>
            </label>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavHeader from '@/components/NavHeader.vue'
import { useUserStore } from '@/stores/userStore'
import { useWebSocketChat, type ChatMessage } from '@/composables/useWebSocketChat'
import { liveAPI } from '@/api/live'
import Hls from 'hls.js'
import flvjs from 'flv.js'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const streamId = route.params.id as string

// 登录相关
const showLoginModal = ref(false)

// 返回上一页
const goBack = () => {
  router.back()
}

// 跳转到用户主页
const goToUserProfile = (userId: number | string) => {
  router.push(`/user/${userId}`)
}

// 切换到在线观众标签并获取观众列表
const switchToAudienceTab = async () => {
  activeTab.value = 'audience'
  await fetchOnlineUsers()
}

// 获取在线观众列表
const fetchOnlineUsers = async () => {
  try {
    const response = await fetch(`http://localhost:8088/api/chat/online-users?room_id=${streamId}`)
    const result = await response.json()
    if (result.code === 0 && result.data) {
      audienceList.value = result.data.map((user: any) => ({
        id: user.user_id,
        name: user.username,
        avatar: user.avatar || `https://i.pravatar.cc/150?u=${user.user_id}`
      }))
    }
  } catch (error) {
    console.error('获取在线观众列表失败:', error)
  }
}

// 视频播放器
const videoPlayer = ref<HTMLVideoElement | null>(null)
let hls: Hls | null = null
let flvPlayer: flvjs.Player | null = null
let rtcPeerConnection: RTCPeerConnection | null = null
const showPlayButton = ref(false)

// 手动播放视频
const manualPlay = () => {
  if (videoPlayer.value) {
    videoPlayer.value.play().then(() => {
      showPlayButton.value = false
    }).catch(err => {
      console.error('手动播放失败:', err)
    })
  }
}

// 直播信息
const streamInfo = ref({
  id: streamId,
  title: '超牛的直播间',
  cover: 'https://images.unsplash.com/photo-1605098195882-b6819b8555b6?auto=format&fit=crop&w=1200&q=80',
  playUrl: '',
  flvUrl: '',
  webrtcUrl: '',
  viewers: '2.1万',
  likes: '8.5万',
  isMuted: true, // 默认静音
  isLive: false, // 是否正在直播
  anchorId: null as number | null, // 主播ID
  streamer: {
    name: '超牛的直播间，快来看',
    avatar: 'https://i.pravatar.cc/150?u=streamer1'
  }
})

// 直播时长
const streamDuration = ref('00:00:00')
let durationTimer: number | null = null
let durationSeconds = 0

// 右侧标签页
const activeTab = ref('chat')

// WebSocket 弹幕相关
const roomId = computed(() => route.params.id as string || '1')
const {
  connectionStatus,
  isConnected,
  messages: wsMessages,
  onlineCount,
  connect: connectWS,
  disconnect: disconnectWS,
  sendDanmaku,
  sendLike,
  sendGift: sendGiftMsg
} = useWebSocketChat(roomId.value)

// 弹幕相关
const chatInput = ref('')
const chatContainer = ref<HTMLElement | null>(null)
const isDanmakuMode = ref(true)

// 转换 WebSocket 消息为本地格式
const chatMessages = computed(() => {
  return wsMessages.value
    .filter(msg => {
      // 过滤空内容
      if (!msg.content || msg.content.trim() === '') return false
      return true
    })
    .map(msg => ({
      username: msg.username,
      content: msg.content,
      level: 1,
      type: msg.type,
      isSelf: msg.user_id === userStore.userId?.toString(),
      isAnchor: msg.user_id === streamInfo.value.anchorId?.toString(),
      isSystem: msg.type === 'enter' || msg.type === 'leave' || msg.type === 'system'
    }))
})

// 浮动弹幕
const floatingDanmaku = ref<Array<{
  id: number
  text: string
  top: number
  position: number
  color: string
}>>([])

// 在线观众
const audienceList = ref([
  { id: 1, name: '野原上仙', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: 2, name: '鸡爪狗...', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: 3, name: 'islandrr', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: 4, name: '用户1234', avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: 5, name: '直播观众', avatar: 'https://i.pravatar.cc/150?u=5' },
  { id: 6, name: '弹幕达人', avatar: 'https://i.pravatar.cc/150?u=6' },
  { id: 7, name: '小粉丝', avatar: 'https://i.pravatar.cc/150?u=7' },
  { id: 8, name: '路人甲', avatar: 'https://i.pravatar.cc/150?u=8' },
])

// 礼物列表 - 三个主要礼物
const gifts = ref([
  {
    id: 'heart',
    name: '小心心',
    icon: '💝',
    price: 520,
    bgGradient: 'bg-gradient-to-br from-pink-400 via-rose-400 to-red-500',
    glowColor: 'bg-pink-500',
    tag: '',
    tagClass: '',
    type: 'heart',
    svg: '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#heartGrad)" stroke="white" stroke-width="1.5"/><defs><linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#f472b6"/><stop offset="100%" style="stop-color:#e11d48"/></linearGradient></defs>'
  },
  {
    id: 'ticket',
    name: '人气票',
    icon: '',
    price: 1,
    bgGradient: 'bg-gradient-to-br from-rose-300 via-pink-300 to-rose-200',
    glowColor: 'bg-rose-300',
    tag: '',
    tagClass: '',
    type: 'ticket',
    svg: '<defs><linearGradient id="ticketBg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#fda4af"/><stop offset="100%" style="stop-color:#f9a8d4"/></linearGradient><linearGradient id="ticketText" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#e11d48"/><stop offset="100%" style="stop-color:#f472b6"/></linearGradient></defs><path d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z" fill="url(#ticketBg)" stroke="#f472b6" stroke-width="1.5"/><text x="12" y="11" text-anchor="middle" font-size="5" font-weight="bold" fill="url(#ticketText)">人气票</text><text x="12" y="16" text-anchor="middle" font-size="3" fill="#be123c">1电池</text>'
  },
  {
    id: 'flower',
    name: '小花花',
    icon: '🌸',
    price: 66,
    bgGradient: 'bg-gradient-to-br from-pink-300 via-rose-300 to-pink-400',
    glowColor: 'bg-rose-300',
    tag: '',
    tagClass: '',
    type: 'flower',
    svg: '<path d="M12 2C13.1 2 14 2.9 14 4C14 4.5 13.8 5 13.5 5.4C14.6 5.1 15.8 5.5 16.5 6.5C17.2 7.5 17.1 8.8 16.4 9.7C17.3 9.5 18.3 9.9 18.8 10.8C19.3 11.7 19.1 12.8 18.4 13.5C19.1 13.7 19.7 14.3 19.9 15.1C20.1 15.9 19.8 16.7 19.2 17.2C19.8 17.7 20 18.5 19.7 19.3C19.4 20.1 18.6 20.6 17.8 20.6C17.8 21.4 17.3 22.1 16.5 22.4C15.7 22.7 14.8 22.5 14.2 21.9C13.7 22.5 12.9 22.8 12.1 22.6C11.3 22.4 10.7 21.8 10.5 21C9.8 21.5 8.9 21.6 8.1 21.2C7.3 20.8 6.8 20 6.9 19.2C6.1 19.2 5.3 18.7 5 17.9C4.7 17.1 4.9 16.2 5.5 15.6C4.9 15.1 4.7 14.3 5 13.5C5.3 12.7 6 12.2 6.8 12.1C6.2 11.4 6.1 10.4 6.6 9.6C7.1 8.8 8 8.4 8.9 8.5C8.3 7.6 8.3 6.4 9 5.5C9.7 4.6 10.9 4.3 12 4.7C11.7 3.8 12 2.8 12.8 2.2L12 2Z" fill="url(#flowerGrad)" stroke="white" stroke-width="1"/><circle cx="12" cy="13" r="3" fill="#fef3c7"/><defs><linearGradient id="flowerGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#f9a8d4"/><stop offset="50%" style="stop-color:#fda4af"/><stop offset="100%" style="stop-color:#f472b6"/></linearGradient></defs>'
  },
])

// 礼物动画状态
const activeHearts = ref<Array<{ id: number }>>([])
const activeTickets = ref<Array<{ id: number }>>([])
const activeFlowers = ref<Array<{ id: number }>>([])

// 用户金瓜子
const userCoins = ref(12580)

// 全屏状态
const isFullscreen = ref(false)

// 切换全屏
const toggleFullscreen = async () => {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen()
      isFullscreen.value = true
    } else {
      await document.exitFullscreen()
      isFullscreen.value = false
    }
  } catch (err) {
    console.error('全屏切换失败:', err)
  }
}

// 切换静音
const toggleMute = () => {
  streamInfo.value.isMuted = !streamInfo.value.isMuted
  if (videoPlayer.value) {
    videoPlayer.value.muted = streamInfo.value.isMuted
  }
  console.log('静音状态:', streamInfo.value.isMuted)
}

// WebRTC 播放 - 超低延迟 (<500ms)
const initWebRTCPlayer = async (webrtcUrl: string) => {
  if (!videoPlayer.value || !webrtcUrl) return

  console.log('Initializing WebRTC player:', webrtcUrl)

  // 销毁旧的播放器
  if (rtcPeerConnection) {
    try {
      rtcPeerConnection.close()
    } catch (e) {
      console.warn('Error closing old RTC connection:', e)
    }
    rtcPeerConnection = null
  }
  if (flvPlayer) {
    try {
      if (!flvPlayer.destroyed) {
        flvPlayer.destroy()
      }
    } catch (e) {
      console.warn('Error destroying old FLV player:', e)
    }
    flvPlayer = null
  }
  if (hls) {
    try {
      hls.destroy()
    } catch (e) {
      console.warn('Error destroying old HLS player:', e)
    }
    hls = null
  }
  // 清理视频元素
  if (videoPlayer.value) {
    videoPlayer.value.pause()
    videoPlayer.value.srcObject = null
    videoPlayer.value.src = ''
  }

  const video = videoPlayer.value

  try {
    // 解析 WebRTC URL
    const urlMatch = webrtcUrl.match(/webrtc:\/\/([^\/]+)\/([^\/]+)\/(.+)/)
    if (!urlMatch) {
      throw new Error('Invalid WebRTC URL format')
    }
    const [, host, app, stream] = urlMatch

    // 创建 RTCPeerConnection
    rtcPeerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    })

    // 监听远程轨道
    rtcPeerConnection.ontrack = (event) => {
      console.log('Received remote track:', event.track.kind)
      if (video.srcObject !== event.streams[0]) {
        video.srcObject = event.streams[0]
        video.play().catch(err => console.log('播放失败:', err))
      }
    }

    // 监听连接状态
    rtcPeerConnection.onconnectionstatechange = () => {
      console.log('WebRTC connection state:', rtcPeerConnection?.connectionState)
    }

    // 创建 offer
    const offer = await rtcPeerConnection.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    })
    await rtcPeerConnection.setLocalDescription(offer)

    // 等待 ICE gathering
    await new Promise<void>((resolve) => {
      if (rtcPeerConnection?.iceGatheringState === 'complete') {
        resolve()
      } else {
        const timeout = setTimeout(() => resolve(), 2000)
        rtcPeerConnection!.addEventListener('icegatheringstatechange', () => {
          if (rtcPeerConnection?.iceGatheringState === 'complete') {
            clearTimeout(timeout)
            resolve()
          }
        })
      }
    })

    // 请求 SRS WebRTC 播放 - 使用 1985 端口
    const srsApiUrl = `http://${host.replace(':8000', ':1985')}/rtc/v1/play/`
    console.log('SRS API URL:', srsApiUrl)
    const tid = Math.random().toString(36).substring(2, 9)

    const response = await fetch(srsApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api: srsApiUrl,
        tid: tid,
        streamurl: webrtcUrl,
        sdp: rtcPeerConnection.localDescription?.sdp
      })
    })

    if (!response.ok) {
      throw new Error(`SRS API error: ${response.status}`)
    }

    const result = await response.json()
    console.log('SRS play response:', result)

    if (result.code !== 0) {
      throw new Error(`SRS error: ${result.msg || JSON.stringify(result)}`)
    }

    // 设置远程描述
    await rtcPeerConnection.setRemoteDescription(new RTCSessionDescription({
      type: 'answer',
      sdp: result.sdp
    }))

    console.log('WebRTC 播放已连接，延迟 < 500ms')
  } catch (error) {
    console.error('WebRTC 播放失败:', error)
    console.error('WebRTC 错误详情:', {
      webrtcUrl,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    })
    // 清理 WebRTC 连接
    if (rtcPeerConnection) {
      try {
        rtcPeerConnection.close()
      } catch (e) {
        console.warn('Error closing RTC connection:', e)
      }
      rtcPeerConnection = null
    }
    // 回退到 FLV（使用 flvUrl 而不是 playUrl）
    console.log('回退到 FLV 播放')
    const flvUrl = streamInfo.value.flvUrl || streamInfo.value.playUrl?.replace('.m3u8', '.flv')
    if (flvUrl) {
      initFLVPlayer(flvUrl)
    } else {
      console.error('No FLV URL available, falling back to HLS')
      initHLSPlayer(streamInfo.value.playUrl)
    }
  }
}

// FLV 播放器（次选）
const initFLVPlayer = (playUrl: string) => {
  console.log('initFLVPlayer called with playUrl:', playUrl)
  console.log('videoPlayer ref:', videoPlayer.value)

  if (!videoPlayer.value) {
    console.error('Video player element not found!')
    return
  }
  if (!playUrl) {
    console.error('Play URL is empty!')
    return
  }

  // 确保 URL 是 FLV 格式
  let flvUrl = playUrl
  if (playUrl.endsWith('.m3u8')) {
    flvUrl = playUrl.replace('.m3u8', '.flv')
    console.log('Converted HLS URL to FLV:', flvUrl)
  }

  // 销毁旧的播放器实例
  if (hls) {
    hls.destroy()
    hls = null
  }
  if (flvPlayer) {
    try {
      flvPlayer.destroy()
    } catch (e) {
      console.warn('Error destroying old flvPlayer:', e)
    }
    flvPlayer = null
  }

  const video = videoPlayer.value
  console.log('Loading FLV source:', flvUrl)

  // 检查 FLV 是否支持
  if (!flvjs.isSupported()) {
    console.error('FLV.js is not supported in this browser')
    initHLSPlayer(playUrl)
    return
  }

  console.log('FLV.js is supported, creating player...')

  try {
    flvPlayer = flvjs.createPlayer({
      type: 'flv',
      url: flvUrl,
      isLive: true,
      hasAudio: true,
      hasVideo: true,
      // === 关键：最小化缓冲以降低延迟 ===
      enableStashBuffer: false,       // 禁用缓冲，降低延迟
      stashInitialSize: 16,           // 最小化初始缓冲（16KB）
      lazyLoad: false,                // 禁用懒加载
      lazyLoadMaxDuration: 0.1,       // 最小化懒加载时间
      // === 加载策略 ===
      seekType: 'range',              // 使用 range 请求
      rangeLoadZeroStart: true,       // 从 0 开始加载
      fixAudioTimestampGap: false,    // 禁用音频时间戳修复
      // === 自动清理策略 ===
      autoCleanupSourceBuffer: true,  // 自动清理 buffer
      autoCleanupMaxBackwardDuration: 1,  // 只保留 1 秒历史数据
      autoCleanupMinBackwardDuration: 0.3 // 最小保留 0.3 秒
    })

    flvPlayer.attachMediaElement(video)
    flvPlayer.load()

    // 监听 FLV 播放器事件
    flvPlayer.on(flvjs.Events.LOADING_COMPLETE, () => {
      console.log('FLV loading complete')
    })

    flvPlayer.on(flvjs.Events.RECOVERED_EARLY_EOF, () => {
      console.log('FLV recovered early EOF')
    })

    flvPlayer.on(flvjs.Events.MEDIA_INFO, (mediaInfo) => {
      console.log('FLV media info:', mediaInfo)
      if (mediaInfo.width && mediaInfo.height) {
        console.log(`Video dimensions: ${mediaInfo.width}x${mediaInfo.height}`)
      }
    })

    flvPlayer.on(flvjs.Events.METADATA_ARRIVED, (metadata) => {
      console.log('FLV metadata arrived:', metadata)
    })

    // 监听视频数据到达
    flvPlayer.on(flvjs.Events.VIDEO_TAG_ARRIVED, (data) => {
      console.log('FLV video tag arrived, size:', data?.byteLength || 0)
    })

    flvPlayer.on(flvjs.Events.SCRIPTDATA_ARRIVED, (data) => {
      console.log('FLV script data arrived:', data)
    })

    // 监听 MediaSource 关闭事件（直播流的正常行为）
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null
    flvPlayer.on(flvjs.Events.SOURCE_CLOSE, () => {
      console.log('FLV MediaSource closed')
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout)
      }
      // 延迟重连，避免频繁重连
      reconnectTimeout = setTimeout(() => {
        if (flvPlayer && !flvPlayer.destroyed) {
          console.log('Reloading FLV player...')
          flvPlayer.load()
        }
      }, 3000) // 增加重连间隔到3秒
    })

    flvPlayer.on(flvjs.Events.ERROR, (errType: string, errDetail: string) => {
      console.error('FLV player error:', errType, errDetail)
      if (errType === 'NetworkError') {
        console.log('网络错误，回退到 HLS 播放')
        // 清理 FLV 播放器
        if (flvPlayer) {
          try {
            flvPlayer.destroy()
          } catch (e) {
            console.warn('Error destroying flvPlayer on error:', e)
          }
          flvPlayer = null
        }
        initHLSPlayer(playUrl)
      } else {
        console.log('非网络错误，尝试恢复播放')
        setTimeout(() => {
          if (flvPlayer && !flvPlayer.destroyed) {
            flvPlayer.load()
          }
        }, 2000)
      }
    })

    // 等待媒体加载完成后再播放
    flvPlayer.on(flvjs.Events.MEDIA_INFO, () => {
      console.log('FLV media info received, attempting to play...')
      video.play().catch(err => {
        console.log('自动播放被阻止:', err)
        showPlayButton.value = true
      })
    })

    console.log('FLV player created and loaded successfully')
  } catch (error) {
    console.error('Error creating FLV player:', error)
    initHLSPlayer(playUrl)
  }
}

// 初始化视频播放器 - 优先使用 HLS（有画面最重要）
const initVideoPlayer = (playUrl: string) => {
  console.log('initVideoPlayer called with:', playUrl)
  console.log('videoPlayer ref:', videoPlayer.value)
  console.log('streamInfo:', streamInfo.value)

  if (!videoPlayer.value) {
    console.error('videoPlayer ref is null!')
    return
  }

  // 优先使用 HLS（有画面最重要，B 站风格）
  if (playUrl) {
    console.log('优先使用 HLS 播放:', playUrl)
    initHLSPlayer(playUrl)
    return
  }

  // 其次尝试 FLV（延迟较低）
  if (streamInfo.value.flvUrl) {
    console.log('回退到 FLV 播放:', streamInfo.value.flvUrl)
    initFLVPlayer(streamInfo.value.flvUrl)
    return
  }

  // 最后尝试 WebRTC（延迟最低，但可能有兼容性问题）
  if (streamInfo.value.webrtcUrl) {
    console.log('回退到 WebRTC 播放')
    initWebRTCPlayer(streamInfo.value.webrtcUrl)
    return
  }

  console.error('No play URL available!')
}

// HLS 播放器（备用）
const initHLSPlayer = (playUrl: string) => {
  if (!videoPlayer.value || !playUrl) return

  const video = videoPlayer.value

  if (Hls.isSupported()) {
    // 先销毁旧的 HLS 实例
    if (hls) {
      hls.destroy()
      hls = null
    }

    // 关键配置：参考 B 站策略，从直播边缘开始播放
    hls = new Hls({
      debug: false,
      enableWorker: true,
      lowLatencyMode: true,          // 启用低延迟模式
      // === 缓冲区优化（激进模式）===
      maxBufferLength: 1.5,           // 最大缓冲1.5秒（减少延迟）
      maxMaxBufferLength: 3,          // 绝对最大缓冲3秒
      backBufferLength: 0.5,          // 只保留0.5秒历史（减少内存占用）
      // === 直播同步优化（激进追赶）===
      liveSyncDurationCount: 1,       // 直播同步持续时间
      liveMaxLatencyDurationCount: 2, // 最大延迟2秒就追赶
      liveDurationInfinity: true,     // 直播流无限时长
      // === 加载优化 ===
      initialLiveManifestSize: 1,     // 只加载1个片段就开始播放
      manifestLoadingTimeOut: 5000,
      manifestLoadingMaxRetry: 2,
      levelLoadingTimeOut: 5000,
      levelLoadingMaxRetry: 2,
      fragLoadingTimeOut: 5000,
      fragLoadingMaxRetry: 2,
      // === 追赶策略（激进）===
      liveSyncPosition: -1,           // 从直播边缘开始
      startFragPrefetch: false,
      testBandwidth: false,
      maxFragLookUpTolerance: 0.0,
      // === 高缓冲检测（快速追赶）===
      highBufferWatchdogPeriod: 1,    // 1秒检测一次
      nudgeOffset: 0.3,               // 推进0.3秒
      nudgeMaxRetry: 10,              // 最多重试10次
      // === ABR 策略 ===
      abrEwmaFastLive: 2,
      abrEwmaSlowLive: 5,
      forceStartPosition: true,
      // === 额外：直播追赶配置 ===
      liveBackBufferLength: 0.5       // 直播回放缓冲0.5秒
    })

    // 添加时间戳防止缓存
    const urlWithTimestamp = playUrl + (playUrl.includes('?') ? '&' : '?') + '_t=' + Date.now()
    console.log('Loading HLS source:', urlWithTimestamp)
    hls.loadSource(urlWithTimestamp)
    hls.attachMedia(video)

    hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
      console.log('HLS manifest parsed:', data)
      
      // 检测 GOP 大小（通过片段时长）
      const levels = data.levels
      if (levels && levels.length > 0 && levels[0].details) {
        const fragments = levels[0].details.fragments
        if (fragments && fragments.length > 0) {
          const firstFrag = fragments[0]
          console.log('First fragment duration:', firstFrag.duration)
          
          // 如果片段时长 > 5 秒，说明 GOP 很大，启用追赶模式
          if (firstFrag.duration > 5) {
            console.log('⚠️ GOP too large (' + firstFrag.duration + 's), enabling catch-up mode')
            // 强制跳转到最新位置
            const liveEdge = levels[0].details.liveEdge
            if (liveEdge && liveEdge > 0) {
              video.currentTime = liveEdge - 2 // 从直播边缘前 2 秒开始
              console.log('Jumped to live edge:', video.currentTime)
            }
          }
        }
      }
      
      video.play().catch(err => {
        console.log('自动播放被阻止:', err)
        showPlayButton.value = true
      })
    })

    hls.on(Hls.Events.ERROR, (event, data) => {
      console.error('HLS error:', data)
      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            console.log('网络错误，尝试恢复...')
            hls?.startLoad()
            break
          case Hls.ErrorTypes.MEDIA_ERROR:
            console.log('媒体错误，尝试恢复...')
            hls?.recoverMediaError()
            break
          default:
            console.log('无法恢复的错误，重新初始化播放器')
            setTimeout(() => {
              if (hls) {
                hls.destroy()
                hls = null
              }
              initHLSPlayer(playUrl)
            }, 2000)
            break
        }
      }
    })
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = playUrl
    video.addEventListener('loadedmetadata', () => {
      // Safari 特殊处理：尝试跳转到最后
      if (video.duration && !isNaN(video.duration)) {
        video.currentTime = video.duration
      }
      video.play().catch(err => {
        console.log('自动播放被阻止:', err)
        showPlayButton.value = true
      })
    })
  } else {
    console.error('浏览器不支持视频播放')
  }
}

// 获取直播信息
const fetchLiveInfo = async () => {
  try {
    console.log('fetchLiveInfo called, streamId:', streamId)
    const roomId = parseInt(streamId)
    if (isNaN(roomId)) {
      console.error('Invalid room ID:', streamId)
      return
    }
    console.log('Fetching room info for roomId:', roomId)

    const response = await liveAPI.getRoomInfo(roomId)
    console.log('Room info response:', response.data)
    
    if (response.data.code === 0 && response.data.data && response.data.data.room) {
      const room = response.data.data.room
      console.log('Room data:', room)
      
      // 更新直播间信息
      streamInfo.value.title = room.title || '无标题'
      streamInfo.value.cover = room.cover_url || ''
      streamInfo.value.viewers = room.online_count?.toString() || '0'
      streamInfo.value.anchorId = room.user_id || room.anchor_id || null
      streamInfo.value.playUrl = room.play_url || ''
      // 使用后端返回的 flv_url，如果没有则通过替换生成
      streamInfo.value.flvUrl = room.flv_url || (room.play_url ? room.play_url.replace('.m3u8', '.flv') : '')
      // 使用后端返回的 webrtc_url，如果没有则从 play_url 提取生成
      streamInfo.value.webrtcUrl = room.webrtc_url || ''
      if (!streamInfo.value.webrtcUrl && room.play_url) {
        const streamKey = room.play_url.split('/').pop()?.replace('.m3u8', '')
        streamInfo.value.webrtcUrl = streamKey ? `webrtc://192.168.1.4:8000/live/${streamKey}` : ''
      }

      // 设置直播状态
      streamInfo.value.isLive = room.status === 'streaming' && room.play_url
      console.log('Updated streamInfo:', streamInfo.value)

      // 如果正在直播，初始化播放器
      console.log('Room status:', room.status, 'play_url:', room.play_url)
      if (streamInfo.value.isLive) {
        console.log('Initializing video player with:', room.play_url)
        nextTick(() => {
          console.log('nextTick - videoPlayer ref:', videoPlayer.value)
          initVideoPlayer(room.play_url)
        })
      } else {
        console.log('Not initializing player - status:', room.status, 'play_url:', room.play_url)
      }
    } else {
      console.error('获取直播间信息失败:', response.data.msg || response.data.message || '未知错误')
    }
  } catch (error) {
    console.error('获取直播信息失败:', error)
  }
}

// 监听全屏变化
onMounted(async () => {
  // 获取直播信息并初始化播放器
  fetchLiveInfo()

  // 获取在线观众列表
  fetchOnlineUsers()

  // 启动直播时长计时
  durationTimer = window.setInterval(() => {
    durationSeconds++
    const hours = Math.floor(durationSeconds / 3600).toString().padStart(2, '0')
    const minutes = Math.floor((durationSeconds % 3600) / 60).toString().padStart(2, '0')
    const seconds = (durationSeconds % 60).toString().padStart(2, '0')
    streamDuration.value = `${hours}:${minutes}:${seconds}`
  }, 1000)

  // 等待用户信息加载完成后再连接 WebSocket
  await nextTick()
  console.log('[LiveRoom] onMounted - user info:', {
    userId: userStore.userId,
    nickname: userStore.nickname,
    username: userStore.username
  })
  connectWS()

  // 监听全屏变化事件
  document.addEventListener('fullscreenchange', handleFullscreenChange)
})

// 发送弹幕
const sendChat = () => {
  // 检查直播状态
  if (!streamInfo.value.isLive) {
    console.log('[LiveRoom] 主播已下播，无法发送弹幕')
    return
  }
  
  if (!chatInput.value.trim()) return
  
  // 通过 WebSocket 发送
  if (sendDanmaku(chatInput.value)) {
    // 注意：浮动弹幕由 watch(wsMessages) 统一处理，避免重复显示
    chatInput.value = ''
  }
}

// 添加浮动弹幕
const addFloatingDanmaku = (text: string) => {
  const id = Date.now()
  const colors = ['#ffffff', '#ff6b9d', '#4ecdc4', '#ffe66d', '#a8e6cf']
  
  // 获取视频容器宽度
  const containerWidth = window.innerWidth - 320 // 减去右侧聊天框宽度
  
  const danmaku = {
    id,
    text,
    top: Math.random() * 60 + 10, // 10% - 70%
    position: containerWidth, // 从右侧开始
    color: colors[Math.floor(Math.random() * colors.length)]
  }
  floatingDanmaku.value.push(danmaku)
  
  // 动画 - 从右向左移动
  const speed = 2 + Math.random() * 2 // 随机速度 2-4px/帧
  
  const animate = () => {
    const index = floatingDanmaku.value.findIndex(d => d.id === id)
    if (index > -1) {
      // 更新位置 - 向左移动
      floatingDanmaku.value[index].position -= speed
      
      // 如果弹幕完全移出左侧屏幕，移除它
      // 估算弹幕宽度为文字长度 * 20px
      const textWidth = text.length * 20
      if (floatingDanmaku.value[index].position < -textWidth) {
        floatingDanmaku.value.splice(index, 1)
      } else {
        requestAnimationFrame(animate)
      }
    }
  }
  requestAnimationFrame(animate)
}

// 播放礼物动画
const playGiftAnimation = (type: string) => {
  const id = Date.now()

  if (type === 'heart') {
    activeHearts.value.push({ id })
    setTimeout(() => {
      activeHearts.value = activeHearts.value.filter(h => h.id !== id)
    }, 2000)
  } else if (type === 'ticket') {
    activeTickets.value.push({ id })
    setTimeout(() => {
      activeTickets.value = activeTickets.value.filter(t => t.id !== id)
    }, 2000)
  } else if (type === 'flower') {
    activeFlowers.value.push({ id })
    setTimeout(() => {
      activeFlowers.value = activeFlowers.value.filter(f => f.id !== id)
    }, 2000)
  }
}

// 发送礼物
const sendGift = (gift: any) => {
  if (userCoins.value >= gift.price) {
    userCoins.value -= gift.price

    // 播放礼物动画
    playGiftAnimation(gift.type)

    // 添加弹幕通知 - 带礼物动效
    chatMessages.value.push({
      username: '我',
      content: `给主播投喂了 ${gift.name} 💝`,
      level: 5,
      isGift: true,
      giftType: gift.type
    })

    // 滚动到底部
    nextTick(() => {
      if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight
      }
    })
  } else {
    alert('金瓜子不足，请充值')
  }
}

// 监听 WebSocket 消息，显示浮动弹幕
watch(() => wsMessages.value.length, (newLength, oldLength) => {
  // 只在有新消息时处理
  if (newLength > oldLength) {
    const lastMessage = wsMessages.value[newLength - 1]

    // 处理下播消息
    if (lastMessage && lastMessage.type === 'stream_end') {
      console.log('[LiveRoom] 收到下播消息，更新直播状态')
      streamInfo.value.isLive = false
      // 停止视频播放
      if (videoPlayer.value) {
        videoPlayer.value.pause()
      }
      // 销毁播放器
      if (flvPlayer) {
        try {
          if (!flvPlayer.destroyed) {
            flvPlayer.destroy()
          }
        } catch (e) {
          console.warn('Error destroying FLV player:', e)
        }
        flvPlayer = null
      }
      if (hls) {
        try {
          hls.destroy()
        } catch (e) {
          console.warn('Error destroying HLS player:', e)
        }
        hls = null
      }
      return
    }

    // 处理观众进入/离开消息，刷新观众列表
    if (lastMessage && (lastMessage.type === 'enter' || lastMessage.type === 'leave')) {
      console.log('[LiveRoom] 观众进入/离开，刷新观众列表')
      if (activeTab.value === 'audience') {
        fetchOnlineUsers()
      }
    }

    // 只显示普通消息，且内容不为空
    if (lastMessage && lastMessage.type === 'message' && lastMessage.content && isDanmakuMode.value) {
      addFloatingDanmaku(lastMessage.content)
    }
  }

  // 自动滚动到底部
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
})

// 模拟接收弹幕（已弃用，使用 WebSocket 替代）
const simulateDanmaku = () => {
  // WebSocket 连接后不再需要模拟弹幕
  console.log('WebSocket 已连接，使用实时弹幕')
}

// 全屏变化处理函数（需要单独定义以便移除监听）
const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
}

onUnmounted(() => {
  console.log('LiveRoom unmounting, cleaning up resources...')

  if (durationTimer) {
    clearInterval(durationTimer)
    durationTimer = null
  }

  // 断开 WebSocket 连接
  disconnectWS()

  // 销毁 WebRTC 连接
  if (rtcPeerConnection) {
    try {
      rtcPeerConnection.close()
    } catch (e) {
      console.warn('Error closing RTC connection:', e)
    }
    rtcPeerConnection = null
  }

  // 销毁 FLV 播放器
  if (flvPlayer) {
    try {
      if (!flvPlayer.destroyed) {
        flvPlayer.destroy()
      }
    } catch (e) {
      console.warn('Error destroying FLV player:', e)
    }
    flvPlayer = null
  }

  // 销毁 HLS 播放器
  if (hls) {
    try {
      hls.destroy()
    } catch (e) {
      console.warn('Error destroying HLS player:', e)
    }
    hls = null
  }

  // 清理视频元素
  if (videoPlayer.value) {
    videoPlayer.value.pause()
    videoPlayer.value.src = ''
    videoPlayer.value.load()
  }

  // 移除全屏监听
  document.removeEventListener('fullscreenchange', handleFullscreenChange)

  console.log('LiveRoom cleanup completed')
})
</script>

<style scoped>
/* 隐藏滚动条 */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #1a1a2e;
}

::-webkit-scrollbar-thumb {
  background: #3a3a5a;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #4a4a6a;
}

/* 礼物动画 */
.gift-animation {
  animation: giftPop 2s ease-out forwards;
}

@keyframes giftPop {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  20% {
    transform: scale(1.2) rotate(10deg);
    opacity: 1;
  }
  40% {
    transform: scale(1) rotate(0deg);
  }
  80% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: scale(0.8) rotate(0deg);
    opacity: 0;
  }
}

/* 小心心动画 */
.heart-burst {
  position: relative;
  width: 100px;
  height: 100px;
}

.heart-main {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 60px;
  animation: heartBeat 0.6s ease-in-out infinite;
}

@keyframes heartBeat {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.2); }
}

.heart-particle {
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 16px;
  animation: heartParticle 1.5s ease-out forwards;
  animation-delay: calc(var(--i) * 0.1s);
}

@keyframes heartParticle {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  100% {
    transform: translate(
      calc(-50% + cos(var(--i) * 45deg) * 80px),
      calc(-50% + sin(var(--i) * 45deg) * 80px)
    ) scale(1.5);
    opacity: 0;
  }
}

/* 人气票动画 */
.ticket-burst {
  position: relative;
  width: 120px;
  height: 120px;
}

.ticket-main {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: ticketSpin 1s ease-in-out infinite;
}

@keyframes ticketSpin {
  0% { transform: translate(-50%, -50%) rotate(0deg) scale(1); }
  50% { transform: translate(-50%, -50%) rotate(180deg) scale(1.1); }
  100% { transform: translate(-50%, -50%) rotate(360deg) scale(1); }
}

/* 飘落的小人气票 */
.ticket-falling {
  position: absolute;
  top: 50%;
  left: 50%;
  animation: ticketFall 2s ease-out forwards;
  animation-delay: calc(var(--i) * 0.08s);
}

.mini-ticket {
  width: 24px;
  height: 16px;
  background: linear-gradient(135deg, #fda4af 0%, #f9a8d4 100%);
  border: 1px solid #f472b6;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  font-weight: bold;
  color: #e11d48;
}

@keyframes ticketFall {
  0% {
    transform: translate(-50%, -50%) rotate(0deg) scale(0);
    opacity: 0;
  }
  10% {
    transform: translate(-50%, -50%) rotate(calc(var(--i) * 30deg)) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(
      calc(-50% + (var(--i) - 6) * 30px),
      calc(-50% + 100px + var(--i) * 10px)
    ) rotate(calc(var(--i) * 60deg + 360deg)) scale(0.6);
    opacity: 0;
  }
}

/* 闪光粒子 */
.ticket-sparkle {
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 14px;
  color: #fbbf24;
  animation: sparkleAnim 1.2s ease-out forwards;
  animation-delay: calc(var(--i) * 0.15s);
}

@keyframes sparkleAnim {
  0% {
    transform: translate(-50%, -50%) scale(0) rotate(0deg);
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translate(
      calc(-50% + cos(var(--i) * 60deg) * 60px),
      calc(-50% + sin(var(--i) * 60deg) * 60px)
    ) scale(0) rotate(180deg);
    opacity: 0;
  }
}

/* 小花花动画 */
.flower-burst {
  position: relative;
  width: 150px;
  height: 150px;
}

.flower-main {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 70px;
  animation: flowerBloom 1.5s ease-in-out infinite;
}

@keyframes flowerBloom {
  0%, 100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); }
  25% { transform: translate(-50%, -50%) scale(1.1) rotate(-5deg); }
  50% { transform: translate(-50%, -50%) scale(1.2) rotate(5deg); }
  75% { transform: translate(-50%, -50%) scale(1.1) rotate(-3deg); }
}

.flower-particle {
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 24px;
  animation: flowerParticle 2s ease-out forwards;
  animation-delay: calc(var(--i) * 0.08s);
}

@keyframes flowerParticle {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translate(
      calc(-50% + cos(var(--i) * 36deg) * 120px),
      calc(-50% + sin(var(--i) * 36deg) * 120px - 50px)
    ) scale(0.3) rotate(360deg);
    opacity: 0;
  }
}

.flower-petal {
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 18px;
  animation: petalFall 2s ease-out forwards;
  animation-delay: calc(var(--i) * 0.2s);
}

@keyframes petalFall {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(
      calc(-50% + (var(--i) - 3) * 40px),
      calc(-50% + 150px)
    ) scale(0.5) rotate(180deg);
    opacity: 0;
  }
}

/* 人气票卡片样式 */
.ticket-card {
  width: 80px;
  height: 60px;
  background: linear-gradient(135deg, #fda4af 0%, #f9a8d4 100%);
  border-radius: 8px;
  border: 2px solid #f472b6;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: ticketPulse 0.5s ease-in-out infinite;
}

.ticket-text {
  font-size: 16px;
  font-weight: bold;
  background: linear-gradient(90deg, #e11d48, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.ticket-sub {
  font-size: 10px;
  color: #be123c;
  margin-top: 2px;
}

@keyframes ticketPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* 粉丝团灯牌动画 - 类似B站风格 */
.fan-badge-burst {
  position: relative;
  width: 200px;
  height: 120px;
}

.fan-badge-main {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: fanBadgePop 2.5s ease-out forwards;
  z-index: 10;
}

@keyframes fanBadgePop {
  0% {
    transform: translate(-50%, -50%) scale(0) translateX(100px);
    opacity: 0;
  }
  15% {
    transform: translate(-50%, -50%) scale(1.1) translateX(0);
    opacity: 1;
  }
  20% {
    transform: translate(-50%, -50%) scale(1) translateX(0);
  }
  85% {
    transform: translate(-50%, -50%) scale(1) translateX(0);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(0.9) translateX(-20px);
    opacity: 0;
  }
}

/* 粉丝团灯牌卡片 */
.fan-badge-card {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  position: relative;
  min-width: 180px;
  backdrop-filter: blur(10px);
}

.fan-badge-card.pink {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.95) 0%, rgba(219, 39, 119, 0.95) 100%);
  border: 2px solid #f472b6;
}

.fan-badge-card.blue {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.95) 0%, rgba(37, 99, 235, 0.95) 100%);
  border: 2px solid #60a5fa;
}

.fan-badge-card.rose {
  background: linear-gradient(135deg, rgba(244, 63, 94, 0.95) 0%, rgba(225, 29, 72, 0.95) 100%);
  border: 2px solid #fb7185;
}

.fan-badge-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid white;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.fan-badge-content {
  flex: 1;
  margin-left: 10px;
  margin-right: 10px;
}

.fan-badge-title {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  white-space: nowrap;
}

.fan-badge-gift {
  font-size: 13px;
  color: white;
  font-weight: bold;
  white-space: nowrap;
  margin-top: 2px;
}

.fan-badge-level {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  color: white;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
}

/* 飘落的粒子 */
.fan-badge-particle {
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 20px;
  animation: fanBadgeParticle 2s ease-out forwards;
  animation-delay: calc(var(--i) * 0.1s);
  z-index: 5;
}

@keyframes fanBadgeParticle {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }
  20% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(
      calc(-50% + (var(--i) - 4) * 30px),
      calc(-50% + 80px + var(--i) * 10px)
    ) scale(0.5) rotate(calc(var(--i) * 45deg));
    opacity: 0;
  }
}

/* 聊天框礼物动效 */
.chat-gift-animation {
  animation: chatGiftSlide 3s ease-out forwards;
}

@keyframes chatGiftSlide {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  10% {
    transform: translateX(0);
    opacity: 1;
  }
  90% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(0);
    opacity: 0;
  }
}

.chat-gift-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  margin-right: 6px;
  animation: chatBadgePulse 2s ease-in-out infinite;
}

.chat-gift-badge.pink {
  background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
  color: white;
}

.chat-gift-badge.blue {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.chat-gift-badge.rose {
  background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%);
  color: white;
}

@keyframes chatBadgePulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
</style>
