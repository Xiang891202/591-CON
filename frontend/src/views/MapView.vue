<template>
  <div class="map-view">
    <h1>🗺️ 地圖找房</h1>
    <div class="content">
      <div class="left-panel">
        <ProductCard
          v-for="product in productStore.mapProducts"
          :key="product._id"
          :product="product"
          :class="{ 'active': product._id === productStore.activeProductId }"
          :id="'product-' + product._id"
          @click="scrollToProduct(product._id)"
        />
        <div v-if="productStore.mapProducts.length === 0" class="no-data">
          目前此區域尚無物件
        </div>
      </div>
      <div class="right-panel">
        <Map />
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue';
import { useProductStore } from '@/store/productStore';
import Map from '@/components/Map.vue';
import ProductCard from '@/components/ProductCard.vue';

const productStore = useProductStore();

// 當 activeProductId 改變時，滾動到對應商品
watch(() => productStore.activeProductId, (newId) => {
  if (!newId) return;
  const element = document.getElementById(`product-${newId}`);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});

// 點擊商品卡片時，設定 activeProductId（但不要重複觸發滾動，因為 watch 已處理）
function scrollToProduct(productId) {
  productStore.setActiveProductId(productId);
}
</script>

<style lang="scss" src="@/styles/components/MapView.scss" scoped></style>