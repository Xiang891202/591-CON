import { defineStore } from 'pinia'
import axios from 'axios'

// 在 store 中建立 axios 實例時
const api = axios.create({
  baseURL: '/api',  // 不再使用完整 URL
})

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
  }),
  actions: {
    async login(email, password) {
      try {
        const { data } = await api.post('/auth/login', { email, password })
        if (data.success) {
          this.user = data.user
          this.token = data.token
          localStorage.setItem('token', data.token)
        }
        return data
      } catch (error) {
        console.error('登入失敗', error.response?.data || error.message)
        throw error
      }
    },
    async register(userData) {
      try {
        const { data } = await api.post('/auth/register', userData)
        if (data.success) {
          this.user = data.user
          this.token = data.token
          localStorage.setItem('token', data.token)
        }
        return data
      } catch (error) {
        console.error('註冊失敗', error.response?.data || error.message)
        throw error
      }
    },
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
})