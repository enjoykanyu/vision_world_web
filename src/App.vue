<template>
  <div id="app" class="min-h-screen bg-gray-100">
    <router-view v-slot="{ Component }">
      <transition name="bilibili" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    
    <!-- 全局小V助手组件 -->
    <VAssistant />

    <!-- 全局登录成功动画（公共组件，全局触发，在当前视口中心展示） -->
    <LoginSuccessAnimation 
      :visible="showLoginAnimation" 
      :consecutive-days="consecutiveLoginDays"
      @close="closeLoginAnimation" 
    />
    
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import VAssistant from './components/VAssistant.vue'
import LoginSuccessAnimation from './components/LoginSuccessAnimation.vue'
import { useLoginAnimation } from '@/composables/useLoginAnimation'
import { useUserStore } from '@/stores/userStore'

const { showLoginAnimation, consecutiveLoginDays, closeLoginAnimation, triggerLoginSuccessAnimation } = useLoginAnimation()
const userStore = useUserStore()

// 方案B：在全局监听登录成功事件，统一触发动画
const handleLoginSuccessEvent = (e: Event) => {
  // 可根据 e.detail 做个性化展示
  triggerLoginSuccessAnimation()
}

// 处理需要登录的事件
const handleLoginRequired = () => {
  // 显示登录提示
  console.log('需要登录才能访问该页面')
  
  // 如果当前在首页，直接触发登录弹窗事件
  if (window.location.pathname === '/') {
    window.dispatchEvent(new CustomEvent('show-login-modal'))
  } else {
    // 其他页面重定向到首页后显示登录弹窗
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('show-login-modal'))
    }, 500)
  }
}

onMounted(() => {
  window.addEventListener('login-success', handleLoginSuccessEvent as EventListener)
  window.addEventListener('show-login-required', handleLoginRequired)
  
  // 注释掉mock数据初始化 - 使用真实后端
  // if (import.meta.env.DEV) {
  //   import('@/mock/index').then(() => {
  //     console.log('Mock数据已初始化')
  //   }).catch((error) => {
  //     console.error('Mock数据初始化失败:', error)
  //     // 使用原生alert替代ElementPlus的消息提示
  //     alert('Mock数据初始化失败')
  //   })
  // }
})

onUnmounted(() => {
  window.removeEventListener('login-success', handleLoginSuccessEvent as EventListener)
  window.removeEventListener('show-login-required', handleLoginRequired)
})
// App组件逻辑
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>