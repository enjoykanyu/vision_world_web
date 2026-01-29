<template>
  <!-- 登录弹窗 - 简洁现代风格 -->
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- 背景遮罩 -->
    <div 
      class="absolute inset-0 bg-black/50 backdrop-blur-sm" 
      @click="close"
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
          @click="close" 
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
        
        <!-- 错误提示 -->
        <div v-if="loginError" class="mt-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm px-4 py-2 rounded-lg">
          {{ loginError }}
        </div>
        
        <!-- 手机号登录表单 -->
        <form v-if="loginType === 'phone'" @submit.prevent="handlePhoneLogin" class="mt-6 space-y-5">
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              手机号
            </label>
            <div class="relative">
              <input
                id="phone"
                v-model="loginForm.phone"
                type="tel"
                placeholder="请输入手机号"
                class="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 transition-all duration-200"
              />
            </div>
          </div>
          
          <div class="flex space-x-3">
            <div class="flex-1">
              <label for="verificationCode" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                验证码
              </label>
              <input
                id="verificationCode"
                v-model="loginForm.verificationCode"
                type="text"
                placeholder="请输入验证码"
                class="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 transition-all duration-200"
              />
            </div>
            <div class="w-36 flex items-end">
              <button
                type="button"
                @click="sendVerificationCode"
                :disabled="isSendingCode || countdown > 0"
                class="w-full px-3 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {{ isSendingCode ? '发送中...' : countdown > 0 ? `${countdown}s` : '获取验证码' }}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            class="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2.5 px-4 rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] font-medium"
          >
            登录
          </button>
        </form>
        
        <!-- 密码登录表单 -->
        <form v-else @submit.prevent="handlePasswordLogin" class="mt-6 space-y-5">
          <div>
            <label for="passwordPhone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              手机号
            </label>
            <input
              id="passwordPhone"
              v-model="loginForm.phone"
              type="tel"
              placeholder="请输入手机号"
              class="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 transition-all duration-200"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              密码
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="请输入密码"
                class="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 transition-all duration-200"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L20.41 19M16.75 19A5.973 5.973 0 0112 21c-3.314 0-6-2.686-6-6s2.686-6 6-6c1.657 0 3.159.672 4.243 1.757"/>
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember"
                type="checkbox"
                class="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-400 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
              />
              <label for="remember" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                记住我
              </label>
            </div>
            <a href="#" class="text-sm text-purple-600 dark:text-purple-400 hover:underline">
              忘记密码?
            </a>
          </div>
          
          <button
            type="submit"
            class="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2.5 px-4 rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] font-medium"
          >
            登录
          </button>
        </form>
        
        <!-- 其他登录方式 -->
        <div class="mt-6">
          <div class="relative flex items-center justify-center">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                其他登录方式
              </span>
            </div>
          </div>
          
          <div class="mt-4 grid grid-cols-3 gap-2">
            <button class="flex items-center justify-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <svg class="w-6 h-6 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.14h-3v4h3v12h5v-12h3.85l.42-4z"/>
              </svg>
            </button>
            <button class="flex items-center justify-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <svg class="w-6 h-6 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
              </svg>
            </button>
            <button class="flex items-center justify-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <svg class="w-6 h-6 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 0 1 1.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 0 0-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0 1 12 3.475zm-3.633.803a53.896 53.896 0 0 1 3.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 0 1 4.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 0 1-2.19-5.705zM12 20.547a8.482 8.482 0 0 1-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 0 1 1.823 6.475 8.4 8.4 0 0 1-3.331.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 0 1-3.655 5.715z" clip-rule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- 注册链接 -->
        <div class="mt-6 text-center text-sm">
          还没有账号? 
          <a href="#" class="text-purple-600 dark:text-purple-400 hover:underline font-medium">
            立即注册
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'

// Props
const props = defineProps<{
  visible: boolean
}>()

// Emits
const emit = defineEmits<{
  (e: 'close'): void
}>()

