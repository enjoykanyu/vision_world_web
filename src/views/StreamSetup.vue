<template>
  <div class="min-h-screen bg-[#f5f7fa] text-gray-800 font-sans">
    <!-- 使用公用导航头组件 -->
    <NavHeader 
      :isLoggedIn="userStore.isLoggedIn" 
      :username="userStore.username" 
      @login="handleLogin"
    ></NavHeader>

    <!-- 主内容区 -->
    <div class="flex h-[calc(100vh-64px)]">
      <!-- 左侧工具栏 -->
      <aside class="w-52 bg-white border-r border-gray-200 flex flex-col">
        <!-- 添加素材区域 -->
        <div class="p-3 border-b border-gray-200">
          <div class="flex items-center space-x-2 mb-3">
            <button 
              @click="showAddSourceModal = true"
              class="flex-1 h-8 bg-[#00b5e5] hover:bg-[#00a3d1] text-white rounded text-sm flex items-center justify-center space-x-1 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              <span>添加素材</span>
            </button>
            <button class="w-8 h-8 border border-gray-300 rounded flex items-center justify-center text-gray-500 hover:bg-gray-50">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
          
          <!-- 素材列表 -->
          <div class="space-y-1">
            <div 
              v-for="(source, index) in sources" 
              :key="source.id"
              class="flex items-center justify-between p-2 rounded hover:bg-gray-100 cursor-pointer group"
              :class="{ 'bg-blue-50 border border-blue-200': selectedSource === source.id }"
              @click="selectedSource = source.id"
            >
              <div class="flex items-center space-x-2">
                <component :is="getSourceIcon(source.type)" class="w-4 h-4 text-gray-500" />
                <span class="text-sm text-gray-700">{{ source.name }}</span>
              </div>
              <button 
                @click.stop="removeSource(index)"
                class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div v-if="sources.length === 0" class="text-center py-4 text-gray-400 text-xs">
              暂无素材，点击添加
            </div>
          </div>
        </div>

        <!-- 直播互动工具 -->
        <div class="flex-1 p-3 overflow-y-auto">
          <div class="text-xs text-gray-500 mb-3 font-medium">直播互动工具</div>
          <div class="grid grid-cols-3 gap-3">
            <button 
              v-for="tool in interactionTools" 
              :key="tool.name"
              @click="tool.action"
              class="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <div class="w-11 h-11 rounded-full flex items-center justify-center mb-1.5 shadow-sm transition-transform group-hover:scale-105" :style="{ backgroundColor: tool.bgColor }">
                <component :is="tool.icon" class="w-6 h-6" :style="{ color: tool.iconColor }" />
              </div>
              <span class="text-[11px] text-gray-600 text-center leading-tight">{{ tool.name }}</span>
            </button>
          </div>
        </div>

        <!-- 底部活动入口 -->
        <div class="p-3 border-t border-gray-200">
          <button class="w-full flex items-center space-x-2 text-xs text-gray-600 hover:text-[#00b5e5]">
            <div class="w-5 h-5 bg-pink-500 rounded flex items-center justify-center">
              <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <span>活动中心</span>
            <svg class="w-3 h-3 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </aside>

      <!-- 中间直播预览区 -->
      <main class="flex-1 flex flex-col bg-[#2a2a2a]">
        <!-- 预览窗口 -->
        <div class="flex-1 relative flex items-center justify-center p-4">
          <div class="relative w-full max-w-4xl aspect-video bg-black rounded overflow-hidden shadow-2xl">
            <!-- 无信号/未开始状态 -->
            <div v-if="!isStreaming && sources.length === 0" class="absolute inset-0 flex flex-col items-center justify-center">
              <div class="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <svg class="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
              </div>
              <p class="text-gray-500 mb-4 text-sm">点击左侧"添加素材"按钮添加直播素材</p>
              <button 
                @click="showAddSourceModal = true"
                class="px-6 py-2 bg-[#00b5e5] hover:bg-[#00a3d1] text-white rounded text-sm transition-colors"
              >
                添加素材
              </button>
            </div>
            
            <!-- 已添加的素材预览 -->
            <div v-else-if="sources.length > 0" class="absolute inset-0">
              <div 
                v-for="(source, index) in sources" 
                :key="source.id"
                class="absolute inset-0 flex items-center justify-center"
                :style="{ zIndex: index }"
              >
                <img v-if="source.type === 'image'" :src="source.url" class="w-full h-full object-cover" />
                <div v-else-if="source.type === 'camera'" class="w-full h-full bg-gray-800 flex items-center justify-center">
                  <video 
                    v-if="source.stream" 
                    :srcObject="source.stream" 
                    autoplay 
                    playsinline
                    muted
                    class="w-full h-full object-cover"
                  ></video>
                  <div v-else class="text-center">
                    <div class="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                      </svg>
                    </div>
                    <span class="text-gray-500 text-sm">摄像头画面</span>
                  </div>
                </div>
                <div v-else-if="source.type === 'screen'" class="w-full h-full bg-gray-800 flex items-center justify-center">
                  <video 
                    v-if="source.stream" 
                    :srcObject="source.stream" 
                    autoplay 
                    playsinline
                    class="w-full h-full object-contain"
                  ></video>
                  <div v-else class="text-center">
                    <div class="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <span class="text-gray-500 text-sm">屏幕捕捉</span>
                  </div>
                </div>
                <div v-else-if="source.type === 'game'" class="w-full h-full bg-gray-800 flex items-center justify-center">
                  <div class="text-center">
                    <div class="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                      </svg>
                    </div>
                    <span class="text-gray-500 text-sm">游戏捕获</span>
                  </div>
                </div>
                <div v-else-if="source.type === 'window'" class="w-full h-full bg-gray-800 flex items-center justify-center">
                  <div class="text-center">
                    <div class="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"/>
                      </svg>
                    </div>
                    <span class="text-gray-500 text-sm">窗口捕获</span>
                  </div>
                </div>
                <div v-else-if="source.type === 'text'" class="w-full h-full bg-gray-800 flex items-center justify-center">
                  <div class="text-center">
                    <div class="text-2xl text-white">{{ source.content }}</div>
                  </div>
                </div>
                <div v-else-if="source.type === 'audio'" class="w-full h-full bg-gray-800 flex items-center justify-center">
                  <div class="text-center">
                    <div class="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19V6l12-3v13"/>
                      </svg>
                    </div>
                    <span class="text-gray-500 text-sm">音频输入</span>
                  </div>
                </div>
                <div v-else-if="source.type === 'danmaku'" class="w-full h-full bg-gray-800 flex items-center justify-center">
                  <div class="text-center">
                    <div class="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
                      </svg>
                    </div>
                    <span class="text-gray-500 text-sm">弹幕姬</span>
                  </div>
                </div>
                <div v-else-if="source.type === 'crop'" class="w-full h-full bg-gray-800 flex items-center justify-center">
                  <div class="text-center">
                    <div class="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                      </svg>
                    </div>
                    <span class="text-gray-500 text-sm">截屏</span>
                  </div>
                </div>
                <div v-else-if="source.type === 'phone'" class="w-full h-full bg-gray-800 flex items-center justify-center">
                  <div class="text-center">
                    <div class="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <span class="text-gray-500 text-sm">投屏</span>
                  </div>
                </div>
                <div v-else-if="source.type === 'browser'" class="w-full h-full bg-gray-800 flex items-center justify-center">
                  <div class="text-center">
                    <div class="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3"/>
                      </svg>
                    </div>
                    <span class="text-gray-500 text-sm">浏览器</span>
                  </div>
                </div>
                <div v-else-if="source.type === 'media'" class="w-full h-full bg-gray-800 flex items-center justify-center">
                  <div class="text-center">
                    <div class="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                      </svg>
                    </div>
                    <span class="text-gray-500 text-sm">多媒体</span>
                  </div>
                </div>
                <div v-else-if="source.type === 'thirdparty'" class="w-full h-full bg-gray-800 flex items-center justify-center">
                  <div class="text-center">
                    <div class="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                      </svg>
                    </div>
                    <span class="text-gray-500 text-sm">第三方推流</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 直播中标识 -->
            <div v-if="isStreaming" class="absolute top-4 left-4">
              <span class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">LIVE</span>
            </div>
            
            <!-- 直播时长 -->
            <div v-if="isStreaming" class="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded text-white font-mono text-sm">
              {{ streamDuration }}
            </div>
          </div>
        </div>
        
        <!-- 底部控制栏 -->
        <div class="h-14 bg-white border-t border-gray-200 flex items-center px-3 space-x-2 shrink-0">
          <!-- 麦克风控制 -->
          <div class="flex items-center space-x-1.5">
            <button 
              @click="micEnabled = !micEnabled"
              class="w-7 h-7 rounded flex items-center justify-center transition-colors"
              :class="micEnabled ? 'bg-[#00b5e5] text-white' : 'bg-gray-200 text-gray-500'"
            >
              <svg v-if="micEnabled" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
              </svg>
              <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
              </svg>
            </button>
            <div class="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div class="h-full bg-[#00b5e5] transition-all duration-100" :style="{ width: micVolume + '%' }"></div>
            </div>
          </div>
          
          <!-- 扬声器控制 -->
          <div class="flex items-center space-x-1.5">
            <button 
              @click="speakerEnabled = !speakerEnabled"
              class="w-7 h-7 rounded flex items-center justify-center transition-colors"
              :class="speakerEnabled ? 'bg-[#00b5e5] text-white' : 'bg-gray-200 text-gray-500'"
            >
              <svg v-if="speakerEnabled" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
              </svg>
              <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
              </svg>
            </button>
            <div class="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div class="h-full bg-[#00b5e5] transition-all duration-100" :style="{ width: speakerVolume + '%' }"></div>
            </div>
          </div>
          
          <div class="flex-1"></div>
          
          <!-- 状态信息 -->
          <div class="flex items-center space-x-3 text-xs text-gray-500 whitespace-nowrap">
            <span>码率:0kbps</span>
            <span>FPS:0</span>
            <span>丢帧:0.0%</span>
            <span>CPU:4%</span>
          </div>
          
          <div class="flex-1"></div>
          
          <!-- 录制按钮 -->
          <button 
            @click="isRecording = !isRecording"
            class="px-3 py-1.5 rounded text-sm font-medium transition-all flex items-center space-x-1.5 border shrink-0"
            :class="isRecording ? 'bg-red-50 border-red-300 text-red-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'"
          >
            <div class="w-2 h-2 rounded-full" :class="isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-400'"></div>
            <span>{{ isRecording ? '录制中' : '录制' }}</span>
          </button>
          
          <!-- 开始直播按钮 -->
          <button 
            @click="toggleStreaming"
            class="px-4 py-1.5 rounded text-sm font-medium transition-all shrink-0"
            :class="isStreaming ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-[#00b5e5] hover:bg-[#00a3d1] text-white'"
          >
            {{ isStreaming ? '结束直播' : '开始直播' }}
          </button>
        </div>
      </main>

      <!-- 右侧互动区 -->
      <aside class="w-72 bg-white border-l border-gray-200 flex flex-col">
        <!-- 高能榜 -->
        <div class="flex-1 flex flex-col border-b border-gray-200">
          <!-- 标签页 -->
          <div class="flex items-center border-b border-gray-200">
            <button 
              @click="activeTab = 'rank'"
              class="flex-1 py-3 text-sm font-medium transition-colors relative"
              :class="activeTab === 'rank' ? 'text-[#00b5e5]' : 'text-gray-500 hover:text-gray-700'"
            >
              高能榜
              <div v-if="activeTab === 'rank'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00b5e5]"></div>
            </button>
            <button 
              @click="activeTab = 'record'"
              class="flex-1 py-3 text-sm font-medium transition-colors relative"
              :class="activeTab === 'record' ? 'text-[#00b5e5]' : 'text-gray-500 hover:text-gray-700'"
            >
              流水记录
              <div v-if="activeTab === 'record'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00b5e5]"></div>
            </button>
            <div class="px-3">
              <button class="w-8 h-4 bg-gray-200 rounded-full relative transition-colors" :class="{ 'bg-[#00b5e5]': showRank }">
                <div class="w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all" :class="showRank ? 'left-4' : 'left-0.5'"></div>
              </button>
            </div>
          </div>
          
          <!-- 高能榜说明 -->
          <div class="flex items-center justify-between px-3 py-2 text-xs text-gray-400 border-b border-gray-100">
            <div class="flex items-center space-x-1">
              <span>高能榜说明</span>
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <span>贡献值</span>
          </div>
          
          <!-- 榜单内容 -->
          <div class="flex-1 overflow-y-auto p-3">
            <!-- 空状态 -->
            <div v-if="rankList.length === 0" class="flex flex-col items-center justify-center h-full">
              <div class="w-32 h-32 mb-4">
                <svg viewBox="0 0 100 100" class="w-full h-full">
                  <ellipse cx="50" cy="85" rx="25" ry="8" fill="#e5e7eb"/>
                  <rect x="35" y="55" width="30" height="25" rx="3" fill="#f3f4f6"/>
                  <circle cx="50" cy="45" r="18" fill="#dbeafe"/>
                  <circle cx="50" cy="40" r="12" fill="#60a5fa"/>
                  <ellipse cx="45" cy="38" rx="3" ry="4" fill="white"/>
                  <ellipse cx="55" cy="38" rx="3" ry="4" fill="white"/>
                  <circle cx="46" cy="39" r="1.5" fill="#1e40af"/>
                  <circle cx="54" cy="39" r="1.5" fill="#1e40af"/>
                  <path d="M47 44 Q50 47 53 44" stroke="#1e40af" stroke-width="1.5" fill="none"/>
                  <rect x="30" y="60" width="8" height="15" rx="2" fill="#fbbf24"/>
                  <rect x="62" y="60" width="8" height="15" rx="2" fill="#fbbf24"/>
                </svg>
              </div>
              <p class="text-gray-400 text-sm">暂无数据</p>
            </div>
            
            <!-- 榜单列表 -->
            <div v-else class="space-y-2">
              <div 
                v-for="(user, index) in rankList" 
                :key="user.id"
                class="flex items-center space-x-3 p-2 rounded hover:bg-gray-50"
              >
                <div 
                  class="w-5 h-5 rounded flex items-center justify-center text-xs font-bold"
                  :class="{
                    'bg-yellow-400 text-white': index === 0,
                    'bg-gray-300 text-white': index === 1,
                    'bg-orange-400 text-white': index === 2,
                    'bg-gray-100 text-gray-500': index > 2
                  }"
                >
                  {{ index + 1 }}
                </div>
                <img :src="user.avatar" class="w-8 h-8 rounded-full" />
                <div class="flex-1 min-w-0">
                  <div class="text-sm text-gray-700 truncate">{{ user.name }}</div>
                </div>
                <div class="text-xs text-[#00b5e5] font-medium">{{ user.score }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 弹幕互动区 -->
        <div class="h-80 flex flex-col">
          <!-- 头部 -->
          <div class="flex items-center justify-between px-3 py-2 border-b border-gray-200">
            <span class="text-sm font-medium text-gray-700">弹幕互动区</span>
            <button class="w-8 h-4 bg-gray-200 rounded-full relative">
              <div class="w-3 h-3 bg-white rounded-full absolute top-0.5 left-0.5"></div>
            </button>
          </div>
          
          <!-- 弹幕列表 -->
          <div class="flex-1 overflow-y-auto p-3 space-y-2" ref="danmakuContainer">
            <div 
              v-for="(msg, index) in danmakuMessages" 
              :key="index"
              class="flex items-start space-x-2"
            >
              <div class="flex items-center space-x-1 flex-shrink-0">
                <span v-if="msg.level" class="text-[10px] bg-[#00b5e5] text-white px-1 rounded">{{ msg.level }}</span>
                <span v-if="msg.isAnchor" class="text-[10px] bg-yellow-400 text-white px-1 rounded">主播</span>
              </div>
              <div class="flex-1 min-w-0">
                <span class="text-xs text-[#00b5e5]">{{ msg.username }}:</span>
                <span class="text-xs text-gray-700">{{ msg.content }}</span>
              </div>
            </div>
            <div v-if="danmakuMessages.length === 0" class="text-center text-gray-400 py-8 text-sm">
              <p>暂无弹幕消息</p>
            </div>
          </div>
          
          <!-- 弹幕输入 -->
          <div class="p-3 border-t border-gray-200">
            <div class="flex items-center space-x-2">
              <input 
                v-model="danmakuInput"
                @keyup.enter="sendDanmaku"
                type="text" 
                placeholder="和观众聊聊吧~"
                class="flex-1 bg-gray-100 border-0 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#00b5e5]"
              />
              <button 
                @click="sendDanmaku"
                class="px-4 py-2 bg-[#00b5e5] hover:bg-[#00a3d1] text-white rounded text-sm font-medium transition-colors"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <!-- 添加素材弹窗 -->
    <div v-if="showAddSourceModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showAddSourceModal = false">
      <div class="bg-white rounded-lg w-[520px] shadow-xl overflow-hidden">
        <!-- 头部 -->
        <div class="flex items-center justify-between px-4 py-3 bg-[#00b5e5]">
          <h3 class="text-base font-medium text-white">添加直播素材</h3>
          <button @click="showAddSourceModal = false" class="text-white/80 hover:text-white">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <!-- 素材类型网格 -->
        <div class="p-6">
          <div class="grid grid-cols-5 gap-4">
            <button 
              v-for="source in sourceTypes" 
              :key="source.type"
              @click="handleSourceClick(source.type)"
              class="flex flex-col items-center p-3 rounded-lg hover:bg-gray-100 transition-colors group relative"
            >
              <div class="w-12 h-12 flex items-center justify-center mb-2 rounded-lg group-hover:bg-[#e6f7fc] transition-colors">
                <component :is="source.icon" class="w-8 h-8 text-gray-400 group-hover:text-[#00b5e5] transition-colors" />
              </div>
              <span class="text-xs text-gray-600 group-hover:text-[#00b5e5] transition-colors">{{ source.name }}</span>
              <span v-if="source.isNew" class="absolute top-2 right-2 text-[8px] bg-red-500 text-white px-1 rounded">New</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 显示器选择弹窗 -->
    <div v-if="showScreenModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showScreenModal = false">
      <div class="bg-white rounded-lg w-[400px] shadow-xl">
        <!-- 头部 -->
        <div class="flex items-center justify-between px-4 py-3 bg-[#00b5e5]">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            <h3 class="text-base font-medium text-white">显示器</h3>
          </div>
          <div class="flex items-center space-x-2">
            <button class="text-white/80 hover:text-white">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </button>
            <button @click="showScreenModal = false" class="text-white/80 hover:text-white">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- 内容 -->
        <div class="p-6 space-y-4">
          <div class="flex items-center space-x-4">
            <label class="text-sm text-gray-600 w-20">来源命名</label>
            <input 
              v-model="screenSourceName"
              type="text" 
              class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00b5e5]"
              placeholder="显示器 1"
            />
          </div>
          
          <div class="flex items-center space-x-4">
            <label class="text-sm text-gray-600 w-20"></label>
            <div class="flex-1 flex items-center space-x-2">
              <select class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00b5e5]">
                <option>Monitor 1: 1920x1080 @ 0,0</option>
                <option>Monitor 2: 1920x1080 @ 1920,0</option>
              </select>
              <button class="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">刷新</button>
              <button class="text-gray-400 hover:text-gray-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <label class="text-sm text-gray-600 w-20"></label>
            <label class="flex items-center space-x-2 cursor-pointer">
              <input v-model="showMouse" type="checkbox" class="w-4 h-4 text-[#00b5e5] rounded border-gray-300 focus:ring-[#00b5e5]" />
              <span class="text-sm text-gray-700">显示鼠标</span>
            </label>
          </div>
          
          <div class="flex items-center space-x-4">
            <label class="text-sm text-gray-600 w-20"></label>
            <label class="flex items-center space-x-2 cursor-pointer opacity-50">
              <input type="checkbox" disabled class="w-4 h-4 rounded border-gray-300" />
              <span class="text-sm text-gray-500">多显卡兼容模式</span>
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </label>
          </div>
        </div>
        
        <!-- 底部按钮 -->
        <div class="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200">
          <button 
            @click="confirmAddScreen"
            class="px-6 py-2 bg-[#00b5e5] hover:bg-[#00a3d1] text-white rounded text-sm font-medium transition-colors"
          >
            确定
          </button>
          <button 
            @click="showScreenModal = false"
            class="px-6 py-2 border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, h } from 'vue'
