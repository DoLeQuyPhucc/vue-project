<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  // Threshold at which the element is considered visible
  threshold: {
    type: Number,
    default: 0.1
  },
  // Root margin allows you to load before element is in view
  rootMargin: {
    type: String,
    default: '200px 0px'
  },
  // Whether to trigger only once or keep observing
  triggerOnce: {
    type: Boolean,
    default: true
  }
})

const visible = ref(false)
const rootEl = ref(null)
let observer = null

onMounted(() => {
  initObserver()
})

onBeforeUnmount(() => {
  disconnectObserver()
})

function initObserver() {
  if (!window.IntersectionObserver) {
    // Fallback for browsers that don't support IntersectionObserver
    visible.value = true
    return
  }

  disconnectObserver()

  observer = new IntersectionObserver(entries => {
    const isVisible = entries[0]?.isIntersecting || false
    visible.value = isVisible

    if (isVisible && props.triggerOnce) {
      disconnectObserver()
    }
  }, {
    threshold: props.threshold,
    rootMargin: props.rootMargin
  })

  if (rootEl.value) {
    observer.observe(rootEl.value)
  }
}

function disconnectObserver() {
  if (observer) {
    observer.disconnect()
    observer = null
  }
}
</script>

<template>
  <div ref="rootEl" class="lazy-loader">
    <!-- Show placeholder or skeleton while loading -->
    <div v-if="!visible" class="lazy-placeholder">
      <slot name="placeholder">
        <!-- Default placeholder -->
        <div class="default-skeleton"></div>
      </slot>
    </div>
    
    <!-- Show actual content when visible -->
    <div v-if="visible">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.lazy-loader {
  min-height: 50px;
  width: 100%;
}

.default-skeleton {
  width: 100%;
  height: 100%;
  min-height: inherit;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.03) 0%,
    rgba(255, 255, 255, 0.06) 50%,
    rgba(255, 255, 255, 0.03) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style> 