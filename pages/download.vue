<template>
  <div class="bg-surface-950 text-white min-h-screen">

    <!-- Hero -->
    <section class="bg-gradient-to-br from-primary-700 to-primary-500 py-20">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <img src="/logo.png" alt="Recomiéndame" class="mx-auto h-16 w-auto" />
        <h1 class="text-4xl lg:text-6xl font-bold">Descarga Recomiéndame</h1>
        <p class="text-xl text-primary-100">Tu copiloto de streaming con IA. Disponible gratis para iOS y Android.</p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto pt-4">
          <a
            href="https://apps.apple.com/us/app/recomi%C3%A9ndame/id6760411789"
            target="_blank"
            rel="noopener"
            class="flex items-center justify-center gap-3 bg-black text-white px-6 py-3 rounded-2xl hover:bg-gray-800 transition-colors"
          >
            <svg class="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            <div class="text-left">
              <div class="text-xs">Descargar en</div>
              <div class="text-lg font-semibold">App Store</div>
            </div>
          </a>

          <a
            href="https://play.google.com/store/apps/details?id=cl.recomiendame.app"
            target="_blank"
            rel="noopener"
            class="flex items-center justify-center gap-3 bg-black text-white px-6 py-3 rounded-2xl hover:bg-gray-800 transition-colors"
          >
            <svg class="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
            </svg>
            <div class="text-left">
              <div class="text-xs">Disponible en</div>
              <div class="text-lg font-semibold">Google Play</div>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- Screenshots -->
    <section class="py-20 bg-surface-900">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-14 space-y-3">
          <h2 class="text-3xl lg:text-5xl font-bold">Todo en una app</h2>
          <p class="text-white/60 text-lg max-w-2xl mx-auto">
            Descubre, guarda y recibe recomendaciones personalizadas de películas y series.
          </p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <img src="/screen1.PNG" alt="Pantalla de recomendaciones" class="rounded-3xl w-full object-cover shadow-strong" />
          <img src="/screen2.PNG" alt="Pantalla de favoritos" class="rounded-3xl w-full object-cover shadow-strong" />
          <img src="/screen3.PNG" alt="Pantalla de visto" class="rounded-3xl w-full object-cover shadow-strong" />
          <img src="/screen4.PNG" alt="Pantalla de wishlist" class="rounded-3xl w-full object-cover shadow-strong" />
          <img src="/screen5.PNG" alt="Pantalla de perfil" class="rounded-3xl w-full object-cover shadow-strong col-span-2 sm:col-span-1" />
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="py-20 bg-surface-950">
      <div class="max-w-5xl mx-auto px-4 sm:px-6">
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div class="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-3">
            <span class="text-3xl">🎬</span>
            <h3 class="text-lg font-semibold">Recomendaciones con IA</h3>
            <p class="text-sm text-white/60">La IA aprende de tus gustos y te sugiere películas y series a tu medida.</p>
          </div>
          <div class="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-3">
            <span class="text-3xl">❤️</span>
            <h3 class="text-lg font-semibold">Favoritos y Wishlist</h3>
            <p class="text-sm text-white/60">Guarda lo que quieres ver y lo que ya viste. Todo sincronizado.</p>
          </div>
          <div class="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-3">
            <span class="text-3xl">🔗</span>
            <h3 class="text-lg font-semibold">Comparte con amigos</h3>
            <p class="text-sm text-white/60">Comparte tus favoritos y recomendaciones directamente desde la app.</p>
          </div>
          <div class="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-3">
            <span class="text-3xl">📺</span>
            <h3 class="text-lg font-semibold">Dónde verlo</h3>
            <p class="text-sm text-white/60">Sabe en qué plataforma de streaming está disponible cada título.</p>
          </div>
          <div class="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-3">
            <span class="text-3xl">⭐</span>
            <h3 class="text-lg font-semibold">Califica lo que ves</h3>
            <p class="text-sm text-white/60">Puntúa títulos para que la IA afine cada vez más tus recomendaciones.</p>
          </div>
          <div class="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-3">
            <span class="text-3xl">🆓</span>
            <h3 class="text-lg font-semibold">Completamente gratis</h3>
            <p class="text-sm text-white/60">Sin suscripciones ni pagos ocultos. Descárgala y úsala sin límites.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Requisitos -->
    <section class="py-16 bg-surface-900">
      <div class="max-w-3xl mx-auto px-4 sm:px-6">
        <h2 class="text-2xl font-bold text-center mb-10">Requisitos del sistema</h2>
        <div class="grid sm:grid-cols-2 gap-6">
          <div class="rounded-3xl border border-white/10 bg-white/5 p-6 text-center space-y-3">
            <div class="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto">
              <svg class="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
            </div>
            <h4 class="font-semibold text-lg">iOS</h4>
            <ul class="text-sm text-white/60 space-y-1">
              <li>iOS 15.0 o superior</li>
              <li>iPhone 8 o más reciente</li>
              <li>50 MB de espacio libre</li>
            </ul>
          </div>
          <div class="rounded-3xl border border-white/10 bg-white/5 p-6 text-center space-y-3">
            <div class="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center mx-auto">
              <svg class="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
              </svg>
            </div>
            <h4 class="font-semibold text-lg">Android</h4>
            <ul class="text-sm text-white/60 space-y-1">
              <li>Android 8.0 o superior</li>
              <li>2 GB de RAM mínimo</li>
              <li>50 MB de espacio libre</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA final -->
    <section class="py-20 bg-gradient-to-br from-primary-700 to-primary-500">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <h2 class="text-3xl lg:text-5xl font-bold">¿Listo para descubrir tu próxima serie?</h2>
        <p class="text-primary-100 text-lg">Descarga gratis y empieza a recibir recomendaciones personalizadas hoy.</p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <a
            href="https://apps.apple.com/us/app/recomi%C3%A9ndame/id6760411789"
            target="_blank"
            rel="noopener"
            class="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-2xl hover:bg-gray-800 transition-colors"
          >
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            App Store
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=cl.recomiendame.app"
            target="_blank"
            rel="noopener"
            class="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-2xl hover:bg-gray-800 transition-colors"
          >
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
            </svg>
            Google Play
          </a>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
useHead({
  title: 'Descargar App | Recomiéndame',
  meta: [
    { name: 'description', content: 'Descarga gratis Recomiéndame para iOS y Android. Tu copiloto de streaming con IA disponible en App Store y Google Play.' }
  ]
})
</script>
