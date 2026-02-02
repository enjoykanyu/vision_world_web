<template>
  <div class="v-assistant-container">
    <!-- 小V助手图标 - 仅在桌面端显示 -->
    <div
      v-if="!isMobile"
      ref="assistantIcon"
      class="v-assistant-icon"
      :style="{ left: position.x + 'px', top: position.y + 'px' }"
      @mousedown="startDrag"
      :class="{ 'is-open': isDialogOpen }"
    >
      <div class="v-icon-wrapper">
        <!-- 粒子动画Canvas -->
        <canvas
          ref="particleCanvas"
          class="particle-canvas"
          width="60"
          height="60"
        ></canvas>
        <!-- 虚拟精灵形象 -->
        <div class="sprite-container" :class="{ 'is-open': isDialogOpen, 'is-blinking': isBlinking }">
          <svg viewBox="0 0 60 60" class="sprite-svg">
            <defs>
              <!-- 身体渐变 -->
              <radialGradient id="sprite-body-gradient" cx="50%" cy="40%" r="50%">
                <stop offset="0%" style="stop-color: #A8E6CF;" />
                <stop offset="60%" style="stop-color: #7FD8BE;" />
                <stop offset="100%" style="stop-color: #5AC8A8;" />
              </radialGradient>
              <!-- 耳朵渐变 -->
              <linearGradient id="sprite-ear-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color: #FFB6C1;" />
                <stop offset="100%" style="stop-color: #FF9AAE;" />
              </linearGradient>
              <!-- 眼睛渐变 -->
              <radialGradient id="sprite-eye-gradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style="stop-color: #2C3E50;" />
                <stop offset="70%" style="stop-color: #1A252F;" />
                <stop offset="100%" style="stop-color: #0D1318;" />
              </radialGradient>
              <!-- 发光滤镜 -->
              <filter id="sprite-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            <!-- 精灵形象 -->
            <g class="sprite-character">
              <!-- 左耳 -->
              <ellipse cx="18" cy="18" rx="8" ry="12" fill="url(#sprite-ear-gradient)" transform="rotate(-20 18 18)"/>
              <ellipse cx="18" cy="18" rx="4" ry="7" fill="#FF8FA3" transform="rotate(-20 18 18)"/>
              
              <!-- 右耳 -->
              <ellipse cx="42" cy="18" rx="8" ry="12" fill="url(#sprite-ear-gradient)" transform="rotate(20 42 18)"/>
              <ellipse cx="42" cy="18" rx="4" ry="7" fill="#FF8FA3" transform="rotate(20 42 18)"/>
              
              <!-- 身体 -->
              <ellipse cx="30" cy="38" rx="20" ry="18" fill="url(#sprite-body-gradient)"/>
              
              <!-- 肚子 -->
              <ellipse cx="30" cy="42" rx="12" ry="10" fill="#E8F8F5" opacity="0.6"/>
              
              <!-- 左眼 -->
              <g class="sprite-eye left">
                <ellipse cx="23" cy="32" rx="5" ry="6" fill="url(#sprite-eye-gradient)"/>
                <circle cx="24" cy="30" r="2" fill="white" opacity="0.9"/>
                <circle cx="22" cy="33" r="1" fill="white" opacity="0.5"/>
              </g>
              
              <!-- 右眼 -->
              <g class="sprite-eye right">
                <ellipse cx="37" cy="32" rx="5" ry="6" fill="url(#sprite-eye-gradient)"/>
                <circle cx="38" cy="30" r="2" fill="white" opacity="0.9"/>
                <circle cx="36" cy="33" r="1" fill="white" opacity="0.5"/>
              </g>
              
              <!-- 眨眼时的闭眼线条 -->
              <g class="sprite-eye-closed">
                <path d="M18 32 Q23 35 28 32" stroke="#2C3E50" stroke-width="2" fill="none" stroke-linecap="round"/>
                <path d="M32 32 Q37 35 42 32" stroke="#2C3E50" stroke-width="2" fill="none" stroke-linecap="round"/>
              </g>
              
              <!-- 腮红 -->
              <ellipse cx="16" cy="38" rx="4" ry="2.5" fill="#FFB6C1" opacity="0.5"/>
              <ellipse cx="44" cy="38" rx="4" ry="2.5" fill="#FFB6C1" opacity="0.5"/>
              
              <!-- 嘴巴 -->
              <path d="M27 42 Q30 45 33 42" stroke="#2C3E50" stroke-width="1.5" fill="none" stroke-linecap="round"/>
              
              <!-- 小手 -->
              <ellipse cx="12" cy="40" rx="4" ry="5" fill="#7FD8BE"/>
              <ellipse cx="48" cy="40" rx="4" ry="5" fill="#7FD8BE"/>
            </g>
          </svg>
        </div>
      </div>
    </div>

    <!-- 对话框 -->
    <transition :name="isMobile ? 'dialog-slide' : 'dialog-fade'">
      <div
        v-if="isDialogOpen"
        class="v-assistant-dialog"
        :class="{ 'mobile-dialog': isMobile }"
        :style="isMobile ? {} : { left: dialogPosition.x + 'px', top: dialogPosition.y + 'px' }"
        @mousedown.stop
        @click.stop
      >
        <div class="dialog-header">
          <div class="header-title">
            <svg class="header-icon" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
            <span>小V助手</span>
          </div>
          <button @click="toggleDialog" class="close-btn" aria-label="关闭">
            <svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="dialog-content">
          <div class="chat-messages" ref="chatMessages">
            <div v-if="messages.length === 0" class="welcome-view">
              <div class="welcome-icon">
                <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
              </div>
              <h2 class="welcome-title">你好，我是小V助手</h2>
              <p class="welcome-subtitle">随时可以向我提问</p>
            </div>
            <div
              v-for="(message, index) in messages"
              :key="index"
              :class="['message', message.type]"
            >
              <div class="message-content" v-if="message.type === 'user'">{{ message.content }}</div>
              <div class="message-content markdown-body" v-else v-html="renderMarkdown(message.content)"></div>
            </div>
            <div v-if="isTyping" class="message assistant typing">
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
          
          <!-- 猜你想问区域 -->
          <div v-if="messages.length === 0" class="suggested-questions-container">
            <div class="suggested-questions">
              <button
                v-for="(question, index) in suggestedQuestions"
                :key="index"
                class="question-chip"
                @click="(event) => sendSuggestedQuestion(question, event)"
              >
                {{ question }}
              </button>
            </div>
          </div>
          
          <div class="input-area">
            <textarea
              ref="inputArea"
              v-model="userInput"
              @keyup.enter.exact="sendMessage"
              placeholder="问我任何问题..."
              :disabled="isTyping"
              @input="autoResizeTextarea"
            ></textarea>
            <button @click="sendMessage" :disabled="isTyping || !userInput.trim()" class="send-btn" aria-label="发送">
              <svg viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </transition>
    

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick, watch, computed } from 'vue'
import axios from 'axios'
import MarkdownIt from 'markdown-it'

