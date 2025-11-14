<template>
  <div>
    <h1>Debug Content</h1>
    <pre>{{ posts }}</pre>
  </div>
</template>

<script setup>
const { data: posts } = await useAsyncData('posts', () => useContent('posts').fetch())
console.log(posts.value)
</script>
