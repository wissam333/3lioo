<script setup>
import { useAsyncData } from '#app'

const { data: posts } = await useAsyncData('posts', async () => {
  const { $content } = await import('@nuxt/content')
  return $content('posts').fetch()
})

console.log(posts)
</script>
