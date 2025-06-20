export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAuthenticated, validateToken, logout } = useAuth();
  const { user, fetchUser } = useUser();

  // If the route requires authentication and the user is not authenticated,
  if (to.meta.requiresAuth && !(await isAuthenticated.value)) {
    return navigateTo("/login?redirect=" + encodeURIComponent(from.fullPath));
  }

  // If the user is authenticated but not yet fetched, fetch the user data
  // This is to ensure that the user data is available for the authenticated routes
  if (isAuthenticated.value && !user.value) {
    const tokenIsValid = await validateToken();

    if (tokenIsValid) {
      await fetchUser();
    } else {
      await logout();
    }
  }
});
