<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="bg-white rounded-3xl shadow-soft p-8 mb-8">
        <div class="text-center">
          <div class="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-medium">
            <span class="text-white text-2xl">🔒</span>
          </div>
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Política de Privacidad</h1>
          <p class="text-xl text-gray-600">
            En Recomiéndame Coach, tu privacidad es nuestra prioridad
          </p>
          <p class="text-sm text-gray-500 mt-2">
            Última actualización: {{ lastUpdated }}
          </p>
        </div>
      </div>

      <!-- Content -->
      <div class="bg-white rounded-3xl shadow-soft p-8 space-y-8">
        <!-- Introducción -->
        <section>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">1. Introducción</h2>
          <p class="text-gray-700 leading-relaxed">
            Esta Política de Privacidad describe cómo Recomiéndame Coach ("nosotros", "nuestro" o "la aplicación") 
            recopila, usa y protege tu información personal cuando utilizas nuestra aplicación móvil y servicios web.
          </p>
        </section>

        <!-- Información que recopilamos -->
        <section>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">2. Información que Recopilamos</h2>
          
          <h3 class="text-xl font-semibold text-gray-800 mb-3">2.1 Información Personal</h3>
          <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>Nombre completo y dirección de correo electrónico</li>
            <li>Información demográfica (edad, género, ubicación general)</li>
            <li>Datos de salud y objetivos nutricionales</li>
            <li>Preferencias alimentarias y restricciones dietéticas</li>
            <li>Medidas corporales y progreso de salud</li>
          </ul>

          <h3 class="text-xl font-semibold text-gray-800 mb-3">2.2 Información de Uso</h3>
          <ul class="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>Datos de interacción con la aplicación</li>
            <li>Registros de actividad y seguimiento nutricional</li>
            <li>Información del dispositivo y sistema operativo</li>
            <li>Datos de ubicación aproximada (si es autorizada)</li>
          </ul>
        </section>

        <!-- Cómo usamos tu información -->
        <section>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">3. Cómo Usamos tu Información</h2>
          <ul class="list-disc list-inside text-gray-700 space-y-2">
            <li>Crear y personalizar tu plan nutricional con inteligencia artificial</li>
            <li>Proporcionar recomendaciones alimentarias personalizadas</li>
            <li>Hacer seguimiento de tu progreso y objetivos de salud</li>
            <li>Mejorar nuestros servicios y funcionalidades</li>
            <li>Enviar notificaciones importantes sobre tu cuenta</li>
            <li>Proporcionar soporte técnico y atención al cliente</li>
            <li>Cumplir con obligaciones legales y regulatorias</li>
          </ul>
        </section>

        <!-- Compartir información -->
        <section>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">4. Compartir tu Información</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            No vendemos, alquilamos ni compartimos tu información personal con terceros, excepto en las siguientes circunstancias:
          </p>
          <ul class="list-disc list-inside text-gray-700 space-y-2">
            <li>Con tu consentimiento explícito</li>
            <li>Para cumplir con obligaciones legales</li>
            <li>Con proveedores de servicios que nos ayudan a operar la aplicación</li>
            <li>En caso de fusión, adquisición o venta de activos</li>
            <li>Para proteger nuestros derechos legales o la seguridad de los usuarios</li>
          </ul>
        </section>

        <!-- Seguridad de datos -->
        <section>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">5. Seguridad de los Datos</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal:
          </p>
          <ul class="list-disc list-inside text-gray-700 space-y-2">
            <li>Encriptación de datos en tránsito y en reposo</li>
            <li>Acceso restringido a información personal</li>
            <li>Monitoreo continuo de seguridad</li>
            <li>Auditorías regulares de seguridad</li>
            <li>Capacitación del personal en protección de datos</li>
          </ul>
        </section>

        <!-- Tus derechos -->
        <section>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">6. Tus Derechos</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Tienes los siguientes derechos respecto a tu información personal:
          </p>
          <ul class="list-disc list-inside text-gray-700 space-y-2">
            <li><strong>Acceso:</strong> Solicitar una copia de tu información personal</li>
            <li><strong>Rectificación:</strong> Corregir información inexacta o incompleta</li>
            <li><strong>Eliminación:</strong> Solicitar la eliminación de tu información personal</li>
            <li><strong>Portabilidad:</strong> Recibir tu información en un formato estructurado</li>
            <li><strong>Oposición:</strong> Oponerte al procesamiento de tu información</li>
            <li><strong>Limitación:</strong> Solicitar la limitación del procesamiento</li>
          </ul>
        </section>

        <!-- Retención de datos -->
        <section>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">7. Retención de Datos</h2>
          <p class="text-gray-700 leading-relaxed">
            Conservamos tu información personal solo durante el tiempo necesario para cumplir con los propósitos 
            descritos en esta política, a menos que la ley requiera un período de retención más largo. 
            Cuando elimines tu cuenta, procederemos a eliminar o anonimizar tu información personal de manera segura.
          </p>
        </section>

        <!-- Cookies y tecnologías similares -->
        <section>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">8. Cookies y Tecnologías Similares</h2>
          <p class="text-gray-700 leading-relaxed mb-4">
            Utilizamos cookies y tecnologías similares para:
          </p>
          <ul class="list-disc list-inside text-gray-700 space-y-2">
            <li>Mantener tu sesión activa</li>
            <li>Recordar tus preferencias</li>
            <li>Analizar el uso de la aplicación</li>
            <li>Mejorar la experiencia del usuario</li>
          </ul>
        </section>

        <!-- Menores de edad -->
        <section>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">9. Menores de Edad</h2>
          <p class="text-gray-700 leading-relaxed">
            Nuestra aplicación no está dirigida a menores de 18 años. No recopilamos conscientemente 
            información personal de menores de edad. Si descubrimos que hemos recopilado información 
            de un menor, la eliminaremos inmediatamente.
          </p>
        </section>

        <!-- Cambios en la política -->
        <section>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">10. Cambios en esta Política</h2>
          <p class="text-gray-700 leading-relaxed">
            Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos sobre 
            cambios significativos a través de la aplicación o por correo electrónico. 
            Te recomendamos revisar esta política periódicamente.
          </p>
        </section>

      </div>

      <!-- Back to home -->
      <div class="text-center mt-8">
        <NuxtLink to="/" class="btn-primary">
          ← Volver al Inicio
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Política de Privacidad - Recomiéndame Coach',
  meta: [
    {
      name: 'description',
      content: 'Conoce cómo Recomiéndame Coach protege tu información personal y respeta tu privacidad.'
    }
  ]
})

const lastUpdated = 'Enero 2025'
</script>