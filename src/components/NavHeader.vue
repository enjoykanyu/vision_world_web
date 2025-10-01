<template>
  <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
    <div class="max-w-screen-xl mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center space-x-8">
          <router-link to="/" class="flex items-center cursor-pointer">
            <svg class="w-8 h-8 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm-1 14.5v-9l7 4.5-7 4.5z"/>
              <path d="M12 5.5c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5 6.5-2.91 6.5-6.5-2.91-6.5-6.5-6.5zm3.5 6.5l-5 3v-6l5 3z" fill-opacity="0.6"/>
            </svg>
            <span class="ml-2 text-xl font-bold text-gray-900 dark:text-white">VisionWorld</span>
          </router-link>
          
          <!-- 主导航 -->
          <nav class="hidden md:flex items-center space-x-6 text-sm">
            <router-link to="/" class="text-purple-600 font-medium relative group">
              首页
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
            </router-link>

            <router-link to="/live" class="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 relative group">
              直播
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
            </router-link>

            <router-link to="/video-assistant" class="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 relative group">
              视频助手
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
            </router-link>
            <router-link to="/messages" class="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 relative group">
              私信
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
            </router-link>
            <a href="#" class="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 relative group">
              创作者
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#" class="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 relative group">
              会员
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
            </a>
          </nav>
        </div>

        <!-- 搜索和用户 -->
        <div class="flex items-center space-x-4">
          <!-- 深色模式切换 -->
          <button @click="toggleDarkMode" class="text-gray-500 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
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
              class="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 w-80 transition-colors duration-300 group focus-within:ring-2 focus-within:ring-purple-600 focus-within:ring-opacity-50"
              :class="{'rounded-b-none': showSearchTrending}"
            >
              <input 
                type="text" 
                placeholder="搜索视频、创作者..." 
                class="bg-transparent text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 outline-none text-sm flex-1 transition-colors duration-300"
                @focus="showSearchTrending = true"
                @blur="handleSearchBlur"
                v-model="searchQuery"
              >
              <svg 
                class="w-4 h-4 text-gray-400 dark:text-gray-500 cursor-pointer group-focus-within:text-purple-600" 
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
                    <button class="text-xs text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 flex items-center">
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
            <button class="text-gray-500 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
            </button>
            <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">3</span>
          </div>
          
          <!-- 上传按钮 -->
          <button class="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            上传
          </button>
          
          <!-- 登录按钮或用户头像 -->
          <template v-if="userStore.isLoggedIn">
            <!-- 已登录：显示用户头像 -->
            <div class="relative">
              <div 
                class="w-9 h-9 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center cursor-pointer border-2 border-white dark:border-gray-800 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                @click="toggleUserDropdown"
                @mouseenter="showUserDropdown = true"
                @mouseleave="handleUserDropdownLeave"
              >
                <span class="text-white text-sm font-semibold">{{ userStore.username.charAt(0).toUpperCase() }}</span>
              </div>
              
              <!-- B站风格用户信息悬浮弹窗 -->
              <div 
                v-if="showUserDropdown"
                class="user-dropdown absolute top-full right-0 mt-2 w-80 z-50 overflow-hidden"
                @mouseenter="clearDropdownTimer"
                @mouseleave="startDropdownTimer"
              >
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
                  <!-- 用户信息头部 -->
                  <div class="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                    <div class="flex items-center space-x-3">
                      <div class="relative">
                        <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                          <span class="text-lg font-bold">{{ userStore.username.charAt(0).toUpperCase() }}</span>
                        </div>
                        <!-- 官方认证标识 -->
                        <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                          <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                          </svg>
                        </div>
                      </div>
                      <div class="flex-1">
                        <h3 class="font-semibold text-base">{{ userStore.username }}</h3>
                        <p class="text-blue-100 text-sm">{{ userStore.userId || 'ID: 12345678' }}</p>
                      </div>
                    </div>
                    
                    <!-- 数据统计 -->
                    <div class="flex justify-between mt-4 pt-3 border-t border-white/20">
                      <div class="text-center cursor-pointer hover:bg-white/10 rounded px-2 py-1 transition-colors">
                        <div class="text-lg font-bold">{{ userStats.followers }}</div>
                        <div class="text-xs text-blue-100">关注</div>
                      </div>
                      <div class="text-center cursor-pointer hover:bg-white/10 rounded px-2 py-1 transition-colors">
                        <div class="text-lg font-bold">{{ userStats.fans }}</div>
                        <div class="text-xs text-blue-100">粉丝</div>
                      </div>
                      <div class="text-center cursor-pointer hover:bg-white/10 rounded px-2 py-1 transition-colors">
                        <div class="text-lg font-bold">{{ userStats.dynamics }}</div>
                        <div class="text-xs text-blue-100">动态</div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- 功能菜单 -->
                  <div class="py-2">
                    <router-link 
                      :to="`/user/${userStore.userId || '12345678'}`"
                      class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      @click="closeDropdown"
                    >
                      <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                      <span>个人中心</span>
                      <svg class="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </router-link>
                    
                    <a href="#" class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" @click="closeDropdown">
                      <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                      </svg>
                      <span>收藏管理</span>
                      <svg class="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </a>
                    
                    <a href="#" class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" @click="closeDropdown">
                      <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <span>观看历史</span>
                      <svg class="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </a>
                    
                    <a href="#" class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" @click="closeDropdown">
                      <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"/>
                      </svg>
                      <span>推荐服务</span>
                      <svg class="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </a>
                    
                    <div class="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                    
                    <a href="#" class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" @click="closeDropdown">
                      <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      <span>账号设置</span>
                      <svg class="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </a>
                    
                    <button @click="toggleDarkMode" class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full">
                      <svg class="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"/>
                      </svg>
                      <span>主题：{{ isDarkMode ? '深色' : '浅色' }}</span>
                      <svg class="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </button>
                    
                    <div class="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                    
                    <button 
                      @click="handleLogout"
                      class="flex items-center px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full"
                    >
                      <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                      </svg>
                      <span>退出登录</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <!-- 未登录：显示登录按钮 -->
            <button 
              class="bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-purple-600 dark:text-purple-400 px-4 py-2 rounded-full text-sm font-medium border border-purple-200 dark:border-purple-800 shadow-sm hover:shadow-md transition-all duration-300"
              @click="handleUserIconClick"
            >
              登录
            </button>
          </template>
        </div>
      </div>
    </div>

  </header>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import axios from 'axios'