// Markdown渲染器
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
});

const renderMarkdown = (content: string) => {
  return md.render(content);
};

// 状态管理
const isDialogOpen = ref(false)
const isTyping = ref(false)
const userInput = ref('')
const messages = ref<Array<{ type: 'user' | 'assistant'; content: string }>>([])
const chatMessages = ref<HTMLElement | null>(null)
const inputArea = ref<HTMLTextAreaElement | null>(null)
const currentTab = ref('home')

// 精灵眨眼动画
const isBlinking = ref(false)
let blinkInterval: number | null = null

// 开始眨眼动画
const startBlinking = () => {
  // 随机间隔眨眼（2-6秒）
  const scheduleNextBlink = () => {
    const nextBlinkDelay = 2000 + Math.random() * 4000
    blinkInterval = window.setTimeout(() => {
      isBlinking.value = true
      // 眨眼持续150ms
      setTimeout(() => {
        isBlinking.value = false
        scheduleNextBlink()
      }, 150)
    }, nextBlinkDelay)
  }
  scheduleNextBlink()
}

// 停止眨眼动画
const stopBlinking = () => {
  if (blinkInterval) {
    clearTimeout(blinkInterval)
    blinkInterval = null
  }
  isBlinking.value = false
}

// 粒子动画相关
const particleCanvas = ref<HTMLCanvasElement | null>(null)
let particleAnimationId: number | null = null
let animationTime = 0

// 科技感粒子类
class TechParticle {
  x: number
  y: number
  size: number
  opacity: number
  color: string
  angle: number
  orbitRadius: number
  orbitSpeed: number
  layer: number
  pulsePhase: number

  constructor(centerX: number, centerY: number, layer: number) {
    this.layer = layer
    this.angle = Math.random() * Math.PI * 2
    this.orbitRadius = 12 + layer * 8 + Math.random() * 6
    this.orbitSpeed = (0.01 + Math.random() * 0.02) * (layer % 2 === 0 ? 1 : -1)
    this.x = centerX + Math.cos(this.angle) * this.orbitRadius
    this.y = centerY + Math.sin(this.angle) * this.orbitRadius
    this.size = 1.5 + Math.random() * 2
    this.opacity = 0.6 + Math.random() * 0.4
    this.color = this.getTechColor()
    this.pulsePhase = Math.random() * Math.PI * 2
  }

