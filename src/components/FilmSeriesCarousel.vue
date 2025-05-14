<template>
  <section class="py-8 relative">
    <div class="container mx-auto max-w-7xl px-4">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl md:text-3xl font-bold text-white">Phim Bộ</h2>
        <router-link 
          to="/danh-sach/phim-bo"
          class="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition"
        >
          <span>Xem toàn bộ</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </router-link>
      </div>

      <div v-if="loading" class="flex items-center justify-center h-[40vh] text-lg">Loading...</div>
      <div v-else-if="error" class="flex items-center justify-center h-[40vh] text-lg">{{ error }}</div>
      <div v-else-if="movies.length > 0" class="relative">
        <!-- Navigation arrows -->
        <button
          @click="prevSlide"
          class="absolute -left-2 top-1/2 z-10 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>

        <div class="carousel-container">
          <div 
            class="carousel-slide"
            :style="{ transform: `translateX(${-currentIndex * (220 + 16)}px)` }"
          >
            <div
              v-for="(movie, index) in movies"
              :key="movie._id"
              class="carousel-item transition-all duration-300 transform hover:scale-105"
            >
              <router-link :to="`/phim/${movie.slug}`">
                <div class="poster-container rounded-lg overflow-hidden shadow-lg relative group">
                  <img
                    :src="`${cdnUrl}/${movie.poster_url || movie.thumb_url}`"
                    :alt="movie.name"
                    class="w-full h-full object-cover"
                  />
                  <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <div class="badge bg-blue-600 inline-block px-2 py-1 text-xs text-white rounded mb-2 w-max">
                      {{ movie.quality }}
                    </div>
                    <div class="text-white font-semibold truncate">{{ movie.name }}</div>
                    <div class="text-gray-300 text-sm truncate">{{ movie.origin_name }}</div>
                    <div class="text-gray-400 text-sm mt-1">{{ movie.episode_current }}</div>
                  </div>
                </div>
              </router-link>
            </div>
          </div>
        </div>

        <button
          @click="nextSlide"
          class="absolute -right-2 top-1/2 z-10 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getFilmBo } from '../services/movieService'

const movies = ref([])
const loading = ref(true)
const error = ref<string | null>(null)
const currentIndex = ref(0)
const itemsPerView = ref(5) // Number of items visible at once

// App domain for CDN images
const cdnUrl = ref('https://phimimg.com')

const fetchMovies = async () => {
  try {
    loading.value = true
    const response = await getFilmBo()
    if (response && response.data && response.data.items) {
      movies.value = response.data.items
      cdnUrl.value = response.data.APP_DOMAIN_CDN_IMAGE || 'https://phimimg.com'
    } else {
      error.value = 'Không thể tải dữ liệu phim bộ. Vui lòng thử lại sau.'
    }
    loading.value = false
  } catch (err) {
    console.error(err)
    error.value = 'Không thể tải dữ liệu phim bộ. Vui lòng thử lại sau.'
    loading.value = false
  }
}

const prevSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  } else {
    // Loop to the end
    currentIndex.value = Math.max(0, movies.value.length - itemsPerView.value)
  }
}

const nextSlide = () => {
  if (currentIndex.value < movies.value.length - itemsPerView.value) {
    currentIndex.value++
  } else {
    // Loop back to start
    currentIndex.value = 0
  }
}

onMounted(() => {
  fetchMovies()
})
</script>

<style scoped>
.carousel-container {
  width: 100%;
  overflow: hidden;
  padding: 1rem 0;
  position: relative;
}

.carousel-slide {
  display: flex;
  gap: 1rem;
  transition: transform 0.5s ease;
  will-change: transform;
  min-width: max-content;
}

.carousel-item {
  flex: 0 0 auto;
  position: relative;
  cursor: pointer;
}

.poster-container {
  width: 180px;
  height: 270px;
}

/* For larger screens */
@media (min-width: 768px) {
  .poster-container {
    width: 220px;
    height: 330px;
  }
}
</style> 