// src/store/authStore.js
import { defineStore } from 'pinia';
import api from '@/api';  // 修正

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
  }),
  actions: {
    async login(email, password) {
      this.loading = true;
      try {
        const { data } = await api.post('/auth/login', { email, password });
        if (data.success) {
          const { user, token } = data.data;
          this.user = user;
          this.token = token;
          localStorage.setItem('token', token);
        }
        return data;
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async register(userData) {
      this.loading = true;
      try {
        const { data } = await api.post('/auth/register', userData);
        if (data.success && data.data?.token) {
          this.user = data.data.user;
          this.token = data.data.token;
          localStorage.setItem('token', data.data.token);
        }
        return data;
      } catch (error) {
        console.error('Registration failed:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
    },
    async fetchMe() {
      if (!this.token) return;
      try {
        const { data } = await api.get('/auth/users/me');
        console.log('fetchMe response:', data);
        if (data.success) {
          this.user = data.data.user;
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        this.logout();
      }
    },
    async updateProfile(userData) {
      this.loading = true;
      try {
        const { data } = await api.put('/auth/profile', userData);
        if (data.success) {
          this.user = data.data;
        }
        return data;
      } catch (error) {
        console.error('更新個人資料失敗', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
});