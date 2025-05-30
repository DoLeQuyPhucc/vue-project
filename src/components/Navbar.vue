<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 flex flex-col md:flex-row items-center px-8 md:px-6 py-3 transition-all duration-300"
    :class="scrolled ? 'bg-zinc-900/95 shadow-md' : 'bg-gradient-to-b from-black/80 to-transparent'"
  >
    <!-- Logo and search container (full width on mobile, flex on desktop) -->
    <div class="flex w-full md:w-auto items-center justify-between md:justify-start mb-4 md:mb-0">
      <!-- Logo (smaller on mobile) -->
      <router-link to="/" class="flex-shrink-0 md:mr-8">
        <img :src="logoImage" alt="LOPHIM" class="h-8 md:h-12" />
      </router-link>

      <!-- Mobile menu toggle button -->
      <button
        @click="mobileMenuOpen = !mobileMenuOpen"
        class="md:hidden flex items-center justify-center w-10 h-10 text-white hover:text-red-500"
      >
        <font-awesome-icon :icon="mobileMenuOpen ? 'times' : 'bars'" />
      </button>
    </div>

    <!-- Search bar (full width on mobile) -->
    <div class="relative w-full md:w-auto md:mr-6 mb-4 md:mb-0">
      <input
        type="text"
        placeholder="Tìm kiếm phim, diễn viên"
        class="w-full md:w-64 bg-zinc-800/80 text-white border border-zinc-700 rounded-full px-8 py-2 pl-11 focus:outline-none focus:border-red-500"
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

    <!-- Navigation links -->
    <div
      class="w-full md:flex-1 flex flex-col md:flex-row md:items-center md:space-x-6 space-y-3 md:space-y-0 overflow-hidden transition-all duration-300"
      :class="
        mobileMenuOpen
          ? 'max-h-screen opacity-100'
          : 'max-h-0 md:max-h-screen opacity-0 md:opacity-100'
      "
    >
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
        <!-- Dropdown content could go here -->
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
        <!-- Dropdown content could go here -->
      </div>

      <router-link to="/dien-vien" class="text-white hover:text-red-500 font-medium"
        >Diễn Viên</router-link
      >
      <router-link to="/lich-chieu" class="text-white hover:text-red-500 font-medium"
        >Lịch chiếu</router-link
      >
    </div>

    <!-- Auth buttons section has been removed -->
  </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/useAuthStore'
import { useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import logoImage from '@/assets/logo.png'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Add icons to the library
library.add(faBars, faTimes)

const auth = useAuthStore()
const router = useRouter()
const scrolled = ref(false)
const mobileMenuOpen = ref(false)

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