  getTechColor(): string {
    const colors = [
      '#A8E6CF', // 薄荷绿
      '#7FD8BE', // 青绿
      '#5AC8A8', // 翠绿
      '#FFB6C1', // 粉色
      '#FF9AAE', // 浅粉
      '#FFD1DC', // 淡粉
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  update(centerX: number, centerY: number, time: number) {
    // 轨道运动
    this.angle += this.orbitSpeed
    
    // 添加波浪效果
    const wave = Math.sin(time * 0.002 + this.angle * 3) * 2
    this.x = centerX + Math.cos(this.angle) * (this.orbitRadius + wave)
    this.y = centerY + Math.sin(this.angle) * (this.orbitRadius + wave)

    // 脉动效果
    this.opacity = 0.4 + Math.sin(time * 0.003 + this.pulsePhase) * 0.4
  }

  draw(ctx: CanvasRenderingContext2D) {
    // 绘制发光效果
    ctx.shadowBlur = 8
    ctx.shadowColor = this.color
    
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.globalAlpha = this.opacity
    ctx.fill()
    
    // 重置阴影
    ctx.shadowBlur = 0
    ctx.globalAlpha = 1
  }
}

// 数据流粒子
class DataParticle {
  x: number
  y: number
  length: number
  speed: number
  opacity: number
  angle: number
  distance: number
  maxDistance: number

  constructor(centerX: number, centerY: number) {
    this.angle = Math.random() * Math.PI * 2
    this.distance = 15
    this.maxDistance = 28 + Math.random() * 8
    this.speed = 0.3 + Math.random() * 0.4
    this.x = centerX + Math.cos(this.angle) * this.distance
    this.y = centerY + Math.sin(this.angle) * this.distance
    this.length = 3 + Math.random() * 5
    this.opacity = 0.8
  }

  update(centerX: number, centerY: number) {
    this.distance += this.speed
    this.x = centerX + Math.cos(this.angle) * this.distance
    this.y = centerY + Math.sin(this.angle) * this.distance
    this.opacity = 1 - (this.distance - 15) / (this.maxDistance - 15)
    
    if (this.distance >= this.maxDistance) {
      this.distance = 15
      this.angle = Math.random() * Math.PI * 2
      this.opacity = 0.8
    }
  }

  draw(ctx: CanvasRenderingContext2D, centerX: number, centerY: number) {
    const startX = centerX + Math.cos(this.angle) * (this.distance - this.length)
    const startY = centerY + Math.sin(this.angle) * (this.distance - this.length)

    ctx.strokeStyle = '#A8E6CF'
    ctx.lineWidth = 1.5
    ctx.globalAlpha = this.opacity

    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(this.x, this.y)
    ctx.stroke()

    ctx.globalAlpha = 1
  }
}

// 粒子系统
let techParticles: TechParticle[] = []
let dataParticles: DataParticle[] = []

// 初始化粒子
const initParticles = () => {
  techParticles = []
  dataParticles = []
  const centerX = 30
  const centerY = 30
  
  // 创建三层轨道粒子
  for (let layer = 0; layer < 3; layer++) {
    const count = 8 + layer * 4
    for (let i = 0; i < count; i++) {
      techParticles.push(new TechParticle(centerX, centerY, layer))
    }
  }
  
  // 创建数据流粒子
  for (let i = 0; i < 12; i++) {
    dataParticles.push(new DataParticle(centerX, centerY))
  }
}

// 绘制精灵魔法光环
const drawAICore = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, time: number) => {
  const pulse = Math.sin(time * 0.003) * 0.1 + 1

  // 外环发光 - 柔和的绿色
  ctx.shadowBlur = 15 * pulse
  ctx.shadowColor = '#A8E6CF'

  // 外环
  ctx.beginPath()
  ctx.arc(centerX, centerY, 16 * pulse, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(168, 230, 207, 0.4)'
  ctx.lineWidth = 2
  ctx.globalAlpha = 0.5
  ctx.stroke()

  // 中环 - 粉色
  ctx.shadowBlur = 10
  ctx.shadowColor = '#FFB6C1'
  ctx.beginPath()
  ctx.arc(centerX, centerY, 12, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(255, 182, 193, 0.5)'
  ctx.lineWidth = 1.5
  ctx.globalAlpha = 0.6
  ctx.stroke()

  // 内核心 - 温暖的光点
  ctx.shadowBlur = 8 * pulse
  ctx.shadowColor = '#FFD1DC'
  ctx.beginPath()
  ctx.arc(centerX, centerY, 4 * pulse, 0, Math.PI * 2)
  const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 4 * pulse)
  coreGradient.addColorStop(0, '#FFFFFF')
  coreGradient.addColorStop(0.5, '#FFD1DC')
  coreGradient.addColorStop(1, '#FFB6C1')
  ctx.fillStyle = coreGradient
  ctx.globalAlpha = 0.8
  ctx.fill()

  ctx.shadowBlur = 0
}

// 绘制轨道环
const drawOrbitRings = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, time: number) => {
  ctx.strokeStyle = 'rgba(168, 230, 207, 0.2)'
  ctx.lineWidth = 1

  // 旋转的轨道环
  for (let i = 0; i < 3; i++) {
    const radius = 20 + i * 10
    const rotation = time * 0.0005 * (i % 2 === 0 ? 1 : -1) + i * Math.PI / 3

    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate(rotation)

    ctx.beginPath()
    ctx.arc(0, 0, radius, 0, Math.PI * 2)
    ctx.stroke()

    // 轨道上的装饰点
    const dotAngle = time * 0.002 + i
    const dotX = Math.cos(dotAngle) * radius
    const dotY = Math.sin(dotAngle) * radius

    ctx.shadowBlur = 4
    ctx.shadowColor = i % 2 === 0 ? '#A8E6CF' : '#FFB6C1'
    ctx.beginPath()
    ctx.arc(dotX, dotY, 2, 0, Math.PI * 2)
    ctx.fillStyle = i % 2 === 0 ? '#A8E6CF' : '#FFB6C1'
    ctx.fill()
    ctx.shadowBlur = 0

    ctx.restore()
  }
}

// 绘制粒子连线 - 魔法网络
const drawTechConnections = (ctx: CanvasRenderingContext2D, particles: TechParticle[]) => {
  ctx.strokeStyle = 'rgba(168, 230, 207, 0.25)'
  ctx.lineWidth = 0.8

  for (let i = 0; i < particles.length; i++) {
    let connectionCount = 0
    for (let j = i + 1; j < particles.length && connectionCount < 3; j++) {
      const dx = particles[i].x - particles[j].x
      const dy = particles[i].y - particles[j].y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 20) {
        ctx.globalAlpha = (1 - distance / 20) * 0.4
        ctx.beginPath()
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(particles[j].x, particles[j].y)
        ctx.stroke()
        connectionCount++
      }
    }
  }
  ctx.globalAlpha = 1
}

