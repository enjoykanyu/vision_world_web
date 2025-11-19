import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './userStore'
import { videoAPI, VideoListResponse, VideoDetailResponse, Video as ApiVideo } from '@/api/video';

// 本地视频接口（保持与原有接口兼容）
export interface Author {
  username: string
  avatar: string
  isFollowed?: boolean
}

export interface Video {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  duration: string;
  views: number;
  author: Author;
  description: string;
  tags: string[];
  publishedAt: string;
  like_count: number;
  comment_count: number;
  share_count: number;
  isLiked: boolean;
  isFollowed: boolean;
  videoType: string;
  videoSource: string;
}

// 视频列表状态
export interface VideoListState {
  videos: Video[]
  loading: boolean
  hasMore: boolean
  page: number
  pageSize: number
  total: number
  error?: string
}

export const useVideoStore = defineStore('video', () => {
  // 状态
  const currentVideo = ref<Video | null>(null)
  const recommendedVideos = ref<VideoListState>({
    videos: [],
    loading: false,
    hasMore: true,
    page: 1,
    pageSize: 10,
    total: 0
  })
  const hotVideos = ref<VideoListState>({
    videos: [],
    loading: false,
    hasMore: true,
    page: 1,
    pageSize: 10,
    total: 0
  })
  const testVideos = ref<Video[]>([])

  // 计算属性
  const hasCurrentVideo = computed(() => !!currentVideo.value)
  const recommendedVideoList = computed(() => recommendedVideos.value.videos)
  const hotVideoList = computed(() => hotVideos.value.videos)
  const isRecommendedLoading = computed(() => recommendedVideos.value.loading)
  const isHotLoading = computed(() => hotVideos.value.loading)

  // 获取推荐视频列表
  async function fetchRecommendedVideos(params?: { page?: number; pageSize?: number; refresh?: boolean }) {
    const { page = 1, pageSize = 10, refresh = false } = params || {}
    
    // 如果是刷新，重置状态
    if (refresh) {
      recommendedVideos.value.page = 1
      recommendedVideos.value.hasMore = true
      recommendedVideos.value.videos = []
    }

    // 如果没有更多数据，直接返回
    if (!recommendedVideos.value.hasMore && !refresh) {
      return { success: true, data: recommendedVideos.value.videos }
    }

    recommendedVideos.value.loading = true
    
    try {
      // 导入userStore
      const userStore = useUserStore()
      const { isAuthenticated, getRecommendedTags } = userStore
      
      // 构建请求参数
      const requestParams: any = {
        page,
        page_size: pageSize,
        request_id: generateRequestId()
      }
      
      // 如果用户已登录，添加用户标签参数
      if (isAuthenticated.value) {
        const userRecommendedTags = getRecommendedTags(5) // 获取前5个推荐标签
        if (userRecommendedTags.length > 0) {
          requestParams.user_tags = userRecommendedTags.join(',')
        }
      }
      
      const response: VideoListResponse = await videoAPI.getRecommendedVideos(requestParams)
      
      if (!response || !response.videos) {
        throw new Error('Invalid response structure')
      }

      const data = response
      const videos = Array.isArray(data.videos) ? data.videos : [] as ApiVideo[]
      const pagination = data.pagination || { current_page: 1, per_page: 10, total: 0, total_pages: 1 }

      // 转换API数据格式
      const convertedVideos = videos.map(transformApiVideoToLocal)
      
      // 更新状态
      if (refresh) {
        recommendedVideos.value.videos = convertedVideos
      } else {
        recommendedVideos.value.videos.push(...convertedVideos)
      }
      
      recommendedVideos.value.page = pagination.current_page
      recommendedVideos.value.pageSize = pagination.per_page
      recommendedVideos.value.total = pagination.total
      recommendedVideos.value.hasMore = pagination.current_page < pagination.total_pages
      recommendedVideos.value.error = undefined
      
      return { success: true, data: recommendedVideos.value.videos }
    } catch (error: any) {
      console.error('获取推荐视频失败:', error)
      recommendedVideos.value.error = error.message || '获取推荐视频失败'
      return { success: false, error: recommendedVideos.value.error }
    } finally {
      recommendedVideos.value.loading = false
    }
  }

  // 获取热门视频列表
  async function fetchHotVideos(params?: { page?: number; pageSize?: number; refresh?: boolean }) {
    const { page = 1, pageSize = 10, refresh = false } = params || {}
    
    // 如果是刷新，重置状态
    if (refresh) {
      hotVideos.value.page = 1
      hotVideos.value.hasMore = true
      hotVideos.value.videos = []
    }

    // 如果没有更多数据，直接返回
    if (!hotVideos.value.hasMore && !refresh) {
      return { success: true, data: hotVideos.value.videos }
    }

    hotVideos.value.loading = true
    
    try {
      const response: VideoListResponse = await videoAPI.getHotVideos({
        page,
        page_size: pageSize,
        request_id: generateRequestId()
      })
      
      const { videos = [], pagination = { current_page: 1, page_size: 10, total: 0, total_pages: 1 } } = response || {}
      
      // 转换API数据格式
      const convertedVideos = videos.map(transformApiVideoToLocal)
      
      // 更新状态
      if (refresh) {
        hotVideos.value.videos = convertedVideos
      } else {
        hotVideos.value.videos.push(...convertedVideos)
      }
      
      hotVideos.value.page = pagination.current_page
      hotVideos.value.pageSize = pagination.per_page
      hotVideos.value.total = pagination.total
      hotVideos.value.hasMore = pagination.current_page < pagination.total_pages
      
      return { success: true, data: hotVideos.value.videos }
    } catch (error: any) {
      console.error('获取热门视频失败:', error)
      // 使用console.error替代ElementPlus的消息提示
      console.error('获取热门视频失败:', error.message || '获取热门视频失败')
      // 可以在这里添加自定义的错误通知组件
      return { success: false, error: error.message }
    } finally {
      hotVideos.value.loading = false
    }
  }

  // 获取视频详情
  async function fetchVideoDetail(videoId: string) {
    try {
      const response: VideoDetailResponse = await videoAPI.getVideoDetail(videoId, generateRequestId())
      
      if (!response.data || !response.data.data) {
        throw new Error('Invalid response structure')
      }
      
      const video = response.data;
      
      // 转换API数据格式
      currentVideo.value = transformApiVideoToLocal(video)
      
      return { success: true, data: currentVideo.value }
    } catch (error: any) {
      console.error('获取视频详情失败:', error)
      // 使用console.error替代ElementPlus的消息提示
      console.error('获取视频详情失败:', error.message || '获取视频详情失败')
      // 可以在这里添加自定义的错误通知组件
      return { success: false, error: error.message }
    }
  }

  // 点赞视频
  async function likeVideo(videoId: string) {
    try {
      const response = await videoAPI.likeVideo(videoId, true)
      
      if (!response.data) {
        throw new Error('Invalid response structure')
      }
      
      // 更新本地状态
      if (currentVideo.value && currentVideo.value.id === videoId) {
        currentVideo.value.isLiked = true
        // 使用API返回的点赞数
        currentVideo.value.like_count = response.like_count !== undefined ? Number(response.like_count) : (currentVideo.value.like_count || 0) + 1
      }
      
      // 更新列表中的视频状态
      const currentLikes = getVideoById(videoId)?.like_count || 0
      const newLikes = response.like_count !== undefined ? response.like_count : currentLikes + 1
      updateVideoInLists(videoId, { isLiked: true, like_count: newLikes as number })
      
      // 使用console.log替代ElementPlus的消息提示
      console.log('点赞成功')
      // 可以在这里添加自定义的成功通知组件
      return { success: true }
    } catch (error: any) {
      console.error('点赞失败:', error)
      // 使用console.error替代ElementPlus的消息提示
      console.error('点赞失败:', error.message || '点赞失败')
      // 可以在这里添加自定义的错误通知组件
      return { success: false, error: error.message }
    }
  }

  // 取消点赞
  async function unlikeVideo(videoId: string) {
    try {
      const response = await videoAPI.likeVideo(videoId, false)
      
      if (!response.data) {
        throw new Error('Invalid response structure')
      }
      
      // 更新本地状态
      if (currentVideo.value && currentVideo.value.id === videoId) {
        currentVideo.value.isLiked = false
        // 使用API返回的点赞数
        currentVideo.value.like_count = response.like_count !== undefined ? Number(response.like_count) : Math.max(0, (currentVideo.value.like_count || 1) - 1)
      }
      
      // 更新列表中的视频状态
      const currentLikes = getVideoById(videoId)?.like_count || 1
      const newLikes = response.like_count !== undefined ? response.like_count : Math.max(0, currentLikes - 1)
      updateVideoInLists(videoId, { isLiked: false, like_count: newLikes as number })
      
      // 使用console.log替代ElementPlus的消息提示
      console.log('取消点赞成功')
      // 可以在这里添加自定义的成功通知组件
      return { success: true }
    } catch (error: any) {
      console.error('取消点赞失败:', error)
      // 使用console.error替代ElementPlus的消息提示
      console.error('取消点赞失败:', error.message || '取消点赞失败')
      // 可以在这里添加自定义的错误通知组件
      return { success: false, error: error.message }
    }
  }

  // 关注用户
  async function followUser(authorId: string) {
    try {
      await videoAPI.followUser(authorId)
      
      // 更新本地状态
      if (currentVideo.value && currentVideo.value.author.username === authorId) {
        currentVideo.value.isFollowed = true
      }
      
      // 更新列表中的视频状态
      updateVideosByAuthor(authorId, { isFollowed: true })
      
      // 使用console.log替代ElementPlus的消息提示
      console.log('关注成功')
      // 可以在这里添加自定义的成功通知组件
      return { success: true }
    } catch (error: any) {
      console.error('关注失败:', error)
      // 使用console.error替代ElementPlus的消息提示
      console.error('关注失败:', error.message || '关注失败')
      // 可以在这里添加自定义的错误通知组件
      return { success: false, error: error.message }
    }
  }

  // 取消关注
  async function unfollowUser(authorId: string) {
    try {
      await videoAPI.unfollowUser(authorId)
      
      // 更新本地状态
      if (currentVideo.value && currentVideo.value.author.username === authorId) {
        currentVideo.value.isFollowed = false
      }
      
      // 更新列表中的视频状态
      updateVideosByAuthor(authorId, { isFollowed: false })
      
      // 使用console.log替代ElementPlus的消息提示
      console.log('取消关注成功')
      // 可以在这里添加自定义的成功通知组件
      return { success: true }
    } catch (error: any) {
      console.error('取消关注失败:', error)
      // 使用console.error替代ElementPlus的消息提示
      console.error('取消关注失败:', error.message || '取消关注失败')
      // 可以在这里添加自定义的错误通知组件
      return { success: false, error: error.message }
    }
  }

  // 设置当前视频
  function setCurrentVideo(video: Video | null) {
    currentVideo.value = video
  }

  // 设置测试视频
  function setTestVideos(videos: Video[]) {
    testVideos.value = videos
  }

  // 清除当前视频
  function clearCurrentVideo() {
    currentVideo.value = null
  }

  // 更新列表中的视频
  function updateVideoInLists(videoId: string, updates: Partial<Video>) {
    // 更新推荐视频列表
    const recommendedIndex = recommendedVideos.value.videos.findIndex(v => v.id === videoId)
    if (recommendedIndex !== -1) {
      recommendedVideos.value.videos[recommendedIndex] = {
        ...recommendedVideos.value.videos[recommendedIndex],
        ...updates
      }
    }
    
    // 更新热门视频列表
    const hotIndex = hotVideos.value.videos.findIndex(v => v.id === videoId)
    if (hotIndex !== -1) {
      hotVideos.value.videos[hotIndex] = {
        ...hotVideos.value.videos[hotIndex],
        ...updates
      }
    }
  }

  // 根据作者ID更新视频
  function updateVideosByAuthor(authorId: string, updates: Partial<Video>) {
    // 更新推荐视频列表
    recommendedVideos.value.videos = recommendedVideos.value.videos.map(video => 
      video.author.username === authorId ? { ...video, ...updates } : video
    )
    
    // 更新热门视频列表
    hotVideos.value.videos = hotVideos.value.videos.map(video => 
      video.author.username === authorId ? { ...video, ...updates } : video
    )
  }

  // 根据ID获取视频
  function getVideoById(videoId: string): Video | undefined {
    if (!recommendedVideos.value?.videos || !hotVideos.value?.videos) return undefined;
    return recommendedVideos.value.videos.find(v => v.id === videoId) ||
           hotVideos.value.videos.find(v => v.id === videoId)
  }

  // 转换API视频数据格式
  function transformApiVideoToLocal(apiVideo: ApiVideo): Video {
    // 处理可能的duration类型问题
    let durationSeconds = 0;
    if (typeof apiVideo.duration === 'string') {
      durationSeconds = parseInt(apiVideo.duration, 10) || 0;
    } else if (typeof apiVideo.duration === 'number') {
      durationSeconds = apiVideo.duration;
    }

    // 处理作者信息
    const author = apiVideo.author || {};

    return {
      id: apiVideo.id || 'unknown_id',
      title: apiVideo.title || 'Untitled',
      url: apiVideo.url || '',
      thumbnail: apiVideo.thumbnail || '',
      duration: formatDuration(durationSeconds),
      views: typeof apiVideo.views === 'number' ? apiVideo.views : parseInt(apiVideo.views as string, 10) || 0,
      author: { username: apiVideo.author?.username || 'Unknown', avatar: apiVideo.author?.avatar || '', isFollowed: apiVideo.author?.isFollowed || false },
      description: apiVideo.description || '',
      tags: Array.isArray(apiVideo.tags) ? apiVideo.tags : [],
      publishedAt: formatDate(apiVideo.publishedAt ? new Date(apiVideo.publishedAt).toISOString() : new Date().toISOString()),
      like_count: typeof apiVideo.like_count === 'number' ? apiVideo.like_count : parseInt(apiVideo.like_count as string, 10) || 0,
      comment_count: typeof apiVideo.comment_count === 'number' ? apiVideo.comment_count : parseInt(apiVideo.comment_count as string, 10) || 0,
      share_count: typeof apiVideo.share_count === 'number' ? apiVideo.share_count : parseInt(apiVideo.share_count as string, 10) || 0,
      isLiked: Boolean(apiVideo.isLiked),
      isFollowed: Boolean(apiVideo.author?.isFollowed),
      videoType: apiVideo.videoType || 'original',
      videoSource: apiVideo.videoSource || ''
    }
  }

  // 格式化时长（秒转 MM:SS 格式）
  function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // 格式化日期
  function formatDate(dateString: string): string {
    if (!dateString) return 'Unknown Date';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '今天';
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays}天前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}个月前`;
    return `${Math.floor(diffDays / 365)}年前`;
  }

  // 生成请求ID
  function generateRequestId(): string {
    return 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  return {
    // 状态
    currentVideo,
    recommendedVideos,
    hotVideos,
    testVideos,
    
    // 计算属性
    hasCurrentVideo,
    recommendedVideoList,
    hotVideoList,
    isRecommendedLoading,
    isHotLoading,
    
    // 方法
    fetchRecommendedVideos,
    fetchHotVideos,
    fetchVideoDetail,
    likeVideo,
    unlikeVideo,
    followUser,
    unfollowUser,
    setCurrentVideo,
    setTestVideos,
    clearCurrentVideo
  }
})