<template>
  <div class="min-h-screen bg-gray-50">
    <NavHeader 
      :isLoggedIn="userStore.isLoggedIn" 
      :username="userStore.username" 
      @login="showLoginModal = true"
    />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="bg-white rounded-lg shadow-sm overflow-hidden" style="height: calc(100vh - 140px);">
        <div class="flex h-full">
          <!-- 左侧分类列表 -->
          <div class="w-80 border-r border-gray-200 flex flex-col">
            <!-- 搜索栏 -->
            <div class="p-4 border-b border-gray-200">
              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="搜索联系人..."
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bilibili-primary focus:border-transparent"
                >
                <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
            </div>

            <!-- 消息分类列表 -->
            <div class="flex-1 overflow-y-auto">
              <!-- 系统通知分类 -->
              <div class="mb-2">
                <div class="px-4 py-2 bg-gradient-to-r from-orange-50 to-red-50 border-b border-orange-100">
                  <div class="flex items-center space-x-2">
                    <div class="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                      <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                    <span class="text-sm font-bold text-orange-700">系统通知</span>
                    <span v-if="systemNotificationCount > 0" class="inline-flex items-center justify-center min-w-[18px] h-4 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full">
                      {{ systemNotificationCount }}
                    </span>
                  </div>
                </div>
                
                <!-- 系统通知项 -->
                <div
                  @click="selectSystemNotifications"
                  :class="[
                    'flex items-center p-3 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 cursor-pointer transition-all duration-300 border-l-4 border-transparent hover:border-orange-400',
                    selectedCategory === 'system' ? 'bg-gradient-to-r from-orange-100 to-red-100 border-l-4 border-orange-500 shadow-sm' : ''
                  ]"
                >
                  <div class="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-md">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div class="ml-3 flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                      <p :class="[
                        'text-sm font-medium truncate transition-colors duration-200',
                        selectedCategory === 'system' ? 'text-orange-600' : 'text-gray-900'
                      ]">VisionWorld 官方</p>
                      <p class="text-xs text-gray-500 font-medium">{{ formatTime(latestSystemNotificationTime) }}</p>
                    </div>
                    <div class="flex items-center justify-between mt-1">
                      <p class="text-sm text-gray-600 truncate">{{ latestSystemNotificationContent }}</p>
                      <span
                        v-if="systemNotificationCount > 0"
                        class="inline-flex items-center justify-center min-w-[20px] h-5 px-2 text-xs font-bold leading-none text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-sm animate-pulse"
                      >
                        {{ systemNotificationCount }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 我的消息分类 -->
              <div>
                <div class="px-4 py-2 bg-gradient-to-r from-bilibili-primary/10 to-pink-50 border-b border-bilibili-primary/20">
                  <div class="flex items-center space-x-2">
                    <div class="w-6 h-6 bg-gradient-to-r from-bilibili-primary to-pink-500 rounded-full flex items-center justify-center">
                      <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                    <span class="text-sm font-bold text-bilibili-primary">我的消息</span>
                    <span v-if="totalUserMessageCount > 0" class="inline-flex items-center justify-center min-w-[18px] h-4 px-1.5 text-xs font-bold text-white bg-bilibili-primary rounded-full">
                      {{ totalUserMessageCount }}
                    </span>
                  </div>
                </div>
                
                <!-- 用户消息列表 -->
                <div
                  v-for="contact in userContacts"
                  :key="contact.id"
                  @click="selectContact(contact)"
                  :class="[
                    'flex items-center p-3 hover:bg-gradient-to-r hover:from-bilibili-primary/5 hover:to-pink-50 cursor-pointer transition-all duration-300 border-l-4 border-transparent hover:border-bilibili-primary/30',
                    selectedContact?.id === contact.id && selectedCategory === 'user' ? 'bg-gradient-to-r from-bilibili-primary/10 to-pink-50 border-l-4 border-bilibili-primary shadow-sm' : ''
                  ]"
                >
                  <div class="relative">
                    <img :src="contact.avatar" :alt="contact.name" class="w-10 h-10 rounded-full shadow-md ring-2 ring-white">
                    <!-- 在线状态 -->
                    <div
                      v-if="contact.online"
                      class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"
                    ></div>
                    <!-- 离线状态 -->
                    <div
                      v-else
                      class="absolute bottom-0 right-0 w-3 h-3 bg-gray-400 border-2 border-white rounded-full"
                    ></div>
                  </div>
                  <div class="ml-3 flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                      <p :class="[
                        'text-sm font-medium truncate transition-colors duration-200',
                        selectedContact?.id === contact.id && selectedCategory === 'user' ? 'text-bilibili-primary' : 'text-gray-900'
                      ]">{{ contact.name }}</p>
                      <p class="text-xs text-gray-500 font-medium">{{ formatTime(contact.lastMessageTime) }}</p>
                    </div>
                    <div class="flex items-center justify-between mt-1">
                      <p :class="[
                        'text-sm truncate transition-colors duration-200',
                        contact.unreadCount > 0 ? 'text-gray-800 font-medium' : 'text-gray-500'
                      ]">{{ contact.lastMessage }}</p>
                      <div class="flex items-center space-x-2">
                        <!-- 未读消息数 -->
                        <span
                          v-if="contact.unreadCount > 0"
                          class="inline-flex items-center justify-center min-w-[18px] h-4 px-1.5 text-xs font-bold leading-none text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-sm animate-pulse"
                        >
                          {{ contact.unreadCount > 99 ? '99+' : contact.unreadCount }}
                        </span>
                        <!-- VIP标识 -->
                        <div
                          v-if="contact.isVip"
                          class="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
                        >
                          <span class="text-white text-xs font-bold">V</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧聊天区域 -->
          <div class="flex-1 flex flex-col">
            <template v-if="selectedCategory === 'system' || selectedContact">
              <!-- 聊天头部 -->
              <div class="p-4 border-b border-gray-200 bg-white">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div v-if="selectedCategory === 'system'" class="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-md">
                      <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                    <img v-else :src="selectedContact?.avatar" :alt="selectedContact?.name" class="w-10 h-10 rounded-full">
                    <div class="ml-3">
                      <h3 class="text-lg font-medium text-gray-900">
                        {{ selectedCategory === 'system' ? 'VisionWorld 官方' : selectedContact?.name }}
                      </h3>
                      <p class="text-sm text-gray-500">
                        {{ selectedCategory === 'system' ? '系统通知' : (selectedContact?.online ? '在线' : `最后活跃时间 ${formatTime(selectedContact?.lastSeen || '')}`) }}
                      </p>
                    </div>
                  </div>
                  <div v-if="selectedCategory !== 'system'" class="flex items-center space-x-2">
                    <button class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                      </svg>
                    </button>
                    <button class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                      </svg>
                    </button>
                    <button class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- 消息列表 -->
              <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-gray-100">
                <div
                  v-for="message in currentMessages"
                  :key="message.id"
                  :class="[
                    'flex items-end space-x-2',
                    message.type === 'system' ? 'justify-center' : 
                    message.senderId === userStore.userId ? 'justify-end' : 'justify-start'
                  ]"
                >
                  <!-- 系统通知消息 -->
                  <div v-if="message.type === 'system'" class="flex justify-center w-full my-6">
                    <div class="relative max-w-md">
                      <!-- 系统通知背景装饰 -->
                      <div class="absolute inset-0 bg-gradient-to-r from-orange-400/20 via-red-400/20 to-pink-400/20 rounded-2xl blur-lg"></div>
                      
                      <!-- 系统通知内容 -->
                      <div class="relative bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 border-2 border-orange-200/60 text-gray-800 px-6 py-4 rounded-2xl shadow-xl backdrop-blur-sm">
                        <!-- 系统通知头部 -->
                        <div class="flex items-center space-x-3 mb-3">
                          <!-- 官方认证图标 -->
                          <div class="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                            </svg>
                          </div>
                          
                          <!-- 系统通知标题 -->
                          <div class="flex-1">
                            <div class="flex items-center space-x-2">
                              <span class="text-sm font-bold text-orange-600">系统通知</span>
                              <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            </div>
                            <span class="text-xs text-gray-500">VisionWorld 官方</span>
                          </div>
                          
                          <!-- 时间戳 -->
                          <span class="text-xs text-gray-400 font-medium">{{ formatTime(message.timestamp) }}</span>
                        </div>
                        
                        <!-- 系统通知内容 -->
                        <div class="bg-white/60 rounded-lg p-3 border border-orange-100">
                          <p class="text-sm text-gray-700 leading-relaxed">{{ message.content }}</p>
                        </div>
                        
                        <!-- 操作按钮 -->
                        <div class="flex justify-end mt-3 space-x-2">
                          <button class="px-3 py-1 text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200">
                            忽略
                          </button>
                          <button class="px-4 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-sm hover:shadow-md">
                            查看详情
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- 普通消息 -->
                  <template v-else>
                    <!-- 对方头像 (仅在对方消息时显示) -->
                    <img 
                      v-if="message.senderId !== userStore.userId" 
                      :src="selectedContact?.avatar" 
                      :alt="selectedContact?.name"
                      class="w-8 h-8 rounded-full shadow-sm flex-shrink-0"
                    >
                    
                    <!-- 消息气泡 -->
                    <div class="flex flex-col max-w-xs lg:max-w-md">
                      <!-- 发送者名称 (仅在对方消息时显示) -->
                      <span 
                        v-if="message.senderId !== userStore.userId" 
                        class="text-xs text-gray-500 mb-1 ml-3"
                      >
                        {{ selectedContact?.name }}
                      </span>
                      
                      <div
                        :class="[
                          'relative px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md',
                          message.senderId === userStore.userId
                            ? 'bg-gradient-to-r from-bilibili-primary to-pink-500 text-white rounded-br-md shadow-lg hover:shadow-xl'
                            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md hover:border-gray-300'
                        ]"
                      >
                        <!-- 消息类型标识 -->
                        <div v-if="message.senderId === userStore.userId" class="flex items-center mb-1">
                          <div class="w-2 h-2 bg-white/80 rounded-full mr-2"></div>
                          <span class="text-xs text-white/80 font-medium">我</span>
                        </div>
                        
                        <!-- 消息内容 -->
                        <p class="text-sm leading-relaxed break-words">{{ message.content }}</p>
                        
                        <!-- 时间戳 -->
                        <div class="flex items-center justify-end mt-2">
                          <span
                            :class="[
                              'text-xs',
                              message.senderId === userStore.userId 
                                ? 'text-white/80' 
                                : 'text-gray-500'
                            ]"
                          >
                            {{ formatTime(message.timestamp) }}
                          </span>
                          
                          <!-- 消息状态 (仅我的消息显示) -->
                          <div 
                            v-if="message.senderId === userStore.userId" 
                            class="ml-2 flex items-center"
                          >
                            <!-- 已读状态 -->
                            <svg 
                              v-if="message.status === 'read'" 
                              class="w-4 h-4 text-white/80" 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                              <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L4 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                            </svg>
                            <!-- 已发送状态 -->
                            <svg 
                              v-else-if="message.status === 'sent'" 
                              class="w-4 h-4 text-white/80" 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                            </svg>
                            <!-- 发送中状态 -->
                            <div 
                              v-else 
                              class="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin"
                            ></div>
                          </div>
                        </div>
                        
                        <!-- 消息气泡尾巴 -->
                        <div
                          :class="[
                            'absolute bottom-0 w-3 h-3',
                            message.senderId === userStore.userId
                              ? 'right-0 transform translate-x-1 bg-gradient-to-r from-bilibili-primary to-pink-500'
                              : 'left-0 transform -translate-x-1 bg-white border-l border-b border-gray-200'
                          ]"
                          style="clip-path: polygon(0 0, 100% 100%, 0 100%)"
                        ></div>
                      </div>
                    </div>
                    
                    <!-- 我的头像 (仅在我的消息时显示) -->
                    <div 
                      v-if="message.senderId === userStore.userId" 
                      class="w-8 h-8 bg-gradient-to-br from-bilibili-primary to-pink-500 rounded-full flex items-center justify-center shadow-sm flex-shrink-0"
                    >
                      <span class="text-white text-xs font-semibold">
                        {{ userStore.username?.charAt(0).toUpperCase() || 'M' }}
                      </span>
                    </div>
                  </template>
                </div>
              </div>

              <!-- 消息输入区域 (仅用户消息显示) -->
              <div v-if="selectedCategory === 'user' && selectedContact" class="p-4 border-t border-gray-200 bg-gradient-to-r from-white to-gray-50">
                <div class="flex items-end space-x-3">
                  <!-- 附件按钮 -->
                  <button class="p-3 text-gray-400 hover:text-bilibili-primary rounded-full hover:bg-bilibili-primary/10 transition-all duration-200 group">
                    <svg class="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
                    </svg>
                  </button>
                  
                  <!-- 图片按钮 -->
                  <button class="p-3 text-gray-400 hover:text-bilibili-primary rounded-full hover:bg-bilibili-primary/10 transition-all duration-200 group">
                    <svg class="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </button>
                  
                  <!-- 表情按钮 -->
                  <button class="p-3 text-gray-400 hover:text-bilibili-primary rounded-full hover:bg-bilibili-primary/10 transition-all duration-200 group">
                    <svg class="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </button>
                  
                  <!-- 输入框容器 -->
                  <div class="flex-1 relative">
                    <textarea
                      v-model="newMessage"
                      @keydown.enter.prevent="sendMessage"
                      @input="adjustTextareaHeight"
                      ref="messageInput"
                      placeholder="输入消息... (按 Enter 发送)"
                      rows="1"
                      class="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-2xl resize-none focus:ring-2 focus:ring-bilibili-primary/50 focus:border-bilibili-primary transition-all duration-200 bg-white shadow-sm hover:shadow-md max-h-32 overflow-y-auto"
                      style="min-height: 44px;"
                    ></textarea>
                    
                    <!-- 字数统计 -->
                    <div 
                      v-if="newMessage.length > 0" 
                      class="absolute bottom-1 right-12 text-xs text-gray-400"
                    >
                      {{ newMessage.length }}/500
                    </div>
                  </div>
                  
                  <!-- 发送按钮 -->
                  <button
                    @click="sendMessage"
                    :disabled="!newMessage.trim()"
                    :class="[
                      'p-3 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95',
                      newMessage.trim()
                        ? 'bg-gradient-to-r from-bilibili-primary to-pink-500 text-white hover:from-bilibili-primary-dark hover:to-pink-600'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    ]"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                    </svg>
                  </button>
                </div>
                
                <!-- 快捷回复 -->
                <div v-if="quickReplies.length > 0" class="mt-3 flex flex-wrap gap-2">
                  <button
                    v-for="reply in quickReplies"
                    :key="reply"
                    @click="selectQuickReply(reply)"
                    class="px-3 py-1 text-sm bg-gray-100 hover:bg-bilibili-primary/10 hover:text-bilibili-primary text-gray-600 rounded-full transition-all duration-200 border border-gray-200 hover:border-bilibili-primary/30"
                  >
                    {{ reply }}
                  </button>
                </div>
              </div>
            </template>

            <!-- 未选择联系人时的占位符 -->
            <template v-else>
              <div class="flex-1 flex items-center justify-center bg-gray-50">
                <div class="text-center">
                  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                  </svg>
                  <h3 class="mt-2 text-sm font-medium text-gray-900">选择一个对话</h3>
                  <p class="mt-1 text-sm text-gray-500">从左侧选择一个联系人或系统通知开始查看</p>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'
