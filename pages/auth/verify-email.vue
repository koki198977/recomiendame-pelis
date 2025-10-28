<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="bg-white rounded-3xl shadow-soft p-8">
        <div class="text-center">
          <div class="flex items-center justify-center mb-4">
            <svg class="animate-spin h-8 w-8 text-primary-500" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p class="text-gray-600">Redirigiendo...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

// Redirigir a la página principal de verify-email con el token
onMounted(() => {
  const token = route.query.token
  if (token) {
    router.push(`/verify-email?token=${token}`)
  } else {
    router.push('/verify-email')
  }
})
</script>