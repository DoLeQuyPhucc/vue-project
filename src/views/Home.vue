<script setup lang="ts">
import HeroSection from '@/components/HeroSection.vue'
import CategoryGrid from '@/components/CategoryGrid.vue'
import MovieHotCountry from '@/components/MovieHotCountry.vue'
import FeaturedMovie from '@/components/FeaturedMovie.vue'
import FilmSeriesCarousel from '@/components/FilmSeriesCarousel.vue'
import FilmMovieCarousel from '@/components/FilmMovieCarousel.vue'
import LazyLoader from '@/components/LazyLoader.vue'
import { ref, watch } from 'vue'
import AppFooter from '@/components/AppFooter.vue'

// Login and register modal state
const showLoginModal = ref(false)
const showRegisterModal = ref(false)
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const fullName = ref('')
const username = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
const passwordMatchError = ref(false)

// Watch showLoginModal to add/remove body class that controls background blur
watch([showLoginModal, showRegisterModal], ([isLoginVisible, isRegisterVisible]) => {
  if (isLoginVisible || isRegisterVisible) {
    document.body.classList.add('modal-open')
  } else {
    document.body.classList.remove('modal-open')
  }
})

// Login functions
const toggleLoginModal = () => {
  showLoginModal.value = !showLoginModal.value
  if (showLoginModal.value) {
    showRegisterModal.value = false
  }
}

