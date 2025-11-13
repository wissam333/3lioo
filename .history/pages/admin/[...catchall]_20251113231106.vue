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
    import("decap-cms").then((CMS) => {
      CMS.init();
    });
  }
});
</script>
