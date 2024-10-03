import { defineStore } from 'pinia';
import { useRouter } from '#app';

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    user: null,
    isLoggedIn: null,
  }),
  persist: {
    cookies: {
      domain: 'http://localhost:3000/',
      expires: new Date(new Date().getTime() + 60 * 60 * 24 * 1000), // 1 day
      httpOnly: false,
      maxAge: 60 * 60 * 24, // 1 day in seconds
      path: '/',
      sameSite: 'strict',
      secure: true,
    },
  },
  getters: {
    getIsLoggedIn() {
      return this.isLoggedIn;
    },
  },
  actions: {
    setLoggedInUser(user) {
      this.user = user;
      this.isLoggedIn = true;
    },
    logout() {
      this.user = null;
      this.isLoggedIn = false;
      const router = useRouter();
      router.push('/');
    },
  },
});
