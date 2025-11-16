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
          <!-- <span v-if="selectedCategory" class="filter-tag">
            Category: {{ selectedCategory }}
            <button
              @click="selectedCategory = ''"
              class="filter-remove"
              aria-label="Remove category filter"
            >
              ×
            </button>
          </span> -->
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
                  post.readTime || "5 min read"
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

<style scoped lang="scss">
.blog-page {
  min-height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Blog Hero */
.blog-hero {
  padding: 80px 0 60px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-primary);
  transition: all 0.3s ease;
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
  color: var(--text-primary);
  line-height: 1.1;
  transition: color 0.3s ease;
}

.blog-subtitle {
  font-size: 1.125rem;
  line-height: 1.6;
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

/* Filters */
.blog-filters {
  padding: 40px 0;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-primary);
  transition: all 0.3s ease;
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
  color: var(--text-tertiary);
  transition: color 0.3s ease;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: 4px;
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 2px var(--shadow);
  }

  &::placeholder {
    color: var(--text-tertiary);
  }
}

.filter-select {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: 4px;
  color: var(--text-primary);
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--accent-primary);
  }

  option {
    background: var(--bg-primary);
    color: var(--text-primary);
  }
}

.active-filters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 4px;
  border: 1px solid var(--border-primary);
  transition: all 0.3s ease;
}

.active-filters-label {
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 0.875rem;
  transition: color 0.3s ease;
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--bg-primary);
  color: var(--text-primary);
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  border: 1px solid var(--border-primary);
  transition: all 0.3s ease;
}

.filter-remove {
  background: none;
  border: none;
  color: var(--text-secondary);
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
  transition: all 0.3s ease;

  &:hover {
    background: var(--bg-secondary);
    color: #ff4444;
  }
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
  transition: all 0.3s ease;

  &:hover {
    background: #ff4444;
    color: #ffffff;
  }
}

/* Blog Posts */
.blog-posts {
  padding: 60px 0;
  background: var(--bg-primary);
  transition: all 0.3s ease;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
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
  flex-wrap: wrap;
  gap: 0.5rem;
  transition: color 0.3s ease;
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
  transition: all 0.3s ease;
}

// Threat level colors that work in both themes
.threat-level.info {
  background: rgba(33, 150, 243, 0.1);
  color: #2196f3;

  [data-theme="dark"] & {
    background: rgba(33, 150, 243, 0.2);
    color: #64b5f6;
  }
}

.threat-level.low {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;

  [data-theme="dark"] & {
    background: rgba(76, 175, 80, 0.2);
    color: #81c784;
  }
}

.threat-level.medium {
  background: rgba(255, 152, 0, 0.1);
  color: #ff9800;

  [data-theme="dark"] & {
    background: rgba(255, 152, 0, 0.2);
    color: #ffb74d;
  }
}

.threat-level.high {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;

  [data-theme="dark"] & {
    background: rgba(244, 67, 54, 0.2);
    color: #e57373;
  }
}

.threat-level.critical {
  background: rgba(156, 39, 176, 0.1);
  color: #9c27b0;
  font-weight: 600;

  [data-theme="dark"] & {
    background: rgba(156, 39, 176, 0.2);
    color: #ba68c8;
  }
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
  transition: color 0.3s ease;

  &:hover {
    color: var(--accent-secondary);
  }
}

.post-description {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  transition: color 0.3s ease;
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
  background: var(--bg-secondary);
  color: var(--text-secondary);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  border: 1px solid var(--border-primary);
  transition: all 0.3s ease;
}

.post-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
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

.no-results {
  text-align: center;
  padding: 4rem 1rem;
}

.no-results-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  opacity: 0.5;
  color: var(--text-secondary);
}

.no-results h3 {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.no-results p {
  color: var(--text-secondary);
  margin-bottom: 2rem;
  transition: color 0.3s ease;
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
  transition: all 0.3s ease;
  border: 1px solid transparent;
  cursor: pointer;
  font-size: 1rem;
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

.btn-outline {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-primary);

  &:hover {
    border-color: var(--accent-primary);
    background: var(--bg-secondary);
  }
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
