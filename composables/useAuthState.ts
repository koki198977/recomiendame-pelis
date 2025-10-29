export const useAuthToken = () =>
  useState<string | null>("recomiendame_token", () => {
    if (process.client) {
      return localStorage.getItem("recomiendame_token");
    }
    return null;
  });

export const useAuthUser = () =>
  useState<Record<string, any> | null>("recomiendame_user", () => {
    if (process.client) {
      const stored = localStorage.getItem("recomiendame_user");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return null;
        }
      }
    }
    return null;
  });

export const syncAuthState = () => {
  if (!process.client) return;
  const tokenState = useAuthToken();
  const userState = useAuthUser();

  const token = localStorage.getItem("recomiendame_token");
  const user = localStorage.getItem("recomiendame_user");

  tokenState.value = token;
  if (user) {
    try {
      userState.value = JSON.parse(user);
    } catch {
      userState.value = null;
    }
  } else {
    userState.value = null;
  }
};
