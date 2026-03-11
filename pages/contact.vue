<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 text-white py-16 relative overflow-hidden">
      <div class="absolute inset-0 bg-black opacity-10"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center">
          <h1 class="text-4xl lg:text-6xl font-bold mb-6">¡Hablemos!</h1>
          <p class="text-xl lg:text-2xl text-primary-100">
            ¿Tienes preguntas, sugerencias o necesitas ayuda? Estamos aquí para apoyarte.
          </p>
        </div>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Contact Form -->
        <div class="bg-white rounded-3xl shadow-medium p-8">
          <div class="flex items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Envíanos un mensaje</h2>
            <span class="ml-3 text-3xl">💬</span>
          </div>
          
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  id="firstName"
                  v-model="form.firstName"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
                  Apellido *
                </label>
                <input
                  id="lastName"
                  v-model="form.lastName"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Tu apellido"
                />
              </div>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico *
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">
                Asunto *
              </label>
              <select
                id="subject"
                v-model="form.subject"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              >
                <option value="">Selecciona un tema</option>
                <option value="support">Soporte técnico</option>
                <option value="feedback">Comentarios y sugerencias</option>
                <option value="business">Consultas comerciales</option>
                <option value="privacy">Privacidad y datos</option>
                <option value="other">Otro</option>
              </select>
            </div>

            <div>
              <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
                Mensaje *
              </label>
              <textarea
                id="message"
                v-model="form.message"
                rows="5"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Cuéntanos cómo podemos ayudarte..."
              ></textarea>
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
              {{ loading ? 'Enviando...' : 'Enviar Mensaje' }}
            </button>
          </form>

          <!-- Success Message -->
          <div v-if="success" class="mt-6 p-6 bg-gradient-to-br from-primary-50 to-secondary-50 border-2 border-primary-300 rounded-2xl">
            <div class="flex items-start">
              <span class="text-4xl mr-3">🎉</span>
              <div>
                <p class="text-primary-700 font-semibold text-lg mb-1">¡Mensaje enviado exitosamente!</p>
                <p class="text-primary-600">
                  Te responderemos a <strong>{{ savedEmail }}</strong> en las próximas 24-48 horas.
                </p>
              </div>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="mt-6 p-6 bg-red-50 border-2 border-red-200 rounded-2xl">
            <div class="flex items-start">
              <span class="text-3xl mr-3">😔</span>
              <div>
                <p class="text-red-700 font-semibold mb-1">Oops, algo salió mal</p>
                <p class="text-red-600 text-sm">{{ error }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Info -->
        <div class="space-y-8">
          <!-- Contact Methods -->
          <div class="bg-white rounded-3xl shadow-medium p-8">
            <h3 class="text-xl font-bold text-gray-900 mb-6">Otras formas de contacto</h3>
            
            <div class="space-y-6">
              <div class="flex items-start">
                <div class="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <span class="text-primary-500 text-xl">�</span>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900">Redes Sociales</h4>
                  <p class="text-gray-600">@Recomiendame</p>
                  <p class="text-sm text-gray-500 mt-1">Instagram, Twitter, Facebook</p>
                </div>
              </div>
            </div>
          </div>

          <!-- FAQ Quick Links -->
          <div class="bg-white rounded-3xl shadow-medium p-8">
            <h3 class="text-xl font-bold text-gray-900 mb-6">Preguntas Frecuentes</h3>
            
            <div class="space-y-4">
              <div class="border-l-4 border-primary-500 pl-4">
                <h4 class="font-medium text-gray-900">¿Cómo funciona la IA?</h4>
                <p class="text-sm text-gray-600 mt-1">
                  Nuestra IA analiza tus gustos y preferencias para recomendarte películas y series perfectas para ti.
                </p>
              </div>

              <div class="border-l-4 border-secondary-500 pl-4">
                <h4 class="font-medium text-gray-900">¿Es seguro compartir mis datos?</h4>
                <p class="text-sm text-gray-600 mt-1">
                  Sí, utilizamos encriptación y cumplimos con todas las normativas de privacidad.
                </p>
              </div>

              <div class="border-l-4 border-primary-500 pl-4">
                <h4 class="font-medium text-gray-900">¿Puedo cancelar en cualquier momento?</h4>
                <p class="text-sm text-gray-600 mt-1">
                  Por supuesto, puedes eliminar tu cuenta cuando quieras desde la app.
                </p>
              </div>
            </div>

            <div class="mt-6 pt-6 border-t border-gray-200">
              <NuxtLink to="/terms" class="text-primary-500 hover:text-primary-600 font-medium text-sm">
                Ver todas las preguntas frecuentes →
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Contacto - Recomiéndame',
  meta: [
    { name: 'description', content: 'Contáctanos para resolver tus dudas sobre Recomiéndame. Soporte técnico, sugerencias y consultas comerciales. Estamos aquí para ayudarte.' }
  ]
})

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  subject: '',
  message: ''
})

const loading = ref(false)
const success = ref(false)
const error = ref('')
const savedEmail = ref('')

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  success.value = false

  // Guardar el email antes de limpiar
  savedEmail.value = form.value.email

  try {
    await $fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: form.value
    })
    
    success.value = true
    
    // Limpiar formulario
    form.value = {
      firstName: '',
      lastName: '',
      email: '',
      subject: '',
      message: ''
    }

    // Scroll al mensaje de éxito
    setTimeout(() => {
      const successElement = document.querySelector('.bg-gradient-to-br')
      if (successElement) {
        successElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
    
  } catch (err: any) {
    console.error('Error al enviar mensaje:', err)
    error.value = err.data?.statusMessage || 'Hubo un error al enviar el mensaje. Por favor intenta de nuevo o escríbenos directamente a recomiendameappcl@gmail.com'
  } finally {
    loading.value = false
  }
}
</script>