<template>
  <div>
    <!-- Navigation -->
    <nav class="bg-white shadow-soft sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center space-x-3">
            <img src="/logo.png" alt="Recomiéndame Coach" class="h-12 w-auto" />
            <span class="text-xl font-bold text-gray-900"
              >Recomiéndame Coach</span
            >
          </NuxtLink>

          <!-- Navigation Links -->
          <div class="hidden md:flex items-center space-x-8">
            <NuxtLink
              to="/"
              class="text-gray-600 hover:text-primary-500 font-medium transition-colors"
            >
              Inicio
            </NuxtLink>
            <NuxtLink
              to="/features"
              class="text-gray-600 hover:text-primary-500 font-medium transition-colors"
            >
              Características
            </NuxtLink>
            <NuxtLink to="/download" class="btn-primary text-sm">
              📱 Descargar
            </NuxtLink>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden">
            <button
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="text-gray-600 hover:text-primary-500"
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
        </div>

        <!-- Mobile menu -->
        <div
          v-if="mobileMenuOpen"
          class="md:hidden py-4 border-t border-gray-200"
        >
          <div class="flex flex-col space-y-4">
            <NuxtLink
              to="/"
              class="text-gray-600 hover:text-primary-500 font-medium"
            >
              Inicio
            </NuxtLink>
            <NuxtLink
              to="/features"
              class="text-gray-600 hover:text-primary-500 font-medium"
            >
              Características
            </NuxtLink>
            <NuxtLink to="/download" class="btn-primary text-sm inline-block">
              📱 Descargar
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Logo and description -->
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center space-x-3 mb-4">
              <img
                src="/logo.png"
                alt="Recomiéndame Coach"
                class="h-10 w-auto"
              />
              <span class="text-xl font-bold">Recomiéndame Coach</span>
            </div>
            <p class="text-gray-400 mb-4">
              Tu coach nutricional con inteligencia artificial. Planes
              personalizados para alcanzar tus objetivos de salud.
            </p>
          </div>

          <!-- Links -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Enlaces</h3>
            <ul class="space-y-2">
              <li>
                <NuxtLink
                  to="/"
                  class="text-gray-400 hover:text-white transition-colors"
                  >Inicio</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="/features"
                  class="text-gray-400 hover:text-white transition-colors"
                  >Características</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="/download"
                  class="text-gray-400 hover:text-white transition-colors"
                  >Descargar</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="/contact"
                  class="text-gray-400 hover:text-white transition-colors"
                  >Contacto</NuxtLink
                >
              </li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Soporte</h3>
            <ul class="space-y-2">
              <li>
                <a
                  href="https://coach.recomiendameapp.cl/request-reset-password"
                  class="text-gray-400 hover:text-white transition-colors"
                  >Restablecer Contraseña</a
                >
              </li>
              <li>
                <NuxtLink
                  to="/terms"
                  class="text-gray-400 hover:text-white transition-colors"
                  >Términos</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="/privacy"
                  class="text-gray-400 hover:text-white transition-colors"
                  >Privacidad</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="/request-delete-account"
                  class="text-gray-400 hover:text-white transition-colors"
                  >Eliminar Cuenta</NuxtLink
                >
              </li>
            </ul>
          </div>
        </div>

        <div class="border-t border-gray-800 mt-8 pt-8 text-center">
          <p class="text-gray-400">
            © 2025 Recomiéndame Coach. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
const mobileMenuOpen = ref(false);
</script>
