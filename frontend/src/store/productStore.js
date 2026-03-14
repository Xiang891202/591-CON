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
    // currentProduct: null,
    favorites: [],
    // loading: false,
    // ===== 取得單一商品用於商品詳細頁 =====
    currentProduct: null,
    // loading: false,
    // error: null,

    // ===== 避免loading 狀態會互相干擾 =====
    productsLoading: false,
    productDetailLoading: false,
    favoritesLoading: false,
    mapLoading: false,
    error: null,

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
      this.productsLoading = true;
      try {
        const { data } = await api.get('/products', { params });
        this.products = data.data?.products || data.products || [];
      } catch (error) {
        console.error('取得商品列表失敗', error);
      } finally {
        this.productsLoading = false;
      }
    },

    async fetchProductById(id) {
      this.productDetailLoading = true;
      try {
        const { data } = await api.get(`/products/${id}`);
        this.currentProduct = data.data || data.product || data;
        // this.currentProduct = Response.data;
      } catch (error) {
        console.error('取得商品詳細失敗', error);
      } finally {
        this.productDetailLoading = false;
      }
    },

    async fetchFavorites() {
      const authStore = useAuthStore();
      if (!authStore.isLoggedIn) return;
      this.favoritesLoading = true;
      try {
        const { data } = await api.get('/favorites');
        this.favorites = data.data?.favorites || data.favorites || [];
      } catch (error) {
        console.error('取得收藏列表失敗', error);
      } finally {
        this.favoritesLoading = false;
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
      // const newFavorite = (await api.get(`/favorites/${productId}`)).data;
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
    const { minLat, maxLat, minLng, maxLng } = this.mapBounds;
    if (!minLat || !maxLat || !minLng || !maxLng) {
      if (import.meta.env.DEV) {
        console.warn('fetchMapProperties 被呼叫但 mapBounds 尚未完整初始化', this.mapBounds);
      }
    return;
  }
  this.mapLoading = true;
  try {
    const { data } = await api.get('/products/map/properties', { params: this.mapBounds });
    this.mapProducts = data.data || data.properties || [];
  } catch (error) {
    console.error('取得地圖物件失敗', error);
  } finally {
    this.mapLoading = false;
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
        // console.log('🔍 比較:', favoriteProductId, productId);
        return String(favoriteProductId) === String(productId);
      });
    }
  }
});