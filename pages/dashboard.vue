<template>
  <div class="bg-surface-950 min-h-screen text-white pb-20">
    <!-- Hero -->
    <section class="relative overflow-hidden">
      <div
        class="absolute inset-0 -z-10 bg-gradient-to-br from-primary-600/30 via-surface-950 to-surface-900"
      ></div>
      <div
        class="absolute inset-0 -z-10 bg-gradient-to-tr from-secondary-500/20 via-transparent to-primary-500/20 blur-3xl"
      ></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div class="space-y-6 max-w-2xl">
            <p class="text-sm uppercase tracking-[0.4em] text-white/50">
              Hola {{ userDisplayName }}
            </p>
            <h1 class="text-3xl sm:text-5xl font-semibold leading-tight">
              Vamos a encontrar algo que te vuelva a emocionar
            </h1>
            <p class="text-white/70 text-lg leading-relaxed">
              Marca lo que ya viste, controla tu watchlist y deja que la IA de Recomiéndame
              construya sugerencias perfectas para tu mood.
            </p>
            <p class="text-sm text-white/50">
              Tus estadísticas se actualizan automáticamente según tu actividad reciente.
            </p>
          </div>
          <div class="grid grid-cols-2 gap-4 sm:gap-6 w-full lg:w-auto max-w-lg">
            <div
              v-for="card in statCards"
              :key="card.label"
              class="card p-6"
            >
              <p class="text-xs uppercase tracking-[0.3em] text-white/40">{{ card.label }}</p>
              <p class="mt-4 text-3xl font-semibold sm:text-4xl" :class="card.accent">
                <span v-if="statsLoading" class="animate-pulse text-white/40">···</span>
                <span v-else>{{ card.value }}</span>
              </p>
              <p class="mt-2 text-sm text-white/60">
                {{ card.description }}
              </p>
            </div>
          </div>
          <p v-if="statsError" class="mt-3 text-xs text-red-300">{{ statsError }}</p>
        </div>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 grid gap-6 md:grid-cols-2">
      <div class="card space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-semibold">Distribución por tipo</h3>
          <span class="text-xs text-white/50">Películas vs Series</span>
        </div>
        <div v-if="statsLoading" class="text-sm text-white/60">Cargando métricas…</div>
        <div v-else class="space-y-4">
          <div
            v-for="row in breakdownRows"
            :key="row.label"
            class="space-y-2"
          >
            <div class="flex items-center justify-between text-xs text-white/60">
              <span>{{ row.label }}</span>
              <span>{{ row.total }} total</span>
            </div>
            <div class="flex h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                class="bg-primary-500 transition-all duration-300"
                :style="{ width: row.moviePercent + '%' }"
                :title="`Películas: ${row.movieCount}`"
              ></div>
              <div
                class="bg-secondary-500 transition-all duration-300"
                :style="{ width: row.tvPercent + '%' }"
                :title="`Series: ${row.tvCount}`"
              ></div>
            </div>
            <div class="flex justify-between text-[11px] text-white/50">
              <span>🎬 Películas · {{ row.movieCount }}</span>
              <span>📺 Series · {{ row.tvCount }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card space-y-4">
        <h3 class="text-xl font-semibold">Tus géneros favoritos</h3>
        <p class="text-sm text-white/60">
          Según lo que has visto, agregado o evaluado últimamente.
        </p>
        <div v-if="!favoriteGenres.length" class="text-sm text-white/60">
          Aún no detectamos géneros predominantes. Sigue registrando contenidos.
        </div>
        <div v-else class="flex flex-wrap gap-2">
          <span
            v-for="genre in favoriteGenres"
            :key="genre"
            class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
          >
            {{ genre }}
          </span>
        </div>
      </div>
    </section>

    <!-- Prompt Generator -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
      <div class="card relative overflow-hidden">
        <div class="absolute -right-24 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-primary-500/20 blur-3xl"></div>
        <div class="absolute -left-20 -bottom-16 h-48 w-48 rounded-full bg-secondary-500/20 blur-3xl"></div>
        <div class="relative grid gap-8 md:grid-cols-[1.2fr_1fr]">
          <div class="space-y-6">
            <div>
              <span class="text-xs uppercase tracking-[0.4em] text-white/50">
                Generador de mood
              </span>
              <h2 class="mt-2 text-2xl font-semibold">¿Qué se te antoja ver hoy?</h2>
            </div>
            <p class="text-white/70 text-sm leading-relaxed">
              Cuéntale a la IA qué emoción buscas, qué actores amas o incluso cuánto tiempo tienes.
              Te propondrá una lista curada con explicaciones claras para cada título.
            </p>
            <form class="space-y-4" @submit.prevent="handlePrompt">
              <textarea
                ref="promptTextarea"
                v-model="prompt"
                rows="3"
                class="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white placeholder:text-white/40 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 resize-none"
                placeholder="Ej: Algo cyberpunk con misterio, finales sorprendentes y duración menor a 2 horas."
              ></textarea>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="chip in promptChips"
                  :key="chip"
                  type="button"
                  class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70 hover:bg-primary-500/20 hover:text-white transition"
                  @click="appendChip(chip)"
                >
                  {{ chip }}
                </button>
              </div>
              <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  class="btn-primary inline-flex items-center justify-center gap-2 sm:w-auto"
                  :disabled="isPromptLoading"
                >
                  <span v-if="!isPromptLoading">Generar con IA</span>
                  <span v-else class="flex items-center gap-2">
                    <svg
                      class="h-4 w-4 animate-spin"
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
                    Pensando…
                  </span>
                </button>
                <p v-if="promptFeedback" class="text-xs text-accent-100">
                  {{ promptFeedback }}
                </p>
              </div>
            </form>
          </div>
          <div class="card bg-surface-900/60 border border-white/5 space-y-5 p-6">
            <p class="text-sm text-white/60 leading-relaxed">
              <span class="text-white font-semibold">Consejo:</span> combina 2 moods y una referencia
              para resultados más finos. Ej: “Quiero algo esperanzador como <em>Amélie</em> pero con
              nostalgia sci-fi tipo <em>Her</em>”.
            </p>
            <div class="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-white/80 space-y-3">
              <p class="text-xs uppercase tracking-[0.4em] text-white/40">Último resultado</p>
              <p v-if="promptHistory.length" class="leading-relaxed">
                {{ promptHistory[0] }}
              </p>
              <p v-else class="text-white/50 italic">Aún no has generado recomendaciones.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Recommendations -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-10">
      <header class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-semibold">Recomendaciones destacadas</h2>
          <p class="text-sm text-white/60">
            Basadas en tus últimos gustos evaluados y el mood de hoy.
          </p>
        </div>
      </header>
      <div v-if="topRecommendations.length" class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <article
          v-for="item in topRecommendations"
          :key="item.id || `${item.tmdbId}-${item.mediaType}` || item.title"
          class="card flex h-full cursor-pointer flex-col gap-4 overflow-hidden p-0 transition hover:-translate-y-1 hover:shadow-medium focus:outline-none focus-visible:-translate-y-1 focus-visible:ring-2 focus-visible:ring-primary-400"
          role="button"
          tabindex="0"
          @click="openRecommendationDetails(item)"
          @keydown.enter.prevent="openRecommendationDetails(item)"
          @keydown.space.prevent="openRecommendationDetails(item)"
        >
          <div class="relative w-full">
            <div class="relative mx-4 mt-4 overflow-hidden rounded-3xl border border-white/5">
              <div class="aspect-[2/3]">
                <img
                  :src="item.posterUrl || placeholderImage"
                  :alt="item.title"
                  class="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
          <div class="flex flex-1 flex-col gap-3 px-6 pb-6">
            <div>
              <p class="text-xs uppercase tracking-[0.3em] text-white/40">
                {{ item.mediaType === "tv" ? "Serie" : "Película" }}
              </p>
              <h3 class="mt-1 text-lg font-semibold line-clamp-2" :title="item.title">
                {{ item.title }}
              </h3>
            </div>
            <div class="flex items-center justify-between text-xs text-white/60">
              <span class="inline-flex items-center gap-1 text-primary-100">
                ⭐
                <span class="font-semibold text-white">
                  {{ formatVoteAverage(item.voteAverage) }}
                </span>
              </span>
              <span>{{ formatReleaseLabel(item.releaseDate) }}</span>
            </div>
            <div v-if="item.platforms?.length" class="flex flex-wrap gap-2">
              <span
                v-for="platform in item.platforms"
                :key="platform"
                class="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70"
              >
                {{ platform }}
              </span>
            </div>
            <p class="text-xs font-semibold text-primary-200">
              Ver más →
            </p>
            <div class="mt-auto grid gap-2">
              <button
                type="button"
                :class="actionButtonClass(getItemStates(item).seen)"
                :disabled="getItemStates(item).seen"
                @click.stop="handleSeen(item)"
              >
                {{ getItemStates(item).seen ? "👀 Ya visto" : "👀 Marcar visto" }}
              </button>
              <button
                type="button"
                :class="actionButtonClass(getItemStates(item).favorite)"
                :disabled="getItemStates(item).favorite"
                @click.stop="handleFavorite(item)"
              >
                {{ getItemStates(item).favorite ? "❤️ En favoritos" : "❤️ Favorito" }}
              </button>
              <button
                type="button"
                :class="actionButtonClass(getItemStates(item).wishlist)"
                :disabled="getItemStates(item).wishlist"
                @click.stop="handleWishlist(item)"
              >
                {{ getItemStates(item).wishlist ? "⭐ En wishlist" : "⭐ Añadir a wishlist" }}
              </button>
              <button
                type="button"
                class="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                @click.stop="handleShare(item)"
              >
                🔗 Compartir
              </button>
            </div>
          </div>
        </article>
      </div>
      <div v-else class="card border border-dashed border-white/10 bg-white/5 p-10 text-center text-sm text-white/60">
        Aún no tenemos recomendaciones destacadas. Genera una nueva búsqueda o guarda más favoritos
        para afinar la IA.
      </div>
    </section>

    <Teleport to="body">
      <transition name="fade">
        <div
          v-if="activeRecommendation"
          ref="modalContainer"
          class="fixed inset-0 z-50 flex items-center justify-center bg-surface-950/90 px-4 py-10 backdrop-blur-md"
          tabindex="-1"
          @keydown.esc="closeRecommendationDetails"
          @click.self="closeRecommendationDetails"
        >
          <div
            class="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-surface-900 shadow-strong max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              class="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
              @click="closeRecommendationDetails"
              aria-label="Cerrar detalles"
            >
              ✕
            </button>
            <div class="grid gap-6 p-8 md:grid-cols-[220px_1fr]">
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
                    <span class="font-semibold text-white text-lg">
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
                    :class="actionButtonClass(getItemStates(activeRecommendation).seen)"
                    :disabled="getItemStates(activeRecommendation).seen"
                    @click="handleSeen(activeRecommendation)"
                  >
                    {{
                      getItemStates(activeRecommendation).seen
                        ? "👀 Ya visto"
                        : "👀 Marcar visto"
                    }}
                  </button>
                  <button
                    type="button"
                    :class="actionButtonClass(getItemStates(activeRecommendation).favorite)"
                    :disabled="getItemStates(activeRecommendation).favorite"
                    @click="handleFavorite(activeRecommendation)"
                  >
                    {{
                      getItemStates(activeRecommendation).favorite
                        ? "❤️ En favoritos"
                        : "❤️ Favorito"
                    }}
                  </button>
                  <button
                    type="button"
                :class="actionButtonClass(getItemStates(activeRecommendation).wishlist)"
                :disabled="getItemStates(activeRecommendation).wishlist"
                @click="handleWishlist(activeRecommendation)"
              >
                {{
                  getItemStates(activeRecommendation).wishlist
                    ? "⭐ En wishlist"
                    : "⭐ Añadir a wishlist"
                }}
              </button>
              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                @click="handleShare(activeRecommendation)"
              >
                🔗 Compartir
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
    <ShareDialog
      :item="shareTarget"
      :show="Boolean(shareTarget)"
      @close="shareTarget = null"
    />

    <!-- Favorites and Seen -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 grid gap-10 lg:grid-cols-2">
      <div class="card space-y-5">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-semibold">Favoritos recientes</h3>
            <p class="text-sm text-white/60">
              Lo último que agregaste a tu colección imprescindible.
            </p>
          </div>
          <NuxtLink to="/favorites" class="text-xs font-semibold text-primary-200 hover:text-primary-100 transition">
            Ver todos →
          </NuxtLink>
        </div>
        <div v-if="favoritesPreviewLoading" class="flex items-center justify-center py-6 text-white/60">
          Cargando…
        </div>
        <div v-else-if="favoritesPreviewError" class="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {{ favoritesPreviewError }}
        </div>
        <div v-else-if="favoritesPreview.length" class="grid gap-4 sm:grid-cols-2">
          <div
            v-for="favorite in favoritesPreview"
            :key="favorite.id"
            class="flex gap-4 rounded-2xl border border-white/5 bg-white/5 p-4"
          >
            <img
              :src="favorite.posterUrl || placeholderImage"
              :alt="favorite.title"
              class="h-24 w-16 rounded-xl object-cover"
            />
            <div class="flex-1 space-y-2">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm uppercase tracking-[0.3em] text-white/40">
                    {{ favorite.mediaType === "tv" ? "Serie" : "Película" }}
                  </p>
                  <h4 class="text-lg font-semibold">{{ favorite.title }}</h4>
                </div>
              </div>
              <p v-if="favorite.overview" class="text-sm text-white/60 leading-snug line-clamp-3">
                {{ favorite.overview }}
              </p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="platform in favorite.platforms"
                  :key="platform"
                  class="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70"
                >
                  {{ platform }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-sm text-white/60">Aún no tienes favoritos. Marca alguno desde la sección de recomendaciones.</div>
      </div>

      <div class="card space-y-5">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-semibold">Vistos recientemente</h3>
            <p class="text-sm text-white/60">
              Mantén tu historial actualizado para mejorar la IA.
            </p>
          </div>
          <NuxtLink to="/seen" class="text-xs font-semibold text-primary-200 hover:text-primary-100 transition">
            Ver todos →
          </NuxtLink>
        </div>
        <div v-if="seenPreviewLoading" class="flex items-center justify-center py-6 text-white/60">
          Cargando…
        </div>
        <div v-else-if="seenPreviewError" class="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {{ seenPreviewError }}
        </div>
        <div v-else-if="seenPreview.length" class="grid gap-4 sm:grid-cols-2">
          <div
            v-for="seen in seenPreview"
            :key="seen.id"
            class="rounded-3xl border border-white/5 bg-white/5 p-4 space-y-3"
          >
            <div class="relative h-40 w-full overflow-hidden rounded-2xl">
              <img
                :src="seen.posterUrl || placeholderImage"
                :alt="seen.title"
                class="h-full w-full object-cover"
              />
              <span
                class="absolute left-3 top-3 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/70 backdrop-blur"
              >
                {{ seen.mediaType === "tv" ? "Serie" : "Película" }}
              </span>
            </div>
            <div class="space-y-2">
              <h4 class="text-lg font-semibold">{{ seen.title }}</h4>
              <p v-if="seen.watchedAt" class="text-xs uppercase tracking-[0.3em] text-white/40">
                {{ new Date(seen.watchedAt).toLocaleDateString("es-CL") }}
              </p>
              <p v-if="seen.overview" class="text-sm text-white/60 leading-snug line-clamp-3">
                {{ seen.overview }}
              </p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="platform in seen.platforms"
                  :key="platform"
                  class="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70"
                >
                  {{ platform }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-sm text-white/60">Todavía no registras contenidos vistos. Empieza desde tu historial.</div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, nextTick, onMounted } from "vue";
import ShareDialog from "~/components/ShareDialog.vue";
import {
  useAuthToken,
  useAuthUser,
  syncAuthState,
} from "~/composables/useAuthState";
import { useCollections } from "~/composables/useCollections";

interface RecommendationItem {
  id?: string;
  title: string;
  overview?: string;
  description?: string;
  cover?: string;
  posterUrl?: string;
  tmdbId?: number;
  mediaType?: string;
  voteAverage?: number;
  releaseDate?: string;
  reason?: string;
  platforms?: string[];
  trailerUrl?: string;
}

const promptTextarea = ref<HTMLTextAreaElement | null>(null);

const prompt = ref("");
const promptFeedback = ref("");
const promptHistory = ref<string[]>([]);
const isPromptLoading = ref(false);

const user = ref<Record<string, any> | null>(null);
const userDisplayName = computed(() => user.value?.name ?? "Cinéfilo");

const stats = reactive({
  matchScore: null as number | null,
  seenTotal: null as number | null,
  favoriteTotal: null as number | null,
  ratingsTotal: null as number | null,
  averageRating: null as number | null,
  breakdownByType: {
    movie: { seen: 0, favorites: 0, ratings: 0 },
    tv: { seen: 0, favorites: 0, ratings: 0 },
  },
  favoriteGenres: [] as string[],
  recentRecommendations: [] as RecommendationItem[],
});
const statsLoading = ref(false);
const statsError = ref("");

const statCards = computed(() => {
  const cards = [
    {
      label: "Vistos totales",
      value: stats.seenTotal != null ? stats.seenTotal : "—",
      description: "Películas y series que ya registraste.",
      accent: "text-primary-200",
    },
    {
      label: "Favoritos guardados",
      value: stats.favoriteTotal != null ? stats.favoriteTotal : "—",
      description: "Historias que marcaste como imprescindibles.",
      accent: "text-secondary-200",
    },
    {
      label: "Evaluaciones",
      value: stats.ratingsTotal != null ? stats.ratingsTotal : "—",
      description: "Calificaciones que ayudan a mejorar las sugerencias.",
      accent: "text-accent-200",
    },
  ];

  if (stats.averageRating != null) {
    cards.push({
      label: "Promedio rating",
      value: stats.averageRating.toFixed(1),
      description: "Puntaje promedio que otorgas al contenido.",
      accent: "text-white",
    });
  } else if (stats.matchScore != null) {
    cards.push({
      label: "Matchscore IA",
      value: `${Math.round(stats.matchScore)}%`,
      description: "Precisión estimada de tus recomendaciones.",
      accent: "text-primary-300",
    });
  } else {
    cards.push({
      label: "Promedio rating",
      value: "—",
      description: "Puntaje promedio que otorgas al contenido.",
      accent: "text-white",
    });
  }

  return cards;
});

const promptChips = [
  "Quiero algo feel-good pero con ciencia ficción",
  "Series cortas para maratón de fin de semana",
  "Películas de suspenso psicológico europeas",
  "Anime cyberpunk con estética retro futurista",
];

const placeholderImage = "https://placehold.co/200x300/1A0F59/FFFFFF?text=Recomiendame";

const formatVoteAverage = (vote?: number | null) => {
  if (vote === undefined || vote === null || Number.isNaN(Number(vote))) {
    return "—";
  }
  return Number(vote).toFixed(1);
};

const formatReleaseLabel = (date?: string) => {
  if (!date) return "Estreno pendiente";
  const dt = new Date(date);
  if (Number.isNaN(dt.getTime())) return "Estreno pendiente";
  const formatter = new Intl.DateTimeFormat("es-ES", {
    month: "short",
    year: "numeric",
  });
  const formatted = formatter.format(dt).replace(".", "").toLowerCase();
  return `Estreno ${formatted}`;
};

const actionButtonClass = (isActive: boolean) =>
  [
    "w-full rounded-full border px-4 py-2 text-sm font-semibold transition",
    isActive
      ? "border-primary-400 bg-primary-500/20 text-primary-100"
      : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10",
  ].join(" ");

const authToken = useAuthToken();
const authUser = useAuthUser();
const config = useRuntimeConfig();
const collections = useCollections();

const topRecommendations = ref<RecommendationItem[]>([]);
const activeRecommendation = ref<RecommendationItem | null>(null);
const modalContainer = ref<HTMLDivElement | null>(null);
const shareTarget = ref<RecommendationItem | null>(null);

interface FavoritePreviewItem {
  id: string;
  tmdbId: number;
  title: string;
  mediaType: string;
  overview?: string;
  posterUrl?: string;
  createdAt?: string;
  platforms?: string[];
  trailerUrl?: string;
}

interface SeenPreviewItem {
  id: string;
  tmdbId: number;
  title: string;
  mediaType: string;
  overview?: string;
  posterUrl?: string;
  watchedAt?: string;
  platforms?: string[];
  trailerUrl?: string;
}

const favoritesPreview = ref<FavoritePreviewItem[]>([]);
const favoritesPreviewLoading = ref(false);
const favoritesPreviewError = ref("");

const seenPreview = ref<SeenPreviewItem[]>([]);
const seenPreviewLoading = ref(false);
const seenPreviewError = ref("");


const appendChip = (chip: string) => {
  prompt.value = prompt.value ? `${prompt.value} ${chip}` : chip;
};

const fetchDashboardStats = async () => {
  if (!authToken.value) return;
  statsLoading.value = true;
  statsError.value = "";

  const normalizeNumber = (value: any) => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
  };

  try {
    const response = await $fetch<any>("/dashboard/stats", {
      baseURL: config.public.apiBase,
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken.value}`,
        Accept: 'application/json',
      },
    });

    const payload = response?.stats ?? response ?? {};

    const seenTotal = normalizeNumber(
      payload?.seenTotal ?? payload?.seen_total ?? payload?.seentotal
    );
    const favoriteTotal = normalizeNumber(
      payload?.favoriteTotal ?? payload?.favorite_total ?? payload?.favoritetotal
    );
    const ratingsTotal = normalizeNumber(
      payload?.ratingsTotal ?? payload?.ratings_total ?? payload?.ratingstotal
    );
    const averageRating =
      typeof payload?.averageRating === "number"
        ? payload.averageRating
        : typeof payload?.average_rating === "number"
        ? payload.average_rating
        : null;
    const matchScore = normalizeNumber(
      payload?.matchScore ?? payload?.matchscore ?? payload?.match_score
    );

    const breakdown = payload?.breakdownByType ?? payload?.breakdown_by_type ?? {};
    const movieBreakdown = breakdown.movie ?? { seen: 0, favorites: 0, ratings: 0 };
    const tvBreakdown = breakdown.tv ?? { seen: 0, favorites: 0, ratings: 0 };

    stats.matchScore = matchScore;
    stats.seenTotal = seenTotal;
    stats.favoriteTotal = favoriteTotal;
    stats.ratingsTotal = ratingsTotal;
    stats.averageRating = averageRating;
    stats.breakdownByType = {
      movie: {
        seen: Number(movieBreakdown.seen ?? 0),
        favorites: Number(movieBreakdown.favorites ?? 0),
        ratings: Number(movieBreakdown.ratings ?? 0),
      },
      tv: {
        seen: Number(tvBreakdown.seen ?? 0),
        favorites: Number(tvBreakdown.favorites ?? 0),
        ratings: Number(tvBreakdown.ratings ?? 0),
      },
    };
    stats.favoriteGenres = Array.isArray(payload?.favoriteGenres)
      ? payload.favoriteGenres
      : Array.isArray(payload?.favorite_genres)
      ? payload.favorite_genres
      : [];

    const recentRecs = payload?.recentRecommendations ?? payload?.recent_recommendations ?? [];
    if (Array.isArray(recentRecs)) {
      const mapped = recentRecs
        .filter((entry: any) => entry?.tmdbId)
        .map(mapRecommendationEntry);
      stats.recentRecommendations = mapped;
      if (!topRecommendations.value.length && mapped.length) {
        topRecommendations.value = mapped.slice(0, 6);
      }
    }
  } catch (error: any) {
    const message =
      error?.data?.message ||
      error?.statusMessage ||
      "No pudimos cargar tus estadísticas.";
    statsError.value = Array.isArray(message) ? message.join(" ") : message;
  } finally {
    statsLoading.value = false;
  }
};
const mapFavoriteEntry = (entry: any): FavoritePreviewItem | null => {
  const tmdb = entry.tmdb ?? {};
  const tmdbId = entry.tmdbId ?? tmdb.id;
  if (!tmdbId) return null;
  return {
    id: String(tmdbId),
    tmdbId,
    title: tmdb.title ?? entry.title ?? "Título desconocido",
    mediaType: tmdb.mediaType ?? entry.mediaType ?? "movie",
    overview: tmdb.overview ?? entry.overview,
    posterUrl: tmdb.posterUrl,
    createdAt: entry.createdAt,
    platforms: tmdb.platforms ?? [],
  };
};

const mapSeenEntry = (entry: any): SeenPreviewItem | null => {
  const tmdb = entry.tmdb ?? {};
  const tmdbId = entry.tmdbId ?? tmdb.id;
  if (!tmdbId) return null;
  return {
    id: String(tmdbId),
    tmdbId,
    title: tmdb.title ?? entry.title ?? "Título desconocido",
    mediaType: tmdb.mediaType ?? entry.mediaType ?? "movie",
    overview: tmdb.overview ?? entry.overview,
    posterUrl: tmdb.posterUrl,
    watchedAt: entry.watchedAt ?? entry.createdAt,
    platforms: tmdb.platforms ?? [],
  };
};

const mapRecommendationEntry = (entry: any): RecommendationItem => ({
  id: entry.id ?? String(entry.tmdbId ?? Math.random().toString(36).slice(2)),
  tmdbId: entry.tmdbId ?? 0,
  title: entry.title ?? "Título desconocido",
  overview: entry.overview,
  posterUrl: entry.posterUrl,
  mediaType: entry.mediaType ?? "movie",
  voteAverage: entry.voteAverage,
  releaseDate: entry.releaseDate,
  reason: entry.reason,
  platforms: entry.platforms ?? [],
  trailerUrl: entry.trailerUrl,
});

const fetchFavoritesPreview = async () => {
  if (!authToken.value) return;
  favoritesPreviewLoading.value = true;
  favoritesPreviewError.value = "";

  try {
    const response = await $fetch<any>("/favorites", {
      baseURL: config.public.apiBase,
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken.value}`,
        Accept: 'application/json',
      },
      query: {
        take: 3,
        skip: 0,
        orderBy: "createdAt",
        order: "desc",
      },
    });

    const rawItems = Array.isArray(response)
      ? response
      : response?.favorites?.items ?? response?.items ?? [];

    favoritesPreview.value = rawItems
      .map(mapFavoriteEntry)
      .filter((item): item is FavoritePreviewItem => Boolean(item));
  } catch (error: any) {
    const message =
      error?.data?.message ||
      error?.statusMessage ||
      "No pudimos cargar tus favoritos recientes.";
    favoritesPreviewError.value = Array.isArray(message)
      ? message.join(" ")
      : message;
  } finally {
    favoritesPreviewLoading.value = false;
  }
};

