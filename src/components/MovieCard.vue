<template>
  <div class="movie-card">
    <div class="poster-container">
      <img :src="movie.poster_url" :alt="movie.name" class="poster" />
      <div class="movie-info-overlay">
        <span class="quality">{{ movie.quality }}</span>
        <span class="episode">{{ movie.episode_current }}</span>
      </div>
    </div>
    <div class="movie-info">
      <h3 class="movie-title">{{ movie.name }}</h3>
      <p class="movie-original-title">{{ movie.origin_name }}</p>
      <div class="movie-meta">
        <span class="year">{{ movie.year }}</span>
        <span class="lang">{{ movie.lang }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Movie } from '@/services/movieService'

defineProps<{
  movie: Movie
}>()
</script>

<style scoped>
.movie-card {
  border-radius: 8px;
  overflow: hidden;
  background-color: #1f1f1f;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.movie-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
}

.poster-container {
  position: relative;
  padding-top: 150%; /* 2:3 aspect ratio */
  overflow: hidden;
}

.poster {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.movie-card:hover .poster {
  transform: scale(1.05);
}

.movie-info-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--space-sm);
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  display: flex;
  justify-content: space-between;
}

.quality,
.episode {
  background-color: var(--color-primary);
  color: white;
  font-size: var(--font-size-xs);
  padding: 2px 6px;
  border-radius: 4px;
}

.movie-info {
  padding: var(--space-sm);
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.movie-title {
  font-size: var(--font-size-md);
  font-weight: 600;
  margin-bottom: var(--space-xs);
  color: var(--color-text);
  /* Truncate long titles */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.movie-original-title {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin-bottom: var(--space-xs);
  /* Truncate long titles */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.movie-meta {
  display: flex;
  gap: var(--space-sm);
  margin-top: auto;
}

.year,
.lang {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  background-color: rgba(255, 255, 255, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}
</style>
