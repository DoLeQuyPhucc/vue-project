<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getMovieDetail, getLatestMovies } from '@/services/movieService'
import type { MovieDetailResponse, MovieDetail, Movie } from '@/services/movieService'

interface Episode {
  name: string
  slug: string
  link_embed?: string
  link_m3u8?: string
}

interface ServerData {
  server_name: string
  server_data: Episode[]
}

// State cho dữ liệu phim và loading
const route = useRoute()
const router = useRouter()
const movieData = ref<MovieDetail | null>(null)
const episodes = ref<ServerData[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)
const activeTab = ref('thongTin') // Tabs: thongTin, galleryPhim, dienVien, phimDeXuat
const recommendedMovies = ref<Movie[]>([])
const isLoadingRecommended = ref(false)

// Lấy thông tin phim từ API
const fetchMovieDetail = async () => {
  const slug = route.params.slug as string

  try {
    isLoading.value = true
    const response: MovieDetailResponse = await getMovieDetail(slug)

    if (response.status) {
      movieData.value = response.movie
      episodes.value = response.episodes
      document.title = `LoPhim - ${response.movie.name}`

      // Fetch recommended movies after getting movie details
      fetchRecommendedMovies()
    } else {
      error.value = 'Không thể tải thông tin phim'
    }
  } catch (err) {
    console.error('Lỗi khi tải chi tiết phim:', err)
    error.value = 'Đã xảy ra lỗi khi tải thông tin phim'
  } finally {
    isLoading.value = false
  }
}

// Fetch recommended movies
const fetchRecommendedMovies = async () => {
  try {
    isLoadingRecommended.value = true
    // Generate a random page between 1 and 10
    const randomPage = Math.floor(Math.random() * 10) + 1
    const response = await getLatestMovies(randomPage)
    if (response.status) {
      // Filter out current movie and slice to get 6 movies max
      recommendedMovies.value = response.items
        .filter((movie) => !movieData.value || movie.slug !== movieData.value.slug)
        .slice(0, 6)
    }
  } catch (err) {
    console.error('Error fetching recommended movies:', err)
  } finally {
    isLoadingRecommended.value = false
  }
}

// Định dạng nội dung phim
const formattedContent = computed(() => {
  if (!movieData.value) return ''
  return movieData.value.content.replace(/\n/g, '<br>')
})

// Tính toán điểm đánh giá với 1 số thập phân
const ratingScore = computed(() => {
  if (!movieData.value?.tmdb?.vote_average) return 'N/A'
  return movieData.value.tmdb.vote_average.toFixed(1)
})

// Chuyển đổi giữa các tab
const switchTab = (tab: string) => {
  activeTab.value = tab
}

// Format năm phát hành
const releaseYear = computed(() => {
  return movieData.value?.year || 'N/A'
})

// Kiểm tra xem phim có trailer không
const hasTrailer = computed(() => {
  return movieData.value?.trailer_url && movieData.value.trailer_url !== ''
})

// Kiểm tra xem phim có gallery không (trailer, poster và thumb)
const hasGallery = computed(() => {
  return (
    hasTrailer.value ||
    (movieData.value?.poster_url && movieData.value.poster_url !== '') ||
    (movieData.value?.thumb_url && movieData.value.thumb_url !== '')
  )
})

// Lấy ID trailer YouTube
const trailerYoutubeId = computed(() => {
  if (!movieData.value?.trailer_url) return null

  const url = movieData.value.trailer_url
  // Extract YouTube ID from different URL formats
  const regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/
  const match = url.match(regExp)

  return match && match[2].length === 11 ? match[2] : null
})

// Convert episode data to user-friendly format
const hasEpisodes = computed(() => {
  return episodes.value.length > 0 && episodes.value.some((server) => server.server_data.length > 0)
})

// Check if movie has actors
const hasActors = computed(() => {
  return movieData.value?.actor && movieData.value.actor.length > 0
})

// Trạng thái phim (Đang chiếu, Hoàn thành, ...)
const movieStatus = computed(() => {
  if (!movieData.value) return ''

  switch (movieData.value.status) {
    case 'ongoing':
      return 'Đang chiếu'
    case 'completed':
      return 'Hoàn thành'
    default:
      return movieData.value.status
  }
})

// Chuyển hướng đến trang xem phim
const navigateToWatch = () => {
  if (movieData.value) {
    router.push(`/xem-phim/${movieData.value.slug}`)
  }
}