import NavHeader from '@/components/NavHeader.vue'
import { useUserStore } from '@/stores/userStore'
import { liveAPI } from '@/api/live'

const userStore = useUserStore()

// 处理登录事件
const handleLogin = () => {
  // 派发事件给父组件或全局监听
  window.dispatchEvent(new CustomEvent('show-login-modal'))
}

// 直播状态
const isStreaming = ref(false)
const isRecording = ref(false)
const streamDuration = ref('00:00:00')
let streamTimer: number | null = null
let durationSeconds = 0

// 音频控制
const micEnabled = ref(true)
const micVolume = ref(100)
const speakerEnabled = ref(true)
const speakerVolume = ref(100)

// 素材相关
const showAddSourceModal = ref(false)
const showScreenModal = ref(false)
const sources = ref<Array<{id: string, type: string, name: string, url?: string, content?: string, stream?: MediaStream}>>([])
const selectedSource = ref<string | null>(null)
const screenSourceName = ref('显示器 1')
const showMouse = ref(true)

// 右侧标签页
const activeTab = ref('rank')
const showRank = ref(false)

// 高能榜
const rankList = ref<Array<{id: string, name: string, avatar: string, score: number}>>([])

// 图标组件 - 参考图片样式
const CameraIcon = {
  render: () => h('svg', { class: 'w-8 h-8', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'stroke-width': '1.5' }, [
    h('rect', { x: '2', y: '6', width: '20', height: '12', rx: '2' }),
    h('circle', { cx: '12', cy: '12', r: '3' }),
    h('path', { d: 'M18 10h.01' })
  ])
}

