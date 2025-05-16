<script setup>
import { ref } from 'vue'

const currentYear = new Date().getFullYear()
const showSubscribeSuccess = ref(false)
const email = ref('')

const handleSubscribe = (e) => {
  e.preventDefault()
  if (email.value) {
    showSubscribeSuccess.value = true
    setTimeout(() => {
      showSubscribeSuccess.value = false
      email.value = ''
    }, 3000)
  }
}
</script>

<template>
  <footer class="bg-zinc-900 border-t border-zinc-800 pt-12 pb-6 mt-12">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Top section with logo and navigation -->
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
        <!-- Logo and about -->
        <div class="space-y-4">
          <div class="flex items-center">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center">
              <span class="text-white font-bold text-lg">LP</span>
            </div>
            <h2 class="ml-2 text-white text-xl font-bold">LOPHIM</h2>
          </div>
          
          <p class="text-zinc-400 text-sm">
            Kho phim HD miễn phí với hàng ngàn bộ phim mới và phổ biến. Xem phim trực tuyến với chất lượng cao và không có quảng cáo.
          </p>
          
          <!-- Social icons -->
          <div class="flex space-x-4 pt-2">
            <a href="#" class="w-9 h-9 rounded-full bg-zinc-800 hover:bg-red-600 flex items-center justify-center transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
            </a>
            <a href="#" class="w-9 h-9 rounded-full bg-zinc-800 hover:bg-red-600 flex items-center justify-center transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </a>
            <a href="#" class="w-9 h-9 rounded-full bg-zinc-800 hover:bg-red-600 flex items-center justify-center transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="#" class="w-9 h-9 rounded-full bg-zinc-800 hover:bg-red-600 flex items-center justify-center transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
            </a>
          </div>
        </div>
        
        <!-- Quick links -->
        <div>
          <h3 class="text-white font-bold text-lg mb-4">Liên Kết Nhanh</h3>
          <ul class="space-y-2">
            <li><a href="#" class="text-zinc-400 hover:text-red-500 transition-colors text-sm">Trang Chủ</a></li>
            <li><a href="#" class="text-zinc-400 hover:text-red-500 transition-colors text-sm">Phim Lẻ</a></li>
            <li><a href="#" class="text-zinc-400 hover:text-red-500 transition-colors text-sm">Phim Bộ</a></li>
            <li><a href="#" class="text-zinc-400 hover:text-red-500 transition-colors text-sm">Phim Chiếu Rạp</a></li>
            <li><a href="#" class="text-zinc-400 hover:text-red-500 transition-colors text-sm">Phim Mới</a></li>
            <li><a href="#" class="text-zinc-400 hover:text-red-500 transition-colors text-sm">Phim Thuyết Minh</a></li>
          </ul>
        </div>
        
        <!-- Categories -->
        <div>
          <h3 class="text-white font-bold text-lg mb-4">Thể Loại</h3>
          <div class="grid grid-cols-2 gap-x-4 gap-y-2">
            <a href="#" class="text-zinc-400 hover:text-red-500 transition-colors text-sm">Hành Động</a>
            <a href="#" class="text-zinc-400 hover:text-red-500 transition-colors text-sm">Tình Cảm</a>
            <a href="#" class="text-zinc-400 hover:text-red-500 transition-colors text-sm">Hài Hước</a>
            <a href="#" class="text-zinc-400 hover:text-red-500 transition-colors text-sm">Cổ Trang</a>
            <a href="#" class="text-zinc-400 hover:text-red-500 transition-colors text-sm">Kinh Dị</a>
            <a href="#" class="text-zinc-400 hover:text-red-500 transition-colors text-sm">Chiến Tranh</a>
            <a href="#" class="text-zinc-400 hover:text-red-500 transition-colors text-sm">Hoạt Hình</a>
            <a href="#" class="text-zinc-400 hover:text-red-500 transition-colors text-sm">Viễn Tưởng</a>
          </div>
        </div>
        
        <!-- Newsletter -->
        <div class="lg:col-span-1">
          <h3 class="text-white font-bold text-lg mb-4">Nhận Thông Báo Phim Mới</h3>
          <p class="text-zinc-400 text-sm mb-4">Đăng ký nhận email thông báo khi có phim mới.</p>
          
          <form @submit="handleSubscribe" class="relative">
            <input 
              type="email" 
              v-model="email"
              placeholder="Email của bạn" 
              class="w-full bg-zinc-800 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
              required
            />
            <button 
              type="submit"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded text-sm transition-colors"
            >
              Đăng Ký
            </button>
          </form>
          
          <!-- Success message -->
          <div 
            v-if="showSubscribeSuccess"
            class="mt-2 text-green-500 text-sm flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            Đăng ký thành công!
          </div>
        </div>
      </div>
      
      <!-- Divider -->
      <div class="h-px bg-zinc-800 my-8"></div>
      
      <!-- Bottom section with copyright and links -->
      <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div class="text-zinc-500 text-sm text-center md:text-left">
          &copy; {{ currentYear }} LOPHIM. Tất cả các quyền được bảo lưu.
        </div>
        
        <div class="flex flex-wrap justify-center gap-4 text-sm text-zinc-500">
          <a href="#" class="hover:text-red-500 transition-colors">Điều Khoản Sử Dụng</a>
          <a href="#" class="hover:text-red-500 transition-colors">Chính Sách Bảo Mật</a>
          <a href="#" class="hover:text-red-500 transition-colors">Liên Hệ</a>
          <a href="#" class="hover:text-red-500 transition-colors">Giới Thiệu</a>
        </div>
      </div>
      
      <!-- Disclaimer -->
      <div class="mt-6 text-center text-xs text-zinc-600">
        <p>LOPHIM không lưu trữ bất kỳ nội dung nào trên trang web này. Tất cả nội dung đều được lấy từ các nguồn bên thứ ba.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Additional custom styles can be added here if needed */
</style>
