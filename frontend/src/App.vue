<!-- src/App.vue -->
<template>
  <div id="app">
    <nav>
      <router-link to="/">首頁</router-link> |
      <router-link to="/map">地圖找房</router-link> |
      <!-- ⚠️ 你需要自行實作：根據登入狀態顯示使用者名稱/登出按鈕 或 登入連結 -->
      <template v-if="authStore.isLoggedIn"> <!-- 此處需改為實際登入狀態 -->
        <router-link to="/profile" class="profile-link">
          👤 {{ authStore.user?.name }}
        </router-link > |
        <button @click="handleLogout">登出</button>
      </template>
      <template v-else>
        <router-link to="/auth">登入/註冊</router-link>
      </template>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
// ⚠️ 你需要自行引入 authStore 並實作登出方法
import { useAuthStore } from './store/authStore';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const authStore = useAuthStore();
//登出函式
const router = useRouter();
const handleLogout = () => {
  authStore.logout();
  router.push('/');
};

//onMounted 取得使用者資訊
onMounted(() => {
  console.log('App mounted, token:', authStore.token);
  if (authStore.token) {
    authStore.fetchMe();
  }
});
</script>

<style scoped>
nav {
  padding: 1rem;
  background: #f0f0f0;
  margin-bottom: 20px;
}
nav a {
  margin: 0 0.5rem;
}
nav button {
  margin-left: 0.5rem;
  padding: 0.2rem 0.5rem;
  cursor: pointer;
}
.profile-link {
  font-weight: bold;
  cursor: pointer;
}
</style>