<template>
  <div class="blog-detail">
    <!-- Article Header -->
    <section class="article-header">
      <div class="cyber-grid"></div>
      <div class="scan-line"></div>
      <div class="container">
        <NuxtLink to="/blog" class="back-link">
          ← Back to Security Research
        </NuxtLink>

        <div class="article-meta">
          <div class="threat-badge" :class="post.threatLevel || 'info'">
            {{ getThreatLevelText(post.threatLevel) }}
          </div>
          <div class="meta-info">
            <span class="date">{{ formatDate(post.date) }}</span>
            <span class="divider">•</span>
            <span class="read-time">{{ post.readTime || "5 min read" }}</span>
            <span class="divider">•</span>
            <span class="category">{{ post.category || "Security" }}</span>
          </div>
        </div>

        <h1 class="article-title">{{ post.title }}</h1>
        <p class="article-description">{{ post.description }}</p>

        <div class="article-tags">
          <span v-for="tag in post.tags" :key="tag" class="article-tag">
            {{ tag }}
          </span>
        </div>
      </div>
    </section>

    <!-- Featured Image -->
    <section v-if="post.featuredImage" class="article-image">
      <div class="container">
        <img :src="post.featuredImage" :alt="post.title" />
      </div>
    </section>

    <!-- Article Content -->
    <section class="article-content">
      <div class="container">
        <div class="content-wrapper">
          <ContentRenderer :value="post" class="prose" />
        </div>
      </div>
    </section>

    <!-- Suggested Reading -->
    <section v-if="relatedPosts.length" class="related-posts">
      <div class="container">
        <h3>Related Research</h3>
        <div class="posts-grid">
          <article v-for="p in relatedPosts" :key="p._path" class="post-card">
            <h4 class="post-title">{{ p.title }}</h4>
            <p class="post-description">{{ p.description }}</p>
            <NuxtLink :to="p._path" class="post-link">Read ⟫</NuxtLink>
          </article>
        </div>
      </div>
    </section>

    <!-- Article Footer -->
    <section class="article-footer">
      <div class="container">
        <div class="footer-content">
          <div class="security-notice">
            <div class="notice-icon">⚠️</div>
            <div class="notice-content">
              <h4>Security Disclosure</h4>
              <p>
                This research is published for educational purposes. Always
                follow responsible disclosure practices and applicable laws.
              </p>
            </div>
          </div>

          <div class="actions">
            <NuxtLink to="/blog" class="btn btn-primary">
              ← More Security Research
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const route = useRoute();
const slug = route.params.slug; // <-- use the dynamic param

const { data: post } = await useAsyncData(`post-${slug}`, () => {
  return queryContent("blog").where({ slug }).findOne();
});

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: "Post not found" });
}

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: "Post not found" });
}

