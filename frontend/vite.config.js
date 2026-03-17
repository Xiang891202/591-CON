import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'                    // 必須加上這行
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',  // 確認後端埠號是否正確
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '') // 可選：如果後端路由不包含 /api 前綴，則啟用此行
      },
      '/uploads':{
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
})