// Navigate to movie detail page
const navigateToMovie = (slug: string) => {
  router.push(`/phim/${slug}`)
}

// Fetch data when component mounts
onMounted(() => {
  fetchMovieDetail()
})

// Watch for route changes to reload data
watch(
  () => route.params.slug,
  (newSlug) => {
    if (newSlug) {
      fetchMovieDetail()
    }
  },
)
</script>

<template>
  <div class="movie-detail-page bg-zinc-900 text-white min-h-screen">
    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div class="loader">
        <div class="film-reel"></div>
        <p class="mt-4 text-gray-400">Đang tải phim...</p>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="container mx-auto px-4 py-20 text-center">
      <div class="bg-zinc-800 rounded-lg p-8 max-w-2xl mx-auto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-16 h-16 text-red-500 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 class="text-xl font-bold mb-2">Không thể tải phim</h2>
        <p class="text-gray-400 mb-4">{{ error }}</p>
        <router-link
          to="/"
          class="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition-colors"
        >
          Quay lại trang chủ
        </router-link>
      </div>
    </div>

    <!-- Movie content -->
    <div v-else-if="movieData" class="pb-12">
      <!-- Hero Section / Movie Backdrop -->
      <div class="movie-backdrop relative">
        <!-- Enhanced backdrop with overlay -->
        <div
          class="absolute inset-0 bg-gradient-to-b from-zinc-900/30 via-zinc-900/70 to-zinc-900"
        ></div>
        <div
          class="absolute inset-0 bg-cover bg-center bg-no-repeat"
          :style="`background-image: url('${movieData.thumb_url}'); filter: blur(2px) brightness(0.4);`"
        ></div>

        <!-- Film grain overlay -->
        <div
          class="absolute inset-0 opacity-20 mix-blend-overlay"
          style="
            background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=');
          "
        ></div>

        <!-- Content overlay -->
        <div class="container mx-auto px-4 relative z-10">
          <div class="flex flex-col md:flex-row py-16 md:py-24 gap-8">
            <!-- Movie Poster with enhanced styling -->
            <div
              class="poster-wrapper w-full md:w-80 flex-shrink-0 relative mx-auto md:mx-0"
              style="max-width: 300px"
            >
              <div
                class="movie-poster rounded-lg overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] relative group"
              >
                <img
                  :src="movieData.poster_url"
                  :alt="movieData.name"
                  class="w-full h-full object-cover object-center"
                />

                <!-- Hover effect -->
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                ></div>

                <!-- Type badge with enhanced styling -->
                <div
                  v-if="movieData.type === 'series'"
                  class="absolute top-4 left-4 bg-gradient-to-r from-red-700 to-red-600 text-white px-3 py-1 rounded shadow-md backdrop-blur-sm text-xs font-medium"
                >
                  Phim Bộ
                </div>
                <div
                  v-else
                  class="absolute top-4 left-4 bg-gradient-to-r from-blue-700 to-blue-600 text-white px-3 py-1 rounded shadow-md backdrop-blur-sm text-xs font-medium"
                >
                  Phim Lẻ
                </div>
              </div>

              <!-- Watch button with enhanced styling -->
              <button
                @click="navigateToWatch"
                class="w-full bg-gradient-to-r from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 text-white py-3 px-6 rounded-md mt-4 font-medium flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-red-700/30 hover:shadow-red-500/40 hover:translate-y-[-2px]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>Xem Phim</span>
              </button>

              <!-- Trailer button with enhanced styling -->
              <button
                v-if="hasTrailer"
                @click="switchTab('trailerPhim')"
                class="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-3 px-6 rounded-md mt-2 font-medium flex items-center justify-center gap-2 transition-all duration-300 border border-zinc-700 hover:border-zinc-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Xem Trailer
              </button>
            </div>

            <!-- Movie Info with enhanced styling -->
            <div
              class="movie-info flex-grow backdrop-blur-sm bg-black/30 p-6 rounded-xl border border-white/10"
            >
              <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">{{ movieData.name }}</h1>
              <h2 class="text-xl text-gray-300 mb-4">
                {{ movieData.origin_name }} ({{ releaseYear }})
              </h2>

              <!-- Movie meta info with enhanced styling -->
              <div class="flex flex-wrap gap-2 mb-6">
                <span
                  class="bg-zinc-800/80 text-gray-300 px-3 py-1 rounded-full text-sm border border-zinc-700/50"
                >
                  {{ movieData.time }}
                </span>
                <span
                  class="bg-zinc-800/80 text-gray-300 px-3 py-1 rounded-full text-sm border border-zinc-700/50"
                >
                  {{ movieStatus }}
                </span>
                <span
                  class="bg-zinc-800/80 text-gray-300 px-3 py-1 rounded-full text-sm border border-zinc-700/50"
                >
                  {{ movieData.quality }}
                </span>
                <span
                  class="bg-zinc-800/80 text-gray-300 px-3 py-1 rounded-full text-sm border border-zinc-700/50"
                >
                  {{ movieData.lang }}
                </span>
              </div>

              <!-- Categories with enhanced styling -->
              <div class="mb-4">
                <h3 class="text-sm text-gray-400 mb-2 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  Thể loại:
                </h3>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="category in movieData.category"
                    :key="category.id"
                    class="bg-zinc-800/50 hover:bg-zinc-700 text-white px-3 py-1 rounded-full text-sm transition-colors cursor-pointer border border-zinc-700/30 hover:border-zinc-600"
                  >
                    {{ category.name }}
                  </span>
                </div>
              </div>

              <!-- Countries with enhanced styling -->
              <div class="mb-4">
                <h3 class="text-sm text-gray-400 mb-2 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                    />
                  </svg>
                  Quốc gia:
                </h3>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="country in movieData.country"
                    :key="country.id"
                    class="bg-zinc-800/50 hover:bg-zinc-700 text-white px-3 py-1 rounded-full text-sm transition-colors cursor-pointer border border-zinc-700/30 hover:border-zinc-600"
                  >
                    {{ country.name }}
                  </span>
                </div>
              </div>

              <!-- Directors with enhanced styling -->
              <div v-if="movieData.director && movieData.director.length > 0" class="mb-4">
                <h3 class="text-sm text-gray-400 mb-2 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  Đạo diễn:
                </h3>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="(director, index) in movieData.director"
                    :key="index"
                    class="text-white text-sm py-1"
                  >
                    {{ director }}{{ index < movieData.director.length - 1 ? ', ' : '' }}
                  </span>
                </div>
              </div>

              <!-- Actors with enhanced styling -->
              <div v-if="movieData.actor && movieData.actor.length > 0" class="mb-4">
                <h3 class="text-sm text-gray-400 mb-2 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Diễn viên:
                </h3>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="(actor, index) in movieData.actor"
                    :key="index"
                    class="text-white text-sm py-1"
                  >
                    {{ actor }}{{ index < movieData.actor.length - 1 ? ', ' : '' }}
                  </span>
                </div>
              </div>

              <!-- Current Episode with enhanced styling -->
              <div v-if="movieData.type === 'series'" class="mt-6 mb-2">
                <div
                  class="bg-gradient-to-r from-red-900/70 to-red-800/40 px-6 py-4 rounded-lg inline-flex items-center border border-red-700/50 shadow-lg"
                >
                  <span class="font-semibold mr-2">Tập mới nhất:</span>
                  <span class="text-red-400 font-bold text-xl">{{
                    movieData.episode_current
                  }}</span>
                  <span class="text-gray-400 mx-1">/</span>
                  <span>{{ movieData.episode_total || '?' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Tabs -->
      <div class="container mx-auto px-4 mt-8">
        <div class="tab-navigation flex overflow-x-auto scrollbar-hide">
          <button
            @click="switchTab('thongTin')"
            class="px-6 py-3 font-medium transition-all duration-300 relative"
            :class="activeTab === 'thongTin' ? 'text-red-500' : 'text-gray-400 hover:text-white'"
          >
            <span class="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Thông tin phim
            </span>
            <div
              v-if="activeTab === 'thongTin'"
              class="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-red-700 to-red-500"
            ></div>
          </button>
          <button
            @click="switchTab('galleryPhim')"
            class="px-6 py-3 font-medium transition-all duration-300 relative"
            :class="activeTab === 'galleryPhim' ? 'text-red-500' : 'text-gray-400 hover:text-white'"
          >
            <span class="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Gallery phim
            </span>
            <div
              v-if="activeTab === 'galleryPhim'"
              class="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-red-700 to-red-500"
            ></div>
          </button>
          <button
            v-if="hasActors"
            @click="switchTab('dienVien')"
            class="px-6 py-3 font-medium transition-all duration-300 relative"
            :class="activeTab === 'dienVien' ? 'text-red-500' : 'text-gray-400 hover:text-white'"
          >
            <span class="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Diễn viên
            </span>
            <div
              v-if="activeTab === 'dienVien'"
              class="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-red-700 to-red-500"
            ></div>
          </button>
          <button
            @click="switchTab('phimDeXuat')"
            class="px-6 py-3 font-medium transition-all duration-300 relative"
            :class="activeTab === 'phimDeXuat' ? 'text-red-500' : 'text-gray-400 hover:text-white'"
          >
            <span class="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              Phim đề xuất
            </span>
            <div
              v-if="activeTab === 'phimDeXuat'"
              class="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-red-700 to-red-500"
            ></div>
          </button>
        </div>

        <div class="border-b border-zinc-800 mt-[-1px]"></div>

        <!-- Tab Content with enhanced styling -->
        <div class="tab-content pt-8">
          <!-- Thông tin phim tab -->
          <div v-if="activeTab === 'thongTin'" class="movie-description">
            <div class="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 backdrop-blur-sm">
              <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                  />
                </svg>
                Nội dung phim
              </h2>
              <div class="text-gray-300 leading-relaxed space-y-4" v-html="formattedContent"></div>

              <!-- Server Information -->
              <div v-if="hasEpisodes" class="mt-8">
                <h3 class="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                    />
                  </svg>
                  Phiên bản phim
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Vietsub Server -->
                  <div v-if="episodes.some(server => server.server_name.toLowerCase().includes('vietsub'))" 
                       class="bg-zinc-800/70 border border-zinc-700 rounded-lg p-4 transition-all hover:border-red-500/40 hover:shadow-md hover:shadow-red-500/10">
                    <div class="flex items-center mb-3">
                      <div class="bg-gradient-to-r from-blue-600 to-blue-500 w-10 h-10 rounded-full flex items-center justify-center mr-3 shadow-lg shadow-blue-500/20">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                        </svg>
                      </div>
                      <div>
                        <h4 class="text-white font-medium">Vietsub</h4>
                        <p class="text-gray-400 text-sm">Phụ đề tiếng Việt</p>
                      </div>
                    </div>
                    <div class="pl-2 border-l-2 border-blue-500">
                      <p class="text-gray-300 text-sm">
                        Server phụ đề tiếng Việt chất lượng cao, được cập nhật nhanh nhất
                      </p>
                    </div>
                  </div>

                  <!-- Thuyết Minh Server -->
                  <div v-if="episodes.some(server => server.server_name.toLowerCase().includes('thuyết minh') || server.server_name.toLowerCase().includes('thuyet minh'))" 
                       class="bg-zinc-800/70 border border-zinc-700 rounded-lg p-4 transition-all hover:border-red-500/40 hover:shadow-md hover:shadow-red-500/10">
                    <div class="flex items-center mb-3">
                      <div class="bg-gradient-to-r from-purple-600 to-purple-500 w-10 h-10 rounded-full flex items-center justify-center mr-3 shadow-lg shadow-purple-500/20">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                      </div>
                      <div>
                        <h4 class="text-white font-medium">Thuyết Minh</h4>
                        <p class="text-gray-400 text-sm">Lồng tiếng Việt</p>
                      </div>
                    </div>
                    <div class="pl-2 border-l-2 border-purple-500">
                      <p class="text-gray-300 text-sm">
                        Phiên bản lồng tiếng Việt chất lượng cao
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-6 space-y-4">
                <!-- Additional movie details -->
                <div
                  v-if="movieData?.is_copyright"
                  class="flex items-center gap-2 text-sm text-gray-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <span>Phim bản quyền</span>
                </div>
                <div
                  v-if="movieData?.sub_docquyen"
                  class="flex items-center gap-2 text-sm text-gray-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                  <span>Phụ đề độc quyền</span>
                </div>
                <div
                  v-if="movieData?.chieurap"
                  class="flex items-center gap-2 text-sm text-gray-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                    />
                  </svg>
                  <span>Phim chiếu rạp</span>
                </div>
                <div v-if="movieData?.view" class="flex items-center gap-2 text-sm text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <span>Lượt xem: {{ movieData.view.toLocaleString() }}</span>
                </div>
                <div v-if="movieData?.notify" class="flex items-center gap-2 text-sm text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <span>{{ movieData.notify }}</span>
                </div>
                <div
                  v-if="movieData?.showtimes"
                  class="flex items-center gap-2 text-sm text-gray-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Lịch chiếu: {{ movieData.showtimes }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Gallery tab (previously Trailer tab) -->
          <div v-else-if="activeTab === 'galleryPhim'" class="gallery-container">
            <div class="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 backdrop-blur-sm">
              <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Gallery phim {{ movieData?.name }}
              </h2>

              <!-- Videos section -->
              <div class="mb-8">
                <h3 class="text-lg font-semibold mb-4 text-gray-200">Video</h3>
                <div
                  v-if="trailerYoutubeId"
                  class="aspect-video w-full max-w-3xl mx-auto bg-black rounded-lg overflow-hidden shadow-xl"
                >
                  <iframe
                    class="w-full h-full"
                    :src="`https://www.youtube.com/embed/${trailerYoutubeId}`"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                </div>
                <div
                  v-else
                  class="text-center py-10 text-gray-400 bg-zinc-800/40 rounded-lg border border-dashed border-zinc-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-12 w-12 mx-auto mb-4 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <p>Không có video cho phim này</p>
                  <div
                    class="w-64 h-64 mx-auto mt-4 bg-contain bg-center bg-no-repeat"
                    style="
                      background-image: url('https://media.giphy.com/media/26n6WywJyh39n1pBu/giphy.gif');
                    "
                  ></div>
                </div>
              </div>

              <!-- Images section -->
              <div>
                <h3 class="text-lg font-semibold mb-4 text-gray-200">Hình ảnh</h3>

                <div
                  v-if="movieData?.poster_url || movieData?.thumb_url"
                  class="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div v-if="movieData?.poster_url" class="overflow-hidden rounded-lg shadow-lg">
                    <h4 class="text-sm font-medium text-gray-400 mb-2">Poster phim</h4>
                    <img
                      :src="movieData.poster_url"
                      :alt="`Poster ${movieData.name}`"
                      class="w-full object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div v-if="movieData?.thumb_url" class="overflow-hidden rounded-lg shadow-lg">
                    <h4 class="text-sm font-medium text-gray-400 mb-2">Thumbnail phim</h4>
                    <img
                      :src="movieData.thumb_url"
                      :alt="`Thumbnail ${movieData.name}`"
                      class="w-full object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                <div
                  v-else
                  class="text-center py-10 text-gray-400 bg-zinc-800/40 rounded-lg border border-dashed border-zinc-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-12 w-12 mx-auto mb-4 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p>Không có hình ảnh cho phim này</p>
                  <div
                    class="w-64 h-64 mx-auto mt-4 bg-contain bg-center bg-no-repeat"
                    style="
                      background-image: url('https://media.giphy.com/media/3zhxq2ttgN6rQZzTqt/giphy.gif');
                    "
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Diễn viên tab -->
          <div v-else-if="activeTab === 'dienVien'" class="actors-container">
            <div class="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 backdrop-blur-sm">
              <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Diễn viên
              </h2>

              <div
                v-if="movieData?.actor && movieData.actor.length > 0"
                class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
              >
                <div v-for="(actor, index) in movieData.actor" :key="index" class="text-center">
                  <div
                    class="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center mb-2"
                  >
                    <!-- Actor placeholder -->
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-12 w-12 text-zinc-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div class="text-sm font-medium">{{ actor }}</div>
                </div>
              </div>

              <div
                v-else
                class="text-center py-10 text-gray-400 bg-zinc-800/40 rounded-lg border border-dashed border-zinc-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-12 w-12 mx-auto mb-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <p>Không có thông tin diễn viên cho phim này</p>
              </div>
            </div>
          </div>

          <!-- Phim đề xuất tab -->
          <div v-else-if="activeTab === 'phimDeXuat'" class="recommended-container">
            <div class="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 backdrop-blur-sm">
              <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                Có thể bạn sẽ thích
              </h2>

              <!-- Loading state -->
              <div v-if="isLoadingRecommended" class="flex justify-center py-8">
                <div class="loader-small">
                  <div class="film-reel-small"></div>
                </div>
              </div>

              <!-- Movies grid -->
              <div
                v-else-if="recommendedMovies.length > 0"
                class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4"
              >
                <div
                  v-for="movie in recommendedMovies"
                  :key="movie._id"
                  class="movie-card group cursor-pointer"
                  @click="navigateToMovie(movie.slug)"
                >
                  <div
                    class="aspect-[2/3] rounded-lg overflow-hidden bg-zinc-800 relative shadow-md mb-2"
                  >
                    <img
                      :src="movie.poster_url || movie.thumb_url"
                      :alt="movie.name"
                      class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div
                      class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    ></div>

                    <!-- Info overlay on hover -->
                    <div
                      class="absolute bottom-0 left-0 right-0 p-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                    >
                      <div class="flex gap-1 flex-wrap">
                        <span class="bg-red-600 text-white text-xs px-1.5 py-0.5 rounded">
                          {{ movie.quality }}
                        </span>
                        <span
                          v-if="movie.type === 'series'"
                          class="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded"
                        >
                          {{ movie.episode_current }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <h3
                    class="text-sm font-medium truncate group-hover:text-red-500 transition-colors"
                  >
                    {{ movie.name }}
                  </h3>
                  <p class="text-xs text-gray-400 truncate">
                    {{ movie.origin_name }} ({{ movie.year }})
                  </p>
                </div>
              </div>

              <div
                v-else
                class="text-center py-10 text-gray-400 bg-zinc-800/40 rounded-lg border border-dashed border-zinc-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-12 w-12 mx-auto mb-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <p>Không tìm thấy phim đề xuất</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.movie-backdrop {
  position: relative;
  overflow: hidden;
  padding-top: 30px;
}

.movie-backdrop::before {
  content: '';
  position: absolute;
  inset: 0;
  background-position: center;
  background-size: cover;
  opacity: 0.1;
  z-index: 0;
}

.movie-poster {
  aspect-ratio: 2/3;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  transform: translateZ(0);
  backface-visibility: hidden;
}

.movie-poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.poster-wrapper:hover .movie-poster {
  transform: scale(1.03);
  box-shadow: 0 0 40px rgba(220, 38, 38, 0.2);
}

/* Cinematic aspect */
.tab-navigation {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.tab-navigation::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

/* Enhanced loader animation */
.loader {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.film-reel {
  width: 70px;
  height: 70px;
  border: 4px solid rgba(220, 38, 38, 0.1);
  border-radius: 50%;
  border-top-color: #dc2626;
  animation: spin 1s infinite cubic-bezier(0.6, 0.15, 0.4, 0.85);
  position: relative;
  background: linear-gradient(45deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1));
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
}

.film-reel::before {
  content: '';
  position: absolute;
  top: 7px;
  left: 7px;
  right: 7px;
  bottom: 7px;
  border-radius: 50%;
  border: 2px dashed rgba(255, 255, 255, 0.3);
  animation: spin 7s infinite linear reverse;
}

.film-reel::after {
  content: '';
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  bottom: 20px;
  border-radius: 50%;
  background-color: rgba(220, 38, 38, 0.15);
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Subtle pulsing animation for buttons */
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.03);
  }
}

/* Film grain effect */
.movie-description,
.gallery-container,
.actors-container,
.recommended-container {
  position: relative;
}

.movie-description::before,
.gallery-container::before,
.actors-container::before,
.recommended-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.03;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=');
}

