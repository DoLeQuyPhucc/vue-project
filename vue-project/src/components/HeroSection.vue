<template>
  <div class="relative w-full overflow-hidden mb-0">
    <div v-if="loading" class="flex items-center justify-center h-[50vh] text-lg">Loading...</div>
    <div v-else-if="error" class="flex items-center justify-center h-[50vh] text-lg">
      {{ error }}
    </div>
    <div v-else class="relative w-full h-[100vh] max-h-[100vh] overflow-hidden">
      <div class="w-full h-full overflow-hidden">
        <div
          class="flex w-full h-full transition-transform duration-500 ease-in-out"
          :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
        >
          <div v-for="movie in displayedMovies" :key="movie._id" class="flex-none w-full h-full">
            <div class="relative w-full h-full overflow-hidden">
              <img :src="movie.thumb_url" :alt="movie.name" class="w-full h-full object-cover" />
              <div
                class="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white p-8 pt-16"
              >
                <div
                  class="absolute -top-6 left-5 bg-[#ff6b6b] text-white px-2 py-0.5 rounded text-sm font-bold"
                >
                  {{ movie.quality }}
                </div>
                <div class="max-w-3xl">
                  <h2 class="text-5xl font-bold mb-4 drop-shadow-lg">{{ movie.name }}</h2>
                  <div class="flex flex-wrap gap-2 mb-4">
                    <span
                      v-if="movie.imdb"
                      class="inline-flex items-center bg-yellow-600 px-2.5 py-1 rounded text-sm"
                    >
                      IMDb {{ movie.imdb_rating }}
                    </span>
                    <span class="inline-flex items-center bg-white/20 px-2.5 py-1 rounded">
                      {{ movie.quality }}
                    </span>
                    <span
                      v-for="(category, idx) in movie.category"
                      :key="idx"
                      class="inline-flex items-center bg-white/20 px-2.5 py-1 rounded"
                    >
                      {{ category.name }}
                    </span>
                    <span class="inline-flex items-center bg-white/20 px-2.5 py-1 rounded">
                      {{ movie.year }}
                    </span>
                    <span class="inline-flex items-center bg-white/20 px-2.5 py-1 rounded">
                      {{ movie.time }}
                    </span>
                    <span class="inline-flex items-center bg-white/20 px-2.5 py-1 rounded">
                      {{ movie.episode_current }}
                    </span>
                  </div>
                  <p class="text-gray-300 mb-4 line-clamp-3 max-w-2xl">
                    {{ movie.content }}
                  </p>
                  <div class="flex gap-4 mt-6">
                    <button
                      class="bg-[#4caf50] hover:bg-[#45a049] text-white px-6 py-2.5 rounded font-bold transition-colors"
                    >
                      Xem chi tiết
                    </button>
                    <button
                      class="flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full text-white text-xl transition-colors"
                    >
                      ♥
                    </button>
                    <button
                      class="flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full text-white text-xl transition-colors"
                    >
                      ℹ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="absolute bottom-12 right-6 flex gap-2.5 z-10">
        <div
          v-for="(movie, index) in displayedMovies"
          :key="movie._id"
          :class="[
            'w-20 h-[45px] rounded overflow-hidden cursor-pointer transition-all duration-300 ease-in-out border-2',
            index === currentIndex
              ? 'opacity-100 border-[#4caf50]'
              : 'opacity-70 border-transparent',
          ]"
          @click="currentIndex = index"
        >
          <img :src="movie.thumb_url" :alt="movie.name" class="w-full h-full object-cover" />
        </div>
      </div>
      <div class="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        <span
          v-for="(_, index) in displayedMovies"
          :key="index"
          :class="[
            'w-2.5 h-2.5 rounded-full cursor-pointer transition-colors duration-300',
            index === currentIndex ? 'bg-white' : 'bg-white/40',
          ]"
          @click="currentIndex = index"
        ></span>
      </div>
    </div>
  </div>
</template>

<script>
import { getLatestMovies } from '../services/movieService'

export default {
  data() {
    return {
      movies: [],
      loading: true,
      error: null,
      currentIndex: 0,
    }
  },
  computed: {
    displayedMovies() {
      return this.movies.slice(0, 5)
    },
  },
  methods: {
    async fetchMovies() {
      try {
        this.loading = true
        const response = await getLatestMovies()
        this.movies = response.items
        this.loading = false
      } catch (error) {
        this.error = 'Failed to load movies'
        this.loading = false
        console.error(error)
      }
    },
    prevSlide() {
      this.currentIndex =
        (this.currentIndex - 1 + this.displayedMovies.length) % this.displayedMovies.length
    },
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.displayedMovies.length
    },
  },
  mounted() {
    this.fetchMovies()
    // Auto slide removed as requested
  },
}
</script>

<style>
@media (max-width: 768px) {
  .text-5xl {
    font-size: 2rem;
  }
}

/* Add line-clamp utility if not using Tailwind's line-clamp plugin */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
