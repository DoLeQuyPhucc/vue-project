import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as { email: string } | null,
    token: null as string | null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
  actions: {
    login(email: string, password: string) {
      // TODO: call real API here
      this.token = 'fake_token'
      this.user = { email }
    },
    logout() {
      this.user = null
      this.token = null
    },
  },
})
