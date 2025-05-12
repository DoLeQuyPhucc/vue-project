<template>
  <div class="pt-0 pb-8 px-4 md:pb-12 relative">
    <!-- Soft top gradient overlay to blend with hero section -->
    <div class="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-zinc-900/80 to-transparent pointer-events-none"></div>
    
    <h2 class="text-2xl font-bold mb-6 text-white relative z-10">Bạn đang quan tâm gì?</h2>

    <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <div v-for="i in 6" :key="i" class="aspect-[3/2] rounded-lg bg-zinc-800 animate-pulse"></div>
    </div>

    <div v-else-if="error" class="text-red-500 p-4">
      {{ error }}
    </div>

    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <router-link
        v-for="category in categories"
        :key="category._id"
        :to="`/the-loai/${category.slug}`"
        class="relative aspect-[3/2] rounded-lg overflow-hidden group transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
        :style="{ background: getCategoryGradient(category.slug) }"
      >
        <div class="absolute inset-0 z-20 flex flex-col justify-end p-4">
          <h3 class="text-lg font-bold text-white">{{ category.name }}</h3>
          <div class="flex items-center mt-2 text-white/80 text-sm">
            <span>Xem chủ đề</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
      </router-link>

      <!-- "More categories" button -->
      <router-link
        v-if="remainingCount > 0"
        to="/the-loai"
        class="relative aspect-[3/2] rounded-lg overflow-hidden group bg-gradient-to-br from-zinc-800 to-zinc-900 transform transition-transform duration-300 hover:scale-105"
      >
        <div class="absolute inset-0 flex flex-col items-center justify-center p-4">
          <h3 class="text-lg font-bold text-white">+{{ remainingCount }} chủ đề</h3>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getCategoryList, type Category } from '@/services/categoryService'

const categories = ref<Category[]>([])
const allCategories = ref<Category[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const remainingCount = computed(() => {
  return Math.max(0, allCategories.value.length - categories.value.length)
})

function getCategoryGradient(slug: string): string {
  // Custom gradients for each category
  const gradients: Record<string, string> = {
    'hanh-dong': 'linear-gradient(135deg, #F5515F 0%, #A1051D 100%)', // Red gradient for action
    'mien-tay': 'linear-gradient(135deg, #8B6F43 0%, #634A19 100%)', // Brown/earthy for western
    'tinh-cam': 'linear-gradient(135deg, #FF7EB3 0%, #FF2C8A 100%)', // Pink for romance
    'co-trang': 'linear-gradient(135deg, #9D7553 0%, #5E4938 100%)', // Brown/gold for historical
    'hai-huoc': 'linear-gradient(135deg, #FFB347 0%, #FFCC33 100%)', // Yellow/orange for comedy
    'hoat-hinh': 'linear-gradient(135deg, #1DB9C3 0%, #7027A0 100%)', // Colorful for animation
    'phieu-luu': 'linear-gradient(135deg, #06BEB6 0%, #48B1BF 100%)', // Teal for adventure
    'kinh-di': 'linear-gradient(135deg, #2C3E50 0%, #000000 100%)', // Dark blue/black for horror
    'gia-dinh': 'linear-gradient(135deg, #8E54E9 0%, #4776E6 100%)', // Purple for family
    'than-thoai': 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)', // Deep blue for mythology
  }

  return gradients[slug] || 'linear-gradient(135deg, #514A9D 0%, #24C6DC 100%)' // Default gradient
}

const fetchCategories = async () => {
  try {
    loading.value = true
    const categories_data = await getCategoryList()
    allCategories.value = categories_data
    categories.value = categories_data.slice(0, 6) // Display only first 6 categories
    loading.value = false
  } catch (err) {
    error.value = 'Failed to load categories'
    loading.value = false
    console.error(err)
  }
}

onMounted(() => {
  fetchCategories()
})
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
</style>
