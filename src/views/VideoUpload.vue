<template>
  <div class="video-upload">
    <!-- 发布成功动画 -->
    <SuccessAnimation 
      :visible="successVisible" 
      :video-title="videoForm.title"
      @close="successVisible = false"
    />
    
    <!-- 主要内容区域 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- 投稿类型导航 -->
      <div class="bg-white border border-gray-200 mb-6">
        <div class="px-6 py-4 border-b border-gray-200">
          <h1 class="text-xl font-semibold text-bilibili-primary">投稿</h1>
        </div>
        <div class="px-6 py-0">
          <div class="flex space-x-8 border-b border-gray-200">
            <button class="py-3 px-1 border-b-2 border-bilibili-primary text-bilibili-primary font-medium">视频投稿</button>
            <button class="py-3 px-1 border-b-2 border-transparent text-gray-500 hover:text-bilibili-primary hover:border-bilibili-primary/50 transition-colors duration-200">短剧投稿</button>
            <button class="py-3 px-1 border-b-2 border-transparent text-gray-500 hover:text-bilibili-primary hover:border-bilibili-primary/50 transition-colors duration-200">专栏投稿</button>
            <button class="py-3 px-1 border-b-2 border-transparent text-gray-500 hover:text-bilibili-primary hover:border-bilibili-primary/50 transition-colors duration-200">互动视频投稿</button>
            <button class="py-3 px-1 border-b-2 border-transparent text-gray-500 hover:text-bilibili-primary hover:border-bilibili-primary/50 transition-colors duration-200">音频投稿</button>
          </div>
        </div>
      </div>

      <!-- 视频上传和信息设置 -->
      <div class="bg-white border border-gray-200 mb-6">
        <div class="p-6">
          <!-- 视频大小、格式、分辨率提示 -->
          <div class="bg-white border border-gray-200 rounded-lg mb-6 p-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="flex items-start space-x-3">
                <div class="w-8 h-8 bg-bilibili-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-bilibili-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-bilibili-primary">视频大小</h3>
                  <p class="text-sm text-gray-600">视频大小1GB以内，时长10小时以内<br>粉丝数 ≥ 1000，可自动解锁6GB超大文件</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div class="w-8 h-8 bg-bilibili-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-bilibili-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-bilibili-primary">视频格式</h3>
                  <p class="text-sm text-gray-600">推荐上传 MP4/MOV/MKV 格式，转码更快，过审更顺利</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div class="w-8 h-8 bg-bilibili-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-bilibili-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-bilibili-primary">视频分辨率</h3>
                  <p class="text-sm text-gray-600">推荐分辨率：1080P、4K，高分辨率更清晰流畅</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 拖拽上传区域 -->
          <div 
            class="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center hover:border-bilibili-primary cursor-pointer bg-white transition-all duration-300 mb-8"
            :class="{ 'border-bilibili-primary bg-bilibili-primary/5': isDragging }"
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
            
            <div v-if="!selectedFile && !uploadProgress" class="flex flex-col items-center">
              <div class="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <svg class="w-12 h-12 text-bilibili-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                </svg>
              </div>
              <p class="text-lg font-medium text-gray-900 mb-3">点击上传或拖拽视频到此处</p>
              <p class="text-gray-500 mb-8">支持MP4、MOV、MKV等格式，单个文件不超过2GB</p>
              <button class="bg-bilibili-primary hover:bg-bilibili-primary/90 text-white px-8 py-3 rounded-full transition-all duration-200 font-medium">
                上传视频
              </button>
            </div>
            
            <div v-else-if="selectedFile && !uploadProgress" class="text-center">
              <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg class="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <p class="text-lg font-medium text-gray-900 mb-2">{{ selectedFile.name }}</p>
              <p class="text-gray-500 mb-8">{{ formatFileSize(selectedFile.size) }}</p>
              <div class="flex justify-center space-x-4">
                <button @click.stop="startUpload" class="bg-bilibili-primary hover:bg-bilibili-primary/90 text-white px-8 py-3 rounded-full transition-all duration-200 font-medium">
                  开始上传
                </button>
                <button @click.stop="resetFile" class="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-8 py-3 rounded-full transition-all duration-200 font-medium">
                  重新选择
                </button>
              </div>
            </div>
            
            <div v-else-if="uploadProgress" class="w-full">
              <div class="mb-6">
                <div class="flex justify-between text-sm text-gray-600 mb-3">
                  <span>上传中...</span>
                  <span>{{ uploadProgress }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    class="bg-bilibili-primary h-3 rounded-full transition-all duration-500 ease-out" 
                    :style="{ width: uploadProgress + '%' }"
                  ></div>
                </div>
                <div class="mt-3 flex justify-between text-xs text-gray-500">
                  <div>
                    <span>正在上传视频文件...</span>
                    <span v-if="uploadProgress < 100" class="ml-2">剩余时间: {{ formatRemainingTime(remainingTime) }}</span>
                  </div>
                  <div class="flex items-center">
                    <span v-if="uploadProgress < 100" class="mr-2">速度: {{ formatUploadSpeed(uploadSpeed) }}</span>
                    <span v-if="uploadProgress < 100">请勿关闭页面</span>
                    <span v-else class="text-green-600">上传完成!</span>
                  </div>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <button @click.stop="cancelUpload" class="text-red-600 hover:text-red-700 text-sm flex items-center transition-colors duration-200">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  取消上传
                </button>
                <div v-if="uploadProgress === 100" class="flex items-center text-green-600">
                  <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>上传成功</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 视频预览和基本信息 -->
          <div v-if="uploadedVideoId" class="mb-8">
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
              <div class="flex items-center space-x-4">
                <div class="w-24 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
                  <video 
                    :src="videoPreviewUrl" 
                    controls 
                    class="w-full h-full object-cover"
                  ></video>
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-900 dark:text-white">{{ videoForm.title || selectedFile?.name }}</div>
                  <div class="text-xs text-green-600 dark:text-green-400">上传完成</div>
                </div>
              </div>
              <div class="mt-4 md:mt-0">
                <button @click="resetFile" class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200">
                  <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                  重新上传视频
                </button>
              </div>
            </div>
          </div>
          
          <!-- 基本设置 -->
          <div class="mb-8">
            <h3 class="text-base font-medium text-gray-900 dark:text-white mb-4">基本设置</h3>
            
            <!-- 封面设置 -->
            <div class="mb-8">
              <label class="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                <span class="text-red-500">*</span> 封面
              </label>
              <div class="flex items-start space-x-4">
                <div 
                  @click="triggerCoverInput"
                  class="relative group w-40 h-28 border border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-bilibili-primary overflow-hidden bg-white transition-all duration-200"
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
                    class="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                  >
                  <div v-else class="text-center">
                    <div class="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-2">
                      <svg class="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">点击上传封面</p>
                  </div>
                </div>
                <div class="flex-1">
                  <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">建议尺寸 16:9，大小不超过 2MB</p>
                  <button 
                  v-if="coverPreview"
                  @click="cropCover"
                  class="px-4 py-2 text-sm bg-bilibili-primary hover:bg-bilibili-primary/90 text-white rounded-lg mr-2 transition-colors duration-200 font-medium"
                >
                  裁剪封面
                </button>
                <button 
                  v-if="coverPreview"
                  @click="removeCover"
                  class="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors duration-200 font-medium"
                >
                  移除封面
                </button>
                </div>
              </div>
            </div>
            
            <!-- 标题 -->
          <div class="mb-8">
            <label class="block text-sm font-medium text-gray-900 mb-3">
              <span class="text-red-500">*</span> 标题
            </label>
            <div class="relative">
              <input 
                v-model="videoForm.title"
                type="text" 
                maxlength="80"
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-bilibili-primary focus:border-bilibili-primary bg-white text-gray-900 text-base transition-colors duration-200"
                placeholder="请输入视频标题，建议包含关键词"
              >
              <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm px-2 py-1 rounded-full" 
                   :class="videoForm.title.length > 70 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'">
                {{ videoForm.title.length }}/80
              </div>
            </div>
            <p v-if="formErrors.title" class="mt-2 text-sm text-red-600">{{ formErrors.title }}</p>
          </div>
            
            <!-- 视频类型 -->
            <div class="mb-8">
              <label class="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                类型
              </label>
              <div class="flex space-x-8">
                <label class="flex items-center cursor-pointer group">
                  <div class="relative">
                    <input 
                      v-model="videoForm.type" 
                      type="radio" 
                      value="original" 
                      class="sr-only peer"
                    >
                    <div class="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-full peer-checked:border-pink-500 peer-checked:bg-pink-500 transition-all duration-200 group-hover:border-pink-300 dark:group-hover:border-pink-700">
                      <div class="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity duration-200"></div>
                    </div>
                  </div>
                  <span class="ml-3 text-gray-700 dark:text-gray-300 text-sm transition-colors duration-200 group-hover:text-pink-600 dark:group-hover:text-pink-400">自制</span>
                </label>
                <label class="flex items-center cursor-pointer group">
                  <div class="relative">
                    <input 
                      v-model="videoForm.type" 
                      type="radio" 
                      value="repost" 
                      class="sr-only peer"
                    >
                    <div class="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-full peer-checked:border-pink-500 peer-checked:bg-pink-500 transition-all duration-200 group-hover:border-pink-300 dark:group-hover:border-pink-700">
                      <div class="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity duration-200"></div>
                    </div>
                  </div>
                  <span class="ml-3 text-gray-700 dark:text-gray-300 text-sm transition-colors duration-200 group-hover:text-pink-600 dark:group-hover:text-pink-400">转载</span>
                </label>
              </div>
            </div>
          </div>
          
          <!-- 详细信息 -->
          <div class="mb-8">
            <h3 class="text-base font-medium text-gray-900 dark:text-white mb-4">详细信息</h3>
            
            <!-- 分区 -->
          <div class="mb-8">
            <label class="block text-sm font-medium text-gray-900 mb-3">
              <span class="text-red-500">*</span> 分区
            </label>
            <div class="relative">
              <select 
                v-model="videoForm.category" 
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-bilibili-primary focus:border-bilibili-primary bg-white text-gray-900 appearance-none text-base transition-colors duration-200"
              >
                <option value="">请选择分区</option>
                <option value="game">游戏</option>
                <option value="music">音乐</option>
                <option value="dance">舞蹈</option>
                <option value="tech">科技数码</option>
                <option value="life">生活</option>
                <option value="food">美食</option>
                <option value="animal">动物圈</option>
                <option value="sport">运动</option>
                <option value="movie">影视</option>
                <option value="entertainment">娱乐</option>
                <option value="knowledge">知识</option>
                <option value="fashion">时尚</option>
                <option value="travel">旅行</option>
                <option value="car">汽车</option>
                <option value="finance">财经</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
            <p v-if="formErrors.category" class="mt-2 text-sm text-red-600">{{ formErrors.category }}</p>
          </div>
            
            <!-- 标签 -->
            <div class="mb-8">
              <label class="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                <span class="text-red-500">*</span> 标签
                <span class="text-xs text-gray-500 dark:text-gray-400 ml-2">按回车键Enter创建标签</span>
              </label>
              <div class="flex flex-wrap gap-2 mb-4">
                <span 
                  v-for="tag in videoForm.tags" 
                  :key="tag"
                  class="inline-flex items-center px-3 py-1 rounded-lg text-sm bg-bilibili-primary text-white transition-colors duration-200"
                >
                  {{ tag }}
                  <button @click="removeTag(tag)" class="ml-2 text-white/80 hover:text-white transition-colors duration-200">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                  </button>
                </span>
              </div>
              
              <!-- 热门标签推荐 -->
            <div class="mb-4">
              <p class="text-sm text-gray-600 mb-3">推荐标签</p>
              <div class="flex flex-wrap gap-2">
                <button 
                  v-for="tag in popularTags" 
                  :key="tag"
                  @click="addPopularTag(tag)"
                  :class="[
                    'px-3 py-1 rounded-lg text-sm transition-colors duration-200',
                    videoForm.tags.includes(tag) 
                      ? 'bg-bilibili-primary text-white' 
                      : 'bg-white border border-gray-200 hover:border-bilibili-primary text-gray-700 hover:text-bilibili-primary'
                  ]"
                >
                  {{ tag }}
                </button>
              </div>
                <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  还可以添加{{ 10 - videoForm.tags.length }}个标签
                </div>
              </div>
              
              <!-- 标签输入框 -->
              <div class="flex">
                <div class="relative flex-1">
                  <input 
                    v-model="newTag"
                    type="text"
                    maxlength="20"
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-bilibili-primary focus:border-bilibili-primary bg-white text-gray-900 text-base transition-colors duration-200"
                    placeholder="输入标签后按回车或点击添加"
                    @keyup.enter="addTag"
                  >
                </div>
              </div>
              <p v-if="formErrors.tags" class="mt-2 text-sm text-red-600 dark:text-red-400">{{ formErrors.tags }}</p>
            </div>
            
            <!-- 简介 -->
          <div class="mb-8">
            <label class="block text-sm font-medium text-gray-900 mb-3">
              简介
            </label>
            <div class="relative">
              <textarea 
                v-model="videoForm.description"
                rows="4"
                maxlength="2000"
                class="w-full px-4 py-3 pr-20 border border-gray-200 rounded-lg focus:ring-1 focus:ring-bilibili-primary focus:border-bilibili-primary bg-white text-gray-900 resize-y text-base transition-colors duration-200"
                placeholder="填写更全面的相关信息，让更多的人能找到你的视频吧"
              ></textarea>
              <div class="absolute right-3 bottom-3 text-sm px-2 py-1 rounded-full" 
                   :class="videoForm.description.length > 1800 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'">
                {{ videoForm.description.length }}/2000
              </div>
            </div>
          </div>
            
            <!-- 参与话题 -->
            <div class="mb-8">
              <label class="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                参与话题：
              </label>
              <div class="flex flex-wrap gap-2 mb-4">
                <button 
                  v-for="topic in popularTopics" 
                  :key="topic"
                  class="px-3 py-1.5 rounded-full text-sm bg-bilibili-primary text-white transition-colors duration-200 hover:bg-bilibili-primary/90"
                >
                  {{ topic }}
                  <span class="ml-1 text-xs text-white/80">（活动）</span>
                </button>
              </div>
              <button class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200">
                搜索更多话题 →
              </button>
            </div>
            
            <!-- 定时发布 -->
            <div class="mb-8">
              <div class="flex items-center justify-between mb-3">
                <label class="block text-sm font-medium text-gray-900 dark:text-white">
                  定时发布
                </label>
                <div class="relative inline-block w-10 mr-2 align-middle select-none">
                  <input 
                    v-model="publishSettings.scheduled" 
                    type="checkbox" 
                    class="sr-only peer"
                  >
                  <div class="block bg-gray-200 dark:bg-gray-700 w-10 h-5 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                可选择距离当前最早≥2小时/最晚≤15天的时间，火花稿件或距发布不足5分钟时不可修改/取消
              </div>
              <div class="mt-3" v-if="publishSettings.scheduled">
                <input 
                  v-model="publishSettings.scheduledTime"
                  type="datetime-local"
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-bilibili-primary focus:border-bilibili-primary bg-white text-gray-900 text-base transition-colors duration-200"
                >
              </div>
            </div>
          </div>
          
          <!-- 发布按钮 -->
          <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button 
              @click="saveAsDraft"
              :disabled="isPublishing || !uploadedVideoId"
              class="px-6 py-3 bg-white border border-gray-200 hover:bg-gray-50 disabled:bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors duration-200 disabled:opacity-60 text-base"
            >
              存草稿
            </button>
            <button 
              @click="submitVideo"
              :disabled="!canSubmit || isPublishing"
              class="px-6 py-3 bg-bilibili-primary hover:bg-bilibili-primary/90 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-60 text-base flex items-center justify-center"
            >
              <span v-if="isPublishing" class="mr-2 animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              {{ isPublishing ? '投稿中...' : '立即投稿' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { videoAPI } from '@/api/video'