const WindowIcon = {
  render: () => h('svg', { class: 'w-8 h-8', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'stroke-width': '1.5' }, [
    h('rect', { x: '3', y: '4', width: '18', height: '16', rx: '2' }),
    h('line', { x1: '3', y1: '9', x2: '21', y2: '9' }),
    h('line', { x1: '9', y1: '4', x2: '9', y2: '9' })
  ])
}

const GameIcon = {
  render: () => h('svg', { class: 'w-8 h-8', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'stroke-width': '1.5' }, [
    h('rect', { x: '2', y: '6', width: '20', height: '12', rx: '2' }),
    h('circle', { cx: '8', cy: '12', r: '1.5', fill: 'currentColor' }),
    h('circle', { cx: '16', cy: '12', r: '1.5', fill: 'currentColor' }),
    h('path', { d: 'M8 12h8' }),
    h('path', { d: 'M12 8v8' })
  ])
}

const ScreenIcon = {
  render: () => h('svg', { class: 'w-8 h-8', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'stroke-width': '1.5' }, [
    h('rect', { x: '2', y: '3', width: '20', height: '14', rx: '2' }),
    h('line', { x1: '8', y1: '21', x2: '16', y2: '21' }),
    h('line', { x1: '12', y1: '17', x2: '12', y2: '21' })
  ])
}