const toggleRegisterModal = () => {
  showRegisterModal.value = !showRegisterModal.value
  if (showRegisterModal.value) {
    showLoginModal.value = false
  }
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const handleLogin = async () => {
  isLoading.value = true

  try {
    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Here you would authenticate with your backend
    console.log('Login attempt:', {
      email: email.value,
      password: password.value,
      rememberMe: rememberMe.value,
    })

    // Hide modal on success
    showLoginModal.value = false
  } catch (error) {
    console.error('Login failed:', error)
  } finally {
    isLoading.value = false
  }
}

const handleRegister = async () => {
  // Validate passwords match
  if (password.value !== confirmPassword.value) {
    passwordMatchError.value = true
    return
  }

  passwordMatchError.value = false
  isLoading.value = true

  try {
    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Here you would register with your backend
    console.log('Register attempt:', {
      email: email.value,
      username: username.value,
      fullName: fullName.value,
      password: password.value,
    })

    // Hide modal on success
    showRegisterModal.value = false

    // Clear form
    email.value = ''
    password.value = ''
    confirmPassword.value = ''
    username.value = ''
    fullName.value = ''
  } catch (error) {
    console.error('Registration failed:', error)
  } finally {
    isLoading.value = false
  }
}

const switchToRegister = () => {
  showLoginModal.value = false
  showRegisterModal.value = true
}

const switchToLogin = () => {
  showRegisterModal.value = false
  showLoginModal.value = true
}
</script>

<template>
  <main
    class="relative overflow-hidden"
    :class="{ 'content-blurred': showLoginModal || showRegisterModal }"
  >
    <!-- Login Button -->
    <button
      @click="toggleLoginModal"
      class="fixed top-5 right-5 z-50 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2.5 rounded-full shadow-lg transition-all hover:shadow-red-500/30 hover:scale-105 font-medium flex items-center gap-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
      Đăng Nhập
    </button>

    <!-- Login Modal -->
    <div
      v-if="showLoginModal"
      class="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      @click="showLoginModal = false"
    >
      <!-- Cinema backdrop -->
      <div class="absolute inset-0">
        <div class="cinema-backdrop"></div>
      </div>

      <!-- Theater screen with projector effect -->
      <div class="projector-container relative z-20" @click.stop>
        <!-- Projector light beam effect -->
        <div class="projector-beam"></div>

        <!-- Screen frame -->
        <div class="login-screen">
          <!-- Screen curtains -->
          <div class="curtain-left"></div>
          <div class="curtain-right"></div>

          <!-- Login card styled as movie screen -->
          <div class="screen-content relative">
            <!-- Content glow effect -->
            <div class="screen-glow"></div>

            <!-- Motion picture rating style header -->
            <div class="movie-rating">
              <div class="rating-box">
                <span>R</span>
              </div>
              <div class="rating-text">
                <div class="title-bar">
                  <span class="cinema-title">LOPHIM</span>
                  <span class="cinema-subtitle">ACCESS</span>
                </div>
                <p>KHÁN GIẢ CẦN ĐĂNG NHẬP</p>
              </div>
            </div>

            <!-- Login form in cinematic style -->
            <form @submit.prevent="handleLogin" class="movie-form">
              <!-- Email field styled as movie credits -->
              <div class="form-field">
                <label for="email" class="field-label">ĐỊA CHỈ EMAIL</label>
                <div class="input-container">
                  <input
                    type="email"
                    id="email"
                    v-model="email"
                    placeholder="email@example.com"
                    required
                  />
                  <div class="field-effect"></div>
                </div>
              </div>

              <!-- Password field styled as director credit -->
              <div class="form-field">
                <label for="password" class="field-label">MẬT KHẨU</label>
                <div class="input-container">
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    id="password"
                    v-model="password"
                    placeholder="••••••••"
                    required
                  />
                  <button type="button" class="eye-icon" @click="togglePasswordVisibility">
                    <div class="eye" :class="{ 'eye-closed': !showPassword }"></div>
                  </button>
                  <div class="field-effect"></div>
                </div>
              </div>

              <!-- Remember me styled as movie choice -->
              <div class="movie-options">
                <label class="ticket-option">
                  <span class="ticket-stub"></span>
                  <input type="checkbox" v-model="rememberMe" />
                  <span class="ticket-text">GHI NHỚ TÀI KHOẢN </span>
                </label>
                <a href="#" class="forgot-password">Quên mật khẩu?</a>
              </div>

              <!-- Login button styled as movie ticket -->
              <button type="submit" class="movie-ticket-btn" :disabled="isLoading">
                <div class="ticket-inner">
                  <div class="ticket-holes"></div>
                  <div class="ticket-content">
                    <span v-if="!isLoading" class="show-time">ĐĂNG NHẬP NGAY</span>
                    <div v-else class="loading-reel">
                      <div class="film-reel-loader"></div>
                    </div>
                  </div>
                  <div class="ticket-holes"></div>
                </div>
              </button>
            </form>

            <!-- Social login styled as "OTHER SHOWINGS" -->
            <div class="other-showings">
              <h3>HOẶC</h3>
              <div class="showtimes">
                <button class="showtime-btn google-btn">
                  <div class="btn-content">
                    <div class="platform-icon google-icon"></div>
                    <span>GOOGLE</span>
                  </div>
                </button>
                <button class="showtime-btn facebook-btn">
                  <div class="btn-content">
                    <div class="platform-icon facebook-icon"></div>
                    <span>FACEBOOK</span>
                  </div>
                </button>
              </div>
            </div>

            <!-- Register link styled as "coming soon" -->
            <div class="coming-soon">
              <div class="filmstrip-line"></div>
              <p>
                CHƯA CÓ TÀI KHOẢN?
                <button @click="switchToRegister" class="register-link">TẠO TÀI KHOẢN</button>
              </p>
              <div class="filmstrip-line"></div>
            </div>
          </div>
        </div>

        <!-- Cinema seats at the bottom for decoration -->
        <div class="cinema-seats"></div>
      </div>
    </div>

    <!-- Register Modal -->
    <div
      v-if="showRegisterModal"
      class="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      @click="showRegisterModal = false"
    >
      <!-- Cinema backdrop -->
      <div class="absolute inset-0">
        <div class="cinema-backdrop"></div>
      </div>

      <!-- Theater screen with projector effect -->
      <div class="projector-container relative z-20" @click.stop>
        <!-- Projector light beam effect -->
        <div class="projector-beam"></div>

        <!-- Screen frame -->
        <div class="login-screen register-screen">
          <!-- Screen curtains -->
          <div class="curtain-left"></div>
          <div class="curtain-right"></div>

          <!-- Register card styled as movie screen -->
          <div class="screen-content relative">
            <!-- Content glow effect -->
            <div class="screen-glow"></div>

            <!-- Motion picture rating style header -->
            <div class="movie-rating">
              <div class="rating-box premiere-tag">
                <span>P</span>
              </div>
              <div class="rating-text">
                <div class="title-bar">
                  <span class="cinema-title">LOPHIM</span>
                  <span class="cinema-subtitle">PREMIERE</span>
                </div>
                <p>ĐĂNG KÝ THÀNH VIÊN MỚI</p>
              </div>
            </div>

            <!-- Register form in cinematic style -->
            <form @submit.prevent="handleRegister" class="movie-form">
              <!-- Fullname field -->
              <div class="form-field">
                <label for="fullName" class="field-label">TÊN ĐẦY ĐỦ</label>
                <div class="input-container">
                  <input
                    type="text"
                    id="fullName"
                    v-model="fullName"
                    placeholder="Nhập tên đầy đủ"
                    required
                  />
                  <div class="field-effect"></div>
                </div>
              </div>

              <!-- Username field -->
              <div class="form-field">
                <label for="username" class="field-label">TÊN ĐĂNG NHẬP</label>
                <div class="input-container">
                  <input
                    type="text"
                    id="username"
                    v-model="username"
                    placeholder="Tên đăng nhập của bạn"
                    required
                  />
                  <div class="field-effect"></div>
                </div>
              </div>

              <!-- Email field -->
              <div class="form-field">
                <label for="register-email" class="field-label">ĐỊA CHỈ EMAIL</label>
                <div class="input-container">
                  <input
                    type="email"
                    id="register-email"
                    v-model="email"
                    placeholder="email@example.com"
                    required
                  />
                  <div class="field-effect"></div>
                </div>
              </div>

              <!-- Password field -->
              <div class="form-field">
                <label for="register-password" class="field-label">MẬT KHẨU</label>
                <div class="input-container">
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    id="register-password"
                    v-model="password"
                    placeholder="••••••••"
                    required
                  />
                  <button type="button" class="eye-icon" @click="togglePasswordVisibility">
                    <div class="eye" :class="{ 'eye-closed': !showPassword }"></div>
                  </button>
                  <div class="field-effect"></div>
                </div>
              </div>

              <!-- Confirm Password field -->
              <div class="form-field">
                <label for="confirm-password" class="field-label">XÁC NHẬN MẬT KHẨU</label>
                <div class="input-container">
                  <input
                    :type="showConfirmPassword ? 'text' : 'password'"
                    id="confirm-password"
                    v-model="confirmPassword"
                    placeholder="••••••••"
                    required
                    :class="{ 'error-input': passwordMatchError }"
                  />
                  <button type="button" class="eye-icon" @click="toggleConfirmPasswordVisibility">
                    <div class="eye" :class="{ 'eye-closed': !showConfirmPassword }"></div>
                  </button>
                  <div class="field-effect"></div>
                </div>
                <p v-if="passwordMatchError" class="password-error">Mật khẩu không khớp!</p>
              </div>

              <!-- Register button styled as premiere ticket -->
              <button type="submit" class="movie-ticket-btn premiere-ticket" :disabled="isLoading">
                <div class="ticket-inner">
                  <div class="ticket-holes"></div>
                  <div class="ticket-content">
                    <span v-if="!isLoading" class="show-time">ĐĂNG KÝ NGAY</span>
                    <div v-else class="loading-reel">
                      <div class="film-reel-loader"></div>
                    </div>
                  </div>
                  <div class="ticket-holes"></div>
                </div>
              </button>
            </form>

            <!-- Social register styled as "OTHER SHOWINGS" -->
            <div class="other-showings">
              <h3>HOẶC</h3>
              <div class="showtimes">
                <button class="showtime-btn google-btn">
                  <div class="btn-content">
                    <div class="platform-icon google-icon"></div>
                    <span>GOOGLE</span>
                  </div>
                </button>
                <button class="showtime-btn facebook-btn">
                  <div class="btn-content">
                    <div class="platform-icon facebook-icon"></div>
                    <span>FACEBOOK</span>
                  </div>
                </button>
              </div>
            </div>

            <!-- Login link styled as "back to showings" -->
            <div class="coming-soon">
              <div class="filmstrip-line"></div>
              <p>
                ĐÃ CÓ TÀI KHOẢN?
                <button @click="switchToLogin" class="login-link">ĐĂNG NHẬP NGAY</button>
              </p>
              <div class="filmstrip-line"></div>
            </div>
          </div>
        </div>

        <!-- Cinema seats at the bottom for decoration -->
        <div class="cinema-seats"></div>
      </div>
    </div>

    <!-- First section always visible, not lazy loaded -->
    <div class="relative">
      <HeroSection />

      <!-- Gradient transition overlay -->
      <div
        class="absolute w-full h-40 bottom-0 bg-gradient-to-b from-transparent to-zinc-900 z-[30] pointer-events-none"
      ></div>
    </div>

    <div class="content-section relative">
      <!-- Use LazyLoader for CategoryGrid with custom placeholder -->
      <LazyLoader>
        <template #placeholder>
          <div class="w-full py-10">
            <div class="max-w-6xl mx-auto px-4">
              <div class="h-8 bg-zinc-800 w-1/3 rounded mb-4 animate-pulse"></div>
              <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div
                  class="aspect-square rounded bg-zinc-800 animate-pulse"
                  v-for="n in 6"
                  :key="n"
                ></div>
              </div>
            </div>
          </div>
        </template>
        <CategoryGrid />
      </LazyLoader>

      <!-- Wrapper to connect MovieHotCountry and FeaturedMovie -->
      <div class="relative">
        <!-- MovieHotCountry component -->
        <div class="relative z-10 mb-12">
          <LazyLoader rootMargin="400px 0px">
            <template #placeholder>
              <div class="w-full py-8">
                <div class="max-w-6xl mx-auto px-4">
                  <div class="h-8 bg-zinc-800 w-1/3 rounded mb-4 animate-pulse"></div>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                      class="aspect-video rounded bg-zinc-800 animate-pulse"
                      v-for="n in 3"
                      :key="n"
                    ></div>
                  </div>
                </div>
              </div>
            </template>
            <MovieHotCountry />
          </LazyLoader>
        </div>

        <!-- Enhanced gradient overlay for smoother transition -->
        <div
          class="absolute w-full h-40 bottom-0 -mb-20 bg-gradient-to-b from-transparent via-zinc-900/80 to-zinc-900 z-20 pointer-events-none"
        ></div>

        <!-- FeaturedMovie with negative margin to create overlap -->
        <div class="relative -mt-16 z-10">
          <LazyLoader rootMargin="300px 0px">
            <template #placeholder>
              <div class="w-full py-12">
                <div class="max-w-6xl mx-auto px-4">
                  <div class="h-8 bg-zinc-800 w-1/3 rounded mb-4 animate-pulse"></div>
                  <div class="h-[400px] rounded bg-zinc-800 animate-pulse"></div>
                </div>
              </div>
            </template>
            <FeaturedMovie />
          </LazyLoader>
        </div>

        <!-- Film Series Section with visual connection -->
        <div class="relative">
          <div
            class="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-zinc-900 to-transparent z-0"
          ></div>
          <div class="relative z-10 mt-8">
            <LazyLoader rootMargin="200px 0px">
              <template #placeholder>
                <div class="w-full py-10">
                  <div class="max-w-6xl mx-auto px-4">
                    <div class="h-8 bg-zinc-800 w-1/3 rounded mb-4 animate-pulse"></div>
                    <div class="flex overflow-x-auto gap-4 pb-4 hide-scrollbar">
                      <div
                        class="flex-none w-[280px] h-[180px] rounded bg-zinc-800 animate-pulse"
                        v-for="n in 5"
                        :key="n"
                      ></div>
                    </div>
                  </div>
                </div>
              </template>
              <FilmSeriesCarousel />
            </LazyLoader>
          </div>
        </div>

        <!-- Film Movies Section with visual connection -->
        <div class="relative">
          <div
            class="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-zinc-900/70 to-transparent z-0"
          ></div>
          <div class="relative z-10 mt-4">
            <LazyLoader rootMargin="200px 0px">
              <template #placeholder>
                <div class="w-full py-10">
                  <div class="max-w-6xl mx-auto px-4">
                    <div class="h-8 bg-zinc-800 w-1/3 rounded mb-4 animate-pulse"></div>
                    <div class="flex overflow-x-auto gap-4 pb-4 hide-scrollbar">
                      <div
                        class="flex-none w-[280px] h-[400px] rounded bg-zinc-800 animate-pulse"
                        v-for="n in 5"
                        :key="n"
                      ></div>
                    </div>
                  </div>
                </div>
              </template>
              <FilmMovieCarousel />
            </LazyLoader>
          </div>
        </div>

        <AppFooter />
      </div>
    </div>
  </main>
</template>

<style scoped>
.content-section {
  padding-top: 0; /* Remove top padding since we have the gradient overlap */
}

/* Hide scrollbar but keep functionality */
.hide-scrollbar {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

/* Skeleton animation */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Modal animation */
.login-card {
  perspective: 1000px;
  animation: modal-appear 0.5s cubic-bezier(0.23, 1, 0.32, 1);
}

.login-content {
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.05);
  overflow: hidden;
}

@keyframes modal-appear {
  0% {
    opacity: 0;
    transform: scale(0.9) translateY(30px) rotateX(5deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0) rotateX(0);
  }
}

/* Spotlight effect */
.spotlight {
  position: absolute;
  width: 150%;
  height: 150%;
  top: -25%;
  left: -25%;
  background: radial-gradient(circle at center, rgba(255, 0, 0, 0.05) 0%, transparent 60%);
  pointer-events: none;
  z-index: 1;
  animation: spotlight 15s infinite linear;
}

@keyframes spotlight {
  0%,
  100% {
    transform: translate(-5%, -5%);
  }
  25% {
    transform: translate(5%, 5%);
  }
  50% {
    transform: translate(5%, -5%);
  }
  75% {
    transform: translate(-5%, 5%);
  }
}

/* Cinema logo glow */
.cinema-logo-glow {
  background: radial-gradient(circle at center, rgba(220, 38, 38, 0.6) 0%, transparent 70%);
}

.logo-text {
  text-shadow: 0 0 10px rgba(220, 38, 38, 0.7);
  font-family: 'Impact', 'Arial Black', sans-serif;
  letter-spacing: 1px;
  transform: perspective(500px) rotateX(10deg);
}

/* Film line under logo */
.film-line {
  height: 2px;
  background: linear-gradient(90deg, transparent, #dc2626, transparent);
  margin: 0 auto;
  width: 60%;
}

/* Film strips */
.film-strip-top,
.film-strip-bottom {
  height: 12px;
  background-image: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.8) 10%,
    rgba(255, 255, 255, 0.2) 10%,
    rgba(255, 255, 255, 0.2) 20%,
    rgba(0, 0, 0, 0.8) 20%,
    rgba(0, 0, 0, 0.8) 30%,
    rgba(255, 255, 255, 0.2) 30%,
    rgba(255, 255, 255, 0.2) 40%,
    rgba(0, 0, 0, 0.8) 40%,
    rgba(0, 0, 0, 0.8) 50%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.2) 60%,
    rgba(0, 0, 0, 0.8) 60%,
    rgba(0, 0, 0, 0.8) 70%,
    rgba(255, 255, 255, 0.2) 70%,
    rgba(255, 255, 255, 0.2) 80%,
    rgba(0, 0, 0, 0.8) 80%,
    rgba(0, 0, 0, 0.8) 90%,
    rgba(255, 255, 255, 0.2) 90%,
    rgba(255, 255, 255, 0.2) 100%
  );
  background-size: 60px 100%;
}

