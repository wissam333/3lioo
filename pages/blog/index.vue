<template>
  <div>
    <h1>Blog</h1>
    <ul>
      <li v-for="post in posts" :key="post._path">
        <NuxtLink :to="`/blog/${post.slug}`">{{ post.title }}</NuxtLink>
        <small>{{ post.date }}</small>
      </li>
    </ul>
  </div>
</template>

<script setup>
const { data: posts } = await useAsyncData('posts', () =>
  $content('posts').sortBy('date', 'desc').fetch()
)
</script>
