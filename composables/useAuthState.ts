export const useAuthToken = () =>
  useState<string | null>("recomiendame_token", () => null);

export const useAuthUser = () =>
  useState<Record<string, any> | null>("recomiendame_user", () => null);

export const useIsAdmin = () =>
  useState<boolean>("recomiendame_is_admin", () => false);

export const syncAuthState = () => {
  if (!process.client) return;
  
  const tokenState = useAuthToken();
  const userState = useAuthUser();
  const adminState = useIsAdmin();

  try {
    const token = localStorage.getItem("recomiendame_token");
    const user = localStorage.getItem("recomiendame_user");
    const adminFlag = localStorage.getItem("recomiendame_admin");

    tokenState.value = token;
    
    if (user) {
      try {
        const parsed = JSON.parse(user);
        if (adminFlag === "true" && parsed && typeof parsed === "object") {
          userState.value = { ...parsed, admin: true };
        } else {
          userState.value = parsed;
        }
      } catch (error) {
        console.warn('Error parsing user data:', error);
        userState.value = null;
        localStorage.removeItem("recomiendame_user");
      }
    } else {
      userState.value = null;
    }

    adminState.value = adminFlag === "true";
  } catch (error) {
    console.warn('Error syncing auth state:', error);
    tokenState.value = null;
    userState.value = null;
    adminState.value = false;
  }
};

export const initAuthState = () => {
  if (!process.client) return;
  
  // Solo sincronizar en el cliente después de que la página esté completamente cargada
  if (typeof window !== 'undefined') {
    syncAuthState();
  }
};