const fetchSeenPreview = async () => {
  if (!authToken.value) return;
  seenPreviewLoading.value = true;
  seenPreviewError.value = "";

  try {
    const response = await $fetch<any>("/seen", {
      baseURL: config.public.apiBase,
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken.value}`,
        Accept: 'application/json',
      },
      query: {
        take: 4,
        skip: 0,
        orderBy: "createdAt",
        order: "desc",
      },
    });

    const rawItems = Array.isArray(response)
      ? response
      : response?.items ?? response?.seen?.items ?? [];

    seenPreview.value = rawItems
      .map(mapSeenEntry)
      .filter((item): item is SeenPreviewItem => Boolean(item));
  } catch (error: any) {
    const message =
      error?.data?.message ||
      error?.statusMessage ||
      "No pudimos cargar tus vistos recientes.";
    seenPreviewError.value = Array.isArray(message)
      ? message.join(" ")
      : message;
  } finally {
    seenPreviewLoading.value = false;
  }
};

const breakdownRows = computed(() => {
  const breakdown = stats.breakdownByType ?? {
    movie: { seen: 0, favorites: 0, ratings: 0 },
    tv: { seen: 0, favorites: 0, ratings: 0 },
  };

  const rows = [
    { key: "seen", label: "Vistos" },
    { key: "favorites", label: "Favoritos" },
    { key: "ratings", label: "Evaluados" },
  ];

  return rows.map(({ key, label }) => {
    const movieCount = Number(breakdown.movie?.[key as keyof typeof breakdown.movie] ?? 0);
    const tvCount = Number(breakdown.tv?.[key as keyof typeof breakdown.tv] ?? 0);
    const total = movieCount + tvCount;
    return {
      label,
      movieCount,
      tvCount,
      total,
      moviePercent: total ? Math.round((movieCount / total) * 100) : 0,
      tvPercent: total ? Math.round((tvCount / total) * 100) : 0,
    };
  });
});

const favoriteGenres = computed(() => stats.favoriteGenres ?? []);

const fetchRecommendations = async (
  promptText?: string,
  showFeedback = true
) => {
  if (!authToken.value) {
    promptFeedback.value =
      "Tu sesión expiró. Inicia sesión nuevamente para generar recomendaciones.";
    return;
  }

  isPromptLoading.value = true;
  promptFeedback.value = "";

  try {
    const body = promptText ? { feedback: promptText } : {};
    const response = await $fetch<{ recommendations: RecommendationItem[] }>(
      "/recommendations",
      {
        baseURL: config.public.apiBase,
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken.value}`,
        },
        body,
      }
    );

    const items = response?.recommendations ?? [];
    if (items.length) {
      topRecommendations.value = items;
      if (showFeedback) {
        promptFeedback.value = "Listo, ya actualizamos tus recomendaciones.";
      }
    } else if (showFeedback) {
      promptFeedback.value =
        "No encontramos coincidencias con ese prompt. Intenta combinar otros géneros o moods.";
    }

    if (promptText) {
      promptHistory.value.unshift(promptText);
      if (promptHistory.value.length > 5) {
        promptHistory.value = promptHistory.value.slice(0, 5);
      }
    }
    prompt.value = "";
  } catch (error: any) {
    if (error?.status === 401) {
      promptFeedback.value =
        "Tu sesión expiró. Redirigiendo al inicio de sesión…";
      await navigateTo("/login");
      return;
    }
    const message =
      error?.data?.message ||
      error?.statusMessage ||
      "No pudimos generar recomendaciones en este momento.";
    promptFeedback.value = Array.isArray(message)
      ? message.join(" ")
      : message;
  } finally {
    isPromptLoading.value = false;
  }
};

