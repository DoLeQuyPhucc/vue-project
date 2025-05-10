<template>
  <section class="hero-section">
    <div class="hero-slider" v-if="movies.length > 0">
      <div class="hero-slides">
        <div
          v-for="(movie, index) in movies"
          :key="movie._id"
          class="hero-slide"
          :class="{ active: currentSlide === index }"
          :style="{
            backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(20, 20, 20, 0.9)), 
                             url('${movie.thumb_url}')`,
          }"
        >
          <div class="container slide-content">
            <div class="movie-info">
              <h1 class="movie-title">{{ movie.name }}</h1>
              <p class="movie-original-title">{{ movie.origin_name }}</p>
              <div class="movie-meta">
                <span class="meta-item quality">
                  <span class="meta-label">Quality:</span>
                  {{ movie.quality }}
                </span>
                <span class="meta-item episode">
                  <span class="meta-label">Episodes:</span>
                  {{ movie.episode_current }}
                </span>
                <span class="meta-item lang">
                  <span class="meta-label">Language:</span>
                  {{ movie.lang }}
                </span>
                <span class="meta-item time">
                  <span class="meta-label">Duration:</span>
                  {{ movie.time }}
                </span>
                <span class="meta-item year">
                  <span class="meta-label">Year:</span>
                  {{ movie.year }}
                </span>
              </div>
              <div class="movie-categories">
                <span v-for="category in movie.category" :key="category.id" class="category-tag">
                  {{ category.name }}
                </span>
              </div>
              <div class="cta-buttons">
                <button class="cta-button primary">Watch Now</button>
                <button class="cta-button secondary">Add to Watchlist</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Slider controls -->
      <div class="slider-controls">
        <button @click="prevSlide" class="slider-control prev" aria-label="Previous slide">
          <span class="arrow">❮</span>
        </button>
        <div class="slider-indicators">
          <button
            v-for="(_, index) in movies"
            :key="index"
            @click="goToSlide(index)"
            :class="['slider-indicator', { active: currentSlide === index }]"
            :aria-label="`Go to slide ${index + 1}`"
          ></button>
        </div>
        <button @click="nextSlide" class="slider-control next" aria-label="Next slide">
          <span class="arrow">❯</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import type { Movie } from '@/services/movieService'

const props = defineProps<{
  movies: Movie[]
}>()

const currentSlide = ref(0)
const slideInterval = ref<number | null>(null)

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % props.movies.length
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + props.movies.length) % props.movies.length
}

const goToSlide = (index: number) => {
  currentSlide.value = index
  resetInterval()
}

const startSlideshow = () => {
  stopSlideshow()
  slideInterval.value = window.setInterval(() => {
    nextSlide()
  }, 5000) // Change slide every 5 seconds
}

const stopSlideshow = () => {
  if (slideInterval.value !== null) {
    clearInterval(slideInterval.value)
    slideInterval.value = null
  }
}

const resetInterval = () => {
  stopSlideshow()
  startSlideshow()
}

// Watch for changes in the movies prop
watch(
  () => props.movies,
  (newMovies) => {
    if (newMovies.length > 0) {
      resetInterval()
    } else {
      stopSlideshow()
    }
  }
)

onMounted(() => {
  if (props.movies.length > 0) {
    startSlideshow()
  }
})

onUnmounted(() => {
  stopSlideshow()
})
</script>

<style scoped>
.hero-section {
  position: relative;
  height: 80vh;
  min-height: 500px;
  max-height: 800px;
  margin-bottom: var(--space-xl);
  overflow: hidden;
  color: var(--color-text);
}

.hero-slider {
  position: relative;
  height: 100%;
  width: 100%;
}

.hero-slides {
  position: relative;
  height: 100%;
  width: 100%;
}

.hero-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 0.8s ease;
  display: flex;
  align-items: flex-end;
}

.hero-slide.active {
  opacity: 1;
  z-index: 1;
}

.slide-content {
  padding-bottom: var(--space-xl);
  width: 100%;
}

.movie-info {
  max-width: 600px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.movie-title {
  font-size: var(--font-size-xxl);
  font-weight: 700;
  margin-bottom: var(--space-xs);
  color: white;
}

.movie-original-title {
  font-size: var(--font-size-lg);
  color: var(--color-text-muted);
  margin-bottom: var(--space-md);
}

.movie-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
}

.meta-item {
  display: flex;
  align-items: center;
  font-size: var(--font-size-sm);
  color: var(--color-text);
}

.meta-label {
  color: var(--color-text-muted);
  margin-right: var(--space-xs);
}

.movie-categories {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin-bottom: var(--space-lg);
}

.category-tag {
  background-color: rgba(255, 255, 255, 0.15);
  padding: var(--space-xs) var(--space-sm);
  border-radius: 4px;
  font-size: var(--font-size-xs);
}

.cta-buttons {
  display: flex;
  gap: var(--space-md);
  flex-wrap: wrap;
}

.cta-button {
  padding: var(--space-sm) var(--space-lg);
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.cta-button.primary {
  background-color: var(--color-primary);
  color: white;
}

.cta-button.primary:hover {
  background-color: #c00812;
}

.cta-button.secondary {
  background-color: rgba(255, 255, 255, 0.15);
  color: var(--color-text);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.cta-button.secondary:hover {
  background-color: rgba(255, 255, 255, 0.25);
}

/* Slider controls */
.slider-controls {
  position: absolute;
  bottom: var(--space-lg);
  left: 0;
  right: 0;
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-md);
}

.slider-control {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.slider-control:hover {
  background-color: var(--color-primary);
}

.arrow {
  font-size: 18px;
}

.slider-indicators {
  display: flex;
  gap: var(--space-xs);
}

.slider-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.slider-indicator.active,
.slider-indicator:hover {
  background-color: var(--color-primary);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hero-section {
    height: 60vh;
  }

  .movie-title {
    font-size: var(--font-size-xl);
  }

  .movie-original-title {
    font-size: var(--font-size-md);
  }

  .movie-meta {
    gap: var(--space-sm);
    margin-bottom: var(--space-md);
  }

  .cta-buttons {
    flex-direction: column;
    gap: var(--space-sm);
  }

  .cta-button {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .hero-section {
    height: 50vh;
    min-height: 400px;
  }

  .movie-title {
    font-size: var(--font-size-lg);
  }

  .movie-meta {
    flex-direction: column;
    gap: var(--space-xs);
  }

  .slider-control {
    width: 32px;
    height: 32px;
  }

  .slider-indicator {
    width: 8px;
    height: 8px;
  }
}
</style> 