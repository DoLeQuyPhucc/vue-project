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
        path: 'movie/:slug',
        name: 'MovieDetail',
        component: () => import('@/views/MovieDetail.vue'),
      },
      {
        path: 'phim/:slug',
        name: 'movie-info',
        component: () => import('@/views/MovieDetail.vue'),
      },
      {
        path: 'xem-phim/:slug',
        name: 'movie-watch',
        component: () => import('@/views/MovieWatch.vue'),
      },
      {
        path: 'danh-sach/phim-bo',
        name: 'film-bo-list',
        component: () => import('@/views/FilmBoList.vue'),
      },
      {
        path: 'danh-sach/phim-le',
        name: 'film-le-list',
        component: () => import('@/views/FilmLeList.vue'),
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
  // Always set document title to LoPhim regardless of route
  document.title = 'LoPhim'

  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    toggleLoginModal()
  } else if (to.meta.requiresGuest && auth.isLoggedIn) next('/')
  else next()
})

export default router
function toggleLoginModal() {
  throw new Error('Function not implemented.')
}
