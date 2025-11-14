<template>
  <div>
    <h1>All Posts</h1>
    <pre>{{ posts }}</pre>
  </div>
</template>

<script setup>
import { queryContent } from '@nuxt/content'

const { data: posts } = await useAsyncData('posts', async () => {
  try {
    return await queryContent('posts').sort({ date: -1 }).find()
  } catch (err) {
    console.error('QueryContent error:', err)
    return []
  }
})

console.log(posts.value)
</script>
