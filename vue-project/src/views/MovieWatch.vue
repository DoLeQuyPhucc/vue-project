<template>
  <div class="bg-zinc-900 min-h-screen text-white pt-16">
    <!-- Header with movie title and back button -->
    <div class="relative z-10">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center gap-4">
          <router-link
            :to="'/'"
            class="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-800/70 hover:bg-zinc-700/70 text-white transition-colors"
          >
            <font-awesome-icon :icon="['fas', 'arrow-left']" />
          </router-link>
          <h1 class="text-xl font-medium text-white">Xem phim {{ movie.name || 'Đang tải...' }}</h1>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 pb-12">
      <!-- Loading state -->
      <div v-if="loading" class="w-full">
        <div
          class="bg-zinc-800 aspect-video w-full mb-6 rounded overflow-hidden animate-pulse"
        ></div>
        <div class="h-8 w-2/3 bg-zinc-800 rounded mb-4 animate-pulse"></div>
        <div class="h-4 w-1/2 bg-zinc-800 rounded mb-2 animate-pulse"></div>
        <div class="h-4 w-1/3 bg-zinc-800 rounded mb-8 animate-pulse"></div>
        <div class="flex gap-2 mb-4">
          <div v-for="i in 5" :key="i" class="h-10 w-14 bg-zinc-800 rounded animate-pulse"></div>
        </div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="flex flex-col items-center justify-center py-12">
        <div class="text-5xl text-red-500 mb-4">
          <font-awesome-icon :icon="['fas', 'exclamation-circle']" />
        </div>
        <div class="text-xl text-red-500 mb-2">{{ error }}</div>
        <p class="text-zinc-400 mb-6">Không thể tải phim. Vui lòng thử lại sau.</p>
        <router-link to="/" class="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-full transition">
          Trở về trang chủ
        </router-link>
      </div>

      <!-- Content -->
      <div v-else class="flex flex-col mt-4">
        <!-- Video player container -->
        <div class="relative group mb-8">
          <!-- Movie info overlay - hidden by default, visible on group hover -->
          <div
            class="absolute top-0 left-0 w-full z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <div class="flex flex-col">
              <div class="p-4 text-white bg-gradient-to-b from-black/80 to-transparent">
                <div class="flex items-center justify-between">
                  <div>
                    <h2 class="text-2xl font-bold mb-1">{{ movie.name }}</h2>
                    <div class="text-sm opacity-80">
                      {{
                        currentEpisode
                          ? `Phần ${movie.episode_current} - ${currentEpisode.name}`
                          : ''
                      }}
                    </div>
                  </div>

                  <button
                    v-if="episodes.length > 1"
                    @click="toggleSideEpisodesPanel"
                    class="px-4 py-2 bg-zinc-800/70 hover:bg-zinc-700 rounded-full text-white text-sm transition flex items-center gap-2"
                  >
                    <font-awesome-icon :icon="['fas', 'list']" />
                    Danh sách tập
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-black aspect-video w-full rounded-lg overflow-hidden">
            <div
              v-if="isChangingEpisode"
              class="absolute inset-0 flex items-center justify-center bg-black/80 z-10"
            >
              <div class="flex flex-col items-center">
                <font-awesome-icon
                  :icon="['fas', 'spinner']"
                  class="text-4xl text-white mb-4 animate-spin"
                />
                <div class="text-lg">Đang tải tập phim...</div>
              </div>
            </div>

            <iframe
              v-if="currentEpisode && currentEpisode.link_embed"
              :src="currentEpisode.link_embed"
              class="w-full h-full"
              allowfullscreen
              frameborder="0"
              ref="videoPlayer"
              @load="onVideoLoad"
            ></iframe>

            <div v-else class="flex items-center justify-center h-full">
              <div class="text-xl">Không có video</div>
            </div>
          </div>

          <!-- Hover controls - only visible on hover -->
          <div
            class="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          ></div>

          <!-- Side Episodes Panel -->
          <div
            v-if="showSideEpisodesPanel && episodes.length > 1"
            class="absolute top-0 right-0 h-full bg-zinc-900/90 backdrop-blur-sm w-72 shadow-lg z-20 overflow-auto transition-transform duration-300 ease-in-out"
            :class="showSideEpisodesPanel ? 'translate-x-0' : 'translate-x-full'"
          >
            <div class="p-4">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold">Danh sách tập</h3>
                <button
                  @click="showSideEpisodesPanel = false"
                  class="text-zinc-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-700/50"
                >
                  <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="episode in episodes"
                  :key="episode.slug"
                  :class="[
                    'px-3 py-2 rounded-lg transition text-sm flex items-center justify-center',
                    currentEpisode && currentEpisode.slug === episode.slug
                      ? 'bg-red-600 text-white'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-white',
                  ]"
                  @click="playEpisode(episode)"
                >
                  {{ episode.name }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Episodes panel (conditionally shown) -->
        <div
          v-if="showEpisodesPanel && episodes.length > 1"
          class="bg-zinc-800/70 backdrop-blur-sm rounded-xl p-4 mb-8 transform transition-all duration-300 ease-in-out"
          :class="showEpisodesPanel ? 'opacity-100 scale-100' : 'opacity-0 scale-95'"
        >
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Danh sách tập</h3>
            <button
              @click="showEpisodesPanel = false"
              class="text-zinc-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-700/50"
            >
              <font-awesome-icon :icon="['fas', 'times']" />
            </button>
          </div>

          <div class="flex flex-wrap gap-2">
            <button
              v-for="episode in episodes"
              :key="episode.slug"
              :class="[
                'px-3 py-1.5 rounded-full transition text-sm',
                currentEpisode && currentEpisode.slug === episode.slug
                  ? 'bg-red-600 text-white'
                  : 'bg-zinc-700 hover:bg-zinc-600 text-white',
              ]"
              @click="playEpisode(episode)"
            >
              {{ episode.name }}
            </button>
          </div>
        </div>

        <!-- Movie details -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Left column: Movie info -->
          <div class="md:col-span-2">
            <h2 class="text-2xl font-bold mb-4">{{ movie.name }}</h2>
            <div class="flex flex-wrap gap-2 mb-6">
              <span
                v-for="(category, idx) in movie.category"
                :key="idx"
                class="inline-flex items-center bg-zinc-800/50 px-2.5 py-1 rounded-full text-sm cursor-pointer hover:bg-zinc-700 transition"
                @click="goToCategory(category)"
              >
                {{ category.name }}
              </span>
              <span
                class="inline-flex items-center bg-zinc-800/50 px-2.5 py-1 rounded-full text-sm"
              >
                {{ movie.year }}
              </span>
              <span
                class="inline-flex items-center bg-zinc-800/50 px-2.5 py-1 rounded-full text-sm"
              >
                {{ movie.time }}
              </span>
            </div>

            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-2">Tóm tắt nội dung</h3>
              <p class="text-zinc-300 leading-relaxed">{{ movie.content }}</p>
            </div>
          </div>

          <!-- Right column: Cast & crew -->
          <div>
            <div class="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-4 mb-6">
              <h3 class="text-lg font-semibold mb-4">Diễn viên</h3>
              <div v-if="movie.actor && movie.actor.length > 0">
                <div v-for="(actor, index) in movie.actor" :key="index" class="mb-2 last:mb-0">
                  <div class="text-white">{{ actor }}</div>
                </div>
              </div>
              <div v-else class="text-zinc-500">Không có thông tin diễn viên</div>
            </div>

            <div class="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-4">
              <h3 class="text-lg font-semibold mb-4">Đạo diễn</h3>
              <div v-if="movie.director && movie.director.length > 0">
                <div
                  v-for="(director, index) in movie.director"
                  :key="index"
                  class="mb-2 last:mb-0"
                >
                  <div class="text-white">{{ director }}</div>
                </div>
              </div>
              <div v-else class="text-zinc-500">Không có thông tin đạo diễn</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Continue Watching Popup -->
    <div
      v-if="showContinuePopup"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
    >
      <div
        class="bg-zinc-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100"
      >
        <div class="text-center mb-4">
          <font-awesome-icon :icon="['fas', 'play-circle']" class="text-4xl text-red-500 mb-2" />
          <h3 class="text-xl font-bold">Tiếp tục xem?</h3>
        </div>

        <p class="text-gray-300 mb-6 text-center">
          Bạn đã xem {{ movie.name }} đến {{ formatTime(savedWatchTime) }}. Bạn muốn tiếp tục xem từ
          đó không?
        </p>

        <div class="flex gap-3 justify-center">
          <button
            @click="resumeWatching"
            class="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full transition-colors"
          >
            Tiếp tục xem
          </button>
          <button
            @click="startFromBeginning"
            class="bg-zinc-700 hover:bg-zinc-600 text-white px-5 py-2 rounded-full transition-colors"
          >
            Xem từ đầu
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getMovieDetail } from '@/services/movieService'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faPlay,
  faArrowLeft,
  faSpinner,
  faList,
  faTimes,
  faExclamationCircle,
  faPlayCircle,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Add the icons to the library
