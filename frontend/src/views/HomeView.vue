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
</template>

<script setup>
import { onMounted } from 'vue'
import { useProductStore } from '../store/productStore'
import FilterBar from '../components/FilterBar.vue'
import ProductCard from '../components/ProductCard.vue'

const productStore = useProductStore()

onMounted(() => {
  // 初次載入不帶篩選條件，取得全部
  productStore.fetchProducts()
})

const handleFilter = (filters) => {
  // 將篩選條件傳給 store，由 store 呼叫 API 取得新資料
  productStore.fetchProducts(filters)
}
</script>

<style scoped>
.product-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
}
</style>