<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="bg-white rounded-3xl shadow-soft p-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-medium">
            <span class="text-white text-2xl">🗑️</span>
          </div>
          <h2 class="text-3xl font-bold text-gray-900">Eliminar Cuenta</h2>
          <p class="mt-2 text-gray-600">
            Esta acción eliminará permanentemente tu cuenta y todos tus datos
          </p>
        </div>

        <!-- Warning -->
        <div class="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div class="flex items-start">
            <span class="text-red-500 mr-2 mt-0.5">⚠️</span>
            <div>
              <h3 class="text-red-800 font-semibold mb-2">¡Atención!</h3>
              <p class="text-red-700 text-sm">
                Al eliminar tu cuenta se borrarán permanentemente:
              </p>
              <ul class="text-red-700 text-sm mt-2 space-y-1">
                <li>• Tu perfil y datos personales</li>
                <li>• Todos tus planes nutricionales</li>
                <li>• Historial de progreso y check-ins</li>
                <li>• Posts y comentarios en la comunidad</li>
                <li>• Conexiones con otros usuarios</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Confirma tu correo electrónico
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

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Confirma tu contraseña
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              placeholder="Tu contraseña actual"
            />
          </div>

          <div>
            <label for="reason" class="block text-sm font-medium text-gray-700 mb-2">
              ¿Por qué quieres eliminar tu cuenta? (opcional)
            </label>
            <select
              id="reason"
              v-model="reason"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            >
              <option value="">Selecciona una razón</option>
              <option value="no-longer-needed">Ya no necesito la app</option>
              <option value="privacy-concerns">Preocupaciones de privacidad</option>
              <option value="technical-issues">Problemas técnicos</option>
              <option value="found-alternative">Encontré una alternativa</option>
              <option value="other">Otra razón</option>
            </select>
          </div>

          <div v-if="reason === 'other'">
            <label for="otherReason" class="block text-sm font-medium text-gray-700 mb-2">
              Cuéntanos más (opcional)
            </label>
            <textarea
              id="otherReason"
              v-model="otherReason"
              rows="3"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              placeholder="Tu feedback nos ayuda a mejorar..."
            ></textarea>
          </div>

          <div class="flex items-start">
            <input
              id="confirm"
              v-model="confirmDelete"
              type="checkbox"
              required
              class="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label for="confirm" class="ml-2 text-sm text-gray-700">
              Entiendo que esta acción es irreversible y acepto eliminar permanentemente mi cuenta y todos mis datos.
            </label>
          </div>

          <button
            type="submit"
            :disabled="loading || !confirmDelete"
            class="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-200 shadow-soft hover:shadow-medium flex items-center justify-center"
          >
            <span v-if="loading" class="mr-2">
              <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ loading ? 'Eliminando cuenta...' : 'Eliminar mi cuenta permanentemente' }}
          </button>
        </form>

        <!-- Success Message -->
        <div v-if="success" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div class="flex items-center">
            <span class="text-green-500 mr-2">✅</span>
            <div>
              <p class="text-green-700 font-medium">Cuenta eliminada exitosamente</p>
              <p class="text-green-600 text-sm mt-1">
                Tu cuenta y todos los datos han sido eliminados. Gracias por usar Recomiéndame Coach.
              </p>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div class="flex items-center">
            <span class="text-red-500 mr-2">❌</span>
            <p class="text-red-700">{{ error }}</p>
          </div>
        </div>

        <!-- Alternative Actions -->
        <div v-if="!success" class="mt-8 pt-6 border-t border-gray-200">
          <p class="text-center text-gray-600 mb-4">¿Cambió de opinión?</p>
          <div class="flex flex-col sm:flex-row gap-3">
            <NuxtLink to="/" class="btn-secondary text-center flex-1">
              Volver al Inicio
            </NuxtLink>
            <NuxtLink to="/contact" class="btn-primary text-center flex-1">
              Contactar Soporte
            </NuxtLink>
          </div>
        </div>

        <!-- Return to Home after success -->
        <div v-if="success" class="mt-8 pt-6 border-t border-gray-200 text-center">
          <NuxtLink to="/" class="btn-primary">
            Ir al Inicio
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Eliminar Cuenta - Recomiéndame Coach',
  meta: [
    { name: 'description', content: 'Elimina permanentemente tu cuenta de Recomiéndame Coach. Esta acción borrará todos tus datos y no se puede deshacer.' }
  ]
})

const email = ref('')
const password = ref('')
const reason = ref('')
const otherReason = ref('')
const confirmDelete = ref(false)
const loading = ref(false)
const success = ref(false)
const error = ref('')

const handleSubmit = async () => {
  if (!email.value || !password.value || !confirmDelete.value) {
    error.value = 'Por favor completa todos los campos requeridos'
    return
  }

  loading.value = true
  error.value = ''
  success.value = false

  try {
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Aquí iría la llamada real a tu API
    // await $fetch('/api/auth/delete-account', {
    //   method: 'DELETE',
    //   body: { 
    //     email: email.value,
    //     password: password.value,
    //     reason: reason.value,
    //     otherReason: otherReason.value
    //   }
    // })
    
    success.value = true
    
    // Limpiar formulario
    email.value = ''
    password.value = ''
    reason.value = ''
    otherReason.value = ''
    confirmDelete.value = false
    
  } catch (err) {
    error.value = 'Hubo un error al eliminar la cuenta. Verifica tus credenciales e intenta de nuevo.'
  } finally {
    loading.value = false
  }
}
</script>