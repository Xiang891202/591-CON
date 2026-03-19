<!-- 管理員商品列表 -->

<template>
  <div class="admin-product-manage">
    <h1>商品管理</h1>
    <!-- 新增商品按鈕（可留待後續實作） -->
    <button @click="goToCreate">+ 新增商品</button>
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
  let result = adminStore.products;

  // 关键字搜索
  if (filter.value.keyword) {
    const keyword = filter.value.keyword.toLowerCase();
    result = result.filter(p => p.name.toLowerCase().includes(keyword));
  }

  // 价格范围过滤（修复）
  if (filter.value.minPrice !== '' && !isNaN(filter.value.minPrice)) {
    result = result.filter(p => p.price >= Number(filter.value.minPrice));
  }
  if (filter.value.maxPrice !== '' && !isNaN(filter.value.maxPrice)) {
    result = result.filter(p => p.price <= Number(filter.value.maxPrice));
  }

  // 类别过滤
  if (filter.value.category) {
    result = result.filter(p => p.category === filter.value.category);
  }

  // 排序
  if (filter.value.sort) {
    result = [...result];
    switch (filter.value.sort) {
      case 'price':
        result.sort((a, b) => a.price - b.price);
        break;
      case '-price':
        result.sort((a, b) => b.price - a.price);
        break;
      case '-createdAt':
        result.sort((a, b) => getTimestampFromId(b._id) - getTimestampFromId(a._id));
        break;
    }
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
  router.push('/admin/products/create')
};

const getTimestampFromId = (id) => new Date(parseInt(id.substring(0, 8), 16) * 1000);
// 排序时：result.sort((a, b) => getTimestampFromId(b._id) - getTimestampFromId(a._id));

onMounted(() => {
  adminStore.fetchAllProducts();
});
</script>

<style lang="scss" src="@/styles/components/AdminProductManageView.scss" scoped></style>