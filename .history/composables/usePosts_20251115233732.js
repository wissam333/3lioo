// composables/usePosts.js
export const usePosts = () => {
  const getPosts = async () => {
    // useContent is available in setup or async setup context
    const posts = await $content('posts')
      .sortBy('date', 'desc')
      .fetch()
    return posts
  }

  const getPostBySlug = async (slug) => {
    const post = await $content('posts', slug).fetch()
    return post
  }

  return { getPosts, getPostBySlug }
}