// SEO Meta
useSeoMeta({
  title: `${post.value.title} - Security Research`,
  description: post.value.description,
  ogImage: post.value.featuredImage || "/cyber-og.jpg",
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getThreatLevelText = (level) => {
  const levels = {
    low: "LOW RISK",
    medium: "MEDIUM RISK",
    high: "HIGH RISK",
    critical: "CRITICAL",
    info: "RESEARCH",
  };
  return levels[level] || "RESEARCH";
};

// Related Posts (same category, excluding current)
const relatedPosts = computed(() => {
  if (!post.value?.category) return [];
  const allPosts = useContent("posts").fetchSync(); // synchronous fetch for simplicity
  return allPosts
    .filter(
      (p) =>
        p._path !== post.value._path &&
        (p.category || "Security") === (post.value.category || "Security")
    )
    .slice(0, 3);
});
</script>

<style scoped>
.blog-detail {
  background: #0a0a0a;
  color: #e0e0e0;
  min-height: 100vh;
}

/* Article Header */
.article-header {
  position: relative;
  padding: 120px 0 80px;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  overflow: hidden;
}

.cyber-grid,
.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.cyber-grid {
  background-image:
    linear-gradient(rgba(0, 100, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 100, 255, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridMove 20s linear infinite;
}

.scan-line {
  height: 2px;
  background: linear-gradient(90deg, transparent, #00ffff, transparent);
  animation: scan 3s linear infinite;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #00ffff;
  text-decoration: none;
  margin-bottom: 30px;
  font-weight: 600;
  transition: color 0.3s ease;
}

.back-link:hover {
  color: #0080ff;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.threat-badge {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 1px;
}

/* Threat Colors */
.threat-badge.info {
  background: rgba(0, 100, 255, 0.2);
  color: #0080ff;
  border: 1px solid #0080ff;
}
.threat-badge.low {
  background: rgba(0, 255, 0, 0.2);
  color: #00ff00;
  border: 1px solid #00ff00;
}
.threat-badge.medium {
  background: rgba(255, 255, 0, 0.2);
  color: #ffff00;
  border: 1px solid #ffff00;
}
.threat-badge.high {
  background: rgba(255, 165, 0, 0.2);
  color: #ffa500;
  border: 1px solid #ffa500;
}
.threat-badge.critical {
  background: rgba(255, 0, 0, 0.2);
  color: #ff0000;
  border: 1px solid #ff0000;
}

.meta-info {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #b0b0b0;
  font-size: 0.9rem;
}

.divider {
  color: #666;
}

.article-title {
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 24px;
  color: #fff;
}

.article-description {
  font-size: 1.3rem;
  line-height: 1.6;
  color: #b0b0b0;
  margin-bottom: 30px;
  max-width: 800px;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.article-tag {
  background: rgba(0, 255, 255, 0.1);
  color: #00ffff;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  border: 1px solid rgba(0, 255, 255, 0.3);
}

/* Featured Image */
.article-image {
  margin: 40px 0;
}

.article-image img {
  width: 100%;
  border-radius: 12px;
  border: 1px solid #333;
  box-shadow: 0 5px 20px rgba(0, 255, 255, 0.1);
  transition: transform 0.3s ease;
}

.article-image img:hover {
  transform: scale(1.02);
}

/* Article Content */
.article-content {
  padding: 80px 0;
  background: #0a0a0a;
}

.content-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

/* Related Posts */
.related-posts {
  padding: 60px 0;
}

.related-posts h3 {
  font-size: 1.8rem;
  margin-bottom: 30px;
  color: #00ffff;
  text-align: center;
}

.related-posts .posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.related-posts .post-card {
  background: #1a1a1a;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #333;
  transition: all 0.3s ease;
}

.related-posts .post-card:hover {
  transform: translateY(-3px);
  border-color: #00ffff;
  box-shadow: 0 8px 20px rgba(0, 255, 255, 0.1);
}

.related-posts .post-title {
  font-size: 1.1rem;
  margin-bottom: 10px;
  color: #fff;
}

.related-posts .post-description {
  color: #b0b0b0;
  font-size: 0.9rem;
  margin-bottom: 12px;
}

.related-posts .post-link {
  color: #00ffff;
  font-weight: 600;
}

.related-posts .post-link:hover {
  color: #0080ff;
}

/* Article Footer */
.article-footer {
  padding: 60px 0;
  background: #111;
  border-top: 1px solid #333;
}

.footer-content {
  max-width: 800px;
  margin: 0 auto;
}

.security-notice {
  display: flex;
  gap: 20px;
  background: rgba(255, 165, 0, 0.1);
  border: 1px solid #ffa500;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 40px;
}

.notice-icon {
  font-size: 2rem;
}

.notice-content h4 {
  color: #ffa500;
  margin-bottom: 8px;
  font-size: 1.2rem;
}
.notice-content p {
  color: #b0b0b0;
  line-height: 1.6;
  margin: 0;
}

.actions {
  text-align: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 4px;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: linear-gradient(135deg, #0080ff 0%, #00ffff 100%);
  color: #000;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 128, 255, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .article-title {
    font-size: 2.2rem;
  }
  .article-meta {
    flex-direction: column;
    align-items: flex-start;
  }
  .security-notice {
    flex-direction: column;
    text-align: center;
  }
  :deep(.prose h1) {
    font-size: 2rem;
  }
  :deep(.prose h2) {
    font-size: 1.7rem;
  }
  :deep(.prose h3) {
    font-size: 1.3rem;
  }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Animations */
@keyframes gridMove {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(50px);
  }
}
@keyframes scan {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(100vh);
  }
}
</style>
