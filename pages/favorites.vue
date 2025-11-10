<template>
  <div class="bg-surface-950 text-white min-h-screen pb-20">
    <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 space-y-10">
      <header class="space-y-2">
        <h1 class="text-3xl sm:text-4xl font-semibold">Favoritos</h1>
        <p class="text-sm text-white/60 max-w-2xl">
          Tus historias imprescindibles en un solo lugar. Guarda títulos, búscalos y agrega nuevos
          favoritos rápidamente.
        </p>
      </header>

      <div class="card space-y-6">
        <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div class="w-full md:w-2/3 space-y-2">
            <label class="text-xs uppercase tracking-[0.3em] text-white/40" for="favorites-search">
              Buscar favoritos
            </label>
            <div class="stack-mobile sm:flex-row sm:items-center">
              <input
                id="favorites-search"
                v-model="filters.search"
                type="text"
                placeholder="Ej. drama, comedia, ciencia ficción…"
                class="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-white/40 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                @input="handleSearchChange"
              />
              <button
                class="btn-primary inline-flex items-center justify-center gap-2 sm:w-auto"
                @click="triggerSearch"
                :disabled="isLoading"
              >
                Buscar
              </button>
            </div>
          </div>
          <div class="flex w-full md:w-1/4 flex-col gap-3">
            <label class="text-xs uppercase tracking-[0.3em] text-white/40">
              Ordenar por
            </label>
            <select
              v-model="filters.orderBy"
              class="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
              @change="handleOrder"
            >
              <option value="latest">Más recientes</option>
              <option value="oldest">Más antiguos</option>
            </select>
            <button
              class="btn-secondary inline-flex items-center justify-center gap-2"
              type="button"
              @click="openAddModal"
            >
              ➕ Agregar favorito
            </button>
          </div>
        </div>

        <div v-if="errorMessage" class="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {{ errorMessage }}
        </div>

        <div v-if="favorites.length" class="space-y-4">
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FavoriteCard
              v-for="item in favorites"
              :key="item.id"
              :item="item"
              :deleting="deletingId === String(item.recordId ?? item.tmdbId)"
              @view-details="openDetails"
              @remove="handleRemove(item)"
              @share="handleShare(item)"
            />
          </div>
        </div>
        <div v-else-if="!isLoading" class="rounded-3xl border border-white/10 bg-white/5 px-6 py-8 text-center text-sm text-white/60">
          No encontramos favoritos para estos filtros. Intenta con otra búsqueda.
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-white/10">
          <p class="text-xs text-white/50">
            Mostrando {{ favorites.length ? startIndex + 1 : 0 }}-{{ endIndex }} de
            {{ pagination.total }}
          </p>
          <div class="flex items-center gap-2">
            <button
              class="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70 hover:bg-white/10 transition disabled:opacity-40"
              :disabled="pagination.page === 1 || isLoading"
              @click="changePage(pagination.page - 1)"
            >
              ← Anterior
            </button>
            <span class="text-xs text-white/60">
              Página {{ pagination.page }} de {{ totalPages }}
            </span>
            <button
              class="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70 hover:bg-white/10 transition disabled:opacity-40"
              :disabled="pagination.page === totalPages || isLoading"
              @click="changePage(pagination.page + 1)"
            >
              Siguiente →
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal de detalles -->
    <Teleport to="body">
      <transition name="fade">
        <div
          v-if="selectedItem"
          ref="modalContainer"
          class="fixed inset-0 z-[998] flex items-center justify-center bg-surface-950/90 px-4 py-6 sm:px-6 sm:py-10 backdrop-blur-md"
          tabindex="-1"
          @click="handleBackdropClick"
        >
          <div 
            class="relative flex w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-surface-900 shadow-strong max-h-[92vh]"
            @click.stop
          >
            <button
              type="button"
              class="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
              @click="closeDetails"
              aria-label="Cerrar detalles"
            >
              ✕
            </button>
            <div class="grid flex-1 gap-6 overflow-y-auto p-6 sm:p-8 md:grid-cols-[220px_1fr] md:overflow-visible">
              <div class="overflow-hidden rounded-3xl border border-white/10">
                <img
                  :src="selectedItem?.posterUrl || placeholderImage"
                  :alt="selectedItem?.title"
                  class="h-full w-full object-cover"
                />
              </div>
              <div class="space-y-4">
                <div>
                  <p class="text-xs uppercase tracking-[0.3em] text-white/40">
                    {{ selectedItem?.mediaType === "tv" ? "Serie" : "Película" }}
                  </p>
                  <h3 class="mt-2 text-2xl font-semibold">
                    {{ selectedItem?.title }}
                  </h3>
                </div>
                <div class="flex flex-wrap items-center gap-4 text-sm text-white/70">
                  <span
                    v-if="userRating"
                    class="inline-flex items-center gap-1 rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-semibold text-yellow-100"
                    title="Tu calificación"
                  >
                    ⭐ {{ userRating.rating }}/5
                  </span>
                  <span v-if="selectedItem?.addedAt" class="text-xs text-white/50">
                    Agregado: {{ formatDetailDate(selectedItem.addedAt) }}
                  </span>
                </div>
                <p v-if="selectedItem?.overview" class="text-sm leading-relaxed text-white/80">
                  {{ selectedItem.overview }}
                </p>
                <p v-else class="text-sm leading-relaxed text-white/60 italic">
                  Sin descripción disponible.
                </p>
                <div v-if="selectedItem?.platforms?.length" class="flex flex-wrap gap-2">
                  <span
                    v-for="platform in selectedItem.platforms"
                    :key="platform"
                    class="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70"
                  >
                    {{ platform }}
                  </span>
                </div>
                <div class="flex flex-wrap gap-2">
                  <a
                    v-if="selectedItem?.trailerUrl"
                    :href="selectedItem.trailerUrl"
                    target="_blank"
                    rel="noopener"
                    class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                  >
                    ▶️ Ver trailer
                  </a>
                  <button
                    type="button"
                    class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                    @click="selectedItem ? openRating(selectedItem) : null"
                  >
                    ⭐ Calificar
                  </button>
                  <button
                    type="button"
                    class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                    @click="selectedItem ? handleShare(selectedItem) : null"
                  >
                    🔗 Compartir
                  </button>
                  <button
                    type="button"
                    class="inline-flex items-center gap-2 rounded-full bg-red-500/20 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/30 disabled:opacity-40"
                    :disabled="deletingId === String(selectedItem?.recordId ?? selectedItem?.tmdbId)"
                    @click="selectedItem ? handleRemoveFromDetails(selectedItem) : null"
                  >
                    <span v-if="deletingId !== String(selectedItem?.recordId ?? selectedItem?.tmdbId)">🗑️ Eliminar de favoritos</span>
                    <span v-else class="flex items-center gap-1">
                      <svg
                        class="h-3 w-3 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          class="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          stroke-width="4"
                        ></circle>
                        <path
                          class="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Eliminando…
                    </span>
                  </button>
                </div>
              </div>
            </div>
            <div class="border-t border-white/10 bg-surface-900/80 px-6 pb-6 pt-4 sm:px-8">
              <button
                type="button"
                class="w-full rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                @click="closeDetails"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <transition name="fade">
      <div
        v-if="addModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
        @click.self="closeAddModal"
      >
        <div class="w-full max-w-3xl rounded-3xl border border-white/10 bg-surface-900 p-6 shadow-strong sm:p-8 max-h-[90vh] overflow-y-auto">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="text-2xl font-semibold">Agregar a favoritos</h2>
              <p class="text-sm text-white/60">
                Encuentra películas o series y añádelas a tu colección de favoritos.
              </p>
            </div>
            <button
              class="rounded-full bg-white/10 px-3 py-1 text-xs text-white/60 hover:bg-white/20"
              @click="closeAddModal"
            >
              Cerrar
            </button>
          </div>

          <div class="mt-6 space-y-4">
            <div class="flex flex-col gap-2">
              <label class="text-xs uppercase tracking-[0.3em] text-white/40" for="favorites-add-input">
                Buscar en el catálogo
              </label>
              <div class="stack-mobile sm:flex-row">
                <input
                  id="favorites-add-input"
                  v-model="addSearchQuery"
                  type="text"
                  placeholder="Ej. Black Mirror, Dune…"
                  class="flex-1 rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-white/40 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                  @keyup.enter="performAddSearch"
                />
                <button
                  class="btn-primary inline-flex items-center justify-center"
                  :disabled="addSearchLoading"
                  @click="performAddSearch"
                >
                  {{ addSearchLoading ? "Buscando…" : "Buscar" }}
                </button>
              </div>
            </div>

            <p v-if="addSearchError" class="text-sm text-red-300">
              {{ addSearchError }}
            </p>

            <div
              v-if="addSearchLoading"
              class="flex items-center justify-center rounded-3xl border border-white/10 bg-white/5 py-12"
            >
              <svg
                class="h-6 w-6 animate-spin text-primary-200"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>

            <div v-else class="space-y-4 max-h-96 overflow-y-auto pr-2">
              <div
                v-if="addSearchResults.length === 0"
                class="rounded-3xl border border-white/10 bg-white/5 px-6 py-8 text-center text-sm text-white/60"
              >
                Ingresa un término de búsqueda para ver resultados.
              </div>
              <div
                v-for="result in addSearchResults"
                :key="result.id"
                class="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 md:flex-row md:items-center"
              >
                <img
                  :src="result.posterUrl"
                  :alt="result.title"
                  class="h-32 w-24 rounded-2xl object-cover"
                />
                <div class="flex-1 space-y-2">
                  <div class="flex items-center gap-3">
                    <span class="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-wide text-white/70">
                      {{ result.mediaType === "tv" ? "Serie" : "Película" }}
                    </span>
                    <span v-if="result.releaseDate" class="text-xs text-white/50">
                      {{ formatYear(result.releaseDate) }}
                    </span>
                  </div>
                  <h3 class="text-lg font-semibold">{{ result.title }}</h3>
                  <p class="text-sm text-white/60 line-clamp-3">
                    {{ result.overview || "Sin descripción disponible." }}
                  </p>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="platform in result.platforms"
                      :key="platform"
                      class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                    >
                      {{ platform }}
                    </span>
                  </div>
                </div>
                <button
                  class="btn-primary whitespace-nowrap"
                  :disabled="addInProgress === result.tmdbId"
                  @click="addResultToFavorites(result)"
                >
                  {{ addInProgress === result.tmdbId ? "Agregando…" : "Añadir a favoritos" }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <ShareDialog
      :item="shareTarget"
      :show="Boolean(shareTarget)"
      @close="shareTarget = null"
    />
    <RatingDialog
      :item="ratingTarget"
      :show="Boolean(ratingTarget)"
      @close="closeRating"
      @rated="handleRated"
    />
  </div>
</template>

<script setup lang="ts">
import { useAuthToken, syncAuthState } from "~/composables/useAuthState";
import { useCollections } from "~/composables/useCollections";
import { useRatings } from "~/composables/useRatings";
import FavoriteCard from "~/components/FavoriteCard.vue";
import ShareDialog from "~/components/ShareDialog.vue";
import RatingDialog from "~/components/RatingDialog.vue";
import { nextTick, onBeforeUnmount } from "vue";

interface FavoriteItem {
  id: string;
  tmdbId: number;
  mediaType: string;
  title: string;
  posterUrl?: string;
  addedAt?: string;
  overview?: string;
  platforms?: string[];
  recordId?: string | number;
}

const authToken = useAuthToken();
const config = useRuntimeConfig();
const collections = useCollections();
const ratings = useRatings();

const isLoading = ref(false);
const errorMessage = ref("");
const favorites = ref<FavoriteItem[]>([]);
const deletingId = ref<string | undefined>();

const addModalOpen = ref(false);
const addSearchQuery = ref("");
const addSearchResults = ref<any[]>([]);
const addSearchLoading = ref(false);
const addSearchError = ref("");
const addInProgress = ref<number | null>(null);
const shareTarget = ref<FavoriteItem | null>(null);

const selectedItem = ref<FavoriteItem | null>(null);
const modalContainer = ref<HTMLDivElement | null>(null);
const ratingTarget = ref<FavoriteItem | null>(null);

const placeholderImage = "https://placehold.co/200x300/1A0F59/FFFFFF?text=Recomiendame";

const userRating = computed(() => {
  if (!selectedItem.value?.tmdbId) return null;
  return ratings.getRating(selectedItem.value.tmdbId);
});

const filters = reactive({
  search: "",
  orderBy: "latest",
});

const pagination = reactive({
  page: 1,
  take: 9,
  total: 0,
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(pagination.total / pagination.take))
);

const startIndex = computed(() => (pagination.page - 1) * pagination.take);
const endIndex = computed(() =>
  Math.min(pagination.page * pagination.take, pagination.total)
);

const orderToQuery = (order: string) => {
  switch (order) {
    case "oldest":
      return { orderBy: "createdAt", order: "asc" };
    case "latest":
    default:
      return { orderBy: "createdAt", order: "desc" };
  }
};

const fetchFavorites = async () => {
  if (!authToken.value) {
    await navigateTo("/login");
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";

  try {
    const query: Record<string, any> = {
      take: pagination.take,
      skip: (pagination.page - 1) * pagination.take,
    };

    if (filters.search) {
      query.search = filters.search;
    }

    const orderQuery = orderToQuery(filters.orderBy);
    Object.assign(query, orderQuery);

    const response = await $fetch<any>("/favorites", {
      baseURL: config.public.apiBase,
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken.value}`,
      },
      query,
    });

    const rawItems = Array.isArray(response)
      ? response
      : response?.favorites?.items ?? response?.items ?? [];

    favorites.value = rawItems.map((entry: any) => {
      const tmdb = entry.tmdb ?? {};
      const recordId = entry.id ?? entry.recordId ?? undefined;
      const fallbackId = `${entry.tmdbId}-${tmdb.mediaType ?? entry.mediaType ?? "unknown"}`;
      return {
        id: String(recordId ?? fallbackId),
        recordId,
        tmdbId: entry.tmdbId,
        mediaType: tmdb.mediaType ?? entry.mediaType ?? "movie",
        title: tmdb.title ?? entry.title ?? "Título desconocido",
        posterUrl: tmdb.posterUrl,
        addedAt: entry.createdAt,
        overview: tmdb.overview ?? entry.overview,
        platforms: tmdb.platforms ?? [],
      } as FavoriteItem;
    });

    if (!Array.isArray(response)) {
      pagination.total = response?.favorites?.total ?? response?.total ?? favorites.value.length;
      pagination.page = response?.favorites?.page ?? response?.page ?? pagination.page;
      pagination.take = response?.favorites?.pageSize ?? response?.pageSize ?? pagination.take;
    } else {
      pagination.total = favorites.value.length;
    }
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    const message =
      error?.data?.message ||
      error?.statusMessage ||
      "No pudimos obtener tus favoritos.";
    errorMessage.value = Array.isArray(message) ? message.join(" ") : message;
  } finally {
    isLoading.value = false;
  }
};

const changePage = (page: number) => {
  pagination.page = Math.max(1, Math.min(totalPages.value, page));
  fetchFavorites();
};

const handleOrder = () => {
  pagination.page = 1;
  fetchFavorites();
};

let searchDebounce: ReturnType<typeof setTimeout> | undefined;
const triggerSearch = () => {
  pagination.page = 1;
  fetchFavorites();
};

const handleSearchChange = () => {
  if (searchDebounce) clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    triggerSearch();
  }, 400);
};

const handleRemove = async (item: FavoriteItem) => {
  if (!authToken.value) return;

  const targetId = item.tmdbId;
  if (targetId === undefined) return;

  deletingId.value = String(targetId);
  try {
    await $fetch(`/favorites/${targetId}`, {
      baseURL: config.public.apiBase,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken.value}`,
      },
    });
    await fetchFavorites();
    await syncCollections();
  } catch (error: any) {
    const message =
      error?.data?.message ||
      error?.statusMessage ||
      "No se pudo eliminar este favorito.";
    errorMessage.value = Array.isArray(message) ? message.join(" ") : message;
  } finally {
    deletingId.value = undefined;
  }
};

