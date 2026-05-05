export default defineNuxtRouteMiddleware(async (to) => {
  const { user, fetchUser, loading } = useAuth();

  if (loading.value) {
    await fetchUser();
  }

  const publicPages = ["/login"];
  const isPublic = publicPages.includes(to.path);

  if (!user.value && !isPublic) {
    return navigateTo("/login");
  }

  if (user.value && isPublic) {
    return navigateTo("/dashboard");
  }
});
