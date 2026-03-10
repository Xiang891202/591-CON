import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './authStore';

// 與 authStore 一致的 axios 實例
const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    currentProduct: null,
    favorites: [],           // 存放收藏的商品列表 (已 populate)
    loading: false,
  }),
  actions: {
    // 取得商品列表 (支援篩選參數，由 FilterBar 傳入)
    async fetchProducts(params = {}) {
      this.loading = true;
      try {
        const { data } = await api.get('/products', { params });
        // 根據您的 responseHelper 結構調整
        this.products = data.data?.products || data.products || [];
      } catch (error) {
        console.error('取得商品列表失敗', error);
      } finally {
        this.loading = false;
      }
    },

    // 取得單一商品詳細 (需要後端實作 GET /products/:id)
    async fetchProductById(id) {
      this.loading = true;
      try {
        const { data } = await api.get(`/products/${id}`);
        this.currentProduct = data.data?.product || data.product || data;
      } catch (error) {
        console.error('取得商品詳細失敗', error);
      } finally {
        this.loading = false;
      }
    },

    // 取得用戶收藏列表
    async fetchFavorites() {
      const authStore = useAuthStore();
      if (!authStore.isLoggedIn) return;
      try {
        const { data } = await api.get('/favorites');
        // 假設後端回傳 { data: { favorites: [...] } } 或 { favorites: [...] }
        this.favorites = data.data?.favorites || data.favorites || [];
      } catch (error) {
        console.error('取得收藏列表失敗', error);
      }
    },

    // 切換收藏狀態 (若已收藏則取消，否則新增)
    async toggleFavorite(productId) {
      const authStore = useAuthStore();
      if (!authStore.isLoggedIn) {
        // 由呼叫方處理跳轉
        return false;
      }
      try {
        const isFav = this.favorites.some(f => f.product?._id === productId || f._id === productId);
        if (isFav) {
          // 取消收藏：DELETE /favorites/:productId
          await api.delete(`/favorites/${productId}`);
          this.favorites = this.favorites.filter(f => f.product?._id !== productId && f._id !== productId);
        } else {
          // 新增收藏：POST /favorites { productId }
          const { data } = await api.post('/favorites', { productId });
          // 若後端回傳完整的收藏物件，可加入列表
          if (data.data?.favorite) {
            this.favorites.push(data.data.favorite);
          } else {
            // 若無回傳，重新取得收藏列表以確保同步
            await this.fetchFavorites();
          }
        }
        return true;
      } catch (error) {
        console.error('切換收藏失敗', error);
        return false;
      }
    },
  },
  getters: {
    // 檢查特定商品是否在收藏中 (用於 ProductCard / ProductDetail)
    isFavorited: (state) => (productId) => {
      return state.favorites.some(f => f.product?._id === productId || f._id === productId);
    },
  },
});