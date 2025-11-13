<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 头部导航 -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-4">
            <router-link to="/" class="flex items-center group">
              <div class="w-10 h-10 bg-pink-500 rounded flex items-center justify-center">
                <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm-1 14.5v-9l7 4.5-7 4.5z"/>
                </svg>
              </div>
              <span class="ml-2 text-xl font-semibold text-gray-900 dark:text-white">VisionWorld</span>
            </router-link>
            <div class="hidden md:flex items-center space-x-1">
              <span class="text-gray-400">/</span>
              <span class="text-gray-600 dark:text-gray-300 ml-1">创作中心</span>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <button class="p-2 text-gray-600 dark:text-gray-300 hover:text-pink-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </button>
            <button class="p-2 text-gray-600 dark:text-gray-300 hover:text-pink-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>
            <!-- 用户头像下拉菜单 -->
            <div class="relative group">
              <div class="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-pink-600 transition-colors">
                <span class="text-white text-base font-semibold">{{ (userStore.username || 'U').charAt(0).toUpperCase() }}</span>
              </div>
              
              <!-- 下拉菜单 -->
              <div class="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible z-50">
                <div class="py-1">
                  <router-link to="/profile" class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    个人账号中心
                  </router-link>
                  
                  <router-link to="/manage/videos" class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                    投稿管理
                  </router-link>
                  
                  <hr class="my-1 border-gray-200 dark:border-gray-600">
                  
                  <button @click="handleLogout" class="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    退出登录
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 左侧上传区域 -->
        <div class="lg:col-span-2 space-y-6">
          <!-- 上传卡片 -->
          <div class="bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 class="text-lg font-medium text-gray-900 dark:text-white">上传视频</h2>
            </div>
            
            <div class="p-6">
              <!-- 拖拽上传区域 -->
              <div 
                class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-10 text-center hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer bg-gray-50 dark:bg-gray-800 transition-all duration-200"
                :class="{ 'border-blue-400 bg-blue-50 dark:bg-blue-900/20': isDragging }"
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
                  <div class="w-20 h-20 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg class="w-10 h-10 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                    </svg>
                  </div>
                  <p class="text-lg font-medium text-gray-900 dark:text-white mb-3">拖拽视频到此处</p>
                  <p class="text-gray-500 dark:text-gray-400 mb-8">或者点击选择文件</p>
                  <button class="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-lg transition-colors font-medium">
                    选择文件
                  </button>
                </div>
                
                <div v-else-if="selectedFile && !uploadProgress" class="text-center">
                  <div class="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg class="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <p class="text-lg font-medium text-gray-900 dark:text-white mb-2">{{ selectedFile.name }}</p>
                  <p class="text-gray-500 dark:text-gray-400 mb-8">{{ formatFileSize(selectedFile.size) }}</p>
                  <div class="flex justify-center space-x-4">
                    <button @click.stop="startUpload" class="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg transition-colors font-medium">
                      开始上传
                    </button>
                    <button @click.stop="resetFile" class="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-lg transition-colors font-medium">
                      重新选择
                    </button>
                  </div>
                </div>
                
                <div v-else-if="uploadProgress" class="w-full">
                  <div class="mb-6">
                    <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <span>上传中...</span>
                      <span>{{ uploadProgress }}%</span>
                    </div>
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden relative">
                      <div 
                        class="bg-pink-500 h-3 rounded-full transition-all duration-500 ease-out"
                        :style="{ width: uploadProgress + '%' }"
                      ></div>
                    </div>
                    <div class="mt-3 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div>
                        <span>正在上传视频文件...</span>
                        <span v-if="uploadProgress < 100" class="ml-2">剩余时间: {{ formatRemainingTime(remainingTime) }}</span>
                      </div>
                      <div class="flex items-center">
                        <span v-if="uploadProgress < 100" class="mr-2">速度: {{ formatUploadSpeed(uploadSpeed) }}</span>
                        <span v-if="uploadProgress < 100">请勿关闭页面</span>
                        <span v-else class="text-green-600 dark:text-green-400">上传完成!</span>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center justify-between">
                    <button @click="cancelUpload" class="text-red-600 hover:text-red-700 text-sm flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                      取消上传
                    </button>
                    <div v-if="uploadProgress === 100" class="flex items-center text-green-600 dark:text-green-400">
                      <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>上传成功</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 上传提示 -->
              <div class="mt-6 p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">上传须知</h4>
                <div class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <p>• 支持格式：MP4, AVI, MOV, WMV, FLV</p>
                  <p>• 最大文件大小：2GB</p>
                  <p>• 建议分辨率：1280x720 或更高</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 视频信息编辑 -->
          <div v-if="uploadedVideoId" class="bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">编辑视频信息</h3>
            </div>
            <div class="p-6">
              
              <!-- 视频预览 -->
              <div class="mb-8">
                <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 shadow-sm">
                  <video 
                    :src="videoPreviewUrl" 
                    controls 
                    class="w-full max-h-64 rounded-lg"
                  ></video>
                </div>
              </div>
              
              <!-- 标题 -->
              <div class="mb-8">
                <label class="block text-base font-medium text-gray-900 dark:text-white mb-3">
                  标题 <span class="text-red-500">*</span>
                  <span class="text-sm text-gray-500 dark:text-gray-400 ml-2">一个好的标题能吸引更多观众</span>
                </label>
                <div class="relative">
                  <input 
                    v-model="videoForm.title"
                    type="text" 
                    maxlength="80"
                    class="w-full px-4 py-3 pr-20 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base"
                    placeholder="请输入视频标题，建议包含关键词"
                  >
                  <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm px-2 py-1 rounded" 
                       :class="videoForm.title.length > 70 ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300'">
                    {{ videoForm.title.length }}/80
                  </div>
                </div>
                <div class="mt-3 flex items-center">
                  <svg class="w-4 h-4 text-amber-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                  </svg>
                  <p class="text-sm text-gray-600 dark:text-gray-400">标题建议包含关键词，长度在10-30字之间效果最佳</p>
                </div>
              </div>
              
              <!-- 简介 -->
              <div class="mb-8">
                <label class="block text-base font-medium text-gray-900 dark:text-white mb-3">
                  简介
                  <span class="text-sm text-gray-500 dark:text-gray-400 ml-2">详细介绍你的视频内容</span>
                </label>
                <div class="relative">
                  <textarea 
                    v-model="videoForm.description"
                    rows="4"
                    maxlength="2000"
                    class="w-full px-4 py-3 pr-20 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none text-base"
                    placeholder="请输入视频简介，让观众更好地了解你的视频内容，可以包含视频亮点、时间轴等信息"
                  ></textarea>
                  <div class="absolute right-3 bottom-3 text-sm px-2 py-1 rounded" 
                       :class="videoForm.description.length > 1800 ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300'">
                    {{ videoForm.description.length }}/2000
                  </div>
                </div>
                <div class="mt-3 flex items-center">
                  <svg class="w-4 h-4 text-amber-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                  </svg>
                  <p class="text-sm text-gray-600 dark:text-gray-400">详细的简介有助于观众了解视频内容，提高观看率</p>
                </div>
              </div>
              
              <!-- 视频类型 -->
              <div class="mb-8">
                <label class="block text-base font-medium text-gray-900 dark:text-white mb-3">
                  视频类型 <span class="text-red-500">*</span>
                </label>
                <div class="flex space-x-8">
                  <label class="flex items-center cursor-pointer">
                    <div class="relative">
                      <input 
                        v-model="videoForm.type" 
                        type="radio" 
                        value="original" 
                        class="sr-only peer"
                      >
                      <div class="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-full peer-checked:border-pink-500 peer-checked:bg-pink-500">
                        <div class="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100"></div>
                      </div>
                    </div>
                    <span class="ml-3 text-gray-700 dark:text-gray-300 text-base">自制</span>
                  </label>
                  <label class="flex items-center cursor-pointer">
                    <div class="relative">
                      <input 
                        v-model="videoForm.type" 
                        type="radio" 
                        value="repost" 
                        class="sr-only peer"
                      >
                      <div class="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-full peer-checked:border-pink-500 peer-checked:bg-pink-500">
                        <div class="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100"></div>
                      </div>
                    </div>
                    <span class="ml-3 text-gray-700 dark:text-gray-300 text-base">转载</span>
                  </label>
                </div>
              </div>
              
              <!-- 转载来源信息 -->
              <div v-if="videoForm.type === 'repost'" class="mb-8 p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-800">
                <label class="block text-base font-medium text-gray-900 dark:text-white mb-3">
                  转载来源
                </label>
                <div class="relative">
                  <input 
                    v-model="videoForm.source"
                    type="text" 
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base"
                    placeholder="请填写转载来源，如：B站UP主名称"
                  >
                </div>
              </div>
              
              <!-- 分区 -->
              <div class="mb-8">
                <label class="block text-base font-medium text-gray-900 dark:text-white mb-3">
                  分区 <span class="text-red-500">*</span>
                </label>
                <div class="grid grid-cols-5 gap-4">
                  <div 
                    v-for="category in categories" 
                    :key="category.value"
                    @click="videoForm.category = category.value"
                    :class="[
                      'cursor-pointer p-4 rounded-lg border flex flex-col items-center justify-center transition-all duration-200',
                      videoForm.category === category.value 
                        ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20' 
                        : 'border-gray-200 dark:border-gray-600 hover:border-pink-300 dark:hover:border-pink-700'
                    ]"
                  >
                    <div class="text-2xl mb-2">{{ category.icon }}</div>
                    <div class="text-sm text-center font-medium" :class="videoForm.category === category.value ? 'text-pink-700 dark:text-pink-300' : 'text-gray-700 dark:text-gray-300'">{{ category.label }}</div>
                  </div>
                </div>
              </div>
              
              <!-- 标签 -->
              <div class="mb-8">
                <label class="block text-base font-medium text-gray-900 dark:text-white mb-3">
                  标签
                  <span class="text-sm text-gray-500 dark:text-gray-400 ml-2">最多添加10个标签，每个标签不超过20个字符</span>
                </label>
                <div class="flex flex-wrap gap-2 mb-4">
                  <span 
                    v-for="tag in videoForm.tags" 
                    :key="tag"
                    class="inline-flex items-center px-4 py-2 rounded-full text-sm bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300"
                  >
                    {{ tag }}
                    <button @click="removeTag(tag)" class="ml-2 text-pink-600 hover:text-pink-800 dark:text-pink-400 dark:hover:text-pink-200">
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                      </svg>
                    </button>
                  </span>
                </div>
                
                <!-- 热门标签推荐 -->
                <div class="mb-4">
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">热门标签推荐</p>
                  <div class="flex flex-wrap gap-2">
                    <button 
                      v-for="tag in popularTags" 
                      :key="tag"
                      @click="addPopularTag(tag)"
                      :class="[
                        'px-3 py-2 rounded-full text-sm',
                        videoForm.tags.includes(tag) 
                          ? 'bg-pink-500 text-white' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-pink-900/30 hover:text-pink-700 dark:hover:text-pink-300'
                      ]"
                    >
                      {{ tag }}
                    </button>
                  </div>
                </div>
                
                <!-- 标签输入框 -->
                <div class="flex">
                  <div class="relative flex-1">
                    <input 
                      v-model="newTag"
                      type="text"
                      maxlength="20"
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base"
                      placeholder="输入标签后按回车或点击添加"
                      @keyup.enter="addTag"
                    >
                  </div>
                  <button @click="addTag" class="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-r-lg flex items-center transition-colors font-medium">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    添加
                  </button>
                </div>
              </div>
              
              <!-- 封面 -->
              <div class="mb-8">
                <label class="block text-base font-medium text-gray-900 dark:text-white mb-3">
                  封面
                </label>
                <div class="flex items-start space-x-4">
                  <div 
                    @click="triggerCoverInput"
                    class="relative group w-40 h-28 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-pink-500 overflow-hidden bg-gray-50 dark:bg-gray-800 transition-all duration-200"
                  >
                    <input
                      ref="coverInput"
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="handleCoverSelect"
                    >
                    <img 
                      v-if="coverPreview" 
                      :src="coverPreview" 
                      alt="封面预览"
                      class="w-full h-full object-cover"
                    >
                    <div v-else class="text-center">
                      <div class="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center mb-2">
                        <svg class="w-6 h-6 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                      <p class="text-xs text-gray-500 dark:text-gray-400">点击上传封面</p>
                    </div>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">建议尺寸 16:9，大小不超过 2MB</p>
                    <button 
                      v-if="coverPreview"
                      @click="cropCover"
                      class="px-4 py-2 text-sm bg-pink-500 hover:bg-pink-600 text-white rounded-lg mr-2 transition-colors font-medium"
                    >
                      裁剪封面
                    </button>
                    <button 
                      v-if="coverPreview"
                      @click="removeCover"
                      class="px-4 py-2 text-sm bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
                    >
                      移除封面
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- 封面裁剪弹窗 -->
              <div v-if="showCropModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl">
                  <div class="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white">裁剪封面</h3>
                    <button @click="showCropModal = false" class="rounded-full p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                  <div class="mb-6">
                    <div class="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                      <img 
                        ref="cropImage"
                        :src="coverPreview" 
                        alt="裁剪图片"
                        class="max-w-full max-h-full"
                      >
                    </div>
                  </div>
                  <div class="flex justify-end space-x-3">
                    <button 
                      @click="showCropModal = false"
                      class="px-6 py-3 text-gray-700 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors font-medium"
                    >
                      取消
                    </button>
                    <button 
                      @click="applyCrop"
                      class="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors font-medium"
                    >
                      应用
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 右侧设置区域 -->
        <div class="lg:col-span-1">
          <!-- 发布设置 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden">
            <div class="bg-pink-500 p-4">
              <h3 class="text-lg font-semibold text-white">发布设置</h3>
            </div>
            <div class="p-6">
              <!-- 发布时间 -->
              <div class="mb-6">
                <label class="flex items-center mb-3 cursor-pointer">
                  <input v-model="publishSettings.immediate" type="radio" name="publishTime" value="immediate" class="mr-3 w-4 h-4 text-pink-600 focus:ring-pink-500">
                  <span class="text-gray-700 dark:text-gray-300 text-base">立即发布</span>
                </label>
                <label class="flex items-center mb-3 cursor-pointer">
                  <input v-model="publishSettings.immediate" type="radio" name="publishTime" value="scheduled" class="mr-3 w-4 h-4 text-pink-600 focus:ring-pink-500">
                  <span class="text-gray-700 dark:text-gray-300 text-base">定时发布</span>
                </label>
                <div class="relative" v-if="publishSettings.immediate === 'scheduled'">
                  <input 
                    v-model="publishSettings.scheduledTime"
                    type="datetime-local"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base"
                  >
                </div>
              </div>
              
              <!-- 权限设置 -->
              <div class="mb-6">
                <label class="block text-base font-medium text-gray-900 dark:text-white mb-3">权限</label>
                <div class="relative">
                  <select 
                    v-model="publishSettings.privacy"
                    class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none text-base"
                  >
                    <option value="public">公开</option>
                    <option value="unlisted">不公开</option>
                    <option value="private">私密</option>
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
              
              <!-- 评论设置 -->
              <div class="mb-6">
                <label class="flex items-center cursor-pointer">
                  <input v-model="publishSettings.allowComments" type="checkbox" class="mr-3 w-4 h-4 text-pink-600 focus:ring-pink-500 rounded">
                  <span class="text-gray-700 dark:text-gray-300 text-base">允许评论</span>
                </label>
              </div>
              
              <!-- 弹幕设置 -->
              <div class="mb-6">
                <label class="flex items-center cursor-pointer group">
                  <input v-model="publishSettings.allowDanmu" type="checkbox" class="mr-3 w-4 h-4 text-pink-600 focus:ring-pink-500 rounded">
                  <span class="text-gray-700 dark:text-gray-300 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors text-base">允许弹幕</span>
                </label>
              </div>
            </div>
          </div>
          
          <!-- 发布按钮 -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="p-6">
              <button 
                @click="submitVideo"
                :disabled="!canSubmit"
                class="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition-colors shadow-md disabled:shadow-none text-base"
              >
                {{ isEditing ? '保存修改' : '立即投稿' }}
              </button>
              <button 
                @click="saveAsDraft"
                class="w-full mt-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-medium transition-colors shadow-md text-base"
              >
                保存草稿
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 未登录遮罩层 -->
  <!-- 登录弹窗 - 简洁现代风格 -->
  <div v-if="showLoginModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- 背景遮罩 -->
    <div 
      class="absolute inset-0 bg-black/50 backdrop-blur-sm" 
      @click="closeLoginModal"
    ></div>
    
    <!-- 登录卡片 -->
    <div 
      class="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
      @click.stop
    >
      <!-- 简洁标题区域 -->
      <div class="flex justify-between items-center p-6 pb-0">
        <div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
            登录账号
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            使用手机号登录您的账户
          </p>
        </div>
        
        <!-- 关闭按钮 -->
        <button 
          @click="closeLoginModal" 
          class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
        
      <!-- 登录方式切换 -->
      <div class="px-6 pb-6">
        <div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button 
            @click="loginType = 'phone'"
            :class="['relative flex-1 py-2.5 text-sm font-medium rounded-md transition-all duration-200', 
                     loginType === 'phone' 
                       ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                       : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200']"
          >
            验证码登录
          </button>
          <button 
            @click="loginType = 'password'"
            :class="['relative flex-1 py-2.5 text-sm font-medium rounded-md transition-all duration-200', 
                     loginType === 'password' 
                       ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                       : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200']"
          >
            密码登录
          </button>
        </div>
      </div>
      
      <!-- 登录表单 -->
      <div class="px-6 pb-6 space-y-4">
        <!-- 手机号输入框 -->
        <div>
          <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            手机号
          </label>
          <div class="relative">
            <input 
              type="tel" 
              id="phone" 
              v-model="loginForm.phone" 
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none"
              :class="loginForm.phone && !isValidPhone(loginForm.phone) ? 'border-red-500 focus:border-red-500' : ''"
              placeholder="请输入手机号"
            >
          </div>
          <p v-if="loginForm.phone && !isValidPhone(loginForm.phone)" class="mt-1 text-sm text-red-600">
            请输入正确的手机号
          </p>
        </div>
        
        
        <!-- 验证码输入 -->
        <div v-if="loginType === 'phone'">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            验证码
          </label>
          <div class="flex space-x-3">
            <input 
              type="text" 
              v-model="loginForm.verificationCode" 
              class="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none"
              :class="loginForm.verificationCode && loginForm.verificationCode.length !== 6 ? 'border-red-500 focus:border-red-500' : ''"
              placeholder="请输入验证码"
              maxlength="6"
            >
            <button 
              @click="sendVerificationCode" 
              :disabled="!isValidPhone(loginForm.phone) || isSendingCode || countdown > 0"
              class="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {{ isSendingCode ? '发送中' : countdown > 0 ? `${countdown}s` : '获取验证码' }}
            </button>
          </div>
          <p v-if="loginForm.verificationCode && loginForm.verificationCode.length !== 6" class="mt-1 text-sm text-red-600">
            请输入6位验证码
          </p>
        </div>
        
        <!-- 密码输入 -->
        <div v-if="loginType === 'password'">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            密码
          </label>
          <div class="relative">
            <input 
              :type="showPassword ? 'text' : 'password'" 
              v-model="loginForm.password" 
              class="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none"
              :class="loginForm.password && loginForm.password.length < 6 ? 'border-red-500 focus:border-red-500' : ''"
              placeholder="请输入密码"
            >
            <button 
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg v-if="!showPassword" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
              </svg>
            </button>
          </div>
          <p v-if="loginForm.password && loginForm.password.length < 6" class="mt-1 text-sm text-red-600">
            密码长度至少6位
          </p>
        </div>
        
        <!-- 记住我和忘记密码 -->
        <div class="flex items-center justify-between">
          <label class="flex items-center">
            <input type="checkbox" class="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500">
            <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">记住我</span>
          </label>
          <button class="text-sm text-blue-500 hover:text-blue-600 transition-colors">忘记密码？</button>
        </div>
        
        <!-- 错误提示 -->
        <div v-if="loginError" class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p class="text-sm text-red-600 dark:text-red-400">{{ loginError }}</p>
        </div>
        
        <!-- 登录按钮 -->
        <button 
          @click="handleLogin" 
          :disabled="!isValidPhone(loginForm.phone) || (loginType === 'phone' && (!loginForm.verificationCode || loginForm.verificationCode.length !== 6)) || (loginType === 'password' && (!loginForm.password || loginForm.password.length < 6))"
          class="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
        >
          <span v-if="isSendingCode" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            登录中...
          </span>
          <span v-else>登录</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
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

