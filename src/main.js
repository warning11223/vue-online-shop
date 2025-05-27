import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import { createRouter, createWebHistory } from 'vue-router'
import Main from '@/pages/Main.vue'
import Favorites from '@/pages/Favorites.vue'

const routes = [
  { path: '/', name: 'Main', component: Main },
  { path: '/favorites', name: 'Favorites', component: Favorites }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

createApp(App).use(autoAnimatePlugin).use(router).mount('#app')
