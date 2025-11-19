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
          <!-- 视频播放器 -->
          <div class="w-full bg-black mb-4 shadow-lg">
            <div class="relative pt-[56.25%]"> <!-- 16:9 宽高比 -->
              <video 
                ref="videoPlayer"
                :src="video.src" 
                :poster="video.poster" 
                class="absolute top-0 left-0 w-full h-full object-contain"
                controls
                @loadstart="handleVideoLoad"
                @error="handleVideoError"
              ></video>
              
              <!-- 弹幕容器 -->
              <div ref="danmakuContainer" class="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <!-- 弹幕会动态添加到这里 -->
              </div>
              
              <!-- 视频控制栏上方的控制按钮 -->
              <div class="absolute bottom-16 left-0 right-0 flex items-center justify-between px-4 text-white bg-gradient-to-t from-black/70 to-transparent py-2">
                <div class="flex items-center space-x-6">
                  <button @click="toggleDanmaku" class="flex items-center space-x-1 hover:text-blue-400 transition-colors text-sm">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path></svg>
                    <span>弹幕</span>
                  </button>
                  
                  <div class="relative group">
                    <button class="flex items-center space-x-1 hover:text-blue-400 transition-colors text-sm">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.696-2.942.724-2.656 2.05l.548 3.063a1.532 1.532 0 01-2.286.948c-1.372-.696-2.942.724-2.656 2.05l.548 3.063c.286 1.328 2.288 2.75 4.929 2.75h10.734c2.64-0 4.643-1.422 4.929-2.75l.548-3.063c.286-1.326-1.284-2.747-2.656-2.05a1.532 1.532 0 01-2.286-.948l-.548-3.063c-.286-1.326-1.284-2.747-2.656-2.05a1.532 1.532 0 01-2.286-.948zM10 15a2 2 0 100-4 2 2 0 000 4zm-6-5a2 2 0 114 0 2 2 0 01-4 0zm12 0a2 2 0 114 0 2 2 0 01-4 0z" clip-rule="evenodd"></path></svg>
                      <span>设置</span>
                    </button>
                  </div>
                </div>
                
                <div class="flex items-center space-x-6">
                  <div class="relative group">
                    <button class="flex items-center space-x-1 hover:text-blue-400 transition-colors text-sm">
                      <span class="font-medium">1080P</span>
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                  </div>
                  
                  <div class="relative group">
                    <button class="flex items-center space-x-1 hover:text-blue-400 transition-colors text-sm">
                      <span>倍速</span>
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                  </div>
                  
                  <div class="relative group">
                    <button class="flex items-center space-x-1 hover:text-blue-400 transition-colors text-sm">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.338 8.588a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L10 9.586 4.338 8.588z"></path></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ video.title }}</h1>
          <div class="flex flex-wrap items-center text-sm text-gray-500 mb-4 gap-x-4 gap-y-2">
            <span>{{ video.views }} 观看</span>
            <span>{{ video.publishedAt }}</span>
            <span v-if="video.duration">时长: {{ video.duration }}</span>
          </div>
          <div class="flex items-center justify-between mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div class="flex items-center">
              <img :src="video.authorAvatar" alt="author" class="w-14 h-14 rounded-full mr-4 border-2 border-white dark:border-gray-700 shadow-sm">
              <div>
                <p class="font-semibold text-gray-900 dark:text-white text-lg">{{ video.author }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ video.authorFans || '0' }} 粉丝</p>
              </div>
            </div>
            <button 
              @click="handleFollow"
              :class="[ 'px-5 py-2 rounded-full transition-colors text-sm font-medium', video.isFollowed ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-bilibili-primary text-white hover:bg-purple-700' ]"
            >
              {{ video.isFollowed ? '已关注' : '+ 关注' }}
            </button>
          </div>
          
          <!-- 互动按钮 -->
          <!-- 互动按钮区 -->
          <div class="grid grid-cols-4 gap-2 mb-8">
            <button 
              @click="handleLike"
              :class="[ 'flex flex-col items-center justify-center py-3 rounded-lg transition-colors', video.isLiked ? 'bg-red-50 text-red-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700' ]"
            >
              <svg class="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
              </svg>
              <span class="text-sm">{{ formatNumber(video.likes || 0) }}</span>
              <span class="text-xs mt-1">点赞</span>
            </button>
            
            <button class="flex flex-col items-center justify-center py-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              <span class="text-sm">{{ formatNumber(video.comments || 0) }}</span>
              <span class="text-xs mt-1">评论</span>
            </button>
            
            <button class="flex flex-col items-center justify-center py-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
              </svg>
              <span class="text-sm">{{ formatNumber(video.shares || 0) }}</span>
              <span class="text-xs mt-1">分享</span>
            </button>
            
            <button class="flex flex-col items-center justify-center py-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
              </svg>
              <span class="text-sm">{{ formatNumber(video.collections || 0) }}</span>
              <span class="text-xs mt-1">收藏</span>
            </button>
          </div>
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
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path></svg>
                        <span>1.2K</span>
                      </button>
                      <button class="flex items-center space-x-1 text-gray-500 hover:text-bilibili-primary transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01"></path></svg>
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
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path></svg>
                        <span>865</span>
                      </button>
                      <button class="flex items-center space-x-1 text-gray-500 hover:text-bilibili-primary transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01"></path></svg>
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

        <!-- Right side: Recommended Videos -->
        <div class="lg:col-span-1">
          <h2 class="text-xl font-bold text-gray-900 mb-4">推荐视频</h2>
          <div class="space-y-4">
            <div v-for="recVideo in recommendedVideos" :key="recVideo.id" class="flex items-start space-x-3 cursor-pointer group" @click="goToVideo(recVideo.id)">
              <div class="w-36 flex-shrink-0 relative">
                <img :src="recVideo.poster" :alt="recVideo.title" class="rounded-lg aspect-video object-cover group-hover:opacity-90 transition-opacity">
                <span v-if="recVideo.duration" class="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">{{ recVideo.duration }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white leading-tight line-clamp-2 mb-1 group-hover:text-bilibili-primary transition-colors">{{ recVideo.title }}</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{{ recVideo.author }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ recVideo.views }} 观看</p>
              </div>
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
const loading = ref(false)

// 视频数据
const video = ref(null)
const recommendedVideos = ref([])
const danmakus = ref([])
const danmakuText = ref('')

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
  } catch (error) {
    console.error('获取推荐视频失败:', error)
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
  danmakuElement.className = 'danmaku';
  danmakuElement.style.position = 'absolute';
  danmakuElement.style.color = danmaku.color;
  danmakuElement.style.left = '100%';
  danmakuElement.style.top = `${danmaku.position}%`;
  danmakuElement.style.transform = 'translateY(-50%)';
  danmakuElement.style.whiteSpace = 'nowrap';
  danmakuElement.style.fontSize = '16px';
  danmakuElement.style.fontWeight = 'bold';
  danmakuElement.style.textShadow = '0 0 2px black';
  // 动画由CSS类定义，移除内联样式以避免冲突

  danmakuElement.textContent = danmaku.text;
  
  container.appendChild(danmakuElement);
  
  // 移除过期弹幕
  setTimeout(() => {
    danmakuElement.remove();
  }, 8000);
};

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
      // 如果API调用失败，可以添加mock数据以确保页面能正常显示
      video.value = {
        id: videoId.value,
        title: '示例视频标题',
        src: '/test-video.mp4',
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
    // 错误情况下也提供mock数据
    video.value = {
      id: videoId.value,
      title: '示例视频标题',
      src: '/test-video.mp4',
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

// 弹幕显示控制
const toggleDanmaku = () => {
  const container = danmakuContainer.value;
  if (container) {
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
  }
}

// 点赞/取消点赞
const handleLike = async () => {
  if (!video.value) return
  
  try {
    video.value.isLiked = !video.value.isLiked
    video.value.likes += video.value.isLiked ? 1 : -1
    console.log(video.value.isLiked ? '点赞成功' : '取消点赞成功')
  } catch (error: any) {
    console.error('操作失败:', error.message || '操作失败')
  }
}

// 监听路由变化
watch(() => route.params.id, async (newId) => {
  if (newId && newId !== videoId.value) {
    videoId.value = newId as string
    window.scrollTo(0, 0)
    await fetchVideoData()
    
    // 等待DOM更新后尝试播放视频
    await nextTick()
    setTimeout(() => {
      playVideo()
    }, 500)
  }
})

// 组件挂载时加载数据
onMounted(async () => {
  await fetchVideoData()
  
  // 尝试播放视频
  setTimeout(() => {
    playVideo()
  }, 500)
})
</script>

<style scoped>
.aspect-w-16 {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
}
.aspect-h-9 {
  /* This class is a companion for aspect-w-16 */
}
.aspect-video {
    aspect-ratio: 16 / 9;
}
video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

@keyframes danmaku {
  from { transform: translateX(100%); }
  to { transform: translateX(-100%); }
}

/* 弹幕样式优化 */
.danmaku {
  position: absolute;
  white-space: nowrap;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8), -1px -1px 2px rgba(0, 0, 0, 0.8);
  font-size: 16px;
  font-weight: 500;
  animation: danmaku 8s linear forwards;
  pointer-events: none;
  z-index: 10;
}

/* 添加缺失的样式类 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.bg-bilibili-primary {
  background-color: #00a1d6;
}

.bg-bilibili-primary:hover {
  background-color: #0085b3;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .grid-cols-1.lg\\:grid-cols-3 {
    grid-template-columns: 1fr;
  }
}
</style>