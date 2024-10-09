import { useAuthStore } from '~/stores/auth/AuthStore';

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  const publicPages = ['/'];
  const openForUsers = ['/games'];

  // Check if the user is logged in
  if (!authStore.getIsLoggedIn && !publicPages.includes(to.path)) {
    return navigateTo('/');
  }

  // Check if the user role is 'student' and restrict access to certain pages
  if (
    authStore.getIsLoggedIn &&
    authStore.user.role === 'student' &&
    !openForUsers.includes(to.path)
  ) {
    return navigateTo('/games');
  }
});
