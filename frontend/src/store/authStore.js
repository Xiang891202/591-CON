// src/store/authStore.js
import { defineStore } from 'pinia';
import axios from 'axios';

// ⚠️ 你需要自行設定正確的 baseURL（例如 '/api'）
const api = axios.create({
  baseURL: '/api',
});

// ⚠️ 你需要自行加入請求攔截器，自動帶上 Token
api.interceptors.request.use((config) => {
  // 從 localStorage 取得 token 並加到 headers
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
  }),
  actions: {
    // ⚠️ 你需要自行實作 login API 呼叫
    async login(email, password) {
      // 呼叫 api.post('/auth/login', { email, password })
      try {
        const { data } = await api.post('/auth/login', { email, password });
        // 處理回應，儲存 user 和 token
        if (data.success) {
          this.user = data.user;
          this.token = data.token;
          localStorage.setItem('token', data.token);
        }
        return data;
      } catch (error) {
        // 處理錯誤（例如顯示錯誤訊息）
        console.error('Login failed:', error);
        throw error;
      }
    },
    // ⚠️ 你需要自行實作 register API 呼叫
    async register(userData) {
      // 呼叫 api.post('/auth/register', userData)
      try {
        const { data } = await api.post('/auth/register', userData);
        if (data.success) {
          this.user = data.user;
          this.token = data.token;
          localStorage.setItem('token', data.token);
        }
        // 處理回應（例如顯示成功訊息或自動登入）
        return data;
      } catch (error) {
        // 處理錯誤（例如顯示錯誤訊息）
        console.error('Registration failed:', error);
        throw error;
      }
    },
    // ⚠️ 你需要自行實作 logout
    logout() {
      // 清除 state 和 localStorage
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
    },
    // ⚠️ 你需要自行實作 fetchMe（取得目前使用者）
    async fetchMe() {
      // 呼叫 api.get('/auth/users/me')
      try {
        const { data } = await api.get('/auth/users/me');
        console.log('fetchMe response:', data);
        // 若成功則更新 user，失敗則登出
        if (data.success) {
          this.user = data.user;
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        this.logout();
      }
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
});