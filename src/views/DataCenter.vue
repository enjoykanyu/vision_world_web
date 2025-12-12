<template>
  <div class="data-center">
    <div class="bg-white rounded-xl shadow-sm border border-bilibili-gray-200 p-6 mb-6">
      <h2 class="text-2xl font-bold text-bilibili-gray-900 mb-2">数据中心</h2>
      <p class="text-bilibili-gray-600">全面了解您的创作数据表现</p>
    </div>
    
    <!-- 核心数据概览 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="bg-white rounded-xl shadow-sm border border-bilibili-gray-200 p-6">
        <div class="flex justify-between items-start">
          <div>
            <div class="text-bilibili-gray-600 text-sm mb-1">总播放量</div>
            <div class="text-3xl font-bold text-bilibili-gray-900 mb-2">{{ formatNumber(12345678) }}</div>
            <div class="flex items-center text-sm">
              <span class="text-bilibili-success flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                </svg>
                +12.5%
              </span>
              <span class="text-bilibili-gray-500 ml-2">较上周</span>
            </div>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-sm border border-bilibili-gray-200 p-6">
        <div class="flex justify-between items-start">
          <div>
            <div class="text-bilibili-gray-600 text-sm mb-1">粉丝数</div>
            <div class="text-3xl font-bold text-bilibili-gray-900 mb-2">{{ formatNumber(987654) }}</div>
            <div class="flex items-center text-sm">
              <span class="text-bilibili-success flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                </svg>
                +8.3%
              </span>
              <span class="text-bilibili-gray-500 ml-2">较上周</span>
            </div>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-sm border border-bilibili-gray-200 p-6">
        <div class="flex justify-between items-start">
          <div>
            <div class="text-bilibili-gray-600 text-sm mb-1">互动量</div>
            <div class="text-3xl font-bold text-bilibili-gray-900 mb-2">{{ formatNumber(123456) }}</div>
            <div class="flex items-center text-sm">
              <span class="text-bilibili-success flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                </svg>
                +15.8%
              </span>
              <span class="text-bilibili-gray-500 ml-2">较上周</span>
            </div>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 数据趋势图表 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div class="bg-white rounded-xl shadow-sm border border-bilibili-gray-200 p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold text-bilibili-gray-900">播放量趋势</h3>
          <div class="flex space-x-2">
            <button class="px-4 py-1 text-sm rounded-md bg-bilibili-primary/10 text-bilibili-primary font-medium">7天</button>
            <button class="px-4 py-1 text-sm rounded-md text-bilibili-gray-600 hover:bg-bilibili-gray-100">30天</button>
            <button class="px-4 py-1 text-sm rounded-md text-bilibili-gray-600 hover:bg-bilibili-gray-100">90天</button>
          </div>
        </div>
        
        <!-- 图表占位 -->
        <div class="h-80 bg-bilibili-gray-50 rounded-lg flex items-center justify-center">
          <div class="text-bilibili-gray-500 text-center">
            <svg class="w-16 h-16 mx-auto mb-4 text-bilibili-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <p>播放量趋势图表</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-sm border border-bilibili-gray-200 p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold text-bilibili-gray-900">粉丝增长趋势</h3>
          <div class="flex space-x-2">
            <button class="px-4 py-1 text-sm rounded-md bg-bilibili-primary/10 text-bilibili-primary font-medium">7天</button>
            <button class="px-4 py-1 text-sm rounded-md text-bilibili-gray-600 hover:bg-bilibili-gray-100">30天</button>
            <button class="px-4 py-1 text-sm rounded-md text-bilibili-gray-600 hover:bg-bilibili-gray-100">90天</button>
          </div>
        </div>
        
        <!-- 图表占位 -->
        <div class="h-80 bg-bilibili-gray-50 rounded-lg flex items-center justify-center">
          <div class="text-bilibili-gray-500 text-center">
            <svg class="w-16 h-16 mx-auto mb-4 text-bilibili-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <p>粉丝增长趋势图表</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 内容分析和热门视频 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 内容类型分布 -->
      <div class="bg-white rounded-xl shadow-sm border border-bilibili-gray-200 p-6">
        <h3 class="text-xl font-semibold text-bilibili-gray-900 mb-6">内容类型分布</h3>
        
        <!-- 饼图占位 -->
        <div class="h-64 bg-bilibili-gray-50 rounded-lg flex items-center justify-center mb-4">
          <div class="text-bilibili-gray-500 text-center">
            <svg class="w-16 h-16 mx-auto mb-4 text-bilibili-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
            </svg>
            <p>内容类型分布</p>
          </div>
        </div>
        
        <!-- 类型数据 -->
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-2">
              <span class="w-3 h-3 rounded-full bg-bilibili-primary"></span>
              <span class="text-sm text-bilibili-gray-700">视频</span>
            </div>
            <span class="text-sm font-medium text-bilibili-gray-900">75%</span>
          </div>
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-2">
              <span class="w-3 h-3 rounded-full bg-bilibili-secondary"></span>
              <span class="text-sm text-bilibili-gray-700">专栏</span>
            </div>
            <span class="text-sm font-medium text-bilibili-gray-900">15%</span>
          </div>
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-2">
              <span class="w-3 h-3 rounded-full bg-bilibili-success"></span>
              <span class="text-sm text-bilibili-gray-700">动态</span>
            </div>
            <span class="text-sm font-medium text-bilibili-gray-900">8%</span>
          </div>
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-2">
              <span class="w-3 h-3 rounded-full bg-bilibili-warning"></span>
              <span class="text-sm text-bilibili-gray-700">音频</span>
            </div>
            <span class="text-sm font-medium text-bilibili-gray-900">2%</span>
          </div>
        </div>
      </div>
      
      <!-- 热门视频列表 -->
      <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-bilibili-gray-200 p-6">
        <h3 class="text-xl font-semibold text-bilibili-gray-900 mb-6">热门视频</h3>
        
        <div class="space-y-4">
          <div class="flex items-start space-x-4 p-3 rounded-lg hover:bg-bilibili-gray-50 transition-colors">
            <div class="w-32 h-18 bg-bilibili-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              <div class="w-full h-full bg-gradient-to-br from-bilibili-primary/20 to-bilibili-secondary/20 flex items-center justify-center">
                <svg class="w-8 h-8 text-bilibili-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
            <div class="flex-1">
              <div class="font-medium text-bilibili-gray-900 text-sm mb-1 line-clamp-2">2024年最新创作教程，让你的视频播放量翻倍</div>
              <div class="flex items-center text-xs text-bilibili-gray-600 mb-2 space-x-4">
                <span>播放量 {{ formatNumber(56789) }}</span>
                <span>点赞 {{ formatNumber(2345) }}</span>
                <span>评论 {{ formatNumber(456) }}</span>
                <span>发布于 3天前</span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="px-2 py-0.5 text-xs bg-bilibili-primary/10 text-bilibili-primary rounded-full">热门</span>
                <span class="px-2 py-0.5 text-xs bg-bilibili-gray-100 text-bilibili-gray-600 rounded-full">科技</span>
              </div>
            </div>
          </div>
          
          <div class="flex items-start space-x-4 p-3 rounded-lg hover:bg-bilibili-gray-50 transition-colors">
            <div class="w-32 h-18 bg-bilibili-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              <div class="w-full h-full bg-gradient-to-br from-bilibili-primary/20 to-bilibili-secondary/20 flex items-center justify-center">
                <svg class="w-8 h-8 text-bilibili-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
            <div class="flex-1">
              <div class="font-medium text-bilibili-gray-900 text-sm mb-1 line-clamp-2">如何制作吸引人的视频封面，提升点击率</div>
              <div class="flex items-center text-xs text-bilibili-gray-600 mb-2 space-x-4">
                <span>播放量 {{ formatNumber(45678) }}</span>
                <span>点赞 {{ formatNumber(1890) }}</span>
                <span>评论 {{ formatNumber(345) }}</span>
                <span>发布于 5天前</span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="px-2 py-0.5 text-xs bg-bilibili-primary/10 text-bilibili-primary rounded-full">热门</span>
                <span class="px-2 py-0.5 text-xs bg-bilibili-gray-100 text-bilibili-gray-600 rounded-full">创作技巧</span>
              </div>
            </div>
          </div>
          
          <div class="flex items-start space-x-4 p-3 rounded-lg hover:bg-bilibili-gray-50 transition-colors">
            <div class="w-32 h-18 bg-bilibili-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              <div class="w-full h-full bg-gradient-to-br from-bilibili-primary/20 to-bilibili-secondary/20 flex items-center justify-center">
                <svg class="w-8 h-8 text-bilibili-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
            <div class="flex-1">
              <div class="font-medium text-bilibili-gray-900 text-sm mb-1 line-clamp-2">粉丝增长的3个核心策略，快速突破10万粉</div>
              <div class="flex items-center text-xs text-bilibili-gray-600 mb-2 space-x-4">
                <span>播放量 {{ formatNumber(34567) }}</span>
                <span>点赞 {{ formatNumber(1567) }}</span>
                <span>评论 {{ formatNumber(234) }}</span>
                <span>发布于 7天前</span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="px-2 py-0.5 text-xs bg-bilibili-primary/10 text-bilibili-primary rounded-full">热门</span>
                <span class="px-2 py-0.5 text-xs bg-bilibili-gray-100 text-bilibili-gray-600 rounded-full">运营技巧</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 格式化数字
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>