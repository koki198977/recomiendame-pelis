<template>
  <div
    class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] items-center"
  >
    <div class="space-y-6">
      <span
        class="inline-flex items-center gap-2 text-secondary-200 text-xs font-semibold uppercase tracking-[0.4em]"
      >
        {{ explainer.badge }}
      </span>
      <h2 class="text-3xl font-semibold text-white leading-tight">
        {{ explainer.title }}
      </h2>
      <p class="text-white/70 leading-relaxed">
        {{ explainer.copy }}
      </p>
      <ul class="space-y-3 text-sm text-white/70">
        <li
          v-for="bullet in explainer.bullets"
          :key="bullet"
          class="flex items-start gap-3"
        >
          <span class="mt-1 text-primary-300">◆</span>
          <span>{{ bullet }}</span>
        </li>
      </ul>
    </div>
    <div class="flex justify-center lg:justify-end">
      <figure class="phone phone--wide" :aria-label="explainer.media?.alt || explainer.title">
        <div class="bezel">
          <img
            :src="explainer.media?.src"
            :alt="explainer.media?.alt || explainer.title"
            class="screen"
            loading="lazy"
          />
        </div>
        <figcaption>{{ explainer.media?.caption || explainer.title }}</figcaption>
      </figure>
    </div>
  </div>
</template>

<script setup>
defineProps({
  explainer: {
    type: Object,
    required: true,
  },
});
</script>
