<template>
  <div>
    <h1>Content Debug</h1>
    <pre>{{ posts }}</pre>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Use useAsyncData to fetch content
const { data: posts } = await useAsyncData('posts', () =>
  useContent('posts').fetch()
)

console.log(posts.value)
</script>
