<template>
  <div>
    <ScrollToTop />
    <ElementsLoader />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
useHead({
  title: "3lioo Blog",
});
</script>

<style lang="scss" scoped></style>
