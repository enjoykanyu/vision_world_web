/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
        'spin-slow': 'spin 8s linear infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.8s ease-out',
        'scale-in': 'scaleIn 0.6s ease-out',
      },
      keyframes: {
        'bilibili-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' }
        },
        'bilibili-glow': {
          'from': { boxShadow: '0 0 15px -5px rgba(251,114,153,0.5)' },
          'to': { boxShadow: '0 0 25px -5px rgba(251,114,153,0.8)' }
        },
        'card-slide': {
          'from': { transform: 'translateY(20px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          'from': { boxShadow: '0 0 20px -10px rgba(59, 130, 246, 0.5)' },
          'to': { boxShadow: '0 0 30px -10px rgba(59, 130, 246, 0.8)' },
        },
        slideUp: {
          'from': { transform: 'translateY(20px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        scaleIn: {
          'from': { transform: 'scale(0.9)', opacity: '0' },
          'to': { transform: 'scale(1)', opacity: '1' },
        }
      },
      colors: {
        // 统一的设计系统颜色
        'brand': {
          primary: '#6366F1',    // 现代紫色
          secondary: '#EC4899',  // 现代粉色
          accent: '#10B981',     // 现代绿色
          dark: '#1F2937',       // 深灰色
          light: '#F9FAFB',      // 浅灰色
        },
        // 平台特定颜色（保持原有风格但更协调）
        'douyin': {
          primary: '#FE2C55',
          secondary: '#25F4EE',
          dark: '#000000',
          light: '#FFFFFF',
          bg: '#0A0A0A'
        },
        'bilibili': {
          primary: '#00A1D6',      // 主色 - 蓝色
          secondary: '#FB7299',    // 辅助色 - 粉色
          dark: '#161616',
          light: '#F4F4F4',        // 背景色
          bg: '#F4F4F4',           // 统一背景色
          blue: {
            50: '#E6F4FF',
            100: '#CCE9FF',
            200: '#99D3FF',
            300: '#66BDFF',
            400: '#33A7FF',
            500: '#00A1D6',  // 主蓝色
            600: '#0080B3',
            700: '#006699',
            800: '#004D80',
            900: '#003366'
          },
          pink: {
            50: '#FFF0F5',
            100: '#FFE4E1',
            200: '#FFC1CC',
            300: '#FF9EB8',
            400: '#FF7BA3',
            500: '#FB7299',  // 主粉色
            600: '#E85D8A',
            700: '#D4487B',
            800: '#BF336B',
            900: '#AA1E5C'
          },
          gray: {
            50: '#F9FAFB',
            100: '#F3F4F6',
            200: '#E5E7EB',
            300: '#D1D5DB',
            400: '#9CA3AF',
            500: '#6B7280',
            600: '#4B5563',
            700: '#374151',
            800: '#1F2937',
            900: '#111827'
          }
        },
        'xiaohongshu': {
          primary: '#FF2442',
          secondary: '#FFC0CB',
          dark: '#2A2A2A',
          light: '#FFFFFF',
          bg: '#FEF2F2'
        }
      },
      boxShadow: {
        'glow': '0 0 20px rgba(99, 102, 241, 0.3)',
        'glow-lg': '0 0 40px rgba(99, 102, 241, 0.4)',
        'card': '0 10px 30px rgba(0, 0, 0, 0.1)',
        'card-lg': '0 20px 40px rgba(0, 0, 0, 0.15)',
        // B站风格阴影
        'bilibili': '0 2px 8px rgba(0, 161, 214, 0.15)',
        'bilibili-lg': '0 4px 16px rgba(0, 161, 214, 0.25)',
      },
      borderRadius: {
        // B站风格圆角
        'bilibili': '8px',
        'bilibili-lg': '12px',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}