<template>
  <div>
    <h1>Debug Content</h1>
    <pre>{{ posts }}</pre>
  </div>
</template>

<script setup>
const posts = await useContent('posts').fetch()
console.log(posts)
</script>
