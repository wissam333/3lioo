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

    <!-- Article Content -->
    <section class="article-content">
      <div class="container">
        <div class="content-wrapper">
          <ContentRenderer :value="post" class="prose" />
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
const { data: post } = await useAsyncData(route.path, () => {
  return queryContent(route.path).findOne();
});

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

/* Article Content */
.article-content {
  padding: 80px 0;
  background: #0a0a0a;
}

.content-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

/* Prose styles for markdown content */
:deep(.prose) {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #e0e0e0;
}

:deep(.prose h1) {
  font-size: 2.5rem;
  margin: 2em 0 1em;
  color: #fff;
  border-bottom: 2px solid #00ffff;
  padding-bottom: 0.5em;
}

:deep(.prose h2) {
  font-size: 2rem;
  margin: 1.5em 0 1em;
  color: #fff;
}

:deep(.prose h3) {
  font-size: 1.5rem;
  margin: 1.5em 0 1em;
  color: #fff;
}

:deep(.prose p) {
  margin-bottom: 1.5em;
}

:deep(.prose a) {
  color: #00ffff;
  text-decoration: none;
  border-bottom: 1px solid #00ffff;
  transition: all 0.3s ease;
}

:deep(.prose a:hover) {
  color: #0080ff;
  border-bottom-color: #0080ff;
}

:deep(.prose code) {
  background: rgba(0, 255, 255, 0.1);
  color: #00ffff;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: "Courier New", monospace;
  border: 1px solid rgba(0, 255, 255, 0.3);
}

:deep(.prose pre) {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 24px;
  overflow-x: auto;
  margin: 2em 0;
  position: relative;
}

:deep(.prose pre::before) {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #00ffff, #0080ff);
}

:deep(.prose pre code) {
  background: none;
  border: none;
  padding: 0;
  color: #e0e0e0;
}

:deep(.prose blockquote) {
  border-left: 4px solid #00ffff;
  padding-left: 24px;
  margin: 2em 0;
  background: rgba(0, 255, 255, 0.05);
  padding: 24px;
  border-radius: 0 8px 8px 0;
}

:deep(.prose ul),
:deep(.prose ol) {
  margin: 1.5em 0;
  padding-left: 2em;
}

:deep(.prose li) {
  margin-bottom: 0.5em;
}

:deep(.prose img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  border: 1px solid #333;
  margin: 2em 0;
}

:deep(.prose table) {
  width: 100%;
  border-collapse: collapse;
  margin: 2em 0;
}

:deep(.prose th) {
  background: rgba(0, 255, 255, 0.1);
  color: #00ffff;
  padding: 12px;
  text-align: left;
  border: 1px solid #333;
}

:deep(.prose td) {
  padding: 12px;
  border: 1px solid #333;
  background: #1a1a1a;
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
  text-decoration: none;
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
