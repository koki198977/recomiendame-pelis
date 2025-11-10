<template>
  <div class="bg-surface-950 min-h-screen text-white pb-20">
    <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 space-y-10">
      <header class="space-y-3">
        <span class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
          Historial de recomendaciones
        </span>
        <div class="space-y-2">
          <h1 class="text-3xl sm:text-4xl font-semibold">Tu archivo de sugerencias</h1>
          <p class="text-sm text-white/60 max-w-3xl">
            Explora las recomendaciones anteriores y vuelve a descubrir títulos que la IA seleccionó para ti.
          </p>
        </div>
      </header>

      <div class="card space-y-4">
        <div class="grid gap-4 md:grid-cols-4">
          <div class="md:col-span-2 space-y-2">
            <label class="text-xs uppercase tracking-[0.3em] text-white/40">
              Buscar en el historial
            </label>
            <div class="stack-mobile sm:flex-row sm:items-center">
              <input
                v-model="searchDraft"
                type="text"
                placeholder="Ej. misterios, drama, cyberpunk…"
                class="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-white/40 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                @keyup.enter="applySearch"
              />
              <button
                type="button"
                class="btn-primary inline-flex items-center justify-center gap-2 sm:w-auto"
                :disabled="isLoading || searchDraft.trim() === filters.search"
                @click="applySearch"
              >
                Buscar
              </button>
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-xs uppercase tracking-[0.3em] text-white/40">Tipo de contenido</label>
            <select
              v-model="filters.mediaType"
              class="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
            >
              <option value="all">Películas y series</option>
              <option value="movie">Sólo películas</option>
              <option value="tv">Sólo series</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-xs uppercase tracking-[0.3em] text-white/40">Ordenar por</label>
            <select
              v-model="filters.orderBy"
              class="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
            >
              <option value="createdAt">Fecha generada</option>
              <option value="title">Título</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-xs uppercase tracking-[0.3em] text-white/40">Orden</label>
            <select
              v-model="filters.order"
              class="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
            >
              <option value="desc">Descendente</option>
              <option value="asc">Ascendente</option>
            </select>
          </div>
        </div>

        <div v-if="errorMessage" class="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {{ errorMessage }}
        </div>

        <div v-if="history.length" class="space-y-6">
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <article
              v-for="item in history"
              :key="item.id || `${item.tmdbId}-${item.createdAt}`"
              class="card-hover flex h-full cursor-pointer flex-col overflow-hidden p-0 transition hover:-translate-y-1 hover:shadow-medium focus:outline-none focus-visible:-translate-y-1 focus-visible:ring-2 focus-visible:ring-primary-400"
              role="button"
              tabindex="0"
              @click="openDetails(item)"
              @keydown.enter.prevent="openDetails(item)"
              @keydown.space.prevent="openDetails(item)"
            >
              <div class="px-5 pt-5 text-xs uppercase tracking-[0.3em] text-white/40">
                {{ formatRunDate(item.createdAt) }}
              </div>
              <RecommendationCard
                :item="item"
                :states="itemStates(item)"
                :show-actions="true"
                :show-overview="false"
                show-details-hint
                @mark-favorite="(entry) => markFavorite(entry)"
                @mark-seen="(entry) => markSeen(entry)"
                @mark-wishlist="(entry) => markWishlist(entry)"
                @share="openShare"
              />
            </article>
          </div>

          <div class="flex flex-col gap-4 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p class="text-xs text-white/50">Mostrando {{ rangeDescription }}</p>
            <div class="flex items-center gap-2">
              <button
                class="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/10 disabled:opacity-40"
                :disabled="page === 1 || isLoading"
                @click="changePage(page - 1)"
              >
                ← Anterior
              </button>
              <span class="text-xs text-white/60">Página {{ page }} de {{ totalPages }}</span>
              <button
                class="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/10 disabled:opacity-40"
                :disabled="page === totalPages || isLoading"
                @click="changePage(page + 1)"
              >
                Siguiente →
              </button>
            </div>
          </div>
        </div>

        <div v-else-if="!isLoading" class="rounded-3xl border border-white/10 bg-white/5 px-6 py-8 text-center text-sm text-white/60">
          Aún no registramos historial. Genera algunas recomendaciones para comenzar a ver tus resultados guardados.
        </div>

        <div v-if="isLoading" class="flex items-center justify-center py-12 text-white/60">
          <svg class="h-6 w-6 animate-spin text-primary-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    </section>

    <Teleport to="body">
      <transition name="fade">
        <div
          v-if="activeRecommendation"
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
              class="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
              @click="closeDetails"
              aria-label="Cerrar detalles"
            >
              ✕
            </button>
            <div class="grid flex-1 gap-6 overflow-y-auto p-6 sm:p-8 md:grid-cols-[220px_1fr] md:overflow-visible">
              <div class="overflow-hidden rounded-3xl border border-white/10">
                <img
                  :src="activeRecommendation?.posterUrl || placeholderImage"
                  :alt="activeRecommendation?.title"
                  class="h-full w-full object-cover"
                />
              </div>
              <div class="space-y-4">
                <div>
                  <p class="text-xs uppercase tracking-[0.3em] text-white/40">
                    {{ activeRecommendation?.mediaType === "tv" ? "Serie" : "Película" }}
                  </p>
                  <h3 class="mt-2 text-2xl font-semibold">
                    {{ activeRecommendation?.title }}
                  </h3>
                </div>
                <div class="flex flex-wrap items-center gap-4 text-sm text-white/70">
                  <span class="inline-flex items-center gap-2 text-primary-100">
                    ⭐
                    <span class="text-lg font-semibold text-white">
                      {{ formatVoteAverage(activeRecommendation?.voteAverage) }}
                    </span>
                  </span>
                  <span>{{ formatReleaseLabel(activeRecommendation?.releaseDate) }}</span>
                  <span v-if="activeRecommendation?.reason" class="text-xs uppercase tracking-[0.3em] text-white/40">
                    {{ activeRecommendation.reason }}
                  </span>
                </div>
                <p v-if="activeRecommendation?.overview" class="text-sm leading-relaxed text-white/80">
                  {{ activeRecommendation.overview }}
                </p>
                <div v-if="activeRecommendation?.platforms?.length" class="flex flex-wrap gap-2">
                  <span
                    v-for="platform in activeRecommendation.platforms"
                    :key="platform"
                    class="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70"
                  >
                    {{ platform }}
                  </span>
                </div>
                <div class="flex flex-wrap gap-2">
                  <button
                    type="button"
                    :class="actionButtonClass(activeStates.seen)"
                    :disabled="activeStates.seen"
                    @click="markSeen(activeRecommendation)"
                  >
                    {{ activeStates.seen ? "👀 Ya visto" : "👀 Marcar visto" }}
                  </button>
                  <button
                    type="button"
                    :class="actionButtonClass(activeStates.favorite)"
                    :disabled="activeStates.favorite"
                    @click="markFavorite(activeRecommendation)"
                  >
                    {{ activeStates.favorite ? "❤️ En favoritos" : "❤️ Favorito" }}
                  </button>
                  <button
                    type="button"
                    :class="actionButtonClass(activeStates.wishlist)"
                    :disabled="activeStates.wishlist"
                    @click="markWishlist(activeRecommendation)"
                  >
                    {{ activeStates.wishlist ? "⭐ En wishlist" : "⭐ Añadir a wishlist" }}
                  </button>
                  <a
                    v-if="activeRecommendation?.trailerUrl"
                    :href="activeRecommendation.trailerUrl"
                    target="_blank"
                    rel="noopener"
                    class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                  >
                    ▶️ Ver trailer
                  </a>
                  <button
                    type="button"
                    class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                    @click="activeRecommendation ? openShare(activeRecommendation) : null"
                  >
                    🔗 Compartir
                  </button>
                  <button
                    type="button"
                    class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                    @click="activeRecommendation ? openRating(activeRecommendation) : null"
                  >
                    ⭐ Calificar
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
    <ShareDialog
      :item="shareTarget"
      :show="Boolean(shareTarget)"
      @close="closeShare"
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
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import RecommendationCard from "~/components/RecommendationCard.vue";
import ShareDialog from "~/components/ShareDialog.vue";
import RatingDialog from "~/components/RatingDialog.vue";
import { useAuthToken, syncAuthState } from "~/composables/useAuthState";
import { useCollections } from "~/composables/useCollections";
import { useRatings } from "~/composables/useRatings";

