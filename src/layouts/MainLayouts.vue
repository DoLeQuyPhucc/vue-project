<script setup>
import Navbar from '@/components/Navbar.vue'
import '@/assets/css/responsive.css'
</script>

<template>
  <div class="layout">
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style>
/* Layout specific styles */
.layout {
  min-height: 100vh;
}

.main-content {
  padding-top: var(--navbar-height-mobile);
}

@media (min-width: 768px) {
  .main-content {
    padding-top: var(--navbar-height-desktop);
  }
}
</style>
