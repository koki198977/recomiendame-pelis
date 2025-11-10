import { useAuthToken } from "./useAuthState";

interface Rating {
  id: string;
  tmdbId: number;
  mediaType: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export const useRatings = () => {
  const ratingsMap = useState<Map<number, Rating>>("ratings:map", () => new Map());
  const loaded = useState<boolean>("ratings:loaded", () => false);
  const loading = useState<boolean>("ratings:loading", () => false);

  const authToken = useAuthToken();
  const config = useRuntimeConfig();

  const fetchRatings = async (options?: { force?: boolean }) => {
    const force = options?.force ?? false;
    if ((!force && loaded.value) || loading.value || !authToken.value) return;

    loading.value = true;
    try {
      const response = await $fetch<{ ratings: Rating[] }>("/ratings", {
        baseURL: config.public.apiBase,
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken.value}`,
        },
      });

      const ratings = response?.ratings ?? [];
      const newMap = new Map<number, Rating>();
      
      ratings.forEach((rating) => {
        if (rating.tmdbId) {
          newMap.set(rating.tmdbId, rating);
        }
      });

      ratingsMap.value = newMap;
      loaded.value = true;
    } catch (error) {
      console.warn("No se pudieron cargar los ratings:", error);
    } finally {
      loading.value = false;
    }
  };

  const getRating = (tmdbId?: number): Rating | null => {
    if (!tmdbId) return null;
    return ratingsMap.value.get(tmdbId) || null;
  };

  const hasRating = (tmdbId?: number): boolean => {
    if (!tmdbId) return false;
    return ratingsMap.value.has(tmdbId);
  };

  const addRating = (rating: Rating) => {
    if (rating.tmdbId) {
      const newMap = new Map(ratingsMap.value);
      newMap.set(rating.tmdbId, rating);
      ratingsMap.value = newMap;
    }
  };

  const clearRatings = () => {
    ratingsMap.value = new Map();
    loaded.value = false;
  };

  return {
    ratingsMap,
    loaded,
    loading,
    fetchRatings,
    getRating,
    hasRating,
    addRating,
    clearRatings,
  };
};
