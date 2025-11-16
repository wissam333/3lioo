<template>
  <div v-if="post" class="article-page">
    <!-- ===== Sidebar (Most Viewed + Table of Contents) ===== -->
    <aside class="sidebar">
      <!-- Table of Contents -->
      <div v-if="headings.length > 0" class="toc-sidebar">
        <h3 class="sidebar-title">
          <i class="fas fa-list"></i>
          {{ $i18n.locale === "ar" ? "محتويات المقال" : "Table of Contents" }}
        </h3>
        <nav class="toc-nav">
          <ul>
            <li
              v-for="(heading, index) in headings"
              :key="index"
              :class="`toc-level-${heading.level}`"
            >
              <a
                :href="`#${heading.id}`"
                @click.prevent="scrollToHeading(heading.id)"
                :class="{ active: activeHeading === heading.id }"
              >
                {{ heading.text }}
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <!-- Most Viewed -->
      <div class="most-viewed-sidebar">
        <h3 class="sidebar-title">
          <i class="fas fa-chart-line"></i>
          {{ $i18n.locale === "ar" ? "الأكثر مشاهدة" : "Most Viewed" }}
        </h3>
        <div class="sidebar-list">
          <div
            v-for="(item, index) in mostWatched"
            :key="item.slug"
            class="sidebar-item"
          >
            <nuxt-link :to="`/posts/${item.slug}`" class="sidebar-link">
              <div class="item-rank">
                <span class="rank-number">{{ index + 1 }}</span>
                <div class="rank-trend" :class="getTrendClass(index)">
                  <i class="fas" :class="getTrendIcon(index)"></i>
                </div>
              </div>
              <div class="sidebar-content">
                <h4 class="title" :title="item.title">
                  {{ truncateTitle(item.title) }}
                </h4>
                <div class="sidebar-meta">
                  <div class="meta-left">
                    <span class="sidebar-date">
                      <i class="far fa-calendar"></i>
                      {{ formatDate(item.date) }}
                    </span>
                    <span class="read-time">
                      <i class="far fa-clock"></i>
                      {{ item.readTime || "2 min read" }}
                    </span>
                  </div>
                  <span
                    class="threat-level"
                    :class="`threat-${item.threatLevel}`"
                    :title="getThreatLevelLabel(item.threatLevel)"
                  >
                    {{ getThreatLevelShortLabel(item.threatLevel) }}
                  </span>
                </div>
              </div>
            </nuxt-link>
          </div>
        </div>
      </div>

      <!-- Newsletter Signup -->
      <!-- <div class="newsletter-sidebar">
        <div class="newsletter-card">
          <h4>
            {{ $i18n.locale === "ar" ? "النشرة الإخبارية" : "Newsletter" }}
          </h4>
          <p>
            {{
              $i18n.locale === "ar"
                ? "ابق على اطلاع بأحدث التهديدات"
                : "Stay updated with latest threats"
            }}
          </p>
          <div class="newsletter-form">
            <input type="email" placeholder="Email address" />
            <button type="submit">Subscribe</button>
          </div>
        </div>
      </div> -->
    </aside>

    <!-- ===== Main Content ===== -->
    <main class="content">
      <!-- Breadcrumb -->
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <ol>
          <li>
            <nuxt-link to="/">{{ $t("Home") }}</nuxt-link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <nuxt-link :to="`/category/${post.category}`">
              {{ getCategoryLabel(post.category) }}
            </nuxt-link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <span aria-current="page">{{ post.title }}</span>
          </li>
        </ol>
      </nav>

      <!-- Article Header -->
      <header class="article-header">
        <!-- Threat Level Badge -->
        <div class="threat-badge" :class="`threat-${post.threatLevel}`">
          <i :class="getThreatLevelIcon(post.threatLevel)"></i>
          {{ getThreatLevelLabel(post.threatLevel) }}
        </div>

        <!-- Title -->
        <h1 class="article-title">{{ post.title }}</h1>

        <!-- Meta Information -->
        <div class="article-meta">
          <div class="meta-left">
            <div class="author-info">
              <div class="author-details">
                <p class="article-author">{{ post.author }}</p>
              </div>
            </div>
            <div class="meta-details">
              <p class="article-date">
                <i class="far fa-calendar-alt"></i>
                {{ formatDate(post.date) }}
              </p>
              <p v-if="post.updated" class="article-updated">
                <i class="far fa-edit"></i>
                Updated {{ formatDate(post.updated) }}
              </p>
              <p class="article-reading-time">
                <i class="far fa-clock"></i>
                {{ post.readTime }}
              </p>
            </div>
          </div>

          <!-- Social Share -->
          <div class="share-section">
            <span>{{ $i18n.locale === "ar" ? "مشاركة" : "Share" }}:</span>
            <div class="share-buttons">
              <button
                @click="shareOnFacebook"
                class="share-btn facebook"
                :aria-label="
                  $i18n.locale === 'ar'
                    ? 'مشاركة على فيسبوك'
                    : 'Share on Facebook'
                "
              >
                <Icon name="mdi:facebook"></Icon>
              </button>
              <button
                @click="shareOnTwitter"
                class="share-btn twitter"
                :aria-label="
                  $i18n.locale === 'ar'
                    ? 'مشاركة على تويتر'
                    : 'Share on Twitter'
                "
              >
                <Icon name="mdi:twitter"></Icon>
              </button>
              <button
                @click="shareOnLinkedIn"
                class="share-btn linkedin"
                :aria-label="
                  $i18n.locale === 'ar'
                    ? 'مشاركة على لينكد إن'
                    : 'Share on LinkedIn'
                "
              >
                <Icon name="mdi:linkedin"></Icon>
              </button>
              <button
                @click="shareOnWhatsApp"
                class="share-btn whatsapp"
                :aria-label="
                  $i18n.locale === 'ar'
                    ? 'مشاركة على واتساب'
                    : 'Share on WhatsApp'
                "
              >
                <Icon name="mdi:whatsapp"></Icon>
              </button>
              <button
                @click="copyLink"
                class="share-btn link"
                :aria-label="$i18n.locale === 'ar' ? 'نسخ الرابط' : 'Copy link'"
              >
                <Icon name="mdi:link"></Icon>
              </button>
            </div>
          </div>
        </div>

        <!-- Excerpt -->
        <div v-if="post.excerpt" class="article-excerpt">
          <p>{{ post.excerpt }}</p>
        </div>
      </header>

      <!-- Featured Image -->
      <div v-if="post.featuredImage?.url" class="featured-image">
        <img
          :src="post.featuredImage.url"
          :alt="post.featuredImage.alt || post.title"
          class="main-article-image"
          loading="lazy"
        />
        <figcaption v-if="post.featuredImage.caption" class="image-caption">
          {{ post.featuredImage.caption }}
        </figcaption>
      </div>

      <!-- Gallery -->
      <div v-if="post.gallery && post.gallery.length > 0" class="gallery">
        <Swiper
          :modules="[SwiperNavigation, SwiperPagination, SwiperAutoplay]"
          :slides-per-view="1"
          :space-between="20"
          :pagination="{ clickable: true }"
          :navigation="true"
          :autoplay="{ delay: 5000, disableOnInteraction: false }"
          :loop="post.gallery.length > 1"
          class="gallery-swiper"
        >
          <SwiperSlide v-for="(img, idx) in post.gallery" :key="idx">
            <div class="swiper-image-container">
              <img
                :src="img.image"
                :alt="img.alt || post.title"
                class="gallery-image"
                loading="lazy"
              />
              <figcaption v-if="img.caption" class="image-caption">
                {{ img.caption }}
              </figcaption>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      <!-- Article Content -->
      <article class="article-body">
        <div ref="content" v-html="renderedMarkdown"></div>
      </article>

      <!-- Tags -->
      <div v-if="post.tags && post.tags.length" class="article-tags">
        <span class="tags-label">
          <i class="fas fa-tags"></i>
          {{ $i18n.locale === "ar" ? "الكلمات المفتاحية" : "Tags" }}:
        </span>
        <div class="tags-list">
          <nuxt-link
            v-for="tag in post.tags"
            :key="tag"
            :to="`/tags/${tag}`"
            class="tag"
          >
            {{ tag }}
          </nuxt-link>
        </div>
      </div>

      <!-- Attachments -->
      <section v-if="post.attachments?.length" class="attachments">
        <h2 class="section-title">
          <i class="fas fa-paperclip"></i>
          {{ $t("Attachments") }}
        </h2>
        <div class="attachments-grid">
          <div
            v-for="att in post.attachments"
            :key="att.name"
            class="attachment-card"
          >
            <a
              :href="att.file"
              target="_blank"
              class="attachment-link"
              rel="noopener"
            >
              <div class="attachment-icon">
                <i class="fas fa-download"></i>
              </div>
              <div class="attachment-info">
                <span class="attachment-name">{{ att.name }}</span>
                <span v-if="att.description" class="attachment-description">{{
                  att.description
                }}</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      <!-- Related Articles -->
      <!-- <section v-if="relatedPosts.length" class="related-articles">
        <h2 class="section-title">
          <i class="fas fa-newspaper"></i>
          {{ $i18n.locale === "ar" ? "مقالات ذات صلة" : "Related Articles" }}
        </h2>
        <div class="related-grid">
          <article
            v-for="article in relatedPosts"
            :key="article.slug"
            class="related-card"
          >
            <nuxt-link :to="`/blog/${article.slug}`" class="related-link">
              <div class="related-image">
                <img
                  :src="article.featuredImage?.url || '/images/placeholder.jpg'"
                  :alt="article.featuredImage?.alt || article.title"
                  loading="lazy"
                />
                <div
                  class="threat-badge-small"
                  :class="`threat-${article.threatLevel}`"
                >
                  {{ getThreatLevelLabel(article.threatLevel) }}
                </div>
              </div>
              <div class="related-content">
                <h3 class="related-title">{{ article.title }}</h3>
                <p class="related-excerpt">{{ article.excerpt }}</p>
                <div class="related-meta">
                  <span class="related-date">{{
                    formatDate(article.date)
                  }}</span>
                  <span class="related-read-time">{{ article.readTime }}</span>
                </div>
              </div>
            </nuxt-link>
          </article>
        </div>
      </section> -->
    </main>
  </div>
