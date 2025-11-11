import { clearAuthState } from '~/composables/useAuthState';

export default defineNuxtPlugin((nuxtApp) => {
  if (!process.client) return;

  let isRedirecting = false;

  function handleUnauthorized() {
    if (isRedirecting) return;

    isRedirecting = true;

    // Limpiar estado de autenticación
    clearAuthState();

    console.warn('Sesión expirada. Redirigiendo al login...');

    // Redirigir al login
    navigateTo('/login');
    
    // Reset después de un tiempo
    setTimeout(() => {
      isRedirecting = false;
    }, 1000);
  }

  // Interceptor global para errores de fetch
  nuxtApp.hook('vue:error', (error: any) => {
    if (error?.status === 401 || error?.statusCode === 401) {
      handleUnauthorized();
    }
  });

  // Interceptor para errores de la app
  nuxtApp.hook('app:error', (error: any) => {
    if (error?.status === 401 || error?.statusCode === 401) {
      handleUnauthorized();
    }
  });

  // Proporcionar función global para manejar 401
  return {
    provide: {
      handleUnauthorized,
    },
  };
});
