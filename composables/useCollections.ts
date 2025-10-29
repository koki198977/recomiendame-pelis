import { useAuthToken } from "./useAuthState";

interface CollectionPayload {
  tmdbId: number;
  mediaType: string;
  title?: string;
}

type CollectionType = "favorites" | "seen" | "wishlist";

const keyFor = (tmdbId?: number, mediaType?: string) =>
  tmdbId ? `${tmdbId}:${mediaType ?? "unknown"}` : "";

const serializePayload = (
  type: CollectionType,
  payload: CollectionPayload
) => {
  const base: Record<string, any> = {
    tmdbId: payload.tmdbId,
    mediaType: payload.mediaType,
  };

  if (type === "favorites" && payload.title) {
    base.title = payload.title;
  }

  return base;
};

export const useCollections = () => {
  const favorites = useState<Record<string, boolean>>(
    "collections:favorites",
    () => ({})
  );
  const seen = useState<Record<string, boolean>>(
    "collections:seen",
    () => ({})
  );
  const wishlist = useState<Record<string, boolean>>(
    "collections:wishlist",
    () => ({})
  );
  const loaded = useState<boolean>("collections:loaded", () => false);
  const loading = useState<boolean>("collections:loading", () => false);

  const authToken = useAuthToken();
  const config = useRuntimeConfig();

  const getStore = (type: CollectionType) => {
    if (type === "favorites") return favorites;
    if (type === "seen") return seen;
    return wishlist;
  };

const normalizeEntries = (items: any): any[] => {
  if (Array.isArray(items)) return items;
  if (items && Array.isArray(items.items)) return items.items;
  if (items && Array.isArray(items.data)) return items.data;
  return [];
};

const extractKeyData = (entry: any) => {
  const tmdb = entry?.tmdb ?? {};
  const tmdbId = entry?.tmdbId ?? tmdb?.id;
  const mediaType = entry?.mediaType ?? tmdb?.mediaType;
  return { tmdbId, mediaType };
};

const setValues = (type: CollectionType, items: any) => {
  const store = getStore(type);
  const next: Record<string, boolean> = {};
  for (const entry of normalizeEntries(items)) {
    const { tmdbId, mediaType } = extractKeyData(entry);
    const key = keyFor(tmdbId, mediaType);
    if (key) next[key] = true;
  }
  store.value = next;
};

  const mergeValue = (type: CollectionType, payload: CollectionPayload) => {
    const store = getStore(type);
    const key = keyFor(payload.tmdbId, payload.mediaType);
    if (key) {
      store.value = { ...store.value, [key]: true };
    }
  };

  const isIn = (type: CollectionType, tmdbId?: number, mediaType?: string) => {
    const store = getStore(type);
    const key = keyFor(tmdbId, mediaType);
    return key ? Boolean(store.value[key]) : false;
  };

  const fetchCollection = async (type: CollectionType) => {
    try {
      const response = await $fetch<any>(`/${type}`, {
        baseURL: config.public.apiBase,
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken.value}`,
        },
      });
      setValues(type, response ?? []);
    } catch (error: any) {
      // Ignorar si el endpoint no permite GET todavía
      console.warn(`No se pudo cargar ${type}:`, error?.statusMessage || error);
    }
  };

  const ensureLoaded = async () => {
    if (loaded.value || loading.value || !authToken.value) return;
    loading.value = true;
    try {
      await Promise.all([
        fetchCollection("favorites"),
        fetchCollection("seen"),
        fetchCollection("wishlist"),
      ]);
      loaded.value = true;
    } finally {
      loading.value = false;
    }
  };

  const addTo = async (type: CollectionType, payload: CollectionPayload) => {
    if (!authToken.value) {
      throw new Error("NO_AUTH");
    }
    if (!payload.tmdbId) {
      throw new Error("INVALID_PAYLOAD");
    }
    if (isIn(type, payload.tmdbId, payload.mediaType)) {
      return true;
    }
    try {
      await $fetch(`/${type}`, {
        baseURL: config.public.apiBase,
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken.value}`,
        },
        body: serializePayload(type, payload),
      });
      mergeValue(type, payload);
      return true;
    } catch (error) {
      const status = (error as any)?.status;
      if (status === 409) {
        mergeValue(type, payload);
        return true;
      }
      console.error(`No se pudo agregar a ${type}`, error);
      throw error;
    }
  };

  return {
    ensureLoaded,
    isFavorite: (tmdbId?: number, mediaType?: string) =>
      isIn("favorites", tmdbId, mediaType),
    isSeen: (tmdbId?: number, mediaType?: string) =>
      isIn("seen", tmdbId, mediaType),
    isInWishlist: (tmdbId?: number, mediaType?: string) =>
      isIn("wishlist", tmdbId, mediaType),
    addFavorite: (payload: CollectionPayload) =>
      addTo("favorites", payload),
    addSeen: (payload: CollectionPayload) => addTo("seen", payload),
    addWishlist: (payload: CollectionPayload) =>
      addTo("wishlist", payload),
  };
};
