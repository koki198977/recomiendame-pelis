<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="bg-white rounded-3xl shadow-soft p-8">
        <!-- Mensaje cuando no hay token -->
        <div v-if="!token" class="text-center">
          <div class="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-medium">
            <span class="text-white text-2xl">⚠️</span>
          </div>
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Token Requerido</h2>
          <p class="text-gray-600 mb-6">
            Esta página requiere un token de restablecimiento válido.
          </p>
          <a href="https://coach.recomiendameapp.cl/request-reset-password" class="btn-primary">
            Solicitar Restablecimiento
          </a>
        </div>

        <!-- Formulario cuando hay token -->
        <div v-else>
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-medium">
            <span class="text-white text-2xl">🔐</span>
          </div>
          <h2 class="text-3xl font-bold text-gray-900">Nueva Contraseña</h2>
          <p class="mt-2 text-gray-600">
            Ingresa tu nueva contraseña para completar el restablecimiento
          </p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Nueva Contraseña
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              minlength="6"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Contraseña
            </label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              required
              minlength="6"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="Confirma tu nueva contraseña"
            />
          </div>

          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="w-full btn-primary flex items-center justify-center disabled:opacity-50"
          >
            <span v-if="loading" class="mr-2">
              <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ loading ? 'Actualizando...' : 'Actualizar Contraseña' }}
          </button>
        </form>

        <!-- Success Message -->
        <div v-if="success" class="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-xl">
          <div class="flex items-center">
            <span class="text-primary-500 mr-2">✅</span>
            <p class="text-primary-700">
              Tu contraseña ha sido actualizada exitosamente.
            </p>
          </div>
          <div class="mt-4">
            <NuxtLink to="/login" class="btn-primary text-sm">
              Iniciar Sesión
            </NuxtLink>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div class="flex items-center">
            <span class="text-red-500 mr-2">❌</span>
            <p class="text-red-700">{{ error }}</p>
          </div>
        </div>

        <!-- Password Requirements -->
        <div v-if="!success" class="mt-6 p-4 bg-gray-50 rounded-xl">
          <h4 class="text-sm font-medium text-gray-700 mb-2">Requisitos de la contraseña:</h4>
          <ul class="text-sm text-gray-600 space-y-1">
            <li class="flex items-center">
              <span :class="password.length >= 6 ? 'text-green-500' : 'text-gray-400'" class="mr-2">
                {{ password.length >= 6 ? '✓' : '○' }}
              </span>
              Mínimo 6 caracteres
            </li>
            <li class="flex items-center">
              <span :class="password === confirmPassword && password.length > 0 ? 'text-green-500' : 'text-gray-400'" class="mr-2">
                {{ password === confirmPassword && password.length > 0 ? '✓' : '○' }}
              </span>
              Las contraseñas coinciden
            </li>
          </ul>
        </div>

        <!-- Back to Login -->
        <div v-if="!success" class="mt-8 text-center">
          <p class="text-gray-600">
            ¿Recordaste tu contraseña?
            <NuxtLink to="/login" class="text-primary-500 hover:text-primary-600 font-medium">
              Iniciar Sesión
            </NuxtLink>
          </p>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

useHead({
  title: 'Nueva Contraseña - Recomiéndame Coach',
  meta: [
    { name: 'description', content: 'Establece tu nueva contraseña para Recomiéndame Coach.' }
  ]
})

// Obtener token desde query params
const token = route.query.token

const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const success = ref(false)
const error = ref('')

// Validar que el token existe (solo en el cliente)
if (process.client && !token) {
  throw createError({
    statusCode: 400,
    statusMessage: 'Token de restablecimiento requerido'
  })
}

const isFormValid = computed(() => {
  return password.value.length >= 6 && password.value === confirmPassword.value
})

const handleSubmit = async () => {
  if (!isFormValid.value) {
    error.value = 'Por favor verifica que las contraseñas coincidan y tengan al menos 6 caracteres'
    return
  }

  loading.value = true
  error.value = ''
  success.value = false

  try {
    await $fetch('https://api-coach.recomiendameapp.cl/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: { 
        token: token,
        newPassword: password.value 
      }
    })
    
    success.value = true
    password.value = ''
    confirmPassword.value = ''
    
    // Redirigir al login después de 3 segundos
    setTimeout(() => {
      router.push('/login')
    }, 3000)
    
  } catch (err) {
    console.error('Error resetting password:', err)
    if (err.status === 400) {
      error.value = 'Token inválido o expirado. Por favor solicita un nuevo enlace de restablecimiento.'
    } else if (err.status === 422) {
      error.value = 'La contraseña no cumple con los requisitos mínimos.'
    } else {
      error.value = 'Hubo un error al actualizar tu contraseña. Por favor intenta de nuevo.'
    }
  } finally {
    loading.value = false
  }
}
</script>