<template>
  <div class="min-h-screen bg-gradient-to-b from-surface-950 via-surface-900 to-surface-950 text-white">
    <div class="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-16">
      <header class="space-y-4 text-center">
        <img :src="brandLogo" alt="Recomiéndame" class="mx-auto h-12 w-auto" />
        <div class="space-y-2">
          <p class="text-xs uppercase tracking-[0.3em] text-white/40">Compartido desde Recomiéndame</p>
          <h1 class="text-3xl font-semibold sm:text-4xl">{{ title }}</h1>
          <p class="text-sm text-white/60">
            La IA de Recomiéndame descubrió esta recomendación especialmente para ti.
          </p>
        </div>
      </header>

      <section class="grid gap-8 lg:grid-cols-[320px_1fr]">
        <div class="overflow-hidden rounded-[32px] border border-white/10 bg-white/5">
          <img :src="posterSrc" :alt="title" class="h-full w-full object-cover" />
        </div>
        <div class="space-y-6">
          <div class="space-y-3">
            <p class="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/40">
              {{ mediaTypeLabel }}
            </p>
            <p v-if="tmdbLink" class="text-sm text-white/60">
              Consulta detalles oficiales en
              <a :href="tmdbLink" target="_blank" rel="noopener" class="text-primary-300 underline decoration-dotted">
                TheMovieDB
              </a>
            </p>
            <p class="text-sm text-white/70">
              Genera tu propio perfil y recibe recomendaciones personalizadas en segundos.
            </p>
          </div>

          <div class="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
            <h2 class="text-lg font-semibold">¿Quieres recomendaciones como esta?</h2>
            <ul class="space-y-2 text-sm text-white/70">
              <li>• Marca lo que ya viste y construye nuevas listas.</li>
              <li>• Guarda favoritos y wishlist sincronizados con la app móvil.</li>
              <li>• La IA aprende de tus gustos para sugerirte lo mejor.</li>
            </ul>
            <NuxtLink
              to="/register"
              class="inline-flex items-center justify-center rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-400"
            >
              Empieza gratis
            </NuxtLink>
            <NuxtLink
              to="/login"
              class="block text-sm font-semibold text-primary-200 underline decoration-dotted"
            >
              ¿Ya tienes cuenta? Inicia sesión
            </NuxtLink>
          </div>
        </div>
      </section>

      <footer class="border-t border-white/10 pt-6 text-center text-xs text-white/50">
        Recomiéndame · Analiza tus gustos y te sugiere películas y series a tu medida.
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import brandLogo from "~/assets/logo.png?url";

const route = useRoute();
const event = process.server ? useRequestEvent() : null;

const computeOrigin = () => {
  if (process.client) {
    return window.location.origin;
  }
  if (!event) return "https://recomiendameapp.cl";
  const headers = event.node.req.headers;
  const forwardedProto = headers["x-forwarded-proto"]?.toString().split(",")[0];
  const forwardedHost = headers["x-forwarded-host"]?.toString().split(",")[0];
  const host = forwardedHost || headers.host || "localhost:3000";
  const protocol =
    forwardedProto ||
    (headers["x-forwarded-ssl"] === "on" ? "https" : event.node.req.connection.encrypted ? "https" : "http");
  return `${protocol}://${host}`;
};

const origin = computeOrigin();

const placeholder =
  "https://placehold.co/600x900/1A0F59/FFFFFF?text=Recomiendame";

const rawTitle = computed(() => (typeof route.query.title === "string" ? route.query.title : ""));
const rawType = computed(() => (typeof route.query.type === "string" ? route.query.type : ""));
const rawPoster = computed(() => (typeof route.query.poster === "string" ? route.query.poster : ""));
const rawTmdbId = computed(() => (typeof route.query.tmdbId === "string" ? route.query.tmdbId : ""));

const title = computed(() => rawTitle.value || "Recomendación de Recomiéndame");
const tmdbLink = computed(() => {
  if (!rawTmdbId.value) return "";
  const type = rawType.value === "tv" ? "tv" : "movie";
  return `https://www.themoviedb.org/${type}/${rawTmdbId.value}`;
});

const mediaTypeLabel = computed(() => {
  if (rawType.value === "tv") return "Serie recomendada";
  if (rawType.value === "movie") return "Película recomendada";
  return "Recomendación personalizada";
});

const posterSrc = computed(() => {
  const poster = rawPoster.value;
  if (!poster) return placeholder;
  try {
    const parsed = new URL(poster, origin);
    if (parsed.hostname === "image.tmdb.org") {
      return `${origin}/api/image-proxy?url=${encodeURIComponent(parsed.toString())}`;
    }
    return parsed.toString();
  } catch {
    return placeholder;
  }
});

const absolutePoster = computed(() => {
  try {
    return new URL(posterSrc.value, origin).toString();
  } catch {
    return placeholder;
  }
});

const canonical = computed(() => `${origin}${route.fullPath}`);

const description = computed(
  () =>
    `${title.value} · Generado por la IA de Recomiéndame. Descubre tus próximas películas y series en recomiendameapp.cl`
);

useHead({
  title: `${title.value} | Recomiéndame`,
  meta: [
    { name: "description", content: description.value },
    { property: "og:title", content: `${title.value} | Recomiéndame` },
    { property: "og:description", content: description.value },
    { property: "og:image", content: absolutePoster.value },
    { property: "og:url", content: canonical.value },
    { property: "og:site_name", content: "Recomiéndame" },
    { property: "twitter:card", content: "summary_large_image" },
    { property: "twitter:title", content: `${title.value} | Recomiéndame` },
    { property: "twitter:description", content: description.value },
    { property: "twitter:image", content: absolutePoster.value },
  ],
  link: [{ rel: "canonical", href: canonical.value }],
});
</script>