// 绘制粒子动画
const animateParticles = () => {
  const canvas = particleCanvas.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  animationTime += 16

  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // 绘制背景渐变 - 柔和的魔法光晕
  const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 35)
  bgGradient.addColorStop(0, 'rgba(232, 248, 245, 0.6)')
  bgGradient.addColorStop(0.5, 'rgba(213, 245, 227, 0.3)')
  bgGradient.addColorStop(1, 'rgba(168, 230, 207, 0)')
  ctx.fillStyle = bgGradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // 绘制轨道环
  drawOrbitRings(ctx, centerX, centerY, animationTime)

  // 更新和绘制数据流粒子
  dataParticles.forEach(particle => {
    particle.update(centerX, centerY)
    particle.draw(ctx, centerX, centerY)
  })

  // 绘制粒子连线
  drawTechConnections(ctx, techParticles)

  // 更新和绘制科技粒子
  techParticles.forEach(particle => {
    particle.update(centerX, centerY, animationTime)
    particle.draw(ctx)
  })

  // 绘制AI核心
  drawAICore(ctx, centerX, centerY, animationTime)

  particleAnimationId = requestAnimationFrame(animateParticles)
}

// 启动粒子动画
const startParticleAnimation = () => {
  animationTime = 0
  initParticles()
  animateParticles()
}

// 停止粒子动画
const stopParticleAnimation = () => {
  if (particleAnimationId) {
    cancelAnimationFrame(particleAnimationId)
    particleAnimationId = null
  }
}

// 移动端检测
const isMobile = computed(() => {
  return window.innerWidth <= 768;
});

// 切换导航标签
const switchTab = (tab: string) => {
  console.log('切换到标签:', tab); // 添加调试日志
  currentTab.value = tab;
  
  // 如果点击的是助手标签，则切换对话框状态
  if (tab === 'assistant') {
    // 直接设置对话框状态为打开，而不是切换
    isDialogOpen.value = true;
    nextTick(() => {
      updateDialogPosition();
      scrollToBottom();
      inputArea.value?.focus();
    });
  } else if (isDialogOpen.value) {
    // 如果对话框已打开且点击了其他标签，则关闭对话框
    isDialogOpen.value = false;
  }
}

