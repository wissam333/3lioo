<template>
  <div>
    <div id="ncms"></div>
  </div>
</template>

<script setup>
// This page is client-side only
definePageMeta({
  layout: false,
});

useHead({
  title: "Admin Dashboard",
});

onMounted(() => {
  if (process.client) {
    // Dynamically import Decap CMS
    import("decap-cms").then((CMS) => {
      // Initialize the CMS
      CMS.init();

      // Optional: Add custom preview styles
      CMS.registerPreviewStyle("/admin-preview.css");
    });
  }
});
</script>

<style>
/* Hide the default layout for admin page */
#ncms {
  height: 100vh;
}
</style>
