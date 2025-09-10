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
          primary: '#FB7299',
          secondary: '#00A1D6',
          dark: '#161616',
          light: '#F4F4F4',
          bg: '#1A1A1A'
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
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}