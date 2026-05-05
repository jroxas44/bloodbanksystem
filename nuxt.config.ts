// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: false },
  modules: ["@nuxtjs/tailwindcss"],
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || "bloodbank-jwt-secret-change-in-production",
    databaseUrl: process.env.DATABASE_URL || "mysql://root:bloodbank123@localhost:3306/bloodbank",
  },
  app: {
    head: {
      title: "BloodBank Manager",
      meta: [
        { name: "description", content: "Blood Bank Management System" },
      ],
    },
  },
});