// 预设问题列表
const suggestedQuestions = ref([
  '帮我写一个Vue组件',
  '解释一下什么是闭包',
  '推荐一些科幻电影',
  '给我讲个关于程序员的笑话'
])

// 拖动相关
const assistantIcon = ref<HTMLElement | null>(null)
let isDragging = false
let dragStartTimer: number | null = null;
const dragOffset = reactive({ x: 0, y: 0 })
const position = reactive({ x: window.innerWidth - 80, y: window.innerHeight - 120 })
const dialogPosition = reactive({ x: 0, y: 0 })

const updateDialogPosition = () => {
  // 移动端不需要计算位置，对话框会全屏显示
  if (isMobile.value) return;
  
  const iconRect = assistantIcon.value?.getBoundingClientRect();
  if (!iconRect) return;

  const space = 16;
  const dialogWidth = 400;
  const dialogHeight = 600;

  let x = iconRect.left - dialogWidth - space;
  if (x < space) {
    x = iconRect.right + space;
  }

  let y = iconRect.top + iconRect.height / 2 - dialogHeight / 2;
  y = Math.max(space, Math.min(y, window.innerHeight - dialogHeight - space));

  dialogPosition.x = x;
  dialogPosition.y = y;
};

// 拖动功能
const startDrag = (e: MouseEvent) => {
  // 记录初始点击位置和时间
  const initialX = e.clientX;
  const initialY = e.clientY;
  const startTime = Date.now();
  
  isDragging = false;
  if (dragStartTimer) clearTimeout(dragStartTimer);
  
  // 添加一次性mouseup事件监听器
  const mouseUpHandler = (upEvent: MouseEvent) => {
    document.removeEventListener('mouseup', mouseUpHandler);
    document.removeEventListener('mousemove', mouseMoveHandler);
    
    // 如果拖拽已经开始，则执行stopDrag
    if (isDragging) {
      stopDrag();
      return;
    }
    
    // 清除拖拽定时器
    if (dragStartTimer) {
      clearTimeout(dragStartTimer);
      dragStartTimer = null;
    }
    
    // 计算移动距离和时间差
    const moveDistance = Math.sqrt(
      Math.pow(upEvent.clientX - initialX, 2) + 
      Math.pow(upEvent.clientY - initialY, 2)
    );
    const timeDiff = Date.now() - startTime;
    
    // 如果移动距离小于5px且时间小于200ms，则视为点击
    if (moveDistance < 5 && timeDiff < 200) {
      toggleDialog();
    }
  };
  
  // 鼠标移动处理函数
  const mouseMoveHandler = (moveEvent: MouseEvent) => {
    // 如果已经进入拖拽状态，则调用drag函数
    if (isDragging) {
      drag(moveEvent);
    } else {
      // 计算移动距离
      const moveDistance = Math.sqrt(
        Math.pow(moveEvent.clientX - initialX, 2) + 
        Math.pow(moveEvent.clientY - initialY, 2)
      );
      
      // 如果移动距离超过阈值，立即启动拖拽模式，不等待定时器
      if (moveDistance > 10) {
        if (dragStartTimer) {
          clearTimeout(dragStartTimer);
          dragStartTimer = null;
        }
        
        isDragging = true;
        if (assistantIcon.value) {
          dragOffset.x = moveEvent.clientX - position.x;
          dragOffset.y = moveEvent.clientY - position.y;
          drag(moveEvent);
        }
      }
    }
  };
  
  // 设置拖拽检测定时器
  dragStartTimer = window.setTimeout(() => {
    if (!isDragging) { // 确保还没有因为移动距离触发拖拽
      isDragging = true;
      if (assistantIcon.value) {
        dragOffset.x = e.clientX - position.x;
        dragOffset.y = e.clientY - position.y;
      }
    }
  }, 150);
  
  document.addEventListener('mouseup', mouseUpHandler);
  document.addEventListener('mousemove', mouseMoveHandler);
  
  e.preventDefault();
}

const drag = (e: MouseEvent) => {
  if (isDragging) {
    position.x = e.clientX - dragOffset.x;
    position.y = e.clientY - dragOffset.y;
    
    // 限制图标在可视区域内
    position.x = Math.max(10, Math.min(window.innerWidth - 70, position.x));
    position.y = Math.max(10, Math.min(window.innerHeight - 70, position.y));
  }
}

const stopDrag = () => {
  if (dragStartTimer) {
    clearTimeout(dragStartTimer);
    dragStartTimer = null;
  }
  
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('mouseup', stopDrag);
  
  // 使用短暂延迟确保isDragging状态在click事件之前被重置
  setTimeout(() => {
    isDragging = false;
  }, 10);
}

