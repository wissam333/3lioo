<script setup>
import { queryContent } from '#content'   
const posts = await queryContent().find()
console.log("All posts:", posts)

// Try a specific one
const post = await queryContent('/2025-11-13-title').findOne()
console.log("Single post:", post)
</script>

<template>
  <div>
    <pre>{{ posts }}</pre>
  </div>
</template>
