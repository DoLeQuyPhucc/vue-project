<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
    <MovieCard v-for="movie in movies" :key="movie._id" :movie="movie" :cdn-url="cdnUrl" />
  </div>
</template>

<script setup>
import MovieCard from './MovieCard.vue'

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
/* Grid specific styles if needed */
</style>
