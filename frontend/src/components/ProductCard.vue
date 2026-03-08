<template>
  <div class="product-card">
    <img :src="product.image" :alt="product.name" />
    <h3>{{ product.name }}</h3>
    <p>💰 {{ product.price }} 萬/月</p>
    <!-- 收藏按鈕先隱藏，待後端實作後再啟用 -->
    <!-- <button @click="toggleFavorite"> ... </button> -->
  </div>
</template>

<script setup>
defineProps(['product'])
// 暫時不使用 productStore 的收藏功能
</script>