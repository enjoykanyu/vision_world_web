import { http } from '@/utils/request'
import { authAPI } from './auth'
import { videoAPI, transformApiVideoToLocal } from './video'

// 首页轮播图数据接口
export interface CarouselSlide {
  id: number
  title: string
  subtitle: string
  image: string
  link?: string
}

// 首页分类标签接口
export interface Category {
  id: number
  name: string
  icon?: string
}

// 首页数据响应接口
export interface HomeDataResponse {
  carousels: CarouselSlide[]
  categories: Category[]
  recommendedVideos: any[]
  hotVideos: any[]
  personalizedVideos?: any[]
}

// 首页API服务
export const homeAPI = {
  /**
   * 获取首页数据
   * @param params 请求参数
   * @returns 首页数据
   */
  async getHomeData(params?: { 
    page?: number; 
    page_size?: number; 
    category?: string;
    user_tags?: string;
    token?: string;
  }) {
    try {
      const { page = 1, page_size = 10, category, user_tags, token } = params || {}
      
      // 并行请求多个接口
      const [carouselsResponse, categoriesResponse, videosResponse] = await Promise.all([
        // 获取轮播图数据
        homeAPI.getCarouselSlides(),
        // 获取分类标签
        homeAPI.getCategories(),
        // 获取推荐视频
        videoAPI.getRecommendedVideos({ page, page_size, category, user_tags }),
      ])
      
      // 处理响应数据
      const result: HomeDataResponse = {
        carousels: carouselsResponse || [],
        categories: categoriesResponse || [],
        recommendedVideos: videosResponse?.data?.videos ? transformApiVideoToLocal(videosResponse.data.videos) : [],
        hotVideos: [],
        personalizedVideos: undefined
      }
      
      // 如果用户已登录，添加个性化推荐请求
      if (token) {
        const [personalizedResponse, followResponse] = await Promise.all([
          // 获取个性化推荐视频
          homeAPI.getPersonalizedVideos({ page, page_size, token }),
          // 获取关注用户的视频
          homeAPI.getFollowVideos({ page, page_size, token })
        ])
        
        result.personalizedVideos = personalizedResponse?.data?.videos ? transformApiVideoToLocal(personalizedResponse.data.videos) : []
        result.hotVideos = followResponse?.data?.videos ? transformApiVideoToLocal(followResponse.data.videos) : []
      } else {
        // 未登录用户获取热门视频
        const hotVideosResponse = await videoAPI.getHotVideos({ page, page_size, category })
        result.hotVideos = hotVideosResponse?.data?.videos ? transformApiVideoToLocal(hotVideosResponse.data.videos) : []
      }
      
      return {
        status_code: 0,
        status_msg: 'success',
        data: result
      }
    } catch (error) {
      console.error('获取首页数据失败:', error)
      return {
        status_code: -1,
        status_msg: '获取首页数据失败',
        data: null
      }
    }
  },
  
  /**
   * 获取轮播图数据
   * @returns 轮播图数据
   */
  async getCarouselSlides(): Promise<CarouselSlide[]> {
    try {
      // 实际项目中应该从API获取
      // const response = await http.get<{ data: CarouselSlide[] }>('/api/home/carousels')
      // return response.data.data
      
      // 这里使用模拟数据
      return [
        {
          id: 1,
          title: '探索宇宙的奥秘',
          subtitle: '跟随NASA最新探测器，揭开太阳系外行星的神秘面纱',
          image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80',
          link: '/explore/space'
        },
        {
          id: 2,
          title: '2025全球科技峰会',
          subtitle: '直播全球顶尖科技公司的最新产品发布会',
          image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
          link: '/events/tech-summit-2025'
        },
        {
          id: 3,
          title: '自然纪录片：深海探秘',
          subtitle: '潜入海洋最深处，探索未知的海底世界',
          image: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&w=800&q=80',
          link: '/documentaries/deep-sea'
        }
      ]
    } catch (error) {
      console.error('获取轮播图数据失败:', error)
      return []
    }
  },
  
  /**
   * 获取分类标签
   * @returns 分类标签数据
   */
  async getCategories(): Promise<Category[]> {
    try {
      // 实际项目中应该从API获取
      // const response = await http.get<{ data: Category[] }>('/api/home/categories')
      // return response.data.data
      
      // 这里使用模拟数据
      return [
        { id: 1, name: '推荐' },
        { id: 2, name: '动画' },
        { id: 3, name: '番剧' },
        { id: 4, name: '国创' },
        { id: 5, name: '音乐' },
        { id: 6, name: '舞蹈' },
        { id: 7, name: '游戏' },
        { id: 8, name: '知识' },
        { id: 9, name: '科技' },
        { id: 10, name: '运动' },
        { id: 11, name: '汽车' },
        { id: 12, name: '生活' }
      ]
    } catch (error) {
      console.error('获取分类标签失败:', error)
      return []
    }
  },
  
  /**
   * 获取个性化推荐视频
   * @param params 请求参数
   * @returns 个性化推荐视频
   */
  async getPersonalizedVideos(params: { 
    page: number; 
    page_size: number; 
    token: string;
  }) {
    try {
      const { page, page_size, token } = params
      
      // 实际项目中应该从API获取
      // const response = await http.get(`/api/videos/personalized?page=${page}&page_size=${page_size}`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // })
      // return response.data
      
      // 这里使用模拟数据
      return {
        status_code: 0,
        status_msg: 'success',
        data: {
          videos: [],
          pagination: {
            total: 0,
            page,
            page_size,
            total_pages: 0,
            has_next: false,
            has_prev: false
          }
        }
      }
    } catch (error) {
      console.error('获取个性化推荐视频失败:', error)
      return {
        status_code: -1,
        status_msg: '获取个性化推荐视频失败',
        data: null
      }
    }
  },
  
  /**
   * 获取关注用户的视频
   * @param params 请求参数
   * @returns 关注用户的视频
   */
  async getFollowVideos(params: { 
    page: number; 
    page_size: number; 
    token: string;
  }) {
    try {
      const { page, page_size, token } = params
      
      // 实际项目中应该从API获取
      // const response = await http.get(`/api/videos/follow?page=${page}&page_size=${page_size}`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // })
      // return response.data
      
      // 这里使用模拟数据
      return {
        status_code: 0,
        status_msg: 'success',
        data: {
          videos: [],
          pagination: {
            total: 0,
            page,
            page_size,
            total_pages: 0,
            has_next: false,
            has_prev: false
          }
        }
      }
    } catch (error) {
      console.error('获取关注用户视频失败:', error)
      return {
        status_code: -1,
        status_msg: '获取关注用户视频失败',
        data: null
      }
    }
  },
  
  /**
   * 转换视频响应数据为组件使用的格式
   * @param response API响应数据
   * @returns 转换后的视频数据
   */
  transformVideoResponse(response: any): any[] {
    try {
      if (!response || !response.data) return []
      
      // 处理不同的响应格式
      let videos: any[] = []
      if (response.data.data && response.data.data.videos) {
        videos = response.data.data.videos
      } else if (response.data.videos) {
        videos = response.data.videos
      }
      
      // 转换为组件使用的格式
      return videos.map((video: any) => transformApiVideoToLocal(video))
    } catch (error) {
      console.error('转换视频数据失败:', error)
      return []
    }
  }
}