import NavHeader from '../components/NavHeader.vue'
import { useUserStore } from '../stores/userStore'

const userStore = useUserStore()
const showLoginModal = ref(false)
const searchQuery = ref('')
const newMessage = ref('')
const selectedContact = ref<Contact | null>(null)
const selectedCategory = ref<'system' | 'user'>('system')
const messagesContainer = ref<HTMLElement | null>(null)
const messageInput = ref<HTMLTextAreaElement | null>(null)

// 快捷回复
const quickReplies = ref([
  '好的', '收到', '谢谢', '没问题', '稍等一下', '明白了'
])

interface Contact {
  id: string
  name: string
  avatar: string
  online: boolean
  lastSeen: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  isVip?: boolean
}

interface Message {
  id: string
  senderId: string
  content: string
  timestamp: string
  type?: 'normal' | 'system'
  status?: 'sending' | 'sent' | 'read'
}

// 模拟联系人数据 - 只包含用户联系人
const contacts = ref<Contact[]>([
  {
    id: '1',
    name: '小明同学',
    avatar: 'https://i.pravatar.cc/40?u=user1',
    online: true,
    lastSeen: '2024-09-28 23:45',
    lastMessage: '好的，明天见！记得带上你的笔记本',
    lastMessageTime: '2024-09-28 23:45',
    unreadCount: 2,
    isVip: false
  },
  {
    id: '2',
    name: 'UP主-科技频道',
    avatar: 'https://i.pravatar.cc/40?u=user2',
    online: false,
    lastSeen: '2024-09-28 20:30',
    lastMessage: '不客气！你的视频质量很高，学到了很多',
    lastMessageTime: '2024-09-28 20:32',
    unreadCount: 0,
    isVip: true
  },
  {
    id: '3',
    name: '游戏大神',
    avatar: 'https://i.pravatar.cc/40?u=user3',
    online: true,
    lastSeen: '2024-09-28 23:50',
    lastMessage: '好啊！什么游戏？',
    lastMessageTime: '2024-09-28 23:51',
    unreadCount: 1,
    isVip: false
  },
  {
    id: '4',
    name: '学习小组',
    avatar: 'https://i.pravatar.cc/40?u=user4',
    online: false,
    lastSeen: '2024-09-28 18:20',
    lastMessage: '收到！我已经完成了，明天提交',
    lastMessageTime: '2024-09-28 18:25',
    unreadCount: 5,
    isVip: false
  }
])

