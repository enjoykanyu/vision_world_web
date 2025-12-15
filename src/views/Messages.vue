<template>
  <div class="min-h-screen bg-gray-50">
    <NavHeader 
      :isLoggedIn="userStore.isLoggedIn" 
      :username="userStore.username" 
      @login="showLoginModal = true"
    />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="bg-white rounded-bilibili-lg shadow-bilibili-sm overflow-hidden" style="height: calc(100vh - 140px);">
        <div class="flex h-full">
          <!-- 左侧消息中心导航 -->
          <div class="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
            <!-- 消息中心标题 -->
            <div class="p-4 border-b border-gray-200 bg-white">
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
                <h2 class="text-lg font-semibold text-gray-900">消息中心</h2>
              </div>
            </div>

            <!-- 导航菜单 -->
            <div class="flex-1 overflow-y-auto">
              <nav class="p-2 space-y-1">
                <!-- 我的消息 -->
                <div
                  @click="selectCategory('messages')"
                  :class="[
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors duration-200',
                    selectedCategory === 'messages' 
                      ? 'bg-bilibili-primary text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  ]"
                >
                  <svg class="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/>
                  </svg>
                  我的消息
                  <span v-if="totalUserMessageCount > 0" class="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                    {{ totalUserMessageCount }}
                  </span>
                </div>

                <!-- 回复我的 -->
                <div
                  @click="selectCategory('replies')"
                  :class="[
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors duration-200',
                    selectedCategory === 'replies' 
                      ? 'bg-bilibili-primary text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  ]"
                >
                  <svg class="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  回复我的
                </div>

                <!-- @我的 -->
                <div
                  @click="selectCategory('mentions')"
                  :class="[
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors duration-200',
                    selectedCategory === 'mentions' 
                      ? 'bg-bilibili-primary text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  ]"
                >
                  <svg class="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clip-rule="evenodd"/>
                  </svg>
                  @我的
                </div>

                <!-- 收到的赞 -->
                <div
                  @click="selectCategory('likes')"
                  :class="[
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors duration-200',
                    selectedCategory === 'likes' 
                      ? 'bg-bilibili-primary text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  ]"
                >
                  <svg class="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"/>
                  </svg>
                  收到的赞
                </div>

                <!-- 系统通知 -->
                <div
                  @click="selectCategory('system')"
                  :class="[
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors duration-200',
                    selectedCategory === 'system' 
                      ? 'bg-bilibili-primary text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  ]"
                >
                  <svg class="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                  </svg>
                  系统通知
                  <span v-if="systemNotificationCount > 0" class="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                    {{ systemNotificationCount }}
                  </span>
                </div>

                <!-- 分割线 -->
                <div class="border-t border-gray-200 my-2"></div>

                <!-- 消息设置 -->
                <div
                  @click="selectCategory('settings')"
                  :class="[
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors duration-200',
                    selectedCategory === 'settings' 
                      ? 'bg-bilibili-primary text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  ]"
                >
                  <svg class="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>
                  </svg>
                  消息设置
                </div>
              </nav>
            </div>
          </div>

          <!-- 中间联系人列表 -->
          <div class="w-80 border-r border-gray-200 flex flex-col bg-white">
            <!-- 标题栏 -->
            <div class="p-4 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium text-gray-900">{{ getCategoryTitle() }}</h3>
                <button v-if="selectedCategory === 'messages'" class="text-gray-400 hover:text-gray-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- 搜索栏 (仅在我的消息时显示) -->
            <div v-if="selectedCategory === 'messages'" class="p-4 border-b border-gray-200">
              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="搜索联系人..."
                  class="w-full pl-10 pr-4 py-2 border border-bilibili-gray-200 rounded-bilibili-lg focus:ring-2 focus:ring-bilibili-primary focus:border-transparent text-sm"
                >
                <svg class="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
            </div>

            <!-- 内容列表 -->
            <div class="flex-1 overflow-y-auto">
              <!-- 我的消息列表 -->
              <template v-if="selectedCategory === 'messages'">
                <div
                  v-for="contact in filteredContacts"
                  :key="contact.id"
                  @click="selectContact(contact)"
                  :class="[
                    'flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors duration-200',
                    selectedContact?.id === contact.id ? 'bg-blue-50 border-l-4 border-l-bilibili-primary' : ''
                  ]"
                >
                  <div class="relative flex-shrink-0">
                    <img :src="contact.avatar" :alt="contact.name" class="w-12 h-12 rounded-full">
                    <!-- 在线状态 -->
                    <div
                      v-if="contact.online"
                      class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"
                    ></div>
                  </div>
                  <div class="ml-3 flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-2">
                        <p class="text-sm font-medium text-gray-900 truncate">{{ contact.name }}</p>
                        <!-- VIP标识 -->
                        <div
                          v-if="contact.isVip"
                          class="w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
                        >
                          <span class="text-white text-xs font-bold">V</span>
                        </div>
                      </div>
                      <p class="text-xs text-gray-500">{{ formatTime(contact.lastMessageTime) }}</p>
                    </div>
                    <div class="flex items-center justify-between mt-1">
                      <p class="text-sm text-gray-500 truncate">{{ contact.lastMessage }}</p>
                      <!-- 未读消息数 -->
                      <span
                        v-if="contact.unreadCount > 0"
                        class="inline-flex items-center justify-center min-w-[18px] h-4 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full"
                      >
                        {{ contact.unreadCount > 99 ? '99+' : contact.unreadCount }}
                      </span>
                    </div>
                  </div>
                </div>
              </template>

              <!-- 系统通知列表 -->
              <template v-else-if="selectedCategory === 'system'">
                <div
                  v-for="notification in systemNotifications"
                  :key="notification.id"
                  @click="selectNotification(notification)"
                  :class="[
                    'flex items-start p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors duration-200',
                    selectedNotification?.id === notification.id ? 'bg-blue-50 border-l-4 border-l-bilibili-primary' : ''
                  ]"
                >
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                  <div class="ml-3 flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                      <p class="text-sm font-medium text-gray-900">系统通知</p>
                      <p class="text-xs text-gray-500">{{ formatTime(notification.timestamp) }}</p>
                    </div>
                    <p class="text-sm text-gray-600 mt-1 line-clamp-2">{{ notification.content }}</p>
                  </div>
                </div>
              </template>

              <!-- 其他分类的占位内容 -->
              <template v-else>
                <div class="flex flex-col items-center justify-center h-64 text-gray-500">
                  <svg class="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                  </svg>
                  <p class="text-sm">暂无内容</p>
                </div>
              </template>
            </div>
          </div>

          <!-- 右侧聊天区域 -->
          <div class="flex-1 flex flex-col bg-white">
            <!-- 聊天内容 -->
            <template v-if="selectedContact || selectedNotification">
              <!-- 聊天头部 -->
              <div class="p-4 border-b border-gray-200">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div v-if="selectedNotification" class="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                    <img v-else :src="selectedContact?.avatar" :alt="selectedContact?.name" class="w-10 h-10 rounded-full">
                    <div class="ml-3">
                      <h3 class="text-lg font-medium text-gray-900">
                        {{ selectedNotification ? 'VisionWorld 官方' : selectedContact?.name }}
                      </h3>
                      <p class="text-sm text-gray-500">
                        {{ selectedNotification ? '系统通知' : (selectedContact?.online ? '在线' : `最后活跃时间 ${formatTime(selectedContact?.lastSeen || '')}`) }}
                      </p>
                    </div>
                  </div>
                  <div v-if="!selectedNotification" class="flex items-center space-x-2">
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
              <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                <!-- 系统通知详情 -->
                <template v-if="selectedNotification">
                  <div class="flex justify-center">
                    <div class="max-w-md">
                      <div class="bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 border-2 border-orange-200/60 text-gray-800 px-6 py-4 rounded-2xl shadow-lg">
                        <!-- 系统通知头部 -->
                        <div class="flex items-center space-x-3 mb-3">
                          <div class="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                            </svg>
                          </div>
                          <div class="flex-1">
                            <div class="flex items-center space-x-2">
                              <span class="text-sm font-bold text-orange-600">系统通知</span>
                              <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            </div>
                            <span class="text-xs text-gray-500">VisionWorld 官方</span>
                          </div>
                          <span class="text-xs text-gray-400 font-medium">{{ formatTime(selectedNotification.timestamp) }}</span>
                        </div>
                        
                        <!-- 系统通知内容 -->
                        <div class="bg-white/60 rounded-lg p-3 border border-orange-100">
                          <p class="text-sm text-gray-700 leading-relaxed">{{ selectedNotification.content }}</p>
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
                </template>

                <!-- 普通聊天消息 -->
                <template v-else>
                  <div
                    v-for="message in currentMessages"
                    :key="message.id"
                    :class="[
                      'flex items-end space-x-2',
                      message.senderId === userStore.userId ? 'justify-end' : 'justify-start'
                    ]"
                  >
                    <!-- 对方头像 -->
                    <img 
                      v-if="message.senderId !== userStore.userId" 
                      :src="selectedContact?.avatar" 
                      :alt="selectedContact?.name"
                      class="w-8 h-8 rounded-full flex-shrink-0"
                    >
                    
                    <!-- 消息气泡 -->
                    <div class="flex flex-col max-w-xs lg:max-w-md">
                      <div
                        :class="[
                          'px-4 py-2 rounded-2xl shadow-sm',
                          message.senderId === userStore.userId
                            ? 'bg-bilibili-primary text-white rounded-br-md'
                            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
                        ]"
                      >
                        <p class="text-sm">{{ message.content }}</p>
                      </div>
                      <span
                        :class="[
                          'text-xs mt-1',
                          message.senderId === userStore.userId ? 'text-right text-gray-500' : 'text-left text-gray-500'
                        ]"
                      >
                        {{ formatTime(message.timestamp) }}
                      </span>
                    </div>
                    
                    <!-- 我的头像（真实图片） -->
                    <img 
                      v-if="message.senderId === userStore.userId" 
                      :src="myAvatar" 
                      :alt="userStore.username || '我'" 
                      class="w-8 h-8 rounded-full flex-shrink-0"
                    >
                  </div>
                </template>
              </div>

              <!-- 消息输入区域 (仅聊天时显示) -->
              <div v-if="selectedContact && !selectedNotification" class="p-4 border-t border-gray-200">
                <div class="flex items-end space-x-3">
                  <div class="flex-1 relative">
                    <textarea
                      v-model="newMessage"
                      @keydown.enter.prevent="sendMessage"
                      placeholder="输入消息..."
                      rows="1"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-bilibili-primary focus:border-transparent"
                    ></textarea>
                  </div>
                  <button
                    @click="sendMessage"
                    :disabled="!newMessage.trim()"
                    :class="[
                      'px-4 py-2 rounded-lg transition-colors duration-200',
                      newMessage.trim()
                        ? 'bg-bilibili-primary text-white hover:bg-bilibili-primary-dark'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    ]"
                  >
                    发送
                  </button>
                </div>
              </div>
            </template>

            <!-- 未选择时的占位符 -->
            <template v-else>
              <div class="flex-1 flex items-center justify-center">
                <div class="text-center">
                  <div class="w-32 h-32 mx-auto mb-4 opacity-20">
                    <svg viewBox="0 0 200 200" class="w-full h-full">
                      <!-- 可爱的聊天插画 -->
                      <circle cx="60" cy="80" r="30" fill="#e0e7ff" stroke="#c7d2fe" stroke-width="2"/>
                      <circle cx="140" cy="120" r="25" fill="#fef3c7" stroke="#fde68a" stroke-width="2"/>
                      <path d="M30 80 Q50 60 70 80" stroke="#9ca3af" stroke-width="2" fill="none"/>
                      <path d="M115 120 Q135 100 155 120" stroke="#9ca3af" stroke-width="2" fill="none"/>
                      <text x="60" y="85" text-anchor="middle" class="text-xs fill-gray-400">...</text>
                      <text x="140" y="125" text-anchor="middle" class="text-xs fill-gray-400">Hi</text>
                    </svg>
                  </div>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">快找小伙伴聊天吧！</h3>
                  <p class="text-sm text-gray-500">（＾◡＾）ノ</p>
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
const selectedCategory = ref<'messages' | 'replies' | 'mentions' | 'likes' | 'system' | 'settings'>('messages')
const selectedContact = ref<Contact | null>(null)
const selectedNotification = ref<SystemNotification | null>(null)
const messagesContainer = ref<HTMLElement | null>(null)

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
  status?: 'sending' | 'sent' | 'read'
}

