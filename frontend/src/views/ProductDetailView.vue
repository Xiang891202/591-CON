<template>
  <div v-if="productStore.loading">載入中...</div>
  <div v-else-if="product" class="product-detail">
    <h1>{{ product.name }}</h1>
    <img :src="product.image" :alt="product.name" />
    <p>{{ product.description }}</p>
    <p>💰 {{ product.price }} 萬/月</p>
    <button 
      @click="handleToggleFavorite" 
      :disabled="!authStore.isLoggedIn"
      :class="{ favorited: isFavorited }"
    >
      {{ isFavorited ? '❤️ 已收藏' : '🤍 加入收藏' }}
    </button>
    <p v-if="!authStore.isLoggedIn" class="login-hint">
      <router-link to="/auth">登入</router-link> 後可使用收藏功能
    </p>
  </div>
  <div v-else>商品不存在</div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductStore } from '../store/productStore';
import { useAuthStore } from '../store/authStore';

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const authStore = useAuthStore();

const product = computed(() => productStore.currentProduct);
const isFavorited = computed(() => productStore.isFavorited(product.value?._id));

const handleToggleFavorite = async () => {
  if (!authStore.isLoggedIn) {
    router.push('/auth');
    return;
  }
  const success = await productStore.toggleFavorite(product.value._id);
  if (success) {
    // 可選：顯示提示訊息
  }
};

onMounted(async () => {
  const id = route.params.id;
  await productStore.fetchProductById(id);
  // 若已登入，順便取得收藏狀態（fetchFavorites 會更新 favorites 列表）
  if (authStore.isLoggedIn) {
    await productStore.fetchFavorites();
  }
});
</script>

<style scoped>
.product-detail {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}
.product-detail img {
  max-width: 100%;
  height: auto;
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
</style>