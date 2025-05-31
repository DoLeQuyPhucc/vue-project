<template>
  <div class="movie-card transition-all duration-300 transform hover:scale-105">
    <router-link :to="`/phim/${movie.slug}`">
      <div class="poster-container rounded-lg overflow-hidden shadow-lg relative group">
        <img
          :src="`${cdnUrl}/${movie.poster_url || movie.thumb_url}`"
          :alt="movie.name"
          class="w-full h-full object-cover"
          loading="lazy"
        />
        <!-- Hover overlay -->
        <div
          class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3"
        >
          <div
            class="badge bg-blue-600 inline-block px-2 py-1 text-xs text-white rounded mb-2 w-max"
          >
            {{ movie.quality }}
          </div>
          <div v-if="movie.episode_current" class="text-gray-400 text-sm">
            {{ movie.episode_current }}
          </div>
          <div v-if="movie.time" class="text-gray-400 text-sm">
            {{ movie.time }}
          </div>
        </div>
      </div>

      <!-- Movie titles below image -->
      <div class="mt-3 px-1">
        <!-- Vietnamese name (prominent) -->
        <h3 class="text-white font-semibold text-sm md:text-base line-clamp-2 leading-tight mb-1">
          {{ movie.name }}
        </h3>
        <!-- English/Original name (smaller) -->
        <p class="text-gray-400 text-xs md:text-sm line-clamp-1 leading-tight">
          {{ movie.origin_name }}
        </p>
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
interface Movie {
  _id: string
  slug: string
  name: string
  origin_name: string
  poster_url?: string
  thumb_url?: string
  quality: string
  episode_current?: string
  time?: string
}

interface Props {
  movie: Movie
  cdnUrl: string
}

defineProps<Props>()
</script>

<style scoped>
.movie-card {
  flex: 0 0 auto;
  position: relative;
  cursor: pointer;
}

.poster-container {
  width: 180px;
  height: 270px;
}

/* Grid layout - responsive sizing */
.movie-card:not(.carousel-item) .poster-container {
  width: 100%;
  aspect-ratio: 2/3;
  min-height: 200px;
  height: auto;
}

/* For larger screens in carousel */
@media (min-width: 768px) {
  .poster-container {
    width: 220px;
    height: 330px;
  }

  /* Grid layout responsive sizing */
  .movie-card:not(.carousel-item) .poster-container {
    min-height: 250px;
  }
}

@media (min-width: 1024px) {
  .movie-card:not(.carousel-item) .poster-container {
    min-height: 300px;
  }
}

/* Line clamp utilities */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
