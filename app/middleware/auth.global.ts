export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAuthenticated } = useAuth();
  const { user, fetchUser } = useUser();

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return navigateTo("/login");
  }
  
  if (await isAuthenticated.value && !user.value) {
    await fetchUser();
  }
});
