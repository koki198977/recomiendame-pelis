<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="show && item"
        class="fixed inset-0 z-[999] flex items-center justify-center bg-surface-950/90 px-4 py-10 backdrop-blur-md"
        @click.self="handleClose"
        @keydown.esc="handleClose"
        tabindex="-1"
      >
        <div class="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-surface-900 shadow-strong max-h-[92vh]">
          <button
            class="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
            type="button"
            @click="handleClose"
            aria-label="Cerrar compartir"
          >
            ✕
          </button>
          <div class="flex-1 overflow-y-auto">
            <div class="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(260px,320px)_minmax(0,1fr)]">
              <div class="space-y-4">
                <div class="relative">
                  <div
                    class="share-preview aspect-[4/5] w-full overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-surface-800/80 via-surface-900 to-surface-950 shadow-xl"
                  >
                    <Transition name="fade">
                      <img
                        v-if="sharePreviewUrl"
                        :key="sharePreviewUrl"
                        :src="sharePreviewUrl"
                        :alt="`Arte social de ${item.title}`"
                        class="h-full w-full object-cover"
                      />
                      <div
                        v-else
                        class="flex h-full w-full flex-col items-center justify-center gap-3 text-center text-white/50"
                      >
                        <span
                          class="inline-flex h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white/70"
                          aria-hidden="true"
                        />
                        <p class="text-sm font-semibold uppercase tracking-[0.3em]">
                          Generando arte
                        </p>
                        <p class="max-w-[220px] text-xs text-white/40">
                          Preparando una tarjeta para compartir con tus contactos…
                        </p>
                      </div>
                    </Transition>
                  </div>
                  <div class="mt-3 flex items-center gap-3">
                    <button
                      class="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-400 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30"
                      :disabled="!sharePreviewUrl || isGeneratingPreview"
                      @click.stop="downloadShareImage"
                    >
                      ⬇️ Guardar imagen
                    </button>
                    <button
                      v-if="sharePreviewUrl"
                      class="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                      type="button"
                      title="Copiar imagen al portapapeles"
                      @click.stop="copyImage"
                    >
                      🖼️
                    </button>
                  </div>
                  <p class="text-xs text-white/40">
                    Usa la tarjeta para historias o publicaciones. El formato es 1080×1350px con
                    branding de Recomiéndame.
                  </p>
                </div>
                <p v-if="shareError" class="text-xs font-semibold text-red-300">
                  {{ shareError }}
                </p>
              </div>
              <div class="space-y-5">
                <div class="space-y-2">
                  <span class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                    {{ item.mediaType === "tv" ? "Serie" : "Película" }} · Recomiéndame
                  </span>
                  <h3 class="text-2xl font-semibold text-white">
                    {{ item.title }}
                  </h3>
                  <p v-if="item.reason" class="text-xs uppercase tracking-[0.3em] text-white/40">
                    {{ item.reason }}
                  </p>
                  <p v-if="item.overview" class="text-sm text-white/70 leading-relaxed line-clamp-4">
                    {{ item.overview }}
                  </p>
                </div>

                <div class="flex flex-col gap-2 sm:grid sm:grid-cols-2 sm:gap-3">
                  <button
                    v-if="canUseShare"
                    class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-400 sm:col-span-2"
                    @click="nativeShare"
                  >
                    📲 Compartir desde este dispositivo
                  </button>
                  <button
                    class="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                    @click="shareInstagram"
                  >
                    <img src="/social/share-instagram.svg" alt="Instagram" class="h-4 w-4" />
                    Instagram
                  </button>
                  <button
                    class="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                    @click="shareWhatsapp"
                  >
                    <img src="/social/whatsapp.svg" alt="WhatsApp" class="h-4 w-4" />
                    WhatsApp
                  </button>
                  <button
                    class="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                    @click="shareFacebook"
                  >
                    <img src="/social/facebook.svg" alt="Facebook" class="h-4 w-4" />
                    Facebook
                  </button>
                  <button
                    class="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                    @click="shareTwitter"
                  >
                    🐦 X / Twitter
                  </button>
                  <button
                    class="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10 sm:col-span-2"
                    @click="copyLink"
                  >
                    📋 Copiar enlace
                  </button>
                </div>

                <p v-if="feedbackMessage" class="text-xs text-primary-200">
                  {{ feedbackMessage }}
                </p>

                <div class="rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-white/60">
                  <p class="font-semibold uppercase tracking-[0.3em] text-white/40">Mensaje sugerido</p>
                  <p class="mt-2 whitespace-pre-line break-words text-white/70">
                    {{ shareMessage }}
                  </p>
                  <p class="mt-2 text-[11px] text-white/40">
                  Generado por Recomiéndame · <span class="break-all text-primary-200">{{ shareLandingUrlDisplay }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="border-t border-white/10 bg-surface-900/80 px-6 pb-6 pt-4 sm:px-8">
            <button
              type="button"
              class="w-full rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
              @click="handleClose"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import brandLogo from "~/assets/logo.png?url";

const props = defineProps<{
  item: {
    title: string;
    overview?: string;
    posterUrl?: string;
    reason?: string;
    mediaType?: string;
    tmdbId?: number;
  } | null;
  show: boolean;
  shareUrl?: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const placeholderImage =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgNjAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMWEwZjU5Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMmIyMDZkIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9InVybCgjZykiLz48ZWxsaXBzZSBjeD0iMzIwIiBjeT0iODAiIHJ4PSIxMjAiIHJ5PSIxMjAiIGZpbGw9InJnYmEoMTY4LDg1LDI0NywwLjI1KSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTUlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI0MiIgZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC44OCI+UmVjb21pZW5kYW1lPC90ZXh0Pjx0ZXh0IHg9IjUwJSIgeT0iNjUlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyMCIgZmlsbD0iI2MwODRmYyIgb3BhY2l0eT0iMC43OCI+VHVzIHByb3hpbWFzIGhpc3RvcmlhczwvdGV4dD48L3N2Zz4=";

const feedbackMessage = ref("");
const sharePreviewUrl = ref<string | null>(null);
const isGeneratingPreview = ref(false);
const shareError = ref("");
const generatedObjectUrls: string[] = [];

const siteOrigin = computed(() =>
  typeof window !== "undefined" ? window.location.origin : "https://recomiendameapp.cl"
);

const TMDB_HOSTS = ["image.tmdb.org"];

const resolvePosterSource = (src?: string | null) => {
  if (!src) return placeholderImage;
  if (src.startsWith("data:")) return src;
  try {
    const parsed = new URL(
      src,
      typeof window !== "undefined" ? window.location.origin : "https://recomiendameapp.cl"
    );
    if (TMDB_HOSTS.includes(parsed.hostname)) {
      return `/api/image-proxy?url=${encodeURIComponent(parsed.toString())}`;
    }
    return parsed.toString();
  } catch {
    return src;
  }
};

const tmdbUrl = computed(() => {
  if (props.item?.tmdbId && props.item?.mediaType) {
    return `https://www.themoviedb.org/${props.item.mediaType === "tv" ? "tv" : "movie"}/${props.item.tmdbId}`;
  }
  return "";
});

const shareUrl = computed(() => props.shareUrl || siteOrigin.value);

const shareLandingUrl = computed(() => {
  if (!props.item) return shareUrl.value;
  const params = new URLSearchParams({
    title: props.item.title || "",
    type: props.item.mediaType || "",
    tmdbId: props.item.tmdbId?.toString() || "",
    poster: props.item.posterUrl || "",
  });
  return `${siteOrigin.value}/share?${params.toString()}`;
});

const shareMessage = computed(() => {
  const strongPitch = `Recomiéndame me sugirió "${props.item?.title}"`;
  const tmdbReference = tmdbUrl.value ? `\nMira los detalles en TMDB: ${tmdbUrl.value}` : "";
  return `${strongPitch}.\nDescubre tus próximas películas y series en ${siteOrigin.value}.\nExplora esta recomendación: ${shareLandingUrl.value}${tmdbReference}`;
});

const shareLandingUrlDisplay = computed(() => {
  try {
    const parsed = new URL(shareLandingUrl.value);
    return `${parsed.host}${parsed.pathname}`;
  } catch {
    return shareLandingUrl.value;
  }
});

const canUseShare = computed(() => typeof navigator !== "undefined" && !!navigator.share);

watch(
  () => [props.show, props.item?.tmdbId],
  async ([show]) => {
    if (!process.client) return;
    if (show && props.item) {
      await nextTick();
      await ensureShareImage();
    } else {
      resetPreview();
    }
  },
  { immediate: true }
);

const handleClose = () => {
  feedbackMessage.value = "";
  resetPreview();
  emit("close");
};

const openWindow = (url: string) => {
  if (!process.client) return;
  window.open(url, "_blank", "noopener,noreferrer");
  feedbackMessage.value = "Abriendo la app seleccionada…";
};

const shareWhatsapp = () => {
  const url = `https://wa.me/?text=${encodeURIComponent(shareMessage.value)}`;
  openWindow(url);
};

const shareFacebook = async () => {
  const shareLink = shareLandingUrl.value;

  try {
    await navigator.clipboard.writeText(shareMessage.value);
    feedbackMessage.value = "Copiamos el mensaje. Pégalo en la ventana de Facebook.";
  } catch {
    feedbackMessage.value = "Abrimos Facebook; recuerda mencionar Recomiéndame en tu mensaje.";
  }

  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}&quote=${encodeURIComponent(shareMessage.value)}`;
  openWindow(url);
};

const shareTwitter = () => {
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage.value)}&url=${encodeURIComponent(shareLandingUrl.value)}`;
  openWindow(url);
};

const copyLink = async () => {
  if (!process.client) return;
  try {
    await navigator.clipboard.writeText(shareMessage.value);
    feedbackMessage.value = "Mensaje y enlace copiados al portapapeles.";
  } catch {
    feedbackMessage.value = "No pudimos copiar el enlace automáticamente.";
  }
};

const nativeShare = async () => {
  if (!process.client || !navigator.share) return;
  try {
    let didShareImage = false;
    const imageUrl = await ensureShareImage();
    if (imageUrl && navigator.canShare && typeof File !== "undefined") {
      const blob = await (await fetch(imageUrl)).blob();
      const file = new File([blob], `${slugify(props.item?.title ?? "recomendacion")}.png`, {
        type: blob.type,
      });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Recomiéndame: ${props.item?.title}`,
          text: shareMessage.value,
        });
        didShareImage = true;
      }
    }

    if (!didShareImage) {
      await navigator.share({
        title: `Recomiéndame: ${props.item?.title}`,
        text: shareMessage.value,
        url: shareLandingUrl.value,
      });
    }
    handleClose();
  } catch (error: any) {
    if (error?.name === "AbortError") return;
    copyLink();
  }
};

const ensureShareImage = async () => {
  if (!props.item || !process.client) return null;
  if (sharePreviewUrl.value || isGeneratingPreview.value) {
    return sharePreviewUrl.value;
  }
  await generateShareImage(props.item);
  return sharePreviewUrl.value;
};

function resetPreview() {
  sharePreviewUrl.value = null;
  isGeneratingPreview.value = false;
  shareError.value = "";
  generatedObjectUrls.splice(0).forEach((url) => URL.revokeObjectURL(url));
}

const downloadShareImage = async () => {
  if (!process.client || !props.item) return;
  const imageUrl = await ensureShareImage();
  if (!imageUrl) {
    feedbackMessage.value = "No pudimos preparar la imagen para descargar.";
    return;
  }
  const link = document.createElement("a");
  link.href = imageUrl;
  link.download = `recomiendame-${slugify(props.item.title)}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  feedbackMessage.value = "Imagen descargada. ¡Compártela en tus redes!";
};

const copyImage = async () => {
  if (!process.client || typeof ClipboardItem === "undefined") {
    feedbackMessage.value = "Tu navegador no permite copiar imágenes automáticamente.";
    return;
  }
  try {
    const imageUrl = await ensureShareImage();
    if (!imageUrl) {
      feedbackMessage.value = "No hay imagen disponible para copiar.";
      return;
    }
    const blob = await (await fetch(imageUrl)).blob();
    await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareMessage.value);
    }
    feedbackMessage.value = "Imagen copiada. También pegamos el mensaje recomendado.";
  } catch {
    feedbackMessage.value = "No pudimos copiar la imagen automáticamente.";
  }
};

const shareInstagram = async () => {
  if (!process.client) return;
  const imageUrl = await ensureShareImage();
  if (!imageUrl) {
    feedbackMessage.value = "No hay imagen disponible para compartir.";
    return;
  }

  if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
    try {
      const blob = await (await fetch(imageUrl)).blob();
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareMessage.value);
      }
      if (process.client) {
        window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
      }
      feedbackMessage.value =
        "Imagen y texto copiados. Abre Instagram y pégalos en tus historias o publicaciones.";
      return;
    } catch (error) {
      console.warn("No se pudo copiar la imagen para Instagram:", error);
    }
  }

  await downloadShareImage();
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(shareMessage.value);
  }
  feedbackMessage.value =
    "Descargamos la imagen y copiamos el texto. Súbela en Instagram y pega el mensaje.";
};

