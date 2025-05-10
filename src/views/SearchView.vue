<template>
  <div class="search-view container">
    <h1 class="page-title" v-if="searchQuery">Search Results for "{{ searchQuery }}"</h1>
    <h1 class="page-title" v-else>Search for Movies</h1>

    <div class="search-form" v-if="!searchQuery">
      <input
        type="text"
        v-model="inputQuery"
        class="search-input"
        placeholder="Enter movie title, actor, or genre..."
        @keyup.enter="performSearch"
      />
      <button class="search-button" @click="performSearch">Search</button>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Searching movies...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button class="retry-button" @click="performSearch">Try Again</button>
    </div>

    <div v-else-if="searchQuery && movies.length === 0" class="no-results">
      <p>No movies found for "{{ searchQuery }}".</p>
      <p>Try a different search term or browse our categories.</p>
    </div>

    <div v-else-if="searchQuery && movies.length > 0" class="search-results">
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
    </div>

    <div v-else class="search-suggestions">
      <h2 class="section-title">Popular Searches</h2>
      <div class="suggestion-tags">
        <button
          v-for="(tag, index) in popularSearches"
          :key="index"
          class="suggestion-tag"
          @click="selectSuggestion(tag)"
        >
          {{ tag }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MovieCard from '@/components/MovieCard.vue'
import Pagination from '@/components/Pagination.vue'
import movieService from '@/services/movieService'
import type { Movie, PaginationData } from '@/services/movieService'
import { usePagination } from '@/composables/usePagination'

const route = useRoute()
const router = useRouter()

const movies = ref<Movie[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')
const inputQuery = ref('')
const popularSearches = ref([
  'Action',
  'Comedy',
  'Drama',
  'Horror',
  'Romance',
  'Science Fiction',
  'Thriller',
  'Animation',
  'Fantasy',
  'Documentary',
  'Mystery',
  'Crime',
])

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

// Handle URL query changes
watch(
  () => route.query.q,
  (newQuery) => {
    const query = (newQuery as string) || ''
    searchQuery.value = query
    inputQuery.value = query

    if (query) {
      fetchSearchResults()
    } else {
      movies.value = []
    }
  },
  { immediate: true },
)

// Handle page change in URL
watch(
  () => route.query.page,
  (newPage) => {
    const page = Number(newPage) || 1
    if (page !== pagination.value.currentPage) {
      pagination.value.currentPage = page
      if (searchQuery.value) {
        fetchSearchResults()
      }
    }
  },
  { immediate: true },
)

const performSearch = () => {
  if (inputQuery.value.trim()) {
    router.push({
      path: '/search',
      query: {
        q: inputQuery.value.trim(),
        page: 1,
      },
    })
  }
}

const selectSuggestion = (tag: string) => {
  inputQuery.value = tag
  performSearch()
}

const fetchSearchResults = async () => {
  if (!searchQuery.value) return

  loading.value = true
  error.value = null

  try {
    // In a real app, we would call a search API endpoint
    // For now, we'll simulate results from the latest movies
    const response = await movieService.getLatestMovies(pagination.value.currentPage)

    // Filter movies (simulating a search)
    const query = searchQuery.value.toLowerCase()
    const filteredMovies = response.items.filter(
      (movie) =>
        movie.name.toLowerCase().includes(query) ||
        movie.origin_name.toLowerCase().includes(query) ||
        movie.category.some((cat) => cat.name.toLowerCase().includes(query)),
    )

    movies.value = filteredMovies
    pagination.value = {
      ...response.pagination,
      totalItems: filteredMovies.length * 5, // Simulating more pages
      totalPages: Math.max(
        1,
        Math.ceil((filteredMovies.length * 5) / response.pagination.totalItemsPerPage),
      ),
    }
  } catch (err) {
    error.value = 'Failed to search movies. Please try again.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page: number) => {
  router.push({
    path: '/search',
    query: {
      q: searchQuery.value,
      page,
    },
  })

  scrollToTop()
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

onMounted(() => {
  // If we have a query in the URL but not in our state, set it
  if (route.query.q && !searchQuery.value) {
    searchQuery.value = route.query.q as string
    inputQuery.value = searchQuery.value
    fetchSearchResults()
  }
})
</script>

<style scoped>
.search-view {
  padding-top: var(--space-xxl);
  padding-bottom: var(--space-xxl);
}

.page-title {
  font-size: var(--font-size-xl);
  margin-bottom: var(--space-lg);
  color: var(--color-text);
  text-align: center;
}

.search-form {
  display: flex;
  justify-content: center;
  margin-bottom: var(--space-xl);
  gap: var(--space-sm);
}

.search-input {
  width: 100%;
  max-width: 600px;
  padding: var(--space-md);
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: var(--color-text);
  font-size: var(--font-size-md);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.search-button {
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  padding: var(--space-sm) var(--space-lg);
  font-size: var(--font-size-md);
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-button:hover {
  background-color: #c00812;
}

.loading-container,
.error-container,
.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-xl) 0;
  color: var(--color-text);
  text-align: center;
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

.search-results {
  margin-top: var(--space-lg);
}

.section-title {
  font-size: var(--font-size-lg);
  color: var(--color-text);
  margin-bottom: var(--space-md);
  text-align: center;
}

.search-suggestions {
  margin-top: var(--space-xl);
}

.suggestion-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-sm);
  margin-top: var(--space-md);
}

.suggestion-tag {
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--color-text);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  padding: var(--space-xs) var(--space-md);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all 0.3s ease;
}

.suggestion-tag:hover {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

@media (max-width: 768px) {
  .search-form {
    flex-direction: column;
  }

  .search-button {
    width: 100%;
  }

  .suggestion-tags {
    gap: var(--space-xs);
  }
}
</style>
