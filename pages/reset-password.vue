<template>
  <div class="bg-surface-950 min-h-screen flex items-center justify-center px-4 py-16">
    <div class="w-full max-w-md space-y-8">
      <div class="text-center space-y-4">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-primary-500/80 text-2xl shadow-soft">
          🔐
        </div>
        <div>
          <h1 class="text-3xl font-semibold text-white">
            Restablecer contraseña
          </h1>
          <p class="mt-2 text-sm text-white/70">
            Define una nueva contraseña para tu cuenta de Recomiéndame.
          </p>
        </div>
      </div>

      <div class="card space-y-6">
        <div v-if="!token" class="space-y-4 text-sm text-white/70">
          <p>Necesitas un enlace válido para restablecer tu contraseña.</p>
          <NuxtLink
            to="/request-reset-password"
            class="btn-secondary inline-flex w-full items-center justify-center gap-2 text-sm"
          >
            Solicitar nuevo enlace
          </NuxtLink>
        </div>

        <template v-else>
          <form class="space-y-5" @submit.prevent="handleSubmit" novalidate>
            <div class="space-y-2">
              <label for="password" class="text-xs uppercase tracking-[0.3em] text-white/40">
                Nueva contraseña
              </label>
              <div class="relative">
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  minlength="6"
                  autocomplete="new-password"
                  class="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-3 pr-12 text-sm text-white placeholder:text-white/40 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                  placeholder="Mínimo 6 caracteres"
                />
                <button
                  type="button"
                  class="absolute inset-y-0 right-0 flex items-center px-4 text-white/60 transition hover:text-white"
                  @click="showPassword = !showPassword"
                >
                  {{ showPassword ? '🙈' : '👁️' }}
                </button>
              </div>
            </div>

            <div class="space-y-2">
              <label for="confirmPassword" class="text-xs uppercase tracking-[0.3em] text-white/40">
                Confirmar contraseña
              </label>
              <div class="relative">
                <input
                  id="confirmPassword"
                  v-model="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  required
                  minlength="6"
                  autocomplete="new-password"
                  class="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-3 pr-12 text-sm text-white placeholder:text-white/40 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                  placeholder="Repite la contraseña"
                />
                <button
                  type="button"
                  class="absolute inset-y-0 right-0 flex items-center px-4 text-white/60 transition hover:text-white"
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  {{ showConfirmPassword ? '🙈' : '👁️' }}
                </button>
              </div>
            </div>

            <div v-if="errorMessage" class="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {{ errorMessage }}
            </div>
            <div v-if="successMessage" class="rounded-2xl border border-primary-400/40 bg-primary-500/10 px-4 py-3 text-sm text-primary-100">
              {{ successMessage }}
            </div>

            <button
              type="submit"
              class="btn-primary inline-flex w-full items-center justify-center gap-2"
              :disabled="isSubmitting || !isFormValid"
            >
              <span v-if="!isSubmitting">Actualizar contraseña</span>
              <span v-else class="flex items-center gap-2">
                <svg class="h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Actualizando…
              </span>
            </button>
          </form>

          <div class="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/60 space-y-2">
            <p class="font-semibold text-white/70">Tu contraseña debe cumplir:</p>
            <ul class="space-y-1">
              <li class="flex items-center gap-2">
                <span :class="password.length >= 6 ? 'text-accent-100' : 'text-white/40'">
                  {{ password.length >= 6 ? '✓' : '•' }}
                </span>
                Mínimo 6 caracteres
              </li>
              <li class="flex items-center gap-2">
                <span :class="passwordsMatch ? 'text-accent-100' : 'text-white/40'">
                  {{ passwordsMatch ? '✓' : '•' }}
                </span>
                Las contraseñas coinciden
              </li>
            </ul>
          </div>

          <div class="text-center text-xs text-white/60">
            ¿Recordaste tu contraseña?
            <NuxtLink to="/login" class="text-primary-200 hover:text-primary-100 transition">Iniciar sesión</NuxtLink>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();

useHead({
  title: "Restablecer contraseña | Recomiéndame",
  meta: [
    {
      name: "description",
      content: "Define una nueva contraseña para tu cuenta de Recomiéndame.",
    },
  ],
});

const token = computed(() => route.query.token as string | undefined);

const password = ref("");
const confirmPassword = ref("");
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const isSubmitting = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

const passwordsMatch = computed(
  () =>
    password.value.length >= 6 &&
    password.value === confirmPassword.value
);

const isFormValid = computed(() => passwordsMatch.value);

const handleSubmit = async () => {
  successMessage.value = "";
  errorMessage.value = "";

  if (!token.value) {
    errorMessage.value = "El enlace ya no es válido. Solicita uno nuevo.";
    return;
  }

  if (!isFormValid.value) {
    errorMessage.value =
      "Verifica que las contraseñas coincidan y tengan al menos 6 caracteres.";
    return;
  }

  isSubmitting.value = true;

  try {
    await $fetch("/auth/reset-password", {
      baseURL: config.public.apiBase,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        token: token.value,
        newPassword: password.value.trim(),
      },
    });

    successMessage.value =
      "Tu contraseña se actualizó correctamente. Redirigiendo al inicio de sesión…";
    password.value = "";
    confirmPassword.value = "";

    setTimeout(() => {
      router.push("/login");
    }, 2500);
  } catch (err: any) {
    const message =
      err?.data?.message ||
      err?.statusMessage ||
      "Hubo un problema al actualizar tu contraseña. Intenta nuevamente.";
    errorMessage.value = Array.isArray(message) ? message.join(" ") : message;
  } finally {
    isSubmitting.value = false;
  }
};
</script>