// 模拟消息数据
const messages = ref<{ [contactId: string]: Message[] }>({
  'system': [
    {
      id: 'sys_security',
      senderId: 'system',
      content: '🔒 检测到您的账号在北京异地登录，如非本人操作请及时修改密码',
      timestamp: '2024-09-28 23:55',
      type: 'system'
    },
    {
      id: 'sys_points',
      senderId: 'system',
      content: '💰 恭喜！您的创作激励积分已到账 +500 分，当前总积分：2,350',
      timestamp: '2024-09-28 20:30',
      type: 'system'
    },
    {
      id: 'sys_followers',
      senderId: 'system',
      content: '🎉 恭喜！您的粉丝数量已突破 10,000 人，解锁创作者专属权益',
      timestamp: '2024-09-28 18:15',
      type: 'system'
    },
    {
      id: 'sys_verification',
      senderId: 'system',
      content: '📱 您的手机号码验证已过期，为保障账号安全请及时重新验证',
      timestamp: '2024-09-28 12:00',
      type: 'system'
    },
    {
      id: 'sys_level_up',
      senderId: 'system',
      content: '⭐ 恭喜升级！您已成为 Lv.5 用户，解锁更多特权功能',
      timestamp: '2024-09-27 16:45',
      type: 'system'
    }
  ],
  '1': [
    {
      id: '1',
      senderId: '1',
      content: '你好！最近怎么样？学习进展如何？',
      timestamp: '2024-09-28 23:40',
      type: 'normal',
      status: 'read'
    },
    {
      id: '2',
      senderId: userStore.userId || 'me',
      content: '还不错，最近在学Vue3，感觉很有意思！你呢？',
      timestamp: '2024-09-28 23:42',
      type: 'normal',
      status: 'read'
    },
    {
      id: '3',
      senderId: '1',
      content: '哇，Vue3确实很棒！我也在学，有什么问题可以一起讨论',
      timestamp: '2024-09-28 23:44',
      type: 'normal',
      status: 'read'
    },
    {
      id: '4',
      senderId: userStore.userId || 'me',
      content: '太好了！那我们明天一起学习吧',
      timestamp: '2024-09-28 23:44',
      type: 'normal',
      status: 'read'
    },
    {
      id: '5',
      senderId: '1',
      content: '好的，明天见！记得带上你的笔记本',
      timestamp: '2024-09-28 23:45',
      type: 'normal',
      status: 'sent'
    }
  ],
  '2': [
    {
      id: '6',
      senderId: '2',
      content: '感谢你的支持！你的评论很有见地',
      timestamp: '2024-09-28 20:30',
      type: 'normal',
      status: 'read'
    },
    {
      id: '7',
      senderId: userStore.userId || 'me',
      content: '不客气！你的视频质量很高，学到了很多',
      timestamp: '2024-09-28 20:32',
      type: 'normal',
      status: 'read'
    }
  ],
  '3': [
    {
      id: '8',
      senderId: '3',
      content: '在线吗？一起开黑吗？刚好缺一个人',
      timestamp: '2024-09-28 23:50',
      type: 'normal',
      status: 'sent'
    },
    {
      id: '9',
      senderId: userStore.userId || 'me',
      content: '好啊！什么游戏？',
      timestamp: '2024-09-28 23:51',
      type: 'normal',
      status: 'read'
    }
  ],
  '4': [
    {
      id: '10',
      senderId: '4',
      content: '大家注意！作业提交截止时间是明天下午6点',
      timestamp: '2024-09-28 18:20',
      type: 'normal',
      status: 'read'
    },
    {
      id: '11',
      senderId: userStore.userId || 'me',
      content: '收到！我已经完成了，明天提交',
      timestamp: '2024-09-28 18:25',
      type: 'normal',
      status: 'read'
    }
  ]
})