const ImageIcon = {
  render: () => h('svg', { class: 'w-8 h-8', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'stroke-width': '1.5' }, [
    h('rect', { x: '3', y: '3', width: '18', height: '18', rx: '2' }),
    h('circle', { cx: '8.5', cy: '8.5', r: '1.5' }),
    h('path', { d: 'M21 15l-5-5L5 21' })
  ])
}

const TextIcon = {
  render: () => h('svg', { class: 'w-8 h-8', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'stroke-width': '1.5' }, [
    h('path', { d: 'M4 7V5h16v2' }),
    h('path', { d: 'M12 5v14' }),
    h('path', { d: 'M9 19h6' })
  ])
}

const AudioIcon = {
  render: () => h('svg', { class: 'w-8 h-8', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'stroke-width': '1.5' }, [
    h('path', { d: 'M9 18V5l12-3v13' }),
    h('circle', { cx: '6', cy: '18', r: '3' }),
    h('circle', { cx: '18', cy: '15', r: '3' })
  ])
}

const DanmakuIcon = {
  render: () => h('svg', { class: 'w-8 h-8', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'stroke-width': '1.5' }, [
    h('path', { d: 'M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z' }),
    h('circle', { cx: '9', cy: '11', r: '1', fill: 'currentColor' }),
    h('circle', { cx: '12', cy: '11', r: '1', fill: 'currentColor' }),
    h('circle', { cx: '15', cy: '11', r: '1', fill: 'currentColor' })
  ])
}

