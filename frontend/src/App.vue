<!-- src/App.vue -->
<template>
  <div id="app">
    <nav>
      <!-- 漢堡按鈕（僅在手機顯示） -->
      <button class="hamburger" @click="toggleMenu" :class="{ active: isMenuOpen }">
        <span></span>
      </button>

      <!-- 導覽連結容器 -->
      <div class="nav-links" :class="{ open: isMenuOpen }">
        <router-link to="/" @click="closeMenu">首頁</router-link>
        <router-link to="/map" @click="closeMenu">地圖找房</router-link>
        <router-link
          v-if="authStore.user?.role === 'admin'"
          to="/admin/products"
          @click="closeMenu"
        >
          商品管理
        </router-link>

        <!-- 登入/會員區塊 -->
        <template v-if="authStore.isLoggedIn">
          <router-link to="/profile" class="profile-link" @click="closeMenu">
            👤 {{ authStore.user?.name || '會員' }}
          </router-link>
          <button @click="handleLogout" class="logout-btn">登出</button>
        </template>
        <router-link v-else to="/auth" @click="closeMenu">登入/註冊</router-link>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from './store/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

// 漢堡選單狀態
const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const handleLogout = () => {
  authStore.logout();
  router.push('/');
  closeMenu();
};

onMounted(() => {
  console.log('App mounted, token:', authStore.token);
  if (authStore.token) {
    authStore.fetchMe();
  }
});
</script>

<style lang="scss" scoped>
@import '@/styles/base.scss';
@import '@/styles/rwd';

nav {
  padding: 1rem 2rem;
  background: #ffffff;
  margin-bottom: 32px;
  border-bottom: 1px solid #eef2f6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);

  @include xs-only {
    padding: 1rem;
    position: relative;
  }
}

/* 漢堡按鈕樣式 */
.hamburger {
  display: none;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  position: relative;

  span {
    display: block;
    width: 24px;
    height: 2px;
    background: #334155;
    margin: 0 auto;
    position: relative;
    transition: background 0.3s;

    &::before,
    &::after {
      content: '';
      position: absolute;
      left: 0;
      width: 100%;
      height: 2px;
      background: #334155;
      transition: transform 0.3s;
    }

    &::before {
      top: -8px;
    }

    &::after {
      bottom: -8px;
    }
  }

  &.active {
    span {
      background: transparent;

      &::before {
        transform: rotate(45deg);
        top: 0;
      }

      &::after {
        transform: rotate(-45deg);
        bottom: 0;
      }
    }
  }

  @include xs-only {
    display: block;
  }
}

/* 導覽連結容器 */
.nav-links {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;

  @include xs-only {
    display: none;
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
    padding-top: 1rem;

    &.open {
      display: flex;
    }

    a,
    button {
      width: 100%;
      text-align: center;
      padding: 0.75rem 1rem;
      margin: 0;
    }
  }
}

nav a {
  text-decoration: none;
  color: #334155;
  font-weight: 500;
  font-size: 1.05rem;
  padding: 6px 12px;
  border-radius: 40px;
  transition: all 0.2s;

  @include xs-only {
    font-size: 1rem;
  }

  &:hover {
    background-color: #f1f5f9;
    color: #0f172a;
  }

  &.router-link-active {
    color: #42b983;
    font-weight: 600;
  }
}

nav button {
  padding: 8px 24px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 40px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.2s;
  color: #334155;

  &:hover {
    background-color: #fee2e2;
    border-color: #f87171;
    color: #b91c1c;
  }

  @include xs-only {
    width: 100%;
    padding: 0.75rem 1rem;
  }
}

.profile-link {
  font-weight: 600;
  background-color: #f0f9ff;
  padding: 6px 16px;
  border-radius: 40px;
  color: #0369a1 !important;

  &:hover {
    background-color: #e0f2fe;
  }
}
</style>