</template>

<script setup>
import MarkdownIt from "markdown-it";

const route = useRoute();
const slug = route.params.slug;

// ----------------------------
// STATES
// ----------------------------
const headings = ref([]);
const activeHeading = ref("");
const content = ref(null);

// ----------------------------
// MAIN POST  (Nuxt Content)
// ----------------------------
const { data: post } = await useAsyncData(`post-${slug}`, () =>
  queryContent("posts")
    .where({ slug }) // slug: "my-article"
    .findOne()
);

// ----------------------------
// MOST WATCHED
// ----------------------------
const { data: mostWatched } = await useAsyncData(`most-watched`, () =>
  $fetch(`/api/posts/most-watched`)
);

// ----------------------------
// MARKDOWN RENDER
// ----------------------------
const md = new MarkdownIt({ html: true, linkify: true });

const renderedMarkdown = computed(() => {
  if (!post.value) return "";
  const raw = post.value.body || post.value.content || "";
  return md.render(raw);
});

// ----------------------------
// HEADINGS + OBSERVER
// ----------------------------
const extractHeadings = () => {
  if (!content.value) return;

  const headingElements = content.value.querySelectorAll("h2, h3");
  headings.value = Array.from(headingElements).map((heading, index) => {
    const id = `heading-${index}`;
    heading.id = id;
    return {
      id,
      text: heading.textContent,
      level: heading.tagName.toLowerCase(),
    };
  });
};

