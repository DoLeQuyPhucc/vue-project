<template>
  <div class="bg-zinc-900 min-h-screen text-white pt-16 md:pt-20">
    <!-- Header with movie title and back button -->
    <div class="relative z-10">
      <div class="container mx-auto px-8 py-2 md:py-4">
        <div class="flex items-center gap-2 md:gap-4">
          <router-link
            :to="'/'"
            class="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-zinc-800/70 hover:bg-zinc-700/70 text-white transition-colors"
          >
            <font-awesome-icon :icon="['fas', 'arrow-left']" class="text-sm md:text-base" />
          </router-link>
          <h1 class="text-base md:text-xl font-medium text-white truncate">
            Xem phim {{ movie.name || 'Đang tải...' }}
          </h1>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-8 pb-8 md:pb-12">
      <!-- Loading state -->
      <div v-if="loading" class="w-full">
        <div
          class="bg-zinc-800 aspect-video w-full mb-4 md:mb-6 rounded overflow-hidden animate-pulse"
        ></div>
        <div class="h-6 md:h-8 w-2/3 bg-zinc-800 rounded mb-3 md:mb-4 animate-pulse"></div>
        <div class="h-3 md:h-4 w-1/2 bg-zinc-800 rounded mb-2 animate-pulse"></div>
        <div class="h-3 md:h-4 w-1/3 bg-zinc-800 rounded mb-6 md:mb-8 animate-pulse"></div>
        <div class="flex gap-2 mb-4 overflow-x-auto">
          <div
            v-for="i in 5"
            :key="i"
            class="h-8 md:h-10 w-12 md:w-14 bg-zinc-800 rounded animate-pulse flex-shrink-0"
          ></div>
        </div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="flex flex-col items-center justify-center py-8 md:py-12">
        <div class="text-3xl md:text-5xl text-red-500 mb-3 md:mb-4">
          <font-awesome-icon :icon="['fas', 'exclamation-circle']" />
        </div>
        <div class="text-lg md:text-xl text-red-500 mb-2">{{ error }}</div>
        <p class="text-zinc-400 mb-4 md:mb-6 text-center text-sm md:text-base">
          Không thể tải phim. Vui lòng thử lại sau.
        </p>
        <router-link
          to="/"
          class="px-8 md:px-6 py-1.5 md:py-2 bg-red-600 hover:bg-red-700 rounded-full transition text-sm md:text-base"
        >
          Trở về trang chủ
        </router-link>
      </div>

      <!-- Content -->
      <div v-else class="flex flex-col mt-2 md:mt-4">
        <!-- Video player container -->
        <div class="relative group mb-4 md:mb-8">
          <!-- Movie info overlay - hidden by default, visible on group hover -->
          <div
            class="absolute top-0 left-0 w-full z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <div class="flex flex-col">
              <div class="p-3 md:p-4 text-white bg-gradient-to-b from-black/80 to-transparent">
                <div class="flex items-center justify-between">
                  <div>
                    <h2 class="text-xl md:text-2xl font-bold mb-0.5 md:mb-1">{{ movie.name }}</h2>
                    <div class="text-xs md:text-sm opacity-80">
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
                    class="px-3 md:px-8 py-1 md:py-2 bg-zinc-800/70 hover:bg-zinc-700 rounded-full text-white text-xs md:text-sm transition flex items-center gap-1 md:gap-2"
                  >
                    <font-awesome-icon :icon="['fas', 'list']" />
                    <span class="hidden sm:inline">Danh sách tập</span>
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
                  class="text-2xl md:text-4xl text-white mb-3 md:mb-4 animate-spin"
                />
                <div class="text-sm md:text-lg">Đang tải tập phim...</div>
              </div>
            </div>

            <iframe
              v-if="currentEpisode && currentEpisode.link_embed"
              :src="currentEpisode.link_embed"
              class="w-full h-full"
              allowfullscreen
              allow="encrypted-media"
              referrerpolicy="origin"
              sandbox="allow-scripts allow-same-origin allow-forms"
              frameborder="0"
              ref="videoPlayer"
              @load="onVideoLoad"
            ></iframe>

            <div v-else class="flex items-center justify-center h-full">
              <div class="text-base md:text-xl">Không có video</div>
            </div>
          </div>

          <!-- Hover controls - only visible on hover -->
          <div
            class="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          ></div>

          <!-- Side Episodes Panel -->
          <div
            v-if="showSideEpisodesPanel && episodes.length > 1"
            class="absolute top-0 right-0 h-full bg-zinc-900/90 backdrop-blur-sm w-48 md:w-72 shadow-lg z-20 overflow-auto transition-transform duration-300 ease-in-out"
            :class="showSideEpisodesPanel ? 'translate-x-0' : 'translate-x-full'"
          >
            <div class="p-3 md:p-4">
              <div class="flex justify-between items-center mb-3 md:mb-4">
                <h3 class="text-base md:text-lg font-semibold">Danh sách tập</h3>
                <button
                  @click="showSideEpisodesPanel = false"
                  class="text-zinc-400 hover:text-white w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full hover:bg-zinc-700/50"
                >
                  <font-awesome-icon :icon="['fas', 'times']" class="text-sm md:text-base" />
                </button>
              </div>

              <div class="grid grid-cols-2 gap-1.5 md:gap-2">
                <button
                  v-for="episode in episodes"
                  :key="episode.slug"
                  :class="[
                    'px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition text-xs md:text-sm flex items-center justify-center',
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

        <!-- Mobile Episodes Horizontal Scroller -->
        <div v-if="episodes.length > 1" class="mb-4 md:hidden">
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-sm font-semibold">Tập phim</h3>
          </div>
          <div class="flex overflow-x-auto gap-1.5 pb-2 hide-scrollbar">
            <button
              v-for="episode in episodes"
              :key="episode.slug"
              :class="[
                'px-3 py-1.5 rounded-full transition text-xs flex-shrink-0',
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

        <!-- Bottom Episodes panel (larger screens) -->
        <div
          v-if="showEpisodesPanel && episodes.length > 1"
          class="hidden md:block bg-zinc-800/70 backdrop-blur-sm rounded-xl p-4 mb-8 transform transition-all duration-300 ease-in-out"
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
        <div class="flex flex-col">
          <!-- Movie title and rating -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex flex-col">
              <h1 class="text-2xl font-bold">{{ movie.name }}</h1>
              <p class="text-gray-400 mt-2">{{ movie.origin_name }}</p>
              <p class="text-gray-400">{{ movie.content }}</p>
            </div>
          </div>

          <!-- Movie info and cast -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Left column: Movie info -->
            <div class="lg:col-span-2">
              <div class="bg-zinc-800/50 rounded-xl p-4 mb-6">
                <h3 class="text-lg font-semibold mb-4">Thông tin phim</h3>
                <div class="flex gap-6">
                  <!-- Movie poster -->
                  <div class="flex-shrink-0">
                    <img
                      :src="movie.poster_url"
                      :alt="movie.name"
                      class="w-48 h-72 object-cover rounded-lg"
                    />
                  </div>

                  <!-- Movie details -->
                  <div class="flex-grow">
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <p class="text-gray-400 mb-2">
                          Trạng thái: <span class="text-white">{{ movie.episode_current }}</span>
                        </p>
                        <p class="text-gray-400 mb-2">
                          Thời lượng: <span class="text-white">{{ movie.time }}</span>
                        </p>
                        <p class="text-gray-400 mb-2">
                          Năm phát hành: <span class="text-white">{{ movie.year }}</span>
                        </p>
                        <p class="text-gray-400 mb-2">
                          Quốc gia: <span class="text-white">{{ movie.country?.[0]?.name }}</span>
                        </p>
                      </div>
                      <div>
                        <p class="text-gray-400 mb-2">Thể loại:</p>
                        <div class="flex flex-wrap gap-2">
                          <span
                            v-for="category in movie.category"
                            :key="category.id"
                            class="text-white bg-zinc-700 px-2 py-1 rounded-full text-sm"
                          >
                            {{ category.name }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Server Selection -->
              <div class="bg-zinc-800/50 rounded-xl p-4 mb-6">
                <h3 class="text-lg font-semibold mb-4">Chọn server</h3>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="(server, index) in movie.episodes"
                    :key="index"
                    class="px-4 py-2 rounded-lg text-sm transition-colors"
                    :class="[
                      currentServer === index
                        ? 'bg-red-600 text-white'
                        : 'bg-zinc-700 hover:bg-zinc-600 text-white',
                    ]"
                    @click="changeServer(index)"
                  >
                    Server #{{ index + 1 }}
                  </button>
                </div>
              </div>

              <!-- Comments section -->
              <div class="bg-zinc-800/50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-lg font-semibold">Bình luận</h3>
                  <div class="flex items-center">
                    <font-awesome-icon :icon="['fas', 'comment']" class="mr-2" />
                    <span>{{ movie.comment_count || 0 }}</span>
                  </div>
                </div>
                <!-- Comment form placeholder -->
                <div class="bg-zinc-700/50 rounded-lg p-4 text-center text-gray-400">
                  Tính năng bình luận đang được phát triển
                </div>
              </div>
            </div>

            <!-- Right column: Cast -->
            <div>
              <div class="bg-zinc-800/50 rounded-xl p-4">
                <h3 class="text-lg font-semibold mb-4">Diễn viên</h3>
                <div class="space-y-4">
                  <div v-if="movie.actor && movie.actor.length > 0">
                    <div
                      v-for="(actor, index) in movie.actor"
                      :key="index"
                      class="flex items-center gap-3 mb-3"
                    >
                      <div class="text-white">{{ actor }}</div>
                    </div>
                  </div>
                  <div v-else class="text-gray-400">Không có thông tin diễn viên</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Continue Watching Popup -->
    <div
      v-if="showContinuePopup"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-8"
    >
      <div
        class="bg-zinc-800 rounded-xl p-4 md:p-6 max-w-md w-full mx-auto shadow-2xl transform transition-all duration-300 scale-100"
      >
        <div class="text-center mb-3 md:mb-4">
          <font-awesome-icon
            :icon="['fas', 'play-circle']"
            class="text-2xl md:text-4xl text-red-500 mb-1.5 md:mb-2"
          />
          <h3 class="text-lg md:text-xl font-bold">Tiếp tục xem?</h3>
        </div>

        <p class="text-gray-300 mb-4 md:mb-6 text-center text-sm md:text-base">
          Bạn đã xem {{ movie.name }} đến {{ formatTime(savedWatchTime) }}. Bạn muốn tiếp tục xem từ
          đó không?
        </p>

        <div class="flex gap-2 md:gap-3 justify-center">
          <button
            @click="resumeWatching"
            class="bg-red-600 hover:bg-red-700 text-white px-3 md:px-5 py-1.5 md:py-2 rounded-full transition-colors text-sm md:text-base"
          >
            Tiếp tục xem
          </button>
          <button
            @click="startFromBeginning"
            class="bg-zinc-700 hover:bg-zinc-600 text-white px-3 md:px-5 py-1.5 md:py-2 rounded-full transition-colors text-sm md:text-base"
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
  faComment,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Add the icons to the library
