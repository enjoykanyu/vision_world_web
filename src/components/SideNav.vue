<template>
  <div class="side-nav bg-white dark:bg-gray-900 border-r border-bilibili-gray-200 dark:border-gray-700 h-screen fixed left-0 top-0 bottom-0 w-64 z-30 overflow-y-auto transition-all duration-300">
    <!-- 创作者信息 -->
    <div class="p-4 border-b border-bilibili-gray-200 dark:border-gray-700">
      <div class="flex items-center space-x-3">
        <div class="w-12 h-12 rounded-full bg-gradient-to-r from-bilibili-primary to-bilibili-secondary flex items-center justify-center text-white font-bold text-lg">
          创
        </div>
        <div>
          <div class="font-medium text-bilibili-gray-900 dark:text-white">创作者中心</div>
          <div class="text-xs text-bilibili-gray-500 dark:text-gray-400">创作者ID: 12345678</div>
        </div>
      </div>
    </div>

    <!-- 导航菜单 -->
    <nav class="px-4 py-2">
      <!-- 创作中心分组 -->
      <div class="mb-6">
        <div class="text-xs font-semibold text-bilibili-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">创作中心</div>
        <ul class="space-y-1">
          <li>
            <router-link
              to="/creator/home"
              class="group flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-bilibili-primary/5 hover:text-bilibili-primary dark:hover:bg-bilibili-primary/10 dark:hover:text-bilibili-primary"
              active-class="bg-bilibili-primary/10 text-bilibili-primary dark:bg-bilibili-primary/20 dark:text-bilibili-primary"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              <span>创作首页</span>
            </router-link>
          </li>
          <li>
            <router-link
              to="/creator/upload"
              class="group flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-bilibili-primary/5 hover:text-bilibili-primary dark:hover:bg-bilibili-primary/10 dark:hover:text-bilibili-primary"
              active-class="bg-bilibili-primary/10 text-bilibili-primary dark:bg-bilibili-primary/20 dark:text-bilibili-primary"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              <span>发布视频</span>
            </router-link>
          </li>
          <li>
            <router-link
              to="/manage/videos"
              class="group flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-bilibili-primary/5 hover:text-bilibili-primary dark:hover:bg-bilibili-primary/10 dark:hover:text-bilibili-primary"
              active-class="bg-bilibili-primary/10 text-bilibili-primary dark:bg-bilibili-primary/20 dark:text-bilibili-primary"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
              </svg>
              <span>稿件管理</span>
            </router-link>
          </li>
        </ul>
      </div>

      <!-- 数据中心分组 -->
      <div class="mb-6">
        <div class="text-xs font-semibold text-bilibili-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">数据中心</div>
        <ul class="space-y-1">
          <li>
            <router-link
              to="/data/overview"
              class="group flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-bilibili-primary/5 hover:text-bilibili-primary dark:hover:bg-bilibili-primary/10 dark:hover:text-bilibili-primary"
              active-class="bg-bilibili-primary/10 text-bilibili-primary dark:bg-bilibili-primary/20 dark:text-bilibili-primary"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              <span>数据概览</span>
            </router-link>
          </li>
          <li>
            <router-link
              to="/data/content"
              class="group flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-bilibili-primary/5 hover:text-bilibili-primary dark:hover:bg-bilibili-primary/10 dark:hover:text-bilibili-primary"
              active-class="bg-bilibili-primary/10 text-bilibili-primary dark:bg-bilibili-primary/20 dark:text-bilibili-primary"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>内容数据</span>
            </router-link>
          </li>
          <li>
            <router-link
              to="/data/audience"
              class="group flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-bilibili-primary/5 hover:text-bilibili-primary dark:hover:bg-bilibili-primary/10 dark:hover:text-bilibili-primary"
              active-class="bg-bilibili-primary/10 text-bilibili-primary dark:bg-bilibili-primary/20 dark:text-bilibili-primary"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <span>观众分析</span>
            </router-link>
          </li>
        </ul>
      </div>

      <!-- 收益管理分组 -->
      <div class="mb-6">
        <div class="text-xs font-semibold text-bilibili-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">收益管理</div>
        <ul class="space-y-1">
          <li>
            <router-link
              to="/earnings/overview"
              class="group flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-bilibili-primary/5 hover:text-bilibili-primary dark:hover:bg-bilibili-primary/10 dark:hover:text-bilibili-primary"
              active-class="bg-bilibili-primary/10 text-bilibili-primary dark:bg-bilibili-primary/20 dark:text-bilibili-primary"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>收益概览</span>
            </router-link>
          </li>
          <li>
            <router-link
              to="/earnings/detail"
              class="group flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-bilibili-primary/5 hover:text-bilibili-primary dark:hover:bg-bilibili-primary/10 dark:hover:text-bilibili-primary"
              active-class="bg-bilibili-primary/10 text-bilibili-primary dark:bg-bilibili-primary/20 dark:text-bilibili-primary"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
              <span>收益明细</span>
            </router-link>
          </li>
          <li>
            <router-link
              to="/earnings/withdraw"
              class="group flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-bilibili-primary/5 hover:text-bilibili-primary dark:hover:bg-bilibili-primary/10 dark:hover:text-bilibili-primary"
              active-class="bg-bilibili-primary/10 text-bilibili-primary dark:bg-bilibili-primary/20 dark:text-bilibili-primary"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              <span>提现管理</span>
            </router-link>
          </li>
        </ul>
      </div>

      <!-- 账号设置分组 -->
      <div class="mb-6">
        <div class="text-xs font-semibold text-bilibili-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">账号设置</div>
        <ul class="space-y-1">
          <li>
            <router-link
              to="/settings/profile"
              class="group flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-bilibili-primary/5 hover:text-bilibili-primary dark:hover:bg-bilibili-primary/10 dark:hover:text-bilibili-primary"
              active-class="bg-bilibili-primary/10 text-bilibili-primary dark:bg-bilibili-primary/20 dark:text-bilibili-primary"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span>账号资料</span>
            </router-link>
          </li>
          <li>
            <router-link
              to="/settings/security"
              class="group flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-bilibili-primary/5 hover:text-bilibili-primary dark:hover:bg-bilibili-primary/10 dark:hover:text-bilibili-primary"
              active-class="bg-bilibili-primary/10 text-bilibili-primary dark:bg-bilibili-primary/20 dark:text-bilibili-primary"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              <span>安全设置</span>
            </router-link>
          </li>
          <li>
            <router-link
              to="/settings/notifications"
              class="group flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-bilibili-primary/5 hover:text-bilibili-primary dark:hover:bg-bilibili-primary/10 dark:hover:text-bilibili-primary"
              active-class="bg-bilibili-primary/10 text-bilibili-primary dark:bg-bilibili-primary/20 dark:text-bilibili-primary"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
              <span>通知设置</span>
            </router-link>
          </li>
        </ul>
      </div>
    </nav>

    <!-- 版本信息 -->
    <div class="p-4 border-t border-bilibili-gray-200 dark:border-gray-700 text-center text-xs text-bilibili-gray-500 dark:text-gray-400">
      Vision World v1.0.0
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
</script>

<style scoped>
/* 滚动条样式 */
.side-nav::-webkit-scrollbar {
  width: 6px;
}

.side-nav::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.side-nav::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.side-nav::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.dark .side-nav::-webkit-scrollbar-track {
  background: #1f2937;
}

.dark .side-nav::-webkit-scrollbar-thumb {
  background: #4b5563;
}

.dark .side-nav::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>