.film-strip-top {
  margin: -10px -10px 0;
  border-radius: 8px 8px 0 0;
}

.film-strip-bottom {
  margin: 0 -10px -10px;
  border-radius: 0 0 8px 8px;
}

/* Film reel icon */
.film-reel-icon-container {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #1f2937;
  border: 2px solid #4b5563;
  overflow: hidden;
  position: relative;
}

.film-reel-icon::before {
  content: '';
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  border: 2px dashed #6b7280;
  border-radius: 50%;
  animation: spin 10s linear infinite;
}

.film-reel-icon::after {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  background: #6b7280;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Animated film reel background */
.film-reel {
  position: absolute;
  width: 800px;
  height: 800px;
  border-radius: 50%;
  border: 40px dashed rgba(255, 255, 255, 0.03);
  animation: spin 60s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Ticket button effect */
.ticket-button {
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(220, 38, 38, 0.4);
}

.tickets-left,
.tickets-right {
  width: 20px;
}

.tickets-left::before,
.tickets-right::before {
  content: '';
  position: absolute;
  width: 8px;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    rgba(255, 255, 255, 0.3),
    rgba(255, 255, 255, 0.3) 4px,
    transparent 4px,
    transparent 8px
  );
}

.tickets-left::before {
  left: -4px;
}

.tickets-right::before {
  right: -4px;
}

.ticket-text {
  display: inline-block;
  transition: transform 0.3s;
}

.ticket-button:hover .ticket-text {
  transform: scale(1.05);
}

/* Social login buttons */
.social-login-btn {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.social-login-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: all 0.6s ease;
}

.social-login-btn:hover::before {
  left: 100%;
}

/* Particles background */
.particles-container {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.particles-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.02) 0%, transparent 8%),
    radial-gradient(circle at 50% 70%, rgba(255, 255, 255, 0.03) 0%, transparent 12%),
    radial-gradient(circle at 80% 10%, rgba(255, 255, 255, 0.01) 0%, transparent 6%),
    radial-gradient(circle at 10% 80%, rgba(255, 255, 255, 0.02) 0%, transparent 10%),
    radial-gradient(circle at 90% 90%, rgba(255, 255, 255, 0.01) 0%, transparent 8%);
  animation: particles-float 20s infinite linear;
  transform-origin: center;
}