const CropIcon = {
  render: () => h('svg', { class: 'w-8 h-8', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'stroke-width': '1.5' }, [
    h('path', { d: 'M6.13 1L6 16a2 2 0 002 2h15' }),
    h('path', { d: 'M1 6.13L16 6a2 2 0 012 2v15' })
  ])
}

const PhoneIcon = {
  render: () => h('svg', { class: 'w-8 h-8', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'stroke-width': '1.5' }, [
    h('rect', { x: '7', y: '1', width: '10', height: '22', rx: '2' }),
    h('line', { x1: '11', y1: '18', x2: '13', y2: '18' })
  ])
}

const BrowserIcon = {
  render: () => h('svg', { class: 'w-8 h-8', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'stroke-width': '1.5' }, [
    h('circle', { cx: '12', cy: '12', r: '10' }),
    h('line', { x1: '2', y1: '12', x2: '22', y2: '12' }),
    h('path', { d: 'M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z' })
  ])
}

const MediaIcon = {
  render: () => h('svg', { class: 'w-8 h-8', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'stroke-width': '1.5' }, [
    h('rect', { x: '3', y: '4', width: '18', height: '16', rx: '2' }),
    h('polygon', { points: '10,8 16,12 10,16', fill: 'currentColor' })
  ])
}

const ThirdPartyIcon = {
  render: () => h('svg', { class: 'w-8 h-8', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', 'stroke-width': '1.5' }, [
    h('path', { d: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' })
  ])
}

// 素材类型定义 - 使用实际的组件引用
const sourceTypes = [
  { type: 'camera', name: '摄像头', icon: CameraIcon },
  { type: 'window', name: '窗口', icon: WindowIcon },
  { type: 'game', name: '游戏', icon: GameIcon },
  { type: 'screen', name: '全屏', icon: ScreenIcon },
  { type: 'image', name: '图片', icon: ImageIcon },
  { type: 'text', name: '文本', icon: TextIcon },
  { type: 'audio', name: '音频', icon: AudioIcon },
  { type: 'danmaku', name: '弹幕姬', icon: DanmakuIcon },
  { type: 'crop', name: '截屏', icon: CropIcon },
  { type: 'phone', name: '投屏', icon: PhoneIcon },
  { type: 'browser', name: '浏览器', icon: BrowserIcon },
  { type: 'media', name: '多媒体', icon: MediaIcon },
  { type: 'thirdparty', name: '第三方推流', icon: ThirdPartyIcon, isNew: true },
]

// 获取素材图标
const getSourceIcon = (type: string) => {
  const iconMap: Record<string, any> = {
    camera: CameraIcon,
    window: WindowIcon,
    game: GameIcon,
    screen: ScreenIcon,
    image: ImageIcon,
    text: TextIcon,
    audio: AudioIcon,
    danmaku: DanmakuIcon,
    crop: CropIcon,
    phone: PhoneIcon,
    browser: BrowserIcon,
    media: MediaIcon,
    thirdparty: ThirdPartyIcon,
  }
  return iconMap[type] || CameraIcon
}

// 互动工具图标 - 参考设计图样式（必须在 interactionTools 之前定义）
const GiftIcon = {
  render: () => h('svg', { class: 'w-6 h-6', viewBox: '0 0 24 24', fill: 'none' }, [
    // 礼物盒子主体
    h('rect', { x: '4', y: '8', width: '16', height: '12', rx: '2', fill: 'currentColor', opacity: '0.9' }),
    // 盒子顶部
    h('rect', { x: '4', y: '6', width: '16', height: '4', rx: '1', fill: 'currentColor' }),
    // 竖向丝带
    h('rect', { x: '11', y: '6', width: '2', height: '14', fill: 'white', opacity: '0.3' }),
    // 蝴蝶结
    h('path', { d: 'M12 6c0-2-1.5-3-3-3s-3 1-3 3', stroke: 'white', 'stroke-width': '1.5', fill: 'none' }),
    h('path', { d: 'M12 6c0-2 1.5-3 3-3s3 1 3 3', stroke: 'white', 'stroke-width': '1.5', fill: 'none' })
  ])
}

const PromoteIcon = {
  render: () => h('svg', { class: 'w-6 h-6', viewBox: '0 0 24 24', fill: 'none' }, [
    // 喇叭主体
    h('path', { d: 'M3 9v6h3l6 4V5L6 9H3z', fill: 'currentColor' }),
    // 声波
    h('path', { d: 'M16 8c1.5 1.5 1.5 6.5 0 8', stroke: 'currentColor', 'stroke-width': '1.5', 'stroke-linecap': 'round' }),
    h('path', { d: 'M19 6c2.5 2.5 2.5 9.5 0 12', stroke: 'currentColor', 'stroke-width': '1.5', 'stroke-linecap': 'round' }),
    // 推广文字背景
    h('rect', { x: '14', y: '2', width: '8', height: '5', rx: '1', fill: '#ff6b9d' }),
    h('text', { x: '18', y: '6', 'font-size': '3', fill: 'white', 'text-anchor': 'middle', 'font-weight': 'bold' }, '推')
  ])
}

const PKIcon = {
  render: () => h('svg', { class: 'w-6 h-6', viewBox: '0 0 24 24', fill: 'none' }, [
    // 外圈
    h('circle', { cx: '12', cy: '12', r: '10', fill: 'currentColor', opacity: '0.15' }),
    h('circle', { cx: '12', cy: '12', r: '9', stroke: 'currentColor', 'stroke-width': '1.5', fill: 'none' }),
    // PK文字
    h('text', { x: '7', y: '16', 'font-size': '8', fill: 'currentColor', 'font-weight': 'bold', 'font-family': 'Arial' }, 'P'),
    h('text', { x: '13', y: '16', 'font-size': '8', fill: 'currentColor', 'font-weight': 'bold', 'font-family': 'Arial' }, 'K'),
    // 闪电装饰
    h('path', { d: 'M18 4l-2 4h3l-4 6 1-4h-3l3-6z', fill: '#ffd700' })
  ])
}

const HotIcon = {
  render: () => h('svg', { class: 'w-6 h-6', viewBox: '0 0 24 24', fill: 'none' }, [
    // 火焰形状
    h('path', { 
      d: 'M12 2c0 0-2 3-2 6 0 1.5.5 2.5 1 3.5C10 11 8 10 8 8c0 0-3 3-3 7 0 4 3.5 7 7 7s7-3 7-7c0-2-.5-3.5-1.5-5C19.5 11.5 22 14 22 14c0-5-4-9-6-10 0 0 1 2 1 4 0 0-2-2-3-4 0 0-1 1-1 2.5C13 5.5 12 2 12 2z', 
      fill: 'currentColor' 
    }),
    // 内部高光
    h('path', { 
      d: 'M12 8c0 0-1 2-1 4 0 2 1 3 1 3s1-1 1-3c0-1.5-.5-3-1-4z', 
      fill: 'white', 
      opacity: '0.4' 
    }),
    // 热门标签
    h('rect', { x: '2', y: '14', width: '8', height: '4', rx: '1', fill: '#ff4757' }),
    h('text', { x: '6', y: '17', 'font-size': '2.5', fill: 'white', 'text-anchor': 'middle', 'font-weight': 'bold' }, 'HOT')
  ])
}

const ConnectIcon = {
  render: () => h('svg', { class: 'w-6 h-6', viewBox: '0 0 24 24', fill: 'none' }, [
    // 左侧人物
    h('circle', { cx: '7', cy: '8', r: '3', fill: 'currentColor', opacity: '0.8' }),
    h('path', { d: 'M3 18c0-2.5 2-4.5 4-4.5s4 2 4 4.5v2H3v-2z', fill: 'currentColor', opacity: '0.8' }),
    // 右侧人物
    h('circle', { cx: '17', cy: '8', r: '3', fill: 'currentColor', opacity: '0.8' }),
    h('path', { d: 'M13 18c0-2.5 2-4.5 4-4.5s4 2 4 4.5v2H13v-2z', fill: 'currentColor', opacity: '0.8' }),
    // 连接符号
    h('circle', { cx: '12', cy: '14', r: '2', fill: '#10b981' }),
    h('path', { d: 'M10 14H7M17 14h-3', stroke: '#10b981', 'stroke-width': '1.5', 'stroke-linecap': 'round' })
  ])
}

const ScheduleIcon = {
  render: () => h('svg', { class: 'w-6 h-6', viewBox: '0 0 24 24', fill: 'none' }, [
    // 日历主体
    h('rect', { x: '3', y: '5', width: '18', height: '16', rx: '2', fill: 'currentColor', opacity: '0.15' }),
    h('rect', { x: '3', y: '5', width: '18', height: '16', rx: '2', stroke: 'currentColor', 'stroke-width': '1.5', fill: 'none' }),
    // 顶部挂环
    h('path', { d: 'M7 5V3M17 5V3', stroke: 'currentColor', 'stroke-width': '1.5', 'stroke-linecap': 'round' }),
    // 日历头部
    h('rect', { x: '3', y: '5', width: '18', height: '5', rx: '2', fill: 'currentColor' }),
    // 勾选标记
    h('path', { d: 'M8 14l3 3 5-6', stroke: 'white', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })
  ])
}

// 直播互动工具（在图标组件定义之后）
const interactionTools = ref([
  {
    name: '礼物盒子',
    icon: GiftIcon,
    action: () => {},
    bgColor: '#fce7f3',
    iconColor: '#ec4899'
  },
  {
    name: '直播推广',
    icon: PromoteIcon,
    action: () => {},
    bgColor: '#dbeafe',
    iconColor: '#3b82f6'
  },
  {
    name: 'PK大乱斗',
    icon: PKIcon,
    action: () => {},
    bgColor: '#f3e8ff',
    iconColor: '#a855f7'
  },
  {
    name: '限时热门榜',
    icon: HotIcon,
    action: () => {},
    bgColor: '#ffedd5',
    iconColor: '#f97316'
  },
  {
    name: '和用户连麦',
    icon: ConnectIcon,
    action: () => {},
    bgColor: '#d1fae5',
    iconColor: '#10b981'
  },
  {
    name: '直播预约',
    icon: ScheduleIcon,
    action: () => {},
    bgColor: '#e0e7ff',
    iconColor: '#6366f1'
  },
])

// 弹幕相关
const danmakuMessages = ref<Array<{
  username: string
  content: string
  level?: number
  isAnchor?: boolean
}>>([
  { username: '憨憨吉', content: '欢迎光辉级不挠号，终于等到你~', level: 14, isAnchor: true },
  { username: '光辉级不挠号', content: '进入直播间', level: 10 },
  { username: '加西佩', content: 'IBUKI_IBUKI 进入直播间', level: 10 },
])
const danmakuInput = ref('')
const danmakuContainer = ref<HTMLElement | null>(null)

// 屏幕共享流
const screenStream = ref<MediaStream | null>(null)
const cameraStream = ref<MediaStream | null>(null)
const screenVideoRef = ref<HTMLVideoElement | null>(null)
const cameraVideoRef = ref<HTMLVideoElement | null>(null)

// 处理素材点击
const handleSourceClick = async (type: string) => {
  if (type === 'screen') {
    showAddSourceModal.value = false
    await startScreenShare()
  } else if (type === 'camera') {
    showAddSourceModal.value = false
    await startCamera()
  } else {
    addSource(type)
  }
}

// 开始屏幕共享
const startScreenShare = async () => {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false
    })
    
    screenStream.value = stream
    
    // 添加屏幕共享素材到列表
    const newSource = {
      id: Date.now().toString(),
      type: 'screen',
      name: '屏幕共享',
      stream: stream
    }
    sources.value.push(newSource as any)
    
    // 监听屏幕共享结束
    stream.getVideoTracks()[0].onended = () => {
      stopScreenShare()
    }
    
  } catch (err) {
    console.error('屏幕共享失败:', err)
    alert('屏幕共享需要用户授权，请允许访问屏幕')
  }
}