const syncCollections = async () => {
  await collections.ensureLoaded();
};

const handleShare = (item: FavoriteItem) => {
  shareTarget.value = item;
};

const openAddModal = () => {
  addModalOpen.value = true;
  addSearchQuery.value = "";
  addSearchResults.value = [];
  addSearchError.value = "";
};

const closeAddModal = () => {
  addModalOpen.value = false;
};

const formatYear = (date?: string) => {
  if (!date) return "";
  return new Date(date).getFullYear();
};

const formatDetailDate = (date?: string) => {
  if (!date) return "Fecha desconocida";
  try {
    return new Intl.DateTimeFormat("es-CL", {
      dateStyle: "medium",
    }).format(new Date(date));
  } catch {
    return date;
  }
};

const openDetails = (item: FavoriteItem) => {
  selectedItem.value = item;
};

const closeDetails = () => {
  selectedItem.value = null;
};

const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    closeDetails();
  }
};

const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && selectedItem.value) {
    closeDetails();
  }
};

const handleRemoveFromDetails = async (item: FavoriteItem) => {
  await handleRemove(item);
  if (!deletingId.value) {
    closeDetails();
  }
};

const openRating = (item: FavoriteItem | null) => {
  if (!item) return;
  ratingTarget.value = item;
};

const closeRating = () => {
  ratingTarget.value = null;
};

