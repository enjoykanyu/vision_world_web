<template>
  <div class="comment-section mt-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
    <!-- 评论标题和总数 -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
        <i class="fas fa-comments mr-2 text-bilibili-pink"></i>
        评论
        <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">({{ commentTotal }})</span>
      </h3>
      
      <!-- 排序选项 -->
      <div class="flex space-x-4">
        <button 
          v-for="sortOption in sortOptions" 
          :key="sortOption.value"
          @click="handleSortChange(sortOption.value)"
          class="text-sm font-medium"
          :class="sortBy === sortOption.value ? 'text-bilibili-pink' : 'text-gray-600 dark:text-gray-300'"
        >
          {{ sortOption.label }}
        </button>
      </div>
    </div>

    <!-- 评论输入区 -->
    <div class="flex items-start space-x-3 mb-6">
      <!-- 用户头像 -->
      <div class="relative flex-shrink-0">
        <img 
          v-if="userAvatar" 
          :src="userAvatar" 
          alt="用户头像" 
          class="w-10 h-10 rounded-full object-cover"
        >
        <div v-else class="w-10 h-10 bg-gradient-to-br from-bilibili-pink to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {{ getUserInitials() }}
        </div>
      </div>
      
      <!-- 输入框和按钮 -->
      <div class="flex-1">
        <div class="relative">
          <textarea
            v-model="commentContent"
            placeholder="发个友善的评论见证当下"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-bilibili-pink focus:border-transparent min-h-[80px] dark:bg-gray-700 dark:text-white"
            @keydown.enter.ctrl="submitComment"
          ></textarea>
          
          <!-- 功能按钮 -->
          <div class="absolute bottom-2 right-2 flex space-x-2">
            <button class="text-gray-500">
              <i class="fas fa-smile"></i>
            </button>
            <button class="text-gray-500">
              <i class="fas fa-at"></i>
            </button>
          </div>
        </div>
        
        <!-- 发布按钮 -->
        <div class="flex items-center justify-between mt-3">
          <div class="flex space-x-2">
            <button class="px-3 py-1 text-sm text-gray-500 dark:text-gray-400 rounded-md">
              <i class="fas fa-smile mr-1"></i> 表情
            </button>
            <button class="px-3 py-1 text-sm text-gray-500 dark:text-gray-400 rounded-md">
              <i class="fas fa-at mr-1"></i> @TA
            </button>
          </div>
          <button
            @click="submitComment"
            :disabled="!commentContent.trim() || isSubmitting"
            class="bg-bilibili-pink text-white px-4 py-2 rounded-md text-sm font-medium disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            发布评论
          </button>
        </div>
      </div>
    </div>

    <!-- 评论列表 -->
    <div 
      class="space-y-4" 
      ref="commentsContainer"
    >
      <!-- 评论项 -->
      <div v-for="comment in comments" :key="comment.id" class="comment-item bg-white dark:bg-gray-900 rounded-lg p-4">
        <!-- 评论头部 -->
        <div class="flex space-x-3">
          <!-- 评论用户头像 -->
          <div class="relative flex-shrink-0">
            <img 
              :src="comment.user?.avatar ?? 'https://i0.hdslb.com/bfs/face/member/noface.jpg@160w_160h_1c_1s.jpg'" 
              alt="用户头像" 
              class="w-10 h-10 rounded-full object-cover"
            >
          </div>
          
          <!-- 评论内容区域 -->
          <div class="flex-1 min-w-0">
            <!-- 用户名和等级 -->
            <div class="flex items-center flex-wrap gap-2 mb-1">
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ comment.user?.name ?? '匿名用户' }}</span>
              <!-- 等级标识 -->
              <span class="px-1.5 py-0.5 text-xs rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium">LV{{ comment.user?.level || 5 }}</span>
            </div>
            
            <!-- 评论内容 -->
            <div class="text-sm text-gray-800 dark:text-gray-200 mb-2 leading-relaxed whitespace-pre-wrap break-words">
              <template v-if="comment.reply_to_user">
                <span class="text-gray-500 dark:text-gray-400">回复</span>
                <span class="text-bilibili-pink mx-1">@{{ comment.reply_to_user.name || '用户' }}</span>
                <span class="text-gray-500 dark:text-gray-400">:</span>
              </template>
              <span>{{ comment.content || '无评论内容' }}</span>
            </div>
            
            <!-- 时间和互动按钮 -->
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-400 dark:text-gray-500">{{ formatDateTime(comment.create_time) }}</span>
              
              <div class="flex items-center space-x-4">
                <!-- 点赞 -->
                <button 
                  @click="handleLikeComment(comment)"
                  class="flex items-center space-x-1 text-xs text-gray-400"
                  :class="comment.is_liked ? 'text-bilibili-pink' : ''"
                >
                  <i :class="comment.is_liked ? 'fas fa-thumbs-up' : 'far fa-thumbs-up'"></i>
                  <span>{{ comment.like_count || 0 }}</span>
                </button>
                
                <!-- 点踩 -->
                <button class="text-xs text-gray-400">
                  <i class="far fa-thumbs-down"></i>
                </button>
                
                <!-- 回复 -->
                <button 
                  @click="toggleReplyInput(comment)"
                  class="text-xs text-gray-400"
                >
                  {{ comment.reply_count || 0 }}
                </button>
              </div>
            </div>
            
            <!-- 回复输入框 -->
            <div v-if="replyCommentId === comment.id" class="mt-3">
              <div class="flex items-start space-x-3">
                <img 
                  v-if="userAvatar" 
                  :src="userAvatar" 
                  alt="用户头像" 
                  class="w-8 h-8 rounded-full object-cover flex-shrink-0"
                >
                <div v-else class="w-8 h-8 bg-gradient-to-br from-bilibili-pink to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                  {{ getUserInitials() }}
                </div>
                <div class="flex-1">
                  <textarea
                    v-model="replyContent"
                    placeholder="回复这条评论..."
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-bilibili-pink focus:border-transparent min-h-[60px] dark:bg-gray-700 dark:text-white"
                    @keydown.enter.ctrl="submitReply(comment)"
                  ></textarea>
                  <div class="flex items-center justify-end mt-2">
                    <button
                      @click="cancelReply"
                      class="mr-2 px-3 py-1 text-sm text-gray-500 dark:text-gray-400 rounded-md"
                    >
                      取消
                    </button>
                    <button
                      @click="submitReply(comment)"
                      :disabled="!replyContent.trim() || isSubmitting"
                      class="bg-bilibili-pink text-white px-4 py-1 text-sm font-medium rounded-md disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                      回复
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 二级评论（回复） -->
            <div v-if="comment.replies && comment.replies.length > 0" class="mt-3">
              <!-- 折叠状态：显示回复摘要和展开按钮 -->
              <div v-if="!isRepliesExpanded(comment.id)" class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <button 
                  @click="toggleRepliesExpand(comment.id)"
                  class="flex items-center"
                >
                  <span>共{{ comment.reply_count || comment.replies.length }}条回复，点击查看</span>
                  <i class="fas fa-chevron-down ml-1 text-xs"></i>
                </button>
              </div>
              
              <!-- 展开状态：显示回复列表 -->
              <div v-else class="bg-white dark:bg-gray-900 rounded-lg p-4 space-y-4">
                <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
                  <div class="flex items-start space-x-3">
                    <img 
                      :src="reply.user?.avatar ?? 'https://i0.hdslb.com/bfs/face/member/noface.jpg@160w_160h_1c_1s.jpg'" 
                      alt="用户头像" 
                      class="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    >
                    
                    <div class="flex-1 min-w-0">
                      <!-- 用户名和等级 -->
                      <div class="flex items-center flex-wrap gap-2 mb-1">
                        <span class="text-sm font-medium text-gray-900 dark:text-white">{{ reply.user?.name ?? '匿名用户' }}</span>
                        <!-- 等级标识 -->
                        <span class="px-1.5 py-0.5 text-xs rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium">LV{{ reply.user?.level || 5 }}</span>
                      </div>
                      
                      <!-- 回复内容 -->
                      <div class="text-sm text-gray-800 dark:text-gray-200 mb-2 leading-relaxed">
                        <template v-if="reply.reply_to_user">
                          <span class="text-gray-500 dark:text-gray-400">回复</span>
                          <span class="text-bilibili-pink mx-1">@{{ reply.reply_to_user.name || '用户' }}</span>
                          <span class="text-gray-500 dark:text-gray-400">:</span>
                        </template>
                        <span class="whitespace-pre-wrap break-words">{{ reply.content }}</span>
                      </div>
                      
                      <!-- 时间和互动按钮 -->
                      <div class="flex items-center justify-between">
                        <span class="text-xs text-gray-400 dark:text-gray-500">{{ formatDateTime(reply.create_time) }}</span>
                        
                        <div class="flex items-center space-x-4">
                          <!-- 点赞 -->
                          <button 
                            @click="handleLikeComment(reply)"
                            class="flex items-center space-x-1 text-xs text-gray-400"
                            :class="reply.is_liked ? 'text-bilibili-pink' : ''"
                          >
                            <i :class="reply.is_liked ? 'fas fa-thumbs-up' : 'far fa-thumbs-up'"></i>
                            <span>{{ reply.like_count || 0 }}</span>
                          </button>
                          
                          <!-- 点踩 -->
                          <button class="text-xs text-gray-400">
                            <i class="far fa-thumbs-down"></i>
                          </button>
                          
                          <!-- 回复 -->
                          <button 
                            @click="toggleReplyInput(comment, reply)"
                            class="text-xs text-gray-400"
                          >
                            回复
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- 分页和收起按钮 -->
                <div class="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <!-- 分页 -->
                  <div class="flex items-center space-x-1 text-sm">
                    <span class="text-gray-500 dark:text-gray-400">共{{ Math.ceil((comment.reply_count || comment.replies.length) / 10) }}页</span>
                    <button 
                      v-for="page in Math.min(7, Math.ceil((comment.reply_count || comment.replies.length) / 10))" 
                      :key="page"
                      @click="loadRepliesByPage(comment, page)"
                      class="px-2 py-0.5 rounded"
                      :class="replyPageMap.get(comment.id) === page ? 'text-bilibili-pink font-medium' : 'text-gray-500'"
                    >
                      {{ page }}
                    </button>
                    <button 
                      v-if="Math.ceil((comment.reply_count || comment.replies.length) / 10) > 7"
                      class="text-gray-500"
                    >
                      ...
                    </button>
                    <button 
                      v-if="Math.ceil((comment.reply_count || comment.replies.length) / 10) > 7"
                      class="text-gray-500"
                    >
                      下一页
                    </button>
                  </div>
                  
                  <!-- 收起按钮 -->
                  <button 
                    @click="toggleRepliesExpand(comment.id)"
                    class="text-sm text-gray-500"
                  >
                    收起
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 加载更多提示 -->
      <div v-if="isLoading" class="flex justify-center py-4">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-bilibili-pink"></div>
      </div>
      
      <div v-else-if="hasMoreComments && comments.length > 0" class="flex justify-center py-4">
        <button 
          @click="loadMoreComments"
          class="px-4 py-2 bg-bilibili-pink text-white rounded-md text-sm font-medium"
        >
          加载更多评论
        </button>
      </div>
      
      <div v-else-if="!hasMoreComments && comments.length > 0" class="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
        没有更多评论了
      </div>
      
      <div v-else-if="comments.length === 0" class="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
        还没有评论，快来抢沙发吧
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useVideoStore } from '@/stores/videoStore'

