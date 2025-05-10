<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import MovieCard from '@/components/MovieCard.vue'
import HeroSection from '@/components/HeroSection.vue'
import movieService from '@/services/movieService'
import type { Movie } from '@/services/movieService'

const featuredMovies = ref<Movie[]>([])
const recentMovies = ref<Movie[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const fetchMovies = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await movieService.getLatestMovies(1)

    // Get first 5 movies for featured section (if available)
    featuredMovies.value = response.items.slice(0, 5)

    // Rest for recent movies section
    recentMovies.value = response.items.slice(5, 17)
  } catch (err) {
    error.value = 'Failed to load movies. Please try again.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchMovies)
</script>

<template>
  <div class="home-container">
    <!-- Loading and error states -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading movies...</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button class="retry-button" @click="fetchMovies">Try Again</button>
    </div>
    
    <template v-else>
      <!-- Hero Section with Movie Slider -->
      <HeroSection :movies="featuredMovies" />
      
      <!-- Recently Added Movies -->
      <div class="movies-content container">
        <section class="recent-section">
          <div class="section-header">
            <h2 class="section-title">Recently Added</h2>
            <router-link to="/watchlist" class="view-all-link">View All</router-link>
          </div>
          <div class="recent-grid responsive-grid">
            <MovieCard 
              v-for="movie in recentMovies" 
              :key="movie._id" 
              :movie="movie" 
            />
          </div>
        </section>
      </div>
    </template>
  </div>
</template>

<style scoped>
.home-container {
  padding-bottom: var(--space-xxl);
}

.section-title {
  font-size: var(--font-size-xl);
  color: var(--color-text);
  margin-bottom: var(--space-lg);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
}

.view-all-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.3s;
}

.view-all-link:hover {
  opacity: 0.8;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-xl) 0;
  color: var(--color-text);
  min-height: 50vh;
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

/* Mobile styles */
@media (max-width: 576px) {
  .section-title {
    font-size: var(--font-size-lg);
  }
}
</style>
