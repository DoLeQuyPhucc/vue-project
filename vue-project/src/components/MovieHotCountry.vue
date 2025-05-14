<template>
  <section class="mb-12 px-8 md:px-6">
    <div class="bg-[#262938] rounded-2xl overflow-hidden">
      <!-- Korean Movies Section -->
      <div class="mb-4 md:mb-6 border-b border-zinc-800 last:border-b-0 last:mb-0">
        <CountryMovieRow country-slug="han-quoc" title="Phim Hàn Quốc Mới" :key="'han-quoc'" />
      </div>

      <!-- Chinese Movies Section -->
      <div class="mb-4 md:mb-6 border-b border-zinc-800 last:border-b-0 last:mb-0">
        <CountryMovieRow
          country-slug="trung-quoc"
          title="Phim Trung Quốc Mới"
          :key="'trung-quoc'"
        />
      </div>

      <!-- US/UK Movies Section -->
      <div class="mb-4 md:mb-6 border-b border-zinc-800 last:border-b-0 last:mb-0">
        <CountryMovieRow country-slug="au-my" title="Phim US-UK Mới" :key="'au-my'" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import CountryMovieRow from '@/components/CountryMovieRow.vue'
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.hide-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