interface HistoryItem {
  id?: string;
  tmdbId?: number;
  title: string;
  mediaType?: string;
  overview?: string;
  posterUrl?: string;
  voteAverage?: number;
  releaseDate?: string;
  reason?: string;
  platforms?: string[];
  trailerUrl?: string;
  createdAt: string;
}

const authToken = useAuthToken();
const config = useRuntimeConfig();
const collections = useCollections();
const ratings = useRatings();

const history = ref<HistoryItem[]>([]);
const isLoading = ref(false);
const errorMessage = ref("");
const totalCount = ref(0);
const page = ref(1);
const pageSize = ref(12);

const filters = reactive({
  search: "",
  mediaType: "all",
  orderBy: "createdAt",
  order: "desc",
});

const searchDraft = ref("");
const searchDebounce = ref<ReturnType<typeof setTimeout> | null>(null);
const activeRecommendation = ref<HistoryItem | null>(null);
const modalContainer = ref<HTMLDivElement | null>(null);
const shareTarget = ref<HistoryItem | null>(null);
const ratingTarget = ref<HistoryItem | null>(null);

const placeholderImage = "https://placehold.co/200x300/1A0F59/FFFFFF?text=Recomiendame";

const skip = computed(() => (page.value - 1) * pageSize.value);
const totalPages = computed(() =>
  totalCount.value ? Math.max(1, Math.ceil(totalCount.value / pageSize.value)) : 1
);

