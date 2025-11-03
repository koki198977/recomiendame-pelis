<template>
  <div class="bg-surface-950 text-white min-h-screen flex flex-col">
    <!-- Navigation -->
    <nav
      class="sticky top-0 z-50 backdrop-blur border-b border-white/10 bg-surface-950/80"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 sm:h-20">
          <!-- Logo -->
          <NuxtLink :to="isAuthenticated ? '/dashboard' : '/'" class="flex items-center gap-3">
            <img :src="logoUrl" alt="Recomiéndame" class="h-10 w-10" />
            <div class="leading-tight">
              <span class="block text-lg font-semibold tracking-tight"
                >Recomiéndame</span
              >
              <span class="block text-xs text-white/60"
                >Películas y series con IA</span
              >
            </div>
          </NuxtLink>

          <!-- Navigation Links -->
          <div class="hidden md:flex items-center gap-6 xl:gap-8 transition-opacity duration-300" :class="{ 'opacity-50': !isHydrated }">
            <!-- Mostrar skeleton mientras se hidrata -->
            <div v-if="!isHydrated" class="flex items-center gap-6">
              <div class="h-4 w-20 bg-white/10 rounded animate-pulse"></div>
              <div class="h-4 w-24 bg-white/10 rounded animate-pulse"></div>
              <div class="h-8 w-16 bg-white/10 rounded-full animate-pulse"></div>
            </div>
            
            <!-- Contenido real después de hidratación -->
            <template v-else-if="isAuthenticated">
              <NuxtLink
                v-for="item in authenticatedNav"
                :key="item.to"
                :to="item.to"
                :class="navLinkClass(item.to)"
              >
                {{ item.label }}
              </NuxtLink>
              <button
                class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70 hover:bg-white/10 transition"
                @click="logout"
              >
                <span>Cerrar sesión</span>
                <span aria-hidden="true">↩</span>
              </button>
            </template>
            <template v-else>
              <NuxtLink
                to="/features"
                class="text-sm font-medium text-white/70 hover:text-white transition"
              >
                Funcionalidades
              </NuxtLink>
              <NuxtLink
                to="/download"
                class="text-sm font-medium text-white/70 hover:text-white transition"
              >
                Apps móviles
              </NuxtLink>
              <NuxtLink
                to="/login"
                class="inline-flex items-center rounded-full bg-primary-500 px-4 py-2 text-sm font-semibold shadow-soft hover:bg-primary-400 transition"
              >
                Ingresar
              </NuxtLink>
            </template>
          </div>

          <!-- Mobile menu button -->
          <button
            class="md:hidden rounded-full bg-white/5 p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
            @click="mobileMenuOpen = !mobileMenuOpen"
            aria-label="Menu"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        <!-- Mobile menu -->
        <div
          v-if="mobileMenuOpen"
          class="md:hidden pb-6 border-t border-white/10"
        >
          <div class="flex flex-col gap-4 pt-4 text-sm">
            <!-- Mostrar skeleton mientras se hidrata -->
            <div v-if="!isHydrated" class="flex flex-col gap-4">
              <div class="h-4 w-32 bg-white/10 rounded animate-pulse"></div>
              <div class="h-4 w-28 bg-white/10 rounded animate-pulse"></div>
              <div class="h-8 w-20 bg-white/10 rounded-full animate-pulse"></div>
            </div>
            
            <!-- Contenido real después de hidratación -->
            <template v-else-if="isAuthenticated">
              <NuxtLink
                v-for="item in authenticatedNav"
                :key="`mobile-${item.to}`"
                :to="item.to"
                :class="['block', navLinkClass(item.to)]"
                @click="mobileMenuOpen = false"
              >
                {{ item.label }}
              </NuxtLink>
              <button
                class="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 font-semibold text-white/70 hover:bg-white/10 transition"
                @click="logout"
              >
                <span>Cerrar sesión</span>
                <span aria-hidden="true">↩</span>
              </button>
            </template>
            <template v-else>
              <NuxtLink
                to="/features"
                class="text-white/70 hover:text-white transition"
                @click="mobileMenuOpen = false"
              >
                Funcionalidades
              </NuxtLink>
              <NuxtLink
                to="/download"
                class="text-white/70 hover:text-white transition"
                @click="mobileMenuOpen = false"
              >
                Apps móviles
              </NuxtLink>
              <NuxtLink
                to="/login"
                class="inline-flex items-center justify-center rounded-full bg-primary-500 px-4 py-2 font-semibold shadow-soft hover:bg-primary-400 transition"
                @click="mobileMenuOpen = false"
              >
                Ingresar
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-white/10 bg-surface-950 py-14">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-10">
          <!-- Logo and description -->
          <div class="col-span-1 md:col-span-2 space-y-4">
            <div class="flex items-center gap-3">
              <img :src="logoUrl" alt="Recomiéndame" class="h-10 w-10" />
              <div>
                <p class="text-lg font-semibold">Recomiéndame</p>
                <p class="text-xs text-white/60">
                  Tu copiloto de streaming inteligente
                </p>
              </div>
            </div>
            <p class="text-sm text-white/60 max-w-md">
              Analiza lo que ya viste, entiende tus géneros favoritos y te
              propone películas y series que de verdad vas a disfrutar. Disponible
              en web y apps móviles.
            </p>
          </div>

          <!-- Links -->
          <div>
            <h3 class="text-sm font-semibold uppercase tracking-wider text-white/60">
              Navegación
            </h3>
            <ul class="mt-4 space-y-2 text-sm">
              <li>
                <NuxtLink to="/" class="text-white/70 hover:text-white transition"
                  >Inicio</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="/features"
                  class="text-white/70 hover:text-white transition"
                  >Funcionalidades</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="/download"
                  class="text-white/70 hover:text-white transition"
                  >Apps móviles</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="/login"
                  class="text-white/70 hover:text-white transition"
                  >Accede a tu cuenta</NuxtLink
                >
              </li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h3 class="text-sm font-semibold uppercase tracking-wider text-white/60">
              Soporte
            </h3>
            <ul class="mt-4 space-y-2 text-sm">
              <li>
                <NuxtLink
                  to="/privacy"
                  class="text-white/70 hover:text-white transition"
                  >Privacidad</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="/terms"
                  class="text-white/70 hover:text-white transition"
                  >Términos</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="/request-delete-account"
                  class="text-white/70 hover:text-white transition"
                  >Eliminar cuenta</NuxtLink
                >
              </li>
            </ul>
          </div>
        </div>

        <div class="mt-12 border-t border-white/10 pt-6 text-center text-xs text-white/50">
          © {{ new Date().getFullYear() }} Recomiéndame. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import logoUrl from '~/assets/logo.png?url';
