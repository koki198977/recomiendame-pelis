<template>
  <div class="card-hover h-full p-8 flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <div
        class="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl"
      >
        {{ feature.icon }}
      </div>
      <span class="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
        IA Streaming
      </span>
    </div>
    <h3 class="text-xl font-semibold text-white leading-tight">
      {{ feature.title }}
    </h3>
    <p class="text-sm leading-relaxed text-white/60">
      {{ feature.copy }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  feature: {
    type: Object,
    required: true,
  },
});
</script>
