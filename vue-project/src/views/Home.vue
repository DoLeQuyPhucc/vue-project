<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
import HeroSection from '@/components/HeroSection.vue'
import CategoryGrid from '@/components/CategoryGrid.vue'
</script>

<template>
  <main class="relative overflow-hidden">
    <HeroSection />

    <!-- Gradient transition overlay -->
    <div
      class="absolute w-full h-40 -mt-40 bg-gradient-to-b from-transparent to-zinc-900 z-10"
    ></div>

    <div class="content-section relative z-20">
      <CategoryGrid />
    </div>
  </main>
</template>

<style scoped>
.content-section {
  padding-top: 0; /* Remove top padding since we have the gradient overlap */
}
</style>
