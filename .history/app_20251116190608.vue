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
const {
  public: { api, apiBase },
} = useRuntimeConfig();

useHead({
  title: "3lioo Blog",
});
</script>

<style lang="scss" scoped></style>
