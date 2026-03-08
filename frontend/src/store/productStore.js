// store/productStore.js
import { defineStore } from 'pinia'
import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

// 請求攔截器（保留以備未來需要 token 的 API）
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    // favorites 暫時移除，直到後端實作
  }),
  actions: {
    async fetchProducts(params = {}) {
      try {
        const { data } = await api.get('/products', { params })
        // 假設後端回傳格式為 { success, message, products }
        if (data.success) {
          this.products = data.products
        }
      } catch (error) {
        console.error('取得商品失敗', error)
      }
    },
    // 收藏相關 actions 先註解
    // async toggleFavorite(productId) { ... },
    // async fetchFavorites() { ... },
  },
})