@keyframes particles-float {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
  }
  25% {
    transform: scale(1.1) rotate(1deg);
  }
  50% {
    transform: scale(1.05) rotate(-1deg);
  }
  75% {
    transform: scale(1.1) rotate(0.5deg);
  }
}

/* Blur backdrop */
.backdrop-filter {
  backdrop-filter: blur(12px);
}

/* Animation for modal open/close */
:global(body.modal-open) {
  overflow: hidden;
}

/* Floating inputs */
.form-group input:focus + label,
.form-group input:not(:placeholder-shown) + label {
  transform: translateY(-3.5rem) scale(0.75);
}

/* CSS to create cinematic responsive design */
@media (max-width: 640px) {
  .login-content {
    padding: 6vw;
  }

  .login-header h1 {
    font-size: 1.75rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .login-card,
  .spotlight,
  .film-reel,
  .ticket-text,
  .social-login-btn::before {
    animation: none;
    transition: none;
  }
}

/* Cinema experience styling */

/* Cinema screen backdrop */
.cinema-backdrop {
  position: absolute;
  inset: 0;
  background-color: #000;
  opacity: 0.92;
  background-image:
    linear-gradient(rgba(20, 20, 20, 0.8) 1px, transparent 1px),
    linear-gradient(90deg, rgba(20, 20, 20, 0.8) 1px, transparent 1px);
  background-size: 40px 40px;
  animation: backdrop-float 120s linear infinite;
}

@keyframes backdrop-float {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 80px 80px;
  }
}

