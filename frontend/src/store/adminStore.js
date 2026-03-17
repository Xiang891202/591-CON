//管理員專屬狀態

// src/store/adminStore.js
import { defineStore } from 'pinia';
import axios from 'axios';

const api = axios.create({ baseURL: '/api' });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const useAdminStore = defineStore('admin', {
  state: () => ({
    products: [],
    loading: false,
  }),
  actions: {
    async fetchAllProducts() {
      this.loading = true;
      try {
        const { data } = await api.get('/admin/products');
        if (data.success) this.products = data.data;
      } catch (error) {
        console.error('取得商品列表失敗', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateProduct(id, formData) {
      const { data } = await api.put(`/admin/products/${id}`, formData);
      if (data.success) {
        // 更新本地商品資料（或重新 fetch）
        const index = this.products.findIndex(p => p._id === id);
        if (index !== -1) this.products[index] = data.data;
      }
      return data;
    },
    async deleteProduct(id) {
      const { data } = await api.delete(`/admin/products/${id}`);
      if (data.success) {
        this.products = this.products.filter(p => p._id !== id);
      }
      return data;
    },
    // 可再新增 createProduct 等
    async createProduct(productData){
      this.loading = true
      try {
        const { data } = await api.post('/admin/products', productData);
        if(data.success) {
          this.products.unshift(data.data);
        }
        return data;
      }catch(error) {
        console.error('新增商品失敗', error);
        throw error;
      } finally {
        this.loading = false
      }
    }
  },
});

export { api };