library.add(faPlay, faArrowLeft, faSpinner, faList, faTimes, faExclamationCircle, faPlayCircle)

// IndexedDB setup and helper functions
const DB_NAME = 'movieWatchDB'
const DB_VERSION = 1
const STORE_NAME = 'watchProgress'

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = (event) => {
      reject('Error opening database: ' + event.target.error)
    }

    request.onsuccess = (event) => {
      resolve(event.target.result)
    }

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      // Create object store for watch progress if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
  })
}

export default {
  components: {
    FontAwesomeIcon,
  },
  data() {
    return {
      movie: {},
      episodes: [],
      currentEpisode: null,
      loading: true,
      error: null,
      showEpisodesPanel: false,
      showSideEpisodesPanel: false,
      isChangingEpisode: false,
      showContinuePopup: false,
      savedWatchTime: 0,
      watchProgressInterval: null,
      currentWatchTime: 0,
    }
  },
  computed: {
    slug() {
      return this.$route.params.slug
    },
    progressKey() {
      return `${this.movie._id || ''}_${this.currentEpisode?.slug || ''}`
    },
  },
  methods: {
    async fetchMovie() {
      try {
        this.loading = true
        this.error = null

        const response = await getMovieDetail(this.slug)
        this.movie = response.movie

        // Get episodes from all servers
        if (response.episodes && response.episodes.length > 0) {
          // Use the first server that has episodes
          const firstServerWithEpisodes = response.episodes.find(
            (server) => server.server_data && server.server_data.length > 0,
          )

          if (firstServerWithEpisodes) {
            this.episodes = firstServerWithEpisodes.server_data
            // Set first episode as current
            await this.checkWatchProgress(this.episodes[0])
          }
        }

        this.loading = false
      } catch (error) {
        this.error = 'Không thể tải dữ liệu phim'
        this.loading = false
        console.error(error)
      }
    },
    async checkWatchProgress(episode) {
      try {
        this.currentEpisode = episode

        // Check if there's saved progress for this movie & episode
        const db = await openDB()
        const transaction = db.transaction(STORE_NAME, 'readonly')
        const store = transaction.objectStore(STORE_NAME)

        const key = `${this.movie._id}_${episode.slug}`
        const request = store.get(key)

        request.onsuccess = (event) => {
          const result = event.target.result
          if (result && result.time > 30) {
            // Only show if more than 30 seconds watched
            this.savedWatchTime = result.time
            this.showContinuePopup = true
          } else {
            // No significant progress, just start playing
            this.playEpisode(episode, false)
          }
        }

        request.onerror = () => {
          // Error reading from DB, just play the episode
          this.playEpisode(episode, false)
        }
      } catch (error) {
        console.error('Error checking watch progress:', error)
        this.playEpisode(episode, false)
      }
    },
    async saveWatchProgress(time) {
      if (!this.movie._id || !this.currentEpisode) return

      try {
        const db = await openDB()
        const transaction = db.transaction(STORE_NAME, 'readwrite')
        const store = transaction.objectStore(STORE_NAME)

        const data = {
          id: this.progressKey,
          movieId: this.movie._id,
          episodeSlug: this.currentEpisode.slug,
          movieName: this.movie.name,
          episodeName: this.currentEpisode.name,
          time: time,
          timestamp: Date.now(),
        }

        store.put(data)
      } catch (error) {
        console.error('Error saving watch progress:', error)
      }
    },
    onVideoLoad() {
      // Set up watch progress tracking
      this.setupProgressTracking()
    },
    setupProgressTracking() {
      // Clear any existing interval
      if (this.watchProgressInterval) {
        clearInterval(this.watchProgressInterval)
      }

      // Update and save progress every 5 seconds
      this.watchProgressInterval = setInterval(() => {
        try {
          // Use postMessage or another method to get current time from iframe
          // For now we'll just increment (not accurate but shows the concept)
          this.currentWatchTime += 5
          this.saveWatchProgress(this.currentWatchTime)
        } catch (error) {
          console.error('Error tracking progress:', error)
        }
      }, 5000)
    },
    resumeWatching() {
      this.showContinuePopup = false
      this.currentWatchTime = this.savedWatchTime
      this.playEpisode(this.currentEpisode, true)

      // In a real implementation, you would seek the video to savedWatchTime
      // This would typically require communication with the iframe
    },
    startFromBeginning() {
      this.showContinuePopup = false
      this.currentWatchTime = 0
      this.saveWatchProgress(0) // Reset saved progress
      this.playEpisode(this.currentEpisode, true)
    },
    playEpisode(episode, showLoading = true) {
      if (showLoading) {
        this.isChangingEpisode = true
        setTimeout(() => {
          this.currentEpisode = episode
          this.currentWatchTime = 0 // Reset watch time for new episode
          setTimeout(() => {
            this.isChangingEpisode = false
          }, 1000)
        }, 500)
      } else {
        this.currentEpisode = episode
        this.currentWatchTime = 0 // Reset watch time for new episode
      }

      // Scroll to top when changing episodes
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    toggleEpisodesPanel() {
      this.showEpisodesPanel = !this.showEpisodesPanel
    },
    toggleSideEpisodesPanel() {
      this.showSideEpisodesPanel = !this.showSideEpisodesPanel
    },
    goToCategory(category) {
      if (category && category.slug) {
        this.$router.push(`/the-loai/${category.slug}`)
      }
    },
    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = Math.floor(seconds % 60)
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    },
  },
  mounted() {
    this.fetchMovie()
  },
  beforeUnmount() {
    // Clean up interval when component is destroyed
    if (this.watchProgressInterval) {
      clearInterval(this.watchProgressInterval)
    }

    // Save final progress before leaving
    if (this.currentWatchTime > 0) {
      this.saveWatchProgress(this.currentWatchTime)
    }
  },
  watch: {
    slug() {
      // Clean up before changing movie
      if (this.watchProgressInterval) {
        clearInterval(this.watchProgressInterval)
      }

      this.fetchMovie()
    },
  },
}
</script>

<style scoped>
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

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