import {
  useAuthToken,
  useAuthUser,
  syncAuthState,
  initAuthState,
} from '~/composables/useAuthState';

const mobileMenuOpen = ref(false);
const route = useRoute();
const router = useRouter();

const tokenState = useAuthToken();
const userState = useAuthUser();
const isHydrated = ref(false);
const isAuthenticated = computed(() => Boolean(tokenState.value) && isHydrated.value);

const authenticatedNav = [
  { to: '/dashboard', label: 'Inicio' },
  { to: '/recommendations', label: 'Recomendaciones' },
  { to: '/recommendations/history', label: 'Historial' },
  { to: '/seen', label: 'Vistos' },
  { to: '/favorites', label: 'Favoritos' },
  { to: '/wishlist', label: 'Wishlist' },
  { to: '/profile', label: 'Perfil' },
];

const navLinkClass = (path: string) => {
  const active =
    path === '/dashboard' ? route.path === path : route.path.startsWith(path);
  return [
    'text-sm font-medium transition',
    active ? 'text-white font-semibold' : 'text-white/70 hover:text-white',
  ].join(' ');
};

const logout = () => {
  if (!process.client) return;
  localStorage.removeItem('recomiendame_token');
  localStorage.removeItem('recomiendame_refresh');
  localStorage.removeItem('recomiendame_user');
  tokenState.value = null;
  userState.value = null;
  mobileMenuOpen.value = false;
  router.push('/');
};

onMounted(() => {
  if (!process.client) return;
  
  // Inicializar estado de autenticación
  initAuthState();
  
  // Escuchar cambios en localStorage
  window.addEventListener('storage', syncAuthState);
  
  // Marcar como hidratado después de un pequeño delay
  setTimeout(() => {
    isHydrated.value = true;
  }, 100);
});

onBeforeUnmount(() => {
  if (!process.client) return;
  window.removeEventListener('storage', syncAuthState);
});

watch(
  () => route.fullPath,
  () => {
    mobileMenuOpen.value = false;
  }
);

watch(
  () => tokenState.value,
  (val) => {
    if (val) {
      mobileMenuOpen.value = false;
    }
  }
);
</script>
