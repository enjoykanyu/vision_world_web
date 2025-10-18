<template>
  <teleport to="body">
    <transition name="login-success">
      <div v-if="visible" 
           class="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
        <!-- 粒子背景 -->
        <div class="absolute inset-0 overflow-hidden">
          <div v-for="i in 50" :key="i" 
               class="particle absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
               :style="getParticleStyle(i)">
          </div>
        </div>
        
        <!-- 主要动画内容 -->
        <div class="login-success-card relative bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 text-white px-12 py-8 rounded-2xl shadow-2xl transform">
          <!-- 发光边框 -->
          <div class="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 rounded-2xl blur-sm opacity-75 animate-pulse"></div>
          
          <!-- 内容区域 -->
          <div class="relative z-10 text-center">
            <!-- 成功图标 -->
            <div class="mb-6 relative">
              <div class="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                <svg class="w-12 h-12 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <!-- 环形进度条 -->
              <svg class="absolute inset-0 w-20 h-20 mx-auto -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="36" stroke="rgba(255,255,255,0.3)" stroke-width="4" fill="none"/>
                <circle cx="40" cy="40" r="36" stroke="white" stroke-width="4" fill="none" 
                        stroke-dasharray="226" stroke-dashoffset="0" 
                        class="animate-draw-circle"/>
              </svg>
            </div>
            
            <!-- 登录成功文字 -->
            <h2 class="text-3xl font-bold mb-2 animate-fade-in-up">登录成功！</h2>
            <p class="text-lg opacity-90 mb-4 animate-fade-in-up animation-delay-200">欢迎回到 Vision World</p>
            
            <!-- 连续登录天数 -->
            <div class="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/30 animate-fade-in-up animation-delay-400">
              <div class="flex items-center justify-center space-x-3">
                <svg class="w-6 h-6 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span class="text-lg font-semibold">连续登录</span>
                <span class="text-2xl font-bold text-yellow-300 animate-pulse">{{ consecutiveDays }}</span>
                <span class="text-lg font-semibold">天</span>
              </div>
              <p class="text-sm opacity-80 mt-2">坚持就是胜利！</p>
            </div>
          </div>
          
          <!-- 装饰性光效 -->
          <div class="absolute top-4 right-4 w-3 h-3 bg-white rounded-full animate-ping"></div>
          <div class="absolute bottom-4 left-4 w-2 h-2 bg-yellow-300 rounded-full animate-ping animation-delay-500"></div>
          <div class="absolute top-1/2 left-4 w-1 h-1 bg-pink-300 rounded-full animate-ping animation-delay-1000"></div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

interface Props {
  visible: boolean
  consecutiveDays?: number
}

const props = withDefaults(defineProps<Props>(), {
  consecutiveDays: 1
})

const emit = defineEmits<{
  close: []
}>()

// 粒子动画相关
const particles = ref<Array<{x: number, y: number, delay: number, duration: number}>>([])

const getParticleStyle = (index: number) => {
  const particle = particles.value[index - 1]
  if (!particle) return {}
  
  return {
    left: `${particle.x}%`,
    top: `${particle.y}%`,
    animationDelay: `${particle.delay}s`,
    animationDuration: `${particle.duration}s`,
    animation: `particleFloat ${particle.duration}s ease-in-out ${particle.delay}s infinite`
  }
}

const initParticles = () => {
  particles.value = Array.from({ length: 50 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 3
  }))
}

// 自动关闭
let closeTimer: NodeJS.Timeout | null = null

onMounted(() => {
  initParticles()
  if (props.visible) {
    closeTimer = setTimeout(() => {
      emit('close')
    }, 4000) // 4秒后自动关闭
  }
})

// 监听visible，每次显示都开启自动关闭定时器
watch(() => props.visible, (val) => {
  if (val) {
    if (closeTimer) clearTimeout(closeTimer)
    closeTimer = setTimeout(() => {
      emit('close')
    }, 4000)
  }
})

onUnmounted(() => {
  if (closeTimer) {
    clearTimeout(closeTimer)
  }
})
</script>

<style scoped>
/* 进入/离开动画 */
.login-success-enter-active {
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.login-success-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53);
}

.login-success-enter-from {
  opacity: 0;
  transform: scale(0.3) translateY(100px);
}

.login-success-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(-50px);
}

/* 主卡片动画 */
.login-success-card {
  animation: cardFloat 4s ease-in-out;
}

@keyframes cardFloat {
  0% {
    transform: scale(0.3) translateY(100px) rotate(-10deg);
    opacity: 0;
  }
  15% {
    transform: scale(1.1) translateY(-20px) rotate(2deg);
    opacity: 1;
  }
  25% {
    transform: scale(1) translateY(0) rotate(0deg);
  }
  85% {
    transform: scale(1) translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: scale(0.9) translateY(-30px) rotate(5deg);
    opacity: 0;
  }
}

/* 环形进度条动画 */
@keyframes draw-circle {
  0% {
    stroke-dashoffset: 226;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

.animate-draw-circle {
  animation: draw-circle 1.5s ease-out 0.5s forwards;
}

/* 文字渐入动画 */
@keyframes fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
  opacity: 0;
}

/* 动画延迟类 */
.animation-delay-200 {
  animation-delay: 0.2s;
}

.animation-delay-400 {
  animation-delay: 0.4s;
}

.animation-delay-500 {
  animation-delay: 0.5s;
}

.animation-delay-1000 {
  animation-delay: 1s;
}

/* 粒子动画 */
@keyframes particleFloat {
  0% {
    transform: translateY(0) scale(0);
    opacity: 0;
  }
  10% {
    transform: translateY(-20px) scale(1);
    opacity: 1;
  }
  90% {
    transform: translateY(-100px) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-120px) scale(0);
    opacity: 0;
  }
}

.particle {
  animation: particleFloat 3s ease-out infinite;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .login-success-card {
    margin: 0 20px;
    padding: 2rem 1.5rem;
  }
}
</style>