/* Projector setup */
.projector-container {
  max-width: 90%;
  width: 540px;
  perspective: 1000px;
  perspective-origin: 50% -40%;
  margin-bottom: -40px;
  transform-style: preserve-3d;
  animation: screen-appear 1.5s cubic-bezier(0.23, 1, 0.32, 1) forwards;
}

@keyframes screen-appear {
  from {
    opacity: 0;
    transform: translateY(40px) rotateX(20deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) rotateX(12deg);
  }
}

.projector-beam {
  position: absolute;
  top: -100vh;
  left: 50%;
  transform: translateX(-50%);
  width: 140%;
  height: 100vh;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.03) 75%,
    rgba(255, 255, 255, 0.08) 100%
  );
  clip-path: polygon(0% 100%, 100% 100%, 65% 0%, 35% 0%);
  pointer-events: none;
  z-index: -1;
}

/* Cinema screen */
.login-screen {
  position: relative;
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
  box-shadow:
    0 5px 15px rgba(0, 0, 0, 0.8),
    0 15px 35px rgba(0, 0, 0, 0.5),
    0 45px 65px rgba(0, 0, 0, 0.35);
}

/* Curtains effect */
.curtain-left,
.curtain-right {
  position: absolute;
  top: 0;
  height: 100%;
  width: 8%; /* Giảm từ 15% xuống 8% */
  background-color: #760000;
  background-image:
    linear-gradient(90deg, #670000 0%, #920000 50%, #670000 100%),
    linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.3) 0%,
      transparent 15%,
      rgba(0, 0, 0, 0.3) 30%,
      transparent 45%,
      rgba(0, 0, 0, 0.3) 60%,
      transparent 75%,
      rgba(0, 0, 0, 0.3) 90%
    );
  background-size:
    100% 100%,
    100% 120px;
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.5);
  z-index: 10;
  animation-duration: 2s;
  animation-fill-mode: forwards;
  animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes curtain-left {
  from {
    transform: translateX(-5%) scaleX(5);
  }
  to {
    transform: translateX(0) scaleX(1);
  }
}

