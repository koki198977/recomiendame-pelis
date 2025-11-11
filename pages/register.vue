<template>
  <div class="bg-surface-950 min-h-screen flex items-center justify-center px-4 py-16">
    <div class="w-full max-w-md space-y-8">
      <div class="text-center space-y-4">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-primary-500/80 text-2xl shadow-soft">
          ✨
        </div>
        <div>
          <h1 class="text-3xl font-semibold text-white">Crea tu cuenta</h1>
          <p class="mt-2 text-sm text-white/70">
            Cuéntanos quién eres y qué géneros disfrutas. Así podremos recomendarte algo inolvidable desde el primer día.
          </p>
        </div>
      </div>

      <form class="card space-y-6" @submit.prevent="handleSubmit" novalidate>
        <div class="space-y-4">
          <div class="space-y-2">
            <label for="fullName" class="text-xs uppercase tracking-[0.3em] text-white/40">Nombre completo</label>
            <input
              id="fullName"
              v-model="form.fullName"
              type="text"
              required
              class="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-white/40 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
              placeholder="Cómo quieres que te llamemos"
            />
          </div>

          <div class="space-y-2">
            <label for="password" class="text-xs uppercase tracking-[0.3em] text-white/40">Contraseña</label>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                minlength="6"
                class="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-3 pr-12 text-sm text-white placeholder:text-white/40 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                placeholder="Mínimo 6 caracteres"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 flex items-center px-4 text-white/60 hover:text-white transition"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <div class="space-y-2">
            <label for="email" class="text-xs uppercase tracking-[0.3em] text-white/40">Correo electrónico</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-white/40 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
              placeholder="tucorreo@email.com"
            />
          </div>

          <div class="space-y-2">
            <label for="confirmPassword" class="text-xs uppercase tracking-[0.3em] text-white/40">Repite la contraseña</label>
            <div class="relative">
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                minlength="6"
                class="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-3 pr-12 text-sm text-white placeholder:text-white/40 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                placeholder="Vuelve a escribirla"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 flex items-center px-4 text-white/60 hover:text-white transition"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                {{ showConfirmPassword ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="text-xs uppercase tracking-[0.3em] text-white/40">Géneros favoritos</label>
              <span class="text-[11px] text-white/50">Selecciona al menos uno</span>
            </div>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="genre in availableGenres"
                :key="genre"
                type="button"
                class="rounded-full border px-3 py-1 text-xs transition"
                :class="form.favoriteGenres.includes(genre)
                  ? 'border-primary-400 bg-primary-500/20 text-primary-100'
                  : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'"
                @click="toggleGenre(genre)"
              >
                {{ genre }}
              </button>
            </div>
          </div>
        </div>

        <p v-if="errorMessage" class="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{{ errorMessage }}</p>
        <p v-if="successMessage" class="rounded-2xl border border-primary-400/40 bg-primary-500/10 px-4 py-3 text-sm text-primary-100">{{ successMessage }}</p>

        <button
          type="submit"
          class="w-full btn-primary flex items-center justify-center gap-2"
          :disabled="isSubmitting"
        >
          <span v-if="!isSubmitting">Crear cuenta</span>
          <span v-else class="flex items-center gap-2">
            <svg class="h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Registrando…
          </span>
        </button>

        <p class="text-center text-xs text-white/60">
          ¿Ya tienes cuenta?
          <NuxtLink to="/login" class="text-primary-200 hover:text-primary-100 transition">Inicia sesión</NuxtLink>
        </p>
      </form>

      <p class="text-center text-xs text-white/50">
        Al registrarte aceptas nuestros
        <NuxtLink to="/terms" class="text-primary-200 hover:text-primary-100 transition">términos</NuxtLink>
        y
        <NuxtLink to="/privacy" class="text-primary-200 hover:text-primary-100 transition">política de privacidad</NuxtLink>.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";

const config = useRuntimeConfig();

const availableGenres = [
  "Acción",
  "Aventura",
  "Crimen",
  "Comedia",
  "Documental",
  "Animación",
  "Drama",
  "Terror",
  "Ciencia ficción",
  "Romance",
  "Historia",
  "Fantasía",
  "Suspenso",
  "Bélico",
  "Western",
  "Musical",
];

const form = reactive({
  fullName: "",
  email: "",
  password: "",
  birthDate: "",
  country: "CL",
  language: "es",
  favoriteGenres: [] as string[],
});

const confirmPassword = ref("");
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const isSubmitting = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const toggleGenre = (genre: string) => {
  if (form.favoriteGenres.includes(genre)) {
    form.favoriteGenres = form.favoriteGenres.filter((g) => g !== genre);
  } else {
    form.favoriteGenres = [...form.favoriteGenres, genre];
  }
};

const handleSubmit = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  if (!form.fullName.trim() || !form.email.trim() || !form.password.trim()) {
    errorMessage.value = "Completa tu nombre, correo y contraseña.";
    return;
  }
  if (form.password.trim().length < 6) {
    errorMessage.value = "La contraseña debe tener al menos 6 caracteres.";
    return;
  }
  if (form.password.trim() !== confirmPassword.value.trim()) {
    errorMessage.value = "Las contraseñas no coinciden.";
    return;
  }
  if (!form.favoriteGenres.length) {
    errorMessage.value = "Selecciona al menos un género favorito.";
    return;
  }
  if (!config.public?.apiBase) {
    errorMessage.value = "No se ha configurado la API. Define NUXT_PUBLIC_API_BASE.";
    return;
  }

  isSubmitting.value = true;

  try {
    await $fetch("/users", {
      baseURL: config.public.apiBase,
      method: "POST",
      body: {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password.trim(),
        birthDate: form.birthDate || "1990-01-01",
        country: form.country || "CL",
        language: form.language || "es",
        favoriteGenres: form.favoriteGenres.length ? form.favoriteGenres : ["Ciencia ficción"],
      },
    });

    successMessage.value = "Revisa tu correo para confirmar la cuenta.";
    form.fullName = "";
    form.email = "";
    form.password = "";
    form.birthDate = "";
    form.country = "CL";
    form.language = "es";
    form.favoriteGenres = [];
    confirmPassword.value = "";
    showPassword.value = false;
    showConfirmPassword.value = false;
  } catch (error: any) {
    const message =
      error?.data?.message ||
      error?.statusMessage ||
      "No pudimos crear tu cuenta. Intenta nuevamente.";
    errorMessage.value = Array.isArray(message) ? message.join(" ") : message;
  } finally {
    isSubmitting.value = false;
  }
};

useHead({
  title: "Crea tu cuenta | Recomiéndame",
});
</script>
