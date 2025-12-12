<template>
  <div class="video-manage">
    <div class="bg-white rounded-xl shadow-sm border border-bilibili-gray-200 p-6">
      <h2 class="text-2xl font-bold text-bilibili-gray-900 mb-6">稿件管理</h2>
      
      <!-- 内容类型导航 -->
      <div class="border-b border-bilibili-gray-200 mb-6">
        <ul class="flex space-x-8">
          <li>
            <button class="py-3 px-1 border-b-2 border-bilibili-primary text-bilibili-primary font-medium">
              视频
            </button>
          </li>
          <li>
            <button class="py-3 px-1 border-b-2 border-transparent text-bilibili-gray-600 hover:text-bilibili-gray-900 transition-colors">
              专栏
            </button>
          </li>
          <li>
            <button class="py-3 px-1 border-b-2 border-transparent text-bilibili-gray-600 hover:text-bilibili-gray-900 transition-colors">
              动态
            </button>
          </li>
          <li>
            <button class="py-3 px-1 border-b-2 border-transparent text-bilibili-gray-600 hover:text-bilibili-gray-900 transition-colors">
              音频
            </button>
          </li>
        </ul>
      </div>
      
      <!-- 筛选和搜索 -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-3 md:space-y-0">
        <div class="flex space-x-3">
          <button class="border border-bilibili-gray-300 text-bilibili-gray-700 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-bilibili-gray-50 transition-colors">
            全部
          </button>
          <button class="border border-bilibili-gray-300 text-bilibili-gray-700 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-bilibili-gray-50 transition-colors">
            待审核
          </button>
          <button class="border border-bilibili-gray-300 text-bilibili-gray-700 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-bilibili-gray-50 transition-colors">
            审核通过
          </button>
          <button class="border border-bilibili-gray-300 text-bilibili-gray-700 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-bilibili-gray-50 transition-colors">
            审核未通过
          </button>
          <button class="border border-bilibili-gray-300 text-bilibili-gray-700 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-bilibili-gray-50 transition-colors">
            草稿箱
          </button>
        </div>
        <div class="flex space-x-3">
          <div class="relative">
            <input 
              type="text" 
              class="w-full md:w-64 border border-bilibili-gray-300 rounded-lg px-4 py-1.5 pr-10 focus:outline-none focus:ring-2 focus:ring-bilibili-primary/50 text-sm"
              placeholder="搜索视频标题"
            >
            <button class="absolute right-3 top-1/2 transform -translate-y-1/2 text-bilibili-gray-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
          </div>
          <button class="bg-bilibili-primary text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-bilibili-primary/90 transition-colors">
            筛选
          </button>
        </div>
      </div>
      
      <!-- 表格 -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-bilibili-gray-200">
              <th class="text-left py-3 px-4 text-sm font-semibold text-bilibili-gray-700">
                <input type="checkbox" class="rounded border-bilibili-gray-300 text-bilibili-primary focus:ring-bilibili-primary/50">
              </th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-bilibili-gray-700">视频信息</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-bilibili-gray-700">播放量</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-bilibili-gray-700">点赞数</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-bilibili-gray-700">状态</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-bilibili-gray-700">发布时间</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-bilibili-gray-700">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-bilibili-gray-100 hover:bg-bilibili-gray-50 transition-colors">
              <td class="py-4 px-4">
                <input type="checkbox" class="rounded border-bilibili-gray-300 text-bilibili-primary focus:ring-bilibili-primary/50">
              </td>
              <td class="py-4 px-4">
                <div class="flex items-center space-x-4">
                  <div class="w-24 h-14 bg-bilibili-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <div class="w-full h-full bg-gradient-to-br from-bilibili-primary/20 to-bilibili-secondary/20 flex items-center justify-center">
                      <svg class="w-8 h-8 text-bilibili-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <div class="font-medium text-bilibili-gray-900 text-sm line-clamp-2">2024年最新创作教程，让你的视频播放量翻倍</div>
                    <div class="text-xs text-bilibili-gray-600 mt-1">视频ID: 123456789</div>
                  </div>
                </div>
              </td>
              <td class="py-4 px-4 text-sm text-bilibili-gray-600">123,456</td>
              <td class="py-4 px-4 text-sm text-bilibili-gray-600">5,678</td>
              <td class="py-4 px-4">
                <span class="px-2 py-0.5 text-xs bg-bilibili-success/10 text-bilibili-success rounded-full">已发布</span>
              </td>
              <td class="py-4 px-4 text-sm text-bilibili-gray-600">2024-05-15 14:30</td>
              <td class="py-4 px-4">
                <div class="flex space-x-2">
                  <button class="text-bilibili-primary text-xs hover:underline">编辑</button>
                  <button class="text-bilibili-primary text-xs hover:underline">查看</button>
                  <button class="text-bilibili-gray-600 text-xs hover:underline">更多</button>
                </div>
              </td>
            </tr>
            <tr class="border-b border-bilibili-gray-100 hover:bg-bilibili-gray-50 transition-colors">
              <td class="py-4 px-4">
                <input type="checkbox" class="rounded border-bilibili-gray-300 text-bilibili-primary focus:ring-bilibili-primary/50">
              </td>
              <td class="py-4 px-4">
                <div class="flex items-center space-x-4">
                  <div class="w-24 h-14 bg-bilibili-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <div class="w-full h-full bg-gradient-to-br from-bilibili-primary/20 to-bilibili-secondary/20 flex items-center justify-center">
                      <svg class="w-8 h-8 text-bilibili-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <div class="font-medium text-bilibili-gray-900 text-sm line-clamp-2">如何制作吸引人的视频封面，提升点击率</div>
                    <div class="text-xs text-bilibili-gray-600 mt-1">视频ID: 987654321</div>
                  </div>
                </div>
              </td>
              <td class="py-4 px-4 text-sm text-bilibili-gray-600">89,012</td>
              <td class="py-4 px-4 text-sm text-bilibili-gray-600">3,456</td>
              <td class="py-4 px-4">
                <span class="px-2 py-0.5 text-xs bg-bilibili-success/10 text-bilibili-success rounded-full">已发布</span>
              </td>
              <td class="py-4 px-4 text-sm text-bilibili-gray-600">2024-05-14 10:15</td>
              <td class="py-4 px-4">
                <div class="flex space-x-2">
                  <button class="text-bilibili-primary text-xs hover:underline">编辑</button>
                  <button class="text-bilibili-primary text-xs hover:underline">查看</button>
                  <button class="text-bilibili-gray-600 text-xs hover:underline">更多</button>
                </div>
              </td>
            </tr>
            <tr class="border-b border-bilibili-gray-100 hover:bg-bilibili-gray-50 transition-colors">
              <td class="py-4 px-4">
                <input type="checkbox" class="rounded border-bilibili-gray-300 text-bilibili-primary focus:ring-bilibili-primary/50">
              </td>
              <td class="py-4 px-4">
                <div class="flex items-center space-x-4">
                  <div class="w-24 h-14 bg-bilibili-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <div class="w-full h-full bg-gradient-to-br from-bilibili-primary/20 to-bilibili-secondary/20 flex items-center justify-center">
                      <svg class="w-8 h-8 text-bilibili-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <div class="font-medium text-bilibili-gray-900 text-sm line-clamp-2">粉丝增长的3个核心策略，快速突破10万粉</div>
                    <div class="text-xs text-bilibili-gray-600 mt-1">视频ID: 567891234</div>
                  </div>
                </div>
              </td>
              <td class="py-4 px-4 text-sm text-bilibili-gray-600">67,890</td>
              <td class="py-4 px-4 text-sm text-bilibili-gray-600">2,345</td>
              <td class="py-4 px-4">
                <span class="px-2 py-0.5 text-xs bg-bilibili-success/10 text-bilibili-success rounded-full">已发布</span>
              </td>
              <td class="py-4 px-4 text-sm text-bilibili-gray-600">2024-05-13 16:45</td>
              <td class="py-4 px-4">
                <div class="flex space-x-2">
                  <button class="text-bilibili-primary text-xs hover:underline">编辑</button>
                  <button class="text-bilibili-primary text-xs hover:underline">查看</button>
                  <button class="text-bilibili-gray-600 text-xs hover:underline">更多</button>
                </div>
              </td>
            </tr>
            <tr class="border-b border-bilibili-gray-100 hover:bg-bilibili-gray-50 transition-colors">
              <td class="py-4 px-4">
                <input type="checkbox" class="rounded border-bilibili-gray-300 text-bilibili-primary focus:ring-bilibili-primary/50">
              </td>
              <td class="py-4 px-4">
                <div class="flex items-center space-x-4">
                  <div class="w-24 h-14 bg-bilibili-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <div class="w-full h-full bg-gradient-to-br from-bilibili-primary/20 to-bilibili-secondary/20 flex items-center justify-center">
                      <svg class="w-8 h-8 text-bilibili-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <div class="font-medium text-bilibili-gray-900 text-sm line-clamp-2">2024年B站创作趋势分析</div>
                    <div class="text-xs text-bilibili-gray-600 mt-1">视频ID: 432156789</div>
                  </div>
                </div>
              </td>
              <td class="py-4 px-4 text-sm text-bilibili-gray-600">45,678</td>
              <td class="py-4 px-4 text-sm text-bilibili-gray-600">1,890</td>
              <td class="py-4 px-4">
                <span class="px-2 py-0.5 text-xs bg-bilibili-warning/10 text-bilibili-warning rounded-full">待审核</span>
              </td>
              <td class="py-4 px-4 text-sm text-bilibili-gray-600">2024-05-12 09:30</td>
              <td class="py-4 px-4">
                <div class="flex space-x-2">
                  <button class="text-bilibili-primary text-xs hover:underline">编辑</button>
                  <button class="text-bilibili-primary text-xs hover:underline">查看</button>
                  <button class="text-bilibili-gray-600 text-xs hover:underline">更多</button>
                </div>
              </td>
            </tr>
            <tr class="hover:bg-bilibili-gray-50 transition-colors">
              <td class="py-4 px-4">
                <input type="checkbox" class="rounded border-bilibili-gray-300 text-bilibili-primary focus:ring-bilibili-primary/50">
              </td>
              <td class="py-4 px-4">
                <div class="flex items-center space-x-4">
                  <div class="w-24 h-14 bg-bilibili-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <div class="w-full h-full bg-gradient-to-br from-bilibili-primary/20 to-bilibili-secondary/20 flex items-center justify-center">
                      <svg class="w-8 h-8 text-bilibili-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <div class="font-medium text-bilibili-gray-900 text-sm line-clamp-2">如何制作高质量的短视频内容</div>
                    <div class="text-xs text-bilibili-gray-600 mt-1">视频ID: 891234567</div>
                  </div>
                </div>
              </td>
              <td class="py-4 px-4 text-sm text-bilibili-gray-600">23,456</td>
              <td class="py-4 px-4 text-sm text-bilibili-gray-600">987</td>
              <td class="py-4 px-4">
                <span class="px-2 py-0.5 text-xs bg-bilibili-error/10 text-bilibili-error rounded-full">审核未通过</span>
              </td>
              <td class="py-4 px-4 text-sm text-bilibili-gray-600">2024-05-11 11:20</td>
              <td class="py-4 px-4">
                <div class="flex space-x-2">
                  <button class="text-bilibili-primary text-xs hover:underline">编辑</button>
                  <button class="text-bilibili-primary text-xs hover:underline">查看</button>
                  <button class="text-bilibili-gray-600 text-xs hover:underline">更多</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- 分页 -->
      <div class="flex justify-center items-center mt-6">
        <div class="flex space-x-1">
          <button class="px-3 py-1 border border-bilibili-gray-300 rounded-lg text-sm text-bilibili-gray-600 hover:bg-bilibili-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
            上一页
          </button>
          <button class="px-3 py-1 border border-bilibili-primary bg-bilibili-primary text-white rounded-lg text-sm">1</button>
          <button class="px-3 py-1 border border-bilibili-gray-300 rounded-lg text-sm text-bilibili-gray-600 hover:bg-bilibili-gray-50">2</button>
          <button class="px-3 py-1 border border-bilibili-gray-300 rounded-lg text-sm text-bilibili-gray-600 hover:bg-bilibili-gray-50">3</button>
          <button class="px-3 py-1 border border-bilibili-gray-300 rounded-lg text-sm text-bilibili-gray-600 hover:bg-bilibili-gray-50">4</button>
          <button class="px-3 py-1 border border-bilibili-gray-300 rounded-lg text-sm text-bilibili-gray-600 hover:bg-bilibili-gray-50">5</button>
          <button class="px-3 py-1 border border-bilibili-gray-300 rounded-lg text-sm text-bilibili-gray-600 hover:bg-bilibili-gray-50">下一页</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
</script>

<style scoped>
/* 表格样式 */
table {
  border-collapse: collapse;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>