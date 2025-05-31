<template>
  <div>
    <Navbar />
    <main><router-view /></main>
    <AppFooter />
  </div>
</template>

<script setup>
import Navbar from '@/layouts/Navbar.vue'
import AppFooter from '@/layouts/AppFooter.vue'
</script>
