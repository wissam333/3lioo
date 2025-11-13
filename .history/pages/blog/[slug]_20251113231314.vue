<template>
  <div class="container">
    <div v-if="pending">Loading...</div>
    <div v-else-if="error || !post">
      <h1>Post not found</h1>
      <p>The blog post you're looking for doesn't exist.</p>
      <NuxtLink to="/blog">← Back to all posts</NuxtLink>
    </div>
    <article v-else class="blog-post">
      <header class="post-header">
        <NuxtLink to="/blog" class="back-link">← Back to all posts</NuxtLink>
        <h1>{{ post.title }}</h1>
        <p class="post-meta">Published on {{ formatDate(post.date) }}</p>
        <img
          v-if="post.image"
          :src="post.image"
          :alt="post.title"
          class="featured-image"
        />
      </header>

      <div class="post-content">
        <ContentRenderer :value="post" />
      </div>

      <footer class="post-footer">
        <NuxtLink to="/blog">← Back to all posts</NuxtLink>
      </footer>
    </article>
  </div>
</template>

<script setup>
const route = useRoute();

// Fetch the specific post
const {
  data: post,
  pending,
  error,
} = await useAsyncData(`post-${route.path}`, () => {
  return queryContent(route.path).findOne();
});

// Handle 404 if post not found
if (!post.value && !pending.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Post not found",
  });
}

// Set page meta
useSeoMeta({
  title: post.value?.title,
  description: post.value?.description,
  ogImage: post.value?.image,
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.back-link {
  color: #3b82f6;
  text-decoration: none;
  margin-bottom: 1rem;
  display: inline-block;
}

.post-header {
  margin-bottom: 2rem;
}

.post-header h1 {
  font-size: 2.5rem;
  color: #1f2937;
  margin-bottom: 1rem;
}

.post-meta {
  color: #6b7280;
  font-size: 1rem;
  margin-bottom: 2rem;
}

.featured-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.post-content {
  line-height: 1.8;
  font-size: 1.125rem;
  color: #374151;
}

.post-content :deep(h2) {
  font-size: 1.875rem;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  color: #1f2937;
}

.post-content :deep(h3) {
  font-size: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #1f2937;
}

.post-content :deep(p) {
  margin-bottom: 1.5rem;
}

.post-content :deep(blockquote) {
  border-left: 4px solid #3b82f6;
  padding-left: 1rem;
  margin: 2rem 0;
  font-style: italic;
  color: #6b7280;
}

.post-content :deep(code) {
  background-color: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.post-content :deep(pre) {
  background-color: #1f2937;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1.5rem 0;
}

.post-footer {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}
</style>
