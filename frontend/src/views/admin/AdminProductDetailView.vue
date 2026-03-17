<!-- 管理員商品詳細頁 -->

<template>
  <div class="admin-product-detail">
    <div v-if="loading">載入中...</div>
    <div v-else-if="product">
      <h2>{{ product.name }}</h2>
      <p>{{ product.description }}</p>
      <p>價格：{{ product.price }}</p>
      <!-- 其他詳細資訊 -->

      <div class="actions">
        <button @click="editProduct">編輯商品</button>
        <button @click="deleteProduct" class="delete">刪除商品</button>
      </div>
    </div>
    <div v-else>商品不存在</div>

    <!-- 可考慮使用對話框編輯，或導向編輯頁面 -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAdminStore, api } from '@/store/adminStore';

const route = useRoute();
const router = useRouter();
const adminStore = useAdminStore();

const product = ref(null);
const loading = ref(false);

const fetchProduct = async () => {
  loading.value = true;
  try {
    // 直接從 store 的 products 中找，或呼叫 API 取得單一商品
    // let found = adminStore.products.find(p => p.id === Number(route.params.id));
    const found = adminStore.products.find(p => p._id === (route.params.id));
    if (found) {
      product.value = found;
    } else {
      // 若 store 中沒有，可呼叫 API 單筆查詢
      const { data } = await api.get(`/admin/products/${route.params.id}`);
      if(data.success) product.value = data.data;
      // 但後端可能尚未提供 /admin/products/:id，這裡先假設 store 已包含所有商品
    }
  } catch (error) {
    console.log(product.value = null)
    console.error('取得商品失敗', error);
  } finally {
    loading.value = false;
  }
};

const editProduct = () => {
  router.push(`/admin/products/${route.params.id}/edit`);
};

const deleteProduct = async () => {
  if (!confirm('確定刪除此商品？')) return;
  try {
    await adminStore.deleteProduct(route.params.id);
    alert('刪除成功');
    router.push('/admin/products');
  } catch (error) {
    alert('刪除失敗');
  }
};

onMounted(() => {
  // 若 store 尚未載入商品，先載入
  if (adminStore.products.length === 0) {
    adminStore.fetchAllProducts().then(() => fetchProduct());
  } else {
    fetchProduct();
  }
});
</script>

<style scoped>
.actions button {
  margin-right: 1rem;
}
.delete {
  background-color: #f44336;
  color: white;
}
</style>