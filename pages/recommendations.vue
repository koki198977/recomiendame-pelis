<template>
  <div class="bg-surface-950 text-white min-h-screen pb-20">
    <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 space-y-10">
      <header class="space-y-3">
        <span class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
          Recomendaciones personalizadas
        </span>
        <div class="space-y-2">
          <h1 class="text-3xl sm:text-4xl font-semibold">
            Tu lista curada por la IA de Recomiéndame
          </h1>
          <p class="text-sm text-white/60 max-w-3xl">
            Ajusta el prompt para obtener resultados al instante. Cada tarjeta explica por qué la
            seleccionamos para ti y dónde verla.
          </p>
        </div>
      </header>

      <form class="card space-y-4" @submit.prevent="handleSubmit">
        <div class="space-y-2">
          <label class="text-xs uppercase tracking-[0.3em] text-white/40">
            Describe lo que quieres ver
          </label>
          <textarea
            v-model="prompt"
            rows="4"
            class="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white placeholder:text-white/40 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 resize-none"
            placeholder="Ej: Thrillers con giros impactantes, duración menor a 2 horas y disponibles en Netflix o HBO."
          ></textarea>
        </div>

        <div class="flex flex-wrap gap-2">
          <button
            v-for="suggestion in promptSuggestions"
            :key="suggestion"
            type="button"
            class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70 hover:bg-primary-500/20 hover:text-white transition"
            @click="appendPrompt(suggestion)"
          >
            {{ suggestion }}
          </button>
        </div>

        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-3">
            <button
              type="submit"
              class="btn-primary inline-flex items-center gap-2"
              :disabled="isLoading"
            >
              <span v-if="!isLoading">Generar recomendaciones</span>
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
                Generando…
              </span>
            </button>
            <button
              type="button"
              class="btn-secondary inline-flex items-center gap-2"
              @click="refreshRecommendations"
            >
              Actualizar
            </button>
          </div>
          <p v-if="feedbackMessage" :class="feedbackClass" class="text-xs">
            {{ feedbackMessage }}
          </p>
        </div>
      </form>

      <div v-if="errorMessage" class="rounded-3xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-sm text-red-200">
        {{ errorMessage }}
      </div>

      <section v-if="recommendations.length" class="space-y-6">
        <div class="flex flex-wrap items-center gap-3">
          <p class="text-sm text-white/60">
            {{ recommendations.length }} recomendaciones generadas
            <span v-if="lastUpdated"> · actualizadas {{ lastUpdated }}</span>
          </p>
        </div>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <RecommendationCard
            v-for="item in recommendations"
            :key="item.id || item.title"
            :item="item"
            :states="itemStates(item)"
            :show-actions="true"
            @mark-favorite="markFavorite"
            @mark-seen="markSeen"
            @mark-wishlist="markWishlist"
          />
        </div>
      </section>

      <div v-else-if="!isLoading" class="card border border-white/10 bg-white/5 p-6 text-sm text-white/60">
        Aún no tenemos recomendaciones generadas. Ingresa un prompt o pulsa actualizar para obtener
        sugerencias generales.
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import RecommendationCard from "~/components/RecommendationCard.vue";
import {
  useAuthToken,
  useAuthUser,
  syncAuthState,
} from "~/composables/useAuthState";
import { useCollections } from "~/composables/useCollections";

interface RecommendationItem {
  id?: string;
  tmdbId?: number;
  title: string;
  overview?: string;
  posterUrl?: string;
  voteAverage?: number;
  releaseDate?: string;
  reason?: string;
  mediaType?: string;
  platforms?: string[];
  trailerUrl?: string;
}

const prompt = ref("");
const recommendations = ref<RecommendationItem[]>([]);
const isLoading = ref(false);
const errorMessage = ref("");
const feedbackMessage = ref("");
const feedbackType = ref<"success" | "info" | "error">("info");
const lastUpdated = ref<string | null>(null);

const promptSuggestions = [
  "Películas de terror inteligente con finales sorprendentes",
  "Series cortas de comedia dramática para maratonear",
  "Sci-fi filosófico con estética visual potente",
  "Documentales inspiradores sobre tecnología y futuro",
];

