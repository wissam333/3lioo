<template>
  <div>
    <h1>All Posts</h1>
    <pre>{{ posts }}</pre>
  </div>
</template>

<script setup>
import { useContent } from '@nuxt/content'
const { data: posts } = await useAsyncData("posts", () =>
  useContent("posts").sort({ date: -1 }).fetch()
);

console.log(posts.value);
</script>
