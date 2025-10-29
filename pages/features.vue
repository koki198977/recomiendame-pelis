<template>
  <div class="bg-surface-950 text-white">
    <!-- Hero -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 -z-10 bg-gradient-to-br from-primary-600/30 via-surface-950 to-surface-900"></div>
      <div class="absolute inset-0 -z-10 bg-gradient-to-tr from-secondary-500/20 via-transparent to-primary-500/20 blur-3xl"></div>
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="max-w-3xl space-y-6">
          <span class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
            Funcionalidades clave
          </span>
          <h1 class="text-4xl sm:text-5xl font-semibold leading-tight">
            Todo lo que necesitas para encontrar tu próxima película o serie favorita
          </h1>
          <p class="text-lg text-white/70 leading-relaxed">
            Recomiéndame combina inteligencia artificial, análisis de plataformas y tus calificaciones personales para entregarte sugerencias explicadas y listas que evolucionan contigo.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 pt-2">
            <NuxtLink to="/login" class="btn-primary inline-flex items-center gap-2">
              Probar ahora
            </NuxtLink>
            <NuxtLink to="/download" class="btn-secondary inline-flex items-center gap-2">
              Apps móviles
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Feature Grid -->
    <section class="relative border-t border-white/5">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            v-for="feature in featureBlocks"
            :key="feature.title"
            :feature="feature"
          />
        </div>
      </div>
    </section>

    <!-- Explainers -->
    <section class="relative border-t border-white/5 bg-surface-900">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-20">
        <Explainer
          v-for="explainer in explainers"
          :key="explainer.title"
          :explainer="explainer"
        />
      </div>
    </section>

    <!-- CTA -->
    <section class="relative border-t border-white/5 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 py-24">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 text-white">
        <h2 class="text-3xl sm:text-4xl font-semibold">
          ¿Listo para dejar de perder tiempo buscando qué ver?
        </h2>
        <p class="text-lg text-white/80">
          Inicia sesión desde la web o descarga la app y deja que nuestra IA haga la curaduría por ti.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <NuxtLink to="/login" class="inline-flex items-center gap-2 rounded-full bg-surface-950 px-6 py-3 text-sm font-semibold shadow-soft hover:bg-surface-900 transition">
            Iniciar sesión
          </NuxtLink>
          <NuxtLink to="/download" class="inline-flex items-center gap-2 rounded-full bg-white/20 px-6 py-3 text-sm font-semibold backdrop-blur hover:bg-white/30 transition">
            Descargar apps móviles
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import screenRecs from "~/assets/screens/recs.jpg?url";
import screenSeen from "~/assets/screens/seen.jpg?url";

const featureBlocks = [
  {
    icon: "🧠",
    title: "Matchscore IA",
    copy:
      "El motor analiza directores, géneros, ritmos narrativos y tus calificaciones para asignar un porcentaje de afinidad a cada título.",
  },
  {
    icon: "🎯",
    title: "Sugerencias explicadas",
    copy:
      "Cada recomendación incluye motivos tangibles: qué la conecta con lo que viste, quién actúa, dónde se encuentra y qué vibe transmite.",
  },
  {
    icon: "📺",
    title: "Disponibilidad por plataforma",
    copy:
      "Conoce en qué streaming está cada título y filtra por servicios, idiomas, tiempos de duración o clasificación.",
  },
  {
    icon: "🤝",
    title: "Listas colaborativas",
    copy:
      "Crea watchlists familiares, comparte con amigos y voten por lo próximo. El algoritmo ajusta las recomendaciones a la afinidad del grupo.",
  },
  {
    icon: "⏱️",
    title: "Modo sesión rápida",
    copy:
      "Recibe recomendaciones express basadas en cuánto tiempo tienes y el mood actual. Ideal para decidir en minutos.",
  },
  {
    icon: "🔔",
    title: "Alertas inteligentes",
    copy:
      "Activa notificaciones cuando aparezcan estrenos compatibles con tus gustos o cuando un título salga de la plataforma.",
  },
];

const explainers = [
  {
    badge: "Explora sin límites",
    title: "Panel personalizable para tus listas",
    copy:
      "Organiza favoritos, pendientes y calificados en tableros modulables. Añade etiquetas como 'ver en pareja' o 'fin de semana maratón' para que la IA afine los resultados.",
    bullets: [
      "Visualiza carátulas, sinopsis y trailers in-app.",
      "Filtra por sentimientos que quieres provocar o evitar.",
      "Sincroniza lo que veas en la app móvil con un clic.",
    ],
    media: {
      type: "image",
      src: screenRecs,
      alt: "Panel de listas personalizadas",
      caption: "Watchlists personalizadas",
    },
  },
  {
    badge: "Comprende tus hábitos",
    title: "Insights de tus gustos en tiempo real",
    copy:
      "Descubre qué géneros repites, quiénes son tus directores de cabecera y qué actores aparecen en tus maratones. Puedes ajustar manualmente tus preferencias cuando quieras.",
    bullets: [
      "Gráficos dinámicos con tus puntuaciones y moods.",
      "Recomendaciones de etiquetas para ampliar tu espectro.",
      "Exporta y comparte tus highlights anuales.",
    ],
    media: {
      type: "image",
      src: screenSeen,
      alt: "Dashboard de insights audiovisuales",
      caption: "Insights en tiempo real",
    },
  },
];

useHead({
  title: "Funcionalidades | Recomiéndame",
  meta: [
    {
      name: "description",
      content:
        "Conoce todo lo que Recomiéndame puede hacer por tu experiencia de streaming: IA de afinidad, listas colaborativas, alertas inteligentes y más.",
    },
  ],
});
</script>
