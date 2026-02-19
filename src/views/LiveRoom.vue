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
          <img :src="streamInfo.streamer.avatar" class="w-10 h-10 rounded-full object-cover border-2 border-pink-500">
          <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center">
            <svg class="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
              <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.523 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
        <div>
          <div class="flex items-center space-x-2">
            <h1 class="font-bold text-white">{{ streamInfo.streamer.name }}</h1>
            <span class="px-2 py-0.5 bg-pink-500 text-white text-xs rounded-full">直播中</span>
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
          <span class="text-white font-medium">{{ streamInfo.viewers }}人看过</span>
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
            muted
            controls
            playsinline
            class="w-full h-full object-contain"
          ></video>
          <div v-if="!streamInfo.playUrl" class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
            <img :src="streamInfo.cover" class="w-full h-full object-cover opacity-80">
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-20 h-20 bg-black/50 rounded-full flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors">
                <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- 弹幕层 -->
          <div class="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              v-for="danmaku in floatingDanmaku"
              :key="danmaku.id"
              class="absolute text-white text-lg font-medium whitespace-nowrap"
              :style="{
                top: danmaku.top + '%',
                left: danmaku.left + '%',
                transform: `translateX(-${danmaku.progress}%)`,
                color: danmaku.color
              }"
            >
              {{ danmaku.text }}
            </div>
          </div>

          <!-- 礼物动画层 - 右下角显示 -->
          <div class="absolute bottom-24 right-4 pointer-events-none overflow-hidden">
            <!-- 小心心动效 -->
            <div v-for="heart in activeHearts" :key="heart.id" class="gift-animation">
              <div class="heart-burst">
                <div class="heart-main">💝</div>
                <div v-for="n in 8" :key="n" class="heart-particle" :style="{ '--i': n }">✨</div>
              </div>
            </div>

            <!-- 人气票动效 -->
            <div v-for="ticket in activeTickets" :key="ticket.id" class="gift-animation">
              <div class="ticket-burst">
                <div class="ticket-main">
                  <div class="ticket-card">
                    <div class="ticket-text">人气票</div>
                    <div class="ticket-sub">1电池</div>
                  </div>
                </div>
                <!-- 飘落的小人气票 -->
                <div v-for="n in 12" :key="n" class="ticket-falling" :style="{ '--i': n }">
                  <div class="mini-ticket">票</div>
                </div>
                <!-- 闪光粒子 -->
                <div v-for="n in 6" :key="n" class="ticket-sparkle" :style="{ '--i': n }">✦</div>
              </div>
            </div>

            <!-- 小花花动效 -->
            <div v-for="flower in activeFlowers" :key="flower.id" class="gift-animation">
              <div class="flower-burst">
                <div class="flower-main">🌸</div>
                <div v-for="n in 10" :key="n" class="flower-particle" :style="{ '--i': n }">🌺</div>
                <div v-for="n in 5" :key="n" class="flower-petal" :style="{ '--i': n }">🍃</div>
              </div>
            </div>
          </div>

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
                <button class="text-white hover:text-pink-400 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            @click="activeTab = 'audience'"
            class="flex-1 py-3 text-sm font-medium transition-colors relative"
            :class="activeTab === 'audience' ? 'text-pink-400' : 'text-gray-400 hover:text-white'"
          >
            在线观众({{ onlineUsers }})
            <div v-if="activeTab === 'audience'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500"></div>
          </button>
        </div>

        <!-- 弹幕列表 -->
        <div v-if="activeTab === 'chat'" class="flex-1 overflow-y-auto p-3 space-y-2" ref="chatContainer">
          <div 
            v-for="(msg, index) in chatMessages" 
            :key="index"
            class="text-sm"
          >
            <span v-if="msg.isAnchor" class="text-yellow-400 font-bold">[主播] </span>
            <span v-if="msg.level" class="text-pink-400">[{{ msg.level }}] </span>
            <span class="text-gray-300">{{ msg.username }}:</span>
            <span class="text-white">{{ msg.content }}</span>
          </div>
        </div>

        <!-- 在线观众列表 -->
        <div v-else class="flex-1 overflow-y-auto p-3">
          <div class="grid grid-cols-4 gap-2">
            <div 
              v-for="user in audienceList" 
              :key="user.id"
              class="flex flex-col items-center p-2 hover:bg-white/5 rounded-lg cursor-pointer"
            >
              <img :src="user.avatar" class="w-10 h-10 rounded-full object-cover">
              <span class="text-xs text-gray-400 mt-1 truncate w-full text-center">{{ user.name }}</span>
            </div>
          </div>
        </div>

        <!-- 弹幕输入 -->
        <div class="p-3 border-t border-white/10 bg-[#1a1a2e]">
          <div class="flex items-center space-x-2">
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
          <div class="flex items-center justify-between mt-2">
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
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavHeader from '@/components/NavHeader.vue'
import { useUserStore } from '@/stores/userStore'
import { liveAPI } from '@/api/live'
import Hls from 'hls.js'

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

