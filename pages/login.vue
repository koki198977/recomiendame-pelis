<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="bg-white rounded-3xl shadow-soft p-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-medium">
            <span class="text-white text-2xl">🔐</span>
          </div>
          <h2 class="text-3xl font-bold text-gray-900">Iniciar Sesión</h2>
          <p class="mt-2 text-gray-600">
            Accede a tu cuenta de Recomiéndame Coach
          </p>
        </div>

        <!-- Download App Message -->
        <div class="text-center">
          <p class="text-gray-600 mb-6">
            Para iniciar sesión, descarga la aplicación móvil
          </p>
          
          <NuxtLink to="/download" class="btn-primary inline-block">
            📱 Descargar App
          </NuxtLink>
        </div>

        <!-- Back to Home -->
        <div class="mt-8 text-center">
          <p class="text-gray-600">
            <NuxtLink to="/" class="text-primary-500 hover:text-primary-600 font-medium">
              ← Volver al inicio
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Iniciar Sesión - Recomiéndame Coach',
  meta: [
    { name: 'description', content: 'Inicia sesión en Recomiéndame Coach. Descarga la aplicación móvil para acceder a tu cuenta.' }
  ]
})
</script>