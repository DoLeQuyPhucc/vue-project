<template>
  <div class="watchlist-container container">
    <h1 class="page-title">Latest Movies</h1>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading movies...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button class="retry-button" @click="fetchMovies">Try Again</button>
    </div>

    <template v-else>
      <div class="movie-grid responsive-grid">
        <MovieCard v-for="movie in movies" :key="movie._id" :movie="movie" />
      </div>

      <Pagination
        v-if="pagination.totalPages > 0"
        :current-page="pagination.currentPage"
        :total-pages="pagination.totalPages"
        :pages="paginationData.pages"
        @page-change="handlePageChange"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import MovieCard from '@/components/MovieCard.vue'
import Pagination from '@/components/Pagination.vue'
import movieService from '@/services/movieService'
import type { Movie, PaginationData } from '@/services/movieService'
import { usePagination } from '@/composables/usePagination'

const movies = ref<Movie[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const pagination = ref<PaginationData>({
  totalItems: 0,
  totalItemsPerPage: 0,
  currentPage: 1,
  totalPages: 0,
  updateToday: 0,
})

// Initialize pagination with default values
const paginationData = computed(() => {
  return usePagination(pagination.value.totalPages, {
    initialPage: pagination.value.currentPage,
    maxVisiblePages: 5,
  })
})

const fetchMovies = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await movieService.getLatestMovies(pagination.value.currentPage)
    movies.value = response.items
    pagination.value = response.pagination
  } catch (err) {
    error.value = 'Failed to load movies. Please try again.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number) => {
  pagination.value.currentPage = page
  scrollToTop()
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

// Fetch movies when component is mounted
onMounted(fetchMovies)

// Watch for page changes to refetch data
watch(() => pagination.value.currentPage, fetchMovies)
</script>

<style scoped>
.watchlist-container {
  padding-top: var(--space-lg);
  padding-bottom: var(--space-xxl);
}

.page-title {
  font-size: var(--font-size-xl);
  margin-bottom: var(--space-lg);
  color: var(--color-text);
  text-align: center;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-xl) 0;
  color: var(--color-text);
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top-color: var(--color-primary);
  animation: spin 1s linear infinite;
  margin-bottom: var(--space-md);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.retry-button {
  margin-top: var(--space-md);
  padding: var(--space-sm) var(--space-md);
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.retry-button:hover {
  background-color: #c00812;
}

.movie-grid {
  margin-bottom: var(--space-xl);
}

@media (max-width: 576px) {
  .page-title {
    font-size: var(--font-size-lg);
    margin-bottom: var(--space-md);
  }
}
</style>
