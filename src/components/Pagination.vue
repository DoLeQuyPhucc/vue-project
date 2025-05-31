<template>
  <div v-if="totalPages > 1" class="flex justify-center items-center space-x-2 py-8">
    <!-- Previous button -->
    <button
      @click="goToPage(currentPage - 1)"
      :disabled="currentPage === 1"
      class="px-3 py-2 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 19l-7-7 7-7"
        ></path>
      </svg>
    </button>

    <!-- First page -->
    <button
      v-if="showFirstPage"
      @click="goToPage(1)"
      class="px-3 py-2 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 transition-colors"
    >
      1
    </button>

    <!-- First ellipsis -->
    <span v-if="showFirstEllipsis" class="px-2 text-zinc-400">...</span>

    <!-- Page numbers -->
    <button
      v-for="page in visiblePages"
      :key="page"
      @click="goToPage(page)"
      :class="[
        'px-3 py-2 rounded-lg transition-colors',
        page === currentPage ? 'bg-red-600 text-white' : 'bg-zinc-800 text-white hover:bg-zinc-700',
      ]"
    >
      {{ page }}
    </button>

    <!-- Last ellipsis -->
    <span v-if="showLastEllipsis" class="px-2 text-zinc-400">...</span>

    <!-- Last page -->
    <button
      v-if="showLastPage"
      @click="goToPage(totalPages)"
      class="px-3 py-2 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 transition-colors"
    >
      {{ totalPages }}
    </button>

    <!-- Next button -->
    <button
      @click="goToPage(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="px-3 py-2 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5l7 7-7 7"
        ></path>
      </svg>
    </button>
  </div>

  <!-- Page info -->
  <div class="text-center text-zinc-400 text-sm mb-4">
    Trang {{ currentPage }} / {{ totalPages }} ({{ totalItems }} phim)
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  totalItems: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['page-change'])

const goToPage = (page) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('page-change', page)
  }
}

// Calculate visible pages
const visiblePages = computed(() => {
  const delta = 2 // Number of pages to show on each side of current page
  const range = []
  const rangeWithDots = []

  for (
    let i = Math.max(2, props.currentPage - delta);
    i <= Math.min(props.totalPages - 1, props.currentPage + delta);
    i++
  ) {
    range.push(i)
  }

  return range
})

const showFirstPage = computed(() => {
  return props.totalPages > 1 && !visiblePages.value.includes(1)
})

const showLastPage = computed(() => {
  return props.totalPages > 1 && !visiblePages.value.includes(props.totalPages)
})

const showFirstEllipsis = computed(() => {
  return visiblePages.value.length > 0 && visiblePages.value[0] > 2
})

const showLastEllipsis = computed(() => {
  return (
    visiblePages.value.length > 0 &&
    visiblePages.value[visiblePages.value.length - 1] < props.totalPages - 1
  )
})
</script>
