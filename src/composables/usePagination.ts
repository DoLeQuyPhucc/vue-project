import { ref, computed } from 'vue'

export interface UsePaginationOptions {
  initialPage?: number
  pageSize?: number
  maxVisiblePages?: number
}

export function usePagination(totalPages: number, options: UsePaginationOptions = {}) {
  const { initialPage = 1, maxVisiblePages = 5 } = options

  const currentPage = ref(initialPage)

  const setPage = (page: number) => {
    if (page < 1) {
      currentPage.value = 1
    } else if (page > totalPages) {
      currentPage.value = totalPages
    } else {
      currentPage.value = page
    }
  }

  const nextPage = () => {
    if (currentPage.value < totalPages) {
      currentPage.value++
    }
  }

  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }

  const firstPage = () => {
    currentPage.value = 1
  }

  const lastPage = () => {
    currentPage.value = totalPages
  }

  const pages = computed(() => {
    // Logic to determine which page numbers to show
    const pageNumbers: number[] = []

    if (totalPages <= maxVisiblePages) {
      // If we have fewer pages than max visible, show all
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Calculate the range of pages to show
      const half = Math.floor(maxVisiblePages / 2)
      let start = currentPage.value - half
      let end = currentPage.value + half

      // Adjust if we're near the beginning
      if (start < 1) {
        end = end + (1 - start)
        start = 1
      }

      // Adjust if we're near the end
      if (end > totalPages) {
        start = Math.max(1, start - (end - totalPages))
        end = totalPages
      }

      // Generate the page numbers
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i)
      }

      // Add ellipsis indicators
      if (start > 1) {
        pageNumbers.unshift(-1) // -1 represents "..."
        pageNumbers.unshift(1) // Always show first page
      }

      if (end < totalPages) {
        pageNumbers.push(-1) // -1 represents "..."
        pageNumbers.push(totalPages) // Always show last page
      }
    }

    return pageNumbers
  })

  return {
    currentPage,
    totalPages,
    pages,
    setPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
  }
}
