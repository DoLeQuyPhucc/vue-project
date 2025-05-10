<template>
  <header class="navbar" :class="{ scrolled: isScrolled }">
    <div class="logo">
      <router-link to="/">🎬 MovieHub</router-link>
    </div>

    <div class="search-container" :class="{ active: isSearchActive }">
      <div class="search-input-container">
        <input 
          type="text" 
          class="search-input" 
          placeholder="Search for movies..." 
          v-model="searchQuery"
          @keyup.enter="handleSearch"
          ref="searchInput"
        />
        <button class="search-submit" @click="handleSearch">
          <span class="search-icon">🔍</span>
        </button>
      </div>
      <button v-if="isSearchActive" class="search-close" @click="toggleSearch(false)">✕</button>
    </div>

    <nav class="nav-links">
      <router-link to="/">Home</router-link>
      <button class="search-toggle" @click="toggleSearch">
        <span class="search-icon">🔍</span>
      </button>
      <router-link to="/watchlist">Watchlist</router-link>
      <router-link v-if="auth.isLoggedIn" to="/profile">Profile</router-link>
    </nav>

    <div class="auth-section">
      <template v-if="auth.isLoggedIn">
        <span class="username">👤 {{ auth.user.email }}</span>
        <button class="logout-btn" @click="logout">Logout</button>
      </template>
      <template v-else>
        <router-link to="/login">Login</router-link>
      </template>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/useAuthStore'
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, onUnmounted, watch } from 'vue'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const isScrolled = ref(false)
const searchQuery = ref('')
const isSearchActive = ref(false)
const searchInput = ref(null)

// Initialize search state based on current route
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  
  // If we're on the search page, activate search
  if (route.path === '/search') {
    isSearchActive.value = true
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Watch for route changes
watch(
  () => route.path,
  (newPath) => {
    if (newPath === '/search') {
      isSearchActive.value = true
    }
  }
)

// Watch for search active state to focus input
watch(
  () => isSearchActive.value,
  (isActive) => {
    if (isActive && searchInput.value) {
      setTimeout(() => {
        searchInput.value.focus()
      }, 100)
    }
  }
)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 0
}

const toggleSearch = (forceState) => {
  isSearchActive.value = forceState !== undefined ? forceState : !isSearchActive.value
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/search',
      query: { q: searchQuery.value.trim() }
    })
  }
}

const logout = () => {
  auth.logout()
  router.push('/')
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md);
  color: var(--color-text);
  flex-wrap: wrap;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: background-color 0.3s ease;
  background-color: transparent;
}

.navbar.scrolled {
  background-color: var(--color-background);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.logo a {
  font-size: var(--font-size-xl);
  font-weight: bold;
  color: var(--color-primary);
  text-decoration: none;
}

/* Search styles */
.search-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background-color: var(--color-background);
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(-100%);
  transition: transform 0.3s ease;
  z-index: 1001;
}

.search-container.active {
  transform: translateY(0);
}

.search-input-container {
  position: relative;
  width: 80%;
  max-width: 600px;
}

.search-input {
  width: 100%;
  padding: var(--space-sm) var(--space-lg);
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  color: var(--color-text);
  font-size: var(--font-size-md);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.search-submit {
  position: absolute;
  right: var(--space-xs);
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--color-text);
  font-size: var(--font-size-lg);
  cursor: pointer;
}

.search-close {
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  background: none;
  border: none;
  color: var(--color-text);
  font-size: var(--font-size-lg);
  cursor: pointer;
}

.search-toggle {
  background: none;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  font-size: var(--font-size-md);
  padding: var(--space-xs);
  transition: color 0.3s;
}

.search-toggle:hover {
  color: var(--color-primary);
}

.nav-links {
  display: flex;
  gap: var(--space-md);
  margin: var(--space-sm) 0;
  align-items: center;
}

.nav-links a {
  color: var(--color-text);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: var(--color-primary);
}

.auth-section {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.username {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.logout-btn {
  background-color: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-primary);
  padding: var(--space-xs) var(--space-sm);
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.logout-btn:hover {
  background-color: var(--color-primary);
}

/* Mobile first approach already defined in responsive.css */
@media (max-width: 767px) {
  .navbar {
    flex-direction: column;
    align-items: flex-start;
    padding: var(--space-sm);
  }

  .search-container {
    position: fixed;
    padding: 0 var(--space-md);
  }

  .search-close {
    top: var(--space-sm);
    right: var(--space-sm);
  }

  .search-input-container {
    width: 100%;
  }

  .nav-links {
    flex-direction: column;
    width: 100%;
    margin: var(--space-sm) 0;
  }

  .nav-links a, .search-toggle {
    padding: var(--space-sm) 0;
  }

  .auth-section {
    width: 100%;
    justify-content: flex-start;
    margin-top: var(--space-sm);
  }
}

@media (min-width: 768px) {
  .navbar {
    padding: var(--space-md) var(--space-xl);
  }

  .nav-links {
    gap: var(--space-lg);
  }
}
</style>