interface SystemNotification {
  id: string
  content: string
  timestamp: string
  type: string
}

// 模拟联系人数据
const contacts = ref<Contact[]>([
  {
    id: '1',
    name: '技术肥肥虾',
    avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
    online: true,
    lastSeen: '2024-09-29 21:45',
    lastMessage: '自动回复：感谢您的留言！',
    lastMessageTime: '2024-09-29 21:45',
    unreadCount: 0,
    isVip: false
  },
  {
    id: '2',
    name: '抵抗Resistance',
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    online: false,
    lastSeen: '2024-09-29 20:30',
    lastMessage: '自动回复：感谢您对我们的关注！',
    lastMessageTime: '2024-09-29 20:32',
    unreadCount: 0,
    isVip: true
  },
  {
    id: '3',
    name: '黑ww63',
    avatar: 'https://randomuser.me/api/portraits/men/31.jpg',
    online: true,
    lastSeen: '2024-09-29 21:50',
    lastMessage: '自动回复：感谢您先看完视频的分享！',
    lastMessageTime: '2024-09-29 21:51',
    unreadCount: 0,
    isVip: false
  },
  {
    id: '4',
    name: '御风大世界',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    online: false,
    lastSeen: '2024-09-29 18:20',
    lastMessage: '自动回复：感谢您的Hello投稿意见！',
    lastMessageTime: '2024-09-29 18:25',
    unreadCount: 0,
    isVip: false
  },
  {
    id: '5',
    name: '堂主lee',
    avatar: 'https://randomuser.me/api/portraits/women/55.jpg',
    online: false,
    lastSeen: '2024-09-29 16:15',
    lastMessage: '自动回复：感谢您留言支持我们！',
    lastMessageTime: '2024-09-29 16:18',
    unreadCount: 0,
    isVip: true
  },
  {
    id: '6',
    name: '黑马实验室',
    avatar: 'https://randomuser.me/api/portraits/men/66.jpg',
    online: true,
    lastSeen: '2024-09-29 21:30',
    lastMessage: '自动回复：感谢！充电，你的好！',
    lastMessageTime: '2024-09-29 21:35',
    unreadCount: 0,
    isVip: false
  },
  {
    id: '7',
    name: '成田工作室',
    avatar: 'https://randomuser.me/api/portraits/men/77.jpg',
    online: false,
    lastSeen: '2024-09-29 15:45',
    lastMessage: '自动回复：感谢您对我们关注支持！',
    lastMessageTime: '2024-09-29 15:50',
    unreadCount: 0,
    isVip: false
  }
])

