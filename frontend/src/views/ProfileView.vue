<template>
  <div class="profile">
    <h1>會員資訊</h1>
    <div v-if="authStore.user">
      <p><strong>姓名：</strong>{{ authStore.user.name }}</p>
      <p><strong>Email：</strong>{{ authStore.user.email }}</p>
      <p><strong>角色：</strong>{{ authStore.user.role || '一般會員' }}</p>
      <button @click="$router.push('/profile/edit')">編輯資料</button>
      <button @click="handleLogout" class="logout-btn">登出</button>
    </div>
    <div v-else>
      <p>載入中...</p>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push({ name: 'home' }); // 登出後回首頁
};
</script>

<style lang="scss" src="@/styles/components/ProfileView.scss" scoped></style>