// 视频播放器
const videoPlayer = ref<HTMLVideoElement | null>(null)
let hls: Hls | null = null

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
const onlineUsers = ref(255)

// 弹幕相关
const chatInput = ref('')
const chatContainer = ref<HTMLElement | null>(null)
const isDanmakuMode = ref(true)

const chatMessages = ref([
  { username: '跨房', content: '?', level: 1 },
  { username: '跨房', content: '?', level: 1 },
  { username: '跨房', content: '😂', level: 1 },
  { username: '跨房', content: '洗头机可以有', level: 2 },
  { username: '跨房', content: '你们高低是俩艺人不知道这事儿你们知不知道', level: 3 },
  { username: '跨房', content: '我看到有人直播过在厕所待一天的', level: 2 },
  { username: '跨房', content: '拉不不', level: 1 },
  { username: '跨房', content: '聊聊b站吧😂', level: 2 },
  { username: '跨房', content: '哈哈哈哈哈哈哈', level: 1 },
  { username: '跨房', content: '段子里演一个吧', level: 2 },
  { username: '跨房', content: '?', level: 1 },
  { username: '跨房', content: '阿b啥时候春晚啊', level: 3 },
  { username: '鸡爪狗小狗', content: '你们真的在厕所直播吗', isAnchor: false },
  { username: '跨房', content: '在说啥你俩', level: 1 },
  { username: 'JHF-1', content: '进入直播间' },
])

// 浮动弹幕
const floatingDanmaku = ref<Array<{
  id: number
  text: string
  top: number
  left: number
  progress: number
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

// 初始化视频播放器
const initVideoPlayer = (playUrl: string) => {
  if (!videoPlayer.value || !playUrl) return

  // 销毁旧的 HLS 实例
  if (hls) {
    hls.destroy()
    hls = null
  }

  const video = videoPlayer.value

  if (Hls.isSupported()) {
    hls = new Hls({
      debug: false,
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 90
    })

    hls.loadSource(playUrl)
    hls.attachMedia(video)

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      video.play().catch(err => {
        console.log('自动播放被阻止:', err)
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
            initVideoPlayer(playUrl)
            break
        }
      }
    })
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    // Safari 原生支持 HLS
    video.src = playUrl
    video.addEventListener('loadedmetadata', () => {
      video.play().catch(err => {
        console.log('自动播放被阻止:', err)
      })
    })
  } else {
    console.error('浏览器不支持 HLS 播放')
  }
}

// 获取直播信息
const fetchLiveInfo = async () => {
  try {
    const roomId = parseInt(streamId)
    if (isNaN(roomId)) {
      console.error('Invalid room ID:', streamId)
      return
    }

    const response = await liveAPI.getRoomInfo(roomId)
    
    if (response.data.code === 0 && response.data.data && response.data.data.room) {
      const room = response.data.data.room
      
      // 更新直播间信息
      streamInfo.value.title = room.title || '无标题'
      streamInfo.value.cover = room.cover_url || ''
      streamInfo.value.viewers = room.online_count?.toString() || '0'
      streamInfo.value.playUrl = room.play_url || ''
      streamInfo.value.flvUrl = room.play_url ? room.play_url.replace('.m3u8', '.flv') : ''
      streamInfo.value.webrtcUrl = room.play_url ? room.play_url.replace('http://', 'webrtc://').replace('.m3u8', '') : ''
      
      // 如果正在直播，初始化播放器
      if (room.status === 'streaming' && room.play_url) {
        nextTick(() => {
          initVideoPlayer(room.play_url)
        })
      }
    } else {
      console.error('获取直播间信息失败:', response.data.msg || response.data.message || '未知错误')
    }
  } catch (error) {
    console.error('获取直播信息失败:', error)
  }
}

