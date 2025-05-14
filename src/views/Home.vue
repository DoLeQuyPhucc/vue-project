<script setup lang="ts">
import HeroSection from '@/components/HeroSection.vue'
import CategoryGrid from '@/components/CategoryGrid.vue'
import MovieHotCountry from '@/components/MovieHotCountry.vue'
import FeaturedMovie from '@/components/FeaturedMovie.vue'
import FilmSeriesCarousel from '@/components/FilmSeriesCarousel.vue'
import FilmMovieCarousel from '@/components/FilmMovieCarousel.vue'
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
        
        <!-- Film Series Section with visual connection -->
        <div class="relative">
          <div class="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-zinc-900 to-transparent z-0"></div>
          <div class="relative z-10 mt-8">
            <FilmSeriesCarousel />
          </div>
        </div>
        
        <!-- Film Movies Section with visual connection -->
        <div class="relative">
          <div class="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-zinc-900/70 to-transparent z-0"></div>
          <div class="relative z-10 mt-4">
            <FilmMovieCarousel />
          </div>
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
