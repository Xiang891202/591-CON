<template>
  <div class="product-card" @click="goToDetail">
    <!-- 左側圖片區 -->
    <div class="card-image">
      <img :src="product.images?.[0] || '/default-image.jpg'" :alt="product.name" />
    </div>
    <!-- 右側資訊區 -->
    <div class="card-info">
      <h3>{{ product.name }}</h3>
      <p class="price">💰 {{ formattedPrice }} 萬/月</p>
      <button @click.stop="handleFavoriteClick" :class="{ favorited: isFavorited }">
        {{ isFavorited ? '❤️' : '🤍' }}
      </button>
    </div>
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

const formattedPrice = computed(() => {
  const price = props.product.price ?? 0;
  const priceInTenThousand = price / 10000;
  return priceInTenThousand.toFixed(1) ?? '0.0'; // 保留一位小數
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
  display: flex;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  width: 100%; /* 佔滿父容器寬度 */
  background-color: #fff;
  transition: box-shadow 0.2s;
}
.product-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.card-image {
  flex-shrink: 0;
  width: 150px;
  height: 120px;
}
.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-info {
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 0.5rem;
}
.card-info h3 {
  margin: 0;
  font-size: 1.2rem;
  line-height: 1.4;
}
.card-info .price {
  font-weight: bold;
  color: #e67e22;
  margin: 0;
}
button {
  align-self: flex-start;
  padding: 5px 12px;
  border: 1px solid #ccc;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
  margin-top: 0.25rem;
}
button.favorited {
  background-color: #ffcccc;
  border-color: #ff0000;
  color: #c00;
}
</style>