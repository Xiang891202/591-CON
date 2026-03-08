import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MapView from '../views/MapView.vue'
import AuthView from '../views/AuthView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/map', name: 'map', component: MapView },
  { path: '/auth', name: 'auth', component: AuthView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router