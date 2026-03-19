// src/api/index.js
import axios from 'axios';

// 建立 axios 實例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // 優先使用環境變數，否則預設 /api
});

// 請求攔截器：自動帶入 token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 回應攔截器（可選，例如統一錯誤處理）
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 例如：若收到 401 未授權，可自動登出
    if (error.response && error.response.status === 401) {
      // 可觸發登出 action，但避免循環依賴，可透過事件或直接清除 token
      localStorage.removeItem('token');
      // 若有需要，可重新導向至登入頁
      // window.location = '/auth';
    }
    return Promise.reject(error);
  }
);

export default api;