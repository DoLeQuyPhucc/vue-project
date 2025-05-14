<template>
  <div class="flex flex-col md:flex-row">
    <!-- Left column: Title and View All link (15%) -->
    <div class="p-4 md:p-8 flex flex-col md:w-[20%]">
      <div>
        <h3 class="text-xl md:text-[2.2rem] font-bold mb-2 leading-tight">
          <span :class="getTitleColor(countrySlug)">{{ getFirstPart(countrySlug) }}</span>
          <div>
            <span :class="getTitleColor(countrySlug)">{{ getSecondPart(countrySlug) }}</span>
            <span class="text-white">mới</span>
          </div>
        </h3>
      </div>

      <router-link
        :to="`/quoc-gia/${countrySlug}`"
        class="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors group mt-2 text-sm md:text-base"
      >
        Xem toàn bộ
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

    <!-- Right column: Movie carousel (80%) -->
    <div class="md:w-[80%] relative p-3 md:p-5 flex-1">
      <!-- Loading state -->
      <div v-if="loading" class="flex overflow-x-auto gap-4 hide-scrollbar">
        <div v-for="i in 3" :key="i" class="flex-shrink-0 w-[calc(33.33%-11px)]">
          <div class="bg-zinc-800 rounded-lg aspect-video animate-pulse mb-2"></div>
          <div class="h-5 bg-zinc-800 rounded animate-pulse mb-1 w-3/4"></div>
          <div class="h-4 bg-zinc-800 rounded animate-pulse w-1/2"></div>
        </div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="p-4 text-red-400">
        {{ error }}
      </div>

      <!-- Content -->
      <div v-else class="relative w-full">
        <!-- Navigation arrows -->
        <button
          v-if="totalPages > 0"
          @click="scroll(-1)"
          class="absolute top-1/2 left-2 z-10 transform -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 focus:outline-none transition-opacity"
          :disabled="carouselPage <= 0"
          :class="{ 'opacity-30 cursor-not-allowed': carouselPage <= 0, 'opacity-80 hover:opacity-100': carouselPage > 0 }"
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

        <button
          v-if="totalPages > 0"
          @click="scroll(1)"
          class="absolute top-1/2 right-2 z-10 transform -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 focus:outline-none transition-opacity"
          :disabled="carouselPage >= totalPages"
          :class="{ 'opacity-30 cursor-not-allowed': carouselPage >= totalPages, 'opacity-80 hover:opacity-100': carouselPage < totalPages }"
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

        <!-- Hidden edge elements to create the crop effect -->
        <div
          class="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-[#262938] to-transparent z-[9]"
        ></div>

        <!-- Movie carousel -->
        <div class="overflow-hidden w-full">
          <transition-group 
            name="carousel" 
            tag="div"
            class="flex gap-4 py-2 w-full"
          >
            <router-link
              v-for="(movie, index) in displayedMovies"
              :key="movie._id"
              :to="`/phim/${movie.slug}`"
              class="flex-shrink-0 w-[calc(33.33%-11px)] md:w-[calc(33.33%-11px)] group"
            >
              <div
                class="relative aspect-video overflow-hidden rounded-lg mb-2 bg-zinc-800 shadow-md"
              >
                <img
                  :src="getImageUrl(movie.thumb_url)"
                  :alt="movie.name"
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />

                <div class="absolute bottom-2 left-2 flex gap-1.5">
                  <span
                    v-if="movie.quality"
                    class="bg-red-600 text-white text-[11px] px-1.5 py-0.5 rounded"
                  >
                    PĐ. {{ movie.quality }}
                  </span>
                  <span
                    v-if="movie.lang && movie.lang.includes('Thuyết Minh')"
                    class="bg-blue-600 text-white text-[11px] px-1.5 py-0.5 rounded"
                  >
                    TM. {{ movie.episode_current }}
                  </span>
                </div>
              </div>

              <h3
                class="text-sm md:text-base font-medium text-white truncate group-hover:text-red-500 transition-colors"
              >
                {{ movie.name }}
              </h3>
              <div class="text-xs md:text-sm text-zinc-400 truncate">
                {{ movie.origin_name }}
              </div>
            </router-link>
          </transition-group>
        </div>

        <!-- Page indicators -->
        <div v-if="totalPages > 0" class="flex justify-center mt-3 gap-1.5">
          <div 
            v-for="page in totalPages + 1" 
            :key="page" 
            class="w-2 h-2 rounded-full cursor-pointer transition-all" 
            :class="carouselPage === page - 1 ? 'bg-white' : 'bg-zinc-600 hover:bg-zinc-400'"
            @click="carouselPage = page - 1"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, defineProps, computed } from 'vue'
import { getMoviesByCountry, type Movie } from '@/services/countryService'

const props = defineProps({
  countrySlug: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  maxItems: {
    type: Number,
    default: 3,
  },
})

const movies = ref<Movie[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const carouselPage = ref(0)
const totalPages = computed(() => Math.ceil(movies.value.length / 3) - 1)

const displayedMovies = computed(() => {
  const start = carouselPage.value * 3
  return movies.value.slice(start, start + 3)
})

function getFirstPart(slug: string): string {
  const parts: Record<string, string> = {
    'trung-quoc': 'Phim Trung',
    'au-my': 'Phim US-',
    'han-quoc': 'Phim Hàn',
    'thai-lan': 'Phim Thái',
  }
  return parts[slug] || 'Phim'
}

function getSecondPart(slug: string): string {
  const parts: Record<string, string> = {
    'trung-quoc': 'Quốc ',
    'au-my': 'UK ',
    'han-quoc': 'Quốc ',
    'thai-lan': 'Lan ',
  }
  return parts[slug] || 'Quốc Tế '
}

function getTitleColor(slug: string): string {
  const colors: Record<string, string> = {
    'trung-quoc': 'text-amber-300',
    'au-my': 'text-pink-400',
    'han-quoc': 'text-purple-400',
    'thai-lan': 'text-green-400',
  }
  return colors[slug] || 'text-blue-400'
}

function getImageUrl(path: string): string {
  // Assuming the API returns relative paths
  if (path.startsWith('http')) return path
  return `https://phimimg.com/${path}`
}

async function fetchMovies() {
  try {
    loading.value = true
    error.value = null

    movies.value = await getMoviesByCountry(props.countrySlug, 9) // Fetch 9 movies for carousel pagination

    loading.value = false
  } catch (err) {
    console.error(err)
    error.value = 'Không thể tải dữ liệu phim. Vui lòng thử lại sau.'
    loading.value = false
  }
}

function scroll(direction: number) {
  if (direction > 0 && carouselPage.value < totalPages.value) {
    carouselPage.value++
  } else if (direction < 0 && carouselPage.value > 0) {
    carouselPage.value--
  }
}

watch(
  () => props.countrySlug,
  () => {
    carouselPage.value = 0; // Reset to the first page
    fetchMovies();
  },
)

onMounted(() => {
  fetchMovies()
})
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.hide-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Carousel transitions */
.carousel-enter-active,
.carousel-leave-active {
  transition: all 0.5s ease;
}
.carousel-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.carousel-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
