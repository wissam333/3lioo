<script setup>
const { data: posts } = await useFetch('/api/posts.get')
</script>

<template>
  <div>
    <h1>All Posts</h1>
    <pre>{{ posts }}</pre>
  </div>
</template>
