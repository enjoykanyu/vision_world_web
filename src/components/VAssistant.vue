<template>
  <div class="v-assistant-container">
    <!-- 小V助手图标 -->
    <div
      ref="assistantIcon"
      class="v-assistant-icon"
      :style="{ left: position.x + 'px', top: position.y + 'px' }"
      @mousedown="startDrag"
      @click="toggleDialog"
    >
      <div class="v-icon">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="20" fill="#FB7299"/>
          <text x="20" y="28" text-anchor="middle" fill="white" font-size="20" font-weight="bold">V</text>
        </svg>
      </div>
    </div>

    <!-- 对话框 -->
    <div
      v-if="isDialogOpen"
      class="v-assistant-dialog"
      :style="{ left: dialogPosition.x + 'px', top: dialogPosition.y + 'px' }"
    >
      <div class="dialog-header">
        <h3>小V助手</h3>
        <button @click="toggleDialog" class="close-btn">×</button>
      </div>
      <div class="dialog-content">
        <div class="chat-messages" ref="chatMessages">
          <div
            v-for="(message, index) in messages"
            :key="index"
            :class="['message', message.type]"
          >
            <div class="message-content">{{ message.content }}</div>
          </div>
          <div v-if="isTyping" class="message assistant typing">
            <div class="typing-indicator animate-bilibili-float">
              <span class="hover:animate-bilibili-glow"></span>
              <span class="hover:animate-bilibili-glow"></span>
              <span class="hover:animate-bilibili-glow"></span>
            </div>
          </div>
        </div>
        
        <!-- 猜你想问区域 -->
        <div v-if="messages.length === 0" class="suggested-questions">
          <div class="suggested-title">猜你想问：</div>
          <div class="questions-grid">
            <div
              v-for="(question, index) in suggestedQuestions"
              :key="index"
              class="question-chip"
              @click="sendSuggestedQuestion(question)"
            >
              {{ question }}
            </div>
          </div>
        </div>
        
        <div class="input-area">
          <input
            v-model="userInput"
            @keyup.enter="sendMessage"
            placeholder="请输入您的问题..."
            :disabled="isTyping"
          />
          <button @click="sendMessage" :disabled="isTyping || !userInput.trim()">
            发送
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import axios from 'axios'

// 状态管理
const isDialogOpen = ref(false)
const isTyping = ref(false)
const userInput = ref('')
const messages = ref<Array<{ type: 'user' | 'assistant'; content: string }>>([])
const chatMessages = ref<HTMLElement | null>(null)

// 预设问题列表
const suggestedQuestions = ref([
  '你好，请介绍一下你自己',
  '今天天气怎么样？',
  '能帮我写一段代码吗？',
  '有什么推荐的书籍吗？',
  '如何学习前端开发？',
  '请讲个笑话'
])

// 拖动相关
const assistantIcon = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const dragOffset = reactive({ x: 0, y: 0 })
const position = reactive({ x: window.innerWidth - 80, y: window.innerHeight - 80 })
const dialogPosition = reactive({ x: window.innerWidth - 400, y: window.innerHeight - 500 })

// 拖动功能
const startDrag = (e: MouseEvent) => {
  if (assistantIcon.value) {
    isDragging.value = true
    dragOffset.x = e.clientX - position.x
    dragOffset.y = e.clientY - position.y
    document.addEventListener('mousemove', drag)
    document.addEventListener('mouseup', stopDrag)
    e.preventDefault()
  }
}

const drag = (e: MouseEvent) => {
  if (isDragging.value) {
    position.x = e.clientX - dragOffset.x
    position.y = e.clientY - dragOffset.y
    
    // 限制在窗口范围内
    position.x = Math.max(0, Math.min(window.innerWidth - 60, position.x))
    position.y = Math.max(0, Math.min(window.innerHeight - 60, position.y))
    
    // 更新对话框位置
    dialogPosition.x = position.x - 320
    dialogPosition.y = position.y - 420
    
    // 限制对话框位置
    dialogPosition.x = Math.max(10, Math.min(window.innerWidth - 390, dialogPosition.x))
    dialogPosition.y = Math.max(10, Math.min(window.innerHeight - 490, dialogPosition.y))
  }
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', drag)
  document.removeEventListener('mouseup', stopDrag)
}

// 对话框切换
const toggleDialog = () => {
  if (!isDragging.value) {
    isDialogOpen.value = !isDialogOpen.value
    if (isDialogOpen.value) {
      nextTick(() => {
        scrollToBottom()
      })
    }
  }
}

