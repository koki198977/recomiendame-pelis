<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="bg-white rounded-3xl shadow-soft p-8 lg:p-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-8">Términos y Condiciones</h1>
      
      <div class="prose prose-lg max-w-none">
        <p class="text-gray-600 mb-8">
          <strong>Última actualización:</strong> {{ new Date().toLocaleDateString('es-ES') }}
        </p>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">1. Aceptación de los Términos</h2>
          <p class="text-gray-700 leading-relaxed">
            Al acceder y utilizar la aplicación Recomiéndame Coach, usted acepta estar sujeto a estos términos y condiciones de uso. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestra aplicación.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">2. Descripción del Servicio</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Recomiéndame Coach es una aplicación de coaching nutricional que utiliza inteligencia artificial para proporcionar:
          </p>
          <ul class="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Planes nutricionales personalizados</li>
            <li>Seguimiento de progreso</li>
            <li>Recomendaciones alimentarias</li>
            <li>Funciones de comunidad social</li>
            <li>Herramientas de planificación de comidas</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">3. Registro y Cuenta de Usuario</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Para utilizar nuestros servicios, debe crear una cuenta proporcionando información precisa y completa. Usted es responsable de:
          </p>
          <ul class="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Mantener la confidencialidad de su contraseña</li>
            <li>Todas las actividades que ocurran bajo su cuenta</li>
            <li>Notificar inmediatamente cualquier uso no autorizado</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">4. Uso Aceptable</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Al utilizar Recomiéndame Coach, usted se compromete a:
          </p>
          <ul class="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Proporcionar información precisa sobre su salud y objetivos</li>
            <li>No compartir contenido ofensivo o inapropiado</li>
            <li>Respetar a otros usuarios de la comunidad</li>
            <li>No intentar acceder a cuentas de otros usuarios</li>
            <li>No utilizar la aplicación para fines comerciales no autorizados</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">5. Limitaciones de Responsabilidad</h2>
          <p class="text-gray-700 leading-relaxed">
            Recomiéndame Coach proporciona información y recomendaciones nutricionales con fines educativos. No somos un sustituto del consejo médico profesional. Siempre consulte con un profesional de la salud antes de realizar cambios significativos en su dieta o estilo de vida.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">6. Propiedad Intelectual</h2>
          <p class="text-gray-700 leading-relaxed">
            Todo el contenido de la aplicación, incluyendo textos, gráficos, logos, y software, es propiedad de Recomiéndame Coach y está protegido por las leyes de propiedad intelectual.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">7. Modificaciones</h2>
          <p class="text-gray-700 leading-relaxed">
            Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán efectivos inmediatamente después de su publicación en la aplicación.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">8. Contacto</h2>
          <p class="text-gray-700 leading-relaxed">
            Si tiene preguntas sobre estos términos y condiciones, puede contactarnos a través de nuestra página de contacto o enviando un correo electrónico a legal@recomiendamecoach.com
          </p>
        </section>
      </div>

      <div class="mt-12 pt-8 border-t border-gray-200">
        <div class="flex flex-col sm:flex-row gap-4">
          <NuxtLink to="/" class="btn-primary text-center">
            Volver al Inicio
          </NuxtLink>
          <NuxtLink to="/contact" class="btn-secondary text-center">
            Contactar Soporte
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Términos y Condiciones - Recomiéndame Coach',
  meta: [
    { name: 'description', content: 'Términos y condiciones de uso de Recomiéndame Coach. Conoce tus derechos y responsabilidades al utilizar nuestra aplicación de coaching nutricional.' }
  ]
})
</script>