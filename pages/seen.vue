<template>
  <div class="bg-surface-950 text-white min-h-screen pb-20">
    <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 space-y-10">
      <header class="space-y-2">
        <h1 class="text-3xl sm:text-4xl font-semibold">Vistos recientemente</h1>
        <p class="text-sm text-white/60 max-w-2xl">
          Lleva registro de todo lo que terminaste para que la IA entienda mejor tus gustos. Busca,
          filtra y elimina títulos en cualquier momento.
        </p>
      </header>

      <div class="card space-y-6">
        <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div class="w-full md:w-2/3 space-y-2">
            <label class="text-xs uppercase tracking-[0.3em] text-white/40" for="search">
              Buscar vistos
            </label>
            <div class="stack-mobile sm:flex-row sm:items-center">
              <input
                id="search"
                v-model="filters.search"
                type="text"
                placeholder="Ej. ciencia ficción, familia, thriller…"
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
              ➕ Agregar a vistos
            </button>
          </div>
        </div>

        <div v-if="errorMessage" class="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {{ errorMessage }}
        </div>

        <div v-if="seenItems.length" class="space-y-4">
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <SeenCard
              v-for="item in seenItems"
              :key="item.id"
              :item="item"
              :deleting="deletingId === String(item.recordId ?? item.tmdbId)"
              @remove="handleRemove(item)"
              @share="handleShare(item)"
            />
          </div>
        </div>
        <div v-else-if="!isLoading" class="rounded-3xl border border-white/10 bg-white/5 px-6 py-8 text-center text-sm text-white/60">
          No registramos contenido visto con estos filtros. Intenta una búsqueda diferente.
        </div>

      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-white/10">
        <p class="text-xs text-white/50">
          Mostrando {{ seenItems.length ? startIndex + 1 : 0 }}-{{ endIndex }} de
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

    <transition name="fade">
      <div
        v-if="addModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
        @click.self="closeAddModal"
      >
        <div class="w-full max-w-3xl rounded-3xl border border-white/10 bg-surface-900 p-6 shadow-strong sm:p-8 max-h-[90vh] overflow-y-auto">
          <div class="stack-mobile sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 class="text-2xl font-semibold">Agregar nuevo visto</h2>
              <p class="text-sm text-white/60">
                Busca una película o serie y regístrela como vista. Esto ayudará a mejorar tus recomendaciones.
              </p>
            </div>
            <button
              class="rounded-full bg-white/10 px-3 py-1 text-xs text-white/60 transition hover:bg-white/20"
              @click="closeAddModal"
            >
              Cerrar
            </button>
          </div>

          <div class="mt-6 space-y-4">
            <div class="flex flex-col gap-2">
              <label class="text-xs uppercase tracking-[0.3em] text-white/40" for="search-add">
                Buscar en el catálogo
              </label>
              <div class="stack-mobile sm:flex-row">
                <input
                  id="search-add"
                  v-model="addSearchQuery"
                  type="text"
                  placeholder="Ej. Inception, Mr. Robot…"
                  class="flex-1 rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-white/40 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                  @keyup.enter="performAddSearch"
                />
                <button
                  class="btn-primary inline-flex items-center justify-center"
                  :disabled="addSearchLoading"
                  @click="performAddSearch"
                >
                  {{ addSearchLoading ? 'Buscando…' : 'Buscar' }}
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
                      {{ result.mediaType === 'tv' ? 'Serie' : 'Película' }}
                    </span>
                    <span v-if="result.releaseDate" class="text-xs text-white/50">
                      {{ formatYear(result.releaseDate) }}
                    </span>
                  </div>
                  <h3 class="text-lg font-semibold">{{ result.title }}</h3>
                  <p class="text-sm text-white/60 line-clamp-3">
                    {{ result.overview || 'Sin descripción disponible.' }}
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
                  :disabled="addInProgress === result.id"
                  @click="addResultToSeen(result)"
                >
                  {{ addInProgress === result.id ? 'Agregando…' : 'Marcar como visto' }}
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
  </div>
</template>

<script setup lang="ts">
import { useAuthToken, syncAuthState } from "~/composables/useAuthState";
import { useCollections } from "~/composables/useCollections";
import SeenCard from "~/components/SeenCard.vue";
import ShareDialog from "~/components/ShareDialog.vue";

