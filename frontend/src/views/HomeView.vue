<template>
  <div>
    <h1>🏠 首頁 - 房源列表</h1>
    <FilterBar @filter="handleFilter" />
    <div class="product-list">
      <ProductCard
        v-for="product in productStore.products"
        :key="product._id"
        :product="product"
      />
    </div>
  </div>

  <!-- 分頁控制項 -->
    <div class="pagination" v-if="productStore.totalPages > 1">
      <button 
        @click="productStore.goToPage(productStore.currentPage - 1)"
        :disabled="productStore.currentPage === 1"
      >
        上一頁
      </button>
      <span>第 {{ productStore.currentPage }} / {{ productStore.totalPages }} 頁</span>
      <button 
        @click="productStore.goToPage(productStore.currentPage + 1)"
        :disabled="productStore.currentPage === productStore.totalPages"
      >
        下一頁
      </button>
      <select v-model="perPage" @change="changePerPage">
        <option :value="10">10 筆/頁</option>
        <option :value="20">20 筆/頁</option>
        <option :value="50">50 筆/頁</option>
      </select>
    </div>

</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useProductStore } from '@/store/productStore'
import FilterBar from '../components/FilterBar.vue'
import ProductCard from '../components/ProductCard.vue'
import { useAuthStore } from '@/store/authStore'

const productStore = useProductStore()
const authStore = useAuthStore()
const perPage = ref(productStore.perPage);

//測試用
// onMounted(() => {
//   初次載入不帶篩選條件，取得全部 
//   productStore.fetchProducts()
// })

// 監聽頁碼變化，滾動至頂部
watch(() => productStore.currentPage, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 當前每頁筆數（雙向綁定）
// const perPage = ref(productStore.perPage);

onMounted(async () => {
  await productStore.fetchProducts({ page: 1, limit: perPage.value });
  if (authStore.isLoggedIn) {
    await productStore.fetchFavorites();
  }
});

//篩選事件(重置第一頁)
const handleFilter = (filters) => {
  // 將篩選條件傳給 store，由 store 呼叫 API 取得新資料
  productStore.fetchProducts({ ...filters, page: 1, limit: perPage.value })
  .then(() => window.scrollTo({ top: 0, behavior: 'smooth' })); // 篩選後也滾動
}

// 切換每頁筆數
const changePerPage = () => {
  productStore.setPerPage(perPage.value);
};
</script>

<style scoped>
.product-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 30px;
}
.pagination button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}
.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.pagination select {
  padding: 8px;
  border-radius: 4px;
}
</style>