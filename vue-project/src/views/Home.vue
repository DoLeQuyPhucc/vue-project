<script setup lang="ts">
import HeroSection from '@/components/HeroSection.vue'
import CategoryGrid from '@/components/CategoryGrid.vue'
import MovieHotCountry from '@/components/MovieHotCountry.vue'
import FeaturedMovie from '@/components/FeaturedMovie.vue'
</script>

<template>
  <main class="relative overflow-hidden">
    <div class="relative">
      <HeroSection />

      <!-- Gradient transition overlay -->
      <div
        class="absolute w-full h-40 bottom-0 bg-gradient-to-b from-transparent to-zinc-900 z-[30] pointer-events-none"
      ></div>
    </div>

    <div class="content-section relative">
      <CategoryGrid />

      <!-- Wrapper to connect MovieHotCountry and FeaturedMovie -->
      <div class="relative">
        <!-- MovieHotCountry component -->
        <div class="relative z-10 mb-12">
          <MovieHotCountry />
        </div>

        <!-- Enhanced gradient overlay for smoother transition -->
        <div
          class="absolute w-full h-40 bottom-0 -mb-20 bg-gradient-to-b from-transparent via-zinc-900/80 to-zinc-900 z-20 pointer-events-none"
        ></div>

        <!-- FeaturedMovie with negative margin to create overlap -->
        <div class="relative -mt-16 z-10">
          <FeaturedMovie />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.content-section {
  padding-top: 0; /* Remove top padding since we have the gradient overlap */
}
</style>
