<template>
  <div>
    <div id="ncms-root"></div>
  </div>
</template>

<script setup>
// This page must be client-side only
definePageMeta({
  layout: false,
});

useHead({
  title: "Admin Dashboard",
  script: [
    {
      src: "https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js",
      body: true,
    },
  ],
});

onMounted(() => {
  // Check if we're in browser and CMS is available
  if (process.client && window.CMS) {
    window.CMS.init();

    // Register the preview styles
    window.CMS.registerPreviewStyle("/admin-preview.css");

    console.log("Decap CMS initialized successfully");
  }
});
</script>

<style>
/* Reset any Nuxt layout styles that might interfere */
body,
html {
  margin: 0;
  padding: 0;
  height: 100%;
}

#ncms-root {
  height: 100vh;
}
</style>