@keyframes curtain-right {
  from {
    transform: translateX(5%) scaleX(5);
  }
  to {
    transform: translateX(0) scaleX(1);
  }
}

/* Screen content */
.screen-content {
  min-height: 500px;
  background-color: #121212;
  background-image:
    linear-gradient(to bottom, rgba(40, 40, 40, 0.4) 0%, transparent 10%, rgba(0, 0, 0, 0.2) 100%),
    repeating-linear-gradient(
      to bottom,
      transparent,
      transparent 1px,
      rgba(255, 255, 255, 0.02) 1px,
      rgba(255, 255, 255, 0.02) 2px
    );
  padding: 35px 30px 30px; /* Tăng padding ngang lên */
  text-align: center;
  color: #fff;
  overflow: hidden;
  position: relative;
}

.screen-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 255, 255, 0.03) 0%,
    rgba(0, 0, 0, 0) 70%
  );
  pointer-events: none;
}

/* Movie rating style header */
.movie-rating {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  gap: 15px;
}

.rating-box {
  width: 36px;
  height: 36px;
  border: 2px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  font-family: 'Impact', sans-serif;
  letter-spacing: 1px;
}

.rating-text {
  text-align: left;
}

.title-bar {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.cinema-title {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 3px;
  font-family: 'Impact', 'Arial Black', sans-serif;
  background: linear-gradient(to bottom, #fff 0%, #ccc 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.cinema-subtitle {
  font-size: 14px;
  opacity: 0.6;
}

.rating-text p {
  font-size: 12px;
  opacity: 0.6;
  letter-spacing: 1px;
  margin-top: 2px;
}

/* Movie form styling */
.movie-form {
  position: relative;
  z-index: 1;
  margin: 0 auto;
  max-width: 90%; /* Tăng từ 85% lên 90% */
}

.form-field {
  margin-bottom: 22px;
  text-align: left;
}

.field-label {
  display: block;
  font-size: 11px;
  letter-spacing: 1px;
  color: #b9b9b9;
  margin-bottom: 5px;
  font-weight: 600;
}

.input-container {
  position: relative;
  overflow: hidden;
}

.form-field input {
  width: 100%;
  padding: 12px 16px;
  border: none;
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  color: #fff;
  font-family: 'Courier New', monospace;
  font-size: 16px;
  letter-spacing: 0.5px;
}

.form-field input:focus {
  outline: none;
}

.field-effect {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 100%
  );
  animation: scan-line 2s linear infinite;
}

@keyframes scan-line {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.eye-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.eye {
  width: 16px;
  height: 16px;
  position: relative;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.eye::before {
  content: '';
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.8);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.eye.eye-closed::before {
  width: 14px;
  height: 1px;
  border-radius: 0;
  background-color: rgba(255, 255, 255, 0.6);
}

/* Movie options */
.movie-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  font-size: 12px;
}

.ticket-option {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.ticket-stub {
  position: relative;
  width: 16px;
  height: 16px;
  border: 1px dashed rgba(255, 255, 255, 0.4);
  margin-right: 8px;
}

.ticket-option input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.ticket-option input:checked + .ticket-text {
  color: #dc2626;
}

.ticket-option input:checked ~ .ticket-stub {
  background-color: rgba(220, 38, 38, 0.2);
  border-color: rgba(220, 38, 38, 0.6);
}

.ticket-option input:checked ~ .ticket-stub::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #dc2626;
  font-size: 12px;
}

.ticket-text {
  color: rgba(255, 255, 255, 0.6);
  font-size: 11px;
  letter-spacing: 0.5px;
  transition: color 0.2s;
}

.forgot-password {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 11px;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
}

.forgot-password::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.4);
  transform: translateX(-100%);
  transition: transform 0.3s;
}

