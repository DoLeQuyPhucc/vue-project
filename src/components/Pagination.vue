<template>
  <div class="pagination">
    <button
      class="pagination-button first"
      @click="onFirstPage"
      :disabled="currentPage === 1"
      aria-label="First page"
    >
      &laquo;
    </button>

    <button
      class="pagination-button prev"
      @click="onPrevPage"
      :disabled="currentPage === 1"
      aria-label="Previous page"
    >
      &lsaquo;
    </button>

    <div class="page-numbers">
      <button
        v-for="page in displayPages"
        :key="page"
        @click="onPageClick(page)"
        :class="[
          'pagination-button page-number',
          {
            active: page === currentPage,
            ellipsis: page === -1,
          },
        ]"
        :disabled="page === -1"
      >
        {{ page === -1 ? '...' : page }}
      </button>
    </div>

    <button
      class="pagination-button next"
      @click="onNextPage"
      :disabled="currentPage === totalPages"
      aria-label="Next page"
    >
      &rsaquo;
    </button>

    <button
      class="pagination-button last"
      @click="onLastPage"
      :disabled="currentPage === totalPages"
      aria-label="Last page"
    >
      &raquo;
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ComputedRef } from 'vue'

const props = defineProps<{
  currentPage: number
  totalPages: number
  pages: number[] | ComputedRef<number[]>
}>()

const displayPages = computed(() => {
  return Array.isArray(props.pages) ? props.pages : props.pages.value
})

const emit = defineEmits<{
  (e: 'page-change', page: number): void
}>()

const onPageClick = (page: number) => {
  if (page !== -1) {
    emit('page-change', page)
  }
}

const onPrevPage = () => {
  emit('page-change', Math.max(1, props.currentPage - 1))
}

const onNextPage = () => {
  emit('page-change', Math.min(props.totalPages, props.currentPage + 1))
}

const onFirstPage = () => {
  emit('page-change', 1)
}

const onLastPage = () => {
  emit('page-change', props.totalPages)
}
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: var(--space-lg) 0;
  gap: var(--space-xs);
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.pagination-button {
  min-width: 40px;
  height: 40px;
  padding: var(--space-xs) var(--space-sm);
  border: none;
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--color-text);
  border-radius: 4px;
  cursor: pointer;
  transition:
    background-color 0.3s,
    color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-button:hover:not(:disabled):not(.active) {
  background-color: rgba(255, 255, 255, 0.2);
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-button.active {
  background-color: var(--color-primary);
  color: white;
  font-weight: bold;
}

.pagination-button.ellipsis {
  background-color: transparent;
}

/* Mobile adjustments */
@media (max-width: 576px) {
  .pagination {
    flex-wrap: wrap;
  }

  .page-numbers {
    order: 3;
    width: 100%;
    justify-content: center;
    margin-top: var(--space-sm);
  }

  .pagination-button {
    min-width: 36px;
    height: 36px;
  }
}
</style>
