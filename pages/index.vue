<template>
  <div>
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-br from-primary-500 to-primary-700 text-white overflow-hidden"
    >
      <div class="absolute inset-0 bg-black opacity-10"></div>
      <div
        class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32"
      >
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Text Content -->
          <div class="text-center lg:text-left">
            <h1 class="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Tu Coach Nutricional
              <span class="block text-primary-200"
                >con Inteligencia Artificial</span
              >
            </h1>
            <p
              class="text-xl lg:text-2xl mb-8 text-primary-100 leading-relaxed"
            >
              Planes personalizados, seguimiento inteligente y una comunidad que
              te apoya en tu transformación.
            </p>
            <div
              class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <NuxtLink
                to="/download"
                class="btn-primary bg-white text-primary-500 hover:bg-gray-50"
              >
                📱 Descargar App
              </NuxtLink>
            </div>
          </div>

          <!-- App Screenshots -->
          <div class="relative">
            <div class="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div
                class="bg-white rounded-3xl p-4 shadow-strong transform rotate-3 hover:rotate-0 transition-transform duration-300"
              >
                <div
                  class="bg-gray-100 rounded-2xl h-64 flex items-center justify-center"
                >
                  <span class="text-gray-400 text-sm">Pantalla Principal</span>
                </div>
              </div>
              <div
                class="bg-white rounded-3xl p-4 shadow-strong transform -rotate-3 hover:rotate-0 transition-transform duration-300 mt-8"
              >
                <div
                  class="bg-gray-100 rounded-2xl h-64 flex items-center justify-center"
                >
                  <span class="text-gray-400 text-sm">Plan Nutricional</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How it Works Section -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            ¿Cómo funciona?
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            En solo 3 pasos simples, tendrás tu plan nutricional personalizado
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Step 1 -->
          <div class="text-center">
            <div
              class="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-medium"
            >
              <span class="text-white font-bold text-2xl">1</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">
              Completa tu Perfil
            </h3>
            <p class="text-gray-600">
              Cuéntanos sobre tus objetivos, preferencias alimentarias y estilo
              de vida.
            </p>
          </div>

          <!-- Step 2 -->
          <div class="text-center">
            <div
              class="w-20 h-20 bg-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-medium"
            >
              <span class="text-white font-bold text-2xl">2</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">
              IA Crea tu Plan
            </h3>
            <p class="text-gray-600">
              Nuestra inteligencia artificial genera un plan nutricional único
              para ti.
            </p>
          </div>

          <!-- Step 3 -->
          <div class="text-center">
            <div
              class="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-medium"
            >
              <span class="text-white font-bold text-2xl">3</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">
              Sigue y Progresa
            </h3>
            <p class="text-gray-600">
              Registra tu progreso diario y ve cómo alcanzas tus objetivos.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-primary-500 text-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl lg:text-5xl font-bold mb-6">
          ¿Listo para transformar tu alimentación?
        </h2>
        <p class="text-xl mb-8 text-primary-100">
          Únete a miles de personas que ya están alcanzando sus objetivos con
          Recomiéndame Coach
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/download"
            class="btn-primary bg-white text-primary-500 hover:bg-gray-50"
          >
            📱 Descargar Gratis
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
useHead({
  title: "Recomiéndame Coach - Tu Coach Nutricional con IA",
  meta: [
    {
      name: "description",
      content:
        "Transforma tu alimentación con planes personalizados creados por inteligencia artificial. Únete a nuestra comunidad y alcanza tus objetivos de salud.",
    },
  ],
});
</script>