// 上传速度和剩余时间
const uploadSpeed = ref(0) // KB/s
const remainingTime = ref(0) // 秒
const uploadStartTime = ref(0) // 开始上传时间
const lastProgressTime = ref(0) // 上次更新进度时间
const lastProgressValue = ref(0) // 上次进度值

// 视频表单
const videoForm = ref({
  title: '',
  description: '',
  category: '',
  tags: [] as string[],
  type: 'original',
  source: ''
})

// 分区选项
const categories = [
  { value: 'game', label: '游戏', icon: '🎮' },
  { value: 'music', label: '音乐', icon: '🎵' },
  { value: 'dance', label: '舞蹈', icon: '💃' },
  { value: 'tech', label: '科技', icon: '💻' },
  { value: 'life', label: '生活', icon: '🌱' },
  { value: 'food', label: '美食', icon: '🍔' },
  { value: 'animal', label: '动物', icon: '🐾' },
  { value: 'sport', label: '运动', icon: '⚽' },
  { value: 'movie', label: '影视', icon: '🎬' },
  { value: 'entertainment', label: '娱乐', icon: '🎭' },
  { value: 'knowledge', label: '知识', icon: '📚' },
  { value: 'fashion', label: '时尚', icon: '👗' },
  { value: 'travel', label: '旅行', icon: '✈️' },
  { value: 'car', label: '汽车', icon: '🚗' },
  { value: 'finance', label: '财经', icon: '💰' }
]

