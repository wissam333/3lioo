<template>
  <div class="homepage">
    <!-- Minimal Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">Security Researcher</h1>
            <p class="hero-description">
              Writing about cybersecurity, threat intelligence, and defense
              strategies. Focused on practical security research and analysis.
            </p>
            <div class="hero-actions">
              <NuxtLink to="/blog" class="btn btn-primary">
                Read Blog
              </NuxtLink>
              <a href="#about" class="btn btn-secondary"> About Me </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="about">
      <div class="container">
        <div class="about-content">
          <div class="about-text">
            <h2>About</h2>
            <p>
              Security professional with expertise in threat analysis,
              vulnerability research, and defensive security. This blog serves
              as a repository of research findings, technical analysis, and
              security insights.
            </p>
            <div class="about-links">
              <a href="mailto:contact@example.com" class="link">Email</a>
              <a href="https://github.com/username" target="_blank" class="link"
                >GitHub</a
              >
              <a
                href="https://linkedin.com/in/username"
                target="_blank"
                class="link"
                >LinkedIn</a
              >
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Writing -->
    <section class="writing">
      <div class="container">
        <h2>Recent Writing</h2>
        <div class="posts-grid">
          <article
            v-for="post in recentPosts"
            :key="post._path"
            class="post-card"
          >
            <div class="post-meta">
              <span class="post-date">{{ formatDate(post.date) }}</span>
              <span class="post-category">{{ post.category }}</span>
            </div>
            <h3 class="post-title">
              <NuxtLink :to="post._path">{{ post.title }}</NuxtLink>
            </h3>
            <p class="post-excerpt">
              {{ useTruncateDescription(post.description || post.excerpt, 10) }}
            </p>
            <div class="post-footer">
              <span class="read-time">{{ post.readTime }}</span>
              <NuxtLink :to="post._path" class="read-more"> Read → </NuxtLink>
            </div>
          </article>
        </div>
        <div class="writing-actions">
          <NuxtLink to="/blog" class="btn btn-outline">
            View All Posts
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Fetch recent posts
const { data: recentPosts } = await useAsyncData("recent-posts", () => {
  return queryContent("/posts").sort({ date: -1 }).limit(6).find();
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// SEO Meta
useSeoMeta({
  title: "Security Researcher - Cybersecurity Blog",
  description:
    "Security research and analysis blog focusing on threat intelligence, vulnerability research, and defensive security strategies.",
  ogImage: "/og-image.jpg",
});
</script>

<style scoped>
.homepage {
  min-height: 100vh;
  background: #ffffff;
  color: #1a1a1a;
}

/* Hero Section */
.hero {
  padding: 120px 0 80px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.hero-content {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #1a1a1a;
  line-height: 1.1;
}

.hero-description {
  font-size: 1.25rem;
  line-height: 1.6;
  color: #666;
  margin-bottom: 2.5rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.btn-primary {
  background: #1a1a1a;
  color: #ffffff;
}

.btn-primary:hover {
  background: #333;
  transform: translateY(-1px);
}

.btn-secondary {
  background: transparent;
  color: #1a1a1a;
  border-color: #1a1a1a;
}

.btn-secondary:hover {
  background: #1a1a1a;
  color: #ffffff;
}

.btn-outline {
  background: transparent;
  color: #1a1a1a;
  border: 1px solid #ddd;
}

.btn-outline:hover {
  border-color: #1a1a1a;
  background: #f8f9fa;
}

/* About Section */
.about {
  padding: 80px 0;
  background: #ffffff;
}

.about-content {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.about h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #1a1a1a;
}

.about p {
  font-size: 1.125rem;
  line-height: 1.7;
  color: #666;
  margin-bottom: 2rem;
}

.about-links {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
}

.link {
  color: #666;
  text-decoration: none;
  transition: color 0.2s ease;
}

.link:hover {
  color: #1a1a1a;
}

/* Writing Section */
.writing {
  padding: 80px 0;
  background: #f8f9fa;
}

.writing h2 {
  font-size: 2rem;
  margin-bottom: 3rem;
  text-align: center;
  color: #1a1a1a;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.post-card {
  background: #ffffff;
  padding: 2rem;
  border-radius: 4px;
  border: 1px solid #e9ecef;
  transition: all 0.2s ease;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #666;
}

.post-category {
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.post-title {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.post-title a {
  color: #1a1a1a;
  text-decoration: none;
}

.post-title a:hover {
  color: #333;
}

.post-excerpt {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: #666;
}

.read-more {
  color: #1a1a1a;
  text-decoration: none;
  font-weight: 500;
}

.read-more:hover {
  color: #333;
}

.writing-actions {
  text-align: center;
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .hero {
    padding: 80px 0 60px;
  }

  .hero-title {
    font-size: 2.25rem;
  }

  .hero-description {
    font-size: 1.125rem;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .btn {
    width: 200px;
    justify-content: center;
  }

  .posts-grid {
    grid-template-columns: 1fr;
  }

  .about-links {
    flex-direction: column;
    gap: 1rem;
  }

  .about,
  .writing {
    padding: 60px 0;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 1rem;
  }

  .post-card {
    padding: 1.5rem;
  }

  .hero-title {
    font-size: 2rem;
  }
}
</style>
