<template>
  <div class="filter-bar">
    <input
      type="text"
      placeholder="搜尋房源名稱..."
      v-model="keyword"
      @input="emitFilter"
    />
    <select v-model="category" @change="emitFilter">
      <option value="">所有類別</option>
      <option value="house">房屋</option>
      <option value="apartment">公寓</option>
    </select>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const keyword = ref('')
const category = ref('')

const emit = defineEmits(['filter'])

const emitFilter = () => {
  emit('filter', { keyword: keyword.value, category: category.value })
}
</script>

<style scoped>
.filter-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.filter-bar input,
.filter-bar select {
  padding: 8px;
  font-size: 16px;
}
</style>