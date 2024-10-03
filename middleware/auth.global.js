import { useAuthStore } from '~/stores/auth/AuthStore';

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  const publicPages = ['/'];

  if (!authStore.getIsLoggedIn && !publicPages.includes(to.path)) {
    return navigateTo('/');
  }
});
