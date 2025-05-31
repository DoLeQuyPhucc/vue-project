<template>
  <header
    class="fixed top-0 left-0 right-0 z-[60] flex flex-col md:flex-row items-center px-8 md:px-6 py-3 transition-all duration-300"
    :class="scrolled ? 'bg-zinc-900/95 shadow-md' : 'bg-gradient-to-b from-black/80 to-transparent'"
  >
    <!-- Logo and search container (full width on mobile, flex on desktop) -->
    <div class="flex w-full md:w-auto items-center justify-between md:justify-start mb-4 md:mb-0">
      <!-- Logo (smaller on mobile) -->
      <router-link to="/" class="flex-shrink-0 md:mr-8">
        <img :src="logoImage" alt="LOPHIM" class="h-8 md:h-12" />
      </router-link>

      <!-- Mobile menu toggle button -->
      <button
        @click="mobileMenuOpen = !mobileMenuOpen"
        class="md:hidden flex items-center justify-center w-10 h-10 text-white hover:text-red-500"
      >
        <font-awesome-icon :icon="mobileMenuOpen ? 'times' : 'bars'" />
      </button>
    </div>

    <!-- Search bar (full width on mobile) -->
    <div class="relative w-full md:w-auto md:mr-6 mb-4 md:mb-0">
      <input
        type="text"
        placeholder="Tìm kiếm phim, diễn viên"
        class="w-full md:w-64 bg-zinc-800/80 text-white border border-zinc-700 rounded-full px-8 py-2 pl-11 focus:outline-none focus:border-red-500"
      />
      <div
        class="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 pointer-events-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </div>
    </div>

    <!-- Navigation links -->
    <div
      class="w-full md:flex-1 flex flex-col md:flex-row md:items-center md:space-x-6 space-y-3 md:space-y-0 transition-all duration-300"
      :class="
        mobileMenuOpen
          ? 'max-h-screen opacity-100'
          : 'max-h-0 md:max-h-screen opacity-0 md:opacity-100 md:overflow-visible'
      "
    >
      <router-link to="/" class="text-white hover:text-red-500 font-medium">Chủ Đề</router-link>

      <div class="relative group">
        <div
          class="flex items-center text-white hover:text-red-500 font-medium cursor-pointer"
          @click="toggleCategoryDropdown"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
        >
          Thể loại
          <svg
            class="w-4 h-4 ml-1 transition-transform duration-200"
            :class="{ 'rotate-180': showCategoryDropdown }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>

        <!-- Desktop Category Dropdown -->
        <div
          v-show="showCategoryDropdown"
          @mouseenter="handleDropdownMouseEnter"
          @mouseleave="handleDropdownMouseLeave"
          class="hidden md:block absolute top-full left-0 mt-2 w-[38rem] bg-zinc-900/95 backdrop-blur-sm border border-zinc-700 rounded-lg shadow-2xl z-[200] p-4"
        >
          <div v-if="categoriesLoading" class="p-6 text-center text-zinc-400">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500 mx-auto"></div>
            <p class="mt-2">Đang tải...</p>
          </div>
          <div v-else-if="categoriesError" class="p-6 text-center text-red-400">
            <p>Lỗi tải danh sách thể loại</p>
          </div>
          <div v-else>
            <div class="grid grid-cols-4 gap-1">
              <router-link
                v-for="category in categories"
                :key="category._id"
                :to="`/the-loai/${category.slug}`"
                class="block px-3 py-2 text-sm text-white hover:bg-zinc-800 hover:text-red-500 transition-colors duration-200 rounded-md"
                @click="showCategoryDropdown = false"
              >
                {{ category.name }}
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Category Dropdown - Show inline when mobile menu is open -->
      <div v-show="showCategoryDropdown && mobileMenuOpen" class="md:hidden w-full">
        <div class="bg-zinc-800/90 backdrop-blur-sm rounded-lg mt-2 border border-zinc-700 p-3">
          <div v-if="categoriesLoading" class="p-4 text-center text-zinc-400">
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500 mx-auto"></div>
            <p class="mt-2 text-sm">Đang tải...</p>
          </div>
          <div v-else-if="categoriesError" class="p-4 text-center text-red-400 text-sm">
            Lỗi tải danh sách thể loại
          </div>
          <div v-else>
            <div class="grid grid-cols-2 gap-1">
              <router-link
                v-for="category in categories"
                :key="category._id"
                :to="`/the-loai/${category.slug}`"
                class="block px-3 py-2 text-sm text-white hover:bg-zinc-700 hover:text-red-500 transition-colors duration-200 rounded-md"
                @click="handleMobileCategoryClick"
              >
                {{ category.name }}
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <router-link to="danh-sach/phim-le" class="text-white hover:text-red-500 font-medium"
        >Phim Lẻ</router-link
      >
      <router-link to="danh-sach/phim-bo" class="text-white hover:text-red-500 font-medium"
        >Phim Bộ</router-link
      >

      <div class="relative group">
        <div
          class="flex items-center text-white hover:text-red-500 font-medium cursor-pointer"
          @click="toggleCountryDropdown"
          @mouseenter="handleCountryMouseEnter"
          @mouseleave="handleCountryMouseLeave"
        >
          Quốc gia
          <svg
            class="w-4 h-4 ml-1 transition-transform duration-200"
            :class="{ 'rotate-180': showCountryDropdown }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        <!-- Desktop Country Dropdown -->
        <div
          v-show="showCountryDropdown"
          @mouseenter="handleCountryDropdownMouseEnter"
          @mouseleave="handleCountryDropdownMouseLeave"
          class="hidden md:block absolute top-full left-0 mt-2 w-[38rem] bg-zinc-900/95 backdrop-blur-sm border border-zinc-700 rounded-lg shadow-2xl z-[200]"
        >
          <div v-if="countriesLoading" class="p-6 text-center text-zinc-400">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500 mx-auto"></div>
            <p class="mt-2">Đang tải...</p>
          </div>
          <div v-else-if="countriesError" class="p-6 text-center text-red-400">
            <p>Lỗi tải danh sách quốc gia</p>
          </div>
          <div v-else class="p-4">
            <!-- Debug info - remove after fixing -->
            <div class="grid grid-cols-4 gap-2">
              <router-link
                v-for="country in countries"
                :key="country._id"
                :to="`/quoc-gia/${country.slug}`"
                class="block px-3 py-2 text-sm text-white hover:bg-zinc-800 hover:text-red-500 transition-colors duration-200 rounded-md whitespace-nowrap"
                @click="showCountryDropdown = false"
              >
                {{ country.name }}
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Country Dropdown -->
      <div v-show="showCountryDropdown && mobileMenuOpen" class="md:hidden w-full">
        <div class="bg-zinc-800/90 backdrop-blur-sm rounded-lg mt-2 border border-zinc-700 p-3">
          <div v-if="countriesLoading" class="p-4 text-center text-zinc-400">
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500 mx-auto"></div>
            <p class="mt-2 text-sm">Đang tải...</p>
          </div>
          <div v-else-if="countriesError" class="p-4 text-center text-red-400 text-sm">
            Lỗi tải danh sách quốc gia
          </div>
          <div v-else>
            <div class="grid grid-cols-2 gap-1">
              <router-link
                v-for="country in countries"
                :key="country._id"
                :to="`/quoc-gia/${country.slug}`"
                class="block px-3 py-2 text-sm text-white hover:bg-zinc-700 hover:text-red-500 transition-colors duration-200 rounded-md"
                @click="handleCountryMobileClick"
              >
                {{ country.name }}
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <router-link to="/dien-vien" class="text-white hover:text-red-500 font-medium"
        >Diễn Viên</router-link
      >
      <router-link to="/lich-chieu" class="text-white hover:text-red-500 font-medium"
        >Lịch chiếu</router-link
      >
    </div>

    <!-- Auth buttons section has been removed -->
  </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/useAuthStore'
import { useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import logoImage from '@/assets/logo.png'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { getCategoryList } from '@/services/categoryService'
import { getCountryList } from '@/services/countryService'

// Add icons to the library
library.add(faBars, faTimes)

const auth = useAuthStore()
const router = useRouter()
const scrolled = ref(false)
const mobileMenuOpen = ref(false)

// Category dropdown state
const showCategoryDropdown = ref(false)
const categories = ref([])
const categoriesLoading = ref(false)
const categoriesError = ref(false)

// Country dropdown state
const showCountryDropdown = ref(false)
const countries = ref([])
const countriesLoading = ref(false)
const countriesError = ref(false)

// Dropdown timeout for better UX
let dropdownTimeout = null
let countryDropdownTimeout = null

const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

const toggleCategoryDropdown = () => {
  if (dropdownTimeout) {
    clearTimeout(dropdownTimeout)
    dropdownTimeout = null
  }
  showCategoryDropdown.value = !showCategoryDropdown.value
}

const handleMouseEnter = () => {
  if (dropdownTimeout) {
    clearTimeout(dropdownTimeout)
    dropdownTimeout = null
  }
  showCategoryDropdown.value = true
}

const handleMouseLeave = () => {
  dropdownTimeout = setTimeout(() => {
    showCategoryDropdown.value = false
  }, 200) // Small delay to allow mouse movement to dropdown
}

const handleDropdownMouseEnter = () => {
  if (dropdownTimeout) {
    clearTimeout(dropdownTimeout)
    dropdownTimeout = null
  }
}

const handleDropdownMouseLeave = () => {
  dropdownTimeout = setTimeout(() => {
    showCategoryDropdown.value = false
  }, 200)
}

const toggleCountryDropdown = () => {
  if (countryDropdownTimeout) {
    clearTimeout(countryDropdownTimeout)
    countryDropdownTimeout = null
  }
  showCountryDropdown.value = !showCountryDropdown.value
}

const handleCountryMouseEnter = () => {
  if (countryDropdownTimeout) {
    clearTimeout(countryDropdownTimeout)
    countryDropdownTimeout = null
  }
  showCountryDropdown.value = true
}

const handleCountryMouseLeave = () => {
  countryDropdownTimeout = setTimeout(() => {
    showCountryDropdown.value = false
  }, 200)
}

const handleCountryDropdownMouseEnter = () => {
  if (countryDropdownTimeout) {
    clearTimeout(countryDropdownTimeout)
    countryDropdownTimeout = null
  }
}

const handleCountryDropdownMouseLeave = () => {
  countryDropdownTimeout = setTimeout(() => {
    showCountryDropdown.value = false
  }, 200)
}

const loadCategories = async () => {
  if (categories.value.length > 0) return // Don't reload if already loaded

  categoriesLoading.value = true
  categoriesError.value = false

  try {
    const result = await getCategoryList()
    categories.value = result
  } catch (error) {
    console.error('Error loading categories:', error)
    categoriesError.value = true
  } finally {
    categoriesLoading.value = false
  }
}

const loadCountries = async () => {
  if (countries.value.length > 0) return
  console.log('Loading countries...')
  countriesLoading.value = true
  countriesError.value = false
  try {
    const result = await getCountryList()
    console.log('Countries API result:', result)

    // API trả về mảng trực tiếp, không phải object có thuộc tính data
    if (Array.isArray(result)) {
      countries.value = result
    } else if (result.data && Array.isArray(result.data)) {
      countries.value = result.data
    } else {
      throw new Error('Invalid API response format')
    }

    console.log('Countries loaded:', countries.value.length)
  } catch (error) {
    console.error('Error loading countries:', error)
    countriesError.value = true
  } finally {
    countriesLoading.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  loadCategories() // Load categories when component mounts
  loadCountries()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (dropdownTimeout) {
    clearTimeout(dropdownTimeout)
  }
  if (countryDropdownTimeout) {
    clearTimeout(countryDropdownTimeout)
  }
})

const logout = () => {
  auth.logout()
  router.push('/')
}

const handleMobileCategoryClick = () => {
  showCategoryDropdown.value = false
  mobileMenuOpen.value = false
}

const handleCountryMobileClick = () => {
  showCountryDropdown.value = false
  mobileMenuOpen.value = false
}
</script>
