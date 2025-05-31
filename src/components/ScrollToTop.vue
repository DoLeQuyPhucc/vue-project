<template>
  <Transition name="scroll-to-top">
    <button
      v-if="showButton"
      @click="scrollToTop"
      class="scroll-to-top-btn"
      aria-label="Scroll to top"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const showButton = ref(false)

const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const documentHeight =
    document.documentElement.scrollHeight - document.documentElement.clientHeight
  const scrollPercentage = (scrollTop / documentHeight) * 100

  // Show button when scrolled down 30%
  showButton.value = scrollPercentage > 30
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.scroll-to-top-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 50;
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #dc2626, #ef4444);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.scroll-to-top-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 20px rgba(220, 38, 38, 0.4);
  background: linear-gradient(135deg, #b91c1c, #dc2626);
}

.scroll-to-top-btn:active {
  transform: translateY(0) scale(0.95);
}

/* Pulse animation on first appearance */
.scroll-to-top-btn::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 50%;
  background: linear-gradient(135deg, #dc2626, #ef4444);
  z-index: -1;
  opacity: 0;
  animation: pulse-ring 2s infinite;
}

@keyframes pulse-ring {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.4;
  }
  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}

/* Transition animations */
.scroll-to-top-enter-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.scroll-to-top-leave-active {
  transition: all 0.3s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}

.scroll-to-top-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.8) rotate(180deg);
}

.scroll-to-top-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.8) rotate(-180deg);
}

/* Responsive design */
@media (max-width: 768px) {
  .scroll-to-top-btn {
    bottom: 1.5rem;
    right: 1.5rem;
    width: 2.75rem;
    height: 2.75rem;
  }
}

@media (max-width: 480px) {
  .scroll-to-top-btn {
    bottom: 1rem;
    right: 1rem;
    width: 2.5rem;
    height: 2.5rem;
  }

  .scroll-to-top-btn svg {
    width: 1.25rem;
    height: 1.25rem;
  }
}

/* Dark mode compatibility */
@media (prefers-color-scheme: dark) {
  .scroll-to-top-btn {
    border-color: rgba(255, 255, 255, 0.2);
  }
}

/* Accessibility improvements */
.scroll-to-top-btn:focus {
  outline: none;
  box-shadow:
    0 8px 20px rgba(220, 38, 38, 0.4),
    0 0 0 3px rgba(220, 38, 38, 0.3);
}

.scroll-to-top-btn:focus-visible {
  outline: 2px solid #dc2626;
  outline-offset: 2px;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .scroll-to-top-btn {
    transition: none;
  }

  .scroll-to-top-btn::before {
    animation: none;
  }

  .scroll-to-top-enter-active,
  .scroll-to-top-leave-active {
    transition: opacity 0.2s ease;
  }

  .scroll-to-top-enter-from,
  .scroll-to-top-leave-to {
    transform: none;
  }
}
</style>
