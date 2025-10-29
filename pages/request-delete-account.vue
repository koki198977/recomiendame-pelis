<template>
  <div class="bg-surface-950 min-h-screen flex items-center justify-center px-4 py-16">
    <div class="w-full max-w-md space-y-8">
      <div class="text-center space-y-4">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-red-500/80 text-2xl shadow-soft">
          ⚠️
        </div>
        <div>
          <h1 class="text-3xl font-semibold text-white">Solicitar eliminación</h1>
          <p class="mt-2 text-sm text-white/70">
            Te enviaremos un enlace para que confirmes la eliminación definitiva de tu cuenta.
          </p>
        </div>
      </div>

      <div class="card space-y-6">
        <div class="space-y-3 rounded-3xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          <p class="font-semibold">Advertencia</p>
          <p>
            Esta acción es irreversible. Se borrarán tu historial, favoritos, listas y configuraciones.
          </p>
        </div>

        <form class="space-y-6" @submit.prevent="handleSubmit" novalidate>
          <div class="space-y-2">
            <label for="email" class="text-xs uppercase tracking-[0.3em] text-white/40">Correo asociado</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-white/40 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500/40"
              placeholder="tucorreo@email.com"
            />
          </div>

          <div class="flex items-start gap-3">
            <input
              id="confirm"
              v-model="confirmDeletion"
              type="checkbox"
              required
              class="mt-1 h-4 w-4 rounded border border-white/20 bg-white/5 text-red-400 focus:ring-red-500/40"
            />
            <label for="confirm" class="text-xs text-white/60 leading-5">
              Entiendo que perderé permanentemente todo mi contenido y no podré recuperarlo.
            </label>
          </div>

          <p v-if="error" class="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{{ error }}</p>
          <p v-if="success" class="rounded-2xl border border-primary-400/40 bg-primary-500/10 px-4 py-3 text-sm text-primary-100">
            Te enviamos un correo con el enlace de confirmación. Revisa tu bandeja de entrada y spam.
          </p>

          <button
            type="submit"
            class="btn-primary w-full flex items-center justify-center gap-2"
            :disabled="loading || !confirmDeletion"
          >
            <span v-if="!loading">Enviar enlace de eliminación</span>
            <span v-else class="flex items-center gap-2">
              <svg class="h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Enviando…
            </span>
          </button>
        </form>

        <p class="text-center text-xs text-white/60">
          ¿Cambiaste de idea? <NuxtLink to="/profile" class="text-primary-200 hover:text-primary-100 transition">Volver al perfil</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const email = ref("");
const confirmDeletion = ref(false);
const loading = ref(false);
const error = ref("");
const success = ref(false);

const config = useRuntimeConfig();

const handleSubmit = async () => {
  if (!email.value) {
    error.value = "Ingresa el correo asociado a tu cuenta.";
    return;
  }

  loading.value = true;
  error.value = "";
  success.value = false;

  try {
    await $fetch("/auth/request-delete-account", {
      baseURL: config.public.apiBase,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { email: email.value.trim() },
    });
    success.value = true;
    email.value = "";
    confirmDeletion.value = false;
  } catch (err: any) {
    const message =
      err?.data?.message ||
      err?.statusMessage ||
      "No pudimos procesar tu solicitud. Inténtalo nuevamente.";
    error.value = Array.isArray(message) ? message.join(" ") : message;
  } finally {
    loading.value = false;
  }
};

useHead({
  title: "Eliminar cuenta | Recomiéndame",
});
</script>
