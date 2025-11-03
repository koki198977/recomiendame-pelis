export const useAuthToken = () =>
  useState<string | null>("recomiendame_token", () => null);

export const useAuthUser = () =>
  useState<Record<string, any> | null>("recomiendame_user", () => null);

export const syncAuthState = () => {
  if (!process.client) return;
  
  const tokenState = useAuthToken();
  const userState = useAuthUser();

  try {
    const token = localStorage.getItem("recomiendame_token");
    const user = localStorage.getItem("recomiendame_user");

    tokenState.value = token;
    
    if (user) {
      try {
        userState.value = JSON.parse(user);
      } catch (error) {
        console.warn('Error parsing user data:', error);
        userState.value = null;
        localStorage.removeItem("recomiendame_user");
      }
    } else {
      userState.value = null;
    }
  } catch (error) {
    console.warn('Error syncing auth state:', error);
    tokenState.value = null;
    userState.value = null;
  }
};

export const initAuthState = () => {
  if (!process.client) return;
  
  // Solo sincronizar en el cliente después de que la página esté completamente cargada
  if (typeof window !== 'undefined') {
    syncAuthState();
  }
};
