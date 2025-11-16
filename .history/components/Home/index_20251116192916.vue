<template>
  <div class="homepage">
    <!-- Add theme toggle in header/navigation -->
    <header class="site-header">
      <div class="container">
        <div class="header-content">
          <NuxtLink to="/" class="logo">Security Blog</NuxtLink>
          <ThemeToggle />
        </div>
      </div>
    </header>

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
              <NuxtLink to="/posts" class="btn btn-primary">
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
              {{ post.description || post.excerpt }}
            </p>
            <div class="post-footer">
              <span class="read-time">{{ post.readTime }}</span>
              <NuxtLink :to="post._path" class="read-more"> Read → </NuxtLink>
            </div>
          </article>
        </div>
        <div class="writing-actions">
          <NuxtLink to="/posts" class="btn btn-outline">
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

// Initialize theme
const { initTheme } = useTheme();
onMounted(() => {
  initTheme();
});

// SEO Meta
useSeoMeta({
  title: "Security Researcher - Cybersecurity Blog",
  description:
    "Security research and analysis blog focusing on threat intelligence, vulnerability research, and defensive security strategies.",
  ogImage: "/og-image.jpg",
});
</script>

<style scoped lang="scss">
.homepage {
  min-height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Site Header */
.site-header {
  position: sticky;
  top: 0;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-primary);
  z-index: 1000;
  transition: all 0.3s ease;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.logo {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  text-decoration: none;

  &:hover {
    color: var(--accent-secondary);
  }
}

/* Hero Section */
.hero {
  padding: 120px 0 80px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-primary);
  transition: all 0.3s ease;
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
  color: var(--text-primary);
  line-height: 1.1;
  transition: color 0.3s ease;
}

.hero-description {
  font-size: 1.25rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 2.5rem;
  transition: color 0.3s ease;
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
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.btn-primary {
  background: var(--accent-primary);
  color: var(--bg-primary);

  &:hover {
    background: var(--accent-secondary);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px var(--shadow);
  }
}

.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border-color: var(--border-primary);

  &:hover {
    background: var(--accent-primary);
    color: var(--bg-primary);
    border-color: var(--accent-primary);
  }
}

.btn-outline {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-primary);

  &:hover {
    border-color: var(--accent-primary);
    background: var(--bg-secondary);
  }
}

/* About Section */
.about {
  padding: 80px 0;
  background: var(--bg-primary);
  transition: all 0.3s ease;
}

.about-content {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.about h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.about p {
  font-size: 1.125rem;
  line-height: 1.7;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  transition: color 0.3s ease;
}

.about-links {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
}

.link {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: var(--text-primary);
  }
}

/* Writing Section */
.writing {
  padding: 80px 0;
  background: var(--bg-secondary);
  transition: all 0.3s ease;
}

.writing h2 {
  font-size: 2rem;
  margin-bottom: 3rem;
  text-align: center;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.post-card {
  background: var(--bg-primary);
  padding: 2rem;
  border-radius: 4px;
  border: 1px solid var(--border-primary);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--shadow);
    border-color: var(--border-secondary);
  }
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
  transition: color 0.3s ease;
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
  transition: color 0.3s ease;
}

.post-title a {
  color: var(--text-primary);
  text-decoration: none;

  &:hover {
    color: var(--accent-secondary);
  }
}

.post-excerpt {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  transition: color 0.3s ease;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

.read-more {
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: var(--accent-secondary);
  }
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
    padding: 100px 0 60px;
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

  .header-content {
    padding: 0.75rem 0;
  }
}
</style>
