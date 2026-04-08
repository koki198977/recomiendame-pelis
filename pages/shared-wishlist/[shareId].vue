<template>
  <div class="min-h-screen bg-gradient-to-b from-surface-950 via-surface-900 to-surface-950 text-white">
    <div class="mx-auto w-full max-w-6xl px-4 sm:px-6 py-16 space-y-10">

      <!-- Header -->
      <header class="space-y-4 text-center">
        <img :src="brandLogo" alt="Recomiéndame" class="mx-auto h-12 w-auto" />
        <div class="space-y-2">
          <p class="text-xs uppercase tracking-[0.3em] text-white/40">Lista de deseos compartida</p>
          <h1 class="text-3xl font-semibold sm:text-4xl">Lista de deseos</h1>
          <p class="text-sm text-white/60">Películas y series en la wishlist de este usuario en Recomiéndame.</p>
        </div>
      </header>

      <!-- Loading -->
      <div v-if="isLoading" class="flex items-center justify-center py-20">
        <svg class="h-8 w-8 animate-spin text-primary-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>

      <!-- Error -->
      <div v-else-if="errorMessage" class="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-6 text-center text-sm text-red-200">
        {{ errorMessage }}
      </div>

      <!-- Grid de wishlist -->
      <div v-if="!isLoading && !errorMessage && items.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <article
          v-for="item in items"
          :key="item.id"
          role="button"
          tabindex="0"
          class="card-hover flex flex-col overflow-hidden p-0 transition hover:-translate-y-1 hover:shadow-medium cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
          @click="selectedItem = item"
          @keydown.enter.prevent="selectedItem = item"
          @keydown.space.prevent="selectedItem = item"
        >
          <div class="relative aspect-[2/3] w-full overflow-hidden">
            <img
              :src="item.posterUrl || placeholder"
              :alt="`Poster de ${item.title}`"
              class="h-full w-full object-cover"
              @error="(e) => ((e.target as HTMLImageElement).src = placeholder)"
            />
            <span class="absolute left-3 top-3 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/70 backdrop-blur">
              {{ item.mediaType === 'tv' ? 'Serie' : 'Película' }}
            </span>
          </div>
          <div class="flex flex-1 flex-col gap-2 p-4">
            <h3 class="text-sm font-semibold text-white line-clamp-2">{{ item.title }}</h3>
            <p v-if="item.overview" class="text-xs text-white/50 line-clamp-3">{{ item.overview }}</p>
            <div v-if="item.platforms?.length" class="mt-auto flex flex-wrap gap-1 pt-2">
              <span
                v-for="platform in item.platforms"
                :key="platform"
                class="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/60"
              >
                {{ platform }}
              </span>
            </div>
          </div>
        </article>
      </div>

      <!-- Mostrar más -->
      <div v-if="hasMore" class="flex justify-center pt-2">
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10 disabled:opacity-50"
          :disabled="isLoadingMore"
          @click="loadMore"
        >
          <svg v-if="isLoadingMore" class="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {{ isLoadingMore ? 'Cargando...' : `Mostrar más (${total - items.length} restantes)` }}
        </button>
      </div>

      <!-- Vacío -->
      <div v-if="!isLoading && !errorMessage && !items.length" class="rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center text-sm text-white/60">
        Este usuario no tiene una lista de deseos pública aún.
      </div>

      <!-- Modal detalle -->
      <Teleport to="body">
        <transition name="fade">
          <div
            v-if="selectedItem"
            class="fixed inset-0 z-[998] flex items-center justify-center bg-surface-950/90 px-4 py-6 backdrop-blur-md"
            @click.self="selectedItem = null"
          >
            <div class="relative flex w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-surface-900 shadow-strong max-h-[92vh]">
              <button
                type="button"
                class="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
                @click="selectedItem = null"
                aria-label="Cerrar"
              >✕</button>

              <div class="grid flex-1 gap-6 overflow-y-auto p-6 sm:p-8 md:grid-cols-[220px_1fr]">
                <div class="overflow-hidden rounded-3xl border border-white/10">
                  <img
                    :src="selectedItem.posterUrl || placeholder"
                    :alt="selectedItem.title"
                    class="h-full w-full object-cover"
                    @error="(e) => ((e.target as HTMLImageElement).src = placeholder)"
                  />
                </div>
                <div class="space-y-4">
                  <div>
                    <p class="text-xs uppercase tracking-[0.3em] text-white/40">
                      {{ selectedItem.mediaType === 'tv' ? 'Serie' : 'Película' }}
                    </p>
                    <h3 class="mt-2 text-2xl font-semibold">{{ selectedItem.title }}</h3>
                  </div>
                  <p v-if="selectedItem.overview" class="text-sm leading-relaxed text-white/80">
                    {{ selectedItem.overview }}
                  </p>
                  <p v-else class="text-sm italic text-white/50">Sin descripción disponible.</p>
                  <div v-if="selectedItem.platforms?.length" class="flex flex-wrap gap-2">
                    <span
                      v-for="platform in selectedItem.platforms"
                      :key="platform"
                      class="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70"
                    >{{ platform }}</span>
                  </div>
                  <div class="flex flex-wrap gap-2 pt-2">
                    <a
                      v-if="selectedItem.trailerUrl"
                      :href="selectedItem.trailerUrl"
                      target="_blank"
                      rel="noopener"
                      class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                    >▶️ Ver trailer</a>
                  </div>
                </div>
              </div>

              <div class="border-t border-white/10 px-6 pb-6 pt-4 sm:px-8">
                <button
                  type="button"
                  class="w-full rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                  @click="selectedItem = null"
                >Cerrar</button>
              </div>
            </div>
          </div>
        </transition>
      </Teleport>

      <!-- CTA -->
      <div class="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 space-y-5 text-center">
        <h2 class="text-xl font-semibold">¿Quieres tu propia lista de deseos?</h2>
        <p class="text-sm text-white/60 max-w-md mx-auto">
          Descarga Recomiéndame, guarda las películas y series que quieres ver y recibe recomendaciones personalizadas con IA.
        </p>

        <button
          class="inline-flex items-center justify-center gap-2 rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-400"
          @click="openApp"
        >
          📱 Abrir en la app
        </button>

        <transition name="fade">
          <div v-if="showStoreLinks" class="space-y-3 pt-2">
            <p class="text-xs text-white/50">Parece que no tienes la app instalada. Descárgala aquí:</p>
            <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="https://apps.apple.com/us/app/recomi%C3%A9ndame/id6760411789"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                App Store
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=cl.recomiendame.app"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                Google Play
              </a>
            </div>
          </div>
        </transition>
      </div>

      <footer class="border-t border-white/10 pt-6 text-center text-xs text-white/50">
        Recomiéndame · Analiza tus gustos y te sugiere películas y series a tu medida.
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import brandLogo from "~/assets/logo.png?url";

