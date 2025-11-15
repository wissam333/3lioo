// composables/usePosts.js
export const usePosts = () => {
  const getPosts = async (excludeSlug = null, limit = 4) => {
    let query = $content('posts').sortBy('date', 'desc')
    if (excludeSlug) query = query.where({ slug: { $ne: excludeSlug } })
    const posts = await query.fetch()
    return limit ? posts.slice(0, limit) : posts
  }
  const getPostBySlug = async (slug) => await $content('posts', slug).fetch()
  return { getPosts, getPostBySlug }
}