// 停止屏幕共享
const stopScreenShare = () => {
  if (screenStream.value) {
    screenStream.value.getTracks().forEach(track => track.stop())
    screenStream.value = null
  }
  // 从素材列表中移除屏幕共享
  const index = sources.value.findIndex(s => s.type === 'screen')
  if (index > -1) {
    sources.value.splice(index, 1)
  }
}

// 开始摄像头（带麦克风）
const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        facingMode: 'user'
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100
      }
    })
    
    cameraStream.value = stream
    
    // 添加摄像头素材到列表
    const newSource = {
      id: Date.now().toString(),
      type: 'camera',
      name: '摄像头',
      stream: stream
    }
    sources.value.push(newSource as any)
    
  } catch (err) {
    console.error('摄像头启动失败:', err)
    alert('无法访问摄像头和麦克风，请检查设备权限设置')
  }
}

// 停止摄像头
const stopCamera = () => {
  if (cameraStream.value) {
    cameraStream.value.getTracks().forEach(track => track.stop())
    cameraStream.value = null
  }
  // 从素材列表中移除摄像头
  const index = sources.value.findIndex(s => s.type === 'camera')
  if (index > -1) {
    sources.value.splice(index, 1)
  }
}

// 确认添加屏幕
const confirmAddScreen = () => {
  const newSource = {
    id: Date.now().toString(),
    type: 'screen',
    name: screenSourceName.value,
  }
  sources.value.push(newSource)
  showScreenModal.value = false
}

