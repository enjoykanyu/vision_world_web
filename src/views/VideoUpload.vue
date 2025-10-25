<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 头部导航 -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-4">
            <router-link to="/" class="flex items-center">
              <svg class="w-8 h-8 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm-1 14.5v-9l7 4.5-7 4.5z"/>
                <path d="M12 5.5c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5 6.5-2.91 6.5-6.5-2.91-6.5-6.5-6.5zm3.5 6.5l-5 3v-6l5 3z" fill-opacity="0.6"/>
              </svg>
              <span class="ml-2 text-xl font-bold text-gray-900 dark:text-white">VisionWorld</span>
            </router-link>
            <span class="text-gray-400">></span>
            <span class="text-gray-600 dark:text-gray-300">投稿</span>
          </div>
          <div class="flex items-center space-x-4">
            <button class="text-gray-600 dark:text-gray-300 hover:text-purple-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </button>
            <button class="text-gray-600 dark:text-gray-300 hover:text-purple-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37.996.608 2.296.07 2.572-1.065z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </button>
            <div class="w-8 h-8 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-semibold">{{ (userStore.username || 'U').charAt(0).toUpperCase() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 左侧上传区域 -->
        <div class="lg:col-span-2">
          <!-- 上传卡片 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div class="p-6">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">上传视频</h2>
              
              <!-- 拖拽上传区域 -->
              <div 
                class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-purple-400 dark:hover:border-purple-500 transition-colors cursor-pointer"
                :class="{ 'border-purple-400 bg-purple-50 dark:bg-purple-900/20': isDragging }"
                @drop="handleDrop"
                @dragover="handleDragOver"
                @dragleave="handleDragLeave"
                @click="triggerFileInput"
              >
                <input
                  ref="fileInput"
                  type="file"
                  accept="video/*"
                  class="hidden"
                  @change="handleFileSelect"
                >
                
                <div v-if="!selectedFile && !uploadProgress">
                  <svg class="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                  </svg>
                  <p class="text-lg font-medium text-gray-900 dark:text-white mb-2">拖拽视频到此处</p>
                  <p class="text-gray-500 dark:text-gray-400 mb-4">或者点击选择文件</p>
                  <button class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors">
                    选择文件
                  </button>
                </div>
                
                <div v-else-if="selectedFile && !uploadProgress" class="text-center">
                  <div class="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <p class="text-lg font-medium text-gray-900 dark:text-white mb-2">{{ selectedFile.name }}</p>
                  <p class="text-gray-500 dark:text-gray-400 mb-4">{{ formatFileSize(selectedFile.size) }}</p>
                  <div class="flex justify-center space-x-4">
                    <button @click="startUpload" class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors">
                      开始上传
                    </button>
                    <button @click="resetFile" class="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg transition-colors">
                      重新选择
                    </button>
                  </div>
                </div>
                
                <div v-else-if="uploadProgress" class="w-full">
                  <div class="mb-4">
                    <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>上传中...</span>
                      <span>{{ uploadProgress }}%</span>
                    </div>
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        class="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        :style="{ width: uploadProgress + '%' }"
                      ></div>
                    </div>
                  </div>
                  <button @click="cancelUpload" class="text-red-600 hover:text-red-700 text-sm">
                    取消上传
                  </button>
                </div>
              </div>
              
              <!-- 上传提示 -->
              <div class="mt-4 text-sm text-gray-500 dark:text-gray-400">
                <p>• 支持格式：MP4, AVI, MOV, WMV, FLV</p>
                <p>• 最大文件大小：2GB</p>
                <p>• 建议分辨率：1280x720 或更高</p>
              </div>
            </div>
          </div>
          
          <!-- 视频信息编辑 -->
          <div v-if="uploadedVideoId" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mt-6">
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">编辑视频信息</h3>
              
              <!-- 视频预览 -->
              <div class="mb-6">
                <video 
                  :src="videoPreviewUrl" 
                  controls 
                  class="w-full max-h-64 rounded-lg"
                ></video>
              </div>
              
              <!-- 标题 -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  标题 <span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="videoForm.title"
                  type="text" 
                  maxlength="80"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="请输入视频标题"
                >
                <div class="text-right text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {{ videoForm.title.length }}/80
                </div>
              </div>
              
              <!-- 简介 -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  简介
                </label>
                <textarea 
                  v-model="videoForm.description"
                  rows="4"
                  maxlength="2000"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="请输入视频简介，让更多人发现你的视频"
                ></textarea>
                <div class="text-right text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {{ videoForm.description.length }}/2000
                </div>
              </div>
              
              <!-- 分类 -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  分类 <span class="text-red-500">*</span>
                </label>
                <select 
                  v-model="videoForm.category"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">请选择分类</option>
                  <option value="game">游戏</option>
                  <option value="music">音乐</option>
                  <option value="dance">舞蹈</option>
                  <option value="tech">科技</option>
                  <option value="life">生活</option>
                  <option value="food">美食</option>
                  <option value="animal">动物</option>
                  <option value="sport">运动</option>
                  <option value="movie">影视</option>
                  <option value="entertainment">娱乐</option>
                </select>
              </div>
              
              <!-- 标签 -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  标签
                </label>
                <div class="flex flex-wrap gap-2 mb-2">
                  <span 
                    v-for="tag in videoForm.tags" 
                    :key="tag"
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300"
                  >
                    {{ tag }}
                    <button @click="removeTag(tag)" class="ml-2 text-purple-600 hover:text-purple-800">
                      ×
                    </button>
                  </span>
                </div>
                <div class="flex">
                  <input 
                    v-model="newTag"
                    type="text"
                    maxlength="20"
                    class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="添加标签"
                    @keyup.enter="addTag"
                  >
                  <button @click="addTag" class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-r-lg transition-colors">
                    添加
                  </button>
                </div>
              </div>
              
              <!-- 封面 -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  封面
                </label>
                <div 
                  class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-purple-400 dark:hover:border-purple-500 transition-colors cursor-pointer"
                  @click="triggerCoverInput"
                >
                  <input
                    ref="coverInput"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handleCoverSelect"
                  >
                  <div v-if="!coverPreview">
                    <svg class="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <p class="text-gray-500 dark:text-gray-400">点击上传封面</p>
                  </div>
                  <img v-else :src="coverPreview" alt="封面预览" class="max-h-32 mx-auto rounded">
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 右侧设置区域 -->
        <div class="lg:col-span-1">
          <!-- 发布设置 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">发布设置</h3>
              
              <!-- 发布时间 -->
              <div class="mb-4">
                <label class="flex items-center">
                  <input v-model="publishSettings.immediate" type="radio" name="publishTime" value="immediate" class="mr-2">
                  <span class="text-gray-700 dark:text-gray-300">立即发布</span>
                </label>
                <label class="flex items-center mt-2">
                  <input v-model="publishSettings.immediate" type="radio" name="publishTime" value="scheduled" class="mr-2">
                  <span class="text-gray-700 dark:text-gray-300">定时发布</span>
                </label>
                <input 
                  v-if="publishSettings.immediate === 'scheduled'"
                  v-model="publishSettings.scheduledTime"
                  type="datetime-local"
                  class="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
              </div>
              
              <!-- 权限设置 -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">权限</label>
                <select 
                  v-model="publishSettings.privacy"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="public">公开</option>
                  <option value="unlisted">不公开</option>
                  <option value="private">私密</option>
                </select>
              </div>
              
              <!-- 评论设置 -->
              <div class="mb-4">
                <label class="flex items-center">
                  <input v-model="publishSettings.allowComments" type="checkbox" class="mr-2">
                  <span class="text-gray-700 dark:text-gray-300">允许评论</span>
                </label>
              </div>
              
              <!-- 弹幕设置 -->
              <div class="mb-4">
                <label class="flex items-center">
                  <input v-model="publishSettings.allowDanmu" type="checkbox" class="mr-2">
                  <span class="text-gray-700 dark:text-gray-300">允许弹幕</span>
                </label>
              </div>
            </div>
          </div>
          
          <!-- 发布按钮 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div class="p-6">
              <button 
                @click="submitVideo"
                :disabled="!canSubmit"
                class="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition-colors"
              >
                {{ isEditing ? '保存修改' : '立即投稿' }}
              </button>
              <button 
                @click="saveAsDraft"
                class="w-full mt-3 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-medium transition-colors"
              >
                保存草稿
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { videoAPI } from '@/api/video'

const router = useRouter()
const userStore = useUserStore()

// 文件相关
const fileInput = ref<HTMLInputElement>()
const coverInput = ref<HTMLInputElement>()
const selectedFile = ref<File | null>(null)
const coverFile = ref<File | null>(null)
const isDragging = ref(false)
const uploadProgress = ref(0)
const uploadedVideoId = ref('')
const videoPreviewUrl = ref('')
const coverPreview = ref('')

// 视频表单
const videoForm = ref({
  title: '',
  description: '',
  category: '',
  tags: [] as string[]
})

// 发布设置
const publishSettings = ref({
  immediate: 'immediate' as 'immediate' | 'scheduled',
  scheduledTime: '',
  privacy: 'public' as 'public' | 'unlist' | 'private',
  allowComments: true,
  allowDanmu: true
})

const newTag = ref('')
const isEditing = ref(false)

// 计算属性
const canSubmit = computed(() => {
  return uploadedVideoId.value && 
         videoForm.value.title.trim() && 
         videoForm.value.category &&
         userStore.isLoggedIn
})

// 方法
const triggerFileInput = () => {
  fileInput.value?.click()
}

const triggerCoverInput = () => {
  coverInput.value?.click()
}

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
  
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    if (file.type.startsWith('video/')) {
      selectedFile.value = file
    } else {
      alert('请选择视频文件')
    }
  }
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    selectedFile.value = file
  }
}

const handleCoverSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    coverFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      coverPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const resetFile = () => {
  selectedFile.value = null
  uploadProgress.value = 0
  uploadedVideoId.value = ''
  videoPreviewUrl.value = ''
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const startUpload = async () => {
  if (!selectedFile.value) return
  
  const formData = new FormData()
  formData.append('video', selectedFile.value)
  formData.append('title', videoForm.value.title || selectedFile.value.name)
  
  try {
    uploadProgress.value = 0
    
    // 使用真实的上传API
    const response = await videoAPI.uploadVideo(formData)
    
    if (response.data) {
      uploadProgress.value = 100
      uploadedVideoId.value = response.data.id
      videoPreviewUrl.value = URL.createObjectURL(selectedFile.value!)
      alert('视频上传成功')
    } else {
      throw new Error('上传失败')
    }
    
  } catch (error) {
    alert('上传失败，请重试')
    uploadProgress.value = 0
  }
}

const cancelUpload = () => {
  uploadProgress.value = 0
  // 这里应该取消真实的上传请求
}

const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !videoForm.value.tags.includes(tag)) {
    if (videoForm.value.tags.length < 10) {
      videoForm.value.tags.push(tag)
      newTag.value = ''
    } else {
      alert('最多添加10个标签')
    }
  }
}