// Props
const props = defineProps<{
  videoId: string
}>()

// Stores
const userStore = useUserStore()
const videoStore = useVideoStore()

// 评论状态
const comments = ref<any[]>([])
const commentTotal = ref(0)
const commentContent = ref('')
const isLoading = ref(false)
const isSubmitting = ref(false)
const hasMoreComments = ref(true)
const currentPage = ref(1)
const pageSize = ref(10)
const commentsContainer = ref<HTMLElement | null>(null)

// 排序选项
const sortBy = ref('hot')
const sortOptions = [
  { label: '最热', value: 'hot' },
  { label: '最新', value: 'time_desc' }
]

// 回复相关状态
const replyCommentId = ref(0)
const replyContent = ref('')
const replyToUser = ref<any>(null)

// 回复折叠/展开状态
const expandedReplies = ref<Set<number>>(new Set())

// 回复分页状态
const replyPageMap = ref<Map<number, number>>(new Map())

// 检查回复是否展开
const isRepliesExpanded = (commentId: number): boolean => {
  return expandedReplies.value.has(commentId)
}

// 切换回复展开/折叠状态
const toggleRepliesExpand = (commentId: number) => {
  if (expandedReplies.value.has(commentId)) {
    expandedReplies.value.delete(commentId)
  } else {
    expandedReplies.value.add(commentId)
    // 默认加载第一页
    if (!replyPageMap.value.has(commentId)) {
      replyPageMap.value.set(commentId, 1)
    }
  }
}

