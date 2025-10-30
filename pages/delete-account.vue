<template>
  <div class="bg-surface-950 min-h-screen flex items-center justify-center px-4 py-16">
    <div class="w-full max-w-md space-y-8">
      <div class="text-center space-y-4">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-red-600/80 text-2xl shadow-soft">
          🗑️
        </div>
        <div>
          <h1 class="text-3xl font-semibold text-white">Confirmar eliminación</h1>
          <p class="mt-2 text-sm text-white/70">
            Esta acción no se puede deshacer. Si estás seguro, confirma para eliminar tu cuenta y todos tus datos.
          </p>
        </div>
      </div>

      <div class="card space-y-6">
        <div v-if="!token" class="space-y-3 text-sm text-white/70">
          <p>Para eliminar tu cuenta necesitas un token válido.</p>
          <NuxtLink to="/request-delete-account" class="btn-secondary text-sm inline-flex items-center gap-2">
            Solicitar enlace de eliminación
          </NuxtLink>
        </div>

        <div v-else class="space-y-6">
          <div class="space-y-2 rounded-3xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            <p class="font-semibold">Advertencia final</p>
            <p>
              Se borrarán tu perfil, favoritos, historial y configuraciones. Solo continúa si estás totalmente seguro.
            </p>
          </div>

          <p v-if="error" class="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {{ error }}
          </p>
          <p v-if="success" class="rounded-2xl border border-primary-400/40 bg-primary-500/10 px-4 py-3 text-sm text-primary-100">
            Tu cuenta fue eliminada. Gracias por haber usado Recomiéndame.
          </p>

          <button
            v-if="!success"
            class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-200 shadow-soft hover:shadow-medium flex items-center justify-center"
            :disabled="loading"
            @click="handleDelete"
          >
            <span v-if="!loading">Eliminar definitivamente</span>
            <span v-else class="flex items-center gap-2">
              <svg class="h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Eliminando…
            </span>
          </button>

          <div class="text-center text-xs text-white/60">
            <NuxtLink to="/" class="text-primary-200 hover:text-primary-100 transition">Volver al inicio</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const token = route.query.token as string | undefined;

const config = useRuntimeConfig();
const loading = ref(false);
const error = ref("");
const success = ref(false);

const handleDelete = async () => {
  if (!token) {
    error.value = "Falta el token de confirmación.";
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    await $fetch("/auth/delete-account", {
      baseURL: config.public.apiBase,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: { token },
    });
    success.value = true;
  } catch (err: any) {
    const message =
      err?.data?.message ||
      err?.statusMessage ||
      "No pudimos eliminar tu cuenta. Inténtalo nuevamente.";
    error.value = Array.isArray(message) ? message.join(" ") : message;
  } finally {
    loading.value = false;
  }
};

useHead({
  title: "Confirmar eliminación | Recomiéndame",
});
</script>