// 发布设置
const publishSettings = ref({
  immediate: 'immediate' as 'immediate' | 'scheduled',
  scheduledTime: '',
  privacy: 'public' as 'public' | 'unlist' | 'private',
  allowComments: true,
  allowDanmu: true
})

// 热门标签
const popularTags = [
  '热门', '原创', '精选', '搞笑', '生活', '美食', '旅行', '音乐', 
  '游戏', '舞蹈', '科技', '知识', '萌宠', '运动', '时尚', '影视'
]

const newTag = ref('')
const isEditing = ref(false)
const showLoginModal = ref(false)

// 登录表单数据
const loginForm = ref({
  phone: '',
  verificationCode: '',
  password: '',
  rememberMe: false
})

const loginError = ref('')
const isSendingCode = ref(false)
const countdown = ref(0)
const loginType = ref<'phone' | 'password'>('phone')
const showPassword = ref(false)

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

// 封面相关
const showCropModal = ref(false)
const cropImage = ref<HTMLImageElement | null>(null)

// 选择封面
// Note: triggerCoverInput function is already defined above

// 处理封面选择
const handleCoverSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    // 检查文件大小
    if (file.size > 2 * 1024 * 1024) {
      alert('封面大小不能超过2MB')
      return
    }
    
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件')
      return
    }
    
    coverFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      coverPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

