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
  ],
  ssr: true, // SSR enabled
  nitro: {
    preset: "netlify",
    prerender: ["/"],
  },
  content: {
    highlight: { theme: "github-dark" },
    navigation: true,
  },
  veeValidate: {
    // disable or enable auto imports
    autoImports: true,
    // Use different names for components
  },
  i18n: {
    strategy: "no_prefix", // بدون تغيير في الرابط
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
  primevue: {
    options: {
      theme: {
        preset: nora,
      },
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
        cssnano: {
          preset: "default",
        },
      },
    },
  },
  image: {
    provider: "ipx",
    domains: ["admin.schooltec.org"],
    format: ["webp"],
    quality: 80,
  },
  aos: {
    // Global settings:
    disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
    startEvent: "DOMContentLoaded", // name of the event dispatched on the document, that AOS should initialize on
    initClassName: "aos-init", // class applied after initialization
    animatedClassName: "aos-animate", // class applied on animation
    useClassNames: false, // if true, will add content of data-aos as classes on scroll
    disableMutationObserver: false, // disables automatic mutations' detections (advanced)
    debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
    throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)

    // Settings that can be overridden on per-element basis, by data-aos-* attributes:
    offset: 60, // offset (in px) from the original trigger point
    delay: 0, // values from 0 to 3000, with step 50ms
    duration: 800, // values from 0 to 3000, with step 50ms
    easing: "linear", // default easing for AOS animations
    once: true, // whether animation should happen only once - while scrolling down
    mirror: false, // whether elements should animate out while scrolling past them
    anchorPlacement: "top-bottom", // defines which position of the element regarding to window should trigger the animation
  },
  app: {
    baseURL: "/",
    head: {
      title: "3lioo Blog",
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "Ugarit Center" },
      ],
      link: [
        {
          rel: "icon",
          href: "/logo/bluelogo.png",
          type: "image/x-icon",
        },
        {
          rel: "preconnect",
          href: "https://3lioo.netlify.app",
          crossorigin: "",
        },
      ],
      script: [],
    },
  },
  runtimeConfig: {},
  devtools: { enabled: true },
});
