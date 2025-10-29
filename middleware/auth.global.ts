export default defineNuxtRouteMiddleware((to, from) => {
  if (!process.client) {
    return;
  }

  const isProtected = [
    "/dashboard",
    "/recommendations",
    "/seen",
    "/favorites",
    "/wishlist",
    "/profile",
  ].some((path) => to.path.startsWith(path));

  const token = localStorage.getItem("recomiendame_token");

  if (isProtected && !token) {
    return navigateTo("/login");
  }
});
