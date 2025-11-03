<template>
  <div class="relative overflow-hidden">
    <!-- Loading state para usuarios logueados -->
    <div v-if="isCheckingAuth" class="min-h-screen bg-surface-950 flex items-center justify-center">
      <div class="text-center space-y-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
        <p class="text-white/70 text-sm">Verificando sesión...</p>
      </div>
    </div>
    
    <!-- Contenido principal -->
    <div v-else>
    <!-- Hero Section -->
    <section class="relative isolate">
      <div
        class="absolute inset-0 -z-10 bg-gradient-to-br from-surface-950 via-surface-900 to-surface-800"
      ></div>
      <div
        class="absolute inset-0 -z-10 bg-gradient-to-tr from-primary-500/20 via-transparent to-secondary-500/30 blur-3xl"
      ></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div class="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div class="space-y-6 lg:col-span-6 lg:space-y-8">
            <span
              class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white/70"
            >
              <span class="text-lg leading-none">🔮</span> IA que entiende tus
              gustos
            </span>
            <h1 class="text-3xl sm:text-5xl lg:text-6xl font-semibold leading-tight">
              Recomiéndame analiza lo que viste y te sugiere qué ver después
            </h1>
            <p class="text-base text-white/70 sm:text-lg lg:text-xl max-w-xl">
              Marca lo que ya disfrutaste, guarda tus favoritos y construye una
              watchlist dinámica. Nuestra IA aprende de tus géneros, ritmos y
              moods para entregar recomendaciones explicadas en segundos.
            </p>
            <div class="stack-mobile sm:flex-row">
              <NuxtLink to="/login" class="btn-primary inline-flex items-center gap-2">
                <span>Inicia sesión</span>
                <span aria-hidden="true">→</span>
              </NuxtLink>
              <NuxtLink to="/download" class="btn-secondary inline-flex items-center gap-2">
                <span>Descarga las apps</span>
              </NuxtLink>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div class="card py-4 px-5">
                <p class="text-sm text-white/60 uppercase tracking-wider">Catálogo</p>
                <p class="mt-2 text-2xl font-semibold">+15K títulos</p>
                <p class="mt-1 text-xs text-white/60">
                  Integrados desde tus plataformas favoritas.
                </p>
              </div>
              <div class="card py-4 px-5">
                <p class="text-sm text-white/60 uppercase tracking-wider">Personalización</p>
                <p class="mt-2 text-2xl font-semibold">Precisión 92%</p>
                <p class="mt-1 text-xs text-white/60">
                  Aprendiendo de tus calificaciones reales.
                </p>
              </div>
              <div class="card py-4 px-5">
                <p class="text-sm text-white/60 uppercase tracking-wider">Multiplataforma</p>
                <p class="mt-2 text-2xl font-semibold">Web · iOS · Android</p>
                <p class="mt-1 text-xs text-white/60">Continúa desde donde dejaste.</p>
              </div>
            </div>
          </div>
          <div class="lg:col-span-6">
            <div
              class="relative mx-auto max-w-xl rounded-[2rem] border border-white/10 bg-surface-900/80 p-5 shadow-strong sm:rounded-[2.5rem] sm:p-8"
            >
              <div
                class="absolute -top-12 -left-10 h-32 w-32 rounded-full bg-secondary-500/40 blur-2xl"
              ></div>
              <div
                class="absolute -bottom-14 -right-10 h-40 w-40 rounded-full bg-primary-500/40 blur-2xl"
              ></div>
              <div class="relative space-y-6">
                <div class="rounded-3xl bg-surface-800 p-6 border border-white/5">
                  <p class="text-sm text-white/60 uppercase tracking-[0.3em]">
                    Generar recomendaciones
                  </p>
                  <p class="mt-4 text-lg text-white/80">
                    Cuéntanos qué te gustaría ver hoy...
                  </p>
                  <div
                    class="mt-4 rounded-2xl bg-white/5 p-4 flex items-center gap-3 border border-white/10"
                  >
                    <span class="text-xl">🎬</span>
                    <input
                      class="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                      placeholder="Ej. Ciencia ficción que combine misterio y humor ácido"
                      disabled
                    />
                    <button
                      class="rounded-full bg-primary-500 px-4 py-2 text-xs font-semibold uppercase tracking-widest"
                      disabled
                    >
                      IA
                    </button>
                  </div>
                </div>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <RecommendationCard
                    v-for="item in sampleRecommendations"
                    :key="item.title"
                    :item="item"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Value Proposition -->
    <section class="relative border-t border-white/5 bg-surface-950 py-24">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-3 gap-10">
          <div
            v-for="pill in valuePillars"
            :key="pill.title"
            class="card h-full"
          >
            <div
              class="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl"
            >
              {{ pill.icon }}
            </div>
            <h3 class="text-xl font-semibold">{{ pill.title }}</h3>
            <p class="mt-3 text-sm text-white/70 leading-relaxed">
              {{ pill.copy }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Highlights -->
    <section class="relative bg-surface-900 py-24">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div class="max-w-3xl space-y-4">
            <span class="text-xs uppercase tracking-[0.4em] text-white/50"
              >Lo que hace única a Recomiéndame</span
            >
            <h2 class="text-3xl sm:text-4xl font-semibold leading-tight">
              Funciones pensadas para decidir qué ver sin perder tiempo
            </h2>
            <p class="text-sm text-white/70 leading-relaxed">
              Nuestra IA cruza tu historial, plataformas disponibles y gustos personales para
              darte listas accionables en segundos.
            </p>
          </div>
          <NuxtLink
            to="/features"
            class="btn-secondary inline-flex items-center gap-2 self-start md:self-center"
          >
            Ver más funcionalidades
            <span aria-hidden="true">→</span>
          </NuxtLink>
        </div>
        <div class="mt-12 grid gap-8 md:grid-cols-3">
          <article
            v-for="highlight in featureHighlights"
            :key="highlight.title"
            class="card h-full"
          >
            <div
              class="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-2xl"
            >
              {{ highlight.icon }}
            </div>
            <h3 class="text-xl font-semibold">{{ highlight.title }}</h3>
            <p class="mt-3 text-sm text-white/70 leading-relaxed">
              {{ highlight.copy }}
            </p>
          </article>
        </div>
      </div>
    </section>

    <!-- Cross Platform -->
    <section class="relative border-t border-white/5 bg-surface-950 py-24">
      <div
        class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-16 lg:grid-cols-2 items-center"
      >
        <div class="space-y-6">
          <span
            class="inline-flex items-center gap-2 text-accent-200 text-sm font-semibold uppercase tracking-[0.3em]"
          >
            Siempre sincronizado
          </span>
          <h2 class="text-3xl sm:text-4xl font-semibold leading-tight">
            Tu experiencia fluye entre la web y la app móvil
          </h2>
          <p class="text-white/70 text-lg leading-relaxed">
            Guarda pendientes desde tu computador y continúa en tu teléfono. Las
            evaluaciones, favoritos y listas compartidas se actualizan en tiempo
            real.
          </p>
          <ul class="space-y-3 text-sm text-white/70">
            <li class="flex items-start gap-3">
              <span class="mt-1 text-primary-300">✓</span>
              <span>Login seguro con correo, Apple o Google.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="mt-1 text-primary-300">✓</span>
              <span>Modo offline para consultar tu watchlist sin conexión.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="mt-1 text-primary-300">✓</span>
              <span
                >Notificaciones inteligentes con estrenos que coinciden con tus
                gustos.</span
              >
            </li>
          </ul>
          <div class="flex flex-col sm:flex-row gap-4 pt-4">
            <NuxtLink to="/login" class="btn-primary inline-flex items-center gap-2">
              <span>Probar ahora en web</span>
            </NuxtLink>
            <NuxtLink
              to="/download"
              class="btn-secondary inline-flex items-center gap-2"
            >
              <span>Recibir enlace de descarga</span>
            </NuxtLink>
          </div>
        </div>
        <div class="relative">
          <div
            class="absolute inset-0 -z-10 bg-gradient-to-tr from-secondary-500/30 via-transparent to-primary-500/20 blur-2xl"
          ></div>
          <div class="grid gap-6 justify-items-center">
            <figure class="phone" aria-label="Recomendaciones personalizadas en la app">
              <div class="bezel">
                <img
                  :src="screenRecs"
                  alt="Vista de recomendaciones en la app móvil"
                  class="screen"
                  loading="lazy"
                />
              </div>
            </figure>
            <div class="grid grid-cols-1 gap-6 justify-items-center sm:grid-cols-2">
              <figure
                class="phone phone--compact"
                aria-label="Detalle explicativo de una recomendación"
              >
                <div class="bezel">
                  <img
                    :src="screenRecsDetail"
                    alt="Detalle de una recomendación con etiquetas"
                    class="screen"
                    loading="lazy"
                  />
                </div>
              </figure>
              <figure
                class="phone phone--compact"
                aria-label="Gestión de lista de vistos y favoritos"
              >
                <div class="bezel">
                  <img
                    :src="screenSeen"
                    alt="Listado de títulos vistos y favoritos"
                    class="screen"
                    loading="lazy"
                  />
                </div>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section
      class="relative bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-600 py-24"
    >
      <div
        class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white space-y-6"
      >
        <h2 class="text-3xl sm:text-4xl font-semibold leading-tight">
          Empieza a recibir recomendaciones personalizadas hoy mismo
        </h2>
        <p class="text-lg text-white/80">
          Crea tu cuenta, marca lo que ya viste y deja que Recomiéndame encuentre
          tu próxima obsesión.
        </p>
        <div
          class="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <NuxtLink
            to="/login"
            class="inline-flex items-center gap-2 rounded-full bg-surface-950 px-6 py-3 text-sm font-semibold shadow-soft hover:bg-surface-900 transition"
          >
            Iniciar sesión
          </NuxtLink>
          <NuxtLink
            to="/download"
            class="inline-flex items-center gap-2 rounded-full bg-white/20 px-6 py-3 text-sm font-semibold backdrop-blur hover:bg-white/30 transition"
          >
            Descargar apps móviles
          </NuxtLink>
        </div>
      </div>
    </section>
    </div> <!-- Cierre del contenido principal -->
  </div>
</template>

<script setup>
import screenRecs from "~/assets/screens/recs.jpg?url";
import screenRecsDetail from "~/assets/screens/recs2.jpg?url";
import screenSeen from "~/assets/screens/seen.jpg?url";

const isCheckingAuth = ref(true);

const sampleRecommendations = [
  {
    title: "Dune",
    type: "Película · 2021",
    description:
      "Ópera espacial de ritmo contemplativo. Ideal si te atrapó Blade Runner 2049.",
    status: ["Visto", "Favorito"],
    cover:
      "https://image.tmdb.org/t/p/w300_and_h450_bestv2/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
  },
  {
    title: "The Witcher",
    type: "Serie · 3 temporadas",
    description:
      "Fantasía oscura con héroes imperfectos. Combina mundos complejos y batallas épicas.",
    status: ["En deseos", "No me interesa"],
    cover:
      "https://image.tmdb.org/t/p/w300_and_h450_bestv2/7vjaCdMw15FEbXyLQTVa04URsPm.jpg",
  },
  {
    title: "Interstellar",
    type: "Película · 2014",
    description:
      "Ciencia ficción emotiva con viajes temporales. Score inolvidable de Hans Zimmer.",
    status: ["Visto", "Favorito"],
    cover:
      "https://image.tmdb.org/t/p/w300_and_h450_bestv2/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
  },
  {
    title: "The Mandalorian",
    type: "Serie · 4 temporadas",
    description:
      "Western galáctico ágil con episodios autoconclusivos. Perfecta para maratones cortas.",
    status: ["Pendiente"],
    cover:
      "https://image.tmdb.org/t/p/w300_and_h450_bestv2/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg",
  },
];

const valuePillars = [
  {
    title: "Entiende tus moods",
    copy:
      "Selecciona etiquetas emocionales y contextos (maratón, ver en pareja, comfort movie) para que la IA ajuste el tono y ritmo de cada recomendación.",
    icon: "🧠",
  },
  {
    title: "Listas vivas y colaborativas",
    copy:
      "Comparte watchlists con tus amigos, voten en conjunto y reciban sugerencias que maximicen el gusto colectivo.",
    icon: "🎬",
  },
  {
    title: "Explicaciones claras",
    copy:
      "Cada sugerencia viene acompañada de motivos concretos: coincidencia de géneros, directores clave, vibes similares y puntuación de afinidad.",
    icon: "✨",
  },
];

const featureHighlights = [
  {
    icon: "🧠",
    title: "IA afinada a tus gustos",
    copy:
      "Analizamos tus calificaciones, directores favoritos y géneros recurrentes para entregarte recomendaciones con motivos claros.",
  },
  {
    icon: "🎯",
    title: "Listas accionables al instante",
    copy:
      "Guarda favoritos, wishlist y vistos en un tablero compartido entre la web y la app con sincronización automática.",
  },
  {
    icon: "🔔",
    title: "Alertas según tus plataformas",
    copy:
      "Recibe avisos cuando un estreno cae en tu afinidad o está por salir de la plataforma que prefieres.",
  },
];

// Redireccionar a dashboard si el usuario está logueado
onMounted(() => {
  if (process.client) {
    // Esperar un poco para que se complete la hidratación
    setTimeout(() => {
      const token = localStorage.getItem("recomiendame_token");
      if (token) {
        navigateTo("/dashboard");
      } else {
        // Si no hay token, mostrar el contenido
        isCheckingAuth.value = false;
      }
    }, 300);
  }
});

useHead({
  title: "Recomiéndame | IA que encuentra tu próxima película o serie favorita",
  meta: [
    {
      name: "description",
      content:
        "Recomiéndame analiza lo que viste, aprende de tus calificaciones y te sugiere películas y series a tu medida. Disponible en web, Android e iOS.",
    },
  ],
});
</script>
