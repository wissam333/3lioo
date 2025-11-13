<template>
  <div class="container">
    <h1>Photo Gallery</h1>
    <div class="filters">
      <button
        v-for="category in categories"
        :key="category"
        @click="activeCategory = category"
        :class="{ active: activeCategory === category }"
        class="filter-btn"
      >
        {{ category }}
      </button>
      <button
        @click="activeCategory = null"
        :class="{ active: activeCategory === null }"
        class="filter-btn"
      >
        All
      </button>
    </div>

    <div v-if="pending" class="loading">Loading gallery...</div>
    <div v-else-if="error" class="error">Error loading gallery</div>
    <div v-else class="gallery-grid">
      <article
        v-for="item in filteredItems"
        :key="item._path"
        class="gallery-item"
      >
        <NuxtLink :to="item._path" class="gallery-link">
          <img
            v-if="item.images && item.images[0]"
            :src="item.images[0].image"
            :alt="item.images[0].alt || item.title"
            class="gallery-image"
          />
          <div class="gallery-content">
            <h3>{{ item.title }}</h3>
            <p class="category">{{ item.category }}</p>
            <p class="description">{{ item.description }}</p>
            <p class="image-count">
              {{ item.images ? item.images.length : 0 }} photos
            </p>
          </div>
        </NuxtLink>
      </article>
    </div>
  </div>
</template>

<script setup>
const activeCategory = ref(null);

// Fetch all gallery items
const {
  data: galleryItems,
  pending,
  error,
} = await useAsyncData("gallery-items", () => {
  return queryContent("/gallery")
    .sort({ date: -1 })
    .where({ _partial: false })
    .find();
});

// Extract unique categories
const categories = computed(() => {
  if (!galleryItems.value) return [];
  const allCategories = galleryItems.value.map((item) => item.category);
  return [...new Set(allCategories)];
});

// Filter items by category
const filteredItems = computed(() => {
  if (!galleryItems.value) return [];
  if (!activeCategory.value) return galleryItems.value;
  return galleryItems.value.filter(
    (item) => item.category === activeCategory.value
  );
});
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.filters {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover,
.filter-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.gallery-item {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.gallery-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.gallery-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.gallery-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.gallery-content {
  padding: 1.5rem;
}

.gallery-content h3 {
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.category {
  color: #3b82f6;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.description {
  color: #6b7280;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.image-count {
  color: #9ca3af;
  font-size: 0.875rem;
}
</style>
