<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="show"
        class="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 px-4"
        @click.self="$emit('close')"
      >
        <div class="w-full max-w-md rounded-3xl border border-white/10 bg-surface-900 p-6 shadow-strong sm:p-8">
          <div class="space-y-6">
            <div>
              <h2 class="text-2xl font-semibold">
                {{ isEditing ? 'Editar calificación' : 'Calificar' }}
              </h2>
              <p class="mt-2 text-sm text-white/60">
                {{ item?.title }}
              </p>
            </div>

            <!-- Rating Stars -->
            <div class="space-y-3">
              <label class="text-sm font-medium text-white/70">
                Tu calificación
              </label>
              <div class="flex items-center gap-2">
                <button
                  v-for="star in 5"
                  :key="star"
                  type="button"
                  class="text-3xl transition hover:scale-110"
                  :class="star <= rating ? 'text-yellow-400' : 'text-white/20'"
                  @click="rating = star"
                >
                  {{ star <= rating ? '★' : '☆' }}
                </button>
                <span class="ml-2 text-sm text-white/60">
                  {{ rating > 0 ? `${rating}/5` : 'Sin calificar' }}
                </span>
              </div>
            </div>

            <!-- Comment -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-white/70" for="rating-comment">
                Comentario (opcional)
              </label>
              <textarea
                id="rating-comment"
                v-model="comment"
                rows="3"
                class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 resize-none"
                placeholder="¿Qué te pareció?"
              ></textarea>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {{ errorMessage }}
            </div>

            <!-- Success Message -->
            <div v-if="successMessage" class="rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-200">
              {{ successMessage }}
            </div>

            <!-- Actions -->
            <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                class="rounded-full border border-white/10 bg-white/5 px-6 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                @click="$emit('close')"
                :disabled="isSubmitting"
              >
                Cancelar
              </button>
              <button
                type="button"
                class="rounded-full bg-primary-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-primary-400 disabled:opacity-50"
                @click="submitRating"
                :disabled="rating === 0 || isSubmitting"
              >
                <span v-if="!isSubmitting">Enviar calificación</span>
                <span v-else class="flex items-center justify-center gap-2">
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
                  Enviando…
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useAuthToken } from "~/composables/useAuthState";
import { useRatings } from "~/composables/useRatings";

interface RatingItem {
  tmdbId?: number;
  title?: string;
  mediaType?: string;
}

const props = defineProps<{
  item: RatingItem | null;
  show: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "rated"): void;
}>();

const authToken = useAuthToken();
const config = useRuntimeConfig();
const ratings = useRatings();

const rating = ref(0);
const comment = ref("");
const isSubmitting = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const isEditing = ref(false);

const normalizeMediaType = (value?: string | null) => {
  if (!value) return "movie";
  const lowered = value.toString().trim().toLowerCase();
  if (["tv", "tv_show", "show", "serie", "series", "tvshow"].includes(lowered)) {
    return "tv";
  }
  return "movie";
};

const submitRating = async () => {
  if (!props.item?.tmdbId || rating.value === 0) return;

  isSubmitting.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    const body: any = {
      tmdbId: props.item.tmdbId,
      mediaType: normalizeMediaType(props.item.mediaType),
      rating: rating.value,
    };

    // Solo agregar comment si tiene contenido
    if (comment.value.trim()) {
      body.comment = comment.value.trim();
    }

    await $fetch("/ratings", {
      baseURL: config.public.apiBase,
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken.value}`,
        "Content-Type": "application/json",
      },
      body,
    });

    successMessage.value = isEditing.value 
      ? "¡Calificación actualizada exitosamente!" 
      : "¡Calificación enviada exitosamente!";
    
    // Actualizar el cache local
    await ratings.fetchRatings({ force: true });
    
    emit("rated");
    
    // Cerrar el diálogo después de 1.5 segundos
    setTimeout(() => {
      emit("close");
    }, 1500);
  } catch (error: any) {
    const message =
      error?.data?.message ||
      error?.statusMessage ||
      "No pudimos guardar tu calificación.";
    errorMessage.value = Array.isArray(message) ? message.join(" ") : message;
  } finally {
    isSubmitting.value = false;
  }
};

// Load existing rating when dialog opens
watch(() => props.show, (newShow) => {
  if (newShow && props.item?.tmdbId) {
    const existingRating = ratings.getRating(props.item.tmdbId);
    if (existingRating) {
      rating.value = existingRating.rating;
      comment.value = existingRating.comment || "";
      isEditing.value = true;
    } else {
      rating.value = 0;
      comment.value = "";
      isEditing.value = false;
    }
    errorMessage.value = "";
    successMessage.value = "";
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
