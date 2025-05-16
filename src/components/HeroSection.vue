<template>
  <div class="relative w-full overflow-hidden mb-0">
    <div v-if="loading" class="hero-skeleton">
      <!-- Skeleton loader for hero section -->
      <div class="h-[80vh] md:h-[100vh] w-full bg-zinc-800 animate-pulse">
        <div class="absolute bottom-0 left-0 w-full p-4 md:p-8 pt-16 pb-8 md:pb-16">
          <div class="max-w-3xl">
            <div class="h-8 md:h-10 bg-zinc-700 rounded w-3/4 mb-4 animate-pulse"></div>
            <div class="flex flex-wrap gap-2 mb-4">
              <div class="h-4 w-16 bg-zinc-700 rounded animate-pulse"></div>
              <div class="h-4 w-20 bg-zinc-700 rounded animate-pulse"></div>
              <div class="h-4 w-24 bg-zinc-700 rounded animate-pulse"></div>
            </div>
            <div class="space-y-2 mb-6">
              <div class="h-3 bg-zinc-700 rounded w-full animate-pulse"></div>
              <div class="h-3 bg-zinc-700 rounded w-5/6 animate-pulse"></div>
              <div class="h-3 bg-zinc-700 rounded w-4/6 animate-pulse"></div>
            </div>
            <div class="flex gap-3">
              <div class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-zinc-700 animate-pulse"></div>
              <div class="w-20 h-10 md:w-24 md:h-12 rounded-full bg-zinc-700 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="error" class="flex items-center justify-center h-[50vh] text-lg">
      {{ error }}
    </div>
    <div v-else class="relative w-full h-[80vh] md:h-[100vh] max-h-[100vh] overflow-hidden z-[25]">
      <div class="w-full h-full overflow-hidden">
        <div
          class="flex w-full h-full transition-transform duration-500 ease-in-out"
          :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
        >
          <div v-for="movie in displayedMovies" :key="movie._id" class="flex-none w-full h-full">
            <div class="relative w-full h-full overflow-hidden">
              <!-- Optimize mobile image loading with lazy loading -->
              <img
                :src="movie.poster_url || movie.thumb_url"
                :alt="movie.name"
                class="w-full h-full object-cover md:hidden"
                loading="lazy"
              />
              <!-- Optimize desktop image with lazy loading -->
              <img
                :src="movie.thumb_url"
                :alt="movie.name"
                class="w-full h-full object-cover hidden md:block"
                loading="lazy"
              />
              <div
                class="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/95 via-black/70 to-transparent text-white p-4 md:p-8 pt-16 pb-8 md:pb-16"
              >
                <div class="max-w-3xl">
                  <h2
                    class="text-2xl md:text-4xl font-bold mb-2 md:mb-4 drop-shadow-lg line-clamp-2"
                  >
                    {{ movie.name }}
                  </h2>
                  <div
                    class="flex flex-wrap gap-1 md:gap-1.5 mb-2 md:mb-4 max-h-[3rem] md:max-h-[4.5rem] overflow-hidden"
                  >
                    <span
                      v-if="movie.imdb"
                      class="inline-flex items-center bg-yellow-600 px-1.5 md:px-2 py-0.5 rounded text-[10px] md:text-xs"
                    >
                      IMDb {{ movie.imdb_rating }}
                    </span>
                    <span
                      class="inline-flex items-center bg-white/20 px-1.5 md:px-2 py-0.5 rounded text-[10px] md:text-xs"
                    >
                      {{ movie.quality }}
                    </span>
                    <span
                      v-for="(category, idx) in movie.category"
                      :key="idx"
                      class="inline-flex items-center bg-white/20 px-1.5 md:px-2 py-0.5 rounded text-[10px] md:text-xs"
                    >
                      {{ category.name }}
                    </span>
                    <span
                      class="inline-flex items-center bg-white/20 px-1.5 md:px-2 py-0.5 rounded text-[10px] md:text-xs"
                    >
                      {{ movie.year }}
                    </span>
                    <span
                      class="inline-flex items-center bg-white/20 px-1.5 md:px-2 py-0.5 rounded text-[10px] md:text-xs"
                    >
                      {{ movie.time }}
                    </span>
                    <span
                      class="inline-flex items-center bg-white/20 px-1.5 md:px-2 py-0.5 rounded text-[10px] md:text-xs"
                    >
                      {{ movie.episode_current }}
                    </span>
                  </div>
                  <p
                    class="text-gray-300 mb-3 md:mb-5 line-clamp-2 md:line-clamp-3 max-w-2xl text-xs md:text-sm"
                  >
                    {{ movie.content }}
                  </p>
                  <div class="flex gap-2 md:gap-3 mt-3 md:mt-6">
                    <router-link
                      :to="`/xem-phim/${movie.slug}`"
                      class="bg-[#4caf50] hover:bg-[#45a049] text-white flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full transition-colors"
                    >
                      <font-awesome-icon :icon="['fas', 'play']" class="text-sm md:text-lg" />
                    </router-link>
                    <div class="flex overflow-hidden rounded-full bg-white/20">
                      <button
                        class="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 text-white hover:bg-white/30 transition-colors border-r border-white/30"
                      >
                        <font-awesome-icon :icon="['fas', 'heart']" class="text-sm md:text-lg" />
                      </button>
                      <router-link
                        :to="`/phim/${movie.slug}`"
                        class="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 text-white hover:bg-white/30 transition-colors"
                      >
                        <font-awesome-icon :icon="['fas', 'info']" class="text-sm md:text-lg" />
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Thumbnails with lazy loading -->
      <div class="hidden md:flex absolute bottom-20 right-6 gap-2.5 z-[40] pointer-events-auto">
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
          <img :src="movie.thumb_url" :alt="movie.name" class="w-full h-full object-cover" loading="lazy" />
        </div>
      </div>

      <!-- Navigation controls -->
      <div
        class="absolute bottom-4 md:bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-[40] pointer-events-auto"
      >
        <span
          v-for="(_, index) in displayedMovies"
          :key="index"
          :class="[
            'w-3 h-3 md:w-2.5 md:h-2.5 rounded-full cursor-pointer transition-colors duration-300',
            index === currentIndex ? 'bg-white' : 'bg-white/40',
          ]"
          @click="currentIndex = index"
        ></span>
      </div>

      <!-- Mobile navigation arrows -->
      <button
        @click="prevSlide"
        class="absolute left-2 top-1/2 -translate-y-1/2 md:hidden bg-black/30 w-10 h-10 rounded-full flex items-center justify-center text-white z-[40] pointer-events-auto"
      >
        <font-awesome-icon :icon="['fas', 'chevron-left']" />
      </button>
      <button
        @click="nextSlide"
        class="absolute right-2 top-1/2 -translate-y-1/2 md:hidden bg-black/30 w-10 h-10 rounded-full flex items-center justify-center text-white z-[40] pointer-events-auto"
      >
        <font-awesome-icon :icon="['fas', 'chevron-right']" />
      </button>
    </div>
  </div>
