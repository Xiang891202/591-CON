<!-- 放收藏列表的 -->

<template>
  <div class="favorites">
    <h1>我的收藏</h1>
    <button @click="goBack" class="back-btn">← 返回房屋列表</button>
    <!-- 顯示收藏列表 -->
    <div v-if="productStore.favorites.length > 0" class="favorites-list">
      <ProductCard
        v-for="item in productStore.favorites"
        :key="item.product?._id || item._id"
        :product="item.product || item"
      />
    </div>
    <div v-else class="empty-message">
      <p>目前尚未收藏任何房屋</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useProductStore } from '../store/productStore';
import ProductCard from '../components/ProductCard.vue';
import { useRouter } from 'vue-router';

const productStore = useProductStore();
const router = useRouter();

const goBack = () => {
  router.push('/');
};

onMounted(async () => {
  // ⭐ 你需要自行實作：確保進入此頁面時已載入收藏列表
  // 可能已經在 store 中有資料，但若沒有可重新呼叫 fetchFavorites
  if (productStore.favorites.length === 0) {
    await productStore.fetchFavorites();
  }
});
</script>

<style scoped>
.favorites {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
.favorites-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
}
.empty-message {
  text-align: center;
  margin-top: 50px;
  color: #666;
}

.back-btn {
  margin-bottom: 20px;
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.back-btn:hover {
  background-color: #2c8e6b;
}
</style>