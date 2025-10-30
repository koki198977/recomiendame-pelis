<template>
  <div class="card-hover overflow-hidden p-0">
    <div class="relative">
      <img
        :src="imageSrc"
        :alt="`Poster de ${item.title}`"
        class="h-48 w-full object-cover sm:h-56"
      />
      <span
        v-if="mediaBadge"
        class="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/70 backdrop-blur"
      >
        {{ mediaBadge }}
      </span>
    </div>
    <div class="space-y-4 p-5 sm:p-6">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <h3 class="text-base font-semibold text-white sm:text-lg">{{ item.title }}</h3>
        <span
          v-if="item.voteAverage"
          class="inline-flex items-center gap-1 self-start rounded-full bg-secondary-500/20 px-3 py-1 text-xs font-semibold text-secondary-100"
        >
          ⭐ {{ item.voteAverage.toFixed(1) }}
        </span>
      </div>
      <p v-if="item.reason" class="text-xs uppercase tracking-[0.3em] text-white/40">
        {{ item.reason }}
      </p>
      <p v-if="props.showOverview && description" class="text-sm leading-relaxed text-white/60">
        {{ description }}
      </p>
      <p v-if="item.releaseDate" class="text-xs uppercase tracking-[0.3em] text-white/40">
        Estreno {{ formatDate(item.releaseDate) }}
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
      <div v-else-if="item.status?.length" class="flex flex-wrap gap-2">
        <span
          v-for="status in item.status"
          :key="status"
          class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
          :class="badgeClasses(status)"
        >
          {{ status }}
        </span>
      </div>

      <div v-if="hasTrailer" class="flex justify-end">
        <a
          :href="item.trailerUrl"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 hover:bg-primary-500/30 transition"
        >
          🎬 Ver trailer
        </a>
      </div>

      <p
        v-if="props.showDetailsHint"
        class="text-xs font-semibold text-primary-200 sm:text-[11px]"
      >
        Ver más →
      </p>

      <div
        v-if="showActions"
        class="flex flex-col gap-2 border-t border-white/10 pt-3 sm:flex-row sm:flex-wrap sm:gap-3"
      >
        <button
          v-if="!states?.seen"
          class="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/70 transition hover:bg-accent-500/20 sm:w-auto sm:text-xs sm:py-1.5"
          @click.stop="emit('mark-seen', item)"
        >
          👀 Marcar visto
        </button>
        <span
          v-else
          class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-500/20 px-3 py-2 text-sm font-semibold text-accent-100 sm:w-auto sm:text-xs sm:py-1.5"
        >
          ✅ Ya visto
        </span>

        <button
          v-if="!states?.favorite"
          class="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/70 transition hover:bg-secondary-500/20 sm:w-auto sm:text-xs sm:py-1.5"
          @click.stop="emit('mark-favorite', item)"
        >
          ❤️ Favorito
        </button>
        <span
          v-else
          class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-secondary-500/20 px-3 py-2 text-sm font-semibold text-secondary-100 sm:w-auto sm:text-xs sm:py-1.5"
        >
          ❤️ En favoritos
        </span>

        <button
          v-if="!states?.wishlist"
          class="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/70 transition hover:bg-primary-500/20 sm:w-auto sm:text-xs sm:py-1.5"
          @click.stop="emit('mark-wishlist', item)"
        >
          ⭐ Añadir a wishlist
        </button>
        <span
          v-else
          class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-500/20 px-3 py-2 text-sm font-semibold text-primary-100 sm:w-auto sm:text-xs sm:py-1.5"
        >
          ⭐ En wishlist
        </span>
        <button
          v-if="item.tmdbId"
          class="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/70 transition hover:bg-primary-500/20 sm:w-auto sm:text-xs sm:py-1.5"
          @click.stop="emit('share', item)"
        >
          🔗 Compartir
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface RecommendationCardItem {
  id?: string;
  tmdbId?: number;
  title: string;
  cover?: string;
  posterUrl?: string;
  description?: string;
  overview?: string;
  status?: string[];
  type?: string;
  mediaType?: string;
  voteAverage?: number;
  releaseDate?: string;
  reason?: string;
  platforms?: string[];
  trailerUrl?: string;
}

interface RecommendationStates {
  favorite?: boolean;
  seen?: boolean;
  wishlist?: boolean;
}

const props = withDefaults(
  defineProps<{
    item: RecommendationCardItem;
    states?: RecommendationStates;
    showActions?: boolean;
    showOverview?: boolean;
    showDetailsHint?: boolean;
  }>(),
  {
    showOverview: true,
    showDetailsHint: false,
  }
);

const emit = defineEmits<{
  (e: "mark-favorite", item: RecommendationCardItem): void;
  (e: "mark-seen", item: RecommendationCardItem): void;
  (e: "mark-wishlist", item: RecommendationCardItem): void;
  (e: "share", item: RecommendationCardItem): void;
}>();

const imageSrc = computed(
  () =>
    props.item.cover ||
    props.item.posterUrl ||
    "https://placehold.co/400x600/1A0F59/FFFFFF?text=Recomiendame"
);

const description = computed(
  () => props.item.description || props.item.overview || ""
);

const platforms = computed(() => props.item.platforms ?? []);

const mediaBadge = computed(() => {
  if (props.item.mediaType === "movie") return "Película";
  if (props.item.mediaType === "tv") return "Serie";
  return props.item.type || "";
});

const showActions = computed(
  () => props.showActions && props.item.tmdbId !== undefined
);

const hasTrailer = computed(() => Boolean(props.item.trailerUrl));

const formatDate = (value: string) => {
  try {
    return new Intl.DateTimeFormat("es-CL", {
      year: "numeric",
      month: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
};

const badgeStyles: Record<string, string> = {
  Visto: "bg-accent-500/20 text-accent-100 border border-accent-500/40",
  Favorito:
    "bg-secondary-500/20 text-secondary-100 border border-secondary-500/40",
  Pendiente: "bg-primary-500/15 text-primary-100 border border-primary-500/30",
  "En deseos": "bg-white/10 text-white/80 border border-white/10",
  "No me interesa": "bg-surface-800 text-white/50 border border-white/10",
};

const badgeClasses = (status: string) =>
  badgeStyles[status] ?? "bg-white/10 text-white/70 border border-white/10";
</script>