import SuccessAnimation from '@/components/SuccessAnimation.vue'

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

// 上传控制变量
let progressInterval: number | null = null // 进度更新定时器
let finalProgress: number | null = null // 最终进度定时器
let abortController: AbortController | null = null // 用于取消上传请求

// 视频表单
const videoForm = ref({
  title: '',
  description: '',
  category: '',
  tags: [] as string[],
  type: 'original',
  source: ''
})

// 表单验证错误
const formErrors = ref({
  title: '',
  category: '',
  tags: ''
})

// 热门标签
const popularTags = [
  '热门', '原创', '精选', '搞笑', '生活', '美食', '旅行', '音乐', 
  '游戏', '舞蹈', '科技', '知识', '萌宠', '运动', '时尚', '影视'
]

// 热门话题
const popularTopics = [
  '家是关于爱的表达', '开箱爷爷粉喜欢的家', '把兴趣玩出名堂', '网友车衣俱乐部'
]

const newTag = ref('')
const isEditing = ref(false)
const showLoginModal = ref(false)

// 发布设置
const publishSettings = ref({
  scheduled: false,
  scheduledTime: '',
  allowSecondaryCreation: false,
  allowCommercial: false
})

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

// 加载状态
const isLoading = ref(false)
const isPublishing = ref(false)
const successVisible = ref(false)

