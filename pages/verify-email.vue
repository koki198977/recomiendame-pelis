<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="bg-white rounded-3xl shadow-soft p-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-medium">
            <span class="text-white text-2xl">📧</span>
          </div>
          <h2 class="text-3xl font-bold text-gray-900">Verificar Email</h2>
          <p class="mt-2 text-gray-600">
            Confirma tu dirección de correo electrónico para activar tu cuenta
          </p>
        </div>

        <!-- Status Messages -->
        <div v-if="status === 'verifying'" class="text-center">
          <div class="flex items-center justify-center mb-4">
            <svg class="animate-spin h-8 w-8 text-primary-500" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p class="text-gray-600">Verificando tu email...</p>
        </div>

        <div v-else-if="status === 'success'" class="text-center">
          <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-primary-500 text-2xl">✅</span>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">¡Email Verificado!</h3>
          <p class="text-gray-600 mb-6">
            Tu cuenta ha sido activada exitosamente. Ya puedes usar todas las funciones de Recomiéndame Coach.
          </p>
          <NuxtLink to="/download" class="btn-primary w-full">
            📱 Abrir la App
          </NuxtLink>
        </div>

        <div v-else-if="status === 'error'" class="text-center">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-red-500 text-2xl">❌</span>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Error de Verificación</h3>
          <p class="text-gray-600 mb-6">
            {{ errorMessage || 'El enlace de verificación no es válido o ha expirado.' }}
          </p>
          <button @click="resendVerification" :disabled="resending" class="btn-secondary w-full mb-4">
            <span v-if="resending" class="mr-2">
              <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ resending ? 'Enviando...' : 'Reenviar Verificación' }}
          </button>
        </div>

        <div v-else class="text-center">
          <p class="text-gray-600 mb-6">
            Revisa tu correo electrónico y haz clic en el enlace de verificación que te enviamos.
          </p>
          
          <!-- Resend Form -->
          <div class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                ¿No recibiste el email? Ingresa tu correo:
              </label>
              <input
                id="email"
                v-model="email"
                type="email"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="tu@email.com"
              />
            </div>
            <button 
              @click="resendVerification" 
              :disabled="resending || !email"
              class="btn-secondary w-full"
            >
              <span v-if="resending" class="mr-2">
                <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ resending ? 'Enviando...' : 'Reenviar Email de Verificación' }}
            </button>
          </div>
        </div>

        <!-- Resend Success -->
        <div v-if="resendSuccess" class="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-xl">
          <div class="flex items-center">
            <span class="text-primary-500 mr-2">✅</span>
            <p class="text-primary-700">
              Se ha enviado un nuevo email de verificación.
            </p>
          </div>
        </div>

        <!-- Back to Home -->
        <div class="mt-8 pt-6 border-t border-gray-200 text-center">
          <NuxtLink to="/" class="text-primary-500 hover:text-primary-600 font-medium">
            ← Volver al Inicio
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Verificar Email - Recomiéndame Coach',
  meta: [
    { name: 'description', content: 'Verifica tu dirección de correo electrónico para activar tu cuenta de Recomiéndame Coach y acceder a todas las funciones.' }
  ]
})

const route = useRoute()
const email = ref('')
const status = ref('pending') // pending, verifying, success, error
const errorMessage = ref('')
const resending = ref(false)
const resendSuccess = ref(false)

// Verificar token si existe en la URL
onMounted(async () => {
  const token = route.query.token
  if (token) {
    await verifyToken(token)
  }
})

const verifyToken = async (token) => {
  status.value = 'verifying'
  
  try {
    // Simular verificación
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Aquí iría la llamada real a tu API
    // const result = await $fetch('/api/auth/verify-email', {
    //   method: 'POST',
    //   body: { token }
    // })
    
    // Simular éxito o error aleatoriamente para demo
    if (Math.random() > 0.3) {
      status.value = 'success'
    } else {
      status.value = 'error'
      errorMessage.value = 'El enlace de verificación ha expirado.'
    }
  } catch (error) {
    status.value = 'error'
    errorMessage.value = 'Hubo un error al verificar tu email.'
  }
}

const resendVerification = async () => {
  if (!email.value && status.value !== 'error') return
  
  resending.value = true
  resendSuccess.value = false
  
  try {
    // Simular reenvío
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Aquí iría la llamada real a tu API
    // await $fetch('/api/auth/resend-verification', {
    //   method: 'POST',
    //   body: { email: email.value }
    // })
    
    resendSuccess.value = true
    email.value = ''
  } catch (error) {
    // Manejar error
  } finally {
    resending.value = false
  }
}
</script>