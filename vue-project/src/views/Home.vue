<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
import HeroSection from '@/components/HeroSection.vue'
</script>

<template>
  <main>
    <HeroSection />
    <div class="content-section">
      <TheWelcome />
    </div>
  </main>
</template>

<style scoped>
.content-section {
  padding-top: 2rem;
}
</style>
