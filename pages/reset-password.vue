<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="bg-white rounded-3xl shadow-soft p-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-medium">
            <span class="text-white text-2xl">🔑</span>
          </div>
          <h2 class="text-3xl font-bold text-gray-900">Restablecer Contraseña</h2>
          <p class="mt-2 text-gray-600">
            Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
          </p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="tu@email.com"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full btn-primary flex items-center justify-center"
          >
            <span v-if="loading" class="mr-2">
              <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ loading ? 'Enviando...' : 'Enviar Enlace de Restablecimiento' }}
          </button>
        </form>

        <!-- Success Message -->
        <div v-if="success" class="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-xl">
          <div class="flex items-center">
            <span class="text-primary-500 mr-2">✅</span>
            <p class="text-primary-700">
              Se ha enviado un enlace de restablecimiento a tu correo electrónico.
            </p>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div class="flex items-center">
            <span class="text-red-500 mr-2">❌</span>
            <p class="text-red-700">{{ error }}</p>
          </div>
        </div>

        <!-- Back to Login -->
        <div class="mt-8 text-center">
          <p class="text-gray-600">
            ¿Recordaste tu contraseña?
            <NuxtLink to="/login" class="text-primary-500 hover:text-primary-600 font-medium">
              Iniciar Sesión
            </NuxtLink>
          </p>
        </div>

        <!-- Download App -->
        <div class="mt-8 pt-6 border-t border-gray-200 text-center">
          <p class="text-sm text-gray-500 mb-4">¿No tienes la app aún?</p>
          <NuxtLink to="/download" class="btn-secondary text-sm">
            📱 Descargar Recomiéndame Coach
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Restablecer Contraseña - Recomiéndame Coach',
  meta: [
    { name: 'description', content: 'Restablece tu contraseña de Recomiéndame Coach. Ingresa tu email y te enviaremos un enlace seguro para crear una nueva contraseña.' }
  ]
})

const email = ref('')
const loading = ref(false)
const success = ref(false)
const error = ref('')

const handleSubmit = async () => {
  if (!email.value) {
    error.value = 'Por favor ingresa tu correo electrónico'
    return
  }

  loading.value = true
  error.value = ''
  success.value = false

  try {
    await $fetch('https://api-coach.recomiendameapp.cl/auth/request-reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: { email: email.value }
    })
    
    success.value = true
    email.value = ''
  } catch (err) {
    console.error('Error requesting password reset:', err)
    if (err.status === 404) {
      error.value = 'No se encontró una cuenta con ese correo electrónico.'
    } else if (err.status === 400) {
      error.value = 'Correo electrónico inválido.'
    } else {
      error.value = 'Hubo un error al enviar el enlace. Por favor intenta de nuevo.'
    }
  } finally {
    loading.value = false
  }
}
</script>