</template>

<script>
import { getLatestMovies } from '../services/movieService'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faPlay,
  faHeart,
  faInfo,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { refreshCacheInBackground } from '../utils/apiUtils'

// Add the icons to the library
library.add(faPlay, faHeart, faInfo, faChevronLeft, faChevronRight)

export default {
  components: {
    FontAwesomeIcon,
  },
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
        // Using the cached API call (will return cached data if available)
        const response = await getLatestMovies()
        this.movies = response.items
        this.loading = false
        
        // After component is mounted, refresh the cache in background
        this.$nextTick(() => {
          this.refreshDataInBackground()
        })
      } catch (error) {
        this.error = 'Failed to load movies'
        this.loading = false
        console.error(error)
      }
    },
    
    async refreshDataInBackground() {
      // This will update the cache without affecting the current UI
      // unless the data has changed
      try {
        const response = await refreshCacheInBackground(getLatestMovies, 'latest_movies')
        // Only update UI if we got new data and it's different
        if (response && JSON.stringify(response.items) !== JSON.stringify(this.movies)) {
          this.movies = response.items
        }
      } catch (error) {
        console.error('Background refresh failed:', error)
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
  },
}
</script>

<style>
/* Mobile first approach */
.text-5xl {
  font-size: 1.5rem;
}

@media (min-width: 768px) {
  .text-5xl {
    font-size: 2rem;
  }
}

/* Skeleton animation */
.hero-skeleton {
  position: relative;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Add line-clamp utility if not using Tailwind's line-clamp plugin */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