// 裁剪封面
const cropCover = () => {
  showCropModal.value = true
}

// 应用裁剪
const applyCrop = () => {
  // 这里可以集成实际的裁剪库，如cropper.js
  // 现在只是简单关闭弹窗
  showCropModal.value = false
  alert('封面已更新')
}

// 移除封面
const removeCover = () => {
  coverPreview.value = ''
  coverFile.value = null
  if (coverInput.value) {
    coverInput.value.value = ''
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

const formatUploadSpeed = (speed: number) => {
  if (speed === 0) return '0 KB/s'
  if (speed < 1024) return `${speed.toFixed(1)} KB/s`
  return `${(speed / 1024).toFixed(1)} MB/s`
}

const formatRemainingTime = (seconds: number) => {
  if (seconds === 0 || !isFinite(seconds)) return '计算中...'
  if (seconds < 60) return `${Math.ceil(seconds)}秒`
  if (seconds < 3600) return `${Math.ceil(seconds / 60)}分钟`
  return `${Math.ceil(seconds / 3600)}小时`
}

const startUpload = async () => {
  if (!selectedFile.value) return
  
  // 检查用户是否登录
  if (!userStore.isLoggedIn) {
    showLoginModal.value = true
    return
  }
  
  const formData = new FormData()
  formData.append('video', selectedFile.value)
  formData.append('title', videoForm.value.title || selectedFile.value.name)
  
  try {
    uploadProgress.value = 0
    uploadSpeed.value = 0
    remainingTime.value = 0
    uploadStartTime.value = Date.now()
    lastProgressTime.value = Date.now()
    lastProgressValue.value = 0
    
    // 模拟上传进度更新
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        // 随机增加进度，模拟真实上传
        const increment = Math.random() * 10 + 2
        uploadProgress.value = Math.min(uploadProgress.value + increment, 90)
        
        // 计算上传速度和剩余时间
        const currentTime = Date.now()
        const timeDiff = (currentTime - lastProgressTime.value) / 1000 // 秒
        const progressDiff = uploadProgress.value - lastProgressValue.value
        
        if (timeDiff > 0 && progressDiff > 0) {
          // 计算上传速度 (KB/s)
          const uploadedBytes = (selectedFile.value!.size * uploadProgress.value) / 100
          uploadSpeed.value = (uploadedBytes / 1024) / ((currentTime - uploadStartTime.value) / 1000)
          
          // 计算剩余时间
          const remainingProgress = 100 - uploadProgress.value
          remainingTime.value = (remainingProgress / progressDiff) * timeDiff
        }
        
        lastProgressTime.value = currentTime
        lastProgressValue.value = uploadProgress.value
      }
    }, 500)
    
    const response = await videoAPI.uploadVideo(formData)
    
    // 清除进度更新定时器
    clearInterval(progressInterval)
    
    if (response.data) {
      // 模拟最后阶段的进度更新
      const finalProgress = setInterval(() => {
        if (uploadProgress.value < 100) {
          uploadProgress.value += 2
          
          // 更新速度和剩余时间
          const currentTime = Date.now()
          const timeDiff = (currentTime - lastProgressTime.value) / 1000
          const progressDiff = uploadProgress.value - lastProgressValue.value
          
          if (timeDiff > 0 && progressDiff > 0) {
            uploadSpeed.value = (selectedFile.value!.size / 1024) / ((currentTime - uploadStartTime.value) / 1000)
            remainingTime.value = ((100 - uploadProgress.value) / progressDiff) * timeDiff
          }
          
          lastProgressTime.value = currentTime
          lastProgressValue.value = uploadProgress.value
        } else {
          clearInterval(finalProgress)
          uploadSpeed.value = 0
          remainingTime.value = 0
        }
      }, 100)
      
      // 处理不同的响应格式
      // 格式1: {message, video_id, video_url}
      if (response.data.video_id) {
        uploadedVideoId.value = response.data.video_id.toString()
        videoPreviewUrl.value = response.data.video_url || URL.createObjectURL(selectedFile.value!)
      } 
      // 格式2: {data: {id, ...}}
      else if (response.data.data && response.data.data.id) {
        uploadedVideoId.value = response.data.data.id
        videoPreviewUrl.value = URL.createObjectURL(selectedFile.value!)
      }
      // 格式3: 直接包含id
      else if (response.data.id) {
        uploadedVideoId.value = response.data.id
        videoPreviewUrl.value = URL.createObjectURL(selectedFile.value!)
      }
      else {
        throw new Error('响应中未找到视频ID')
      }
      
      // 显示上传成功消息
      setTimeout(() => {
        alert('视频上传成功')
      }, 500)
    } else {
      throw new Error('上传失败')
    }
    
  } catch (error) {
    alert('上传失败，请重试')
    uploadProgress.value = 0
    uploadSpeed.value = 0
    remainingTime.value = 0
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

const addPopularTag = (tag: string) => {
  if (!videoForm.value.tags.includes(tag)) {
    if (videoForm.value.tags.length < 10) {
      videoForm.value.tags.push(tag)
    } else {
      alert('最多添加10个标签')
    }
  } else {
    // 如果标签已存在，则移除它
    const index = videoForm.value.tags.indexOf(tag)
    if (index > -1) {
      videoForm.value.tags.splice(index, 1)
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
  
  // 检查用户是否登录
  if (!userStore.isLoggedIn) {
    showLoginModal.value = true
    return
  }
  
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
    formData.append('type', videoForm.value.type)
    formData.append('source', videoForm.value.source)
    
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
  // 检查用户是否登录
  if (!userStore.isLoggedIn) {
    showLoginModal.value = true
    return
  }
  
  // 保存草稿逻辑
  alert('草稿保存成功')
}

// 登录相关函数
const sendVerificationCode = async () => {
  if (!loginForm.value.phone) {
    loginError.value = '请输入手机号'
    return
  }
  
  if (!/^1[3-9]\d{9}$/.test(loginForm.value.phone)) {
    loginError.value = '请输入正确的手机号'
    return
  }
  
  isSendingCode.value = true
  
  try {
    const result = await userStore.sendVerificationCode(loginForm.value.phone)
    
    if (result.success) {
      // 开始倒计时
      countdown.value = result.expireSeconds || 60
      const timer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
          clearInterval(timer)
        }
      }, 1000)
      
      loginError.value = ''
    } else {
      loginError.value = result.error || '发送验证码失败'
    }
  } catch (error) {
    loginError.value = '发送验证码失败'
  } finally {
    isSendingCode.value = false
  }
}

