<template>
  <div v-if="post" class="article-page">
    <!-- ===== Sidebar (Most Viewed) ===== -->
    <aside class="sidebar">
      <h2 class="sidebar-title">
        <i class="fas fa-chart-line"></i>
        {{ $i18n.locale === "ar" ? "الأكثر مشاهدة" : "Most Viewed" }}
      </h2>

      <div class="sidebar-list">
        <div
          v-for="(item, index) in mostWatched"
          :key="item.slug"
          class="sidebar-item"
        >
          <nuxt-link :to="`/blog/${item.slug}`" class="sidebar-link">
            <span class="count">{{ index + 1 }}.</span>
            <div class="sidebar-content">
              <span class="title">{{ item.title }}</span>
              <span class="sidebar-date">{{ formatDate(item.date) }}</span>
            </div>
          </nuxt-link>
        </div>
      </div>
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
              {{ post.category }}
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
        <!-- Title -->
        <h1 class="article-title">{{ post.title }}</h1>

        <!-- Meta Information -->
        <div class="article-meta">
          <div class="meta-left">
            <p class="article-date">
              <i class="far fa-calendar-alt"></i>
              {{ formatDate(post.date) }}
            </p>
            <p v-if="post.author" class="article-author">
              <i class="far fa-user"></i>
              {{ post.author }}
            </p>
            <p class="article-reading-time">
              <i class="far fa-clock"></i>
              {{ readingTime }}
              {{ $i18n.locale === "ar" ? "دقيقة" : "min read" }}
            </p>
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
                <i class="fab fa-facebook-f"></i>
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
                <i class="fab fa-twitter"></i>
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
                <i class="fab fa-linkedin-in"></i>
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
                <i class="fab fa-whatsapp"></i>
              </button>
              <button
                @click="copyLink"
                class="share-btn link"
                :aria-label="$i18n.locale === 'ar' ? 'نسخ الرابط' : 'Copy link'"
              >
                <i class="fas fa-link"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Featured Image -->
      <div v-if="post.image" class="featured-image">
        <img
          :src="post.image"
          :alt="post.title"
          class="main-article-image"
          loading="lazy"
        />
      </div>

      <!-- Gallery -->
      <div v-if="galleryImages.length > 0" class="gallery">
        <Swiper
          :modules="[SwiperNavigation, SwiperPagination, SwiperAutoplay]"
          :slides-per-view="1"
          :space-between="20"
          :pagination="{ clickable: true }"
          :navigation="true"
          :autoplay="{ delay: 5000, disableOnInteraction: false }"
          :loop="galleryImages.length > 1"
          class="gallery-swiper"
        >
          <SwiperSlide v-for="(img, idx) in galleryImages" :key="idx">
            <div class="swiper-image-container">
              <img
                :src="img.src"
                :alt="img.alt"
                class="gallery-image"
                loading="lazy"
              />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      <!-- Table of Contents -->
      <div v-if="headings.length > 0" class="table-of-contents">
        <h3>
          {{ $i18n.locale === "ar" ? "محتويات المقال" : "Table of Contents" }}
        </h3>
        <ul>
          <li v-for="(heading, index) in headings" :key="index">
            <a
              :href="`#${heading.id}`"
              @click.prevent="scrollToHeading(heading.id)"
            >
              {{ heading.text }}
            </a>
          </li>
        </ul>
      </div>

      <!-- Body Content -->
      <article class="article-body">
        <div ref="content" v-html="post.content"></div>

        <!-- Additional Images -->
        <div v-if="post.image2 || post.image3" class="additional-images">
          <img
            v-if="post.image2"
            :src="post.image2"
            :alt="`${post.title} - Image 2`"
            class="article-image"
            loading="lazy"
          />
          <img
            v-if="post.image3"
            :src="post.image3"
            :alt="`${post.title} - Image 3`"
            class="article-image"
            loading="lazy"
          />
        </div>
      </article>

      <!-- Tags -->
      <div v-if="post.tags && post.tags.length" class="article-tags">
        <span class="tags-label"
          >{{ $i18n.locale === "ar" ? "الكلمات المفتاحية" : "Tags" }}:</span
        >
        <div class="tags-list">
          <span v-for="tag in post.tags" :key="tag" class="tag">
            {{ tag }}
          </span>
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
                <span v-if="att.size" class="attachment-size">{{
                  att.size
                }}</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      <!-- Videos -->
      <section v-if="post.videos?.length" class="videos">
        <h2 class="section-title">
          <i class="fas fa-video"></i>
          {{ $t("Videos") }}
        </h2>
        <div class="video-grid">
          <div v-for="vid in post.videos" :key="vid.url" class="video-card">
            <div class="video-wrapper">
              <iframe
                :src="`https://www.youtube.com/embed/${vid.url}`"
                :title="vid.title || 'YouTube video'"
                allowfullscreen
                loading="lazy"
              ></iframe>
            </div>
            <div v-if="vid.title" class="video-caption">{{ vid.title }}</div>
          </div>
        </div>
      </section>

      <!-- Related Articles -->
      <section v-if="relatedArticles.length" class="related-articles">
        <h2 class="section-title">
          <i class="fas fa-newspaper"></i>
          {{ $i18n.locale === "ar" ? "مقالات ذات صلة" : "Related Articles" }}
        </h2>
        <div class="related-grid">
          <div
            v-for="article in relatedArticles"
            :key="article.slug"
            class="related-card"
          >
            <nuxt-link :to="`/blog/${article.slug}`" class="related-link">
              <div class="related-image">
                <img :src="article.image" :alt="article.title" loading="lazy" />
              </div>
              <div class="related-content">
                <h3 class="related-title">{{ article.title }}</h3>
                <p class="related-date">{{ formatDate(article.date) }}</p>
              </div>
            </nuxt-link>
          </div>
        </div>
      </section>

      <!-- Newsletter Subscription -->
      <section class="newsletter-section">
        <div class="newsletter-card">
          <div class="newsletter-content">
            <h3>
              {{
                $i18n.locale === "ar"
                  ? "اشترك في نشرتنا الإخبارية"
                  : "Subscribe to our newsletter"
              }}
            </h3>
            <p>
              {{
                $i18n.locale === "ar"
                  ? "ابق على اطلاع بأحدث المقالات والأخبار"
                  : "Stay updated with our latest articles and news"
              }}
            </p>
            <div class="newsletter-form">
              <input
                type="email"
                :placeholder="
                  $i18n.locale === 'ar'
                    ? 'بريدك الإلكتروني'
                    : 'Your email address'
                "
                aria-label="Email address"
              />
              <button type="submit">
                {{ $i18n.locale === "ar" ? "اشتراك" : "Subscribe" }}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";

