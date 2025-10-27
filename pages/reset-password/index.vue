<template>
  <div>
    <!-- Mostrar formulario de nueva contraseña si hay token -->
    <div v-if="token" class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div class="bg-white rounded-3xl shadow-soft p-8">
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
          <form @submit.prevent="handleResetSubmit" class="space-y-6">
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
        </div>
      </div>
    </div>

    <!-- Mostrar formulario de solicitud si no hay token -->
    <div v-else class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
          <form @submit.prevent="handleRequestSubmit" class="space-y-6">
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
              :disabled="requestLoading"
              class="w-full btn-primary flex items-center justify-center"
            >
              <span v-if="requestLoading" class="mr-2">
                <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ requestLoading ? 'Enviando...' : 'Enviar Enlace de Restablecimiento' }}
            </button>
          </form>

          <!-- Success Message -->
          <div v-if="requestSuccess" class="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-xl">
            <div class="flex items-center">
              <span class="text-primary-500 mr-2">✅</span>
              <p class="text-primary-700">
                Se ha enviado un enlace de restablecimiento a tu correo electrónico.
              </p>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="requestError" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div class="flex items-center">
              <span class="text-red-500 mr-2">❌</span>
              <p class="text-red-700">{{ requestError }}</p>
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
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

// Obtener token desde la URL o query params
const token = computed(() => {
  return route.params.token || route.query.token
})

useHead({
  title: computed(() => token.value ? 'Nueva Contraseña - Recomiéndame Coach' : 'Restablecer Contraseña - Recomiéndame Coach'),
  meta: [
    { 
      name: 'description', 
      content: computed(() => token.value ? 'Establece tu nueva contraseña para Recomiéndame Coach.' : 'Restablece tu contraseña de Recomiéndame Coach. Ingresa tu email y te enviaremos un enlace seguro para crear una nueva contraseña.')
    }
  ]
})

// Estados para reset de contraseña
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const success = ref(false)
const error = ref('')

// Estados para solicitud de reset
const email = ref('')
const requestLoading = ref(false)
const requestSuccess = ref(false)
const requestError = ref('')

const isFormValid = computed(() => {
  return password.value.length >= 6 && password.value === confirmPassword.value
})

// Manejar reset de contraseña
const handleResetSubmit = async () => {
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
        token: token.value,
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

// Manejar solicitud de reset
const handleRequestSubmit = async () => {
  if (!email.value) {
    requestError.value = 'Por favor ingresa tu correo electrónico'
    return
  }

  requestLoading.value = true
  requestError.value = ''
  requestSuccess.value = false

  try {
    await $fetch('https://api-coach.recomiendameapp.cl/auth/request-reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: { email: email.value }
    })
    
    requestSuccess.value = true
    email.value = ''
  } catch (err) {
    console.error('Error requesting password reset:', err)
    if (err.status === 404) {
      requestError.value = 'No se encontró una cuenta con ese correo electrónico.'
    } else if (err.status === 400) {
      requestError.value = 'Correo electrónico inválido.'
    } else {
      requestError.value = 'Hubo un error al enviar el enlace. Por favor intenta de nuevo.'
    }
  } finally {
    requestLoading.value = false
  }
}
</script>