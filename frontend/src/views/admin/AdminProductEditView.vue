<template>
  <form @submit.prevent="handleSubmit">
    <label>商品名稱</label>
    <input v-model="form.name" required />
    <label>描述</label>
    <textarea v-model="form.description"></textarea>
    <label>價格</label>
    <input v-model="form.price" type="number" required />
    <button type="submit" :disabled="loading">儲存</button>
    <button type="button" @click="cancel">取消</button>
  </form>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAdminStore, api } from '@/store/adminStore';

const route = useRoute();
const router = useRouter();
const adminStore = useAdminStore();
const loading = ref(false);

const form = ref({ name: '', description: '', price: 0 });

const fetchProduct = async () => {
  // 從 store 或 API 取得商品資料填入表單
  let product = adminStore.products.find(p => p.id === (route.params.id));
  if (product) {
    form.value = { ...product };
  } else {
    // 可呼叫單筆 API 取得
    try{
      const { data } = await api.get(`/admin/products/${route.params.id}`);
      if (data.success) {
        form.value = data.data;
      } else {
        alert('商品不存在')
        router.push('/admin/products');
      }
    } catch (error) {
      console.error('取得商品失敗', error);
      alert('無法載入商品資料')
      router.push('/admin/products');
    }
  }
};

onMounted(() =>{
  fetchProduct();
});

const handleSubmit = async () => {
  loading.value = true;
  try {
    await adminStore.updateProduct(route.params.id, form.value);
    alert('更新成功');
    router.push(`/admin/products/${route.params.id}`);
  } catch (error) {
    alert('更新失敗');
  } finally {
    loading.value = false;
  }
};

const cancel = () => {
  router.push(`/admin/products/${route.params.id}`);
};
</script>