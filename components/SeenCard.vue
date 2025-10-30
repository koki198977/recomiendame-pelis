<template>
  <div class="card-hover h-full overflow-hidden">
    <div class="relative h-52 w-full overflow-hidden rounded-3xl sm:h-48">
      <img
        :src="posterSrc"
        :alt="`Poster de ${item.title}`"
        class="h-full w-full object-cover"
      />
      <span
        class="absolute left-3 top-3 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/70 backdrop-blur"
      >
        {{ mediaBadge }}
      </span>
    </div>
    <div class="space-y-3 pt-4">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-white/40">
            {{ formattedDate }}
          </p>
          <h3 class="text-base font-semibold sm:text-lg">{{ item.title }}</h3>
        </div>
        <div class="flex flex-col gap-2 sm:flex-row">
          <button
            v-if="item.tmdbId"
            class="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/70 transition hover:bg-primary-500/20 sm:w-auto sm:text-xs sm:py-1.5"
            @click="$emit('share', item)"
          >
            🔗 Compartir
          </button>
          <button
            class="inline-flex w-full items-center justify-center rounded-full bg-red-500/20 px-3 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/30 disabled:opacity-40 sm:w-auto sm:text-xs sm:py-1.5"
            :disabled="deleting"
            @click="$emit('remove')"
          >
            <span v-if="!deleting">Eliminar</span>
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
              Borrando…
            </span>
          </button>
        </div>
      </div>
      <p v-if="item.reason" class="text-sm text-white/60 leading-relaxed">
        {{ item.reason }}
      </p>
      <div v-if="platforms.length" class="flex flex-wrap gap-2">
        <span
          v-for="platform in platforms"
          :key="platform"
          class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
        >
          {{ platform }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

const props = defineProps<{
  item: SeenItem;
  deleting?: boolean;
}>();

defineEmits<{
  (e: "remove"): void;
  (e: "share", item: SeenItem): void;
}>();

const posterSrc = computed(
  () =>
    props.item.posterUrl ||
    "https://placehold.co/400x600/1A0F59/FFFFFF?text=Recomiendame"
);

const mediaBadge = computed(() =>
  props.item.mediaType === "tv"
    ? "Serie"
    : props.item.mediaType === "movie"
    ? "Película"
    : props.item.mediaType.toUpperCase()
);

const formattedDate = computed(() => {
  if (!props.item.seenAt) return "Recientemente";
  try {
    return new Intl.DateTimeFormat("es-CL", {
      dateStyle: "medium",
    }).format(new Date(props.item.seenAt));
  } catch {
    return props.item.seenAt;
  }
});

const platforms = computed(() => props.item.platforms ?? []);
</script>