const authToken = useAuthToken();
const authUser = useAuthUser();
const config = useRuntimeConfig();
const collections = useCollections();

const feedbackClass = computed(() => {
  if (feedbackType.value === "error") return "text-red-200";
  if (feedbackType.value === "success") return "text-accent-100";
  return "text-white/60";
});

const appendPrompt = (value: string) => {
  prompt.value = prompt.value ? `${prompt.value} ${value}` : value;
};

const formatTimestamp = (date: Date) => {
  try {
    return new Intl.DateTimeFormat("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return date.toLocaleTimeString();
  }
};

const fetchRecommendations = async (promptText?: string) => {
  if (!authToken.value) {
    feedbackType.value = "error";
    feedbackMessage.value =
      "Tu sesión expiró. Vuelve a iniciar sesión para generar recomendaciones.";
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";
  feedbackMessage.value = "";

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

    recommendations.value = response.recommendations ?? [];
    lastUpdated.value = formatTimestamp(new Date());

    if (recommendations.value.length) {
      feedbackType.value = "success";
      feedbackMessage.value = "¡Listo! Revisa tus nuevas sugerencias.";
    } else {
      feedbackType.value = "info";
      feedbackMessage.value =
        "No encontramos coincidencias para ese prompt. Intenta combinar otros géneros o moods.";
    }
  } catch (error: any) {
    lastUpdated.value = null;
    if (error?.status === 401) {
      feedbackType.value = "error";
      feedbackMessage.value = "Sesión expirada. Vuelve a iniciar sesión.";
      await navigateTo("/login");
      return;
    }
    const message =
      error?.data?.message ||
      error?.statusMessage ||
      "No pudimos generar recomendaciones en este momento.";
    errorMessage.value = Array.isArray(message) ? message.join(" ") : message;
    feedbackType.value = "error";
    feedbackMessage.value = "";
  } finally {
    isLoading.value = false;
  }
};

const handleSubmit = async () => {
  const value = prompt.value.trim();
  await fetchRecommendations(value || undefined);
  if (value) {
    prompt.value = "";
  }
};

const refreshRecommendations = () => fetchRecommendations();

const itemStates = (item: RecommendationItem) => ({
  favorite: collections.isFavorite(item.tmdbId, item.mediaType),
  seen: collections.isSeen(item.tmdbId, item.mediaType),
  wishlist: collections.isInWishlist(item.tmdbId, item.mediaType),
});

const buildPayload = (item: RecommendationItem) => ({
  tmdbId: Number(item.tmdbId),
  mediaType: item.mediaType || "movie",
  title: item.title,
});

const setFeedback = (type: "success" | "info" | "error", message: string) => {
  feedbackType.value = type;
  feedbackMessage.value = message;
};

const markFavorite = async (item: RecommendationItem) => {
  if (!item.tmdbId) return;
  try {
    await collections.addFavorite(buildPayload(item));
    setFeedback("success", "Agregado a favoritos.");
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
    } else {
      setFeedback("error", "No pudimos guardar en favoritos.");
    }
  }
};

const markSeen = async (item: RecommendationItem) => {
  if (!item.tmdbId) return;
  try {
    await collections.addSeen(buildPayload(item));
    setFeedback("success", "Marcado como visto.");
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
    } else {
      setFeedback("error", "No pudimos marcar como visto.");
    }
  }
};

const markWishlist = async (item: RecommendationItem) => {
  if (!item.tmdbId) return;
  try {
    await collections.addWishlist(buildPayload(item));
    setFeedback("success", "Añadido a tu wishlist.");
  } catch (error: any) {
    if (error?.status === 401) {
      await navigateTo("/login");
    } else {
      setFeedback("error", "No pudimos añadir a tu wishlist.");
    }
  }
};

onMounted(() => {
  if (process.client) {
    syncAuthState();
    collections.ensureLoaded();
    if (authToken.value) {
      fetchRecommendations();
    }
  }
});

watch(authUser, (val) => {
  if (!val) {
    recommendations.value = [];
  }
});

useHead({
  title: "Recomendaciones | Recomiéndame",
});
</script>
