// https://nuxt.com/docs/api/configuration/nuxt-config
import nora from "@primevue/themes/nora";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",

  modules: [
    "@nuxtjs/i18n",
    "@nuxt/image",
    "nuxt-swiper",
    "nuxt-aos",
    "@nuxt/icon",
    "@primevue/nuxt-module",
    "@vee-validate/nuxt",
    "@nuxtjs/fontaine",
    "@nuxt/content",
    "@nuxtjs/seo", // ✔ Nuxt SEO
  ],

  seo: {
    siteName: "3lioo Blog",
    siteUrl: "https://3lioo.netlify.app",

    // Recommended
    trailingSlash: false,
    indexable: true,

    sitemap: {
      enabled: true,
      sources: [], // Nuxt SEO auto-detects routes including /posts/:slug
    },
    robots: {
      enabled: true,
    },
  },

  i18n: {
    strategy: "no_prefix",
    langDir: "locales/",
    defaultLocale: "en",
    locales: [
      {
        code: "ar",
        iso: "ar-EG",
        name: "العربية",
        file: "ar.json",
        dir: "rtl",
      },
      {
        code: "en",
        iso: "en-US",
        name: "English",
        file: "en.json",
        dir: "ltr",
      },
    ],
    detectBrowserLanguage: false,
  },

  veeValidate: {
    autoImports: true,
  },

  primevue: {
    options: {
      theme: { preset: nora },
    },
    components: {
      include: [],
    },
  },

  css: [
    "bootstrap/dist/css/bootstrap.min.css",
    "@/assets/scss/main.scss",
    "awesome-notifications/dist/style.css",
  ],

  build: {
    cssMinify: true,
    postcss: {
      plugins: {
        cssnano: { preset: "default" },
      },
    },
  },

  image: {
    provider: "ipx",
    domains: ["https://3lioo.netlify.app"],
    format: ["webp"],
    quality: 80,
  },

  aos: {
    disable: false,
    startEvent: "DOMContentLoaded",
    initClassName: "aos-init",
    animatedClassName: "aos-animate",
    offset: 60,
    duration: 800,
    easing: "linear",
    once: true,
  },

  app: {
    baseURL: "/",
    head: {
      title: "3lioo Blog",
      htmlAttrs: { lang: "en" },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "Ugarit Center" },
      ],
      link: [
        {
          rel: "icon",
          href: "/logo/logo.png",
          type: "image/x-icon",
        },
      ],
    },
  },

  runtimeConfig: {},
  devtools: { enabled: true },
});
