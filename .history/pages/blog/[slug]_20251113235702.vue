<template>
  <div>
    <article>
      <h1>{{ post.title }}</h1>
      <nuxt-content :document="post" />
    </article>
  </div>
</template>

<script setup>
const route = useRoute()
const { data: post } = await useAsyncData(() =>
  $content('posts', { deep: true }).where({ slug: route.params.slug }).fetch().then(p => p[0])
)
</script>
