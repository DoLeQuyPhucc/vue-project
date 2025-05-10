import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayouts.vue'),
    children: [
      { path: '', name: 'home', component: () => import('@/views/HomeView.vue') },
      {
        path: 'movie/:id',
        name: 'movie-detail',
        component: () => import('@/views/MovieDetailView.vue'),
      },
      { path: 'search', name: 'search', component: () => import('@/views/SearchView.vue') },
      {
        path: 'watchlist',
        name: 'watchlist',
        component: () => import('@/views/WatchlistView.vue'),
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
        component: () => import('@/views/LoginView.vue'),
        meta: { requiresGuest: true },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    next('/login')
  } else if (to.meta.requiresGuest && auth.isLoggedIn) {
    next('/')
  } else {
    next()
  }
})

export default router
