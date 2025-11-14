<template>
  <pre>{{ out }}</pre>
</template>

<script setup>
const { data: out } = await useAsyncData('content-debug', () =>
  queryContent().only(['_path','title','date']).find()
)
</script>