// 对话框切换
const toggleDialog = () => {
  if (isDragging) return;
  isDialogOpen.value = !isDialogOpen.value;
  
  // 在移动端，如果打开对话框，则将当前标签设置为assistant
  if (isMobile.value && isDialogOpen.value) {
    currentTab.value = 'assistant';
  }
}

watch(isDialogOpen, (isOpen) => {
  if (isOpen) {
    nextTick(() => {
      updateDialogPosition();
      scrollToBottom();
      inputArea.value?.focus();
    });
  }
});

// 滚动到底部
const scrollToBottom = () => {
  if (chatMessages.value) {
    chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
  }
}

const autoResizeTextarea = () => {
  if (inputArea.value) {
    inputArea.value.style.height = 'auto';
    inputArea.value.style.height = `${inputArea.value.scrollHeight}px`;
  }
};

// 发送消息
const sendMessage = async () => {
  const userMessage = userInput.value.trim();
  if (!userMessage || isTyping.value) return;

  messages.value.push({ type: 'user', content: userMessage });
  userInput.value = '';
  autoResizeTextarea();
  isTyping.value = true;

  nextTick(scrollToBottom);

  try {
    const response = await fetchChatResponse(userMessage);
    await streamResponse(response);
  } catch (error) {
    console.error('API调用失败:', error);
    messages.value.push({ type: 'assistant', content: '抱歉，我遇到了一些问题，请稍后再试。' });
  } finally {
    isTyping.value = false;
    nextTick(scrollToBottom);
  }
}

// 发送预设问题
const sendSuggestedQuestion = (question: string, event?: Event) => {
  // 阻止事件冒泡，防止触发文档级别的点击事件
  if (event) {
    event.stopPropagation();
  }
  
  userInput.value = question;
  sendMessage();
  
  // 使用nextTick确保DOM更新后再滚动到底部
  nextTick(() => {
    scrollToBottom();
  });
}

// API调用
const fetchChatResponse = async (message: string): Promise<string> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 模拟一个更真实的回复
  if (message.includes("Vue组件")) {
    return `好的，这是一个简单的Vue 3计数器组件示例：

\`\`\`vue
<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const count = ref(0);
const increment = () => {
  count.value++;
};
<\/script>
\`\`\`

你可以将此代码复制到你的项目中。`;
  }
  return `关于“${message}”，我还在学习中。不过，我可以帮你搜索相关信息。`;
}

// 模拟stream输出
const streamResponse = async (response: string) => {
  const assistantMessage = { type: 'assistant' as const, content: '' };
  messages.value.push(assistantMessage);
  
  const tokens = response.split('');
  for (const token of tokens) {
    assistantMessage.content += token;
    await new Promise(resolve => setTimeout(resolve, 15));
    nextTick(scrollToBottom);
  }
}

// 窗口大小改变时调整位置
const handleResize = () => {
  position.x = Math.min(position.x, window.innerWidth - 70);
  position.y = Math.min(position.y, window.innerHeight - 70);
  if (isDialogOpen.value) {
    updateDialogPosition();
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize);

  // 添加全局点击事件处理器，用于检测点击对话框外部时关闭对话框
  document.addEventListener('click', (e) => {
    // 如果对话框已打开
    if (isDialogOpen.value) {
      const dialog = document.querySelector('.v-assistant-dialog');
      const icon = assistantIcon.value;
      const navBar = document.querySelector('.mobile-nav-bar');

      // 检查点击是否在对话框外部和图标外部
      const isOutsideDialog = dialog && !dialog.contains(e.target as Node);
      const isOutsideIcon = icon && !icon.contains(e.target as Node);
      const isOutsideNavBar = navBar && !navBar.contains(e.target as Node);

      // 只有当点击在对话框、图标和导航栏之外时才关闭对话框
      if (isOutsideDialog && isOutsideIcon && (isMobile.value ? isOutsideNavBar : true)) {
        isDialogOpen.value = false;
      }
    }
  });

  // 初始检测设备类型
  handleResize();

  // 启动粒子动画
  nextTick(() => {
    startParticleAnimation()
  })

  // 启动眨眼动画
  startBlinking()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('mouseup', stopDrag);

  // 停止粒子动画
  stopParticleAnimation()

  // 停止眨眼动画
  stopBlinking()
})
</script>