// 计算属性
const canSubmit = computed(() => {
  // 简化逻辑，只检查uploadedVideoId、登录状态和表单错误
  // 表单错误已经包含了对标题、分区和标签的验证
  return uploadedVideoId.value && 
         userStore.isLoggedIn &&
         !formErrors.value.title &&
         !formErrors.value.category &&
         !formErrors.value.tags
})

// 表单验证
const validateForm = () => {
  let isValid = true
  
  // 重置错误信息
  formErrors.value = {
    title: '',
    category: '',
    tags: ''
  }
  
  // 验证标题
  if (!videoForm.value.title.trim()) {
    formErrors.value.title = '标题不能为空'
    isValid = false
  } else if (videoForm.value.title.length > 80) {
    formErrors.value.title = '标题不能超过80个字符'
    isValid = false
  }
  
  // 验证分区
  if (!videoForm.value.category) {
    formErrors.value.category = '请选择分区'
    isValid = false
  }
  
  // 验证标签
  if (videoForm.value.tags.length === 0) {
    formErrors.value.tags = '请至少添加一个标签'
    isValid = false
  } else if (videoForm.value.tags.length > 10) {
    formErrors.value.tags = '最多添加10个标签'
    isValid = false
  }
  
  return isValid
}

// 监听表单变化，自动更新错误状态
watch(
  () => [videoForm.value.title, videoForm.value.category, videoForm.value.tags],
  () => {
    validateForm()
  },
  { deep: true }
)

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
  showCropModal.value = false
}

