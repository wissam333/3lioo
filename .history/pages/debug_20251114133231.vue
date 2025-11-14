<template>
  <pre>{{ data }}</pre>
</template>

<script setup>
const { data } = await useAsyncData("debug", () =>
  queryContent().find()
);
</script>