const rangeDescription = computed(() => {
  if (!history.value.length) return "0";
  const start = skip.value + 1;
  const end = Math.min(skip.value + history.value.length, totalCount.value || skip.value + history.value.length);
  return totalCount.value ? `${start}-${end} de ${totalCount.value}` : `${start}-${end}`;
});

const formatRunDate = (value?: string) => {
  if (!value) return "Fecha desconocida";
  try {
    return new Intl.DateTimeFormat("es-CL", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
};

const actionButtonClass = (active: boolean) =>
  [
    "inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition",
    active
      ? "border-primary-400 bg-primary-500/20 text-primary-100"
      : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10",
  ].join(" ");

const formatVoteAverage = (vote?: number | null) => {
  if (vote === undefined || vote === null || Number.isNaN(Number(vote))) return "—";
  return Number(vote).toFixed(1);
};

const formatReleaseLabel = (date?: string) => {
  if (!date) return "Estreno pendiente";
  const dt = new Date(date);
  if (Number.isNaN(dt.getTime())) return "Estreno pendiente";
  const formatted = new Intl.DateTimeFormat("es-ES", {
    month: "short",
    year: "numeric",
  }).format(dt);
  return `Estreno ${formatted.replace(".", "").toLowerCase()}`;
};

const fetchHistory = async () => {
  if (!authToken.value) return;

  isLoading.value = true;
  errorMessage.value = "";

  try {
    const response = await $fetch<any>("/recommendations/history", {
      baseURL: config.public.apiBase,
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken.value}`,
      },
      query: {
        skip: skip.value,
        take: pageSize.value,
        search: filters.search || undefined,
        mediaType: filters.mediaType !== "all" ? filters.mediaType : undefined,
        orderBy: filters.orderBy,
        order: filters.order,
      },
    });

    const container = response?.history ?? response ?? {};
    const items = Array.isArray(container)
      ? container
      : container.items ?? container.data ?? [];

    history.value = items.map((entry: any, index: number) => ({
      id: entry?.id ?? `${entry?.createdAt ?? entry?.tmdbId ?? index}`,
      tmdbId: entry?.tmdbId,
      title: entry?.title ?? "Sin título",
      mediaType: entry?.mediaType,
      overview: entry?.overview,
      posterUrl: entry?.posterUrl,
      voteAverage: entry?.voteAverage,
      releaseDate: entry?.releaseDate,
      reason: entry?.reason,
      platforms: entry?.platforms ?? [],
      trailerUrl: entry?.trailerUrl,
      createdAt: entry?.createdAt ?? new Date().toISOString(),
    }));

    const rawTotal = Number(container.total ?? container.count);
    totalCount.value = Number.isFinite(rawTotal) && rawTotal >= 0
      ? rawTotal
      : skip.value + history.value.length;
    searchDraft.value = filters.search;
  } catch (error: any) {
    const message =
      error?.data?.message ||
      error?.statusMessage ||
      "No pudimos cargar tu historial. Intenta más tarde.";
    errorMessage.value = Array.isArray(message) ? message.join(" ") : message;
  } finally {
    isLoading.value = false;
  }
};

const changePage = (nextPage: number) => {
  if (nextPage < 1 || nextPage > totalPages.value || nextPage === page.value) return;
  page.value = nextPage;
  fetchHistory();
};

const applySearch = () => {
  const value = searchDraft.value.trim();
  if (value === filters.search) return;
  filters.search = value;
  page.value = 1;
  fetchHistory();
};

const openDetails = (item: HistoryItem) => {
  activeRecommendation.value = item;
};

const closeDetails = () => {
  activeRecommendation.value = null;
};

const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    closeDetails();
  }
};

const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && activeRecommendation.value) {
    closeDetails();
  }
};

const openShare = (item: HistoryItem) => {
  shareTarget.value = item;
};

const closeShare = () => {
  shareTarget.value = null;
};

const openRating = (item: HistoryItem | null) => {
  if (!item) return;
  ratingTarget.value = item;
};

const closeRating = () => {
  ratingTarget.value = null;
};

const handleRated = () => {
  // Opcional: refrescar historial o mostrar feedback
  console.log('Rating submitted successfully');
};

const getStates = (item?: HistoryItem | null) => ({
  favorite: item ? collections.isFavorite(item.tmdbId, item.mediaType) : false,
  seen: item ? collections.isSeen(item.tmdbId, item.mediaType) : false,
  wishlist: item ? collections.isInWishlist(item.tmdbId, item.mediaType) : false,
});

const activeStates = computed(() => getStates(activeRecommendation.value));
const itemStates = (item: HistoryItem) => getStates(item);

const buildPayload = (item?: HistoryItem | null) => ({
  tmdbId: Number(item?.tmdbId),
  mediaType: item?.mediaType || "movie",
  title: item?.title || "",
});

const markFavorite = async (item?: HistoryItem | null) => {
  if (!item || !item.tmdbId) return;
  try {
    await collections.addFavorite(buildPayload(item));
  } catch (error: any) {
    if (error?.status === 401) await navigateTo("/login");
  }
};

const markSeen = async (item?: HistoryItem | null) => {
  if (!item || !item.tmdbId) return;
  try {
    await collections.addSeen(buildPayload(item));
  } catch (error: any) {
    if (error?.status === 401) await navigateTo("/login");
  }
};

const markWishlist = async (item?: HistoryItem | null) => {
  if (!item || !item.tmdbId) return;
  try {
    await collections.addWishlist(buildPayload(item));
  } catch (error: any) {
    if (error?.status === 401) await navigateTo("/login");
  }
};

onMounted(() => {
  if (process.client) {
    syncAuthState();
    collections.ensureLoaded();
    ratings.fetchRatings();
    fetchHistory();
    
    // Agregar listener global para escape
    document.addEventListener('keydown', handleEscapeKey);
  }
});

watch(authToken, (token) => {
  if (token) {
    page.value = 1;
    fetchHistory();
  } else {
    history.value = [];
    totalCount.value = 0;
    filters.search = "";
    filters.mediaType = "all";
    filters.orderBy = "createdAt";
    filters.order = "desc";
    searchDraft.value = "";
  }
});

watch(activeRecommendation, (value) => {
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

watch(
  () => [filters.mediaType, filters.orderBy, filters.order],
  () => {
    if (!authToken.value) return;
    page.value = 1;
    fetchHistory();
  }
);

watch(searchDraft, (value) => {
  if (searchDebounce.value) {
    clearTimeout(searchDebounce.value);
  }
  searchDebounce.value = setTimeout(() => {
    if (!authToken.value) return;
    const trimmed = value.trim();
    if (trimmed === filters.search) return;
    filters.search = trimmed;
    page.value = 1;
    fetchHistory();
  }, 400);
});

onBeforeUnmount(() => {
  if (searchDebounce.value) {
    clearTimeout(searchDebounce.value);
  }
  
  // Remover listener global
  if (process.client) {
    document.removeEventListener('keydown', handleEscapeKey);
  }
});

useHead({
  title: "Historial de recomendaciones | Recomiéndame",
  meta: [
    {
      name: "description",
      content:
        "Consulta todas las recomendaciones generadas por la IA de Recomiéndame y revisa cómo evolucionaron tus sugerencias a lo largo del tiempo.",
    },
  ],
});
</script>
