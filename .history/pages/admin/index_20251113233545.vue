<template>
  <div>
    <div id="ncms"></div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false,
});

onMounted(() => {
  if (process.client) {
    // Create script tag to load Decap CMS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js";
    script.onload = () => {
      if (window.CMS) {
        window.CMS.init();
        console.log("Decap CMS loaded successfully");
      }
    };
    document.head.appendChild(script);
  }
});
</script>

<style>
body {
  margin: 0;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
</style>
