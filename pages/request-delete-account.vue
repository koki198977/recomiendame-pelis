<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="bg-white rounded-3xl shadow-soft p-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-medium">
            <span class="text-white text-2xl">⚠️</span>
          </div>
          <h2 class="text-3xl font-bold text-gray-900">Eliminar Cuenta</h2>
          <p class="mt-2 text-gray-600">
            Te enviaremos un enlace de confirmación para eliminar tu cuenta de forma segura
          </p>
        </div>

        <!-- Warning -->
        <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div class="flex items-start">
            <span class="text-red-500 mr-2 mt-0.5">⚠️</span>
            <div>
              <h4 class="text-sm font-medium text-red-800 mb-1">Advertencia Importante</h4>
              <p class="text-sm text-red-700">
                Esta acción es irreversible. Se eliminarán todos tus datos, planes nutricionales, progreso y configuraciones.
              </p>
            </div>
          </div>
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
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              placeholder="tu@email.com"
            />
          </div>

          <div class="flex items-start">
            <input
              id="confirm"
              v-model="confirmDeletion"
              type="checkbox"
              required
              class="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label for="confirm" class="ml-3 text-sm text-gray-700">
              Entiendo que esta acción eliminará permanentemente mi cuenta y todos mis datos asociados.
            </label>
          </div>

          <button
            type="submit"
            :disabled="loading || !confirmDeletion"
            class="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-200 shadow-soft hover:shadow-medium disabled:opacity-50 flex items-center justify-center"
          >
            <span v-if="loading" class="mr-2">
              <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ loading ? 'Enviando...' : 'Enviar Enlace de Eliminación' }}
          </button>
        </form>

        <!-- Success Message -->
        <div v-if="success" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div class="flex items-center">
            <span class="text-green-500 mr-2">✅</span>
            <p class="text-green-700">
              Se ha enviado un enlace de confirmación a tu correo electrónico. Revisa tu bandeja de entrada.
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

        <!-- Back to Home -->
        <div class="mt-8 text-center">
          <p class="text-gray-600">
            ¿Cambiaste de opinión?
            <NuxtLink to="/" class="text-primary-500 hover:text-primary-600 font-medium">
              Volver al Inicio
            </NuxtLink>
          </p>
        </div>

        <!-- Support -->
        <div class="mt-8 pt-6 border-t border-gray-200 text-center">
          <p class="text-sm text-gray-500 mb-4">¿Necesitas ayuda antes de eliminar tu cuenta?</p>
          <NuxtLink to="/contact" class="btn-secondary text-sm">
            📧 Contactar Soporte
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Solicitar Eliminación de Cuenta - Recomiéndame Coach',
  meta: [
    { name: 'description', content: 'Solicita la eliminación de tu cuenta de Recomiéndame Coach. Te enviaremos un enlace de confirmación por email.' }
  ]
})

const email = ref('')
const confirmDeletion = ref(false)
const loading = ref(false)
const success = ref(false)
const error = ref('')

const handleSubmit = async () => {
  if (!email.value) {
    error.value = 'Por favor ingresa tu correo electrónico'
    return
  }

  if (!confirmDeletion.value) {
    error.value = 'Debes confirmar que entiendes las consecuencias de eliminar tu cuenta'
    return
  }

  loading.value = true
  error.value = ''
  success.value = false

  try {
    await $fetch('https://api-coach.recomiendameapp.cl/auth/request-account-deletion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: { email: email.value }
    })
    
    success.value = true
    email.value = ''
    confirmDeletion.value = false
  } catch (err) {
    console.error('Error requesting account deletion:', err)
    if (err.status === 404) {
      error.value = 'No se encontró una cuenta con ese correo electrónico.'
    } else if (err.status === 400) {
      error.value = 'Correo electrónico inválido.'
    } else {
      error.value = 'Hubo un error al procesar tu solicitud. Por favor intenta de nuevo.'
    }
  } finally {
    loading.value = false
  }
}
</script>