// 计算属性
const userContacts = computed(() => {
  if (!searchQuery.value) return contacts.value
  return contacts.value.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const systemNotificationCount = computed(() => {
  return messages.value['system']?.length || 0
})

const totalUserMessageCount = computed(() => {
  return contacts.value.reduce((total, contact) => total + contact.unreadCount, 0)
})

const latestSystemNotificationTime = computed(() => {
  const systemMessages = messages.value['system']
  return systemMessages && systemMessages.length > 0 ? systemMessages[0].timestamp : ''
})

const latestSystemNotificationContent = computed(() => {
  const systemMessages = messages.value['system']
  return systemMessages && systemMessages.length > 0 ? systemMessages[0].content : ''
})

const currentMessages = computed(() => {
  if (selectedCategory.value === 'system') {
    return messages.value['system'] || []
  } else if (selectedContact.value) {
    return messages.value[selectedContact.value.id] || []
  }
  return []
})

// 方法
const selectSystemNotifications = () => {
  selectedCategory.value = 'system'
  selectedContact.value = null
  nextTick(() => {
    scrollToBottom()
  })
}

const selectContact = (contact: Contact) => {
  selectedCategory.value = 'user'
  selectedContact.value = contact
  // 清除未读消息数
  contact.unreadCount = 0
  // 滚动到底部
  nextTick(() => {
    scrollToBottom()
  })
}

const sendMessage = () => {
  if (!newMessage.value.trim() || !selectedContact.value || selectedCategory.value !== 'user') return

  const message: Message = {
    id: Date.now().toString(),
    senderId: userStore.userId || 'me',
    content: newMessage.value.trim(),
    timestamp: new Date().toISOString(),
    type: 'normal',
    status: 'sending'
  }

  if (!messages.value[selectedContact.value.id]) {
    messages.value[selectedContact.value.id] = []
  }
  
  messages.value[selectedContact.value.id].push(message)
  
  // 更新联系人的最后消息
  selectedContact.value.lastMessage = message.content
  selectedContact.value.lastMessageTime = message.timestamp

  newMessage.value = ''
  
  nextTick(() => {
    scrollToBottom()
  })

  // 模拟消息发送状态变化
  setTimeout(() => {
    message.status = 'sent'
  }, 1000)
  
  setTimeout(() => {
    message.status = 'read'
  }, 3000)

  // 模拟对方回复 (仅用于演示)
  if (Math.random() > 0.7) {
    setTimeout(() => {
      const replyMessage: Message = {
        id: (Date.now() + 1).toString(),
        senderId: selectedContact.value!.id,
        content: getRandomReply(),
        timestamp: new Date().toISOString(),
        type: 'normal',
        status: 'sent'
      }
      messages.value[selectedContact.value!.id].push(replyMessage)
      
      nextTick(() => {
        scrollToBottom()
      })
    }, 2000 + Math.random() * 3000)
  }
}

const getRandomReply = () => {
  const replies = [
    '好的，收到！',
    '哈哈，有意思',
    '我也是这么想的',
    '确实如此',
    '让我想想...',
    '不错不错',
    '同意你的观点',
    '有道理'
  ]
  return replies[Math.floor(Math.random() * replies.length)]
}

const adjustTextareaHeight = () => {
  if (messageInput.value) {
    messageInput.value.style.height = 'auto'
    messageInput.value.style.height = Math.min(messageInput.value.scrollHeight, 128) + 'px'
  }
}

const selectQuickReply = (reply: string) => {
  newMessage.value = reply
  nextTick(() => {
    if (messageInput.value) {
      messageInput.value.focus()
    }
  })
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  if (diff < 60000) { // 1分钟内
    return '刚刚'
  } else if (diff < 3600000) { // 1小时内
    return `${Math.floor(diff / 60000)}分钟前`
  } else if (diff < 86400000) { // 24小时内
    return `${Math.floor(diff / 3600000)}小时前`
  } else {
    return date.toLocaleDateString()
  }
}

onMounted(() => {
  // 默认选择系统通知
  selectSystemNotifications()
})
</script>

<style scoped>
/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>