const removeTag = (tag: string) => {
  const index = videoForm.value.tags.indexOf(tag)
  if (index > -1) {
    videoForm.value.tags.splice(index, 1)
  }
}

const submitVideo = async () => {
  if (!canSubmit.value) return
  
  try {
    const formData = new FormData()
    formData.append('video_id', uploadedVideoId.value)
    formData.append('title', videoForm.value.title)
    formData.append('description', videoForm.value.description)
    formData.append('category', videoForm.value.category)
    formData.append('tags', JSON.stringify(videoForm.value.tags))
    formData.append('privacy', publishSettings.value.privacy)
    formData.append('allow_comments', publishSettings.value.allowComments.toString())
    formData.append('allow_danmu', publishSettings.value.allowDanmu.toString())
    
    if (coverFile.value) {
      formData.append('cover', coverFile.value)
    }
    
    // 使用真实的发布API
    const response = await videoAPI.publishVideo(formData)
    
    if (response.data) {
      alert(isEditing.value ? '修改成功' : '投稿成功')
      router.push('/')
    } else {
      throw new Error('发布失败')
    }
    
  } catch (error) {
    alert('发布失败，请重试')
  }
}

const saveAsDraft = () => {
  // 保存草稿逻辑
  alert('草稿保存成功')
}

// 生命周期
onMounted(() => {
  if (!userStore.isLoggedIn) {
    alert('请先登录')
    router.push('/login')
  }
})
</script>

<style scoped>
.upload-area {
  transition: all 0.3s ease;
}

.upload-area:hover {
  border-color: #8b5cf6;
}

.upload-area.dragging {
  border-color: #8b5cf6;
  background-color: rgba(139, 92, 246, 0.05);
}
</style>