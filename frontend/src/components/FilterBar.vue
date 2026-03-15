<template>
  <div class="filter-bar">
    <!-- 關鍵字搜尋 -->
    <input
      type="text"
      v-model="filters.keyword"
      placeholder="搜尋房源名稱..."
      @input="emitFilter"
    />

    <!-- 類別篩選 -->
  <select v-model="filters.category" @change="emitFilter">
    <option value="">所有類別</option>
    <option value="apartment">公寓</option>
    <option value="house">透天厝</option>
    <option value="condo">電梯大樓</option>
    <option value="studio">套房</option>
    <option value="office">辦公室</option>
  </select>

    <!-- 價格範圍 -->
    <input
      type="number"
      v-model.number="filters.minPrice"
      placeholder="最低價格"
      @input="emitFilter"
    />
    <span> - </span>
    <input
      type="number"
      v-model.number="filters.maxPrice"
      placeholder="最高價格"
      @input="emitFilter"
    />

    <!-- 排序 -->
    <select v-model="filters.sort" @change="emitFilter">
      <option value="">預設排序</option>
      <option value="price">價格低到高</option>
      <option value="-price">價格高到低</option>
      <option value="-createdAt">最新上架</option>
    </select>

    <!-- 新增：我的收藏按鈕 -->
    <button @click="goToFavorites" class="favorites-btn">
      ❤️ 我的收藏
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/authStore';

// 定義篩選條件的響應式物件
const filters = ref({
  keyword: '',
  category: '',
  minPrice: '',
  maxPrice: '',
  sort: '',
});

const emit = defineEmits(['filter']);  // 發送的事件名稱

// 當任何篩選條件改變時，將整個 filters 物件發送給父層
const emitFilter = () => {
  emit('filter', { ...filters.value });
};

const router = useRouter();
const authStore = useAuthStore();

const goToFavorites = () => {
  if (authStore.isLoggedIn) {
    router.push({ name: 'favorites' });
  } else {
    // alert('請先登入才能查看收藏列表');    
    // ⭐ 你需要自行決定 redirect 參數，這裡傳入 'favorites' 或完整路徑
    router.push({ name: 'auth', query: { redirect: router.currentRoute.value.fullPath } });
  }
};

</script>

<style scoped>
.filter-bar {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 8px;
}

.filter-bar input,
.filter-bar select,
.filter-bar button {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.filter-bar button {
  background-color: #ff69b4;
  color: white;
  cursor: pointer;
  border: none;
}
.filter-bar button:hover {
  background-color: #ff1493;
}
</style>