<style>
/* 引入外部字体和 github-markdown-css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@import 'github-markdown-css/github-markdown.css';

:root {
  --assistant-primary-color: #5A67D8;
  --assistant-secondary-color: #818CF8;
  --assistant-bg-color: #f7fafc;
  --assistant-text-primary: #1a202c;
  --assistant-text-secondary: #4a5568;
  --assistant-border-color: #e2e8f0;
}

.v-assistant-container {
  position: fixed;
  z-index: 9999;
  font-family: 'Inter', sans-serif;
}

.v-assistant-icon {
  position: fixed;
  width: 60px;
  height: 60px;
  cursor: pointer;
  user-select: none;
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  z-index: 10000;
  border-radius: 50%;
  background: linear-gradient(135deg, #E8F8F5 0%, #D5F5E3 50%, #A8E6CF 100%);
  border: 2px solid rgba(90, 200, 168, 0.4);
  box-shadow:
    0 4px 15px rgba(90, 200, 168, 0.3),
    0 8px 25px rgba(90, 200, 168, 0.2),
    inset 0 2px 4px rgba(255, 255, 255, 0.5);
}

.v-assistant-icon:hover {
  transform: scale(1.1);
  border-color: rgba(90, 200, 168, 0.7);
  box-shadow:
    0 6px 20px rgba(90, 200, 168, 0.4),
    0 12px 35px rgba(90, 200, 168, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.6);
}

.v-assistant-icon:active {
  transform: scale(0.95);
  transition-duration: 0.1s;
}

.v-icon-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* 粒子动画Canvas */
.particle-canvas {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

/* 虚拟精灵形象容器 */
.sprite-container {
  position: absolute;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  transition: transform 0.3s ease-in-out;
  pointer-events: none;
}

.sprite-container.is-open {
  transform: scale(0.9);
}

.sprite-svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

/* 精灵动画 */
.sprite-character {
  animation: sprite-float 3s ease-in-out infinite;
  transform-origin: center;
}

@keyframes sprite-float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}

/* 眼睛样式 */
.sprite-eye {
  transition: opacity 0.05s ease;
}

.sprite-eye-closed {
  opacity: 0;
  transition: opacity 0.05s ease;
}

/* 眨眼状态 */
.sprite-container.is-blinking .sprite-eye {
  opacity: 0;
}

.sprite-container.is-blinking .sprite-eye-closed {
  opacity: 1;
}

/* 耳朵动画 */
.sprite-character ellipse[fill="url(#sprite-ear-gradient)"] {
  animation: ear-twitch 4s ease-in-out infinite;
  transform-origin: center;
}

.sprite-character ellipse[fill="url(#sprite-ear-gradient)"]:nth-child(3) {
  animation-delay: 0.5s;
}

@keyframes ear-twitch {
  0%, 90%, 100% {
    transform: rotate(-20deg);
  }
  95% {
    transform: rotate(-25deg);
  }
}

.v-icon-svg {
  width: 100%;
  height: 100%;
}



.v-assistant-dialog {
  position: fixed;
  width: 400px;
  height: 600px;
  background-color: var(--assistant-bg-color);
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  z-index: 9999;
  overflow: hidden;
  border: 1px solid var(--assistant-border-color);
}

/* 移动端对话框样式 */
.v-assistant-dialog.mobile-dialog {
  width: 100%;
  height: calc(100% - 60px); /* 减去底部导航栏的高度 */
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 60px !important;
  border-radius: 0;
  border: none;
}

.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* 移动端滑入动画 */
.dialog-slide-enter-active,
.dialog-slide-leave-active {
  transition: transform 0.3s ease;
}

.dialog-slide-enter-from,
.dialog-slide-leave-to {
  transform: translateY(100%);
}

.dialog-header {
  padding: 12px 16px;
  border-bottom: 1px solid var(--assistant-border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  flex-shrink: 0;
}

.header-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: var(--assistant-text-primary);
}

.header-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
  color: var(--assistant-primary-color);
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.close-btn {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.close-btn:hover {
  background-color: #f3f4f6;
  color: var(--assistant-text-primary);
}

.close-btn svg {
  width: 100%;
  height: 100%;
  stroke: currentColor;
  stroke-width: 2;
}

.dialog-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.welcome-view {
  text-align: center;
  padding: 80px 20px;
  color: var(--assistant-text-secondary);
}

.welcome-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
  color: var(--assistant-primary-color);
}

.welcome-icon svg {
  width: 100%;
  height: 100%;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
}

.welcome-title {
  font-size: 22px;
  font-weight: 600;
  color: var(--assistant-text-primary);
  margin-bottom: 8px;
}

.welcome-subtitle {
  font-size: 16px;
}

.message {
  margin-bottom: 20px;
  display: flex;
  max-width: 90%;
}

.message.user {
  margin-left: auto;
  justify-content: flex-end;
}

.message.assistant {
  margin-right: auto;
}

.message-content {
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 15px;
  line-height: 1.6;
  word-wrap: break-word;
}

