<template>
  <div>
    <h1>All Posts</h1>
    <pre>{{ posts }}</pre>
  </div>
</template>

<script setup>
import { queryContent } from '@nuxt/content'

// Wrap in asyncData to fetch SSR-friendly
const { data: posts, error } = await useAsyncData('posts', async () => {
  try {
    const all = await queryContent('posts').sort({ date: -1 }).find()
    console.log('Posts fetched:', all)
    return all
  } catch (err) {
    console.error('QueryContent error:', err)
    return []
  }
})
</script>
