<template>
  <div>
    <ClientOnly>
      <div id="ncms"></div>
    </ClientOnly>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false,
});

useHead({
  title: "Admin Dashboard",
});

onMounted(async () => {
  // Wait for next tick to ensure DOM is ready
  await nextTick();

  // Dynamically import Decap CMS
  const CMS = await import("decap-cms");

  // Initialize with a small delay to ensure DOM is fully ready
  setTimeout(() => {
    CMS.init();

    // Register preview styles if needed
    if (typeof CMS.registerPreviewStyle === "function") {
      CMS.registerPreviewStyle("/admin-preview.css");
    }
  }, 100);
});
</script>

<style scoped>
#ncms {
  height: 100vh;
  width: 100%;
}
</style>
