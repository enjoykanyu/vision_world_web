<template>
  <div class="min-h-screen bg-gradient-to-br from-brand-dark via-gray-900 to-brand-primary relative overflow-hidden">
    <!-- 背景动画 -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-primary to-brand-secondary animate-pulse-slow"></div>
    </div>
    
    <!-- 科技感网格背景 -->
    <div class="absolute inset-0 tech-grid opacity-20"></div>
    
    <!-- 浮动粒子效果 -->
    <div class="absolute inset-0">
      <div v-for="i in 30" :key="i" 
           class="absolute w-1 h-1 bg-brand-primary rounded-full opacity-40 animate-float"
           :style="{
             left: Math.random() * 100 + '%',
             top: Math.random() * 100 + '%',
             animationDelay: Math.random() * 6 + 's',
             animationDuration: (Math.random() * 4 + 4) + 's'
           }">
      </div>
    </div>

    <!-- 顶部导航 -->
    <nav class="relative z-10 glass-card border-b border-white/10">
      <div class="container mx-auto px-6">
        <div class="flex items-center justify-between h-16">
          <!-- 左侧Logo和返回按钮 -->
          <div class="flex items-center space-x-4">
            <button @click="goBack" class="text-white hover:text-brand-secondary transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center shadow-glow">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
              </div>
              <h1 class="text-xl font-bold text-white">视频智能分析助手</h1>
            </div>
          </div>

          <!-- 右侧功能按钮 -->
          <div class="flex items-center space-x-3">
            <button class="text-white/70 hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </button>
            <button class="text-white/70 hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <main class="relative z-10 container mx-auto px-6 py-8">
      <!-- 标题区域 -->
      <div class="text-center mb-12 animate-fade-in">
        <h2 class="text-4xl md:text-5xl font-bold gradient-text mb-6">
          智能视频分析助手
        </h2>
        <p class="text-xl text-white/80 max-w-3xl mx-auto">
          基于AI技术的视频内容分析工具，为您提供专业的视频解析、内容识别和智能建议
        </p>
      </div>

      <!-- 主要功能区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <!-- 视频上传区域 -->
        <div class="lg:col-span-2">
          <div class="glass-card p-8 animate-scale-in">
            <h3 class="text-2xl font-bold text-white mb-6 flex items-center">
              <svg class="w-6 h-6 mr-3 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
              视频上传
            </h3>
            
            <!-- 上传区域 -->
            <div class="border-2 border-dashed border-white/20 rounded-2xl p-12 text-center hover:border-brand-primary/50 transition-colors cursor-pointer"
                 @click="triggerFileUpload"
                 @dragover.prevent
                 @drop.prevent="handleFileDrop">
              <input type="file" ref="fileInput" class="hidden" accept="video/*" @change="handleFileSelect">
              
              <div v-if="!uploadedFile" class="space-y-4">
                <div class="w-16 h-16 mx-auto bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl flex items-center justify-center">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                  </svg>
                </div>
                <div>
                  <p class="text-white font-medium mb-2">点击或拖拽视频文件到此处</p>
                  <p class="text-white/60 text-sm">支持 MP4, AVI, MOV, MKV 格式，最大 100MB</p>
                </div>
              </div>
              
              <div v-else class="space-y-4">
                <div class="w-16 h-16 mx-auto bg-brand-primary/20 rounded-2xl flex items-center justify-center">
                  <svg class="w-8 h-8 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-white font-medium mb-1">{{ uploadedFile.name }}</p>
                  <p class="text-white/60 text-sm">{{ formatFileSize(uploadedFile.size) }}</p>
                </div>
                <button @click.stop="removeFile" class="text-red-400 hover:text-red-300 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- 分析按钮 -->
            <div class="mt-8 flex justify-center">
              <button @click="analyzeVideo" 
                      :disabled="!uploadedFile || isAnalyzing"
                      class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                <span v-if="!isAnalyzing" class="flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                  </svg>
                  开始分析
                </span>
                <span v-else class="flex items-center">
                  <svg class="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  分析中...
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- 功能特性区域 -->
        <div class="space-y-6">
          <div class="glass-card p-6 animate-scale-in" style="animation-delay: 0.1s">
            <h4 class="text-lg font-bold text-white mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              分析功能
            </h4>
            <ul class="space-y-3 text-white/80">
              <li class="flex items-start">
                <svg class="w-4 h-4 mr-2 mt-0.5 text-brand-accent flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <span class="text-sm">视频内容识别与分类</span>
              </li>
              <li class="flex items-start">
                <svg class="w-4 h-4 mr-2 mt-0.5 text-brand-accent flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <span class="text-sm">场景与物体检测</span>
              </li>
              <li class="flex items-start">
                <svg class="w-4 h-4 mr-2 mt-0.5 text-brand-accent flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <span class="text-sm">情感与主题分析</span>
              </li>
              <li class="flex items-start">
                <svg class="w-4 h-4 mr-2 mt-0.5 text-brand-accent flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <span class="text-sm">质量评估与建议</span>
              </li>
            </ul>
          </div>

          <div class="glass-card p-6 animate-scale-in" style="animation-delay: 0.2s">
            <h4 class="text-lg font-bold text-white mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              技术特点
            </h4>
            <ul class="space-y-3 text-white/80">
              <li class="flex items-start">
                <svg class="w-4 h-4 mr-2 mt-0.5 text-brand-accent flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <span class="text-sm">AI深度学习算法</span>
              </li>
              <li class="flex items-start">
                <svg class="w-4 h-4 mr-2 mt-0.5 text-brand-accent flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <span class="text-sm">实时处理与分析</span>
              </li>
              <li class="flex items-start">
                <svg class="w-4 h-4 mr-2 mt-0.5 text-brand-accent flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <span class="text-sm">多维度数据报告</span>
              </li>
              <li class="flex items-start">
                <svg class="w-4 h-4 mr-2 mt-0.5 text-brand-accent flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <span class="text-sm">智能优化建议</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 分析结果区域 -->
      <div v-if="analysisResult" class="glass-card p-8 animate-slide-up">
        <h3 class="text-2xl font-bold text-white mb-6 flex items-center">
          <svg class="w-6 h-6 mr-3 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
          分析结果
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- 基础信息 -->
          <div class="bg-white/5 rounded-xl p-6">
            <h4 class="text-lg font-semibold text-white mb-3">基础信息</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-white/60">文件名</span>
                <span class="text-white">{{ analysisResult.fileName }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-white/60">时长</span>
                <span class="text-white">{{ analysisResult.duration }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-white/60">分辨率</span>
                <span class="text-white">{{ analysisResult.resolution }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-white/60">格式</span>
                <span class="text-white">{{ analysisResult.format }}</span>
              </div>
            </div>
          </div>

          <!-- 内容分析 -->
          <div class="bg-white/5 rounded-xl p-6">
            <h4 class="text-lg font-semibold text-white mb-3">内容分析</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-white/60">主要场景</span>
                <span class="text-white">{{ analysisResult.mainScene }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-white/60">物体数量</span>
                <span class="text-white">{{ analysisResult.objectCount }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-white/60">人物数量</span>
                <span class="text-white">{{ analysisResult.personCount }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-white/60">情感倾向</span>
                <span class="text-white">{{ analysisResult.emotion }}</span>
              </div>
            </div>
          </div>

          <!-- 质量评估 -->
          <div class="bg-white/5 rounded-xl p-6">
            <h4 class="text-lg font-semibold text-white mb-3">质量评估</h4>
            <div class="space-y-3">
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-white/60">画面质量</span>
                  <span class="text-white">{{ analysisResult.quality.video }}/10</span>
                </div>
                <div class="w-full bg-white/10 rounded-full h-2">
                  <div class="bg-gradient-to-r from-brand-primary to-brand-secondary h-2 rounded-full" 
                       :style="{width: analysisResult.quality.video * 10 + '%'}"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-white/60">音频质量</span>
                  <span class="text-white">{{ analysisResult.quality.audio }}/10</span>
                </div>
                <div class="w-full bg-white/10 rounded-full h-2">
                  <div class="bg-gradient-to-r from-brand-accent to-brand-primary h-2 rounded-full" 
                       :style="{width: analysisResult.quality.audio * 10 + '%'}"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-white/60">内容质量</span>
                  <span class="text-white">{{ analysisResult.quality.content }}/10</span>
                </div>
                <div class="w-full bg-white/10 rounded-full h-2">
                  <div class="bg-gradient-to-r from-brand-secondary to-brand-accent h-2 rounded-full" 
                       :style="{width: analysisResult.quality.content * 10 + '%'}"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 智能建议 -->
          <div class="bg-white/5 rounded-xl p-6">
            <h4 class="text-lg font-semibold text-white mb-3">智能建议</h4>
            <div class="space-y-2 text-sm">
              <div v-for="suggestion in analysisResult.suggestions" :key="suggestion" 
                   class="flex items-start">
                <svg class="w-4 h-4 mr-2 mt-0.5 text-brand-accent flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <span class="text-white">{{ suggestion }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 详细分析 -->
        <div class="bg-white/5 rounded-xl p-6">
          <h4 class="text-lg font-semibold text-white mb-4">详细分析</h4>
          <div class="prose prose-invert max-w-none">
            <p class="text-white/80 leading-relaxed">{{ analysisResult.detailedAnalysis }}</p>
          </div>
        </div>
      </div>

      <!-- 问答区域 -->
      <div v-if="analysisResult" class="glass-card p-8 animate-slide-up" style="animation-delay: 0.2s">
        <h3 class="text-2xl font-bold text-white mb-6 flex items-center">
          <svg class="w-6 h-6 mr-3 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
          智能问答
        </h3>
        
        <div class="space-y-6">
          <!-- 问题输入 -->
          <div class="flex space-x-4">
            <input v-model="userQuestion" 
                   type="text" 
                   placeholder="请输入您关于视频的问题..."
                   class="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-brand-primary transition-colors"
                   @keyup.enter="askQuestion">
            <button @click="askQuestion" 
                    :disabled="!userQuestion.trim() || isAnswering"
                    class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
              <span v-if="!isAnswering">提问</span>
              <span v-else>思考中...</span>
            </button>
          </div>

          <!-- 问答历史 -->
          <div v-if="qaHistory.length > 0" class="space-y-4 max-h-96 overflow-y-auto">
            <div v-for="(qa, index) in qaHistory" :key="index" class="space-y-3">
              <!-- 用户问题 -->
              <div class="flex items-start space-x-3">
                <div class="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <p class="text-white font-medium mb-1">您</p>
                  <p class="text-white/80 bg-white/5 rounded-xl p-3">{{ qa.question }}</p>
                </div>
              </div>

              <!-- AI回答 -->
              <div class="flex items-start space-x-3">
                <div class="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <p class="text-white font-medium mb-1">AI助手</p>
                  <p class="text-white/80 bg-brand-primary/10 rounded-xl p-3">{{ qa.answer }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 示例问题 -->
          <div v-if="qaHistory.length === 0" class="bg-white/5 rounded-xl p-6">
            <h4 class="text-lg font-semibold text-white mb-4">示例问题</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button v-for="example in exampleQuestions" :key="example"
                      @click="userQuestion = example"
                      class="text-left text-white/70 hover:text-white transition-colors p-3 bg-white/5 rounded-lg hover:bg-white/10">
                {{ example }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 响应式数据
const fileInput = ref<HTMLInputElement | null>(null)
const uploadedFile = ref<File | null>(null)
const isAnalyzing = ref(false)
const isAnswering = ref(false)
const userQuestion = ref('')
const analysisResult = ref<any>(null)
const qaHistory = ref<{question: string, answer: string}[]>([])

// 示例问题
const exampleQuestions = [
  '这个视频的主要主题是什么？',
  '视频中出现了哪些重要物体？',
  '视频的整体情感倾向如何？',
  '有什么改进建议吗？',
  '这个视频适合什么平台发布？',
  '视频的技术质量如何？'
]

// 方法
const goBack = () => {
  router.push({ name: 'home' })
}

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file && file.type.startsWith('video/')) {
    uploadedFile.value = file
  }
}

const handleFileDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files[0]
  if (file && file.type.startsWith('video/')) {
    uploadedFile.value = file
  }
}

const removeFile = () => {
  uploadedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const analyzeVideo = async () => {
  if (!uploadedFile.value) return
  
  isAnalyzing.value = true
  
  // 模拟分析过程
  await new Promise(resolve => setTimeout(resolve, 3000))
  
  // 模拟分析结果
  analysisResult.value = {
    fileName: uploadedFile.value.name,
    duration: '02:35',
    resolution: '1920x1080',
    format: 'MP4',
    mainScene: '室内会议',
    objectCount: '15+',
    personCount: '3-5',
    emotion: '专业、正式',
    quality: {
      video: 8,
      audio: 7,
      content: 9
    },
    suggestions: [
      '建议提高音频清晰度',
      '可以增加更多视觉元素',
      '适当缩短视频长度',
      '添加字幕提升可访问性'
    ],
    detailedAnalysis: '该视频主要展示了一个室内会议场景，画面质量较高，色彩还原准确。音频清晰但略有背景噪音。内容组织良好，主题明确，适合用于专业场合。建议在后续制作中注意音频环境的优化，并考虑添加更多视觉辅助元素来增强信息传递效果。'
  }
  
  isAnalyzing.value = false
}

const askQuestion = async () => {
  if (!userQuestion.value.trim() || isAnswering.value) return
  
  const question = userQuestion.value.trim()
  isAnswering.value = true
  
  // 模拟AI回答
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // 根据问题生成回答
  let answer = ''
  if (question.includes('主题') || question.includes('主要内容')) {
    answer = '根据视频分析，这个视频的主要主题是室内会议讨论，涉及项目进展汇报和团队协作相关内容。视频整体风格专业、正式，适合商务场合使用。'
  } else if (question.includes('物体') || question.includes('物品')) {
    answer = '视频中识别到的主要物体包括：会议桌、椅子、笔记本电脑、投影仪、白板、水杯等办公用品。画面整洁有序，体现了专业的会议环境。'
  } else if (question.includes('情感') || question.includes('氛围')) {
    answer = '视频整体情感倾向为专业、正式，参与者表情认真专注，传递出积极的工作态度和专业的商务氛围。语调平稳，节奏适中。'
  } else if (question.includes('建议') || question.includes('改进')) {
    answer = '基于分析结果，建议：1) 优化音频质量，减少背景噪音；2) 适当增加视觉辅助元素；3) 考虑添加多语言字幕；4) 可适当缩短视频长度，保持观众注意力；5) 增加互动环节提升参与感。'
  } else if (question.includes('平台') || question.includes('发布')) {
    answer = '根据视频内容和风格，建议发布在LinkedIn、YouTube等专业平台，也适合企业内部培训使用。如需面向更广泛受众，建议适当调整内容深度和表达方式。'
  } else if (question.includes('质量') || question.includes('技术')) {
    answer = '视频技术质量整体良好：画面分辨率1920x1080，清晰度高；色彩还原准确；音频清晰但略有背景噪音。建议在音频处理和光线优化方面做进一步提升。'
  } else {
    answer = '感谢您的提问。基于视频分析结果，这是一个专业的会议视频，内容质量较高，适合商务场合使用。如果您有其他具体问题，请随时告诉我。'
  }
  
  qaHistory.value.push({
    question,
    answer
  })
  
  userQuestion.value = ''
  isAnswering.value = false
}
</script>

<style scoped>
/* 自定义滚动条 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, #6366F1 0%, #EC4899 100%);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(45deg, #EC4899 0%, #6366F1 100%);
}
</style>