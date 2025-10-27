// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],
  css: ["~/assets/css/main.css"],
  nitro: {
    preset: "static",
    prerender: {
      failOnError: false,
      ignore: ['/reset-password']
    }
  },
  app: {
    head: {
      title: "Recomiéndame Coach - Tu Coach Nutricional con IA",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description",
          name: "description",
          content:
            "Recomiéndame Coach es tu asistente nutricional personalizado con inteligencia artificial. Obtén planes de alimentación personalizados, seguimiento de progreso y una comunidad de apoyo.",
        },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },
});