const handleRated = () => {
  // Actualizar ratings
  ratings.fetchRatings({ force: true });
};

const performAddSearch = async () => {
  const term = addSearchQuery.value.trim();
  if (!term) {
    addSearchResults.value = [];
    return;
  }

  if (!authToken.value) {
    await navigateTo("/login");
    return;
  }

  addSearchLoading.value = true;
  addSearchError.value = "";

  try {
    const response = await $fetch<{ results?: any[] }>("/search", {
      baseURL: config.public.apiBase,
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken.value}`,
      },
      query: {
        q: term,
        type: "multi",
      },
    });

    addSearchResults.value = (response?.results ?? []).map((item: any) => ({
      id: item.tmdbId ?? item.id,
      tmdbId: item.tmdbId ?? item.id,
      title: item.title,
      posterUrl: item.posterUrl,
      overview: item.overview,
      mediaType: item.mediaType ?? item.type ?? "movie",
      releaseDate: item.releaseDate,
      platforms: item.platforms ?? [],
    }));
  } catch (error: any) {
    const message =
      error?.data?.message ||
      error?.statusMessage ||
      "No pudimos realizar la búsqueda.";
    addSearchError.value = Array.isArray(message) ? message.join(" ") : message;
  } finally {
    addSearchLoading.value = false;
  }
};

const addResultToFavorites = async (result: any) => {
  if (!authToken.value) {
    await navigateTo("/login");
    return;
  }

  if (!result?.tmdbId) return;

  addInProgress.value = result.tmdbId;
  addSearchError.value = "";

  try {
    await $fetch("/favorites", {
      baseURL: config.public.apiBase,
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken.value}`,
      },
      body: {
        tmdbId: result.tmdbId,
        mediaType: result.mediaType || "movie",
        title: result.title,
      },
    });
    await fetchFavorites();
    await syncCollections();
    addModalOpen.value = false;
  } catch (error: any) {
    const message =
      error?.data?.message ||
      error?.statusMessage ||
      "No pudimos añadir este favorito.";
    addSearchError.value = Array.isArray(message) ? message.join(" ") : message;
  } finally {
    addInProgress.value = null;
  }
};

watch(addSearchQuery, (value) => {
  if (!value.trim()) {
    addSearchResults.value = [];
    addSearchError.value = "";
  }
});

watch(selectedItem, (value) => {
  if (process.client) {
    if (value) {
      // Prevenir scroll del body
      document.body.style.overflow = 'hidden';
      nextTick(() => modalContainer.value?.focus());
    } else {
      // Restaurar scroll del body
      document.body.style.overflow = '';
    }
  }
});

onMounted(() => {
  if (process.client) {
    syncAuthState();
    syncCollections();
    ratings.fetchRatings();
    fetchFavorites();
    
    // Agregar listener global para escape
    document.addEventListener('keydown', handleEscapeKey);
  }
});

onBeforeUnmount(() => {
  // Remover listener global
  if (process.client) {
    document.removeEventListener('keydown', handleEscapeKey);
    // Restaurar scroll del body por si acaso
    document.body.style.overflow = '';
  }
});

useHead({
  title: "Favoritos | Recomiéndame",
});
</script>
