<script setup>
import { ref, computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const props = defineProps({
  movie: {
    type: Object,
    required: false,
    default: () => null
  },
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'play'])

const formattedRating = computed(() => {
  if (!props.movie || !props.movie.imdb_rating) return 'N/A'
  return props.movie.imdb_rating.toFixed(1)
})

const formattedCategories = computed(() => {
  if (!props.movie || !props.movie.category) return []
  return props.movie.category.slice(0, 3)
})

const truncatedContent = computed(() => {
  if (!props.movie || !props.movie.content) return ''
  return props.movie.content.length > 120 
    ? props.movie.content.substring(0, 120) + '...'
    : props.movie.content
})
</script>

<template>
  <div 
    v-if="movie && visible" 
    class="movie-card-modal"
  >
    <div class="movie-card-modal-content bg-zinc-900 text-white rounded-lg shadow-xl overflow-hidden w-72 border border-zinc-700">
      <!-- Header with poster and rating -->
      <div class="relative h-40 bg-gradient-to-t from-zinc-900 to-zinc-800">
        <img 
          v-if="movie.poster_url || movie.thumb_url" 
          :src="movie.poster_url || movie.thumb_url" 
          :alt="movie.name" 
          class="absolute top-0 left-0 w-full h-full object-cover opacity-70"
        />
        <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-zinc-900 via-zinc-900/70 to-transparent"></div>
        
        <!-- Rating badge -->
        <div class="absolute top-3 right-3 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-md flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
          {{ formattedRating }}
        </div>
        
        <!-- Play button -->
        <div class="absolute inset-0 flex items-center justify-center">
          <button 
            @click="emit('play')" 
            class="w-12 h-12 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors duration-200"
          >
            <FontAwesomeIcon :icon="['fas', 'play']" class="text-white text-lg" />
          </button>
        </div>
      </div>
      
      <!-- Content -->
      <div class="p-4">
        <!-- Title -->
        <h3 class="font-bold text-base mb-1 line-clamp-1">{{ movie.name }}</h3>
        <p class="text-zinc-400 text-xs mb-2">{{ movie.origin_name }} ({{ movie.year || 'N/A' }})</p>
        
        <!-- Categories -->
        <div class="flex flex-wrap gap-1 mb-3">
          <span 
            v-for="(category, idx) in formattedCategories" 
            :key="idx" 
            class="text-2xs px-1.5 py-0.5 bg-zinc-800 rounded-sm text-zinc-300"
          >
            {{ category.name }}
          </span>
        </div>
        
        <!-- Description -->
        <p class="text-xs text-zinc-300 line-clamp-3">{{ truncatedContent }}</p>
        
        <!-- Quality tag -->
        <div class="mt-3 flex justify-between items-center">
          <span class="inline-block px-2 py-0.5 bg-zinc-800 rounded text-2xs uppercase font-medium">
            {{ movie.quality || 'HD' }}
          </span>
          <span class="text-xs text-zinc-400">{{ movie.time || '? phút' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.movie-card-modal {
  position: absolute;
  z-index: 50;
  transform: translateY(10px);
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(10px); }
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.text-2xs {
  font-size: 0.65rem;
}
</style> 