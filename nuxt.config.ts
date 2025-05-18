// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: process.env.NODE_ENV === 'dev' },

  modules: [
    "@nuxt/ui",
    "@nuxtjs/color-mode",
    "@nuxt/eslint",
    "@pinia/nuxt",
    "@nuxt/icon",
  ],

  colorMode: {
    preference: "system", // Standardmäßig systemeigen
    fallback: "light", // Fallback falls nicht erkannt
    classSuffix: "", // kein -dark oder -light, nur .dark und .light
  },

  ui: {
    // colorMode: false // disable the color-mode module
  },

  css: ["~/assets/css/main.css"],

  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: "2024-11-27",

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
    },
  },
});
