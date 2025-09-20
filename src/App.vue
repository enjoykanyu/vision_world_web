<template>
  <div id="app" class="min-h-screen bg-gray-100">
    <router-view v-slot="{ Component }">
      <transition name="bilibili" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    
    <!-- 全局小V助手组件 -->
    <VAssistant />
  </div>
</template>

<script setup lang="ts">
import VAssistant from './components/VAssistant.vue'
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