const generateShareImage = async (item: NonNullable<typeof props.item>) => {
  if (!process.client) return;
  isGeneratingPreview.value = true;
  shareError.value = "";
  try {
    const width = 1080;
    const height = 1350;
    const margin = 80;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("No se pudo crear el contexto del canvas.");

    // Fondo principal
    const gradient = context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#140836");
    gradient.addColorStop(0.4, "#1b0f3f");
    gradient.addColorStop(1, "#0f0b2d");
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    // Textura sutil
    context.fillStyle = "rgba(255, 255, 255, 0.02)";
    for (let i = 0; i < 120; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 4 + 1;
      context.beginPath();
      context.arc(x, y, size, 0, Math.PI * 2);
      context.fill();
    }

    let poster: HTMLImageElement;
    const source = resolvePosterSource(item.posterUrl);
    try {
      poster = await loadImage(source);
    } catch (posterError) {
      console.warn("Fallo al cargar poster remoto, usando placeholder:", posterError);
      poster = await loadImage(placeholderImage);
    }
    const posterAreaWidth = width - margin * 2;
    const posterAreaHeight = height * 0.58;
    let posterWidth = posterAreaWidth;
    let posterHeight = (poster.height / poster.width) * posterWidth;

    if (posterHeight > posterAreaHeight) {
      posterHeight = posterAreaHeight;
      posterWidth = (poster.width / poster.height) * posterHeight;
    }

    const posterX = (width - posterWidth) / 2;
    const posterY = margin + 40;

    // Marco del poster con sombra
    context.save();
    context.shadowColor = "rgba(0, 0, 0, 0.45)";
    context.shadowBlur = 60;
    context.shadowOffsetY = 24;
    drawRoundedRect(context, posterX, posterY, posterWidth, posterHeight, 48);
    context.clip();
    context.drawImage(poster, posterX, posterY, posterWidth, posterHeight);
    context.restore();

    // Cinta degradada
    const ribbonY = posterY + posterHeight - 120;
    const ribbonGradient = context.createLinearGradient(0, ribbonY, width, ribbonY + 240);
    ribbonGradient.addColorStop(0, "rgba(168, 85, 247, 0.0)");
    ribbonGradient.addColorStop(0.5, "rgba(168, 85, 247, 0.3)");
    ribbonGradient.addColorStop(1, "rgba(236, 72, 153, 0.2)");
    context.fillStyle = ribbonGradient;
    drawRoundedRect(context, margin, ribbonY, width - margin * 2, 220, 32);
    context.fill();

    // Encabezado
    context.fillStyle = "rgba(255, 255, 255, 0.08)";
    drawRoundedRect(context, margin, margin, 380, 88, 44);
    context.fill();

    context.fillStyle = "#FFFFFF";
    context.font = "bold 42px 'Helvetica', 'Arial', sans-serif";
    context.fillText("Recomiéndame", margin + 32, margin + 58);

    const logo = await loadImage(brandLogo);
    const logoSize = 72;
    context.drawImage(logo, width - margin - logoSize, margin - 6, logoSize, logoSize);

    const textAreaX = margin;
    let textCursorY = posterY + posterHeight + 80;
    const textAreaWidth = width - margin * 2;

    context.fillStyle = "#A855F7";
    context.font = "600 32px 'Helvetica', 'Arial', sans-serif";
    context.fillText("Tu recomendación personalizada", textAreaX, textCursorY);
    textCursorY += 60;

    context.fillStyle = "#FFFFFF";
    context.font = "bold 78px 'Helvetica', 'Arial', sans-serif";
    textCursorY = drawWrappedText(context, item.title, textAreaX, textCursorY, textAreaWidth, 86, 3);
    textCursorY += 30;

    if (item.reason) {
      context.fillStyle = "rgba(255, 255, 255, 0.6)";
      context.font = "600 32px 'Helvetica', 'Arial', sans-serif";
      textCursorY = drawWrappedText(context, item.reason, textAreaX, textCursorY, textAreaWidth, 48, 1);
      textCursorY += 20;
    }

    if (item.voteAverage) {
      drawRatingBadge(context, textAreaX, textCursorY, item.voteAverage);
      textCursorY += 90;
    }

    if (item.releaseDate) {
      context.fillStyle = "rgba(255, 255, 255, 0.6)";
      context.font = "600 32px 'Helvetica', 'Arial', sans-serif";
      context.fillText(`Estreno ${formatDate(item.releaseDate)}`, textAreaX, textCursorY);
      textCursorY += 56;
    }

    if (item.platforms?.length) {
      context.fillStyle = "rgba(255, 255, 255, 0.75)";
      context.font = "500 30px 'Helvetica', 'Arial', sans-serif";
      const platforms = formatPlatforms(item.platforms);
      textCursorY = drawWrappedText(context, platforms, textAreaX, textCursorY, textAreaWidth, 44, 2);
      textCursorY += 28;
    }

    const baseLine = height - margin;
    context.fillStyle = "rgba(255, 255, 255, 0.5)";
    context.font = "500 28px 'Helvetica', 'Arial', sans-serif";
    context.fillText("Generado por Recomiéndame · recomiendameapp.cl", textAreaX, baseLine);

    sharePreviewUrl.value = canvas.toDataURL("image/png", 0.92);
  } catch (error) {
    shareError.value =
      "No pudimos generar la imagen personalizada. Usa los botones de compartir directo o descarga el póster manualmente.";
    console.error("No se pudo generar la imagen para compartir:", error);
  } finally {
    isGeneratingPreview.value = false;
  }
};

