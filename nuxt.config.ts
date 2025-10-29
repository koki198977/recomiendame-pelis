// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "https://api.recomiendameapp.cl",
      deleteAccountConfirmUrl:
        process.env.NUXT_PUBLIC_DELETE_ACCOUNT_CONFIRM_URL ||
        "https://www.recomiendameapp.cl/delete-account/confirm",
    },
  },
  nitro: {
    preset: "static",
    prerender: {
      failOnError: false,
      routes: ['/reset-password', '/delete-account', '/request-delete-account', '/verify-email'],
      ignore: ['/auth/verify-email']
    }
  },
  app: {
    head: {
      title: "Recomiéndame | Tu copiloto de streaming con IA",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description",
          name: "description",
          content:
            "Recomiéndame aprende de lo que viste, entiende tus gustos y te sugiere películas y series a tu medida. Disponible en web, Android e iOS.",
        },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },
});