.forgot-password:hover {
  color: rgba(255, 255, 255, 0.9);
}

.forgot-password:hover::after {
  transform: translateX(0);
}

/* Movie ticket button */
.movie-ticket-btn {
  width: 100%;
  margin: 10px 0 30px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  transition: transform 0.3s;
}

.movie-ticket-btn:hover {
  transform: translateY(-3px);
}

.ticket-inner {
  background-color: #dc2626;
  height: 44px;
  border-radius: 4px;
  position: relative;
  display: flex;
  overflow: hidden;
}

.ticket-holes {
  flex: 0 0 35px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: 8px 0;
}

.ticket-holes::before,
.ticket-holes::after {
  content: '';
  width: 12px;
  height: 6px;
  background-color: #121212;
  border-radius: 3px;
}

.ticket-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.show-time {
  color: #fff;
  font-size: 15px;
  font-weight: bold;
  letter-spacing: 1px;
  position: relative;
  z-index: 2;
}

.ticket-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.1) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.1) 75%,
    transparent 75%,
    transparent
  );
  background-size: 4px 4px;
  opacity: 0.3;
}

.movie-ticket-btn[disabled] {
  cursor: not-allowed;
  opacity: 0.7;
}

/* Film reel loader */
.loading-reel {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.film-reel-loader {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #fff;
  animation: spin 1s linear infinite;
  position: relative;
}

.film-reel-loader::before,
.film-reel-loader::after {
  content: '';
  position: absolute;
  border-radius: 50%;
}

.film-reel-loader::before {
  top: 3px;
  left: 3px;
  right: 3px;
  bottom: 3px;
  border: 2px dotted rgba(255, 255, 255, 0.6);
}

.film-reel-loader::after {
  top: 7px;
  left: 7px;
  right: 7px;
  bottom: 7px;
  background-color: rgba(255, 255, 255, 0.4);
}

/* Other showings section */
.other-showings {
  margin-top: 15px;
  margin-bottom: 25px;
}

.other-showings h3 {
  font-size: 12px;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 15px;
  position: relative;
}

.other-showings h3::before,
.other-showings h3::after {
  content: '';
  position: absolute;
  top: 50%;
  height: 1px;
  width: 25%;
  background-color: rgba(255, 255, 255, 0.1);
}

.other-showings h3::before {
  left: 10%;
}

.other-showings h3::after {
  right: 10%;
}

.showtimes {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.showtime-btn {
  flex: 1;
  padding: 12px;
  background-color: rgba(255, 255, 255, 0.06);
  border: none;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
}

.showtime-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.platform-icon {
  width: 18px;
  height: 18px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.google-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="%234285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/><path fill="%2334A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/><path fill="%23FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"/><path fill="%23EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/></svg>');
}

.facebook-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="%231877F2" d="M48 24C48 10.745 37.255 0 24 0S0 10.745 0 24c0 11.979 8.776 21.907 20.25 23.708v-16.77h-6.094V24h6.094v-5.288c0-6.014 3.583-9.337 9.065-9.337 2.625 0 5.372.469 5.372.469v5.906h-3.026c-2.981 0-3.911 1.85-3.911 3.75V24h6.656l-1.064 6.938H27.75v16.77C39.224 45.907 48 35.978 48 24"/><path fill="%23FFFFFF" d="M33.342 30.938L34.406 24h-6.656v-4.5c0-1.9.93-3.75 3.911-3.75h3.026V9.844s-2.747-.469-5.372-.469c-5.482 0-9.065 3.323-9.065 9.337V24h-6.094v6.938h6.094v16.77a24.174 24.174 0 007.5 0v-16.77h5.592z"/></svg>');
}

.showtime-btn span {
  color: #fff;
  font-size: 12px;
  letter-spacing: 1px;
  font-weight: 500;
}

/* Coming soon section */
.coming-soon {
  padding-top: 10px;
  position: relative;
}

.filmstrip-line {
  height: 4px;
  margin: 12px 0;
  background-image: linear-gradient(
    90deg,
    transparent 0%,
    transparent 10%,
    rgba(255, 255, 255, 0.05) 10%,
    rgba(255, 255, 255, 0.05) 90%,
    transparent 90%,
    transparent 100%
  );
  position: relative;
}

.filmstrip-line::before,
.filmstrip-line::after {
  content: '';
  position: absolute;
  height: 100%;
  width: 20%;
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.05) 20%,
    transparent 20%,
    transparent 40%,
    rgba(255, 255, 255, 0.05) 40%,
    rgba(255, 255, 255, 0.05) 60%,
    transparent 60%,
    transparent 80%,
    rgba(255, 255, 255, 0.05) 80%,
    rgba(255, 255, 255, 0.05) 100%
  );
  background-size: 10px 100%;
}