// 移除封面
const removeCover = () => {
  coverFile.value = null
  coverPreview.value = ''
}

// 移除标签
const removeTag = (tag: string) => {
  const index = videoForm.value.tags.indexOf(tag)
  if (index > -1) {
    videoForm.value.tags.splice(index, 1)
  }
}

// 添加标签
const addTag = () => {
  if (newTag.value && newTag.value.trim()) {
    const tag = newTag.value.trim()
    if (!videoForm.value.tags.includes(tag) && videoForm.value.tags.length < 10) {
      videoForm.value.tags.push(tag)
      newTag.value = ''
    }
  }
}

// 添加热门标签
const addPopularTag = (tag: string) => {
  if (!videoForm.value.tags.includes(tag) && videoForm.value.tags.length < 10) {
    videoForm.value.tags.push(tag)
  }
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 格式化剩余时间
const formatRemainingTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}秒`
  } else if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}分${seconds % 60}秒`
  } else {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}小时${minutes}分`
  }
}

// 格式化上传速度
const formatUploadSpeed = (speed: number): string => {
  if (speed < 1024) {
    return `${Math.round(speed)} KB/s`
  } else {
    return `${(speed / 1024).toFixed(1)} MB/s`
  }
}

// 开始上传
const startUpload = () => {
  if (!selectedFile.value) return
  
  // 重置进度
  uploadProgress.value = 0
  uploadSpeed.value = 0
  remainingTime.value = 0
  uploadStartTime.value = Date.now()
  lastProgressTime.value = Date.now()
  lastProgressValue.value = 0
  
  // 模拟上传进度
  progressInterval = window.setInterval(() => {
    const now = Date.now()
    const elapsed = now - lastProgressTime.value
    
    // 计算进度增量
    const progressIncrement = Math.random() * 5
    uploadProgress.value = Math.min(uploadProgress.value + progressIncrement, 90) // 先到90%
    
    // 计算速度
    const progressDiff = uploadProgress.value - lastProgressValue.value
    uploadSpeed.value = (progressDiff / elapsed) * 1000 * (selectedFile.value?.size || 1) / 1024 / 1024
    
    // 计算剩余时间
    const remainingProgress = 100 - uploadProgress.value
    if (uploadSpeed.value > 0) {
      remainingTime.value = Math.round((remainingProgress / progressDiff) * (elapsed / 1000))
    }
    
    // 更新上次进度时间和值
    lastProgressTime.value = now
    lastProgressValue.value = uploadProgress.value
    
  }, 1000) as unknown as number
  
  // 模拟最终完成
  finalProgress = window.setTimeout(() => {
    // 清除进度更新定时器
    if (progressInterval) {
      clearInterval(progressInterval)
      progressInterval = null
    }
    
    // 快速到100%
    uploadProgress.value = 100
    uploadSpeed.value = 0
    remainingTime.value = 0
    
    // 模拟上传成功
    setTimeout(() => {
      // 生成模拟的视频ID
      uploadedVideoId.value = Math.floor(Math.random() * 1000000000).toString()
      // 生成预览URL
      videoPreviewUrl.value = URL.createObjectURL(selectedFile.value as File)
    }, 500)
  }, 8000) as unknown as number
}

// 取消上传
const cancelUpload = () => {
  // 清除所有定时器
  if (progressInterval) {
    clearInterval(progressInterval)
    progressInterval = null
  }
  if (finalProgress) {
    clearTimeout(finalProgress)
    finalProgress = null
  }
  
  // 重置进度
  uploadProgress.value = 0
  uploadSpeed.value = 0
  remainingTime.value = 0
}

// 重置文件
const resetFile = () => {
  selectedFile.value = null
  coverFile.value = null
  coverPreview.value = ''
  uploadedVideoId.value = ''
  videoPreviewUrl.value = ''
  uploadProgress.value = 0
  
  // 清除所有定时器
  if (progressInterval) {
    clearInterval(progressInterval)
    progressInterval = null
  }
  if (finalProgress) {
    clearTimeout(finalProgress)
    finalProgress = null
  }
}

// 保存为草稿
const saveAsDraft = () => {
  // 这里可以实现保存草稿的逻辑
  alert('草稿保存功能待实现')
}

// 提交视频
const submitVideo = async () => {
  if (!validateForm()) return
  
  isPublishing.value = true
  
  try {
    // 这里可以调用实际的API提交视频
    // const response = await videoAPI.publishVideo(uploadedVideoId.value, videoForm.value)
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 显示成功动画
    successVisible.value = true
    
    // 重置表单
    setTimeout(() => {
      resetFile()
      videoForm.value = {
        title: '',
        description: '',
        category: '',
        tags: [],
        type: 'original',
        source: ''
      }
      formErrors.value = {
        title: '',
        category: '',
        tags: ''
      }
    }, 3000)
    
  } catch (error) {
    console.error('投稿失败:', error)
    alert('投稿失败，请重试')
  } finally {
    isPublishing.value = false
  }
}

// 登录相关方法
const isValidPhone = (phone: string): boolean => {
  // 简化的手机号验证
  return /^1[3-9]\d{9}$/.test(phone)
}

const sendVerificationCode = async () => {
  if (!isValidPhone(loginForm.value.phone)) return
  
  isSendingCode.value = true
  
  try {
    // 这里可以调用实际的API发送验证码
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 开始倒计时
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
    
  } catch (error) {
    console.error('发送验证码失败:', error)
    alert('发送验证码失败，请重试')
  } finally {
    isSendingCode.value = false
  }
}

const handleLogin = async () => {
  if (!isValidPhone(loginForm.value.phone)) return
  
  isSendingCode.value = true
  
  try {
    // 这里可以调用实际的API登录
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 模拟登录成功
    userStore.login('mock-token', { username: 'testuser', avatar: '', id: '123' })
    closeLoginModal()
    
  } catch (error) {
    console.error('登录失败:', error)
    loginError.value = '登录失败，请检查账号密码'
  } finally {
    isSendingCode.value = false
  }
}

const closeLoginModal = () => {
  showLoginModal.value = false
}

// 组件卸载时清理定时器
onUnmounted(() => {
  if (progressInterval) {
    clearInterval(progressInterval)
  }
  if (finalProgress) {
    clearTimeout(finalProgress)
  }
  // 释放ObjectURL
  if (videoPreviewUrl.value) {
    URL.revokeObjectURL(videoPreviewUrl.value)
  }
})
</script>

<style scoped>
/* 发布成功动画容器 */
.success-animation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  pointer-events: none;
}
</style>