// 按页加载回复
const loadRepliesByPage = async (comment: any, page: number) => {
  replyPageMap.value.set(comment.id, page)
  try {
    const result = await videoStore.getCommentReplies({
      commentId: comment.id,
      page,
      pageSize: 10
    })
    
    if (result.status_code === 0) {
      comment.replies = result.replies || []
    }
  } catch (error) {
    console.error('加载回复失败:', error)
  }
}

// 计算属性
const userAvatar = computed(() => userStore.avatar)

// 格式化时间
const formatTime = (timestamp: number) => {
  const now = Date.now() / 1000
  const diff = now - timestamp
  
  if (diff < 60) {
    return '刚刚'
  } else if (diff < 3600) {
    return `${Math.floor(diff / 60)}分钟前`
  } else if (diff < 86400) {
    return `${Math.floor(diff / 3600)}小时前`
  } else if (diff < 2592000) {
    return `${Math.floor(diff / 86400)}天前`
  } else {
    const date = new Date(timestamp * 1000)
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }
}

// 格式化日期为具体日期时间（用于回复）
const formatDateTime = (timestamp: number | string) => {
  console.log('formatDateTime called with:', timestamp, 'type:', typeof timestamp)
  
  if (!timestamp) {
    console.log('timestamp is empty, returning empty string')
    return ''
  }
  
  // 处理字符串类型的时间戳
  const ts = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp
  console.log('parsed timestamp:', ts)
  
  // 判断是秒还是毫秒（大于 1e10 认为是毫秒）
  const timestampMs = ts > 10000000000 ? ts : ts * 1000
  console.log('timestampMs:', timestampMs)
  
  const date = new Date(timestampMs)
  console.log('date object:', date)
  
  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    console.warn('Invalid date:', timestamp)
    return String(timestamp)
  }
  
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const result = `${year}-${month}-${day} ${hours}:${minutes}`
  console.log('formatted result:', result)
  return result
}

