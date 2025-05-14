import { defineStore } from 'pinia'

interface User {
  email: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
  actions: {
    login(email: string, password: string) {
      this.token = 'fake_token'
      this.user = { email }
    },
    logout() {
      this.token = null
      this.user = null
    },
  },
})
