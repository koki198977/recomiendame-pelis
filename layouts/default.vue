<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-soft sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-medium">
              <span class="text-white font-bold text-lg">R</span>
            </div>
            <div class="hidden sm:block">
              <h1 class="text-xl font-bold text-primary-500">Recomiéndame</h1>
              <p class="text-sm text-primary-300 -mt-1">Coach</p>
            </div>
          </NuxtLink>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-8">
            <NuxtLink to="/" class="text-gray-700 hover:text-primary-500 font-medium transition-colors">
              Inicio
            </NuxtLink>
            <NuxtLink to="/features" class="text-gray-700 hover:text-primary-500 font-medium transition-colors">
              Características
            </NuxtLink>
            <NuxtLink to="/download" class="text-gray-700 hover:text-primary-500 font-medium transition-colors">
              Descargar
            </NuxtLink>
            <NuxtLink to="/contact" class="text-gray-700 hover:text-primary-500 font-medium transition-colors">
              Contacto
            </NuxtLink>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden">
            <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-gray-700 hover:text-primary-500">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Navigation -->
        <div v-show="mobileMenuOpen" class="md:hidden py-4 border-t border-gray-200">
          <div class="flex flex-col space-y-4">
            <NuxtLink to="/" class="text-gray-700 hover:text-primary-500 font-medium transition-colors">
              Inicio
            </NuxtLink>
            <NuxtLink to="/features" class="text-gray-700 hover:text-primary-500 font-medium transition-colors">
              Características
            </NuxtLink>
            <NuxtLink to="/download" class="text-gray-700 hover:text-primary-500 font-medium transition-colors">
              Descargar
            </NuxtLink>
            <NuxtLink to="/contact" class="text-gray-700 hover:text-primary-500 font-medium transition-colors">
              Contacto
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Logo and Description -->
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-medium">
                <span class="text-white font-bold text-lg">R</span>
              </div>
              <div>
                <h3 class="text-xl font-bold text-primary-500">Recomiéndame Coach</h3>
                <p class="text-sm text-primary-300">Tu Coach Nutricional con IA</p>
              </div>
            </div>
            <p class="text-gray-600 max-w-md">
              Transforma tu alimentación con planes personalizados creados por inteligencia artificial. 
              Únete a nuestra comunidad y alcanza tus objetivos de salud.
            </p>
          </div>

          <!-- Links -->
          <div>
            <h4 class="font-semibold text-gray-900 mb-4">Enlaces</h4>
            <ul class="space-y-2">
              <li><NuxtLink to="/" class="text-gray-600 hover:text-primary-500 transition-colors">Inicio</NuxtLink></li>
              <li><NuxtLink to="/features" class="text-gray-600 hover:text-primary-500 transition-colors">Características</NuxtLink></li>
              <li><NuxtLink to="/download" class="text-gray-600 hover:text-primary-500 transition-colors">Descargar</NuxtLink></li>
              <li><NuxtLink to="/contact" class="text-gray-600 hover:text-primary-500 transition-colors">Contacto</NuxtLink></li>
            </ul>
          </div>

          <!-- Legal -->
          <div>
            <h4 class="font-semibold text-gray-900 mb-4">Legal</h4>
            <ul class="space-y-2">
              <li><NuxtLink to="/terms" class="text-gray-600 hover:text-primary-500 transition-colors">Términos y Condiciones</NuxtLink></li>
              <li><NuxtLink to="/privacy" class="text-gray-600 hover:text-primary-500 transition-colors">Política de Privacidad</NuxtLink></li>
              <li><NuxtLink to="/reset-password" class="text-gray-600 hover:text-primary-500 transition-colors">Restablecer Contraseña</NuxtLink></li>
              <li><NuxtLink to="/verify-email" class="text-gray-600 hover:text-primary-500 transition-colors">Verificar Email</NuxtLink></li>
              <li><NuxtLink to="/delete-account" class="text-gray-600 hover:text-primary-500 transition-colors">Eliminar Cuenta</NuxtLink></li>
            </ul>
          </div>
        </div>

        <div class="border-t border-gray-200 mt-8 pt-8 text-center">
          <p class="text-gray-600">
            © {{ new Date().getFullYear() }} Recomiéndame Coach. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
const mobileMenuOpen = ref(false)
</script>