<template>
  <div class="blog-page">
    <!-- Minimal Hero Section -->
    <section class="blog-hero">
      <div class="container">
        <div class="blog-hero-content">
          <h1 class="blog-title">Security Research</h1>
          <p class="blog-subtitle">
            Analysis of vulnerabilities, threat intelligence, and defense
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
              placeholder="Search research..."
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
          <h3>No research found</h3>
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
          >
            <div class="post-meta">
              <span class="post-date">{{ formatDate(post.date) }}</span>
              <span class="post-category">{{
                post.category || "Security"
              }}</span>
              <span class="threat-level" :class="post.threatLevel || 'info'">
                {{ getThreatLevelText(post.threatLevel) }}
              </span>
            </div>

            <h2 class="post-title">
              <NuxtLink :to="post._path">{{ post.title }}</NuxtLink>
            </h2>
            <p class="post-description">
              {{ useTruncateDescription(post.description, 10) }}
            </p>

            <div class="post-footer">
              <div class="post-tags">
                <span
                  v-for="tag in post.tags?.slice(0, 3)"
                  :key="tag"
                  class="post-tag"
                >
                  {{ tag }}
                </span>
              </div>
              <div class="post-actions">
                <span class="read-time">{{
                  calculateReadTime(post.body)
                }}</span>
                <NuxtLink :to="post._path" class="read-more"> Read → </NuxtLink>
              </div>
            </div>
          </article>
        </div>

        <!-- Load More Button -->
        <div v-if="showLoadMore" class="load-more">
          <button
            @click="loadMore"
            class="btn btn-outline"
            aria-label="Load more posts"
          >
            Load More
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

// Auto-calculate read time if not set

const { calculateReadTime } = useReadTime();

// Reactive data
const searchQuery = ref("");
const selectedCategory = ref("");
const selectedThreatLevel = ref("");
const sortBy = ref("date-desc");

// Computed categories
const categories = computed(() => {
  if (!allPosts.value) return [];
  return [
    ...new Set(allPosts.value.map((p) => p.category || "Security")),
  ].sort();
});

// Filtered & sorted posts
const filteredPosts = computed(() => {
  if (!allPosts.value) return [];
  let filtered = allPosts.value;

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
  () => filteredPosts.value.length < (allPosts.value?.length || 0)
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
    low: "Low Risk",
    medium: "Medium Risk",
    high: "High Risk",
    critical: "Critical",
    info: "Research",
  }[level] || "Research");

// SEO
useSeoMeta({
  title: "Security Research - Threat Intelligence & Analysis",
  description:
    "Collection of security research, vulnerability analysis, and threat intelligence from cybersecurity experts.",
});
</script>

<style scoped>
.blog-page {
  min-height: 100vh;
  background: #ffffff;
  color: #1a1a1a;
}

/* Blog Hero */
.blog-hero {
  padding: 80px 0 60px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.blog-hero-content {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.blog-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1a1a1a;
  line-height: 1.1;
}

.blog-subtitle {
  font-size: 1.125rem;
  line-height: 1.6;
  color: #666;
}

/* Filters */
.blog-filters {
  padding: 40px 0;
  background: #ffffff;
  border-bottom: 1px solid #e9ecef;
}

.filters-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 1rem;
  align-items: end;
}

.search-box {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #1a1a1a;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #1a1a1a;
  box-shadow: 0 0 0 2px rgba(26, 26, 26, 0.1);
}

.search-input::placeholder {
  color: #999;
}

.filter-select {
  width: 100%;
  padding: 0.75rem 1rem;
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #1a1a1a;
  font-size: 1rem;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #1a1a1a;
}

.active-filters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e9ecef;
}

.active-filters-label {
  color: #666;
  font-weight: 500;
  font-size: 0.875rem;
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #ffffff;
  color: #1a1a1a;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  border: 1px solid #ddd;
}

.filter-remove {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 1.1rem;
  line-height: 1;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.filter-remove:hover {
  background: #f8f9fa;
  color: #ff4444;
}

.clear-all {
  background: none;
  border: 1px solid #ff4444;
  color: #ff4444;
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  margin-left: auto;
  transition: all 0.2s ease;
}

.clear-all:hover {
  background: #ff4444;
  color: #ffffff;
}

/* Blog Posts */
.blog-posts {
  padding: 60px 0;
  background: #ffffff;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
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
  border-color: #1a1a1a;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #666;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.post-category {
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.threat-level {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.threat-level.info {
  background: #e3f2fd;
  color: #1976d2;
}

.threat-level.low {
  background: #e8f5e8;
  color: #2e7d32;
}

.threat-level.medium {
  background: #fff3e0;
  color: #f57c00;
}

.threat-level.high {
  background: #ffebee;
  color: #c62828;
}

.threat-level.critical {
  background: #fce4ec;
  color: #ad1457;
  font-weight: 600;
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

.post-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.post-tag {
  background: #f8f9fa;
  color: #666;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  border: 1px solid #e9ecef;
}

.post-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  color: #666;
}

.read-more {
  color: #1a1a1a;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.read-more:hover {
  color: #333;
}

.no-results {
  text-align: center;
  padding: 4rem 1rem;
}

.no-results-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  opacity: 0.5;
}

.no-results h3 {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  color: #1a1a1a;
}

.no-results p {
  color: #666;
  margin-bottom: 2rem;
}

.load-more {
  text-align: center;
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
  cursor: pointer;
  font-size: 1rem;
}

.btn-primary {
  background: #1a1a1a;
  color: #ffffff;
}

.btn-primary:hover {
  background: #333;
  transform: translateY(-1px);
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

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .filters-grid {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .posts-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .blog-title {
    font-size: 2rem;
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
    margin-top: 0.5rem;
  }

  .post-footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .post-actions {
    align-self: flex-end;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 1rem;
  }

  .post-card {
    padding: 1.5rem;
  }

  .post-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
