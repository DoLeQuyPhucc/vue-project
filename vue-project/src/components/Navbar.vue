<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 flex flex-wrap items-center justify-between px-6 py-4 transition-all duration-300"
    :class="scrolled ? 'bg-zinc-900/95 shadow-md' : 'bg-transparent'"
  >
    <div class="text-2xl font-bold text-red-600">
      <router-link to="/">🎬 MovieHub</router-link>
    </div>

    <nav class="flex gap-6 mt-4 md:mt-0">
      <router-link to="/" class="text-white hover:text-red-500">Home</router-link>
      <router-link to="/search" class="text-white hover:text-red-500">Search</router-link>
      <router-link v-if="auth.isLoggedIn" to="/watchlist" class="text-white hover:text-red-500"
        >Watchlist</router-link
      >
    </nav>

    <div class="flex items-center gap-4 mt-4 md:mt-0">
      <template v-if="auth.isLoggedIn">
        <span class="text-sm text-zinc-300">👤 {{ auth.user.email }}</span>
        <button
          class="border border-red-600 text-white px-3 py-1 rounded hover:bg-red-600 transition"
          @click="logout"
        >
          Logout
        </button>
      </template>
      <template v-else>
        <router-link to="/login" class="text-white hover:text-red-500">Login</router-link>
      </template>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/useAuthStore'
import { useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'

const auth = useAuthStore()
const router = useRouter()
const scrolled = ref(false)

const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const logout = () => {
  auth.logout()
  router.push('/')
}
</script>
