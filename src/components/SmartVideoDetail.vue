<template>
  <div class="video-detail-container">
    <!-- 桌面端视图 -->
    <div class="desktop-video-view">
      <div class="video-container">
        <video
          ref="desktopVideoPlayer"
          class="desktop-video-player"
          :src="currentVideo?.url"
          controls
          autoplay
          @loadedmetadata="onDesktopVideoLoaded"
        ></video>
      </div>
      
      <div class="video-info-section">
        <h1 class="video-title">{{ currentVideo?.title }}</h1>
        <div class="video-stats">
          <span>{{ formatNumber(currentVideo?.views) }} 次观看</span>
          <span>{{ formatTime(currentVideo?.createdAt) }}</span>
        </div>
        
        <div class="author-section">
          <img :src="currentVideo?.author?.avatar" class="author-avatar" />
          <div class="author-info">
            <div class="author-name">{{ currentVideo?.author?.name }}</div>
            <div class="author-desc">{{ currentVideo?.author?.description }}</div>
          </div>
          <button class="follow-btn">+ 关注</button>
        </div>
        
        <div class="video-actions">
          <button class="action-btn" @click="toggleLike" :class="{ 'liked': isLiked }">
            <span>👍 {{ formatNumber(currentVideo?.likes) }}</span>
          </button>
          <button class="action-btn" @click="toggleCollect" :class="{ 'collected': isCollected }">
            <span>⭐ 收藏</span>
          </button>
          <button class="action-btn" @click="toggleShare">
            <span>📤 分享</span>
          </button>
        </div>
        
        <div class="video-description">
          {{ currentVideo?.description }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVideoStore } from '@/stores/videoStore'
const route = useRoute()
const router = useRouter()
const videoStore = useVideoStore()

const currentVideo = ref(null)
const isLiked = ref(false)
const isCollected = ref(false)

const desktopVideoPlayer = ref(null)

// 格式化数字
const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num?.toString() || '0'
}

// 格式化时间
const formatTime = (time: string) => {
  if (!time) return '刚刚'
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  if (days < 30) return `${Math.floor(days / 7)}周前`
  return `${Math.floor(days / 30)}月前`
}

// 获取视频详情
const fetchVideoDetail = async () => {
  const videoId = route.params.id
  if (!videoId) return
  
  try {
    const result = await videoStore.fetchVideoDetail(videoId)
    if (result.success) {
      currentVideo.value = result.data
    } else {
      // 如果 API 失败，使用 mock 数据
      currentVideo.value = getMockVideoDetail(videoId as string)
    }
  } catch (error) {
    console.error('获取视频详情失败，使用 mock 数据:', error)
    // 使用 mock 数据作为后备
    currentVideo.value = getMockVideoDetail(videoId as string)
  }
}

// Mock 视频详情数据
const getMockVideoDetail = (videoId: string) => {
  return {
    id: videoId,
    title: '精彩视频内容 - ' + videoId,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    cover: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80',
    duration: '5:30',
    views: '1.2M',
    likes: 8520,
    comments: 156,
    shares: 89,
    uploadTime: '2天前',
    author: {
      id: 'author1',
      name: '创作者名称',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      description: '这是一个优秀的内容创作者，专注于制作高质量的视频内容。',
      isFollowed: false
    },
    description: '这是一个精彩的视频内容，展示了令人惊叹的画面和故事。视频制作精良，内容丰富，值得观看和分享。',
    tags: ['精彩', '推荐', '热门'],
    createdAt: new Date().toISOString()
  }
}

// 桌面端视频事件
const onDesktopVideoLoaded = () => {
  if (desktopVideoPlayer.value) {
    desktopVideoPlayer.value.play()
  }
}

// 操作函数
const toggleLike = () => {
  isLiked.value = !isLiked.value
  if (currentVideo.value) {
    currentVideo.value.likes += isLiked.value ? 1 : -1
  }
}

const toggleCollect = () => {
  isCollected.value = !isCollected.value
}

const toggleShare = () => {
  if (navigator.share) {
    navigator.share({
      title: currentVideo.value?.title,
      text: currentVideo.value?.description,
      url: window.location.href
    })
  } else {
    // 复制链接到剪贴板
    navigator.clipboard.writeText(window.location.href)
    alert('链接已复制到剪贴板')
  }
}

onMounted(() => {
  fetchVideoDetail()
})
</script>

<style scoped>
.video-detail-container {
  width: 100%;
  height: 100%;
}

/* 移动端样式 */
.mobile-video-view {
  position: relative;
  width: 100%;
  height: 100vh;
  background: #000;
  overflow: hidden;
}

.video-swipe-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.video-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-player {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.video-info {
  flex: 1;
  margin-right: 20px;
}

.author-info {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.author-name {
  color: white;
  font-size: 14px;
  margin-right: 10px;
}

.follow-btn {
  background: #ff0050;
  color: white;
  border: none;
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 12px;
  cursor: pointer;
}

.video-title {
  color: white;
  font-size: 16px;
  margin-bottom: 5px;
  line-height: 1.4;
}

.video-stats {
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
}

.video-actions {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.action-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;
  transition: all 0.3s ease;
}

.action-icon:hover {
  background: rgba(255, 255, 255, 0.3);
}

.action-icon.liked {
  background: #ff0050;
  color: white;
}

.action-icon.collected {
  background: #ffd700;
  color: white;
}

.action-icon svg {
  width: 24px;
  height: 24px;
}

.action-count {
  color: white;
  font-size: 12px;
  text-align: center;
}

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
}

.progress-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.3);
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  background: #ff0050;
  transition: width 0.1s ease;
}

.heart-animation {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 1000;
}

.heart {
  font-size: 80px;
  animation: heartBeat 1s ease-out;
}

@keyframes heartBeat {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  15% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

.comment-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70vh;
  background: #1a1a1a;
  border-radius: 20px 20px 0 0;
  z-index: 1000;
  transform: translateY(0);
  transition: transform 0.3s ease;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #333;
}

.comment-header h3 {
  color: white;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
}

.comment-list {
  padding: 20px;
  overflow-y: auto;
  height: calc(100% - 80px);
}

.comment-item {
  display: flex;
  margin-bottom: 20px;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 15px;
}

.comment-content {
  flex: 1;
}

.comment-author {
  color: white;
  font-weight: bold;
  margin-bottom: 5px;
}

.comment-text {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 5px;
}

.comment-stats {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}

/* 桌面端样式 */
.desktop-video-view {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  gap: 20px;
}

.video-container {
  flex: 1;
}

.desktop-video-player {
  width: 100%;
  border-radius: 8px;
}

.video-info-section {
  width: 400px;
}

.video-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.video-stats {
  color: #666;
  margin-bottom: 20px;
}

.author-section {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
}

.author-section .author-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
}

.author-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.author-desc {
  color: #666;
  font-size: 14px;
}

.video-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.action-btn {
  background: white;
  border: 1px solid #ddd;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: #f5f5f5;
}

.action-btn.liked {
  background: #ff0050;
  color: white;
  border-color: #ff0050;
}

.action-btn.collected {
  background: #ffd700;
  color: white;
  border-color: #ffd700;
}

.video-description {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  line-height: 1.6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .desktop-video-view {
    flex-direction: column;
    padding: 10px;
  }
  
  .video-info-section {
    width: 100%;
  }
}
</style>