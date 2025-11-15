export const usePosts = () => {
  const getPosts = async () => {
    return await useContent('posts')
      .sort({ date: -1 }) // descending by date
      .fetch()
  }

  const getPostBySlug = async (slug) => {
    return await useContent('posts', slug).fetch()
  }

  return { getPosts, getPostBySlug }
}
