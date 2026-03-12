import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './authStore';

const api = axios.create({ baseURL: '/api' });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    currentProduct: null,
    favorites: [],
    loading: false,
    // ===== 地圖相關狀態 =====
    mapBounds: {
      minLat: null,
      maxLat: null,
      minLng: null,
      maxLng: null
    },
    mapProducts: [],      // 地圖範圍內的商品（與 products 可能不同）
    activeProductId: null // 當前點擊的商品 ID
  }),

  actions: {
    // ---------- 原有 actions ----------
    async fetchProducts(params = {}) {
      this.loading = true;
      try {
        const { data } = await api.get('/products', { params });
        this.products = data.data?.products || data.products || [];
      } catch (error) {
        console.error('取得商品列表失敗', error);
      } finally {
        this.loading = false;
      }
    },

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

    async fetchFavorites() {
      const authStore = useAuthStore();
      if (!authStore.isLoggedIn) return;
      try {
        const { data } = await api.get('/favorites');
        this.favorites = data.data?.favorites || data.favorites || [];
      } catch (error) {
        console.error('取得收藏列表失敗', error);
      }
    },

  async toggleFavorite(productId) {
    const authStore = useAuthStore();
    if (!authStore.isLoggedIn) return false;
    try {
      const isFav = this.favorites.some(f => {
      const favId = f.product?._id || f._id;
      return String(favId) === String(productId);
    });

    if (isFav) {
      await api.delete(`/favorites/${productId}`);
      this.favorites = this.favorites.filter(f => {
        const favId = f.product?._id || f._id;
        return String(favId) !== String(productId);
      });
    } else {
      await api.post('/favorites', { productId });
      await this.fetchFavorites(); // 重新获取完整收藏列表，确保数据一致
    }
    return true;
  } catch (error) {
    console.error('切換收藏失敗', error);
    return false;
  }
},


    // ---------- 地圖相關 actions ----------
    setMapBounds(bounds) {
      this.mapBounds = bounds;
    },

    async fetchMapProperties() {
      if (!this.mapBounds.minLat) return;
      try {
        const { data } = await api.get('/products/map/properties', { params: this.mapBounds });
        // 根據後端回應結構調整（此處假設 data.data 為陣列）
        this.mapProducts = data.data || data.properties || [];
        // 若您希望左側商品列表與地圖顯示相同，可將 products 也指向 mapProducts
        // this.products = this.mapProducts;
      } catch (error) {
        console.error('取得地圖物件失敗', error);
      }
    },

    setActiveProductId(id) {
      this.activeProductId = id;
    }
  },

  getters: {
    isFavorited: (state) => (productId) => {
      return state.favorites.some(f => {
        const favoriteProductId = f.product?._id || f._id; 
        console.log('🔍 比較:', favoriteProductId, productId);
        return String(favoriteProductId) === String(productId);
      });
    }
  }
});