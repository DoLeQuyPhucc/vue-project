<template>
  <div class="grid grid-cols-1 md:grid-cols-5">
    <!-- Left column: Title and View All link (20%) -->
    <div class="p-6 md:p-10 flex flex-col">
      <div>
        <h3 class="text-2xl font-bold mb-1 leading-tight">
          <span :class="getTitleColor(countrySlug)">{{ getFirstPart(countrySlug) }}</span>
          <div>
            <span :class="getTitleColor(countrySlug)">{{ getSecondPart(countrySlug) }}</span>
            <span class="text-white">mới</span>
          </div>
        </h3>
      </div>

      <router-link
        :to="`/quoc-gia/${countrySlug}`"
        class="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors group mt-3 text-sm"
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
    <div class="md:col-span-4 relative p-4 md:p-6">
      <!-- Loading state -->
      <div v-if="loading" class="flex overflow-x-auto gap-3 hide-scrollbar">
        <div v-for="i in 5" :key="i" class="flex-shrink-0 w-[220px]">
          <div class="bg-zinc-800 rounded-lg aspect-video animate-pulse mb-2"></div>
          <div class="h-4 bg-zinc-800 rounded animate-pulse mb-1 w-3/4"></div>
          <div class="h-3 bg-zinc-800 rounded animate-pulse w-1/2"></div>
        </div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="p-4 text-red-400">
        {{ error }}
      </div>

      <!-- Content -->
      <div v-else class="relative">
        <!-- Navigation arrows -->
        <button
          @click="scroll(-1)"
          class="absolute top-1/2 left-2 z-10 transform -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 focus:outline-none"
          :disabled="scrollPosition <= 0"
          :class="{ 'opacity-50 cursor-not-allowed': scrollPosition <= 0 }"
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
          @click="scroll(1)"
          class="absolute top-1/2 right-2 z-10 transform -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 focus:outline-none"
          :disabled="scrollPosition >= maxScroll"
          :class="{ 'opacity-50 cursor-not-allowed': scrollPosition >= maxScroll }"
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
        <div
          ref="scrollContainer"
          class="flex overflow-x-auto gap-3 hide-scrollbar"
          @scroll="handleScroll"
        >
          <router-link
            v-for="movie in movies"
            :key="movie._id"
            :to="`/phim/${movie.slug}`"
            class="flex-shrink-0 w-[220px] group"
          >
            <div class="relative aspect-video overflow-hidden rounded-lg mb-2 bg-zinc-800">
              <img
                :src="getImageUrl(movie.thumb_url)"
                :alt="movie.name"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />

              <div class="absolute bottom-2 left-2 flex gap-1.5">
                <span
                  v-if="movie.quality"
                  class="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded"
                >
                  PĐ. {{ movie.quality }}
                </span>
                <span
                  v-if="movie.lang && movie.lang.includes('Thuyết Minh')"
                  class="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded"
                >
                  TM. {{ movie.episode_current }}
                </span>
              </div>
            </div>

            <h3
              class="text-sm font-medium text-white truncate group-hover:text-red-500 transition-colors"
            >
              {{ movie.name }}
            </h3>
            <div class="text-xs text-zinc-400 truncate">
              {{ movie.origin_name }}
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, defineProps } from 'vue'
import { getMoviesByCountry, type Movie } from '@/services/countryService'

const props = defineProps<{
  countrySlug: string
  title: string
}>()

const movies = ref<Movie[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const scrollContainer = ref<HTMLElement | null>(null)
const scrollPosition = ref(0)
const maxScroll = ref(0)

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

    movies.value = await getMoviesByCountry(props.countrySlug, 10)

    loading.value = false
  } catch (err) {
    console.error(err)
    error.value = 'Không thể tải dữ liệu phim. Vui lòng thử lại sau.'
    loading.value = false
  }
}

function handleScroll() {
  if (scrollContainer.value) {
    scrollPosition.value = scrollContainer.value.scrollLeft
    maxScroll.value = scrollContainer.value.scrollWidth - scrollContainer.value.clientWidth
  }
}

function scroll(direction: number) {
  if (scrollContainer.value) {
    const width = scrollContainer.value.clientWidth
    scrollContainer.value.scrollBy({
      left: width * 0.75 * direction,
      behavior: 'smooth',
    })
  }
}

watch(
  () => scrollContainer.value,
  (newValue) => {
    if (newValue) {
      maxScroll.value = newValue.scrollWidth - newValue.clientWidth
    }
  },
)

watch(
  () => props.countrySlug,
  () => {
    fetchMovies()
  },
)

onMounted(() => {
  fetchMovies()
  if (scrollContainer.value) {
    maxScroll.value = scrollContainer.value.scrollWidth - scrollContainer.value.clientWidth
  }
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
</style>
