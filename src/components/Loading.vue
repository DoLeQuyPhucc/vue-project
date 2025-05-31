<template>
  <div v-if="isLoading" :class="inline ? 'loading-inline' : 'loading-overlay'">
    <!-- Spinning dots loader -->
    <div class="loader-container">
      <div class="loader-dots">
        <div class="dot" ref="dot1"></div>
        <div class="dot" ref="dot2"></div>
        <div class="dot" ref="dot3"></div>
      </div>
      <div class="loading-text" ref="loadingText">Đang tải...</div>
    </div>

    <!-- Progress bar -->
    <div v-if="!inline" class="progress-container" ref="progressContainer">
      <div class="progress-bar" ref="progressBar"></div>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap'

export default {
  name: 'LoadingComponent',
  props: {
    isLoading: {
      type: Boolean,
      default: true,
    },
    progress: {
      type: Number,
      default: 0,
      validator: (value) => value >= 0 && value <= 100,
    },
    inline: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      timeline: null,
    }
  },
  mounted() {
    if (this.isLoading) {
      this.startAnimation()
    }
  },
  watch: {
    isLoading(newVal) {
      if (newVal) {
        this.startAnimation()
      } else {
        this.stopAnimation()
      }
    },
    progress(newVal) {
      this.updateProgress(newVal)
    },
  },
  methods: {
    startAnimation() {
      // Create main timeline
      this.timeline = gsap.timeline({ repeat: -1 })

      // Animate dots
      this.timeline
        .to([this.$refs.dot1, this.$refs.dot2, this.$refs.dot3], {
          scale: 1.5,
          backgroundColor: '#dc2626',
          duration: 0.4,
          stagger: 0.1,
          ease: 'power2.inOut',
        })
        .to([this.$refs.dot1, this.$refs.dot2, this.$refs.dot3], {
          scale: 1,
          backgroundColor: '#4b5563',
          duration: 0.4,
          stagger: 0.1,
          ease: 'power2.inOut',
        })

      // Animate loading text
      gsap.fromTo(
        this.$refs.loadingText,
        { opacity: 0.5 },
        {
          opacity: 1,
          duration: 1,
          repeat: -1,
          yoyo: true,
          ease: 'power2.inOut',
        },
      )

      // Animate progress container entrance
      gsap.fromTo(
        this.$refs.progressContainer,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'back.out(1.7)',
        },
      )
    },

    stopAnimation() {
      // Exit animation
      const exitTimeline = gsap.timeline({
        onComplete: () => {
          if (this.timeline) {
            this.timeline.kill()
          }
        },
      })

      exitTimeline
        .to('.loading-overlay', {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.inOut',
        })
        .to(
          '.loader-container',
          {
            scale: 0.8,
            duration: 0.3,
            ease: 'back.in(1.7)',
          },
          '-=0.3',
        )
    },

    updateProgress(progress) {
      gsap.to(this.$refs.progressBar, {
        width: `${progress}%`,
        duration: 0.5,
        ease: 'power2.out',
      })
    },
  },

  beforeUnmount() {
    if (this.timeline) {
      this.timeline.kill()
    }
    gsap.killTweensOf([
      this.$refs.dot1,
      this.$refs.dot2,
      this.$refs.dot3,
      this.$refs.loadingText,
      this.$refs.progressContainer,
      this.$refs.progressBar,
    ])
  },
}
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-inline {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.loader-dots {
  display: flex;
  gap: 0.5rem;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #4b5563;
  transition: all 0.3s ease;
}

.loading-text {
  font-size: 1.1rem;
  font-weight: 500;
  color: #f9fafb;
  letter-spacing: 0.5px;
}

.progress-container {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  height: 4px;
  background-color: #374151;
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, #dc2626, #ef4444);
  border-radius: 2px;
  position: relative;
}

.progress-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Light mode support (if needed) */
@media (prefers-color-scheme: light) {
  .loading-overlay {
    background: rgba(255, 255, 255, 0.95);
  }

  .loading-text {
    color: #374151;
  }

  .progress-container {
    background-color: #f3f4f6;
  }

  .dot {
    background-color: #e5e7eb;
  }
}
</style>
