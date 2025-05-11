import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('@/views/Home.vue') },
      { path: 'search', name: 'search', component: () => import('@/views/Search.vue') },
      {
        path: 'movie/:id',
        name: 'movie-detail',
        component: () => import('@/views/MovieDetail.vue'),
      },
      {
        path: 'watchlist',
        name: 'watchlist',
        component: () => import('@/views/Watchlist.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/Login.vue'),
        meta: { requiresGuest: true },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) next('/login')
  else if (to.meta.requiresGuest && auth.isLoggedIn) next('/')
  else next()
})

export default router
