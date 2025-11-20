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
          <div class="w-full bg-black mb-4 shadow-lg rounded-lg overflow-hidden">
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
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                      <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
                    </svg>
                    <span>弹幕</span>
                  </button>
                  
                  <div class="relative group">
                    <button class="flex items-center space-x-1 hover:text-blue-400 transition-colors text-sm">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.696-2.942.724-2.656 2.05l.548 3.063a1.532 1.532 0 01-2.286.948c-1.372-.696-2.942.724-2.656 2.05l.548 3.063c.286 1.328 2.288 2.75 4.929 2.75h10.734c2.64-0 4.643-1.422 4.929-2.75l.548-3.063c.286-1.326-1.284-2.747-2.656-2.05a1.532 1.532 0 01-2.286-.948l-.548-3.063c-.286-1.326-1.284-2.747-2.656-2.05a1.532 1.532 0 01-2.286-.948zM10 15a2 2 0 100-4 2 2 0 000 4zm-6-5a2 2 0 114 0 2 2 0 01-4 0zm12 0a2 2 0 114 0 2 2 0 01-4 0z" clip-rule="evenodd"></path>
                      </svg>
                      <span>设置</span>
                    </button>
                  </div>
                </div>
                
                <div class="flex items-center space-x-6">
                  <div class="relative group">
                    <button class="flex items-center space-x-1 hover:text-blue-400 transition-colors text-sm">
                      <span class="font-medium">1080P</span>
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                  </div>
                  
                  <div class="relative group">
                    <button class="flex items-center space-x-1 hover:text-blue-400 transition-colors text-sm">
                      <span>倍速</span>
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                  </div>
                  
                  <div class="relative group">
                    <button class="flex items-center space-x-1 hover:text-blue-400 transition-colors text-sm">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.338 8.588a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L10 9.586 4.338 8.588z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 视频标题和作者信息 -->
          <div class="flex flex-col md:flex-row md:items-start justify-between mb-6">
            <div>
              <h1 class="text-[clamp(1.5rem,3vw,2rem)] font-bold text-gray-900 mb-2 line-clamp-2">{{ video.title }}</h1>
              <div class="flex items-center text-sm text-gray-500 mb-3 flex-wrap gap-x-4 gap-y-1">
                <span class="flex items-center"><i class="far fa-eye mr-1.5"></i>{{ video.views }} 次观看</span>
                <span class="flex items-center"><i class="far fa-calendar mr-1.5"></i>{{ video.publishedAt }}</span>
              </div>
            </div>
            <div class="flex items-center space-x-3 mt-2 md:mt-0">
              <div class="flex items-center">
                <img :src="video.authorAvatar" alt="Author avatar" class="w-10 h-10 rounded-full mr-3 border-2 border-white shadow-sm">
                <div class="hidden sm:block">
                  <p class="font-medium text-gray-900">{{ video.author }}</p>
                </div>
              </div>
              <button 
                @click="handleFollow"
                class="px-4 py-1.5 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition-colors flex items-center"
              >
                <i :class="video.isFollowed ? 'fas fa-check' : 'far fa-plus'" class="mr-1.5"></i>{{ video.isFollowed ? '已关注' : '关注' }}
              </button>
            </div>
          </div>
          
          <!-- 互动按钮区 -->
          <div class="flex flex-wrap gap-3 mb-6">
            <button @click="handleLike" class="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-700 hover:bg-gray-50 transition-all group">
              <i :class="video.isLiked ? 'fas fa-heart text-red-500' : 'far fa-heart'" class="text-xl group-hover:scale-110 transition-transform"></i>
              <span>{{ formatNumber(video.likes) }}</span>
            </button>
            <button class="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-700 hover:bg-gray-50 transition-all">
              <i class="far fa-comment text-xl"></i>
              <span>{{ formatNumber(video.comments) }}</span>
            </button>
            <button class="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-700 hover:bg-gray-50 transition-all">
              <i class="far fa-share-square text-xl"></i>
              <span>{{ formatNumber(video.shares) }}</span>
            </button>
            <button class="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-700 hover:bg-gray-50 transition-all ml-auto">
              <i class="far fa-bookmark text-xl"></i>
              <span>收藏</span>
            </button>
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

        <!-- Right side: Recommended Videos -->
        <div class="lg:col-span-1 related-videos lg:pl-6 bg-white rounded-xl shadow-sm p-4 mt-6">
          <h3 class="text-lg font-bold mb-4 flex items-center text-gray-900">
            <i class="fas fa-compass mr-2 text-blue-500"></i>推荐视频
          </h3>
          <div class="space-y-5">
            <div v-for="recVideo in recommendedVideos" :key="recVideo.id" @click="goToVideo(recVideo.id)" class="flex cursor-pointer group transition-transform hover:translate-x-1">
              <div class="relative w-48 h-27 flex-shrink-0 rounded-lg overflow-hidden">
                <img :src="recVideo.poster" alt="Video thumbnail" class="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300">
                <span v-if="recVideo.duration" class="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium backdrop-blur-sm">{{ recVideo.duration }}</span>
              </div>
              <div class="ml-3 overflow-hidden flex flex-col justify-between">
                <h4 class="font-medium text-sm line-clamp-2 group-hover:text-blue-500 transition-colors text-gray-900">{{ recVideo.title }}</h4>
                <div class="flex flex-col justify-end">
                  <p class="text-xs text-gray-500 mt-1 line-clamp-1">{{ recVideo.author }}</p>
                  <p class="text-xs text-gray-500 flex items-center"><i class="far fa-eye mr-1 text-gray-400"></i>{{ recVideo.views }} 观看</p>
                </div>
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
const danmakuContainer = ref<HTMLElement | null>(null)
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
</style>