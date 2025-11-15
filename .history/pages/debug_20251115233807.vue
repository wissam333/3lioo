<script setup>
import { ref, onMounted } from 'vue'

const posts = ref([])

onMounted(async () => {
  posts.value = await $content('posts')
    .sortBy('date', 'desc')
    .fetch()
})
</script>

<template>
  <div v-for="post in posts" :key="post.slug">
    <h2>{{ post.title }}</h2>
  </div>
</template>