const setupIntersectionObserver = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) activeHeading.value = entry.target.id;
      });
    },
    { rootMargin: "-20% 0px -80% 0px" }
  );

  headings.value.forEach((h) => {
    const el = document.getElementById(h.id);
    if (el) observer.observe(el);
  });
};

// ----------------------------
// VISIT COUNTER (KEEP API)
// ----------------------------
const increaseVisit = async () => {
  try {
    await $fetch(`/api/posts/${slug}/visit`, { method: "POST" });
  } catch (err) {
    console.error("Visit API failed:", err);
  }
};

// ----------------------------
// ON MOUNT (after DOM ready)
// ----------------------------
onMounted(async () => {
  // Wait for Nuxt Content to finish rendering
  await nextTick();

  setTimeout(() => {
    extractHeadings();
    setupIntersectionObserver();
  }, 150);

  // Increase visit AFTER component mounts
  increaseVisit();
});

// ----------------------------
// SHARE BUTTONS
// ----------------------------
const shareOnFacebook = () =>
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`
  );

const shareOnTwitter = () =>
  window.open(
    `https://twitter.com/intent/tweet?url=${
      window.location.href
    }&text=${encodeURIComponent(post.value?.title || "")}`
  );

const shareOnLinkedIn = () =>
  window.open(
    `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`
  );

const shareOnWhatsApp = () =>
  window.open(
    `https://wa.me/?text=${encodeURIComponent(
      `${post.value?.title} - ${window.location.href}`
    )}`
  );

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    alert("Link copied!");
  } catch (err) {
    console.error("Copy failed", err);
  }
};

const scrollToHeading = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
    history.pushState(null, null, `#${id}`);
  }
};

