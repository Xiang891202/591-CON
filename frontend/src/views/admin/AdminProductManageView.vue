<!-- 管理員商品列表 -->

<template>
  <div class="admin-product-manage">
    <h1>商品管理</h1>
    <!-- 篩選器元件（重用） -->
    <FilterBar @filter="handleFilter" />

    <!-- 商品卡片列表 -->
    <div v-if="adminStore.loading">載入中...</div>
    <div v-else class="product-grid">
      <ProductCard
        v-for="product in filteredProducts"
        :key="product._id"
        :product="product"
        @click="goToDetail(product._id)"
      />
    </div>

    <!-- 新增商品按鈕（可留待後續實作） -->
    <button @click="goToCreate">+ 新增商品</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAdminStore } from '@/store/adminStore';
import FilterBar from '@/components/FilterBar.vue';
import ProductCard from '@/components/ProductCard.vue';

const router = useRouter();
const adminStore = useAdminStore();

const filter = ref({});
const filteredProducts = computed(() => {
  // 根據 filter 過濾 adminStore.products
  // 簡單範例：若無篩選條件則回傳全部
  let result = adminStore.products; // 宣告 result 並初始化
  if (filter.value.minPrice) {
    result = result.filter(p => p.price >= filter.value.minPrice);
  }
  if (filter.value.maxPrice) {
    result = result.filter(p => p.price <= filter.value.maxPrice);
  }
  if (filter.value.category) {
    result = result.filter(p => p.category === filter.value.category);
  }
  return result;
});

const handleFilter = (newFilter) => {
  filter.value = newFilter;
};

const goToDetail = (id) => {
  router.push(`/admin/products/${id}`);
};

const goToCreate = () => {
  // 可導向新增頁面，目前尚未實作
  alert('新增商品功能開發中');
};

onMounted(() => {
  adminStore.fetchAllProducts();
});
</script>

<style scoped>
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}
</style>