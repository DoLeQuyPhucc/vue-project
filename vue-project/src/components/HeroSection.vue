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
                class="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white p-8 pt-16 pb-16"
              >
                <div class="max-w-3xl">
                  <h2 class="text-4xl font-bold mb-4 drop-shadow-lg">{{ movie.name }}</h2>
                  <div class="flex flex-wrap gap-1.5 mb-4 max-h-[4.5rem] overflow-hidden">
                    <span
                      v-if="movie.imdb"
                      class="inline-flex items-center bg-yellow-600 px-2 py-0.5 rounded text-xs"
                    >
                      IMDb {{ movie.imdb_rating }}
                    </span>
                    <span class="inline-flex items-center bg-white/20 px-2 py-0.5 rounded text-xs">
                      {{ movie.quality }}
                    </span>
                    <span
                      v-for="(category, idx) in movie.category"
                      :key="idx"
                      class="inline-flex items-center bg-white/20 px-2 py-0.5 rounded text-xs"
                    >
                      {{ category.name }}
                    </span>
                    <span class="inline-flex items-center bg-white/20 px-2 py-0.5 rounded text-xs">
                      {{ movie.year }}
                    </span>
                    <span class="inline-flex items-center bg-white/20 px-2 py-0.5 rounded text-xs">
                      {{ movie.time }}
                    </span>
                    <span class="inline-flex items-center bg-white/20 px-2 py-0.5 rounded text-xs">
                      {{ movie.episode_current }}
                    </span>
                  </div>
                  <p class="text-gray-300 mb-5 line-clamp-3 max-w-2xl text-sm">
                    {{ movie.content }}
                  </p>
                  <div class="flex gap-3 mt-6">
                    <router-link 
                      :to="`/xem-phim/${movie.slug}`" 
                      class="bg-[#4caf50] hover:bg-[#45a049] text-white flex items-center justify-center w-12 h-12 rounded-full transition-colors"
                    >
                      <font-awesome-icon :icon="['fas', 'play']" size="lg" />
                    </router-link>
                    <div class="flex overflow-hidden rounded-full bg-white/20">
                      <button
                        class="flex items-center justify-center w-12 h-12 text-white hover:bg-white/30 transition-colors border-r border-white/30"
                      >
                        <font-awesome-icon :icon="['fas', 'heart']" size="lg" />
                      </button>
                      <router-link
                        :to="`/phim/${movie.slug}`"
                        class="flex items-center justify-center w-12 h-12 text-white hover:bg-white/30 transition-colors"
                      >
                        <font-awesome-icon :icon="['fas', 'info']" size="lg" />
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="absolute bottom-20 right-6 flex gap-2.5 z-10">
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
      <div class="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
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
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlay, faHeart, faInfo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Add the icons to the library
library.add(faPlay, faHeart, faInfo)

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
