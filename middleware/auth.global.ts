export default defineNuxtRouteMiddleware((to, from) => {
  if (!process.client) {
    return;
  }

  const protectedPrefixes = [
    "/dashboard",
    "/recommendations",
    "/seen",
    "/favorites",
    "/wishlist",
    "/profile",
  ];

  const isProtected = protectedPrefixes.some((path) => to.path.startsWith(path));

  const token = localStorage.getItem("recomiendame_token");

  if (to.path === "/" && token) {
    return navigateTo("/dashboard");
  }

  if (isProtected && !token) {
    return navigateTo("/login");
  }
});