// 添加素材
const addSource = (type: string) => {
  const typeNameMap: Record<string, string> = {
    camera: '摄像头',
    window: '窗口',
    game: '游戏',
    screen: '全屏',
    image: '图片',
    text: '文本',
    audio: '音频',
    danmaku: '弹幕姬',
    crop: '截屏',
    phone: '投屏',
    browser: '浏览器',
    media: '多媒体',
    thirdparty: '第三方推流',
  }
  
  const newSource = {
    id: Date.now().toString(),
    type,
    name: typeNameMap[type] || '未知素材',
    url: type === 'image' ? 'https://images.unsplash.com/photo-1605098195882-b6819b8555b6?auto=format&fit=crop&w=600&q=80' : undefined,
    content: type === 'text' ? '欢迎来到直播间' : undefined
  }
  sources.value.push(newSource)
  showAddSourceModal.value = false
}

// 删除素材
const removeSource = (index: number) => {
  const source = sources.value[index]
  // 如果是屏幕共享或摄像头，停止对应的媒体流
  if (source.type === 'screen' && source.stream) {
    source.stream.getTracks().forEach((track: MediaStreamTrack) => track.stop())
    if (screenStream.value === source.stream) {
      screenStream.value = null
    }
  }
  if (source.type === 'camera' && source.stream) {
    source.stream.getTracks().forEach((track: MediaStreamTrack) => track.stop())
    if (cameraStream.value === source.stream) {
      cameraStream.value = null
    }
  }
  sources.value.splice(index, 1)
}

