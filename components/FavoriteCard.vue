<template>
  <article
    class="card-hover flex h-full cursor-pointer flex-col overflow-hidden p-0 transition hover:-translate-y-1 hover:shadow-medium focus:outline-none focus-visible:-translate-y-1 focus-visible:ring-2 focus-visible:ring-primary-400"
    role="button"
    tabindex="0"
    @click="$emit('view-details', item)"
    @keydown.enter.prevent="$emit('view-details', item)"
    @keydown.space.prevent="$emit('view-details', item)"
  >
    <div class="relative aspect-[2/3] w-full overflow-hidden">
      <img
        :src="posterSrc"
        :alt="`Poster de ${item.title}`"
        class="h-full w-full object-cover"
      />
      <span
        class="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/70 backdrop-blur"
      >
        {{ mediaBadge }}
      </span>
    </div>
    <div class="flex flex-1 flex-col space-y-3 p-5 sm:p-6">
      <div class="flex flex-col gap-2">
        <h3 class="text-base font-semibold text-white sm:text-lg line-clamp-2">{{ item.title }}</h3>
        <span v-if="item.addedAt" class="text-xs text-white/40">
          {{ formattedDate }}
        </span>
      </div>
      <div class="mt-auto pt-2">
        <p class="text-xs text-white/50 text-center">Click para ver detalles</p>
      </div>
    </div>
  </article>
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
  (e: "view-details", item: FavoriteItem): void;
  (e: "remove"): void;
  (e: "share", item: FavoriteItem): void;
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