const itemStates = (item: RecommendationItem) => ({
  favorite: collections.isFavorite(item.tmdbId, item.mediaType),
  seen: collections.isSeen(item.tmdbId, item.mediaType),
  wishlist: collections.isInWishlist(item.tmdbId, item.mediaType),
});

const getItemStates = (item?: RecommendationItem | null) =>
  item ? itemStates(item) : { favorite: false, seen: false, wishlist: false };

const buildPayload = (item: RecommendationItem) => ({
  tmdbId: Number(item.tmdbId),
  mediaType: item.mediaType || "movie",
  title: item.title,
});

const handlePrompt = async () => {
  const value = prompt.value.trim();
  if (!value) {
    promptFeedback.value =
      "Describe brevemente qué quieres ver para obtener una lista personalizada.";
    return;
  }

  await fetchRecommendations(value);
};

const handleFavorite = async (item?: RecommendationItem | null) => {
  if (!item || !item.tmdbId) return;
  try {
    await collections.addFavorite(buildPayload(item));
    promptFeedback.value = "Agregado a favoritos.";
    fetchFavoritesPreview();
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
    } else {
      promptFeedback.value = "No pudimos guardar en favoritos.";
    }
  }
};

const handleSeen = async (item?: RecommendationItem | null) => {
  if (!item || !item.tmdbId) return;
  try {
    await collections.addSeen(buildPayload(item));
    promptFeedback.value = "Marcado como visto.";
    fetchSeenPreview();
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
    } else {
      promptFeedback.value = "No pudimos marcar como visto.";
    }
  }
};

