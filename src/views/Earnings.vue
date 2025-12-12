<template>
  <div class="earnings">
    <div class="bg-white rounded-xl shadow-sm border border-bilibili-gray-200 p-6 mb-6">
      <h2 class="text-2xl font-bold text-bilibili-gray-900 mb-2">收益管理</h2>
      <p class="text-bilibili-gray-600">查看您的创作收益情况</p>
    </div>
    
    <!-- 收益概览卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-xl shadow-sm border border-bilibili-gray-200 p-6">
        <div class="flex justify-between items-start">
          <div>
            <div class="text-bilibili-gray-600 text-sm mb-1">本月收益</div>
            <div class="text-3xl font-bold text-bilibili-gray-900 mb-2">¥{{ (1234.56).toFixed(2) }}</div>
            <div class="flex items-center text-sm">
              <span class="text-bilibili-success flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                </svg>
                +15.2%
              </span>
              <span class="text-bilibili-gray-500 ml-2">较上月</span>
            </div>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-sm border border-bilibili-gray-200 p-6">
        <div class="flex justify-between items-start">
          <div>
            <div class="text-bilibili-gray-600 text-sm mb-1">上月收益</div>
            <div class="text-3xl font-bold text-bilibili-gray-900 mb-2">¥{{ (1071.76).toFixed(2) }}</div>
            <div class="flex items-center text-sm">
              <span class="text-bilibili-success flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                </svg>
                +8.9%
              </span>
              <span class="text-bilibili-gray-500 ml-2">较前月</span>
            </div>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-sm border border-bilibili-gray-200 p-6">
        <div class="flex justify-between items-start">
          <div>
            <div class="text-bilibili-gray-600 text-sm mb-1">累计收益</div>
            <div class="text-3xl font-bold text-bilibili-gray-900 mb-2">¥{{ (12345.67).toFixed(2) }}</div>
            <div class="flex items-center text-sm">
              <span class="text-bilibili-success flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                </svg>
                +1234.56
              </span>
              <span class="text-bilibili-gray-500 ml-2">本月新增</span>
            </div>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-sm border border-bilibili-gray-200 p-6">
        <div class="flex justify-between items-start">
          <div>
            <div class="text-bilibili-gray-600 text-sm mb-1">待提现金额</div>
            <div class="text-3xl font-bold text-bilibili-gray-900 mb-2">¥{{ (5678.90).toFixed(2) }}</div>
            <div class="flex items-center text-sm">
              <button class="text-bilibili-primary font-medium hover:underline">
                立即提现
              </button>
            </div>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 收益趋势和来源分布 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <!-- 收益趋势 -->
      <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-bilibili-gray-200 p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold text-bilibili-gray-900">收益趋势</h3>
          <div class="flex space-x-2">
            <button class="px-4 py-1 text-sm rounded-md bg-bilibili-primary/10 text-bilibili-primary font-medium">本月</button>
            <button class="px-4 py-1 text-sm rounded-md text-bilibili-gray-600 hover:bg-bilibili-gray-100">上月</button>
            <button class="px-4 py-1 text-sm rounded-md text-bilibili-gray-600 hover:bg-bilibili-gray-100">近3月</button>
          </div>
        </div>
        
        <!-- 图表占位 -->
        <div class="h-80 bg-bilibili-gray-50 rounded-lg flex items-center justify-center">
          <div class="text-bilibili-gray-500 text-center">
            <svg class="w-16 h-16 mx-auto mb-4 text-bilibili-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <p>收益趋势图表</p>
          </div>
        </div>
      </div>
      
      <!-- 收益来源分布 -->
      <div class="bg-white rounded-xl shadow-sm border border-bilibili-gray-200 p-6">
        <h3 class="text-xl font-semibold text-bilibili-gray-900 mb-6">收益来源分布</h3>
        
        <!-- 饼图占位 -->
        <div class="h-64 bg-bilibili-gray-50 rounded-lg flex items-center justify-center mb-4">
          <div class="text-bilibili-gray-500 text-center">
            <svg class="w-16 h-16 mx-auto mb-4 text-bilibili-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
            </svg>
            <p>收益来源分布</p>
          </div>
        </div>
        
        <!-- 来源数据 -->
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-2">
              <span class="w-3 h-3 rounded-full bg-bilibili-primary"></span>
              <span class="text-sm text-bilibili-gray-700">创作激励</span>
            </div>
            <span class="text-sm font-medium text-bilibili-gray-900">65%</span>
          </div>
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-2">
              <span class="w-3 h-3 rounded-full bg-bilibili-secondary"></span>
              <span class="text-sm text-bilibili-gray-700">广告分成</span>
            </div>
            <span class="text-sm font-medium text-bilibili-gray-900">20%</span>
          </div>
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-2">
              <span class="w-3 h-3 rounded-full bg-bilibili-success"></span>
              <span class="text-sm text-bilibili-gray-700">充电计划</span>
            </div>
            <span class="text-sm font-medium text-bilibili-gray-900">10%</span>
          </div>
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-2">
              <span class="w-3 h-3 rounded-full bg-bilibili-warning"></span>
              <span class="text-sm text-bilibili-gray-700">其他</span>
            </div>
            <span class="text-sm font-medium text-bilibili-gray-900">5%</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 收益明细表格 -->
    <div class="bg-white rounded-xl shadow-sm border border-bilibili-gray-200 p-6">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-semibold text-bilibili-gray-900">收益明细</h3>
        <div class="flex space-x-4">
          <div class="flex items-center space-x-2">
            <label class="text-sm text-bilibili-gray-600">时间范围：</label>
            <select class="border border-bilibili-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-bilibili-primary/50">
              <option>本月</option>
              <option>上月</option>
              <option>近3月</option>
            </select>
          </div>
          <button class="bg-bilibili-primary text-white px-4 py-1 rounded-lg text-sm font-medium hover:bg-bilibili-primary/90 transition-colors">
            导出明细
          </button>
        </div>
      </div>
      
      <!-- 表格 -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-bilibili-gray-200">
              <th class="text-left py-3 px-4 text-sm font-semibold text-bilibili-gray-700">日期</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-bilibili-gray-700">收益类型</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-bilibili-gray-700">来源</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-bilibili-gray-700">金额（元）</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-bilibili-gray-700">状态</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-bilibili-gray-700">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-bilibili-gray-100 hover:bg-bilibili-gray-50 transition-colors">
              <td class="py-3 px-4 text-sm text-bilibili-gray-600">2024-05-15</td>
              <td class="py-3 px-4 text-sm text-bilibili-gray-600">创作激励</td>
              <td class="py-3 px-4 text-sm text-bilibili-gray-600">视频《2024年最新创作教程》</td>
              <td class="py-3 px-4 text-sm font-medium text-bilibili-gray-900">+123.45</td>
              <td class="py-3 px-4">
                <span class="px-2 py-0.5 text-xs bg-bilibili-success/10 text-bilibili-success rounded-full">已结算</span>
              </td>
              <td class="py-3 px-4">
                <button class="text-bilibili-primary text-sm hover:underline">查看详情</button>
              </td>
            </tr>
            <tr class="border-b border-bilibili-gray-100 hover:bg-bilibili-gray-50 transition-colors">
              <td class="py-3 px-4 text-sm text-bilibili-gray-600">2024-05-14</td>
              <td class="py-3 px-4 text-sm text-bilibili-gray-600">广告分成</td>
              <td class="py-3 px-4 text-sm text-bilibili-gray-600">视频《如何制作吸引人的封面》</td>
              <td class="py-3 px-4 text-sm font-medium text-bilibili-gray-900">+89.67</td>
              <td class="py-3 px-4">
                <span class="px-2 py-0.5 text-xs bg-bilibili-success/10 text-bilibili-success rounded-full">已结算</span>
              </td>
              <td class="py-3 px-4">
                <button class="text-bilibili-primary text-sm hover:underline">查看详情</button>
              </td>
            </tr>
            <tr class="border-b border-bilibili-gray-100 hover:bg-bilibili-gray-50 transition-colors">
              <td class="py-3 px-4 text-sm text-bilibili-gray-600">2024-05-13</td>
              <td class="py-3 px-4 text-sm text-bilibili-gray-600">充电计划</td>
              <td class="py-3 px-4 text-sm text-bilibili-gray-600">粉丝充电</td>
              <td class="py-3 px-4 text-sm font-medium text-bilibili-gray-900">+45.23</td>
              <td class="py-3 px-4">
                <span class="px-2 py-0.5 text-xs bg-bilibili-success/10 text-bilibili-success rounded-full">已结算</span>
              </td>
              <td class="py-3 px-4">
                <button class="text-bilibili-primary text-sm hover:underline">查看详情</button>
              </td>
            </tr>
            <tr class="border-b border-bilibili-gray-100 hover:bg-bilibili-gray-50 transition-colors">
              <td class="py-3 px-4 text-sm text-bilibili-gray-600">2024-05-12</td>
              <td class="py-3 px-4 text-sm text-bilibili-gray-600">创作激励</td>
              <td class="py-3 px-4 text-sm text-bilibili-gray-600">视频《粉丝增长的3个核心策略》</td>
              <td class="py-3 px-4 text-sm font-medium text-bilibili-gray-900">+156.78</td>
              <td class="py-3 px-4">
                <span class="px-2 py-0.5 text-xs bg-bilibili-success/10 text-bilibili-success rounded-full">已结算</span>
              </td>
              <td class="py-3 px-4">
                <button class="text-bilibili-primary text-sm hover:underline">查看详情</button>
              </td>
            </tr>
            <tr class="hover:bg-bilibili-gray-50 transition-colors">
              <td class="py-3 px-4 text-sm text-bilibili-gray-600">2024-05-11</td>
              <td class="py-3 px-4 text-sm text-bilibili-gray-600">创作激励</td>
              <td class="py-3 px-4 text-sm text-bilibili-gray-600">视频《2024年B站创作趋势分析》</td>
              <td class="py-3 px-4 text-sm font-medium text-bilibili-gray-900">+112.34</td>
              <td class="py-3 px-4">
                <span class="px-2 py-0.5 text-xs bg-bilibili-warning/10 text-bilibili-warning rounded-full">待结算</span>
              </td>
              <td class="py-3 px-4">
                <button class="text-bilibili-primary text-sm hover:underline">查看详情</button>
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
</style>