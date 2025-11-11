import { clearAuthState } from '~/composables/useAuthState';

// Función para verificar si un token JWT está expirado
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convertir a milisegundos
    return Date.now() >= exp;
  } catch {
    return true; // Si no se puede parsear, considerarlo expirado
  }
}

export default defineNuxtRouteMiddleware((to, from) => {
  // Solo ejecutar en el cliente
  if (!process.client) return;

  const token = useAuthToken();
  const user = useAuthUser();

  // Rutas que requieren autenticación
  const protectedRoutes = [
    '/dashboard',
    '/recommendations',
    '/favorites',
    '/seen',
    '/wishlist',
    '/profile',
    '/admin',
  ];

  // Verificar si la ruta actual requiere autenticación
  const isProtectedRoute = protectedRoutes.some(route => to.path.startsWith(route));

  // Si es una ruta protegida
  if (isProtectedRoute) {
    // Si no hay token, redirigir al login
    if (!token.value) {
      return navigateTo('/login');
    }

    // Si hay token, verificar si está expirado
    if (isTokenExpired(token.value)) {
      console.warn('Token expirado, redirigiendo al login...');
      clearAuthState();
      return navigateTo('/login');
    }
  }

  // Si hay token pero no hay usuario, intentar sincronizar
  if (token.value && !user.value) {
    try {
      const stored = localStorage.getItem('recomiendame_user');
      if (stored) {
        user.value = JSON.parse(stored);
      } else {
        // Si no hay usuario almacenado, limpiar token y redirigir
        clearAuthState();
        
        if (isProtectedRoute) {
          return navigateTo('/login');
        }
      }
    } catch (error) {
      console.error('Error al sincronizar usuario:', error);
      clearAuthState();
      
      if (isProtectedRoute) {
        return navigateTo('/login');
      }
    }
  }
});
