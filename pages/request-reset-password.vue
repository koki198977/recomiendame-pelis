<template>
  <div class="bg-surface-950 min-h-screen flex items-center justify-center px-4 py-16">
    <div class="w-full max-w-md space-y-8">
      <div class="text-center space-y-4">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary-500/80 text-2xl shadow-soft">
          🧠
        </div>
        <div class="space-y-2">
          <h1 class="text-3xl font-semibold text-white">Recupera tu acceso</h1>
          <p class="text-sm text-white/70">Ingresa el correo asociado a tu cuenta y te enviaremos un enlace para restablecer la contraseña.</p>
        </div>
      </div>

      <form class="card space-y-6" @submit.prevent="handleSubmit" novalidate>
        <div class="space-y-2">
          <label for="email" class="text-xs uppercase tracking-[0.3em] text-white/40">Correo electrónico</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-white/40 focus:border-secondary-400 focus:outline-none focus:ring-2 focus:ring-secondary-500/40"
            placeholder="tucorreo@email.com"
          />
        </div>

        <p v-if="error" class="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{{ error }}</p>
        <p v-if="success" class="rounded-2xl border border-secondary-400/40 bg-secondary-500/10 px-4 py-3 text-sm text-secondary-100">Te enviamos un correo con el enlace de restablecimiento. Revisa tu bandeja de entrada y spam.</p>

        <button
          type="submit"
          class="btn-primary w-full flex items-center justify-center gap-2"
          :disabled="loading"
        >
          <span v-if="!loading">Enviar enlace</span>
          <span v-else class="flex items-center gap-2">
            <svg class="h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Enviando…
          </span>
        </button>
      </form>

      <p class="text-center text-xs text-white/60">¿Recordaste tu contraseña? <NuxtLink to="/login" class="text-secondary-200 hover:text-secondary-100 transition">Volver al login</NuxtLink></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const email = ref("");
const loading = ref(false);
const error = ref("");
const success = ref(false);

const config = useRuntimeConfig();

const handleSubmit = async () => {
  if (!email.value) {
    error.value = "Ingresa tu correo electrónico";
    return;
  }

  loading.value = true;
  error.value = "";
  success.value = false;

  try {
    await $fetch("/auth/request-password-reset", {
      baseURL: config.public?.apiBase || "https://api.recomiendameapp.cl",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { email: email.value },
    });
    success.value = true;
    email.value = "";
  } catch (err: any) {
    const message = err?.data?.message || err?.statusMessage || "No pudimos enviar el enlace. Intenta otra vez.";
    error.value = Array.isArray(message) ? message.join(" ") : message;
  } finally {
    loading.value = false;
  }
};

useHead({
  title: "Restablecer contraseña | Recomiéndame",
});
</script>