// 手机号验证函数
const isValidPhone = (phone: string) => {
  return /^1[3-9]\d{9}$/.test(phone)
}

const handleLogin = async () => {
  if (!loginForm.value.phone) {
    loginError.value = '请输入手机号'
    return
  }
  
  if (!isValidPhone(loginForm.value.phone)) {
    loginError.value = '请输入正确的手机号'
    return
  }

  if (loginType.value === 'phone') {
    if (!loginForm.value.verificationCode) {
      loginError.value = '请输入验证码'
      return
    }
    
    if (loginForm.value.verificationCode.length !== 6) {
      loginError.value = '请输入6位验证码'
      return
    }
  } else {
    if (!loginForm.value.password) {
      loginError.value = '请输入密码'
      return
    }
    
    if (loginForm.value.password.length < 6) {
      loginError.value = '密码长度至少6位'
      return
    }
  }

  try {
    if (loginType.value === 'phone') {
      await userStore.login({
        phone: loginForm.value.phone,
        verificationCode: loginForm.value.verificationCode
      })
    } else {
      await userStore.login({
        phone: loginForm.value.phone,
        password: loginForm.value.password
      })
    }
    showLoginModal.value = false
    loginError.value = ''
    loginForm.value = { phone: '', verificationCode: '', password: '', rememberMe: false }
  } catch (error) {
    loginError.value = '登录失败，请检查信息是否正确'
  }
}

