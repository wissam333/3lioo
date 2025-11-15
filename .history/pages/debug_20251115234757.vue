<script setup>
import { ref, onMounted } from 'vue'
import { usePosts } from '~/composables/useAllPosts'

const posts = ref([])
const { getPosts } = usePosts()

onMounted(async () => {
  posts.value = await getPosts('my-current-slug') // exclude current post
})
</script>

<template>
  <div v-for="post in posts" :key="post.slug">
    <h2>{{ post.title }}</h2>
    <p>{{ post.excerpt }}</p>
  </div>
</template>