// Stores
const userStore = useUserStore()
const router = useRouter()

// 登录相关状态
const loginType = ref('phone')
const loginForm = ref({
  phone: '',
  verificationCode: '',
  password: ''
})
const loginError = ref('')
const isSendingCode = ref(false)
const countdown = ref(0)
const showPassword = ref(false)

// 手机号验证函数
const isValidPhone = (phone: string) => {
  return /^1[3-9]\d{9}$/.test(phone)
}

// 关闭登录弹窗
const close = () => {
  resetForm()
  emit('close')
}

// 重置表单
const resetForm = () => {
  loginError.value = ''
  showPassword.value = false
  if (countdown.value > 0) {
    clearInterval(window.loginCountdownInterval)
    countdown.value = 0
  }
}

// 发送验证码
const sendVerificationCode = async () => {
  if (!loginForm.value.phone) {
    loginError.value = '请输入手机号'
    return
  }
  
  if (!isValidPhone(loginForm.value.phone)) {
    loginError.value = '请输入有效的手机号码'
    return
  }
  
  isSendingCode.value = true
  
  try {
    // 调用真实的短信API
    const result = await userStore.sendVerificationCode(loginForm.value.phone)
    
    if (result.success) {
      // 开始倒计时
      countdown.value = result.expireSeconds || 60
      
      // 使用window对象存储定时器，防止组件卸载时内存泄漏
      if (window.loginCountdownInterval) {
        clearInterval(window.loginCountdownInterval)
      }
      
      window.loginCountdownInterval = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
          clearInterval(window.loginCountdownInterval)
        }
      }, 1000)
      
      loginError.value = ''
    } else {
      loginError.value = result.error || '发送验证码失败，请稍后重试'
    }
  } catch (error) {
    loginError.value = '网络错误，请检查网络连接'
  } finally {
    isSendingCode.value = false
  }
}

// 手机号登录
const handlePhoneLogin = async () => {
  if (!loginForm.value.phone) {
    loginError.value = '请输入手机号'
    return
  }
  
  if (!isValidPhone(loginForm.value.phone)) {
    loginError.value = '请输入有效的手机号码'
    return
  }
  
  if (!loginForm.value.verificationCode) {
    loginError.value = '请输入验证码'
    return
  }
  
  if (loginForm.value.verificationCode.length !== 6) {
    loginError.value = '请输入6位验证码'
    return
  }
  
  try {
    const result = await userStore.login({
      phone: loginForm.value.phone,
      verificationCode: loginForm.value.verificationCode
    })
    
    if (result.success) {
      // 登录成功，关闭弹窗
      close()
      
      // 可以在这里添加登录成功的回调
      console.log('登录成功')
    } else {
      loginError.value = result.error || '登录失败，请检查验证码是否正确'
    }
  } catch (error) {
    loginError.value = '网络错误，请检查网络连接'
  }
}

// 密码登录
const handlePasswordLogin = async () => {
  if (!loginForm.value.phone) {
    loginError.value = '请输入手机号'
    return
  }
  
  if (!isValidPhone(loginForm.value.phone)) {
    loginError.value = '请输入有效的手机号码'
    return
  }
  
  if (!loginForm.value.password) {
    loginError.value = '请输入密码'
    return
  }
  
  try {
    // 这里应该调用真实的密码登录API
    console.log('密码登录:', loginForm.value)
    
    // 模拟登录成功
    userStore.isAuthenticated = true
    userStore.username = '测试用户'
    
    // 登录成功，关闭弹窗
    close()
    
    // 可以在这里添加登录成功的回调
    console.log('登录成功')
  } catch (error) {
    loginError.value = '网络错误，请检查网络连接'
  }
}
</script>

<style scoped>
/* 登录弹窗动画 */
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 应用动画 */
.fixed.inset-0 {
  animation: fadeIn 0.2s ease-out;
}

.fixed.inset-0 > div:last-child {
  animation: fadeInScale 0.3s ease-out;
}

/* 淡入动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>