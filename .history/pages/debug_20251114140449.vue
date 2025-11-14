<template>
  <div>
    <h1>All Posts</h1>
    <pre>{{ posts }}</pre>
  </div>
</template>

<script setup>
const { data: posts, error } = await useAsyncData('posts', () =>
  // useContent is globally available
  useContent('posts')
    .sort({ date: -1 })
    .find()
)

if (error.value) {
  console.error('Content fetch error:', error.value)
}
</script>
