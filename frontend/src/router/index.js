// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import MapView from '../views/MapView.vue';
import AuthView from '../views/AuthView.vue';
import ProfileView from '../views/ProfileView.vue';
import ProfileEditView from '@/views/ProfileEditView.vue';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/map', name: 'MapView', component: () => import('../views/MapView.vue') },
  { path: '/auth', name: 'auth', component: AuthView },
  // ⚠️ 若有需要登入才能訪問的頁面，可在此加入 meta: { requiresAuth: true }
  { path: '/profile', name: 'profile', component: () => import('../views/ProfileView.vue'), meta: { requiresAuth: true } },
  { path: '/profile/edit', name: 'profileEdit', component: ProfileEditView, meta: { requiresAuth: true } },
  // 加入以下路由
  { path: '/favorites', name: 'favorites', component: () => import('../views/FavoritesView.vue'), meta: { requiresAuth: true } },
  { path: '/product/:id', name: 'productDetail', component: () => import('@/views/ProductDetailView.vue'), props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ⚠️ 你需要自行實作路由守衛（例如檢查登入狀態）
// router.beforeEach((to, from, next) => { ... });
// 路由守衛：檢查目標路由是否需要登入
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const token = localStorage.getItem('token'); // 從 localStorage 取得 token

  if (requiresAuth && !token) {
    // 未登入且需要權限，導向登入頁
    next({ name: 'auth', query: { redirect: to.fullPath } }); // 可選：將原本想訪問的路由作為參數傳遞
  } else {
    // 其他情況正常前往
    next();
  }
});

export default router;