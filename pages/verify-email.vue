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
          <NuxtLink to="/login" class="btn-primary inline-flex w-full justify-center">
            Ir al login
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
