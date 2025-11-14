export default defineEventHandler(async (event) => {
  const slug = event.context.params.slug;
  try {
    const post = await getPostBySlug(slug); // your function
    if (!post) {
      throw createError({ statusCode: 404, statusMessage: "Post not found" });
    }

    // increment visit count
    post.visits = (post.visits || 0) + 1;
    await post.save();

    return { success: true };
  } catch (err) {
    console.error("Visit API error:", err);
    throw createError({ statusCode: 500, statusMessage: err.message });
  }
});
