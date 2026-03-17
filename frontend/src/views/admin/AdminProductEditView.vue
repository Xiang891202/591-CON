<template>
  <ProductForm
    :initial-data="product"
    is-edit
    @submit="handleUpdate"
    @cancel="goBack"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAdminStore, api } from '@/store/adminStore';
import ProductForm from '@/components/ProductForm.vue';

const route = useRoute();
const router = useRouter();
const adminStore = useAdminStore();

const product = ref({});

const fetchProduct = async () => {
  const id = route.params.id;
  try {
    let found = adminStore.products.find(p => p._id === id);
    if (found) {
      product.value = found;
    } else {
      const { data } = await api.get(`/admin/products/${id}`);
      if (data.success) product.value = data.data;
    }
  } catch (error) {
    alert('無法載入商品資料');
    router.push('/admin/products');
  }
};

onMounted(fetchProduct);

const handleUpdate = async (formData) => {
  await adminStore.updateProduct(route.params.id, formData);
  router.push(`/admin/products/${route.params.id}`);
};

const goBack = () => {
  router.push(`/admin/products/${route.params.id}`);
};
</script>