// 开始/结束直播
const toggleStreaming = async () => {
  if (isStreaming.value) {
    // 结束直播
    try {
      const userId = userStore.userId || 1
      await liveAPI.stopLive({
        user_id: userId
      })
      isStreaming.value = false
      if (streamTimer) {
        clearInterval(streamTimer)
        streamTimer = null
      }
      durationSeconds = 0
      streamDuration.value = '00:00:00'
    } catch (error) {
      console.error('结束直播失败:', error)
      alert('结束直播失败，请重试')
    }
  } else {
    // 开始直播
    try {
      const userId = userStore.userId || 1
      const response = await liveAPI.startLive({
        user_id: userId,
        title: '我的直播间',
        category: '娱乐'
      })

      if (response.data.code === 0) {
        isStreaming.value = true
        streamTimer = window.setInterval(() => {
          durationSeconds++
          const hours = Math.floor(durationSeconds / 3600).toString().padStart(2, '0')
          const minutes = Math.floor((durationSeconds % 3600) / 60).toString().padStart(2, '0')
          const seconds = (durationSeconds % 60).toString().padStart(2, '0')
          streamDuration.value = `${hours}:${minutes}:${seconds}`
        }, 1000)
      } else {
        alert('开始直播失败: ' + response.data.message)
      }
    } catch (error) {
      console.error('开始直播失败:', error)
      alert('开始直播失败，请重试')
    }
  }
}

// 发送弹幕
const sendDanmaku = () => {
  if (!danmakuInput.value.trim()) return
  
  danmakuMessages.value.push({
    username: '主播',
    content: danmakuInput.value,
    level: 20,
    isAnchor: true
  })
  
  danmakuInput.value = ''
  
  nextTick(() => {
    if (danmakuContainer.value) {
      danmakuContainer.value.scrollTop = danmakuContainer.value.scrollHeight
    }
  })
}

// 模拟音量变化
onMounted(() => {
  const volumeInterval = setInterval(() => {
    if (micEnabled.value) {
      micVolume.value = Math.floor(Math.random() * 30) + 70
    }
  }, 200)
  
  return () => {
    clearInterval(volumeInterval)
    if (streamTimer) clearInterval(streamTimer)
  }
})

onUnmounted(() => {
  if (streamTimer) clearInterval(streamTimer)
  // 清理所有媒体流
  sources.value.forEach(source => {
    if (source.stream) {
      source.stream.getTracks().forEach((track: MediaStreamTrack) => track.stop())
    }
  })
  if (screenStream.value) {
    screenStream.value.getTracks().forEach(track => track.stop())
  }
  if (cameraStream.value) {
    cameraStream.value.getTracks().forEach(track => track.stop())
  }
})
</script>

<style scoped>
/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
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