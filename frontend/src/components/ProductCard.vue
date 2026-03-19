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

<style lang="scss" src="@/styles/components/ProductCard.scss" scoped></style>