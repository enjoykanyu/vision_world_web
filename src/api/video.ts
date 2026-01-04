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
  type?: string // 视频类型: original/repost
  source?: string // 转载来源
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
  total_size?: number // 视频总大小（字节）
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
    const url = queryString ? `/video/${videoId}?${queryString}` : `/video/${videoId}`
    
    return http.get<{ data: { video: VideoDetail; related_videos?: ApiVideo[] } }>(`/api${url}`)
  },

  /**
   * 获取视频分片
   * @param videoId 视频ID
   * @param start 起始字节
   * @param end 结束字节
   * @returns 视频分片数据
   */
  getVideoChunk(videoId: string, start: number, end: number) {
    return http.get(`/api/video/${videoId}/chunk`, {
      headers: {
        Range: `bytes=${start}-${end}`
      },
      responseType: 'arraybuffer'
    })
  },

  /**
   * 点赞/取消点赞视频
   * @param videoId 视频ID
   * @param isLike 是否点赞
   * @returns 操作结果
   */
  likeVideo(videoId: string, isLike = true) {
    return http.post(`/api/videos/${videoId}/like`, { action_type: isLike })
  },

  /**
   * 获取分类视频列表
   * @param category 分类名称
   * @param params 请求参数
   * @returns 视频列表
   */
  getCategoryVideos(category: string, params: { page?: number; page_size?: number; request_id?: string } = {}) {
    const { page = 1, page_size = 20, request_id } = params
    const urlParams = new URLSearchParams({
      page: page.toString(),
      page_size: page_size.toString()
    })
    if (request_id) {
      urlParams.append('request_id', request_id)
    }
    
    return http.get<{ data: VideoListResponse }>(`/api/videos/category/${category}?${urlParams.toString()}`)
  },

  /**
   * 搜索视频
   * @param keyword 搜索关键词
   * @param params 请求参数
   * @returns 视频列表
   */
  searchVideos(keyword: string, params: { page?: number; page_size?: number; request_id?: string } = {}) {
    const { page = 1, page_size = 20, request_id } = params
    const urlParams = new URLSearchParams({
      keyword,
      page: page.toString(),
      page_size: page_size.toString()
    })
    if (request_id) {
      urlParams.append('request_id', request_id)
    }
    
    return http.get<{ data: VideoListResponse }>(`/api/videos/search?${urlParams.toString()}`)
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
  },

  /**
   * 上传视频
   * @param formData 包含视频文件的 FormData
   * @returns 上传结果
   */
  uploadVideo(formData: FormData, options?: any) {
    return http.post('/api/video/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      ...options
    })
  },

  /**
   * 发布视频
   * @param formData 包含视频信息的 FormData
   * @returns 发布结果
   */
  publishVideo(formData: FormData) {
    return http.post<{ data: Video }>('/api/video/publish', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  /**
   * 获取用户发布的视频列表
   * @param params 请求参数，包含分页信息
   * @returns 用户发布的视频列表
   */
  getUserPublishedVideos(params: { page?: number; page_size?: number }) {
    const { page = 1, page_size = 10 } = params
    return http.get<{ 
      status_code: number; 
      status_msg: string; 
      videos: ApiVideo[]; 
      total: number; 
      has_more: boolean 
    }>(`/api/video/user/published?page=${page}&page_size=${page_size}`)
  },

  /**
   * 获取视频评论列表
   * @param params 请求参数，包含视频ID、分页信息和排序方式
   * @returns 评论列表
   */
  getVideoComments(params: { 
    video_id: string; 
    page?: number; 
    page_size?: number; 
    sort_order?: string;
  }) {
    const { video_id, page = 1, page_size = 10, sort_order = 'hot' } = params
    const url = `/api/video/comments?video_id=${Number(video_id)}&page=${page}&page_size=${page_size}&sort_order=${sort_order}`
    return http.get<{ 
      status_code: number; 
      status_msg: string; 
      comments: any[]; 
      total: number; 
      has_more: boolean 
    }>(url)
  },

  /**
   * 发布评论
   * @param params 请求参数，包含视频ID、评论内容和父评论ID（可选）
   * @returns 评论结果
   */
  commentVideo(params: { 
    video_id: string; 
    content: string; 
    parent_id?: number;
    reply_to_user_id?: number;
  }) {
    return http.post<{ 
      status_code: number; 
      status_msg: string; 
      comment: any 
    }>('/api/video/comment', params)
  },

  /**
   * 点赞/取消点赞评论
   * @param params 请求参数，包含评论ID和操作类型
   * @returns 操作结果
   */
  likeComment(params: { 
    comment_id: number; 
    action_type: boolean; // true为点赞，false为取消点赞
  }) {
    return http.post<{ 
      status_code: number; 
      status_msg: string; 
      like_count: number; 
      is_liked: boolean 
    }>('/api/video/comment/like', params)
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