const handleWishlist = async (item?: RecommendationItem | null) => {
  if (!item || !item.tmdbId) return;
  try {
    await collections.addWishlist(buildPayload(item));
    promptFeedback.value = "Añadido a tu wishlist.";
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
    } else {
      promptFeedback.value = "No pudimos añadir a tu wishlist.";
    }
  }
};

const handleShare = (item?: RecommendationItem | null) => {
  if (!item) return;
  shareTarget.value = item;
};

const openRecommendationDetails = (item: RecommendationItem) => {
  activeRecommendation.value = item;
};

const closeRecommendationDetails = () => {
  activeRecommendation.value = null;
};

onMounted(() => {
  if (process.client) {
    syncAuthState();
    collections.ensureLoaded();
    user.value = authUser.value;
    if (authToken.value) {
      fetchRecommendations(undefined, false);
      fetchDashboardStats();
      fetchFavoritesPreview();
      fetchSeenPreview();
    }
  }
});

watch(activeRecommendation, (value) => {
  if (value) {
    nextTick(() => {
      modalContainer.value?.focus();
    });
  }
});

watch(authUser, (val) => {
  user.value = val;
});

watch(authToken, (token) => {
  if (token) {
    fetchDashboardStats();
    fetchFavoritesPreview();
    fetchSeenPreview();
  } else {
    stats.matchScore = null;
    stats.seenTotal = null;
    stats.favoriteTotal = null;
    stats.ratingsTotal = null;
    stats.averageRating = null;
    stats.breakdownByType = { movie: { seen: 0, favorites: 0, ratings: 0 }, tv: { seen: 0, favorites: 0, ratings: 0 } };
    stats.favoriteGenres = [];
    stats.recentRecommendations = [];
    favoritesPreview.value = [];
    seenPreview.value = [];
    topRecommendations.value = [];
    activeRecommendation.value = null;
  }
});

useHead({
  title: "Dashboard | Recomiéndame",
  meta: [
    {
      name: "description",
      content:
        "Gestiona tus recomendaciones personalizadas, favoritos y estrenos sugeridos desde el panel principal de Recomiéndame.",
    },
  ],
});
</script>
