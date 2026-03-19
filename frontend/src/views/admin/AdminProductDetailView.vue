<template>
  <div v-if="loading">載入中...</div>
  <div v-else-if="product" class="product-detail">
    <!-- 返回按鈕 -->
    <button class="back-btn" @click="goBack">← 返回</button>

    <h1>{{ product.name }}</h1>

    <!-- 圖片輪播區 -->
    <div class="image-gallery" v-if="product.images && product.images.length">
      <img
        v-for="(img, idx) in product.images"
        :key="idx"
        :src="img"
        :alt="product.name"
        class="gallery-image"
      />
    </div>
    <img v-else :src="'/default-image.jpg'" :alt="product.name" class="main-image" />

    <!-- 基本資訊 -->
    <div class="info">
      <p class="price">💰 {{ displayPrice }} 萬/月</p>
      <p class="category">🏷️ 分類：{{ product.category }}</p>
      <p class="description">📝 {{ product.description }}</p>
    </div>

    <!-- Leaflet 地圖容器 -->
    <div id="map" class="map-container" v-if="product.lat && product.lng"></div>

    <!-- 操作按鈕區：收藏、編輯、刪除 -->
    <div class="action-buttons">
      <button @click="handleToggleFavorite" :class="{ favorited: isFavorited }">
        {{ isFavorited ? '❤️ 已收藏' : '🤍 加入收藏' }}
      </button>
      <button @click="editProduct" class="edit-btn">✏️ 編輯商品</button>
      <button @click="deleteProduct" class="delete-btn">🗑️ 刪除商品</button>
    </div>
  </div>
  <div v-else>
    商品不存在
    <router-link to="/admin/products">返回列表</router-link>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAdminStore } from '@/store/adminStore';
import { useProductStore } from '@/store/productStore'; // 用于收藏
import { useAuthStore } from '@/store/authStore';
import api from '@/api';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 修正 Leaflet 預設圖示路徑
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const route = useRoute();
const router = useRouter();
const adminStore = useAdminStore();
const productStore = useProductStore();
const authStore = useAuthStore();

const product = ref(null);
const loading = ref(false);

let mapInstance = null;
let isMounted = ref(true);

// 價格顯示（轉為萬）
const displayPrice = computed(() => {
  const price = product.value?.price ?? 0;
  return (price / 10000).toFixed(1);
});

// 收藏狀態
const isFavorited = computed(() => {
  if (!product.value?._id) return false;
  return productStore.isFavorited(product.value._id);
});

// 初始化地圖
const initMap = () => {
  if (!product.value || !product.value.lat || !product.value.lng) return;

  const mapContainer = document.getElementById('map');
  if (!mapContainer) return;
  if (mapContainer._leaflet_id) return;

  const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  });
  L.Marker.prototype.options.icon = DefaultIcon;

  mapInstance = L.map('map').setView([product.value.lat, product.value.lng], 15);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mapInstance);

  L.marker([product.value.lat, product.value.lng])
    .addTo(mapInstance)
    .bindPopup(product.value.name)
    .openPopup();
};

const destroyMap = () => {
  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }
};

// 監聽商品載入完成，初始化地圖
watch(product, (newVal) => {
  if (newVal && newVal.lat && newVal.lng) {
    destroyMap();
    setTimeout(() => {
      if (isMounted.value) initMap();
    }, 100);
  }
});

onUnmounted(() => {
  destroyMap();
});

// 返回上一頁
const goBack = () => {
  router.push('/admin/products');
};

// 編輯商品
const editProduct = () => {
  router.push(`/admin/products/${route.params.id}/edit`);
};

// 刪除商品
const deleteProduct = async () => {
  if (!confirm('確定刪除此商品？')) return;
  try {
    await adminStore.deleteProduct(route.params.id);
    alert('刪除成功');
    router.push('/admin/products');
  } catch (error) {
    alert('刪除失敗');
  }
};

// 收藏切換（復用 productStore）
const handleToggleFavorite = async () => {
  if (!product.value?._id) {
    alert('商品資料有誤，無法執行操作');
    return;
  }
  if (!authStore.isLoggedIn) {
    alert('尚未登入，請先登入');
    router.push(`/auth?redirect=${encodeURIComponent(route.fullPath)}`);
    return;
  }
  const success = await productStore.toggleFavorite(product.value._id);
  if (success) {
    alert('收藏已更新');
  } else {
    alert('操作失敗，請稍後再試');
  }
};

// 載入商品資料
const fetchProduct = async () => {
  loading.value = true;
  try {
    // 先從 adminStore 的 products 中找
    let found = adminStore.products.find(p => p._id === route.params.id);
    if (found) {
      product.value = found;
    } else {
      // 若無，調用 API
      const { data } = await api.get(`/admin/products/${route.params.id}`);
      if (data.success) product.value = data.data;
    }
    // 確保收藏狀態也更新（productStore 可能尚未加載收藏列表）
    if (authStore.isLoggedIn && product.value) {
      await productStore.fetchFavorites(); // 確保收藏列表已加載
    }
  } catch (error) {
    console.error('取得商品失敗', error);
    product.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (adminStore.products.length === 0) {
    adminStore.fetchAllProducts().then(() => fetchProduct());
  } else {
    fetchProduct();
  }
  // 若已登入，確保收藏列表加載
  if (authStore.isLoggedIn) {
    productStore.fetchFavorites();
  }
});
</script>

<style lang="scss" src="@/styles/components/AdminProductDetailView.scss" scoped></style>