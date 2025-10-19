import { http } from '@/utils/request'

// 视频数据接口（适配现有组件格式）
export interface Video {
  id: string
  title: string
  src: string
  poster: string
  duration: string
  views: string
  author: string
  authorAvatar: string
  description: string
  tags: string[]
  publishedAt: string
}

// API返回的视频数据接口
export interface ApiVideo {
  video_id: string
  title: string
  video_url: string
  cover_url: string
  duration: number // 秒
  view_count: number
  author: {
    user_id: string
    username: string
    avatar: string
  }
  description: string
  tags: string[]
  published_at: string
  is_liked: boolean
}

// 视频详情接口
export interface VideoDetail extends ApiVideo {
  like_count: number
  comment_count: number
  share_count: number
  is_followed: boolean
  quality_options: Array<{
    quality: string
    url: string
    size: number
  }>
}

// 分页信息接口
export interface Pagination {
  total: number
  page: number
  page_size: number
  total_pages: number
  has_next: boolean
  has_prev: boolean
}

// 视频列表响应接口
export interface VideoListResponse {
  videos: ApiVideo[]
  pagination: Pagination
}

// 视频相关API
export const videoAPI = {
  /**
   * 获取推荐视频列表
   * @param params 请求参数，包含分页信息和用户标签
   * @returns 视频列表
   */
  getRecommendedVideos(params: { page?: number; page_size?: number; request_id?: string; category?: string; user_tags?: string }) {
    const { page = 1, page_size = 20, request_id, category, user_tags } = params
    const urlParams = new URLSearchParams({
      page: page.toString(),
      page_size: page_size.toString()
    })
    if (category) {
      urlParams.append('category', category)
    }
    if (request_id) {
      urlParams.append('request_id', request_id)
    }
    if (user_tags) {
      urlParams.append('user_tags', user_tags)
    }
    
    return http.get<{ data: VideoListResponse }>(`/api/videos/recommended?${urlParams.toString()}`)
  },

  /**
   * 获取热门视频列表
   * @param params 请求参数
   * @returns 视频列表
   */
  getHotVideos(params: { page?: number; page_size?: number; request_id?: string; category?: string }) {
    const { page = 1, page_size = 20, request_id, category } = params
    const urlParams = new URLSearchParams({
      page: page.toString(),
      page_size: page_size.toString()
    })
    if (category) {
      urlParams.append('category', category)
    }
    if (request_id) {
      urlParams.append('request_id', request_id)
    }
    
    return http.get<{ data: VideoListResponse }>(`/api/videos/hot?${urlParams.toString()}`)
  },

  /**
   * 获取热门视频列表（别名）
   * @param page 页码
   * @param pageSize 每页数量
   * @param timeRange 时间范围
   * @param category 分类
   * @returns 视频列表
   */
  getTrendingVideos(page = 1, pageSize = 20, timeRange = 'week', category?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
      time_range: timeRange
    })
    if (category) {
      params.append('category', category)
    }
    
    return http.get<VideoListResponse>(`/api/videos/trending?${params.toString()}`)
  },

  /**
   * 获取视频详情
   * @param videoId 视频ID
   * @param requestId 请求ID
   * @returns 视频详情
   */
  getVideoDetail(videoId: string, requestId?: string) {
    const params = new URLSearchParams()
    if (requestId) {
      params.append('request_id', requestId)
    }
    
    const queryString = params.toString()
    const url = queryString ? `/videos/${videoId}?${queryString}` : `/videos/${videoId}`
    
    return http.get<{ data: { video: VideoDetail; related_videos?: ApiVideo[] } }>(`/api${url}`)
  },

  /**
   * 点赞视频
   * @param videoId 视频ID
   * @returns 操作结果
   */
  likeVideo(videoId: string) {
    return http.post(`/api/videos/${videoId}/like`)
  },

  /**
   * 取消点赞视频
   * @param videoId 视频ID
   * @returns 操作结果
   */
  unlikeVideo(videoId: string) {
    return http.delete(`/api/videos/${videoId}/like`)
  },

  /**
   * 关注用户
   * @param userId 用户ID
   * @returns 操作结果
   */
  followUser(userId: string) {
    return http.post(`/api/users/${userId}/follow`)
  },

  /**
   * 取消关注用户
   * @param userId 用户ID
   * @returns 操作结果
   */
  unfollowUser(userId: string) {
    return http.delete(`/api/users/${userId}/follow`)
  },

  /**
   * 获取相关视频
   * @param videoId 当前视频ID
   * @param limit 返回数量
   * @returns 相关视频列表
   */
  getRelatedVideos(videoId: string, limit = 6) {
    const params = new URLSearchParams({
      limit: limit.toString()
    })
    
    return http.get<{ videos: ApiVideo[] }>(`/api/videos/${videoId}/related?${params.toString()}`)
  }
}

/**
 * 将API视频数据转换为组件使用的格式
 */
export function transformApiVideoToLocal(video: ApiVideo): Video {
  return {
    id: video.video_id,
    title: video.title,
    src: video.video_url,
    poster: video.cover_url,
    duration: formatDuration(video.duration),
    views: formatViewCount(video.view_count),
    author: video.author.username,
    authorAvatar: video.author.avatar,
    description: video.description,
    tags: video.tags,
    publishedAt: formatDate(video.published_at)
  }
}

/**
 * 格式化时长（秒转换为字符串格式）
 */
function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  
  if (minutes === 0) {
    return `0:${remainingSeconds.toString().padStart(2, '0')}`
  } else {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }
}

/**
 * 格式化观看次数
 */
function formatViewCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  } else {
    return count.toString()
  }
}

/**
 * 格式化日期
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return '今天'
  } else if (diffDays === 1) {
    return '昨天'
  } else if (diffDays < 7) {
    return `${diffDays}天前`
  } else {
    return date.toLocaleDateString('zh-CN')
  }
}