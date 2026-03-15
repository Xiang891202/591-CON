<template>
  <div v-if="productStore.productDetailLoading">載入中...</div>
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
      <p class="price">💰 {{ product.price }} 萬/月</p>
      <p class="category">🏷️ 分類：{{ product.category }}</p>
      <p class="description">📝 {{ product.description }}</p>
    </div>

    <!-- Leaflet 地圖容器（乾淨無 iframe） -->
    <div id="map" class="map-container" v-if="product.lat && product.lng"></div>

    <!-- 收藏按鈕 -->
    <button @click="handleToggleFavorite" :class="{ favorited: isFavorited }">
      {{ isFavorited ? '❤️ 已收藏' : '🤍 加入收藏' }}
    </button>

    <p v-if="!authStore.isLoggedIn" class="login-hint">
      <!-- <router-link to="/auth">登入</router-link> 後可使用收藏功能 -->
    </p>
  </div>
  <div v-else>
    商品不存在
    <router-link to="/">返回首頁</router-link>
  </div>
</template>

<script setup>
import { computed, onMounted, watch, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductStore } from '../store/productStore';
import { useAuthStore } from '../store/authStore';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 修正 Leaflet 預設圖示路徑（避免破圖）
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const authStore = useAuthStore();

const product = computed(() => productStore.currentProduct);

let mapInstance = null;

// 初始化地圖
const initMap = () => {
  if (!product.value || !product.value.lat || !product.value.lng) return;

  // 確保地圖容器存在且尚未初始化
  const mapContainer = document.getElementById('map');
  if (!mapContainer) return;
  if (mapContainer._leaflet_id) return; // 避免重複初始化

  // 設定預設圖示（解決破圖）
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

// 銷毀地圖
const destroyMap = () => {
  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }
};

// 監聽商品載入完成，初始化地圖
onMounted(() => {
  if (product.value) {
    setTimeout(() => initMap(), 100);
  }
});

// 商品資料變化時重新初始化
watch(product, (newVal, oldVal) => {
  if (newVal && newVal.lat && newVal.lng) {
    destroyMap();               // 先銷毀舊地圖
    setTimeout(() => initMap(), 100);
  }
});

// 元件卸載時銷毀地圖
onUnmounted(() => {
  destroyMap();
});

// 返回上一頁
const goBack = () => {
  if (window.history.state?.back) {
    router.back();
  } else {
    router.push('/');
  }
};

// 收藏相關（保持不變）
const isFavorited = computed(() => {
  if (!product.value?._id) return false;
  return productStore.isFavorited(product.value._id);
});

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
onMounted(async () => {
  const id = route.params.id;
  await productStore.fetchProductById(id);
  if (authStore.isLoggedIn) {
    await productStore.fetchFavorites();
  }
});
</script>

<style scoped>
.product-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
.back-btn {
  margin-bottom: 20px;
  padding: 8px 16px;
  background: #f0f0f0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}
.back-btn:hover {
  background: #e0e0e0;
}
.image-gallery {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  margin-bottom: 20px;
}
.gallery-image {
  width: 200px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}
.main-image {
  max-width: 100%;
  height: auto;
  margin-bottom: 20px;
}
.info {
  margin-bottom: 20px;
}
.price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #e67e22;
}
button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
button.favorited {
  background-color: #ffcccc;
  border-color: #ff0000;
}
.login-hint {
  margin-top: 10px;
  color: #666;
}
.map-container {
  width: 100%;
  height: 300px;
  margin: 30px 0;
  border-radius: 8px;
  z-index: 1;
}
</style>