// 滚动到底部
const scrollToBottom = () => {
  if (chatMessages.value) {
    chatMessages.value.scrollTop = chatMessages.value.scrollHeight
  }
}

// 发送消息
const sendMessage = async () => {
  if (!userInput.value.trim() || isTyping.value) return

  const userMessage = userInput.value.trim()
  messages.value.push({ type: 'user', content: userMessage })
  userInput.value = ''
  isTyping.value = true

  nextTick(() => {
    scrollToBottom()
  })

  try {
    // 调用API
    const response = await fetchChatResponse(userMessage)
    
    // 模拟stream输出
    await streamResponse(response)
  } catch (error) {
    console.error('API调用失败:', error)
    messages.value.push({ type: 'assistant', content: '抱歉，我遇到了一些问题，请稍后再试。' })
  } finally {
    isTyping.value = false
    nextTick(() => {
      scrollToBottom()
    })
  }
}

// 发送预设问题
const sendSuggestedQuestion = async (question: string) => {
  if (isTyping.value) return
  
  userInput.value = question
  await sendMessage()
}

// API调用
const fetchChatResponse = async (message: string): Promise<string> => {
  try {
    // 这里替换为实际的API端点
    const response = await axios.post('https://api.example.com/chat', {
      message: message,
      // 其他必要的参数
    }, {
      headers: {
        'Content-Type': 'application/json',
        // 如果需要认证，添加认证头
        // 'Authorization': 'Bearer your-token'
      }
    })
    
    return response.data.reply || '抱歉，我没有得到有效的回复。'
  } catch (error) {
    console.error('API调用错误:', error)
    // 返回一个默认回复，避免UI崩溃
    return '抱歉，我暂时无法连接到服务器，请稍后再试。'
  }
}

// 模拟stream输出
const streamResponse = async (response: string) => {
  const assistantMessage = { type: 'assistant' as const, content: '' }
  messages.value.push(assistantMessage)
  
  const words = response.split('')
  for (let i = 0; i < words.length; i++) {
    assistantMessage.content += words[i]
    await new Promise(resolve => setTimeout(resolve, 30)) // 调整速度
    nextTick(() => {
      scrollToBottom()
    })
  }
}

// 窗口大小改变时调整位置
const handleResize = () => {
  position.x = Math.min(position.x, window.innerWidth - 60)
  position.y = Math.min(position.y, window.innerHeight - 60)
  dialogPosition.x = Math.min(dialogPosition.x, window.innerWidth - 390)
  dialogPosition.y = Math.min(dialogPosition.y, window.innerHeight - 490)
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('mousemove', drag)
  document.removeEventListener('mouseup', stopDrag)
})
</script>

<style scoped>
.v-assistant-container {
  position: fixed;
  z-index: 9999;
}

.v-assistant-icon {
  position: fixed;
  width: 60px;
  height: 60px;
  cursor: move;
  user-select: none;
  transition: transform 0.2s ease;
  z-index: 10000;
}

.v-assistant-icon:hover {
  transform: scale(1.1);
}

.v-assistant-icon:active {
  transform: scale(0.95);
}

.v-icon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.v-assistant-dialog {
  position: fixed;
  width: 380px;
  height: 480px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  z-index: 9999;
}

.dialog-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #FB7299;
  color: white;
  border-radius: 12px 12px 0 0;
}

.dialog-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.dialog-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f9fafb;
}

.message {
  margin-bottom: 12px;
  display: flex;
  align-items: flex-start;
}

.message.user {
  justify-content: flex-end;
}

.message-content {
  max-width: 80%;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
}

.message.user .message-content {
  background: #FB7299;
  color: white;
  border-bottom-right-radius: 4px;
}

.message.assistant .message-content {
  background: white;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-bottom-left-radius: 4px;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 14px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  border-bottom-left-radius: 4px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #9ca3af;
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
}

.input-area {
  padding: 16px;
  border-top: 1px solid #e5e7eb;
  background: white;
  display: flex;
  gap: 8px;
}

.input-area input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
}

.input-area input:focus {
  border-color: #FB7299;
}

.input-area input:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

.input-area button {
  padding: 10px 20px;
  background: #FB7299;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.input-area button:hover:not(:disabled) {
  opacity: 0.9;
}

.input-area button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 猜你想问样式 */
.suggested-questions {
  padding: 16px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.suggested-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
}

.questions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.question-chip {
  padding: 8px 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.question-chip:hover {
  background: #FB7299;
  color: white;
  border-color: #FB7299;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(251, 114, 153, 0.3);
}

.question-chip:active {
  transform: translateY(0);
}

/* 滚动条样式 */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>