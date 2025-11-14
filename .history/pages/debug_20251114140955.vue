<script setup>
const { data: posts } = await useFetch('/api/posts')
</script>

<template>
  <div>
    <h1>All Posts</h1>
    <pre>{{ posts }}</pre>
  </div>
</template>
