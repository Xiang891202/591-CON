<template>
  <ProductForm @submit="handleCreate" @cancel="goBack" />
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAdminStore } from '@/store/adminStore';
import ProductForm from '@/components/ProductForm.vue';

const router = useRouter();
const adminStore = useAdminStore();

const handleCreate = async (formData) => {
  await adminStore.createProduct(formData);
  router.push('/admin/products');
};

const goBack = () => {
  router.push('/admin/products');
};
</script>