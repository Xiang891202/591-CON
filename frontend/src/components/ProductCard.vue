<template>
  <div class="product-card">
    <img :src="product.image" :alt="product.name" />
    <h3>{{ product.name }}</h3>
    <p>💰 {{ product.price }} 萬/月</p>
    <!-- 收藏按鈕先隱藏，待後端實作後再啟用 -->
    <button @click="handleFavoriteClick" :class="{ favorited: isFavorited }">
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
const isFavorited = computed(() => productStore.isFavorited(props.product._id));

const handleFavoriteClick = async () => {
  if (!authStore.isLoggedIn) {
    router.push('/auth');
    return;
  }
  await productStore.toggleFavorite(props.product._id);
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