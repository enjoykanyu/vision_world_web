<template>
  <div class="min-h-screen bg-white relative overflow-hidden">
    <!-- 背景装饰 -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-xiaohongshu-primary to-xiaohongshu-secondary"></div>
    </div>
    
    <!-- 移动端顶部导航 -->
    <nav class="relative z-10 p-4 bg-white/90 backdrop-blur-md border-b border-pink-100">
      <div class="flex items-center justify-between">
        <button @click="goBack" class="text-gray-700 hover:text-xiaohongshu-primary transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 class="text-xl font-bold text-xiaohongshu-primary">小红书</h1>
        <div class="flex items-center space-x-3">
          <button class="text-gray-700 hover:text-xiaohongshu-primary transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </button>
          <button class="text-gray-700 hover:text-xiaohongshu-primary transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>

    <!-- 主要内容 -->
    <div class="relative z-10 pb-20">
      <!-- 分类标签 -->
      <div class="flex space-x-3 px-4 py-3 overflow-x-auto bg-white border-b border-pink-100">
        <button v-for="category in categories" :key="category"
                class="px-4 py-1.5 rounded-full whitespace-nowrap transition-all duration-300 text-sm flex-shrink-0"
                :class="selectedCategory === category ?
                  'bg-xiaohongshu-primary text-white shadow-md' :
                  'bg-gray-100 text-gray-700 hover:bg-pink-50'">
          {{ category }}
        </button>
      </div>

      <!-- 笔记瀑布流 - 移动端两列 -->
      <div class="grid grid-cols-2 gap-3 p-3">
        <div v-for="note in notes" :key="note.id" 
             class="group cursor-pointer transform transition-all duration-500 hover:scale-105">
          <div class="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <!-- 图片区域 -->
            <div class="relative">
              <div class="aspect-square bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 flex items-center justify-center">
                <div class="text-center">
                  <svg class="w-12 h-12 text-pink-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                  </svg>
                  <p class="text-pink-600 text-sm font-medium">{{ note.imageCount }}张图片</p>
                </div>
              </div>
              <!-- 收藏按钮 -->
              <button class="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              </button>
            </div>
            
            <!-- 内容区域 -->
            <div class="p-4">
              <h3 class="text-gray-800 font-semibold mb-2 line-clamp-2 text-sm">
                {{ note.title }}
              </h3>
              <p class="text-gray-600 text-xs mb-3 line-clamp-2">
                {{ note.description }}
              </p>
              
              <!-- 用户信息 -->
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <div class="w-6 h-6 bg-gradient-to-br from-xiaohongshu-primary to-xiaohongshu-secondary rounded-full"></div>
                  <span class="text-gray-700 text-xs">{{ note.author }}</span>
                </div>
                <div class="flex items-center space-x-3 text-gray-500 text-xs">
                  <span class="flex items-center">
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    {{ note.likes }}
                  </span>
                  <span class="flex items-center">
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                    </svg>
                    {{ note.shares }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部导航 -->
    <div class="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-pink-100">
      <div class="flex items-center justify-around py-2">
        <button class="flex flex-col items-center space-y-1 text-xiaohongshu-primary">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          <span class="text-xs">首页</span>
        </button>
        <button class="flex flex-col items-center space-y-1 text-gray-600 hover:text-xiaohongshu-primary transition-colors">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <span class="text-xs">发现</span>
        </button>
        <button class="flex flex-col items-center space-y-1 text-gray-600 hover:text-xiaohongshu-primary transition-colors">
          <div class="w-12 h-12 bg-xiaohongshu-primary rounded-full flex items-center justify-center -mt-4">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </div>
        </button>
        <button class="flex flex-col items-center space-y-1 text-gray-600 hover:text-xiaohongshu-primary transition-colors">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <span class="text-xs">消息</span>
        </button>
        <button class="flex flex-col items-center space-y-1 text-gray-600 hover:text-xiaohongshu-primary transition-colors">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          <span class="text-xs">我</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.push({ name: 'home' })
}

const selectedCategory = ref('推荐')

const categories = [
  '推荐', '美妆', '穿搭', '美食', '旅行', '健身', '家居', '职场', '学习', '萌宠'
]

const notes = [
  {
    id: 1,
    title: '夏日清爽妆容分享，5分钟搞定日常妆',
    description: '今天给大家分享一个超级简单的夏日妆容，适合日常通勤和约会，清爽自然又提气色～',
    author: '美妆小达人',
    likes: '2.3k',
    shares: '156',
    imageCount: 6
  },
  {
    id: 2,
    title: 'OOTD | 今日穿搭分享，温柔风小姐姐',
    description: '今天的穿搭是温柔风，白色连衣裙搭配米色针织开衫，整体感觉很温柔很有气质～',
    author: '时尚博主',
    likes: '1.8k',
    shares: '89',
    imageCount: 4
  },
  {
    id: 3,
    title: '美食探店 | 这家咖啡店太治愈了',
    description: '发现了一家超治愈的咖啡店，环境很棒，咖啡也很香浓，适合一个人安静地待一下午～',
    author: '美食探索家',
    likes: '3.1k',
    shares: '234',
    imageCount: 8
  },
  {
    id: 4,
    title: '健身打卡 | 第30天，身材变化明显',
    description: '坚持健身30天了，身材有了明显的变化，分享一些健身心得和饮食建议～',
    author: '健身教练',
    likes: '4.2k',
    shares: '567',
    imageCount: 5
  },
  {
    id: 5,
    title: '家居布置 | 小户型也能有大格局',
    description: '分享一些小户型家居布置的小技巧，让空间看起来更大更舒适～',
    author: '家居设计师',
    likes: '2.7k',
    shares: '198',
    imageCount: 7
  },
  {
    id: 6,
    title: '旅行Vlog | 海边度假的完美一天',
    description: '记录在海边度假的美好时光，蓝天白云，沙滩海浪，太治愈了～',
    author: '旅行博主',
    likes: '5.1k',
    shares: '445',
    imageCount: 12
  },
  {
    id: 7,
    title: '职场干货 | 如何高效工作不加班',
    description: '分享一些职场高效工作的小技巧，让你告别加班，提升工作效率～',
    author: '职场导师',
    likes: '3.8k',
    shares: '312',
    imageCount: 3
  },
  {
    id: 8,
    title: '萌宠日常 | 我家猫咪的可爱瞬间',
    description: '记录我家猫咪的日常可爱瞬间，每一张都是心都化了～',
    author: '猫奴',
    likes: '6.2k',
    shares: '789',
    imageCount: 15
  }
]

const recommendedUsers = [
  { id: 1, name: '美妆小达人', followers: '12.3万' },
  { id: 2, name: '时尚博主', followers: '8.7万' },
  { id: 3, name: '美食探索家', followers: '15.2万' },
  { id: 4, name: '健身教练', followers: '9.8万' },
  { id: 5, name: '家居设计师', followers: '6.5万' },
  { id: 6, name: '旅行博主', followers: '11.4万' }
]

const hotTopics = [
  { id: 1, rank: 1, title: '夏日清爽妆容', views: '234.5万' },
  { id: 2, rank: 2, title: '温柔风穿搭', views: '198.2万' },
  { id: 3, rank: 3, title: '咖啡店探店', views: '156.7万' },
  { id: 4, rank: 4, title: '健身打卡', views: '134.9万' },
  { id: 5, rank: 5, title: '小户型家居', views: '123.4万' },
  { id: 6, rank: 6, title: '海边度假', views: '98.7万' }
]
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.glass-effect {
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.3);
}
</style>