// Route params
const route = useRoute();
const slug = route.params.slug;

// States
const post = ref(null);
const mostWatched = ref([]);
const galleryImages = ref([]);
const relatedArticles = ref([]);
const headings = ref([]);
const content = ref(null);

// Fetch current article
const fetchPost = async () => {
  const { data, error } = await useFetch(`/api/posts/${slug}`);

  if (error.value) {
    console.error("Failed to fetch post", error.value);
    return;
  }

  post.value = data.value;

  // Build gallery list
  galleryImages.value = [post.value.image, post.value.image2, post.value.image3]
    .filter(Boolean)
    .map((img) => ({ src: img, alt: post.value?.title || "" }));
};

// Fetch most watched articles
const fetchMostWatched = async () => {
  const { data, error } = await useFetch("/api/posts/most-watched");

  if (error.value) {
    console.error("Failed to fetch most watched posts", error.value);
    return;
  }

  mostWatched.value = data.value;
};

// Fetch related articles
const fetchRelatedArticles = async () => {
  if (!post.value?.category) return;

  const { data, error } = await useFetch(
    `/api/posts/related/${post.value.category}?limit=3`
  );

  if (error.value) {
    console.error("Failed to fetch related articles", error.value);
    return;
  }

  relatedArticles.value = data.value.filter((article) => article.slug !== slug);
};

// Extract headings from content
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

// Increase visit count
const increaseVisit = async () => {
  try {
    await $fetch(`/api/posts/${slug}/visit`, { method: "POST" });
  } catch (err) {
    console.error("Failed to update visit count", err);
  }
};

// Calculate reading time
const readingTime = computed(() => {
  if (!post.value?.content) return 0;

  // Remove HTML tags and count words
  const text = post.value.content.replace(/<[^>]*>/g, "");
  const wordCount = text.split(/\s+/).length;

  // Average reading speed: 200 words per minute
  return Math.max(1, Math.ceil(wordCount / 200));
});

// On load
onMounted(async () => {
  await fetchPost();
  await fetchMostWatched();
  await fetchRelatedArticles();
  await increaseVisit();

  // Extract headings after content is rendered
  setTimeout(extractHeadings, 100);
});

// Share functions
const shareOnFacebook = () => {
  const url = encodeURIComponent(window.location.href);
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    "_blank",
    "width=600,height=400"
  );
};

const shareOnTwitter = () => {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(post.value?.title || "");
  window.open(
    `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
    "_blank",
    "width=600,height=400"
  );
};

const shareOnLinkedIn = () => {
  const url = encodeURIComponent(window.location.href);
  window.open(
    `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    "_blank",
    "width=600,height=400"
  );
};

const shareOnWhatsApp = () => {
  const text = encodeURIComponent(
    `${post.value?.title} - ${window.location.href}`
  );
  window.open(`https://wa.me/?text=${text}`, "_blank", "width=600,height=400");
};

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    // Show success message (you could implement a toast notification)
    alert("Link copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy link: ", err);
  }
};

const scrollToHeading = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });

    // Update URL without page reload
    history.pushState(null, null, `#${id}`);
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// SEO Meta Tags
useSeoMeta({
  title: post.value?.title || "Article",
  description:
    post.value?.excerpt ||
    post.value?.content?.substring(0, 160) ||
    "Read this interesting article",
  ogTitle: post.value?.title || "Article",
  ogDescription:
    post.value?.excerpt ||
    post.value?.content?.substring(0, 160) ||
    "Read this interesting article",
  ogImage: post.value?.image || "",
  ogUrl: typeof window !== "undefined" ? window.location.href : "",
  twitterCard: "summary_large_image",
});

// Structured data for SEO
useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: computed(() => {
        if (!post.value) return {};

        return {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.value.title,
          description:
            post.value.excerpt || post.value.content?.substring(0, 160),
          image: post.value.image ? [post.value.image] : [],
          datePublished: post.value.date,
          dateModified: post.value.updatedAt || post.value.date,
          author: {
            "@type": "Person",
            name: post.value.author || "Unknown",
          },
          publisher: {
            "@type": "Organization",
            name: "Your Site Name",
            logo: {
              "@type": "ImageObject",
              url: "/logo.png",
            },
          },
        };
      }),
    },
  ],
});
</script>

<style scoped>
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

/* SIDEBAR */
.sidebar {
  width: 30%;
  max-width: 350px;
  position: sticky;
  top: 100px;
  align-self: flex-start;
  height: fit-content;
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
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.sidebar-item {
  margin-bottom: 15px;
  padding-bottom: 15px;
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
</style>