interface SeenItem {
  id: string;
  tmdbId: number;
  mediaType: string;
  title: string;
  posterUrl?: string;
  seenAt?: string;
  reason?: string;
  platforms?: string[];
  recordId?: string | number;
}

const authToken = useAuthToken();
const config = useRuntimeConfig();
const collections = useCollections();

const isLoading = ref(false);
const errorMessage = ref("");
const seenItems = ref<SeenItem[]>([]);
const deletingId = ref<string | undefined>();
const addModalOpen = ref(false);
const addSearchQuery = ref("");
const addSearchResults = ref<any[]>([]);
const addSearchLoading = ref(false);
const addSearchError = ref("");
const addInProgress = ref<number | null>(null);
const shareTarget = ref<SeenItem | null>(null);

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

const fetchSeen = async () => {
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

    const response = await $fetch<any>("/seen", {
      baseURL: config.public.apiBase,
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken.value}`,
      },
      query,
    });

    const rawItems = Array.isArray(response)
      ? response
      : response?.items ?? [];

    seenItems.value = rawItems.map((entry: any) => {
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
        seenAt: entry.watchedAt ?? entry.createdAt,
        reason: tmdb.overview ?? entry.reason,
        platforms: tmdb.platforms ?? [],
      } as SeenItem;
    });

    if (!Array.isArray(response)) {
      pagination.total = response?.total ?? seenItems.value.length;
      pagination.page = response?.page ?? pagination.page;
      pagination.take = response?.pageSize ?? pagination.take;
    } else {
      pagination.total = seenItems.value.length;
    }
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
      return;
    }
    const message =
      error?.data?.message ||
      error?.statusMessage ||
      "No pudimos obtener tus contenidos vistos.";
    errorMessage.value = Array.isArray(message) ? message.join(" ") : message;
  } finally {
    isLoading.value = false;
  }
};

const changePage = (page: number) => {
  pagination.page = Math.max(1, Math.min(totalPages.value, page));
  fetchSeen();
};

const handleOrder = () => {
  pagination.page = 1;
  fetchSeen();
};

let searchDebounce: ReturnType<typeof setTimeout> | undefined;
const triggerSearch = () => {
  pagination.page = 1;
  fetchSeen();
};

const handleSearchChange = () => {
  if (searchDebounce) clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    triggerSearch();
  }, 400);
};

const handleRemove = async (item: SeenItem) => {
  if (!authToken.value) return;

  const targetId = item.recordId ?? item.tmdbId;
  if (targetId === undefined) return;

  deletingId.value = String(targetId);
  try {
    await $fetch(`/seen/${targetId}`, {
      baseURL: config.public.apiBase,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken.value}`,
      },
    });
    await fetchSeen();
    syncCollections();
  } catch (error: any) {
    const message =
      error?.data?.message ||
      error?.statusMessage ||
      "No se pudo eliminar este registro.";
    errorMessage.value = Array.isArray(message) ? message.join(" ") : message;
  } finally {
    deletingId.value = undefined;
  }
};

const syncCollections = async () => {
  await collections.ensureLoaded();
};

const handleShare = (item: SeenItem) => {
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

const addResultToSeen = async (result: any) => {
  if (!authToken.value) {
    await navigateTo("/login");
    return;
  }

  if (!result?.tmdbId) return;

  addInProgress.value = result.tmdbId;
  addSearchError.value = "";

  try {
    await $fetch("/seen", {
      baseURL: config.public.apiBase,
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken.value}`,
      },
      body: {
        tmdbId: result.tmdbId,
        mediaType: result.mediaType || "movie",
      },
    });
    await fetchSeen();
    await syncCollections();
    addModalOpen.value = false;
  } catch (error: any) {
    const message =
      error?.data?.message ||
      error?.statusMessage ||
      "No pudimos marcar este contenido como visto.";
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

onMounted(() => {
  if (process.client) {
    syncAuthState();
    syncCollections();
    fetchSeen();
  }
});

useHead({
  title: "Vistos | Recomiéndame",
});
</script>
