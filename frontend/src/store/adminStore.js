// src/store/adminStore.js
import { defineStore } from 'pinia';
import api from '@/api';  // 修正：import api from '@/api'

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
    async createProduct(productData) {
      this.loading = true;
      try {
        const { data } = await api.post('/admin/products', productData);
        if (data.success) {
          this.products.unshift(data.data);
        }
        return data;
      } catch (error) {
        console.error('新增商品失敗', error);
        throw error;
      } finally {
        this.loading = false;
      }
    }
  },
});
// 移除 export { api };