/* Sheen effect for buttons */
@keyframes sheen {
  0% {
    transform: translateX(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(200%) rotate(45deg);
  }
}

.movie-ticket-btn:hover::after {
  animation: sheen 1s forwards;
}

/* Movie card hover effects */
.movie-card:hover img {
  transform: scale(1.05);
}

/* Responsive styling with enhanced effects */
@media (max-width: 768px) {
  .movie-backdrop {
    padding-top: 20px;
  }

  .tab-navigation {
    overflow-x: auto;
  }

  .tab-navigation button {
    white-space: nowrap;
  }

  .movie-info {
    margin-top: 1rem;
  }
}

/* Dark backdrop for better contrast */
.movie-detail-page {
  background-color: #0c0c0c;
  background-image:
    radial-gradient(circle at 15% 50%, rgba(25, 25, 25, 0.2) 0%, transparent 40%),
    radial-gradient(circle at 85% 30%, rgba(35, 35, 35, 0.2) 0%, transparent 50%);
}

/* Cinematic glow effect for important elements */
.movie-info h1 {
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
}

/* Improve scrolling experience */
.content-section {
  scroll-behavior: smooth;
}

/* Custom scrollbar for browsers that support it */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: rgba(220, 38, 38, 0.5);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(220, 38, 38, 0.7);
}

/* Animation for gallery items */
.gallery-container img {
  transition: all 0.3s ease-in-out;
}

.gallery-container img:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

/* Actor circles glow effect */
.actors-container .rounded-full {
  transition: all 0.3s ease;
}

.actors-container .rounded-full:hover {
  border-color: rgba(220, 38, 38, 0.5);
  box-shadow: 0 0 12px rgba(220, 38, 38, 0.3);
}
</style>
