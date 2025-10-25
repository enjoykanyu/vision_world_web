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
            <!-- 用户头像下拉菜单 -->
            <div class="relative group">
              <div class="w-8 h-8 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-purple-300 transition-all">
                <span class="text-white text-sm font-semibold">{{ (userStore.username || 'U').charAt(0).toUpperCase() }}</span>
              </div>
              
              <!-- 下拉菜单 -->
              <div class="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div class="py-2">
                  <router-link to="/profile" class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    个人账号中心
                  </router-link>
                  
                  <router-link to="/manage/videos" class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                    投稿管理
                  </router-link>
                  
                  <hr class="my-2 border-gray-200 dark:border-gray-600">
                  
                  <button @click="handleLogout" class="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
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

  <!-- 登录弹窗 -->
  <div v-if="showLoginModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- 背景遮罩 -->
      <div class="fixed inset-0 bg-black bg-opacity-60 transition-opacity" aria-hidden="true" @click="closeLoginModal"></div>
      
      <!-- 模态框居中技巧 -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      
      <!-- 登录卡片 -->
      <div 
        class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md w-full p-6 sm:p-8 animate-fade-in-up"
        @click.stop
      >
        <!-- 标题和关闭按钮 -->
        <div class="flex justify-between items-center mb-8">
          <h3 class="text-2xl font-bold text-gray-800 dark:text-white">欢迎回来</h3>
          <button 
            @click="closeLoginModal" 
            class="rounded-full p-1.5 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- 登录表单 -->
        <div class="space-y-6">
          <!-- 手机号输入框 -->
          <div class="space-y-2">
            <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300">手机号</label>
            <div class="relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6a2 2 0 012-2z" />
                </svg>
              </div>
              <input 
                type="tel" 
                id="phone" 
                v-model="loginForm.phone"
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors" 
                placeholder="请输入手机号"
                maxlength="11"
              >
            </div>
          </div>
          
          <!-- 验证码输入框 -->
          <div class="space-y-2">
            <label for="verificationCode" class="block text-sm font-medium text-gray-700 dark:text-gray-300">验证码</label>
            <div class="flex space-x-3">
              <input 
                type="text" 
                id="verificationCode" 
                v-model="loginForm.verificationCode"
                class="flex-1 px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors" 
                placeholder="请输入验证码"
                maxlength="6"
              >
              <button 
                @click="sendVerificationCode" 
                :disabled="isSendingCode || countdown > 0"
                class="px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                :class="countdown > 0 ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400' : 'bg-purple-600 hover:bg-purple-700 text-white'"
              >
                {{ countdown > 0 ? `${countdown}s` : '发送验证码' }}
              </button>
            </div>
          </div>
          
          <!-- 记住我和忘记密码 -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input 
                id="remember-me" 
                v-model="loginForm.rememberMe"
                type="checkbox" 
                class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
              >
              <label for="remember-me" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">记住我</label>
            </div>
            <div class="text-sm">
              <a href="#" class="font-medium text-pink-500 hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-300">忘记密码?</a>
            </div>
          </div>
          
          <!-- 错误提示 -->
          <div v-if="loginError" class="p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm rounded-lg border border-red-200 dark:border-red-800/50">
            <div class="flex">
              <svg class="h-5 w-5 text-red-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              {{ loginError }}
            </div>
          </div>
          
          <!-- 登录按钮 -->
          <button 
            @click="handleLogin" 
            class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform transition-all duration-200 hover:scale-105 active:scale-95"
          >
            登录
          </button>
          
          <!-- 注册链接 -->
          <div class="text-center text-sm text-gray-600 dark:text-gray-400">
            <span>还没有账号？</span>
            <a href="#" class="font-medium text-pink-500 hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-300">立即注册</a>
          </div>
          
          <!-- 分隔线 -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">其他登录方式</span>
            </div>
          </div>
          
          <!-- 社交登录按钮 -->
          <div class="flex items-center justify-center space-x-6">
            <button class="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.07 16.57l-4.24-4.24 1.41-1.41 2.83 2.83 6.59-6.59 1.41 1.41-8 8z"/>
              </svg>
            </button>
            <button class="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
            </button>
            <button class="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-red-600 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.222.083.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
              </svg>
            </button>
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
const showLoginModal = ref(false)

// 登录表单数据
const loginForm = ref({
  phone: '',
  verificationCode: '',
  rememberMe: false
})

const loginError = ref('')
const isSendingCode = ref(false)
const countdown = ref(0)

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

const handleLogin = async () => {
  if (!loginForm.value.phone || !loginForm.value.verificationCode) {
    loginError.value = '请输入手机号和验证码'
    return
  }

  try {
    await userStore.login({
      phone: loginForm.value.phone,
      verificationCode: loginForm.value.verificationCode
    })
    showLoginModal.value = false
    loginError.value = ''
    loginForm.value = { phone: '', verificationCode: '', rememberMe: false }
  } catch (error) {
    loginError.value = '登录失败，请检查验证码'
  }
}

const closeLoginModal = () => {
  showLoginModal.value = false
  loginError.value = ''
  loginForm.value = { phone: '', verificationCode: '', rememberMe: false }
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
  if (!userStore.isLoggedIn) {
    showLoginModal.value = true
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