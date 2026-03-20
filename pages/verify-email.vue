<template>
  <div class="bg-surface-950 min-h-screen flex items-center justify-center px-4 py-16">
    <div class="w-full max-w-md space-y-6 text-white">
      <div class="text-center space-y-3">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary-500/80 text-2xl shadow-soft">
          📧
        </div>
        <h1 class="text-3xl font-semibold">Verificar correo</h1>
        <p class="text-sm text-white/60">
          Confirma tu dirección y activa todas las funciones de Recomiéndame.
        </p>
      </div>

      <div class="card space-y-6">
        <div v-if="status === 'verifying'" class="flex flex-col items-center gap-4 text-center">
          <svg class="h-10 w-10 animate-spin text-primary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.38 0 0 5.38 0 12h4zm2 5.29A7.96 7.96 0 014 12H0c0 3.04 1.14 5.82 3 7.94l3-2.65z"></path>
          </svg>
          <p class="text-white/70">Verificando tu email…</p>
        </div>

        <div v-else-if="status === 'success'" class="space-y-4 text-center">
          <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-500/10 text-2xl text-primary-200">
            ✅
          </div>
          <h2 class="text-xl font-semibold">¡Listo, correo confirmado!</h2>
          <p class="text-sm text-white/70">
            Ya puedes iniciar sesión y sincronizar tus recomendaciones en cualquier dispositivo.
          </p>

          <!-- CTA principal: abrir app -->
          <button
            class="btn-primary inline-flex w-full justify-center"
            @click="openApp"
          >
            📱 Abrir en la app
          </button>

          <!-- Links de tiendas si la app no está instalada -->
          <transition name="fade">
            <div v-if="showStoreLinks" class="space-y-3 pt-1">
              <p class="text-xs text-white/50">¿No tienes la app? Descárgala aquí:</p>
              <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="https://apps.apple.com/us/app/recomi%C3%A9ndame/id6760411789"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  App Store
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=cl.recomiendame.app"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  Google Play
                </a>
              </div>
            </div>
          </transition>

          <!-- Opción secundaria: web -->
          <NuxtLink to="/login" class="block text-xs text-white/40 hover:text-white/70 transition pt-1">
            Continuar en la web →
          </NuxtLink>
        </div>

        <div v-else-if="status === 'error'" class="space-y-4 text-center">
          <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-2xl text-red-300">
            ❌
          </div>
          <h2 class="text-xl font-semibold text-red-100">No pudimos validar tu enlace</h2>
          <p class="text-sm text-white/70">
            {{ errorMessage || "El enlace de verificación no es válido o ya expiró." }}
          </p>
          <button
            class="btn-secondary inline-flex w-full justify-center"
            :disabled="resending"
            @click="resendVerification"
          >
            <span v-if="resending" class="flex items-center gap-2">
              <svg class="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.38 0 0 5.38 0 12h4zm2 5.29A7.96 7.96 0 014 12H0c0 3.04 1.14 5.82 3 7.94l3-2.65z"></path>
              </svg>
              Enviando…
            </span>
            <span v-else>Reenviar verificación</span>
          </button>
        </div>

        <div v-else class="space-y-4">
          <p class="text-sm text-white/70 text-center">
            Revisa tu bandeja de entrada y haz clic en el enlace de verificación. Si no lo encuentras, intenta reenviarlo.
          </p>
          <div class="space-y-3">
            <label class="text-xs font-semibold uppercase tracking-[0.3em] text-white/50" for="email">
              Reenviar a
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="tu@email.com"
              class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
            />
            <button
              class="btn-secondary inline-flex w-full justify-center"
              :disabled="!email || resending"
              @click="resendVerification"
            >
              <span v-if="resending" class="flex items-center gap-2">
                <svg class="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.38 0 0 5.38 0 12h4zm2 5.29A7.96 7.96 0 014 12H0c0 3.04 1.14 5.82 3 7.94l3-2.65z"></path>
                </svg>
                Enviando…
              </span>
              <span v-else>Enviar nuevo enlace</span>
            </button>
          </div>
        </div>

        <div v-if="resendSuccess" class="rounded-2xl border border-primary-500/30 bg-primary-500/10 px-4 py-3 text-sm text-primary-100">
          Enviamos un nuevo enlace de verificación. Revisa también tu carpeta de spam.
        </div>
      </div>

      <div class="text-center text-xs text-white/50">
        <NuxtLink to="/" class="hover:text-white transition">
          ← Volver al inicio
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const config = useRuntimeConfig();

const email = ref("");
const status = ref<"pending" | "verifying" | "success" | "error">("pending");
const errorMessage = ref("");
const resending = ref(false);
const resendSuccess = ref(false);
const showStoreLinks = ref(false);

const openApp = () => {
  showStoreLinks.value = false;
  const timer = setTimeout(() => { showStoreLinks.value = true; }, 1500);
  const onBlur = () => { clearTimeout(timer); window.removeEventListener("blur", onBlur); };
  window.addEventListener("blur", onBlur);
  window.location.href = "recomiendame://verify-email";
};

const verifyToken = async (token: string) => {
  if (!config.public?.apiBase) {
    errorMessage.value =
      "No se encuentra configurado el endpoint de la API. Define NUXT_PUBLIC_API_BASE.";
    status.value = "error";
    return;
  }

  status.value = "verifying";

  try {
    await $fetch("/users/verify-email", {
      baseURL: config.public.apiBase,
      method: "GET",
      query: { token },
    });

    status.value = "success";
  } catch (error: any) {
    status.value = "error";
    const message =
      error?.data?.message ||
      error?.statusMessage ||
      "Hubo un problema al verificar tu email.";
    errorMessage.value = Array.isArray(message) ? message.join(" ") : message;
  }
};

const resendVerification = async () => {
  if (!config.public?.apiBase) {
    errorMessage.value =
      "No se encuentra configurado el endpoint de la API. Define NUXT_PUBLIC_API_BASE.";
    status.value = "error";
    return;
  }

  if (!email.value && status.value !== "error") {
    errorMessage.value = "Escribe un correo para reenviar el enlace.";
    return;
  }

  resending.value = true;
  resendSuccess.value = false;
  errorMessage.value = "";

  try {
    await $fetch("/auth/resend-verification", {
      baseURL: config.public.apiBase,
      method: "POST",
      body: { email: email.value },
    });

    resendSuccess.value = true;
    email.value = "";
  } catch (error: any) {
    const message =
      error?.data?.message ||
      error?.statusMessage ||
      "No pudimos reenviar el email. Intenta nuevamente.";
    errorMessage.value = Array.isArray(message) ? message.join(" ") : message;
  } finally {
    resending.value = false;
  }
};

onMounted(() => {
  const token = route.query.token as string | undefined;
  if (token) {
    verifyToken(token);
  }
});

useHead({
  title: "Verificar correo | Recomiéndame",
  meta: [
    {
      name: "description",
      content:
        "Confirma tu email para activar tu cuenta de Recomiéndame y mantener sincronizadas tus recomendaciones personalizadas.",
    },
  ],
});
</script>
