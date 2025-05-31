<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
    <div
      v-for="movie in movies"
      :key="movie._id"
      class="movie-item transition-all duration-300 transform hover:scale-105"
    >
      <router-link :to="`/phim/${movie.slug}`">
        <div class="poster-container rounded-lg overflow-hidden shadow-lg relative group">
          <img
            :src="`${cdnUrl}/${movie.poster_url || movie.thumb_url}`"
            :alt="movie.name"
            class="w-full h-full object-cover"
            loading="lazy"
          />
          <div
            class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3"
          >
            <div
              class="badge bg-blue-600 inline-block px-2 py-1 text-xs text-white rounded mb-2 w-max"
            >
              {{ movie.quality }}
            </div>
            <div class="text-white font-semibold truncate">{{ movie.name }}</div>
            <div class="text-gray-300 text-sm truncate">{{ movie.origin_name }}</div>
            <div v-if="movie.time" class="text-gray-400 text-sm mt-1">{{ movie.time }}</div>
            <div v-if="movie.episode_current" class="text-gray-400 text-sm">
              {{ movie.episode_current }}
            </div>
            <div class="text-gray-400 text-sm">{{ movie.year }}</div>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  movies: {
    type: Array,
    required: true,
  },
  cdnUrl: {
    type: String,
    default: 'https://phimimg.com',
  },
})
</script>

<style scoped>
.movie-item {
  cursor: pointer;
}

.poster-container {
  width: 100%;
  aspect-ratio: 2/3;
  min-height: 200px;
}

/* For larger screens */
@media (min-width: 768px) {
  .poster-container {
    min-height: 250px;
  }
}

@media (min-width: 1024px) {
  .poster-container {
    min-height: 300px;
  }
}
</style>
