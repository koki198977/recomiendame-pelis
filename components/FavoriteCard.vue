<template>
  <div class="card-hover overflow-hidden p-0">
    <div class="relative">
      <img
        :src="posterSrc"
        :alt="`Poster de ${item.title}`"
        class="h-44 w-full object-cover"
      />
      <span
        class="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/70 backdrop-blur"
      >
        {{ mediaBadge }}
      </span>
    </div>
    <div class="p-5 space-y-3">
      <div class="flex items-start justify-between gap-3">
        <h3 class="text-lg font-semibold text-white">{{ item.title }}</h3>
        <span v-if="item.addedAt" class="text-xs text-white/40">
          {{ formattedDate }}
        </span>
      </div>
      <p v-if="item.overview" class="text-sm leading-relaxed text-white/60">
        {{ item.overview }}
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
      <div class="flex justify-end">
        <button
          class="inline-flex items-center gap-2 rounded-full bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-200 hover:bg-red-500/30 transition disabled:opacity-40"
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
  </div>
</template>

<script setup lang="ts">
interface FavoriteItem {
  id: string;
    tmdbId: number;
  mediaType: string;
  title: string;
  posterUrl?: string;
  addedAt?: string;
  overview?: string;
  platforms?: string[];
}

const props = defineProps<{
  item: FavoriteItem;
  deleting?: boolean;
}>();

defineEmits<{
  (e: "remove"): void;
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
  if (!props.item.addedAt) return "Recientemente";
  try {
    return new Intl.DateTimeFormat("es-CL", {
      dateStyle: "medium",
    }).format(new Date(props.item.addedAt));
  } catch {
    return props.item.addedAt;
  }
});

const platforms = computed(() => props.item.platforms ?? []);
</script>