// ----------------------------
// UTILITIES
// ----------------------------
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// SEO
useSeoMeta({
  title: () => post.value?.title || "Article",
  description: () => post.value?.excerpt || "",
  ogTitle: () => post.value?.title || "",
  ogDescription: () => post.value?.excerpt || "",
  ogImage: () => post.value?.image1 || "",
  twitterCard: "summary_large_image",
});

// JSON-LD
useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: () => ({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.value?.title,
        description: post.value?.excerpt,
        datePublished: post.value?.date,
        image: post.value?.image1 ? [post.value.image1] : [],
        author: {
          "@type": "Person",
          name: post.value?.author,
        },
      }),
    },
  ],
});

// TITLES
const truncateTitle = (title, maxLength = 70) => {
  if (!title) return "";
  if (title.length <= maxLength) return title;
  const truncated = title.substr(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return lastSpace > maxLength * 0.7
    ? truncated.substr(0, lastSpace) + "..."
    : truncated + "...";
};
</script>

<style scoped>
.threat-info {
  background: #17a2b8;
  color: white;
}
.threat-low {
  background: #28a745;
  color: white;
}
.threat-medium {
  background: #ffc107;
  color: black;
}
.threat-high {
  background: #fd7e14;
  color: white;
}
.threat-critical {
  background: #dc3545;
  color: white;
}
.article-page {
  display: flex;
  gap: 40px;
  padding: 40px 20px;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
}

/* MAIN CONTENT */
.content {
  flex: 1;
  max-width: 70%;
}

/* Breadcrumb */
.breadcrumb {
  margin-bottom: 30px;
}

.breadcrumb ol {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  flex-wrap: wrap;
}

.breadcrumb li {
  margin-right: 8px;
  display: flex;
  align-items: center;
}

.breadcrumb a {
  color: #666;
  text-decoration: none;
  transition: color 0.2s;
  font-size: 14px;
}

.breadcrumb a:hover {
  color: #a03a3f;
}

.breadcrumb span {
  color: #333;
  font-weight: 500;
}

/* Article Header */
.article-header {
  margin-bottom: 30px;
}

.article-title {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 20px;
  color: #222;
  position: relative;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.meta-left {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.article-date,
.article-author,
.article-reading-time {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
  margin: 0;
}

.article-date i,
.article-author i,
.article-reading-time i {
  color: #a03a3f;
}

/* Share Section */
.share-section {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.share-section span {
  font-weight: 500;
  color: #666;
}

.share-buttons {
  display: flex;
  gap: 8px;
}

.share-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
}

.share-btn .iconify {
  color: #fff;
  width: 20px;
  height: 20px;
}

.share-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.share-btn.facebook {
  background: #3b5998;
}
.share-btn.twitter {
  background: #1da1f2;
}
.share-btn.linkedin {
  background: #0077b5;
}
.share-btn.whatsapp {
  background: #25d366;
}
.share-btn.link {
  background: #6c757d;
}

/* Featured Image */
.featured-image {
  margin-bottom: 30px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.main-article-image {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.5s ease;
}

.featured-image:hover .main-article-image {
  transform: scale(1.02);
}

/* Gallery */
.gallery {
  margin-bottom: 40px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.gallery-swiper {
  width: 100%;
}

.swiper-image-container {
  position: relative;
  width: 100%;
  height: 500px;
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

:deep(.swiper-pagination-bullet) {
  width: 12px;
  height: 12px;
  background: rgba(255, 255, 255, 0.7);
  opacity: 0.7;
}

:deep(.swiper-pagination-bullet-active) {
  background: #a03a3f;
  opacity: 1;
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: white;
  background: rgba(0, 0, 0, 0.3);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  transition: all 0.3s;
}

:deep(.swiper-button-next):hover,
:deep(.swiper-button-prev):hover {
  background: rgba(0, 0, 0, 0.6);
}

:deep(.swiper-button-next):after,
:deep(.swiper-button-prev):after {
  font-size: 20px;
}

/* Table of Contents */
.table-of-contents {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 30px;
  border-left: 4px solid #a03a3f;
}

.table-of-contents h3 {
  margin-top: 0;
  margin-bottom: 16px;
  color: #333;
  font-size: 1.2rem;
}

.table-of-contents ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.table-of-contents li {
  margin-bottom: 8px;
}

.table-of-contents a {
  color: #555;
  text-decoration: none;
  transition: color 0.2s;
  display: block;
  padding: 4px 0;
}

.table-of-contents a:hover {
  color: #a03a3f;
}

/* Article Body */
.article-body {
  margin-bottom: 40px;
  line-height: 1.8;
  font-size: 1.1rem;
  color: #444;
}

:deep(.article-body h2) {
  font-size: 1.8rem;
  margin: 2.5rem 0 1.5rem;
  color: #333;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f0f0f0;
}

:deep(.article-body h3) {
  font-size: 1.5rem;
  margin: 2rem 0 1rem;
  color: #333;
}

:deep(.article-body p) {
  margin-bottom: 1.5rem;
}

:deep(.article-body img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1.5rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

:deep(.article-body blockquote) {
  border-left: 4px solid #a03a3f;
  padding: 1rem 1.5rem;
  margin: 1.5rem 0;
  background: #f8f9fa;
  font-style: italic;
  color: #555;
}

:deep(.article-body ul),
:deep(.article-body ol) {
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
}

:deep(.article-body li) {
  margin-bottom: 0.5rem;
}

:deep(.article-body a) {
  color: #a03a3f;
  text-decoration: none;
  transition: all 0.2s;
}

:deep(.article-body a:hover) {
  color: #cc0000;
  text-decoration: underline;
}

/* Additional Images */
.additional-images {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin: 30px 0;
}

.article-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.article-image:hover {
  transform: scale(1.02);
}

/* Tags */
.article-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 40px;
  padding: 20px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.tags-label {
  font-weight: 500;
  color: #666;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  background: #f0f7ff;
  color: #a03a3f;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  border: 1px solid #d0e3ff;
}

/* Sections */
.section-title {
  font-size: 1.6rem;
  margin-bottom: 1.5rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-title i {
  color: #a03a3f;
}

/* Attachments */
.attachments {
  margin-bottom: 40px;
}

.attachments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.attachment-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.attachment-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.attachment-link {
  display: flex;
  align-items: center;
  padding: 1rem;
  text-decoration: none;
  color: inherit;
}

.attachment-icon {
  width: 40px;
  height: 40px;
  background: #f0f7ff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  color: #a03a3f;
  font-size: 1.2rem;
}

.attachment-info {
  display: flex;
  flex-direction: column;
}

.attachment-name {
  font-weight: 500;
  color: #333;
  margin-bottom: 0.2rem;
}

.attachment-size {
  font-size: 0.8rem;
  color: #777;
}

/* Videos */
.videos {
  margin-bottom: 40px;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.video-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.video-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.video-wrapper {
  position: relative;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
}

.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
}

.video-caption {
  padding: 1rem;
  font-size: 0.95rem;
  color: #444;
}

/* Related Articles */
.related-articles {
  margin-bottom: 40px;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.related-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.related-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.related-link {
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
}

.related-image {
  height: 180px;
  overflow: hidden;
}

.related-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.related-card:hover .related-image img {
  transform: scale(1.05);
}

.related-content {
  padding: 1.2rem;
}

.related-title {
  font-size: 1.1rem;
  margin: 0 0 0.5rem;
  color: #333;
  line-height: 1.4;
}

.related-date {
  font-size: 0.85rem;
  color: #666;
  margin: 0;
}

/* Newsletter */
.newsletter-section {
  margin: 40px 0;
}

.newsletter-card {
  background: linear-gradient(135deg, #a03a3f, #8a2e32);
  border-radius: 12px;
  overflow: hidden;
  color: white;
  padding: 2.5rem;
  text-align: center;
}

.newsletter-content h3 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.newsletter-content p {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  opacity: 0.9;
}

.newsletter-form {
  display: flex;
  max-width: 500px;
  margin: 0 auto;
}

.newsletter-form input {
  flex: 1;
  padding: 0.8rem 1rem;
  border: none;
  border-radius: 6px 0 0 6px;
  font-size: 1rem;
}

.newsletter-form input:focus {
  outline: none;
}

.newsletter-form button {
  padding: 0 1.5rem;
  background: #222;
  color: white;
  border: none;
  border-radius: 0 6px 6px 0;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.newsletter-form button:hover {
  background: #000;
}

.sidebar {
  width: 30%;
  max-width: 350px;
  position: sticky;
  top: 10px;
  height: 100vh;
  margin-bottom: 20px;
  align-self: flex-start;
  overflow-y: auto;

  /* Enhanced Scrollbar Styling */
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: #c1c1c1 transparent; /* Firefox */

  /* Smooth scrolling */
  scroll-behavior: smooth;

  /* Hide scrollbar until hover */
  overflow-y: overlay; /* For WebKit browsers that support it */
}

/* WebKit Scrollbar Styling */
.sidebar::-webkit-scrollbar {
  width: 6px;
  background: transparent;
}

.sidebar::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 10px;
  margin: 8px 0;
}

.sidebar::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
  border: 2px solid transparent;
  background-clip: content-box;
  transition: all 0.3s ease;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: #a03a3f;
  border: 1px solid transparent;
  background-clip: content-box;
}

.sidebar::-webkit-scrollbar-thumb:active {
  background: #8a2e32;
}

/* Firefox Scrollbar Styling */
@supports (scrollbar-color: auto) {
  .sidebar {
    scrollbar-color: #c1c1c1 transparent;
    scrollbar-width: thin;
  }

  .sidebar:hover {
    scrollbar-color: #a03a3f transparent;
  }
}

/* Custom scrollbar animation */
@keyframes scrollbarFadeIn {
  from {
    opacity: 0;
    transform: scaleX(0.8);
  }
  to {
    opacity: 1;
    transform: scaleX(1);
  }
}

.sidebar::-webkit-scrollbar-thumb {
  animation: scrollbarFadeIn 0.3s ease-out;
}

/* Enhanced hover effects */
.sidebar:hover::-webkit-scrollbar-thumb {
  background: #a8a8a8;
}

.sidebar:active::-webkit-scrollbar-thumb {
  background: #8a2e32;
}

/* Scroll momentum for iOS devices */
.sidebar {
  -webkit-overflow-scrolling: touch;
}

/* Custom scrollbar for Edge */
@supports (-ms-overflow-style: none) {
  .sidebar {
    -ms-overflow-style: -ms-autohiding-scrollbar;
  }
}

/* Hide scrollbar when not interacting (optional) */
.sidebar:not(:hover)::-webkit-scrollbar-thumb {
  background: transparent;
}

.sidebar:not(:hover) {
  scrollbar-color: transparent transparent; /* Firefox */
}

/* Smooth transition for scrollbar visibility */
.sidebar::-webkit-scrollbar-thumb {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Gradient scrollbar effect */
.sidebar::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #c1c1c1, #a8a8a8);
}

.sidebar:hover::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #a03a3f, #8a2e32);
}

/* Scrollbar corner styling */
.sidebar::-webkit-scrollbar-corner {
  background: transparent;
}

/* Enhanced sidebar container with scroll shadows */
.sidebar {
  position: relative;
}

/* Add subtle top and bottom fade effects */
.sidebar::before,
.sidebar::after {
  content: "";
  position: sticky;
  left: 0;
  right: 0;
  height: 20px;
  pointer-events: none;
  z-index: 2;
}

.sidebar::before {
  top: 0;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(255, 255, 255, 0.7) 50%,
    transparent 100%
  );
}

.sidebar::after {
  bottom: 0;
  background: linear-gradient(
    to top,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(255, 255, 255, 0.7) 50%,
    transparent 100%
  );
}

.sidebar-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 10px;
}

.sidebar-title i {
  color: #a03a3f;
}

.sidebar-list {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 0px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.sidebar-item {
  margin-bottom: 15px;
  border-bottom: 1px solid #e9ecef;
}

.sidebar-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.sidebar-link {
  display: flex;
  align-items: flex-start;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
  padding: 5px;
  border-radius: 6px;
}

.sidebar-link:hover {
  background: rgba(160, 58, 63, 0.05);
  color: #a03a3f;
}

.count {
  font-weight: 700;
  color: #a03a3f;
  margin-right: 10px;
  min-width: 20px;
}

.sidebar-content {
  flex: 1;
}

.sidebar-content .title {
  font-weight: 500;
  display: block;
  margin-bottom: 5px;
  line-height: 1.4;
}

.sidebar-date {
  font-size: 0.8rem;
  color: #666;
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .article-page {
    flex-direction: column;
    gap: 30px;
  }

  .content {
    max-width: 100%;
  }

  .sidebar {
    width: 100%;
    max-width: 100%;
    position: static;
  }

  .sidebar-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
  }

  .sidebar-item {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
    border-right: 1px solid #e9ecef;
    padding-right: 15px;
  }

  .sidebar-item:last-child {
    border-right: none;
  }
}

@media (max-width: 768px) {
  .article-page {
    padding: 20px 15px;
  }

  .article-title {
    font-size: 2rem;
  }

  .article-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .meta-left {
    flex-direction: column;
    gap: 10px;
  }

  .share-section {
    width: 100%;
    justify-content: space-between;
  }

  .swiper-image-container {
    height: 300px;
  }

  .additional-images {
    grid-template-columns: 1fr;
  }

  .attachments-grid,
  .video-grid,
  .related-grid {
    grid-template-columns: 1fr;
  }

  .sidebar-list {
    grid-template-columns: 1fr;
  }

  .sidebar-item {
    border-right: none;
    border-bottom: 1px solid #e9ecef;
    padding-right: 0;
    padding-bottom: 15px;
  }

  .sidebar-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .newsletter-card {
    padding: 1.5rem;
  }

  .newsletter-form {
    flex-direction: column;
  }

  .newsletter-form input {
    border-radius: 6px;
    margin-bottom: 10px;
  }

  .newsletter-form button {
    border-radius: 6px;
    padding: 0.8rem;
  }
}

@media (max-width: 480px) {
  .article-title {
    font-size: 1.7rem;
  }

  .swiper-image-container {
    height: 200px;
  }

  .article-body {
    font-size: 1rem;
  }
}

.most-viewed-sidebar {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  margin-bottom: 24px;
}

.sidebar-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
}

.sidebar-title i {
  color: #a03a3f;
  font-size: 1.1rem;
}

.sidebar-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar-item {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
  overflow: hidden;
}

.sidebar-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(160, 58, 63, 0.15);
}

.sidebar-link {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  text-decoration: none;
  color: inherit;
  background: #fafafa;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.sidebar-link::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: linear-gradient(135deg, #a03a3f, #8a2e32);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.sidebar-item:hover .sidebar-link::before {
  opacity: 1;
}

.sidebar-item:hover .sidebar-link {
  background: #ffffff;
  border-color: #e0e0e0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

/* Rank Styling */
.item-rank {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.rank-number {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.sidebar-item:nth-child(1) .rank-number {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  box-shadow: 0 2px 8px rgba(245, 87, 108, 0.3);
}

.sidebar-item:nth-child(2) .rank-number {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  box-shadow: 0 2px 8px rgba(79, 172, 254, 0.3);
}

.sidebar-item:nth-child(3) .rank-number {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  box-shadow: 0 2px 8px rgba(67, 233, 123, 0.3);
}

.rank-trend {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
}

.trend-up {
  background: #10b981;
  color: white;
}

.trend-down {
  background: #ef4444;
  color: white;
}

.trend-stable {
  background: #6b7280;
  color: white;
}

/* Content Styling */
.sidebar-content {
  flex: 1;
  min-width: 0; /* Crucial for text truncation */
}

.title {
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.4;
  color: #1a1a1a;
  margin: 0 0 8px 0;

  /* Multi-line truncation with fallback */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  /* Fallback for non-webkit browsers */
  max-height: 2.8em;
  overflow: hidden;
}

/* Meta Information */
.sidebar-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.meta-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.sidebar-date,
.read-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: #666;
  white-space: nowrap;
}

.sidebar-date i,
.read-time i {
  font-size: 0.7rem;
  opacity: 0.7;
}

/* Threat Level Badges */
.threat-level {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.threat-info {
  background: #dbeafe;
  color: #1e40af;
  border: 1px solid #bfdbfe;
}

.threat-low {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.threat-medium {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
}

.threat-high {
  background: #fed7aa;
  color: #9a3412;
  border: 1px solid #fdba74;
}

.threat-critical {
  background: #fecaca;
  color: #991b1b;
  border: 1px solid #fca5a5;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .most-viewed-sidebar {
    padding: 20px;
  }

  .sidebar-link {
    padding: 14px;
  }

  .title {
    font-size: 0.9rem;
    -webkit-line-clamp: 2;
  }

  .sidebar-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .meta-left {
    gap: 8px;
  }
}

@media (max-width: 768px) {
  .most-viewed-sidebar {
    border-radius: 12px;
    padding: 16px;
  }

  .sidebar-title {
    font-size: 1.1rem;
    margin-bottom: 16px;
  }

  .sidebar-list {
    gap: 8px;
  }

  .sidebar-link {
    padding: 12px;
    gap: 10px;
  }

  .rank-number {
    width: 28px;
    height: 28px;
    font-size: 0.8rem;
  }

  .title {
    font-size: 0.85rem;
    -webkit-line-clamp: 2;
  }

  .sidebar-date,
  .read-time {
    font-size: 0.7rem;
  }

  .threat-level {
    font-size: 0.65rem;
    padding: 3px 6px;
  }
}

@media (max-width: 480px) {
  .sidebar-meta {
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }

  .meta-left {
    flex: 1;
  }

  .title {
    -webkit-line-clamp: 3;
    max-height: 4.2em;
  }
}
</style>