.message.user .message-content {
  background: var(--assistant-primary-color);
  color: white;
  border-bottom-right-radius: 4px;
}

.message.assistant .message-content {
  background: white;
  color: var(--assistant-text-primary);
  border: 1px solid var(--assistant-border-color);
  border-bottom-left-radius: 4px;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 12px 16px;
  background: white;
  border: 1px solid var(--assistant-border-color);
  border-radius: 18px;
  border-bottom-left-radius: 4px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #a0aec0;
  border-radius: 50%;
  animation: typing-bounce 1.2s infinite ease-in-out;
}

.typing-indicator span:nth-child(2) {
  animation-delay: -0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: -0.4s;
}

@keyframes typing-bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1.0);
  }
}

.input-area {
  padding: 12px;
  border-top: 1px solid var(--assistant-border-color);
  background: white;
  display: flex;
  align-items: flex-end;
  gap: 10px;
  flex-shrink: 0;
}

.input-area textarea {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid var(--assistant-border-color);
  border-radius: 12px;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  resize: none;
  max-height: 120px;
  line-height: 1.5;
  background-color: #fdfdff;
}

.input-area textarea:focus {
  border-color: var(--assistant-primary-color);
  box-shadow: 0 0 0 3px rgba(90, 103, 216, 0.2);
}

.input-area textarea:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

.send-btn {
  width: 42px;
  height: 42px;
  background: var(--assistant-primary-color);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease, transform 0.2s ease;
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) {
  background: var(--assistant-secondary-color);
  transform: scale(1.05);
}

.send-btn:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}

.send-btn svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

.suggested-questions-container {
  padding: 0 20px 20px;
  border-top: 1px solid var(--assistant-border-color);
}

.suggested-questions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

.question-chip {
  padding: 8px 14px;
  background: white;
  border: 1px solid var(--assistant-border-color);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  color: var(--assistant-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.question-chip:hover {
  background: var(--assistant-primary-color);
  color: white;
  border-color: var(--assistant-primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(90, 103, 216, 0.2);
}

/* 滚动条样式 */
.chat-messages::-webkit-scrollbar {
  width: 8px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Markdown 样式覆盖 */
.markdown-body {
  font-size: 15px;
  line-height: 1.7;
  background-color: transparent;
}

.markdown-body pre {
  background-color: #1e1e1e !important;
  color: #d4d4d4;
  padding: 16px;
  border-radius: 8px;
  font-size: 14px;
}

.markdown-body code:not([class]) {
  background-color: rgba(90, 103, 216, 0.1);
  color: var(--assistant-primary-color);
  padding: 2px 5px;
  border-radius: 4px;
  font-size: 0.9em;
}

/* 移动端底部导航栏样式 */
.mobile-nav-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 9998;
  border-top: 1px solid var(--assistant-border-color);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 20%;
  height: 100%;
  background: none;
  border: none;
  color: var(--assistant-text-secondary);
  font-size: 12px;
  font-weight: 500;
  padding: 8px 0;
  transition: all 0.2s ease;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent; /* 移除移动端点击高亮 */
  user-select: none; /* 防止文本被选中 */
  position: relative; /* 为伪元素定位 */
  overflow: hidden; /* 限制涟漪效果在按钮内 */
}

.nav-item::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.nav-item:active::after {
  transform: translate(-50%, -50%) scale(1.5);
  opacity: 1;
  transition: transform 0.3s ease, opacity 0s;
}

.nav-item svg {
  width: 22px;
  height: 22px;
  margin-bottom: 4px;
  stroke-width: 1.5;
}

.nav-item span {
  margin-top: 2px;
}

.nav-item.active {
  color: var(--assistant-primary-color);
}

.assistant-nav-button {
  position: relative;
}

.assistant-nav-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--assistant-primary-color), var(--assistant-secondary-color));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2px;
  color: white;
  box-shadow: 0 4px 8px rgba(90, 103, 216, 0.3);
  transition: transform 0.2s ease;
}

.assistant-nav-icon svg {
  width: 24px;
  height: 24px;
  margin-bottom: 0;
}

.assistant-nav-button.active .assistant-nav-icon {
  transform: scale(1.1);
}

.assistant-nav-button:active .assistant-nav-icon {
  transform: scale(0.95);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .v-assistant-dialog {
    width: 100%;
    height: calc(100% - 60px);
    border-radius: 0;
  }
  
  .chat-messages {
    padding: 16px;
  }
  
  .welcome-view {
    padding: 60px 16px;
  }
  
  .input-area {
    padding: 10px;
  }
  
  .suggested-questions {
    gap: 8px;
  }
  
  .question-chip {
    padding: 6px 12px;
    font-size: 12px;
  }
}
</style>