// 监听全屏变化
onMounted(() => {
  // 获取直播信息并初始化播放器
  fetchLiveInfo()

  // 启动直播时长计时
  durationTimer = window.setInterval(() => {
    durationSeconds++
    const hours = Math.floor(durationSeconds / 3600).toString().padStart(2, '0')
    const minutes = Math.floor((durationSeconds % 3600) / 60).toString().padStart(2, '0')
    const seconds = (durationSeconds % 60).toString().padStart(2, '0')
    streamDuration.value = `${hours}:${minutes}:${seconds}`
  }, 1000)

  // 启动模拟弹幕
  simulateDanmaku()

  // 监听全屏变化事件
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement
  })
})

// 发送弹幕
const sendChat = () => {
  if (!chatInput.value.trim()) return
  
  chatMessages.value.push({
    username: '我',
    content: chatInput.value,
    level: 5
  })
  
  // 添加到浮动弹幕
  if (isDanmakuMode.value) {
    addFloatingDanmaku(chatInput.value)
  }
  
  chatInput.value = ''
  
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

// 添加浮动弹幕
const addFloatingDanmaku = (text: string) => {
  const id = Date.now()
  const colors = ['#ffffff', '#ff6b9d', '#4ecdc4', '#ffe66d', '#a8e6cf']
  const danmaku = {
    id,
    text,
    top: Math.random() * 60 + 10, // 10% - 70%
    left: 100,
    progress: 0,
    color: colors[Math.floor(Math.random() * colors.length)]
  }
  floatingDanmaku.value.push(danmaku)
  
  // 动画
  let progress = 0
  const animate = () => {
    progress += 0.5
    const index = floatingDanmaku.value.findIndex(d => d.id === id)
    if (index > -1) {
      floatingDanmaku.value[index].progress = progress
      if (progress < 120) {
        requestAnimationFrame(animate)
      } else {
        floatingDanmaku.value.splice(index, 1)
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

    // 添加弹幕通知
    chatMessages.value.push({
      username: '我',
      content: `给主播投喂了 ${gift.name} 💝`,
      level: 5
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

// 模拟接收弹幕
const simulateDanmaku = () => {
  const randomMsgs = [
    '哈哈哈',
    '主播好棒',
    '666666',
    '来了来了',
    '前排围观',
    '这波操作可以',
    '笑死我了',
    '支持主播',
    '新年快乐',
    '拜年啦'
  ]
  const randomUsers = ['小明', '小红', '路人甲', '观众乙', '粉丝丙']
  
  setInterval(() => {
    if (Math.random() > 0.7) {
      const msg = randomMsgs[Math.floor(Math.random() * randomMsgs.length)]
      const user = randomUsers[Math.floor(Math.random() * randomUsers.length)]
      
      chatMessages.value.push({
        username: user,
        content: msg,
        level: Math.floor(Math.random() * 5) + 1
      })
      
      if (isDanmakuMode.value && Math.random() > 0.5) {
        addFloatingDanmaku(msg)
      }
      
      nextTick(() => {
        if (chatContainer.value) {
          chatContainer.value.scrollTop = chatContainer.value.scrollHeight
        }
      })
    }
  }, 2000)
}

onUnmounted(() => {
  if (durationTimer) {
    clearInterval(durationTimer)
  }
  // 销毁 HLS 播放器
  if (hls) {
    hls.destroy()
    hls = null
  }
  // 移除全屏监听
  document.removeEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement
  })
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
</style>
