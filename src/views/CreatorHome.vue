<template>
  <div class="creator-home">
    <!-- 欢迎横幅 -->
    <div class="bg-gradient-to-r from-bilibili-primary/10 to-bilibili-secondary/10 rounded-xl p-6 mb-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 class="text-2xl font-bold text-bilibili-gray-900 mb-2">欢迎回来，创作者！</h2>
          <p class="text-bilibili-gray-600">今天是 {{ currentDate }}, 一起加油创作吧！</p>
        </div>
        <div class="mt-4 md:mt-0">
          <button class="bg-bilibili-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-bilibili-primary/90 transition-colors flex items-center space-x-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <span>立即发布</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- 数据概览卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-xl shadow-sm border border-bilibili-gray-200 p-6 hover:shadow-md transition-shadow">
        <div class="flex justify-between items-start">
          <div>
            <div class="text-bilibili-gray-600 text-sm mb-1">总播放量</div>
            <div class="text-3xl font-bold text-bilibili-gray-900 mb-2">{{ formatNumber(playCount) }}</div>
            <div class="flex items-center text-sm">
              <span class="text-bilibili-success flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                </svg>
                +{{ dayGrowth.playCount }}%
              </span>
              <span class="text-bilibili-gray-500 ml-2">较昨日</span>
            </div>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-sm border border-bilibili-gray-200 p-6 hover:shadow-md transition-shadow">
        <div class="flex justify-between items-start">
          <div>
            <div class="text-bilibili-gray-600 text-sm mb-1">粉丝数</div>
            <div class="text-3xl font-bold text-bilibili-gray-900 mb-2">{{ formatNumber(followerCount) }}</div>
            <div class="flex items-center text-sm">
              <span class="text-bilibili-success flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                </svg>
                +{{ dayGrowth.followerCount }}%
              </span>
              <span class="text-bilibili-gray-500 ml-2">较昨日</span>
            </div>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-sm border border-bilibili-gray-200 p-6 hover:shadow-md transition-shadow">
        <div class="flex justify-between items-start">
          <div>
            <div class="text-bilibili-gray-600 text-sm mb-1">投稿数</div>
            <div class="text-3xl font-bold text-bilibili-gray-900 mb-2">{{ videoCount }}</div>
            <div class="flex items-center text-sm">
              <span class="text-bilibili-success flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                </svg>
                +{{ dayGrowth.videoCount }}
              </span>
              <span class="text-bilibili-gray-500 ml-2">较昨日</span>
            </div>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
            </svg>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-sm border border-bilibili-gray-200 p-6 hover:shadow-md transition-shadow">
        <div class="flex justify-between items-start">
          <div>
            <div class="text-bilibili-gray-600 text-sm mb-1">总收益</div>
            <div class="text-3xl font-bold text-bilibili-gray-900 mb-2">¥{{ totalEarnings.toFixed(2) }}</div>
            <div class="flex items-center text-sm">
              <span class="text-bilibili-success flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                </svg>
                +{{ dayGrowth.earnings }}%
              </span>
              <span class="text-bilibili-gray-500 ml-2">较昨日</span>
            </div>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 数据图表和内容管理 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <!-- 数据趋势图 -->
      <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-bilibili-gray-200 p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold text-bilibili-gray-900">数据趋势</h3>
          <div class="flex space-x-2">
            <button class="px-4 py-1 text-sm rounded-md bg-bilibili-primary/10 text-bilibili-primary font-medium">7天</button>
            <button class="px-4 py-1 text-sm rounded-md text-bilibili-gray-600 hover:bg-bilibili-gray-100">30天</button>
            <button class="px-4 py-1 text-sm rounded-md text-bilibili-gray-600 hover:bg-bilibili-gray-100">90天</button>
          </div>
        </div>
        
        <!-- 图表占位 -->
        <div class="h-64 bg-bilibili-gray-50 rounded-lg flex items-center justify-center">
          <div class="text-bilibili-gray-500 text-center">
            <svg class="w-16 h-16 mx-auto mb-4 text-bilibili-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <p>播放量趋势图</p>
          </div>
        </div>
      </div>
      
      <!-- 内容管理快捷入口 -->
      <div class="bg-white rounded-xl shadow-sm border border-bilibili-gray-200 p-6">
        <h3 class="text-xl font-semibold text-bilibili-gray-900 mb-6">内容管理</h3>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between p-3 bg-bilibili-gray-50 rounded-lg">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div>
                <div class="font-medium text-bilibili-gray-900">已发布</div>
                <div class="text-sm text-bilibili-gray-600">{{ publishedCount }} 个作品</div>
              </div>
            </div>
            <button class="text-bilibili-primary font-medium hover:underline">
              查看
            </button>
          </div>
          
          <div class="flex items-center justify-between p-3 bg-bilibili-gray-50 rounded-lg">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <div class="font-medium text-bilibili-gray-900">待审核</div>
                <div class="text-sm text-bilibili-gray-600">{{ pendingCount }} 个作品</div>
              </div>
            </div>
            <button class="text-bilibili-primary font-medium hover:underline">
              查看
            </button>
          </div>
          
          <div class="flex items-center justify-between p-3 bg-bilibili-gray-50 rounded-lg">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <div class="font-medium text-bilibili-gray-900">审核未通过</div>
                <div class="text-sm text-bilibili-gray-600">{{ rejectedCount }} 个作品</div>
              </div>
            </div>
            <button class="text-bilibili-primary font-medium hover:underline">
              查看
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 最新动态和热门推荐 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 最新动态 -->
      <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-bilibili-gray-200 p-6">
        <h3 class="text-xl font-semibold text-bilibili-gray-900 mb-6">最新动态</h3>
        
        <div class="space-y-4">
          <div class="flex space-x-4 p-3 rounded-lg hover:bg-bilibili-gray-50 transition-colors">
            <div class="w-10 h-10 rounded-full bg-bilibili-primary/20 flex items-center justify-center">
              <svg class="w-5 h-5 text-bilibili-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
            </div>
            <div class="flex-1">
              <div class="font-medium text-bilibili-gray-900 mb-1">视频「{{ videoTitle }}」已发布成功</div>
              <div class="text-sm text-bilibili-gray-600 mb-2">{{ formatRelativeTime(10) }} · 播放量：{{ formatNumber(1234) }}</div>
              <div class="flex space-x-2">
                <button class="text-bilibili-primary text-sm hover:underline">查看详情</button>
                <button class="text-bilibili-gray-500 text-sm hover:underline">推广作品</button>
              </div>
            </div>
          </div>
          
          <div class="flex space-x-4 p-3 rounded-lg hover:bg-bilibili-gray-50 transition-colors">
            <div class="w-10 h-10 rounded-full bg-bilibili-success/20 flex items-center justify-center">
              <svg class="w-5 h-5 text-bilibili-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div class="flex-1">
              <div class="font-medium text-bilibili-gray-900 mb-1">粉丝数突破 {{ formatNumber(10000) }}！</div>
              <div class="text-sm text-bilibili-gray-600 mb-2">{{ formatRelativeTime(60) }} · 新增粉丝：{{ formatNumber(234) }}</div>
              <div class="flex space-x-2">
                <button class="text-bilibili-primary text-sm hover:underline">查看粉丝分析</button>
                <button class="text-bilibili-gray-500 text-sm hover:underline">发布粉丝福利</button>
              </div>
            </div>
          </div>
          
          <div class="flex space-x-4 p-3 rounded-lg hover:bg-bilibili-gray-50 transition-colors">
            <div class="w-10 h-10 rounded-full bg-bilibili-warning/20 flex items-center justify-center">
              <svg class="w-5 h-5 text-bilibili-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <div class="flex-1">
              <div class="font-medium text-bilibili-gray-900 mb-1">您的作品「{{ videoTitle }}」需要优化</div>
              <div class="text-sm text-bilibili-gray-600 mb-2">{{ formatRelativeTime(120) }} · 建议优化封面和标题</div>
              <div class="flex space-x-2">
                <button class="text-bilibili-primary text-sm hover:underline">查看优化建议</button>
                <button class="text-bilibili-gray-500 text-sm hover:underline">忽略</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 热门推荐 -->
      <div class="bg-white rounded-xl shadow-sm border border-bilibili-gray-200 p-6">
        <h3 class="text-xl font-semibold text-bilibili-gray-900 mb-6">热门推荐</h3>
        
        <div class="space-y-4">
          <div class="flex items-start space-x-3">
            <div class="w-24 h-16 bg-bilibili-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              <div class="w-full h-full bg-gradient-to-br from-bilibili-primary/20 to-bilibili-secondary/20 flex items-center justify-center">
                <svg class="w-8 h-8 text-bilibili-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
            <div class="flex-1">
              <div class="font-medium text-bilibili-gray-900 text-sm mb-1 line-clamp-2">如何提升视频播放量？创作者必看技巧</div>
              <div class="text-xs text-bilibili-gray-600">播放量 {{ formatNumber(100000) }} · 点赞 {{ formatNumber(5000) }}</div>
            </div>
          </div>
          
          <div class="flex items-start space-x-3">
            <div class="w-24 h-16 bg-bilibili-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              <div class="w-full h-full bg-gradient-to-br from-bilibili-primary/20 to-bilibili-secondary/20 flex items-center justify-center">
                <svg class="w-8 h-8 text-bilibili-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
            <div class="flex-1">
              <div class="font-medium text-bilibili-gray-900 text-sm mb-1 line-clamp-2">2024年B站创作趋势分析</div>
              <div class="text-xs text-bilibili-gray-600">播放量 {{ formatNumber(80000) }} · 点赞 {{ formatNumber(4000) }}</div>
            </div>
          </div>
          
          <div class="flex items-start space-x-3">
            <div class="w-24 h-16 bg-bilibili-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              <div class="w-full h-full bg-gradient-to-br from-bilibili-primary/20 to-bilibili-secondary/20 flex items-center justify-center">
                <svg class="w-8 h-8 text-bilibili-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
            <div class="flex-1">
              <div class="font-medium text-bilibili-gray-900 text-sm mb-1 line-clamp-2">粉丝增长的3个核心策略</div>
              <div class="text-xs text-bilibili-gray-600">播放量 {{ formatNumber(60000) }} · 点赞 {{ formatNumber(3000) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 模拟数据
const playCount = ref(1234567)
const followerCount = ref(98765)
const videoCount = ref(123)
const totalEarnings = ref(4567.89)
const publishedCount = ref(110)
const pendingCount = ref(5)
const rejectedCount = ref(8)
const videoTitle = ref('2024年最新创作教程')

const dayGrowth = ref({
  playCount: 12.5,
  followerCount: 8.3,
  videoCount: 3,
  earnings: 15.2
})

// 计算当前日期
const currentDate = computed(() => {
  const date = new Date()
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })
})

// 格式化数字
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// 格式化相对时间
const formatRelativeTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}分钟前`
  } else if (minutes < 1440) {
    return `${Math.floor(minutes / 60)}小时前`
  } else {
    return `${Math.floor(minutes / 1440)}天前`
  }
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