// 获取回复的创建时间（兼容 create_time 和 createTime 字段）
const getReplyCreateTime = (reply: any): number | string => {
  return reply.create_time || reply.createTime || 0
}

// 获取用户首字母
const getUserInitials = () => {
  const username = userStore.username || '用户'
  return username.charAt(0).toUpperCase()
}

// 获取评论列表
const fetchComments = async (reset = false) => {
  if (isLoading.value) return
  
  isLoading.value = true
  try {
    const page = reset ? 1 : currentPage.value
    
    // 调用视频服务获取评论
    const result = await videoStore.getVideoComments({
      videoId: props.videoId,
      page,
      pageSize: pageSize.value,
      sortOrder: sortBy.value
    })
    
    console.log('获取评论结果:', result)
    
    if (result.status_code === 0) {
      // 处理user为null的情况
      const processedComments = (result.comments || []).map(comment => ({
        ...comment,
        user: comment.user || { username: '匿名用户', avatar: '' }
      }))
      
      if (reset) {
        comments.value = processedComments
        currentPage.value = 1
      } else {
        comments.value = [...comments.value, ...processedComments]
      }
      
      commentTotal.value = result.total || 0
      hasMoreComments.value = result.has_more || false
      
      console.log('处理后的评论:', comments.value)
    }
  } catch (error) {
    console.error('获取评论失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 加载更多评论
const loadMoreComments = () => {
  if (hasMoreComments.value && !isLoading.value) {
    currentPage.value++
    fetchComments()
  }
}

// 发布评论
const submitComment = async () => {
  if (!commentContent.value.trim()) return
  
  // 检查用户是否已登录
  if (!userStore.isAuthenticated) {
    // 未登录，触发登录弹窗
    window.dispatchEvent(new CustomEvent('show-login-modal'))
    return
  }
  
  isSubmitting.value = true
  try {
    const result = await videoStore.commentVideo({
      videoId: props.videoId,
      content: commentContent.value.trim()
    })
    
    if (result.status_code === 0) {
      // 清空输入框
      commentContent.value = ''
      
      // 刷新评论列表
      await fetchComments(true)
    }
  } catch (error) {
    console.error('发布评论失败:', error)
  } finally {
    isSubmitting.value = false
  }
}

// 点赞评论
const handleLikeComment = async (comment: any) => {
  try {
    // 检查用户是否已登录
    if (!userStore.isAuthenticated) {
      window.dispatchEvent(new CustomEvent('show-login-modal'))
      return
    }
    
    // 调用点赞API
    const result = await videoStore.likeComment({
      commentId: comment.id,
      actionType: !comment.is_liked
    })
    
    if (result.status_code === 0) {
      // 更新本地状态
      comment.is_liked = !comment.is_liked
      comment.like_count += comment.is_liked ? 1 : -1
    }
  } catch (error) {
    console.error('点赞评论失败:', error)
  }
}

// 切换回复输入框
const toggleReplyInput = (comment: any, reply?: any) => {
  replyCommentId.value = comment.id
  if (reply) {
    replyToUser.value = reply
    replyContent.value = `@${reply.user?.name || '用户'} `
  } else {
    replyToUser.value = null
    replyContent.value = ''
  }
}

// 提交回复
const submitReply = async (comment: any) => {
  if (!replyContent.value.trim()) return
  
  // 检查用户是否已登录
  if (!userStore.isAuthenticated) {
    window.dispatchEvent(new CustomEvent('show-login-modal'))
    return
  }
  
  isSubmitting.value = true
  try {
    const result = await videoStore.replyComment({
      commentId: comment.id,
      content: replyContent.value.trim(),
      replyToUserId: replyToUser.value?.id || 0
    })
    
    if (result.status_code === 0) {
      // 清空输入框
      replyContent.value = ''
      replyCommentId.value = 0
      replyToUser.value = null
      
      // 刷新评论列表
      await fetchComments(true)
    }
  } catch (error) {
    console.error('回复评论失败:', error)
  } finally {
    isSubmitting.value = false
  }
}

// 取消回复
const cancelReply = () => {
  replyCommentId.value = 0
  replyContent.value = ''
  replyToUser.value = null
}

// 加载更多回复
const loadMoreReplies = async (comment: any) => {
  try {
    const result = await videoStore.getCommentReplies({
      commentId: comment.id,
      page: 1,
      pageSize: 10
    })
    
    if (result.status_code === 0) {
      // 更新评论的回复列表
      comment.replies = [...(comment.replies || []), ...(result.replies || [])]
    }
  } catch (error) {
    console.error('加载更多回复失败:', error)
  }
}

// 切换排序
const handleSortChange = (sortValue: string) => {
  if (sortBy.value !== sortValue) {
    sortBy.value = sortValue
    fetchComments(true)
  }
}

// 初始化
onMounted(() => {
  fetchComments(true)
})
</script>

<style scoped>
.comment-section {
}

.comment-item {
  padding: 12px 0;
  border-bottom: 1px solid transparent;
}

.reply-item {
  padding: 8px 0;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

.dark ::-webkit-scrollbar-track {
  background: #333;
}

.dark ::-webkit-scrollbar-thumb {
  background: #666;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #888;
}
</style>
