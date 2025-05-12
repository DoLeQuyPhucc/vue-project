<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 flex items-center px-6 py-3 transition-all duration-300"
    :class="scrolled ? 'bg-zinc-900/95 shadow-md' : 'bg-gradient-to-b from-black/80 to-transparent'"
  >
    <div class="flex items-center mr-6">
      <router-link to="/" class="flex-shrink-0 mr-8">
        <img :src="logoImage" alt="LOPHIM" class="h-12" />
      </router-link>

      <div class="relative">
        <input
          type="text"
          placeholder="Tìm kiếm phim, diễn viên"
          class="bg-zinc-800/80 text-white border border-zinc-700 rounded-full px-4 py-2 pl-11 w-64 focus:outline-none focus:border-red-500"
        />
        <div
          class="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 pointer-events-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
      </div>
    </div>

    <div class="flex items-center space-x-6 flex-1">
      <router-link to="/" class="text-white hover:text-red-500 font-medium">Chủ Đề</router-link>

      <div class="relative group">
        <div class="flex items-center text-white hover:text-red-500 font-medium cursor-pointer">
          Thể loại
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
      </div>

      <router-link to="/phim-le" class="text-white hover:text-red-500 font-medium"
        >Phim Lẻ</router-link
      >
      <router-link to="/phim-bo" class="text-white hover:text-red-500 font-medium"
        >Phim Bộ</router-link
      >

      <div class="relative group">
        <div class="flex items-center text-white hover:text-red-500 font-medium cursor-pointer">
          Quốc gia
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
      </div>

      <router-link to="/dien-vien" class="text-white hover:text-red-500 font-medium"
        >Diễn Viên</router-link
      >
      <router-link to="/lich-chieu" class="text-white hover:text-red-500 font-medium"
        >Lịch chiếu</router-link
      >
    </div>

    <div class="flex items-center gap-4">
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
import logoImage from '@/assets/logoBase.jpg'

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