// 模拟系统通知数据
const systemNotifications = ref<SystemNotification[]>([
  {
    id: 'sys1',
    content: '🔒 检测到您的账号在北京异地登录，如非本人操作请及时修改密码',
    timestamp: '2024-09-29 21:55',
    type: 'security'
  },
  {
    id: 'sys2',
    content: '💰 恭喜！您的创作激励积分已到账 +500 分，当前总积分：2,350',
    timestamp: '2024-09-29 20:30',
    type: 'reward'
  },
  {
    id: 'sys3',
    content: '🎉 恭喜！您的粉丝数量已突破 10,000 人，解锁创作者专属权益',
    timestamp: '2024-09-29 18:15',
    type: 'milestone'
  },
  {
    id: 'sys4',
    content: '📱 您的手机号码验证已过期，为保障账号安全请及时重新验证',
    timestamp: '2024-09-29 12:00',
    type: 'verification'
  },
  {
    id: 'sys5',
    content: '⭐ 恭喜升级！您已成为 Lv.5 用户，解锁更多特权功能',
    timestamp: '2024-09-28 16:45',
    type: 'level'
  }
])

// 模拟消息数据
const messages = ref<{ [contactId: string]: Message[] }>({
  '1': [
    {
      id: '1',
      senderId: userStore.userId || 'me',
      content: '你好！喜欢你的视频内容',
      timestamp: '2024-09-29 21:40',
      status: 'read'
    },
    {
      id: '2',
      senderId: '1',
      content: '自动回复：感谢您的留言！',
      timestamp: '2024-09-29 21:45',
      status: 'sent'
    }
  ],
  '2': [
    {
      id: '3',
      senderId: userStore.userId || 'me',
      content: '关注了你的频道，内容很棒！',
      timestamp: '2024-09-29 20:30',
      status: 'read'
    },
    {
      id: '4',
      senderId: '2',
      content: '自动回复：感谢您对我们的关注！',
      timestamp: '2024-09-29 20:32',
      status: 'sent'
    }
  ]
})

