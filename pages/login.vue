<template>
  <div class="bg-surface-950 min-h-screen flex items-center justify-center px-4 py-16">
    <div class="w-full max-w-md space-y-8">
      <div class="text-center space-y-4">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-primary-500/80 text-2xl shadow-soft">
          🔐
        </div>
        <div>
          <h1 class="text-3xl font-semibold text-white">Iniciar sesión</h1>
          <p class="mt-2 text-sm text-white/70">
            Accede a Recomiéndame y sincroniza tus recomendaciones en todos tus dispositivos.
          </p>
        </div>
      </div>

      <form
        class="card space-y-6"
        @submit.prevent="handleSubmit"
        novalidate
      >
        <div class="space-y-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-white/70" for="email">
              Correo electrónico
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              autocomplete="email"
              class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
              placeholder="tucorreo@email.com"
            />
          </div>

          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="block text-sm font-medium text-white/70" for="password">
                Contraseña
              </label>
              <button
                type="button"
                class="text-xs font-semibold text-white/60 hover:text-white transition"
                @click="togglePassword"
              >
                {{ showPassword ? 'Ocultar' : 'Mostrar' }}
              </button>
            </div>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="current-password"
                class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-sm text-white placeholder:text-white/40 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                placeholder="••••••••"
              />
            </div>
          </div>
        </div>

        <div v-if="errorMessage" class="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="rounded-2xl border border-accent-500/30 bg-accent-500/10 px-4 py-3 text-sm text-accent-100">
          {{ successMessage }}
        </div>

        <button
          type="submit"
          class="w-full btn-primary flex items-center justify-center gap-2"
          :disabled="isSubmitting"
        >
          <span v-if="!isSubmitting">Ingresar</span>
          <span v-else class="flex items-center gap-2">
            <svg class="h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            Procesando...
          </span>
        </button>

        <div class="flex flex-col gap-3 text-center text-xs text-white/60">
          <NuxtLink to="/request-reset-password" class="hover:text-white transition">
            ¿Olvidaste tu contraseña?
          </NuxtLink>
          <NuxtLink to="/register" class="hover:text-white transition">
            ¿Aún no tienes cuenta? Regístrate
          </NuxtLink>
          <NuxtLink to="/" class="hover:text-white transition">
            ← Volver al inicio
          </NuxtLink>
        </div>
      </form>

      <p class="text-center text-xs text-white/50">
        Antes de ingresar, asegúrate de haber configurado la variable `NUXT_PUBLIC_API_BASE` con la URL de tu API NestJS.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  useAuthToken,
  useAuthUser,
  useIsAdmin,
} from "~/composables/useAuthState";

const form = reactive({
  email: "",
  password: "",
});

const showPassword = ref(false);
const isSubmitting = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const config = useRuntimeConfig();
const authToken = useAuthToken();
const authUser = useAuthUser();
const isAdmin = useIsAdmin();

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleSubmit = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  if (!form.email || !form.password) {
    errorMessage.value = "Completa tu correo y contraseña para continuar.";
    return;
  }

  if (!config.public?.apiBase) {
    errorMessage.value =
      "No se ha configurado el endpoint de la API. Define NUXT_PUBLIC_API_BASE en tu entorno.";
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await $fetch("/auth/login", {
      baseURL: config.public.apiBase,
      method: "POST",
      body: {
        email: form.email,
        password: form.password,
      },
    });

    if (response?.access_token) {
      localStorage.setItem("recomiendame_token", response.access_token);
      authToken.value = response.access_token;
    }
    if (response?.refresh_token) {
      localStorage.setItem("recomiendame_refresh", response.refresh_token);
    }
    if (response?.user) {
      const normalizedUser = {
        ...response.user,
        admin:
          typeof response?.admin === "boolean"
            ? response.admin
            : response.user?.admin,
      };
      localStorage.setItem(
        "recomiendame_user",
        JSON.stringify(normalizedUser)
      );
      authUser.value = normalizedUser;
    } else {
      const fallbackUser = {
        email: form.email,
        admin: Boolean(response?.admin),
        name: response?.name || form.email?.split("@")?.[0] || "Admin",
      };
      localStorage.setItem("recomiendame_user", JSON.stringify(fallbackUser));
      authUser.value = fallbackUser;
    }

    if (typeof response?.admin === "boolean") {
      localStorage.setItem(
        "recomiendame_admin",
        response.admin ? "true" : "false"
      );
      isAdmin.value = response.admin;
    } else {
      localStorage.removeItem("recomiendame_admin");
      isAdmin.value = false;
    }

    successMessage.value = "Acceso concedido. Redirigiendo…";
    const destination = response?.admin ? "/admin" : "/dashboard";
    await navigateTo(destination);
  } catch (error) {
    const message =
      error?.data?.message ||
      error?.statusMessage ||
      "No pudimos iniciar sesión. Verifica tus credenciales.";
      errorMessage.value = Array.isArray(message) ? message.join(" ") : message;
  } finally {
    isSubmitting.value = false;
  }
};

useHead({
  title: "Iniciar sesión | Recomiéndame",
  meta: [
    {
      name: "description",
      content:
        "Accede a tu cuenta de Recomiéndame para sincronizar tus recomendaciones personalizadas entre la web y tus apps móviles.",
    },
  ],
});
</script>
