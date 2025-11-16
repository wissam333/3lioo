<template>
  <div class="blog-page">
    <!-- Hero Section -->
    <section class="blog-hero">
      <div class="cyber-grid"></div>
      <div class="scan-line"></div>
      <div class="container">
        <div class="blog-hero-content">
          <div class="badge">
            <span class="pulse-dot"></span>
            SECURITY RESEARCH
          </div>
          <h1 class="blog-title">
            <span class="cyber-text">Threat Intelligence</span>
            <br />
            <span class="glitch-text" data-text="Archive">Archive</span>
          </h1>
          <p class="blog-subtitle">
            Comprehensive analysis of vulnerabilities, exploits, and defense
            strategies
          </p>
        </div>
      </div>
    </section>

    <!-- Filters & Search -->
    <section class="blog-filters">
      <div class="container">
        <div class="filters-grid">
          <div class="search-box">
            <div class="search-icon">🔍</div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search security research..."
              class="search-input"
              aria-label="Search posts"
            />
          </div>

          <div class="filter-group">
            <select
              v-model="selectedCategory"
              class="filter-select"
              aria-label="Select category"
            >
              <option value="">All Categories</option>
              <option
                v-for="category in categories"
                :key="category"
                :value="category"
              >
                {{ category }}
              </option>
            </select>
          </div>

          <div class="filter-group">
            <select
              v-model="selectedThreatLevel"
              class="filter-select"
              aria-label="Select threat level"
            >
              <option value="">All Threat Levels</option>
              <option value="info">Research</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div class="filter-group">
            <select
              v-model="sortBy"
              class="filter-select"
              aria-label="Sort posts"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </div>

        <div class="active-filters" v-if="hasActiveFilters">
          <span class="active-filters-label">Active Filters:</span>
          <span v-if="searchQuery" class="filter-tag">
            Search: "{{ searchQuery }}"
            <button
              @click="searchQuery = ''"
              class="filter-remove"
              aria-label="Remove search filter"
            >
              ×
            </button>
          </span>
          <span v-if="selectedCategory" class="filter-tag">
            Category: {{ selectedCategory }}
            <button
              @click="selectedCategory = ''"
              class="filter-remove"
              aria-label="Remove category filter"
            >
              ×
            </button>
          </span>
          <span v-if="selectedThreatLevel" class="filter-tag">
            Threat: {{ getThreatLevelText(selectedThreatLevel) }}
            <button
              @click="selectedThreatLevel = ''"
              class="filter-remove"
              aria-label="Remove threat filter"
            >
              ×
            </button>
          </span>
          <button
            @click="clearAllFilters"
            class="clear-all"
            aria-label="Clear all filters"
          >
            Clear All
          </button>
        </div>
      </div>
    </section>

    <!-- Blog Posts Grid -->
    <section class="blog-posts">
      <div class="container">
        <div v-if="filteredPosts.length === 0" class="no-results">
          <div class="no-results-icon">🔍</div>
          <h3>No security research found</h3>
          <p>Try adjusting your search criteria or filters</p>
          <button
            @click="clearAllFilters"
            class="btn btn-primary"
            aria-label="Show all posts"
          >
            Show All Research
          </button>
        </div>

        <div v-else class="posts-grid">
          <article
            v-for="post in filteredPosts"
            :key="post._path"
            class="post-card"
            :class="`threat-level-${post.threatLevel || 'info'}`"
          >
            <div class="post-header">
              <div class="threat-badge" :class="post.threatLevel || 'info'">
                {{ getThreatLevelText(post.threatLevel) }}
              </div>
              <div class="post-date">{{ formatDate(post.date) }}</div>
            </div>

            <h2 class="post-title">{{ post.title }}</h2>
            <p class="post-description">{{ post.description }}</p>

            <div class="post-meta">
              <span class="category">{{ post.category || "Security" }}</span>
              <span class="read-time">{{ post.readTime || "5 min read" }}</span>
            </div>

            <div class="post-tags">
              <span v-for="tag in post.tags" :key="tag" class="post-tag">
                {{ tag }}
              </span>
            </div>

            <NuxtLink
              :to="post._path"
              class="post-link"
              aria-label="Read full post"
            >
              Analyze Threat ⟫
            </NuxtLink>
          </article>
        </div>

        <!-- Load More Button -->
        <div v-if="showLoadMore" class="load-more">
          <button
            @click="loadMore"
            class="btn btn-secondary"
            aria-label="Load more posts"
          >
            Load More Research
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const postsPerPage = 6;
let currentPage = 1;

// Fetch posts via your API
const { data: allPosts } = await useAsyncData("posts", () =>
  queryContent("/posts").find()
);
console.log(allPosts.value);

// Reactive data
const searchQuery = ref("");
const selectedCategory = ref("");
const selectedThreatLevel = ref("");
const sortBy = ref("date-desc");

// Computed categories
const categories = computed(() => {
  if (!allPosts) return [];
  return [...new Set(allPosts.map((p) => p.category || "Security"))].sort();
});

// Filtered & sorted posts
const filteredPosts = computed(() => {
  if (!allPosts) return [];
  let filtered = allPosts;

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.body?.toLowerCase().includes(q) ||
        p.tags?.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(
      (p) => (p.category || "Security") === selectedCategory.value
    );
  }

  if (selectedThreatLevel.value) {
    filtered = filtered.filter(
      (p) => p.threatLevel === selectedThreatLevel.value
    );
  }

  switch (sortBy.value) {
    case "date-asc":
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
      break;
    case "title":
      filtered.sort((a, b) => a.title?.localeCompare(b.title));
      break;
    case "date-desc":
    default:
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  return filtered.slice(0, postsPerPage * currentPage);
});

