<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Características de Recomiéndame Coach
        </h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Descubre todas las funcionalidades que te ayudarán a alcanzar tus objetivos nutricionales
        </p>
      </div>

      <!-- Features Grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <div class="bg-white rounded-2xl p-8 shadow-soft">
          <div class="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center mb-4">
            <span class="text-white text-2xl">🤖</span>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">IA Personalizada</h3>
          <p class="text-gray-600">
            Inteligencia artificial que aprende de tus preferencias y necesidades nutricionales.
          </p>
        </div>

        <div class="bg-white rounded-2xl p-8 shadow-soft">
          <div class="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center mb-4">
            <span class="text-white text-2xl">📊</span>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">Seguimiento de Progreso</h3>
          <p class="text-gray-600">
            Monitorea tu progreso con gráficos detallados y métricas personalizadas.
          </p>
        </div>

        <div class="bg-white rounded-2xl p-8 shadow-soft">
          <div class="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center mb-4">
            <span class="text-white text-2xl">🥗</span>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">Planes Nutricionales</h3>
          <p class="text-gray-600">
            Planes de alimentación personalizados según tus objetivos y restricciones.
          </p>
        </div>

        <div class="bg-white rounded-2xl p-8 shadow-soft">
          <div class="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center mb-4">
            <span class="text-white text-2xl">👥</span>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">Comunidad</h3>
          <p class="text-gray-600">
            Conecta con otros usuarios y comparte tu experiencia en el camino hacia la salud.
          </p>
        </div>

        <div class="bg-white rounded-2xl p-8 shadow-soft">
          <div class="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center mb-4">
            <span class="text-white text-2xl">📱</span>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">App Móvil</h3>
          <p class="text-gray-600">
            Accede a todas las funcionalidades desde tu dispositivo móvil, donde sea que estés.
          </p>
        </div>

        <div class="bg-white rounded-2xl p-8 shadow-soft">
          <div class="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center mb-4">
            <span class="text-white text-2xl">🔔</span>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">Recordatorios</h3>
          <p class="text-gray-600">
            Recibe notificaciones personalizadas para mantener tus hábitos saludables.
          </p>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">
          ¿Listo para comenzar?
        </h2>
        <p class="text-xl text-gray-600 mb-8">
          Descarga Recomiéndame Coach y comienza tu transformación hoy
        </p>
        <NuxtLink to="/download" class="btn-primary text-lg px-8 py-4">
          📱 Descargar Ahora
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Características - Recomiéndame Coach',
  meta: [
    { name: 'description', content: 'Descubre todas las características y funcionalidades de Recomiéndame Coach. IA personalizada, seguimiento de progreso, planes nutricionales y más.' }
  ]
})
</script>