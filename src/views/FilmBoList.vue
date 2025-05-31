<template>
  <div class="min-h-screen bg-gradient-to-b from-zinc-900 to-black pt-20">
    <div class="container mx-auto max-w-7xl px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-white mb-4">{{ pageTitle }}</h1>
        <nav class="text-sm breadcrumbs">
          <ol class="flex items-center space-x-2 text-zinc-400">
            <li><router-link to="/" class="hover:text-white">Trang chủ</router-link></li>
            <li><span class="mx-2">/</span></li>
            <li class="text-white">{{ pageTitle }}</li>
          </ol>
        </nav>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center h-[50vh]">
        <div class="text-center">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"
          ></div>
          <p class="text-white">Đang tải danh sách phim...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex items-center justify-center h-[50vh]">
        <div class="text-center">
          <p class="text-red-400 text-lg mb-4">{{ error }}</p>
          <button
            @click="fetchMovies"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>

      <!-- Movies Grid -->
      <div v-else-if="movies.length > 0">
        <MovieGrid :movies="movies" :cdn-url="cdnUrl" />

        <!-- Pagination -->
        <Pagination
          :current-page="currentPage"
          :total-pages="totalPages"
          :total-items="totalItems"
          @page-change="handlePageChange"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="flex items-center justify-center h-[50vh]">
        <div class="text-center">
          <p class="text-zinc-400 text-lg">Không tìm thấy phim nào.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MovieGrid from '@/components/MovieGrid.vue'
import Pagination from '@/components/Pagination.vue'
import { getFilmBoList } from '@/services/movieService'

const route = useRoute()
const router = useRouter()

const movies = ref([])
const loading = ref(true)
const error = ref(null)
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)
const pageTitle = ref('Phim Bộ')
const cdnUrl = ref('https://phimimg.com')

const fetchMovies = async () => {
  try {
    loading.value = true
    error.value = null

    console.log('Fetching phim bo page:', currentPage.value)
    const response = await getFilmBoList(currentPage.value)
    console.log('API response:', response)

    if (response && response.data) {
      movies.value = response.data.items || []
      pageTitle.value = response.data.titlePage || 'Phim Bộ'
      cdnUrl.value = response.data.APP_DOMAIN_CDN_IMAGE || 'https://phimimg.com'

      if (response.data.params && response.data.params.pagination) {
        const pagination = response.data.params.pagination
        totalPages.value = pagination.totalPages
        totalItems.value = pagination.totalItems
        currentPage.value = pagination.currentPage
        console.log('Pagination info:', pagination)
      }
    } else {
      error.value = 'Không thể tải dữ liệu phim bộ'
    }
  } catch (err) {
    console.error('Error fetching movies:', err)
    error.value = 'Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.'
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page) => {
  console.log('handlePageChange called with page:', page) // Debug log
  console.log('Current page before change:', currentPage.value) // Debug log

  currentPage.value = page
  router.push({ query: { ...route.query, page } })

  // Force fetch movies immediately after page change
  fetchMovies()

  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Watch for route changes
watch(
  () => route.query.page,
  (newPage, oldPage) => {
    console.log('Route query page changed from', oldPage, 'to', newPage) // Debug log
    const page = parseInt(newPage) || 1
    if (page !== currentPage.value) {
      console.log('Page different, updating currentPage and fetching') // Debug log
      currentPage.value = page
      fetchMovies()
    }
  },
  { immediate: false }, // Don't run immediately on mount
)

onMounted(() => {
  // Get page from query params
  const page = parseInt(route.query.page) || 1
  currentPage.value = page
  fetchMovies()
})
</script>