const drawRoundedRect = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) => {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.lineTo(x + width - r, y);
  context.quadraticCurveTo(x + width, y, x + width, y + r);
  context.lineTo(x + width, y + height - r);
  context.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  context.lineTo(x + r, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - r);
  context.lineTo(x, y + r);
  context.quadraticCurveTo(x, y, x + r, y);
  context.closePath();
};

const drawWrappedText = (
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 4
) => {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (let i = 0; i < words.length; i += 1) {
    const word = words[i];
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (context.measureText(testLine).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }

  let linesToRender = lines;
  if (lines.length > maxLines) {
    linesToRender = lines.slice(0, maxLines);
    const lastIndex = linesToRender.length - 1;
    linesToRender[lastIndex] = `${linesToRender[lastIndex].replace(/\s+$/, "")}…`;
  }

  linesToRender.forEach((line) => {
    context.fillText(line, x, y);
    y += lineHeight;
  });

  return y;
};

const drawRatingBadge = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  voteAverage: number
) => {
  const width = 260;
  const height = 66;
  drawRoundedRect(context, x, y - 48, width, height, 28);
  context.fillStyle = "rgba(255, 255, 255, 0.1)";
  context.fill();

  context.fillStyle = "#01D277";
  context.beginPath();
  context.arc(x + 42, y - 14, 18, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "#052D1D";
  context.beginPath();
  context.arc(x + 42, y - 14, 14, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "#01D277";
  context.font = "bold 20px 'Helvetica', 'Arial', sans-serif";
  context.fillText("TMDB", x + 74, y - 18);

  context.fillStyle = "#FFFFFF";
  context.font = "600 28px 'Helvetica', 'Arial', sans-serif";
  context.fillText(`${voteAverage.toFixed(1)}/10`, x + 74, y + 12);
};

const loadImage = (src: string) =>
  createImage(src).catch(async (originalError) => {
    if (!process.client) throw originalError;
    try {
      const response = await fetch(src, {
        mode: "cors",
        referrerPolicy: "no-referrer",
      });
      if (!response.ok) {
        throw new Error(`Respuesta inválida (${response.status})`);
      }
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      generatedObjectUrls.push(objectUrl);
      return await createImage(objectUrl);
    } catch (error) {
      console.error("No se pudo cargar la imagen remota:", error);
      throw originalError;
    }
  });

const createImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.referrerPolicy = "no-referrer";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`No se pudo cargar la imagen: ${src}`));
    img.src = src;
  });

const formatPlatforms = (platforms: string[]) => {
  if (platforms.length <= 3) return platforms.join(" · ");
  return `${platforms.slice(0, 3).join(" · ")} · +${platforms.length - 3}`;
};

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

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
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