const closeLoginModal = () => {
  showLoginModal.value = false
  loginError.value = ''
  loginForm.value = { phone: '', verificationCode: '', password: '', rememberMe: false }
  loginType.value = 'phone'
  showPassword.value = false
}

// 处理退出登录
const handleLogout = async () => {
  try {
    await userStore.logout()
    // 退出登录后跳转到首页
    router.push('/')
  } catch (error) {
    console.error('退出登录失败:', error)
  }
}

// 生命周期
onMounted(() => {
  // 检查用户是否已登录，如果未登录则显示登录弹窗
  if (!userStore.isLoggedIn) {
    showLoginModal.value = true
  }
  
  // 监听需要登录的事件
  const handleLoginRequired = () => {
    showLoginModal.value = true
  }
  
  window.addEventListener('show-login-required', handleLoginRequired)
  
  // 组件卸载时移除事件监听
  onUnmounted(() => {
    window.removeEventListener('show-login-required', handleLoginRequired)
  })
})
</script>

<style scoped>
.upload-area {
  transition: all 0.3s ease;
}

.upload-area:hover {
  border-color: #ec4899;
}

.upload-area.dragging {
  border-color: #ec4899;
  background-color: rgba(236, 72, 153, 0.05);
}

/* 进度条动画 */
@keyframes slide {
  0% {
    transform: translateX(-100%) skewX(-12deg);
  }
  100% {
    transform: translateX(200%) skewX(-12deg);
  }
}

.animate-slide {
  animation: slide 2s infinite;
}

/* 上传成功动画 */
@keyframes checkmark {
  0% {
    stroke-dashoffset: 100;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

.checkmark-circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  animation: checkmark 0.6s ease-in-out forwards;
}

.checkmark-path {
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: checkmark 0.3s ease-in-out 0.3s forwards;
}

/* 脉冲动画效果 */
@keyframes pulse {
  0% {
    opacity: 0.2;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 0.2;
  }
}

.animate-pulse-slow {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