const hasActiveFilters = computed(
  () => searchQuery.value || selectedCategory.value || selectedThreatLevel.value
);
const showLoadMore = computed(
  () => filteredPosts.value.length < (allPosts?.length || 0)
);

const loadMore = () => {
  currentPage++;
};
const clearAllFilters = () => {
  searchQuery.value = "";
  selectedCategory.value = "";
  selectedThreatLevel.value = "";
  currentPage = 1;
};
const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
const getThreatLevelText = (level) =>
  ({
    low: "LOW RISK",
    medium: "MEDIUM RISK",
    high: "HIGH RISK",
    critical: "CRITICAL",
    info: "RESEARCH",
  }[level] || "RESEARCH");

// SEO
useSeoMeta({
  title: "Security Research Archive - Threat Intelligence & Analysis",
  description:
    "Comprehensive collection of security research, vulnerability analysis, threat intelligence, and defense strategies from cybersecurity experts.",
});
</script>

<style scoped>
.blog-page {
  background: #0a0a0a;
  color: #e0e0e0;
  min-height: 100vh;
}

/* Blog Hero */
.blog-hero {
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
  background-image: linear-gradient(rgba(0, 100, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 100, 255, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridMove 20s linear infinite;
}

.scan-line {
  height: 2px;
  background: linear-gradient(90deg, transparent, #00ffff, transparent);
  animation: scan 3s linear infinite;
}

.blog-hero-content {
  text-align: center;
  position: relative;
  z-index: 2;
}

.blog-title {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 20px;
}

.blog-subtitle {
  font-size: 1.2rem;
  color: #b0b0b0;
  max-width: 600px;
  margin: 0 auto;
}

/* Filters */
.blog-filters {
  padding: 40px 0;
  background: #111;
  border-bottom: 1px solid #333;
}

.filters-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 20px;
  align-items: end;
}

.search-box {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 4px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #00ffff;
  box-shadow: 0 0 0 2px rgba(0, 255, 255, 0.1);
}

.search-input::placeholder {
  color: #666;
}

.filter-select {
  width: 100%;
  padding: 12px 16px;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 4px;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: #00ffff;
}

.active-filters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
  padding: 16px;
  background: rgba(0, 255, 255, 0.05);
  border-radius: 4px;
  border: 1px solid rgba(0, 255, 255, 0.2);
}

.active-filters-label {
  color: #00ffff;
  font-weight: 600;
  font-size: 0.9rem;
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 255, 255, 0.1);
  color: #00ffff;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  border: 1px solid rgba(0, 255, 255, 0.3);
}

.filter-remove {
  background: none;
  border: none;
  color: #00ffff;
  cursor: pointer;
  font-size: 1.2rem;
  line-height: 1;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-remove:hover {
  color: #ff4444;
}

.clear-all {
  background: none;
  border: 1px solid #ff4444;
  color: #ff4444;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  margin-left: auto;
}

.clear-all:hover {
  background: rgba(255, 68, 68, 0.1);
}

/* Blog Posts */
.blog-posts {
  padding: 80px 0;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
}

.post-card {
  background: #1a1a1a;
  padding: 30px;
  border-radius: 8px;
  border: 1px solid #333;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.post-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00ffff, transparent);
  transition: left 0.5s ease;
}

.post-card:hover::before {
  left: 100%;
}

.post-card:hover {
  transform: translateY(-5px);
  border-color: #00ffff;
  box-shadow: 0 10px 30px rgba(0, 255, 255, 0.1);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.threat-badge {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.7rem;
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

.post-date {
  color: #666;
  font-size: 0.9rem;
}

.post-title {
  font-size: 1.5rem;
  margin-bottom: 16px;
  color: #fff;
  line-height: 1.3;
}

.post-description {
  color: #b0b0b0;
  line-height: 1.6;
  margin-bottom: 20px;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 0.9rem;
  color: #666;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.post-tag {
  background: rgba(0, 255, 255, 0.1);
  color: #00ffff;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  border: 1px solid rgba(0, 255, 255, 0.3);
}

.post-link {
  color: #00ffff;
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: color 0.3s ease;
}

.post-link:hover {
  color: #0080ff;
}

.no-results {
  text-align: center;
  padding: 80px 20px;
}

.no-results-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.no-results h3 {
  font-size: 1.5rem;
  margin-bottom: 12px;
  color: #fff;
}

.no-results p {
  color: #b0b0b0;
  margin-bottom: 30px;
}

.load-more {
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

.btn-secondary {
  background: transparent;
  color: #00ffff;
  border: 1px solid #00ffff;
}

.btn-secondary:hover {
  background: rgba(0, 255, 255, 0.1);
}

/* Responsive */
@media (max-width: 1024px) {
  .filters-grid {
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }

  .posts-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .blog-title {
    font-size: 2.5rem;
  }

  .filters-grid {
    grid-template-columns: 1fr;
  }

  .active-filters {
    flex-direction: column;
    align-items: flex-start;
  }

  .clear-all {
    margin-left: 0;
    margin-top: 10px;
  }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Animations (reuse from homepage) */
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

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
.posts-grid article {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeIn 0.5s forwards;
  animation-delay: calc(var(--post-index) * 0.05s);
}
@keyframes fadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
