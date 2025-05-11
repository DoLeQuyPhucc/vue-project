<template>
  <div class="hero-section">
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="carousel-container">
      <button @click="prevSlide" class="nav-button prev">&lt;</button>
      <div class="carousel">
        <div class="carousel-track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
          <div v-for="movie in movies" :key="movie._id" class="carousel-item">
            <div class="movie-banner">
              <img :src="movie.thumb_url" :alt="movie.name" class="movie-banner-image" />
              <div class="movie-overlay">
                <div class="quality-badge">{{ movie.quality }}</div>
                <div class="movie-content">
                  <h2 class="movie-title">{{ movie.name }}</h2>
                  <div class="movie-meta">
                    <span class="movie-year">{{ movie.year }}</span>
                    <span class="movie-type">{{ movie.type }}</span>
                    <span class="movie-time">{{ movie.time }}</span>
                  </div>
                  <div class="movie-status">
                    <span class="movie-episode">{{ movie.episode_current }}</span>
                    <span class="movie-lang">{{ movie.lang }}</span>
                  </div>
                  <div class="movie-actions">
                    <button class="btn-watch">Xem chi tiết</button>
                    <button class="btn-bookmark">
                      <span class="bookmark-icon">♥</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button @click="nextSlide" class="nav-button next">&gt;</button>
      <div class="carousel-dots">
        <span
          v-for="(_, index) in movies.slice(0, 10)"
          :key="index"
          :class="['dot', { active: index === currentIndex }]"
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
      this.currentIndex = (this.currentIndex - 1 + this.movies.length) % this.movies.length
    },
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.movies.length
    },
  },
  mounted() {
    this.fetchMovies()
    // Auto slide every 5 seconds
    setInterval(() => {
      if (this.movies.length > 0) {
        this.nextSlide()
      }
    }, 5000)
  },
}
</script>

<style>
.hero-section {
  position: relative;
  width: 100%;
  overflow: hidden;
  margin-bottom: 0;
}

.carousel-container {
  position: relative;
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
}

.carousel {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.carousel-track {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.5s ease;
}

.carousel-item {
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
}

.movie-banner {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.movie-banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.movie-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.4) 60%, transparent);
  color: white;
  padding: 4rem 2rem 2rem;
}

.quality-badge {
  position: absolute;
  top: -25px;
  left: 20px;
  background-color: #ff6b6b;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
}

.movie-content {
  max-width: 800px;
}

.movie-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.movie-meta,
.movie-status {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.movie-meta span,
.movie-status span {
  display: inline-block;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 4px 10px;
  border-radius: 4px;
}

.movie-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-watch {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-watch:hover {
  background-color: #45a049;
}

.btn-bookmark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-bookmark:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  z-index: 1;
  transition: background-color 0.3s;
}

.nav-button:hover {
  background-color: rgba(0, 0, 0, 0.7);
}

.nav-button.prev {
  left: 20px;
}

.nav-button.next {
  right: 20px;
}

.carousel-dots {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: background-color 0.3s;
}

.dot.active {
  background-color: white;
}

.loading,
.error {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50vh;
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .movie-title {
    font-size: 2rem;
  }

  .movie-meta,
  .movie-status {
    font-size: 0.8rem;
  }
}
</style>
