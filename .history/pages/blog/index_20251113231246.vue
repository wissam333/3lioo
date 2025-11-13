<template>
  <div class="container">
    <h1>Blog Posts</h1>
    <div v-if="pending">Loading...</div>
    <div v-else-if="error">Error loading posts</div>
    <div v-else class="posts-grid">
      <article v-for="post in posts" :key="post._path" class="post-card">
        <NuxtLink :to="post._path" class="post-link">
          <h2>{{ post.title }}</h2>
          <p class="date">{{ formatDate(post.date) }}</p>
          <p class="description">{{ post.description }}</p>
          <div class="read-more">Read more →</div>
        </NuxtLink>
      </article>
    </div>
  </div>
</template>

<script setup>
// Fetch all blog posts
const {
  data: posts,
  pending,
  error,
} = await useAsyncData("blog-posts", () => {
  return queryContent("/blog")
    .sort({ date: -1 }) // Sort by date, newest first
    .where({ _partial: false }) // Exclude partial files
    .find();
});

// Date formatting function
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

.posts-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.post-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.post-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.post-link {
  text-decoration: none;
  color: inherit;
}

.post-link h2 {
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.date {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.description {
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.read-more {
  color: #3b82f6;
  font-weight: 500;
}
</style>
