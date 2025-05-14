<template>
  <div class="relative w-full overflow-hidden">
    <div v-if="loading" class="flex items-center justify-center h-[50vh] text-lg">Loading...</div>
    <div v-else-if="error" class="flex items-center justify-center h-[50vh] text-lg">
      {{ error }}
    </div>
    <div v-else-if="movies.length > 0" class="relative">
      <!-- Background image (full screen) -->
      <div class="relative h-[80vh] md:h-[100vh] max-h-[100vh] overflow-hidden">
        <!-- Top gradient overlay to blend with MovieHotCountry -->
        <div
          class="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-zinc-900 to-transparent z-10"
        ></div>

        <div class="absolute inset-0 w-full h-full">
          <img
            :src="movies[currentIndex].thumb_url"
            :alt="movies[currentIndex].name"
            class="w-full h-full object-cover filter brightness-[0.3]"
          />
        </div>

        <!-- Content overlay (centered) -->
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent"
        ></div>

        <!-- Main content -->
        <div class="relative z-10 h-full flex flex-col items-center justify-center px-4">
          <div
            class="container mx-auto max-w-7xl flex flex-col md:flex-row items-center gap-8 md:gap-16"
          >
            <!-- Left side: Movie info -->
            <div
              class="w-full md:w-[40%] flex flex-col items-center md:items-start text-center md:text-left"
            >
              <div
                class="badge bg-blue-600 inline-block px-2 py-1 text-xs text-white rounded mb-4 w-max"
              >
                FHD
              </div>
              <h2 class="text-3xl md:text-5xl font-bold text-white mb-2">
                {{ movies[currentIndex].name }}
              </h2>
              <div class="text-gray-300 mb-2">{{ movies[currentIndex].origin_name }}</div>
              <div class="text-gray-400 mb-4">{{ movies[currentIndex].episode_current }}</div>

              <router-link
                :to="`/phim/${movies[currentIndex].slug}`"
                class="flex items-center gap-2 text-white bg-transparent border border-white hover:bg-white/10 transition-colors w-max px-6 py-3 rounded-full group"
              >
                <span>Xem chi tiết</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 transform transition-transform group-hover:translate-x-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </router-link>
            </div>

            <!-- Right side: Movie Posters Carousel -->
            <div class="w-full md:w-[60%] py-4 px-2 md:px-6">
              <div class="relative w-full">
                <!-- Navigation arrows -->
                <button
                  @click="prevSlide"
                  class="absolute -left-2 top-1/2 z-10 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 focus:outline-none"
                  :disabled="currentIndex <= 0"
                  :class="{ 'opacity-50 cursor-not-allowed': currentIndex <= 0 }"
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

                <div
                  class="flex overflow-x-auto gap-4 p-4 hide-scrollbar justify-center md:justify-start"
                >
                  <div
                    v-for="(movie, index) in movies.slice(0, 5)"
                    :key="movie._id"
                    @click="currentIndex = index"
                    class="flex-shrink-0 relative cursor-pointer transition-all duration-300 transform hover:scale-105"
                    :class="index === currentIndex ? 'scale-105' : 'opacity-80'"
                  >
                    <div
                      class="w-[160px] md:w-[180px] h-[240px] md:h-[270px] rounded-lg overflow-hidden shadow-lg"
                    >
                      <img
                        :src="movie.poster_url || movie.thumb_url"
                        :alt="movie.name"
                        class="w-full h-full object-cover"
                      />
                    </div>
                    <div
                      v-if="index === currentIndex"
                      class="absolute bottom-0 left-0 right-0 h-1 bg-red-600"
                    ></div>
                  </div>
                </div>

                <button
                  @click="nextSlide"
                  class="absolute -right-2 top-1/2 z-10 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 focus:outline-none"
                  :disabled="currentIndex >= Math.min(movies.length - 1, 4)"
                  :class="{
                    'opacity-50 cursor-not-allowed': currentIndex >= Math.min(movies.length - 1, 4),
                  }"
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { getLatestMovies } from '../services/movieService'

export default {
  setup() {
    const movies = ref([])
    const loading = ref(true)
    const error = ref(null)
    const currentIndex = ref(0)

    const fetchMovies = async () => {
      try {
        loading.value = true
        const response = await getLatestMovies(2) // Page 2 as requested
        movies.value = response.items
        loading.value = false
      } catch (err) {
        console.error(err)
        error.value = 'Không thể tải dữ liệu phim. Vui lòng thử lại sau.'
        loading.value = false
      }
    }

    const prevSlide = () => {
      if (currentIndex.value > 0) {
        currentIndex.value--
      }
    }

    const nextSlide = () => {
      if (currentIndex.value < Math.min(movies.value.length - 1, 4)) {
        currentIndex.value++
      }
    }

    onMounted(() => {
      fetchMovies()
    })

    return {
      movies,
      loading,
      error,
      currentIndex,
      prevSlide,
      nextSlide,
    }
  },
}
</script>

<style scoped>
/* Hide scrollbar but allow scrolling */
.hide-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}
</style>
