<template>
  <div class="min-h-screen bg-gray-900 text-gray-200">
    <!-- 导航头 -->
    <NavHeader 
      :isLoggedIn="userStore.isLoggedIn" 
      :username="userStore.username" 
      @login="showLoginModal = true"
      @toggleDarkMode="toggleDarkMode"
      :is-dark-mode-prop="true"
    />

    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">开播设置</h1>
        <p class="text-gray-400">配置你的直播间，开始精彩的直播之旅</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 左侧：预览区域 -->
        <div class="lg:col-span-2">
          <div class="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 class="text-xl font-semibold text-white mb-4">直播预览</h2>
            <div class="relative aspect-video bg-black rounded-lg overflow-hidden">
              <!-- 摄像头预览 -->
              <video 
                ref="videoPreview" 
                class="w-full h-full object-cover"
                :class="{ 'opacity-50': !cameraEnabled }"
                autoplay 
                muted
              ></video>
              
              <!-- 场景涂层 -->
              <div 
                v-if="selectedScene" 
                class="absolute inset-0 pointer-events-none"
                :style="{ 
                  backgroundImage: `url(${selectedScene.overlay})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: overlayOpacity / 100
                }"
              ></div>

              <!-- 添加的媒体元素 -->
              <div 
                v-for="media in addedMedia" 
                :key="media.id"
                class="absolute cursor-move border-2 border-transparent hover:border-blue-400 group"
                :class="{ 'border-blue-500': selectedMediaId === media.id }"
                :style="{
                  left: media.x + '%',
                  top: media.y + '%',
                  width: media.width + '%',
                  height: media.height + '%'
                }"
                @mousedown="startDrag($event, media)"
                @click="selectMedia(media.id)"
              >
                <img 
                  v-if="media.type === 'image'" 
                  :src="media.url" 
                  class="w-full h-full object-cover rounded pointer-events-none"
                  :style="{ opacity: media.opacity / 100 }"
                />
                <video 
                  v-if="media.type === 'video'" 
                  :src="media.url" 
                  class="w-full h-full object-cover rounded pointer-events-none"
                  :style="{ opacity: media.opacity / 100 }"
                  autoplay 
                  loop 
                  muted
                />
                
                <!-- 调整大小控制点 -->
                <div 
                  v-if="selectedMediaId === media.id"
                  class="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-se-resize"
                  @mousedown.stop="startResize($event, media)"
                ></div>
                
                <!-- 删除按钮 -->
                <button 
                  v-if="selectedMediaId === media.id"
                  @click.stop="removeMedia(media.id)"
                  class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
              </div>

              <!-- 摄像头未启用提示 -->
              <div v-if="!cameraEnabled" class="absolute inset-0 flex items-center justify-center bg-black/50">
                <div class="text-center">
                  <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                  <p class="text-gray-400">摄像头未启用</p>
                </div>
              </div>
            </div>

            <!-- 预览控制 -->
            <div class="flex justify-between items-center mt-4">
              <div class="flex space-x-4">
                <button 
                  @click="toggleCamera"
                  :class="cameraEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'"
                  class="px-4 py-2 rounded-lg text-white font-medium transition-colors"
                >
                  {{ cameraEnabled ? '关闭摄像头' : '启用摄像头' }}
                </button>
                <button 
                  @click="toggleMicrophone"
                  :class="microphoneEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'"
                  class="px-4 py-2 rounded-lg text-white font-medium transition-colors"
                >
                  {{ microphoneEnabled ? '关闭麦克风' : '启用麦克风' }}
                </button>
              </div>
              <button 
                @click="startStreaming"
                class="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 px-6 py-2 rounded-lg text-white font-semibold transition-all duration-300 shadow-lg"
              >
                开始直播
              </button>
            </div>
          </div>
        </div>

        <!-- 右侧：设置面板 -->
        <div class="space-y-6">
          <!-- 基本信息 -->
          <div class="bg-gray-800 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-white mb-4">基本信息</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">直播标题</label>
                <input 
                  v-model="streamTitle"
                  type="text" 
                  class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="输入直播标题..."
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">分类</label>
                <select 
                  v-model="streamCategory"
                  class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="游戏">游戏</option>
                  <option value="科技">科技</option>
                  <option value="生活">生活</option>
                  <option value="音乐">音乐</option>
                  <option value="运动">运动</option>
                  <option value="绘画">绘画</option>
                  <option value="美食">美食</option>
                  <option value="其他">其他</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 场景选择 -->
          <div class="bg-gray-800 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-white mb-4">场景选择</h3>
            <div class="grid grid-cols-2 gap-3">
              <div 
                v-for="scene in scenes" 
                :key="scene.id"
                @click="selectScene(scene)"
                :class="selectedScene?.id === scene.id ? 'ring-2 ring-blue-500' : ''"
                class="relative aspect-video bg-gray-700 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
              >
                <img :src="scene.thumbnail" :alt="scene.name" class="w-full h-full object-cover">
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <p class="text-white text-xs font-medium">{{ scene.name }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 涂层设置 -->
          <div v-if="selectedScene" class="bg-gray-800 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-white mb-4">涂层设置</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">透明度: {{ overlayOpacity }}%</label>
                <input 
                  v-model="overlayOpacity"
                  type="range" 
                  min="0" 
                  max="100" 
                  class="w-full"
                />
              </div>
            </div>
          </div>

          <!-- 媒体添加 -->
          <div class="bg-gray-800 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-white mb-4">添加媒体</h3>
            <div class="space-y-3">
              <button 
                @click="addImage"
                class="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-medium transition-colors"
              >
                添加图片
              </button>
              <button 
                @click="addVideo"
                class="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white font-medium transition-colors"
              >
                添加视频
              </button>
            </div>

            <!-- 已添加的媒体列表 -->
            <div v-if="addedMedia.length > 0" class="mt-4 space-y-2">
              <h4 class="text-sm font-medium text-gray-300">已添加媒体</h4>
              <div 
                v-for="media in addedMedia" 
                :key="media.id"
                @click="selectMedia(media.id)"
                :class="selectedMediaId === media.id ? 'bg-blue-600/30 border-blue-500' : 'bg-gray-700 border-transparent'"
                class="flex items-center justify-between rounded-lg p-2 cursor-pointer border transition-colors"
              >
                <div class="flex items-center space-x-2">
                  <div class="w-8 h-8 bg-gray-600 rounded overflow-hidden">
                    <img v-if="media.type === 'image'" :src="media.url" class="w-full h-full object-cover">
                    <svg v-else class="w-full h-full p-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
                    </svg>
                  </div>
                  <span class="text-sm text-gray-300">{{ media.name }}</span>
                </div>
                <button 
                  @click.stop="removeMedia(media.id)"
                  class="text-red-400 hover:text-red-300"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- 选中媒体属性设置 -->
          <div v-if="selectedMedia" class="bg-gray-800 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-white mb-4">媒体属性</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">透明度: {{ selectedMedia.opacity }}%</label>
                <input 
                  v-model="selectedMedia.opacity"
                  type="range" 
                  min="0" 
                  max="100" 
                  class="w-full"
                />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">宽度: {{ Math.round(selectedMedia.width) }}%</label>
                  <input 
                    v-model="selectedMedia.width"
                    type="range" 
                    min="5" 
                    max="50" 
                    class="w-full"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">高度: {{ Math.round(selectedMedia.height) }}%</label>
                  <input 
                    v-model="selectedMedia.height"
                    type="range" 
                    min="5" 
                    max="50" 
                    class="w-full"
                  />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">X位置: {{ Math.round(selectedMedia.x) }}%</label>
                  <input 
                    v-model="selectedMedia.x"
                    type="range" 
                    min="0" 
                    :max="100 - selectedMedia.width" 
                    class="w-full"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Y位置: {{ Math.round(selectedMedia.y) }}%</label>
                  <input 
                    v-model="selectedMedia.y"
                    type="range" 
                    min="0" 
                    :max="100 - selectedMedia.height" 
                    class="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 文件上传隐藏输入 -->
    <input 
      ref="imageInput" 
      type="file" 
      accept="image/*" 
      @change="handleImageUpload" 
      class="hidden"
    />
    <input 
      ref="videoInput" 
      type="file" 
      accept="video/*" 
      @change="handleVideoUpload" 
      class="hidden"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import NavHeader from '../components/NavHeader.vue'
import { useUserStore } from '../stores/userStore'

const router = useRouter()
const userStore = useUserStore()

// 基本状态
const showLoginModal = ref(false)
const isDarkMode = ref(true)
const videoPreview = ref<HTMLVideoElement>()
const imageInput = ref<HTMLInputElement>()
const videoInput = ref<HTMLInputElement>()

// 直播设置
const streamTitle = ref('我的直播间')
const streamCategory = ref('游戏')
const cameraEnabled = ref(false)
const microphoneEnabled = ref(false)
const overlayOpacity = ref(50)

// 场景数据
const scenes = ref([
  {
    id: 'scene-1',
    name: '赛博朋克',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=300&q=80',
    overlay: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'scene-2',
    name: '未来城市',
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=300&q=80',
    overlay: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'scene-3',
    name: '太空站',
    thumbnail: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?auto=format&fit=crop&w=300&q=80',
    overlay: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'scene-4',
    name: '虚拟世界',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80',
    overlay: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'
  }
])

const selectedScene = ref(null)
const addedMedia = ref([])
const selectedMediaId = ref<string | null>(null)
let mediaStream: MediaStream | null = null

// 拖拽相关状态
const isDragging = ref(false)
const isResizing = ref(false)
const dragStartPos = ref({ x: 0, y: 0 })
const dragStartMediaPos = ref({ x: 0, y: 0 })
const resizeStartPos = ref({ x: 0, y: 0 })
const resizeStartSize = ref({ width: 0, height: 0 })
let currentDragMedia: any = null

// 计算属性
const selectedMedia = computed(() => {
  return addedMedia.value.find(media => media.id === selectedMediaId.value)
})

// 方法
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
}

const selectScene = (scene: any) => {
  selectedScene.value = scene
}

const toggleCamera = async () => {
  if (cameraEnabled.value) {
    // 关闭摄像头
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop())
      mediaStream = null
    }
    cameraEnabled.value = false
  } else {
    // 启用摄像头
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: microphoneEnabled.value 
      })
      if (videoPreview.value) {
        videoPreview.value.srcObject = mediaStream
      }
      cameraEnabled.value = true
    } catch (error) {
      console.error('无法访问摄像头:', error)
      alert('无法访问摄像头，请检查权限设置')
    }
  }
}

const toggleMicrophone = () => {
  microphoneEnabled.value = !microphoneEnabled.value
  // 实际应用中需要重新获取媒体流以包含/排除音频
}

const addImage = () => {
  imageInput.value?.click()
}

const addVideo = () => {
  videoInput.value?.click()
}

const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const url = URL.createObjectURL(file)
    const media = {
      id: Date.now().toString(),
      type: 'image',
      name: file.name,
      url,
      x: 10,
      y: 10,
      width: 20,
      height: 20,
      opacity: 100
    }
    addedMedia.value.push(media)
  }
}

const handleVideoUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const url = URL.createObjectURL(file)
    const media = {
      id: Date.now().toString(),
      type: 'video',
      name: file.name,
      url,
      x: 10,
      y: 10,
      width: 30,
      height: 30,
      opacity: 100
    }
    addedMedia.value.push(media)
  }
}

const removeMedia = (id: string) => {
  const index = addedMedia.value.findIndex(media => media.id === id)
  if (index > -1) {
    const media = addedMedia.value[index]
    URL.revokeObjectURL(media.url)
    addedMedia.value.splice(index, 1)
  }
}

const selectMedia = (id: string) => {
  selectedMediaId.value = id
}

const startDrag = (event: MouseEvent, media: any) => {
  event.preventDefault()
  isDragging.value = true
  currentDragMedia = media
  selectedMediaId.value = media.id
  
  dragStartPos.value = { x: event.clientX, y: event.clientY }
  dragStartMediaPos.value = { x: media.x, y: media.y }
  
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

const onDrag = (event: MouseEvent) => {
  if (!isDragging.value || !currentDragMedia) return
  
  const previewRect = videoPreview.value?.getBoundingClientRect()
  if (!previewRect) return
  
  const deltaX = event.clientX - dragStartPos.value.x
  const deltaY = event.clientY - dragStartPos.value.y
  
  const deltaXPercent = (deltaX / previewRect.width) * 100
  const deltaYPercent = (deltaY / previewRect.height) * 100
  
  let newX = dragStartMediaPos.value.x + deltaXPercent
  let newY = dragStartMediaPos.value.y + deltaYPercent
  
  // 边界限制
  newX = Math.max(0, Math.min(100 - currentDragMedia.width, newX))
  newY = Math.max(0, Math.min(100 - currentDragMedia.height, newY))
  
  currentDragMedia.x = newX
  currentDragMedia.y = newY
}

const stopDrag = () => {
  isDragging.value = false
  currentDragMedia = null
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

const startResize = (event: MouseEvent, media: any) => {
  event.preventDefault()
  isResizing.value = true
  currentDragMedia = media
  
  resizeStartPos.value = { x: event.clientX, y: event.clientY }
  resizeStartSize.value = { width: media.width, height: media.height }
  
  document.addEventListener('mousemove', onResize)
  document.addEventListener('mouseup', stopResize)
}

const onResize = (event: MouseEvent) => {
  if (!isResizing.value || !currentDragMedia) return
  
  const previewRect = videoPreview.value?.getBoundingClientRect()
  if (!previewRect) return
  
  const deltaX = event.clientX - resizeStartPos.value.x
  const deltaY = event.clientY - resizeStartPos.value.y
  
  const deltaWidthPercent = (deltaX / previewRect.width) * 100
  const deltaHeightPercent = (deltaY / previewRect.height) * 100
  
  let newWidth = resizeStartSize.value.width + deltaWidthPercent
  let newHeight = resizeStartSize.value.height + deltaHeightPercent
  
  // 最小和最大尺寸限制
  newWidth = Math.max(5, Math.min(50, newWidth))
  newHeight = Math.max(5, Math.min(50, newHeight))
  
  // 确保不超出边界
  if (currentDragMedia.x + newWidth > 100) {
    newWidth = 100 - currentDragMedia.x
  }
  if (currentDragMedia.y + newHeight > 100) {
    newHeight = 100 - currentDragMedia.y
  }
  
  currentDragMedia.width = newWidth
  currentDragMedia.height = newHeight
}

const stopResize = () => {
  isResizing.value = false
  currentDragMedia = null
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
}

const startStreaming = () => {
  if (!streamTitle.value.trim()) {
    alert('请输入直播标题')
    return
  }
  
  // 实际应用中会启动直播推流
  alert(`开始直播: ${streamTitle.value}`)
  router.push('/live')
}

// 生命周期
onMounted(() => {
  // 默认选择第一个场景
  if (scenes.value.length > 0) {
    selectedScene.value = scenes.value[0]
  }
})

onUnmounted(() => {
  // 清理媒体流
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop())
  }
  
  // 清理对象URL
  addedMedia.value.forEach(media => {
    URL.revokeObjectURL(media.url)
  })
  
  // 清理事件监听器
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
})
</script>

<style scoped>
/* 自定义滑块样式 */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  background: #374151;
  border-radius: 3px;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: #3B82F6;
  border-radius: 50%;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: #3B82F6;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}
</style>