library.add(
  faPlay,
  faArrowLeft,
  faSpinner,
  faList,
  faTimes,
  faExclamationCircle,
  faPlayCircle,
  faComment,
)

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
      currentServer: 0,
      _fetchingMovie: null,
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
      // Prevent multiple concurrent calls for the same slug
      if (this._fetchingMovie === this.slug) {
        return;
      }
      
      try {
        this._fetchingMovie = this.slug;
        this.loading = true;
        this.error = null;

        const response = await getMovieDetail(this.slug);
        this.movie = response.movie;

        // Get episodes from all servers
        if (response.episodes && response.episodes.length > 0) {
          this.movie.episodes = response.episodes;
          this.loadEpisodesFromServer(this.currentServer);
        }

        this.loading = false;
      } catch (error) {
        this.error = 'Không thể tải dữ liệu phim';
        this.loading = false;
        console.error(error);
      } finally {
        this._fetchingMovie = null;
      }
    },
    loadEpisodesFromServer(serverIndex) {
      if (this.movie.episodes && this.movie.episodes[serverIndex]) {
        const server = this.movie.episodes[serverIndex]
        if (server.server_data && server.server_data.length > 0) {
          this.episodes = server.server_data
          // Set first episode as current if no episode is selected
          if (!this.currentEpisode) {
            this.checkWatchProgress(this.episodes[0])
          }
        }
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
    changeServer(index) {
      this.currentServer = index
      this.loadEpisodesFromServer(index)
    },
    setupDevToolsProtection() {
      // Disable right-click
      document.addEventListener('contextmenu', (e) => {
        if (e.target.closest('.bg-black.aspect-video')) {
          e.preventDefault()
        }
      })

      this.checkDevToolsStatus()
    },

    checkDevToolsStatus() {
      // Try to detect if DevTools is open
      const isDevToolsOpen =
        window.outerWidth - window.innerWidth > 160 || window.outerHeight - window.innerHeight > 160

      // If player element exists and DevTools is detected as open
      const playerContainer = document.querySelector('.bg-black.aspect-video')
      if (playerContainer && isDevToolsOpen) {
        // Add visual warning
        if (!document.querySelector('.devtools-warning')) {
          const warning = document.createElement('div')
          warning.className =
            'devtools-warning absolute inset-0 bg-black/90 z-50 flex items-center justify-center'
          warning.innerHTML =
            '<div class="text-center p-4"><p class="text-xl text-red-500 font-bold mb-2">Vui lòng đóng Developer Tools</p><p class="text-gray-300">Không thể phát video khi Developer Tools đang mở</p></div>'
          playerContainer.appendChild(warning)
        }
      } else {
        // Remove warning if DevTools is closed
        const warning = document.querySelector('.devtools-warning')
        if (warning) {
          warning.remove()
        }
      }
    },
  },
  mounted() {
    this.fetchMovie()
    this.setupDevToolsProtection()

    // Add event listener for window resize which might indicate DevTools opening
    window.addEventListener('resize', this.checkDevToolsStatus)
    
    // Prevent multiple fetch calls by adding navigation guard
    this.$watch(
      () => this.$route.params.slug,
      (newSlug, oldSlug) => {
        if (newSlug !== oldSlug) {
          this.fetchMovie()
        }
      }
    )
  },
  beforeUnmount() {
    // Clean up interval when component is destroyed
    if (this.watchProgressInterval) {
      clearInterval(this.watchProgressInterval)
    }

    // Remove event listeners
    window.removeEventListener('resize', this.checkDevToolsStatus)

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

/* Hide scrollbar for Chrome, Safari and Opera */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.hide-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