.filmstrip-line::before {
  left: 0;
}

.filmstrip-line::after {
  right: 0;
}

.coming-soon p {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.5px;
  margin: 10px 0;
}

.register-link {
  color: #dc2626;
  text-decoration: none;
  position: relative;
  display: inline-block;
  margin-left: 4px;
  padding: 0 4px;
  font-weight: 600;
  letter-spacing: 1px;
}

.register-link::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: rgba(220, 38, 38, 0.2);
  z-index: -1;
  transition: height 0.2s;
}

.register-link:hover::before {
  height: 100%;
}

/* Cinema seats decoration */
.cinema-seats {
  height: 60px;
  width: 120%;
  margin: 0 -10%;
  background-image: radial-gradient(
    circle at center,
    rgba(20, 20, 20, 0.6) 0,
    rgba(20, 20, 20, 0.6) 2px,
    transparent 3px,
    transparent 9px
  );
  background-size: 10px 10px;
  background-position: center bottom;
  transform: perspective(200px) rotateX(60deg);
  transform-origin: center bottom;
  position: relative;
  z-index: -1;
  margin-top: -20px;
}

/* Responsive styling */
@media (max-width: 640px) {
  .projector-container {
    width: 95%;
    margin-bottom: -20px;
  }

  .movie-form {
    max-width: 100%; /* Sử dụng toàn bộ không gian trên mobile */
  }

  .curtain-left,
  .curtain-right {
    width: 5%; /* Thu nhỏ hơn nữa trên mobile */
  }

  /* Các điều chỉnh khác giữ nguyên */
  .showtimes {
    flex-direction: column;
    gap: 10px;
  }

  .projector-beam {
    display: none;
  }

  /* Tăng kích thước input đảm bảo dễ nhập liệu trên mobile */
  .form-field input {
    padding: 14px 16px;
  }
}

/* Animation fixes for reduced motion */
@media (prefers-reduced-motion: reduce) {
  .projector-container,
  .curtain-left,
  .curtain-right,
  .field-effect,
  .film-reel-loader {
    animation: none;
  }
}

/* Register form specific styles */
.register-screen {
  min-height: 680px;
}

.premiere-tag {
  background-color: #3b82f6;
  border-color: #60a5fa;
}

.premiere-ticket .ticket-inner {
  background-color: #3b82f6;
  background-image: linear-gradient(45deg, #2563eb, #3b82f6);
}

.password-error {
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
  text-align: left;
}

.error-input {
  border: 1px solid #ef4444 !important;
  box-shadow: 0 0 0 1px #ef4444;
}

.login-link {
  color: #3b82f6;
  text-decoration: none;
  position: relative;
  display: inline-block;
  margin-left: 4px;
  padding: 0 4px;
  font-weight: 600;
  letter-spacing: 1px;
}

.login-link::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: rgba(59, 130, 246, 0.2);
  z-index: -1;
  transition: height 0.2s;
}

.login-link:hover::before {
  height: 100%;
}

@media (max-width: 640px) {
  .register-screen {
    overflow-y: auto;
    max-height: 90vh;
  }
}
</style>