interface WishlistItem {
  id: string;
  tmdbId: number;
  mediaType: string;
  title: string;
  posterUrl?: string;
  overview?: string;
  platforms?: string[];
  trailerUrl?: string;
}

const route = useRoute();
const config = useRuntimeConfig();

const shareId = computed(() => route.params.shareId as string);
const TAKE = 12;
const isLoading = ref(true);
const errorMessage = ref("");
const items = ref<WishlistItem[]>([]);
const total = ref(0);
const isLoadingMore = ref(false);
const showStoreLinks = ref(false);
const selectedItem = ref<WishlistItem | null>(null);

const placeholder = "https://placehold.co/400x600/1A0F59/FFFFFF?text=Recomiendame";

const mapItems = (rawItems: any[]): WishlistItem[] =>
  rawItems.map((entry: any) => {
    const tmdb = entry.tmdb ?? {};
    return {
      id: String(entry.id ?? entry.tmdbId),
      tmdbId: entry.tmdbId,
      mediaType: tmdb.mediaType ?? entry.mediaType ?? "movie",
      title: tmdb.title ?? entry.title ?? "Título desconocido",
      posterUrl: tmdb.posterUrl ?? entry.posterUrl,
      overview: tmdb.overview ?? entry.overview,
      platforms: tmdb.platforms ?? entry.platforms ?? [],
      trailerUrl: tmdb.trailerUrl ?? entry.trailerUrl,
    } as WishlistItem;
  });

const fetchSharedWishlist = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const response = await $fetch<any>(`/wishlist/shared/${shareId.value}`, {
      baseURL: config.public.apiBase,
      params: { take: TAKE, skip: 0 },
    });

    const raw = response?.wishlist?.items ?? response?.items ?? [];
    items.value = mapItems(raw);
    total.value = response?.wishlist?.total ?? response?.total ?? raw.length;
  } catch (error: any) {
    const message = error?.data?.message || error?.statusMessage || "No pudimos cargar la lista de deseos.";
    errorMessage.value = Array.isArray(message) ? message.join(" ") : message;
  } finally {
    isLoading.value = false;
  }
};

const loadMore = async () => {
  if (isLoadingMore.value) return;
  isLoadingMore.value = true;

  try {
    const response = await $fetch<any>(`/wishlist/shared/${shareId.value}`, {
      baseURL: config.public.apiBase,
      params: { take: TAKE, skip: items.value.length },
    });

    const raw = response?.wishlist?.items ?? response?.items ?? [];
    items.value.push(...mapItems(raw));
  } catch {
    // silencioso
  } finally {
    isLoadingMore.value = false;
  }
};

const hasMore = computed(() => items.value.length < total.value);

const openApp = () => {
  const deepLink = `recomiendame://shared-wishlist/${shareId.value}`;
  showStoreLinks.value = false;

  const timer = setTimeout(() => {
    showStoreLinks.value = true;
  }, 1500);

  const onBlur = () => {
    clearTimeout(timer);
    window.removeEventListener("blur", onBlur);
  };
  window.addEventListener("blur", onBlur);

  window.location.href = deepLink;
};

onMounted(() => {
  fetchSharedWishlist();
  if (process.client) {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") selectedItem.value = null;
    });
  }
});

useHead({
  title: "Lista de deseos compartida | Recomiéndame",
  meta: [
    { name: "description", content: "Mira la lista de deseos de este usuario en Recomiéndame." },
  ],
});
</script>
