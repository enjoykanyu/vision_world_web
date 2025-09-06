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
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          'from': { boxShadow: '0 0 20px -10px rgba(59, 130, 246, 0.5)' },
          'to': { boxShadow: '0 0 30px -10px rgba(59, 130, 246, 0.8)' },
        }
      },
      colors: {
        'douyin': {
          primary: '#FE2C55',
          secondary: '#25F4EE',
          dark: '#000000',
          light: '#FFFFFF'
        },
        'bilibili': {
          primary: '#FB7299',
          secondary: '#00A1D6',
          dark: '#161616',
          light: '#F4F4F4'
        },
        'xiaohongshu': {
          primary: '#FF2442',
          secondary: '#FFC0CB',
          dark: '#2A2A2A',
          light: '#FFFFFF'
        }
      }
    },
  },
  plugins: [],
}