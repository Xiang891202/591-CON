<template>
  <div class="product-card" @click="goToDetail">
    <img :src="product.images?.[0] || '/default-image.jpg'" :alt="product.name" />
    <h3>{{ product.name }}</h3>
    <p>💰 {{ product.price }} 萬/月</p>
    <!-- 收藏按鈕先隱藏，待後端實作後再啟用 -->
    <button @click.stop="handleFavoriteClick" :class="{ favorited: isFavorited }">
      {{ isFavorited ? '❤️' : '🤍' }}
    </button>
  </div>
</template>

<script setup>

import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/authStore'
import { useProductStore } from '../store/productStore'

// 將 defineProps 的返回值賦給 props 變數
const props = defineProps(['product']);

const router = useRouter();
const authStore = useAuthStore();
const productStore = useProductStore();

// 在 computed 中透過 props.product 存取
const isFavorited = computed(() => {

  //讀取 favorites 確保 cpmputed 依賴
  // console.log('🔄 isFavorited 重新計算, favorites 長度:', productStore.favorites.length);
  return productStore.isFavorited(props.product._id);
});

const handleFavoriteClick = async () => {
  if (!authStore.isLoggedIn) {
    router.push({ name: 'auth', query:{ redirect: router.currentRoute.value.fullPath}});
    return;
  }
  await productStore.toggleFavorite(props.product._id);
};

//點擊事件 到 商品詳細頁
const goToDetail = () => {
  router.push(`/product/${props.product._id}`);
};

</script>

<style scoped>
.product-card {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}
.product-card img {
  max-width: 100%;
  height: auto;
}
button.favorited {
  color: red;
}
</style>