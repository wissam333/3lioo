export const usePosts = () => {
  const getPosts = async () => {
    const { $content } = useNuxtApp();
    return await $content("posts").sortBy("date", "desc").fetch();
  };

  const getPostBySlug = async (slug) => {
    const { $content } = useNuxtApp();
    return await $content("posts", slug).fetch();
  };

  return { getPosts, getPostBySlug };
};
