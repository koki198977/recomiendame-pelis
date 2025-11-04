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
    "/admin",
  ];

  const isProtected = protectedPrefixes.some((path) => to.path.startsWith(path));

  const token = localStorage.getItem("recomiendame_token");

  // Para rutas protegidas sin token, redireccionar al login
  if (isProtected && !token) {
    return navigateTo("/login");
  }

  if (to.path.startsWith("/admin")) {
    const isAdmin = localStorage.getItem("recomiendame_admin") === "true";
    if (!isAdmin) {
      return navigateTo(token ? "/dashboard" : "/login");
    }
  }

  // No hacer redirección automática desde "/" aquí
  // Esto se manejará en la página principal después de la hidratación
});
