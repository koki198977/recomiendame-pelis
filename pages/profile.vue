<template>
  <div class="bg-surface-950 min-h-screen text-white pb-20">
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 space-y-8">
      <header class="space-y-2">
        <h1 class="text-3xl sm:text-4xl font-semibold">Tu perfil</h1>
        <p class="text-sm text-white/60">
          Actualiza tus datos personales y preferencias para mejorar la precisión de tus recomendaciones.
        </p>
      </header>

      <div class="space-y-6">
        <div class="card space-y-4">
          <div class="stack-mobile sm:flex-row sm:items-center sm:justify-between">
            <div class="space-y-1">
              <h2 class="text-xl font-semibold">Información básica</h2>
              <p class="text-sm text-white/60">Solo tú puedes ver estos datos. Todos los campos son opcionales.</p>
            </div>
            <span v-if="isLoading" class="text-xs text-white/50">Cargando…</span>
          </div>

          <div v-if="errorMessage" class="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {{ errorMessage }}
          </div>
          <div v-if="successMessage" class="rounded-2xl border border-primary-400/40 bg-primary-500/10 px-4 py-3 text-sm text-primary-100">
            {{ successMessage }}
          </div>

          <form class="grid gap-6" @submit.prevent="handleSubmit" novalidate>
            <div class="grid gap-2">
              <label for="fullName" class="text-xs uppercase tracking-[0.3em] text-white/40">Nombre completo</label>
              <input
                id="fullName"
                v-model="form.fullName"
                type="text"
                class="rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-white/30 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                placeholder="Tu nombre como quieres verlo"
              />
            </div>

            <div class="grid gap-2">
              <label for="email" class="text-xs uppercase tracking-[0.3em] text-white/40">Correo electrónico</label>
              <input
                id="email"
                v-model="userData.email"
                type="email"
                disabled
                class="rounded-3xl border border-white/10 bg-white/10 px-5 py-3 text-sm text-white/60 cursor-not-allowed"
              />
              <p class="text-[11px] text-white/40">Este correo se utiliza para ingresar y recibir notificaciones.</p>
            </div>

            <div class="grid gap-2">
              <label for="birthDate" class="text-xs uppercase tracking-[0.3em] text-white/40">Fecha de nacimiento</label>
              <input
                id="birthDate"
                v-model="form.birthDate"
                type="date"
                class="rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
              />
            </div>

            <div class="grid gap-2">
              <label class="text-xs uppercase tracking-[0.3em] text-white/40">Géneros favoritos</label>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="genre in availableGenres"
                  :key="genre"
                  class="rounded-full border px-3 py-1 text-xs"
                  :class="form.favoriteGenres.includes(genre)
                    ? 'border-primary-400 bg-primary-500/20 text-primary-100'
                    : 'border-white/10 bg-white/5 text-white/70'"
                  @click="toggleGenre(genre)"
                >
                  {{ genre }}
                </span>
              </div>
              <p class="text-[11px] text-white/40">Selecciona los géneros que más te gustan para ajustar las recomendaciones.</p>
            </div>

            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div class="text-xs text-white/50">
                Última actualización: {{ lastUpdatedLabel }}
              </div>
              <button
                type="submit"
                class="btn-primary inline-flex items-center gap-2"
                :disabled="isSaving"
              >
                <span v-if="!isSaving">Guardar cambios</span>
                <span v-else class="flex items-center gap-2">
                  <svg
                    class="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Guardando…
                </span>
              </button>
            </div>
          </form>
        </div>

        <div class="card space-y-3">
          <h2 class="text-xl font-semibold">Resumen</h2>
          <div class="grid gap-2 text-sm text-white/70">
            <p><span class="text-white/50">Cuenta creada:</span> {{ formattedCreatedAt }}</p>
            <p><span class="text-white/50">Correo verificado:</span> {{ userData.emailVerified ? 'Sí' : 'No' }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useAuthToken, syncAuthState } from "~/composables/useAuthState";

interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  emailVerified?: boolean;
  createdAt?: string;
  birthDate?: string;
  country?: string;
  language?: string;
  favoriteGenres?: string[];
}

const authToken = useAuthToken();
const config = useRuntimeConfig();

const isLoading = ref(false);
const isSaving = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const lastUpdated = ref<string | null>(null);

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

const userData = reactive<UserProfile>({
  id: "",
  email: "",
  fullName: "",
  emailVerified: false,
  createdAt: "",
});

const form = reactive({
  fullName: "",
  birthDate: "",
  favoriteGenres: [] as string[],
});

const formattedCreatedAt = computed(() => {
  if (!userData.createdAt) return "—";
  return new Date(userData.createdAt).toLocaleDateString("es-CL");
});

const lastUpdatedLabel = computed(() => {
  if (!lastUpdated.value) return "sin cambios recientes";
  return new Date(lastUpdated.value).toLocaleString("es-CL");
});

const toggleGenre = (genre: string) => {
  if (form.favoriteGenres.includes(genre)) {
    form.favoriteGenres = form.favoriteGenres.filter((g) => g !== genre);
  } else {
    form.favoriteGenres = [...form.favoriteGenres, genre];
  }
};

const loadProfile = async () => {
  if (!authToken.value) {
    await navigateTo("/login");
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";

  try {
    const response = await $fetch<UserProfile>("/users/me", {
      baseURL: config.public.apiBase,
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken.value}`,
        Accept: "application/json",
      },
    });

    Object.assign(userData, response);
    form.fullName = response.fullName ?? "";
    form.birthDate = response.birthDate ? response.birthDate.substring(0, 10) : "";
    form.favoriteGenres = Array.isArray(response.favoriteGenres)
      ? [...response.favoriteGenres]
      : [];
  } catch (error: any) {
    const message =
      error?.data?.message ||
      error?.statusMessage ||
      "No pudimos cargar tu perfil.";
    errorMessage.value = Array.isArray(message) ? message.join(" ") : message;
  } finally {
    isLoading.value = false;
  }
};

const handleSubmit = async () => {
  successMessage.value = "";
  if (!authToken.value) {
    await navigateTo("/login");
    return;
  }

  isSaving.value = true;
  errorMessage.value = "";

  try {
    await $fetch("/users/me", {
      baseURL: config.public.apiBase,
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${authToken.value}`,
        "Content-Type": "application/json",
      },
      body: {
        fullName: form.fullName || null,
        birthDate: form.birthDate || null,
        favoriteGenres: form.favoriteGenres,
      },
    });

    lastUpdated.value = new Date().toISOString();
    await loadProfile();
    successMessage.value = "Cambios guardados correctamente.";
  } catch (error: any) {
    const message =
      error?.data?.message ||
      error?.statusMessage ||
      "No pudimos guardar tus cambios.";
    errorMessage.value = Array.isArray(message) ? message.join(" ") : message;
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  if (process.client) {
    syncAuthState();
    loadProfile();
  }
});

useHead({
  title: "Perfil | Recomiéndame",
});
</script>