const router = useRouter()
const userStore = useUserStore()

// 搜索相关
const searchQuery = ref('')
const showSearchTrending = ref(false)

// 用户悬浮弹窗相关
const showUserDropdown = ref(false)
let dropdownTimer: NodeJS.Timeout | null = null

// 用户统计数据
const userStats = ref({
  followers: 70,
  fans: 8,
  dynamics: 2
})
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

// 用户悬浮弹窗控制
const toggleUserDropdown = () => {
  if (!userStore.isLoggedIn) {
    // 触发登录弹窗显示，通过emit事件通知父组件
    emit('login')
  } else {
    showUserDropdown.value = !showUserDropdown.value
  }
}

const handleUserDropdownLeave = () => {
  startDropdownTimer()
}

const clearDropdownTimer = () => {
  if (dropdownTimer) {
    clearTimeout(dropdownTimer)
    dropdownTimer = null
  }
}

const startDropdownTimer = () => {
  clearDropdownTimer()
  dropdownTimer = setTimeout(() => {
    showUserDropdown.value = false
  }, 300)
}

const closeDropdown = () => {
  showUserDropdown.value = false
  clearDropdownTimer()
}

// 退出登录
const handleLogout = async () => {
  try {
    // 发送退出登录请求到后端
    await axios.post('/api/auth/logout', {}, {
      withCredentials: true // 确保发送cookie
    })
    
    // 清除前端状态
    userStore.logout()
    
    // 隐藏弹窗
    showUserDropdown.value = false
    
    // 可选：显示退出成功提示
    console.log('退出登录成功')
    
    // 可选：跳转到首页
    router.push('/')
    
  } catch (error) {
    console.error('退出登录失败:', error)
    
    // 即使后端请求失败，也清除前端状态
    userStore.logout()
    showUserDropdown.value = false
    router.push('/')
  }
}

// 处理用户头像点击（保留兼容性）
const handleUserIconClick = () => {
  toggleUserDropdown()
}



// 深色模式
const isDarkMode = ref(false)
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  // 触发深色模式切换事件
  emit('toggleDarkMode')
}

// 定义组件事件
const emit = defineEmits(['login', 'toggleDarkMode'])

// 定义组件属性
const props = defineProps({
  isLoggedIn: {
    type: Boolean,
    default: false
  },
  username: {
    type: String,
    default: ''
  }
})

// 组件卸载时清理定时器
onUnmounted(() => {
  if (dropdownTimer) {
    clearTimeout(dropdownTimer)
  }
})
</script>

<style scoped>
/* 科技感用户悬浮弹窗样式 */
.user-dropdown {
  animation: dropdownSlideIn 0.3s ease-out;
}

@keyframes dropdownSlideIn {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 网格背景图案 */
.grid-pattern {
  background-image: 
    linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
  width: 100%;
  height: 100%;
}

/* 菜单项悬停效果 */
.menu-item {
  position: relative;
  overflow: hidden;
}

.menu-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.1), transparent);
  transition: left 0.5s ease;
}

.menu-item:hover::before {
  left: 100%;
}

.menu-item:hover {
  background: rgba(6, 182, 212, 0.05);
  border-left: 2px solid rgba(6, 182, 212, 0.5);
  transform: translateX(2px);
}

/* 退出登录按钮特殊效果 */
.logout-btn:hover {
  background: rgba(239, 68, 68, 0.05);
  border-left: 2px solid rgba(239, 68, 68, 0.5);
  transform: translateX(2px);
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.2);
}

.logout-btn::before {
  background: linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.1), transparent);
}

/* 霓虹发光效果 */
@keyframes neonGlow {
  0%, 100% {
    box-shadow: 
      0 0 5px rgba(6, 182, 212, 0.5),
      0 0 10px rgba(6, 182, 212, 0.3),
      0 0 15px rgba(6, 182, 212, 0.2);
  }
  50% {
    box-shadow: 
      0 0 10px rgba(6, 182, 212, 0.8),
      0 0 20px rgba(6, 182, 212, 0.5),
      0 0 30px rgba(6, 182, 212, 0.3);
  }
}

.user-dropdown .relative {
  animation: neonGlow 3s ease-in-out infinite;
}

/* 数据统计悬停动画 */
.user-dropdown .group:hover .relative {
  animation: dataGlow 0.5s ease-out;
}

@keyframes dataGlow {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

/* 滚动条样式 */
.user-dropdown ::-webkit-scrollbar {
  width: 4px;
}

.user-dropdown ::-webkit-scrollbar-track {
  background: rgba(6, 182, 212, 0.1);
  border-radius: 2px;
}

.user-dropdown ::-webkit-scrollbar-thumb {
  background: rgba(6, 182, 212, 0.5);
  border-radius: 2px;
}

.user-dropdown ::-webkit-scrollbar-thumb:hover {
  background: rgba(6, 182, 212, 0.7);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .user-dropdown {
    width: 90vw;
    right: -10px;
  }
}

</style>