// 计算属性
const filteredContacts = computed(() => {
  if (!searchQuery.value) return contacts.value
  return contacts.value.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const totalUserMessageCount = computed(() => {
  return contacts.value.reduce((total, contact) => total + contact.unreadCount, 0)
})

const systemNotificationCount = computed(() => {
  return systemNotifications.value.length
})

const currentMessages = computed(() => {
  if (!selectedContact.value) return []
  return messages.value[selectedContact.value.id] || []
})

const myAvatar = computed(() => {
  // 优先使用用户自身头像；没有则给一个真实头像作为回退
  return (userStore as any).avatar || 'https://randomuser.me/api/portraits/men/75.jpg'
})

// 方法
const selectCategory = (category: typeof selectedCategory.value) => {
  selectedCategory.value = category
  selectedContact.value = null
  selectedNotification.value = null
}

const selectContact = (contact: Contact) => {
  selectedContact.value = contact
  selectedNotification.value = null
  contact.unreadCount = 0
  nextTick(() => {
    scrollToBottom()
  })
}

const selectNotification = (notification: SystemNotification) => {
  selectedNotification.value = notification
  selectedContact.value = null
  nextTick(() => {
    scrollToBottom()
  })
}

const getCategoryTitle = () => {
  const titles = {
    messages: '我的消息',
    replies: '回复我的',
    mentions: '@我的',
    likes: '收到的赞',
    system: '系统通知',
    settings: '消息设置'
  }
  return titles[selectedCategory.value]
}

const sendMessage = () => {
  if (!newMessage.value.trim() || !selectedContact.value) return

  const message: Message = {
    id: Date.now().toString(),
    senderId: userStore.userId || 'me',
    content: newMessage.value.trim(),
    timestamp: new Date().toISOString(),
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
  // 默认选择我的消息
  selectCategory('messages')
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

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>