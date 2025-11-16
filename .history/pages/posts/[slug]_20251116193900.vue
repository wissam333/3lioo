<template>
  <!-- Skip to main content for accessibility -->
  <a href="#main-content" class="skip-link">
    {{
      $i18n.locale === "ar"
        ? "انتقل إلى المحتوى الرئيسي"
        : "Skip to main content"
    }}
  </a>

  <div v-if="pending" class="loading-state">
    <div class="loading-spinner">
      <i class="fas fa-spinner fa-spin"></i>
      <p>{{ $i18n.locale === "ar" ? "جاري التحميل..." : "Loading..." }}</p>
    </div>
  </div>

  <div v-else-if="error" class="error-state">
    <div class="error-content">
      <i class="fas fa-exclamation-triangle"></i>
      <h2>{{ $i18n.locale === "ar" ? "خطأ في التحميل" : "Loading Error" }}</h2>
      <p>{{ error.message }}</p>
      <button @click="clearError && $router.push('/')" class="retry-btn">
        {{ $i18n.locale === "ar" ? "العودة للرئيسية" : "Back to Home" }}
      </button>
    </div>
  </div>

  <div v-else-if="validatedPost" class="article-page">
    <!-- Reading Progress Bar -->
    <div class="reading-progress">
      <div class="progress-bar" :style="{ width: `${scrollProgress}%` }"></div>
    </div>

    <!-- ===== Sidebar (Most Viewed + Table of Contents) ===== -->
    <aside class="sidebar">
      <!-- Table of Contents -->
      <div v-if="headings.length > 0" class="toc-sidebar">
        <h3 class="sidebar-title">
          <i class="fas fa-list"></i>
          {{ $i18n.locale === "ar" ? "محتويات المقال" : "Table of Contents" }}
        </h3>
        <nav class="toc-nav" aria-label="Table of contents">
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
                :aria-current="activeHeading === heading.id ? 'location' : null"
              >
                {{ heading.text }}
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <!-- Most Viewed -->
      <!-- <div class="most-viewed-sidebar">
        <h3 class="sidebar-title">
          <i class="fas fa-chart-line"></i>
          {{ $i18n.locale === "ar" ? "الأكثر مشاهدة" : "Most Viewed" }}
        </h3>
        <div class="sidebar-list">
          <div
            v-for="(item, index) in mostWatched"
            :key="item._path"
            class="sidebar-item"
          >
            <nuxt-link :to="item._path" class="sidebar-link">
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
      </div> -->
    </aside>

    <!-- ===== Main Content ===== -->
    <main id="main-content" class="content" tabindex="-1">
      <!-- Breadcrumb -->
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <ol>
          <li>
            <nuxt-link to="/">{{ $t("Home") }}</nuxt-link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <nuxt-link :to="`/posts`">
              {{ getCategoryLabel(validatedPost.category) }}
            </nuxt-link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <span aria-current="page">{{ validatedPost.title }}</span>
          </li>
        </ol>
      </nav>

      <!-- Article Header -->
      <header class="article-header">
        <!-- Threat Level Badge -->
        <div
          class="threat-badge"
          :class="`threat-${validatedPost.threatLevel}`"
        >
          <i :class="getThreatLevelIcon(validatedPost.threatLevel)"></i>
          {{ getThreatLevelLabel(validatedPost.threatLevel) }}
        </div>

        <!-- Title -->
        <h1 class="article-title">{{ validatedPost.title }}</h1>

        <!-- Meta Information -->
        <div class="article-meta">
          <div class="meta-left">
            <!-- <section v-if="authorBio" class="author-bio">
              <div class="author-avatar">
                <img width="50" :src="authorBio.avatar" :alt="authorBio.name" />
              </div>
              <div class="author-info">
                <h5 class="mb-1">{{ authorBio.name }}</h5>
                <p class="author-role">{{ authorBio.role }}</p>
              </div>
            </section> -->
            <div class="meta-details">
              <p class="article-date">
                <i class="far fa-calendar-alt"></i>
                {{ formatDate(validatedPost.date) }}
              </p>
              <p v-if="validatedPost.updated" class="article-updated">
                <i class="far fa-edit"></i>
                Updated {{ formatDate(validatedPost.updated) }}
              </p>
              <p class="article-reading-time">
                <i class="far fa-clock"></i>
                {{ validatedPost.readTime }}
              </p>
            </div>
          </div>

          <!-- Social Share -->
          <div class="share-section">
            <span>{{ $i18n.locale === "ar" ? "مشاركة" : "Share" }}:</span>
            <div class="share-buttons">
              <button
                v-if="canNativeShare"
                @click="shareNative"
                class="share-btn native"
                :aria-label="$i18n.locale === 'ar' ? 'مشاركة' : 'Share'"
              >
                <Icon name="mdi:share-variant"></Icon>
              </button>
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
                <span v-if="showCopyFeedback" class="copy-feedback">✓</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Excerpt -->
        <div v-if="validatedPost.description" class="article-excerpt">
          <p>{{ validatedPost.description }}</p>
        </div>
      </header>

      <!-- Featured Image -->
      <div v-if="validatedPost.featuredImage?.url" class="featured-image">
        <NuxtImg
          :src="validatedPost.featuredImage.url"
          :alt="validatedPost.featuredImage.alt || validatedPost.title"
          class="main-article-image"
          loading="lazy"
          placeholder
          :placeholder-src="imagePlaceholder"
          sizes="sm:100vw md:50vw lg:800px"
        />
        <figcaption
          v-if="validatedPost.featuredImage.caption"
          class="image-caption"
        >
          {{ validatedPost.featuredImage.caption }}
        </figcaption>
      </div>

      <!-- Gallery -->
      <div
        v-if="validatedPost.gallery && validatedPost.gallery.length > 0"
        class="gallery"
      >
        <ClientOnly>
          <Swiper
            :modules="[SwiperNavigation, SwiperPagination, SwiperAutoplay]"
            :slides-per-view="1"
            :space-between="20"
            :pagination="{ clickable: true }"
            :navigation="true"
            :autoplay="{ delay: 5000, disableOnInteraction: false }"
            :loop="validatedPost.gallery.length > 1"
            class="gallery-swiper"
          >
            <SwiperSlide v-for="(img, idx) in validatedPost.gallery" :key="idx">
              <div class="swiper-image-container">
                <NuxtImg
                  :src="img.image"
                  :alt="img.alt || validatedPost.title"
                  class="gallery-image"
                  loading="lazy"
                  placeholder
                  :placeholder-src="imagePlaceholder"
                  sizes="sm:100vw md:50vw lg:1200px"
                />
                <figcaption v-if="img.caption" class="image-caption">
                  {{ img.caption }}
                </figcaption>
              </div>
            </SwiperSlide>
          </Swiper>
        </ClientOnly>
      </div>

      <!-- Article Content -->
      <article class="article-body">
        <div ref="content">
          <ContentRenderer v-if="validatedPost.body" :value="validatedPost" />
          <div v-else class="no-content">
            <i class="fas fa-file-alt"></i>
            <p>
              {{
                $i18n.locale === "ar" ? "لا يوجد محتوى" : "No content available"
              }}
            </p>
          </div>
        </div>
      </article>

      <!-- Tags -->
      <div
        v-if="validatedPost.tags && validatedPost.tags.length"
        class="article-tags"
      >
        <span class="tags-label">
          <i class="fas fa-tags"></i>
          {{ $i18n.locale === "ar" ? "الكلمات المفتاحية" : "Tags" }}:
        </span>
        <div class="tags-list">
          <nuxt-link
            v-for="tag in validatedPost.tags"
            :key="tag"
            :to="`/tags/${tag}`"
            class="tag"
          >
            {{ tag }}
          </nuxt-link>
        </div>
      </div>

      <!-- Author Bio -->
      <section v-if="authorBio" class="author-bio">
        <div class="author-avatar">
          <NuxtImg
            v-if="authorBio.avatar"
            :src="authorBio.avatar"
            :alt="authorBio.name"
            class="avatar-image"
            loading="lazy"
          />
          <div v-else class="avatar-placeholder">
            {{ getInitials(authorBio.name) }}
          </div>
        </div>
        <div class="author-info">
          <h3 class="author-name">{{ authorBio.name }}</h3>
          <p class="author-role">{{ authorBio.role }}</p>
          <p class="author-bio-text">{{ authorBio.bio }}</p>
          <div v-if="authorBio.social" class="author-social">
            <a
              v-if="authorBio.social.twitter"
              :href="authorBio.social.twitter"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
              aria-label="Twitter"
            >
              <Icon name="mdi:twitter" />
            </a>
            <a
              v-if="authorBio.social.linkedin"
              :href="authorBio.social.linkedin"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
              aria-label="LinkedIn"
            >
              <Icon name="mdi:linkedin" />
            </a>
            <a
              v-if="authorBio.social.github"
              :href="authorBio.social.github"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
              aria-label="GitHub"
            >
              <Icon name="mdi:github" />
            </a>
            <a
              v-if="authorBio.social.website"
              :href="authorBio.social.website"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
              aria-label="Website"
            >
              <Icon name="mdi:web" />
            </a>
          </div>
        </div>
      </section>

      <!-- Attachments -->
      <section v-if="validatedPost.attachments?.length" class="attachments">
        <h2 class="section-title">
          <i class="fas fa-paperclip"></i>
          {{ $t("Attachments") }}
        </h2>
        <div class="attachments-grid">
          <div
            v-for="att in validatedPost.attachments"
            :key="att.name"
            class="attachment-card"
          >
            <a
              :href="att.file"
              target="_blank"
              class="attachment-link"
              rel="noopener noreferrer"
              :download="att.name"
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

      <!-- Related Posts -->
      <section v-if="relatedPosts?.length" class="related-posts">
        <h2 class="section-title">
          <i class="fas fa-newspaper"></i>
          {{ $i18n.locale === "ar" ? "مقالات ذات صلة" : "Related Articles" }}
        </h2>
        <div class="related-grid">
          <article
            v-for="related in relatedPosts"
            :key="related._path"
            class="related-card"
          >
            <nuxt-link :to="related._path" class="related-link">
              <div v-if="related.featuredImage?.url" class="related-image">
                <NuxtImg
                  :src="related.featuredImage.url"
                  :alt="related.featuredImage.alt || related.title"
                  loading="lazy"
                  placeholder
                  :placeholder-src="imagePlaceholder"
                  sizes="sm:100vw md:300px lg:400px"
                />
              </div>
              <div class="related-content">
                <h3 class="related-title">{{ related.title }}</h3>
                <p class="related-excerpt">
                  {{ related.excerpt || related.description }}
                </p>
                <div class="related-meta">
                  <span class="related-date">{{
                    formatDate(related.date)
                  }}</span>
                  <span class="related-read-time">{{ related.readTime }}</span>
                </div>
              </div>
            </nuxt-link>
          </article>
        </div>
      </section>

      <!-- Newsletter Signup -->
      <!-- <section class="newsletter-section">
        <div class="newsletter-card">
          <div class="newsletter-content">
            <h3>
              {{ $i18n.locale === "ar" ? "ابق على اطلاع" : "Stay Updated" }}
            </h3>
            <p>
              {{
                $i18n.locale === "ar"
                  ? "اشترك في نشرتنا الإخبارية للحصول على آخر التحديثات الأمنية."
                  : "Subscribe to our newsletter for the latest security updates."
              }}
            </p>
            <form @submit.prevent="subscribeNewsletter" class="newsletter-form">
              <input
                v-model="email"
                type="email"
                :placeholder="
                  $i18n.locale === 'ar'
                    ? 'بريدك الإلكتروني'
                    : 'Your email address'
                "
                required
                class="newsletter-input"
              />
              <button
                type="submit"
                class="newsletter-btn"
                :disabled="newsletterLoading"
              >
                <span
                  v-if="newsletterLoading"
                  class="loading-spinner-small"
                ></span>
                <span v-else>{{
                  $i18n.locale === "ar" ? "اشتراك" : "Subscribe"
                }}</span>
              </button>
            </form>
          </div>
        </div>
      </section> -->
    </main>
  </div>
</template>

<script setup>
// Import Swiper components with lazy loading
const Swiper = defineAsyncComponent(() => import("swiper/vue"));
const SwiperNavigation = defineAsyncComponent(() =>
  import("swiper/modules").then((m) => m.Navigation)
);
const SwiperPagination = defineAsyncComponent(() =>
  import("swiper/modules").then((m) => m.Pagination)
);
const SwiperAutoplay = defineAsyncComponent(() =>
  import("swiper/modules").then((m) => m.Autoplay)
);

const route = useRoute();
const slug = route.params.slug;

// ----------------------------
// STATES
// ----------------------------
const headings = ref([]);
const activeHeading = ref("");
const content = ref(null);
const scrollProgress = ref(0);
const showCopyFeedback = ref(false);
const email = ref("");
const newsletterLoading = ref(false);

// Image placeholder for better UX
const imagePlaceholder =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3C/svg%3E";

// Check if native sharing is available
const canNativeShare = typeof navigator !== "undefined" && navigator.share;

// ----------------------------
// DATA FETCHING
// ----------------------------
const {
  data: post,
  pending,
  error,
} = await useAsyncData(`post-${slug}`, () =>
  queryContent("posts")
    .where({ _path: { $contains: slug } })
    .findOne()
);

// Validate and sanitize post data
const validatedPost = computed(() => {
  if (!post.value) return null;

  return {
    ...post.value,
    title: post.value.title || "Untitled",
    date: post.value.date || new Date().toISOString(),
    author: post.value.author || "Security Team",
    readTime: post.value.readTime || "5 min read",
    category: post.value.category || "security",
    threatLevel: post.value.threatLevel || "info",
    tags: Array.isArray(post.value.tags) ? post.value.tags : ["security"],
    description: post.value.description || post.value.excerpt || "",
    body: post.value.body || "",
  };
});

// Most watched posts
const { data: mostWatched } = await useAsyncData(`most-watched`, () =>
  queryContent("posts")
    .where({ published: { $ne: false } })
    .sort({ visits: -1 })
    .limit(4)
    .find()
);

// Author bio
const { data: authorBio } = await useAsyncData(
  `author-${validatedPost.value?.author}`,
  () =>
    queryContent("authors")
      .where({ name: validatedPost.value?.author })
      .findOne(),
  { watch: [validatedPost] }
);

// Related posts
const { data: relatedPosts } = await useAsyncData(
  `related-${slug}`,
  () =>
    queryContent("posts")
      .where({
        category: validatedPost.value?.category,
        published: { $ne: false },
        _path: { $ne: validatedPost.value?._path },
      })
      .limit(3)
      .find(),
  { watch: [validatedPost] }
);

// ----------------------------
// SEO & META TAGS
// ----------------------------
useSeoMeta({
  title: () =>
    validatedPost.value?.seo?.metaTitle || validatedPost.value?.title,
  description: () =>
    validatedPost.value?.seo?.metaDescription ||
    validatedPost.value?.description,
  ogTitle: () =>
    validatedPost.value?.seo?.metaTitle || validatedPost.value?.title,
  ogDescription: () =>
    validatedPost.value?.seo?.metaDescription ||
    validatedPost.value?.description,
  ogImage: () => validatedPost.value?.featuredImage?.url || "",
  ogUrl: () => `https://3lioo.netlify.app${route.path}`,
  twitterCard: "summary_large_image",
  robots: () =>
    validatedPost.value?.seo?.noIndex ? "noindex, nofollow" : "index, follow",
});

// Canonical URL
useHead({
  link: [
    {
      rel: "canonical",
      href: () =>
        validatedPost.value?.seo?.canonicalUrl ||
        `https://3lioo.netlify.app${route.path}`,
    },
  ],
});

// JSON-LD structured data
useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: computed(() => {
        if (!validatedPost.value) return {};

        return {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: validatedPost.value.title,
          description: validatedPost.value.description,
          image: validatedPost.value.featuredImage?.url
            ? [validatedPost.value.featuredImage.url]
            : [],
          datePublished: validatedPost.value.date,
          dateModified: validatedPost.value.updated || validatedPost.value.date,
          author: {
            "@type": "Person",
            name: validatedPost.value.author,
          },
          publisher: {
            "@type": "Organization",
            name: "3lioo Security",
            logo: {
              "@type": "ImageObject",
              url: "https://3lioo.netlify.app/logo/logo.png",
            },
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://3lioo.netlify.app${route.path}`,
          },
        };
      }),
    },
  ],
});

// ----------------------------
// HEADINGS & INTERSECTION OBSERVER
// ----------------------------
const extractHeadings = () => {
  if (!content.value) return;

  setTimeout(() => {
    const headingElements = content.value.querySelectorAll("h2, h3, h4");

    headings.value = Array.from(headingElements)
      .filter((heading) => {
        // Skip headings that are inside components or hidden
        return heading.offsetParent !== null;
      })
      .map((heading, index) => {
        let id = heading.id;
        if (!id || document.getElementById(id) !== heading) {
          // Create URL-friendly ID
          id =
            heading.textContent
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "") || `heading-${index}`;
          heading.id = id;
        }
        return {
          id,
          text: heading.textContent.trim(),
          level: parseInt(heading.tagName.substring(1)),
        };
      });

    console.log("Extracted headings:", headings.value);

    if (headings.value.length > 0) {
      setupIntersectionObserver();
    }
  }, 150);
};

const setupIntersectionObserver = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      let mostVisible = null;
      let maxRatio = 0;

      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          mostVisible = entry.target.id;
        }
      });

      if (mostVisible) {
        activeHeading.value = mostVisible;
      }
    },
    {
      rootMargin: "-20% 0px -80% 0px",
      threshold: [0, 0.1, 0.5, 1],
    }
  );

  headings.value.forEach((h) => {
    const el = document.getElementById(h.id);
    if (el) {
      observer.observe(el);
    }
  });

  // Cleanup function
  onUnmounted(() => {
    observer.disconnect();
  });
};

// ----------------------------
// VISIT COUNTER
// ----------------------------
const increaseVisit = async () => {
  try {
    await $fetch(`/api/posts/${slug}/visit`, {
      method: "POST",
      timeout: 5000, // 5 second timeout
    });
  } catch (err) {
    console.error("Visit API failed:", err);
    // Silently fail - don't affect user experience
  }
};

// ----------------------------
// SCROLL PROGRESS
// ----------------------------
const updateProgress = () => {
  const winHeight = window.innerHeight;
  const docHeight = document.documentElement.scrollHeight;
  const scrollTop = window.pageYOffset;
  const trackLength = docHeight - winHeight;
  scrollProgress.value = Math.floor((scrollTop / trackLength) * 100);
};

// ----------------------------
// LIFECYCLE HOOKS
// ----------------------------
onMounted(async () => {
  // Wait for Nuxt Content to finish rendering
  await nextTick();

  // Extract headings after content is rendered
  extractHeadings();

  // Increase visit AFTER component mounts
  increaseVisit();

  // Setup scroll progress
  window.addEventListener("scroll", updateProgress);
});

onUnmounted(() => {
  window.removeEventListener("scroll", updateProgress);
});

// Watch for content changes and re-extract headings
watch(
  () => validatedPost.value,
  () => {
    if (validatedPost.value) {
      nextTick(() => {
        setTimeout(extractHeadings, 300);
      });
    }
  }
);

// ----------------------------
// UTILITIES
// ----------------------------

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

// Threat Level Utilities
const getThreatLevelIcon = (level) => {
  const icons = {
    info: "fas fa-info-circle",
    low: "fas fa-shield-alt",
    medium: "fas fa-exclamation-triangle",
    high: "fas fa-radiation-alt",
    critical: "fas fa-skull-crossbones",
  };
  return icons[level] || icons.info;
};

const getThreatLevelLabel = (level) => {
  const labels = {
    info: "Information",
    low: "Low Threat",
    medium: "Medium Threat",
    high: "High Threat",
    critical: "Critical Threat",
  };
  return labels[level] || labels.info;
};

const getThreatLevelShortLabel = (level) => {
  const labels = {
    info: "Info",
    low: "Low",
    medium: "Med",
    high: "High",
    critical: "Crit",
  };
  return labels[level] || "Info";
};

const getCategoryLabel = (category) => {
  const categories = {
    security: "Security",
    "threat-intel": "Threat Intelligence",
    vulnerability: "Vulnerability Analysis",
    "incident-response": "Incident Response",
    compliance: "Compliance",
    tools: "Tools & Techniques",
  };
  return categories[category] || category;
};

// Share functions
const shareData = computed(() => ({
  title: validatedPost.value?.title,
  text: validatedPost.value?.description,
  url: window.location.href,
}));

const shareNative = async () => {
  if (navigator.share) {
    try {
      await navigator.share(shareData.value);
    } catch (err) {
      console.log("Share cancelled");
    }
  }
};

const shareOnFacebook = () =>
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      window.location.href
    )}`
  );

const shareOnTwitter = () =>
  window.open(
    `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      window.location.href
    )}&text=${encodeURIComponent(validatedPost.value?.title || "")}`
  );

const shareOnLinkedIn = () =>
  window.open(
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      window.location.href
    )}`
  );

const shareOnWhatsApp = () =>
  window.open(
    `https://wa.me/?text=${encodeURIComponent(
      `${validatedPost.value?.title} - ${window.location.href}`
    )}`
  );

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    showCopyFeedback.value = true;
    setTimeout(() => (showCopyFeedback.value = false), 2000);
  } catch (err) {
    console.error("Copy failed", err);
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = window.location.href;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    showCopyFeedback.value = true;
    setTimeout(() => (showCopyFeedback.value = false), 2000);
  }
};

const scrollToHeading = (id) => {
  const element = document.getElementById(id);
  if (element) {
    const offset = 100; // Adjust based on your header height
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });

    // Update URL without page jump
    history.replaceState(null, null, `#${id}`);
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

// Author utilities
const getInitials = (name) => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

// Simulate trend data
const getTrendClass = (index) => {
  const trends = [
    "trend-up",
    "trend-stable",
    "trend-down",
    "trend-up",
    "trend-stable",
  ];
  return trends[index] || "trend-stable";
};

const getTrendIcon = (index) => {
  const icons = {
    "trend-up": "fa-arrow-up",
    "trend-down": "fa-arrow-down",
    "trend-stable": "fa-minus",
  };
  return icons[getTrendClass(index)] || "fa-minus";
};

// Newsletter subscription
const subscribeNewsletter = async () => {
  if (!email.value) return;

  newsletterLoading.value = true;
  try {
    // Implement your newsletter API call here
    await $fetch("/api/newsletter/subscribe", {
      method: "POST",
      body: { email: email.value },
    });

    // Show success message
    alert(
      $i18n.locale === "ar" ? "تم الاشتراك بنجاح!" : "Successfully subscribed!"
    );
    email.value = "";
  } catch (error) {
    console.error("Newsletter subscription failed:", error);
    alert(
      $i18n.locale === "ar"
        ? "فشل الاشتراك. حاول مرة أخرى."
        : "Subscription failed. Please try again."
    );
  } finally {
    newsletterLoading.value = false;
  }
};
</script>

<style scoped lang="scss">
.article-page {
  --sidebar-width: 350px;
  --content-width: calc(100% - var(--sidebar-width) - 40px);

  display: flex;
  gap: 40px;
  padding: 40px 20px;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Skip Link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--accent-primary);
  color: var(--bg-primary);
  padding: 8px 12px;
  text-decoration: none;
  z-index: 10000;
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  transition: var(--transition);
}

.skip-link:focus {
  top: 6px;
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}

/* Loading & Error States */
.loading-state,
.error-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 40px 20px;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.loading-spinner {
  text-align: center;
  color: var(--text-secondary);
}

.loading-spinner i {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--accent-primary);
}

.error-content {
  text-align: center;
  max-width: 400px;
}

.error-content i {
  font-size: 3rem;
  color: #dc3545;
  margin-bottom: 1rem;
}

.error-content h2 {
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.retry-btn {
  background: var(--accent-primary);
  color: var(--bg-primary);
  border: none;
  padding: 10px 20px;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  font-weight: 500;
  transition: var(--transition);

  &:hover {
    background: var(--accent-secondary);
  }
}

/* Reading Progress */
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(
    135deg,
    var(--accent-primary),
    var(--accent-secondary)
  );
  transition: width 0.3s ease;
  border-radius: 0 2px 2px 0;
}

/* MAIN CONTENT */
.content {
  flex: 1;
  max-width: var(--content-width);
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
  align-items: center;
}

.breadcrumb li {
  margin-right: 8px;
  display: flex;
  align-items: center;
  font-size: 14px;
}

.breadcrumb a {
  color: var(--text-secondary);
  text-decoration: none;
  transition: var(--transition);

  &:hover {
    color: var(--accent-primary);
  }
}

.breadcrumb span {
  color: var(--text-primary);
  font-weight: 500;
}

/* Article Header */
.article-header {
  margin-bottom: 30px;
}

.threat-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.article-title {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 20px;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-primary);
}

.meta-left {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.article-date,
.article-updated,
.article-author,
.article-reading-time {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 14px;
  margin: 0;
  transition: color 0.3s ease;
}

.article-date i,
.article-updated i,
.article-author i,
.article-reading-time i {
  color: var(--accent-primary);
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
  color: var(--text-secondary);
  transition: color 0.3s ease;
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
  transition: var(--transition);
  font-size: 16px;
  position: relative;

  &:focus {
    outline: 2px solid var(--accent-primary);
    outline-offset: 2px;
  }

  .iconify {
    color: #fff;
    width: 20px;
    height: 20px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow);
  }
}

.share-btn.native {
  background: #6c757d;
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

.copy-feedback {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #28a745;
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: bounce 0.5s ease;
}

@keyframes bounce {
  0%,
  20%,
  60%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-5px);
  }
  80% {
    transform: translateY(-2px);
  }
}

/* Article Excerpt */
.article-excerpt {
  background: var(--bg-secondary);
  padding: 20px;
  border-radius: var(--border-radius-sm);
  border-left: 4px solid var(--accent-primary);
  margin-top: 20px;
  transition: all 0.3s ease;
}

.article-excerpt p {
  margin: 0;
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--text-primary);
  font-style: italic;
  transition: color 0.3s ease;
}

/* Featured Image */
.featured-image {
  margin-bottom: 30px;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  position: relative;
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
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow);
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
  background: var(--accent-primary);
  opacity: 1;
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: white;
  background: rgba(0, 0, 0, 0.3);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  transition: var(--transition);

  &:hover {
    background: rgba(0, 0, 0, 0.6);
  }
}

:deep(.swiper-button-next):after,
:deep(.swiper-button-prev):after {
  font-size: 20px;
}

/* Image Caption */
.image-caption {
  text-align: center;
  padding: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 0.9rem;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0;
}

/* Article Body */
.article-body {
  margin-bottom: 40px;
  line-height: 1.8;
  font-size: 1.1rem;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.no-content {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary);
}

.no-content i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--border-primary);
}

:deep(.article-body h2) {
  font-size: 1.8rem;
  margin: 2.5rem 0 1.5rem;
  color: var(--text-primary);
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--border-primary);
  scroll-margin-top: 100px;
  transition: all 0.3s ease;
}

:deep(.article-body h3) {
  font-size: 1.5rem;
  margin: 2rem 0 1rem;
  color: var(--text-primary);
  scroll-margin-top: 100px;
  transition: color 0.3s ease;
}

:deep(.article-body h4) {
  font-size: 1.3rem;
  margin: 1.5rem 0 1rem;
  color: var(--text-primary);
  scroll-margin-top: 100px;
  transition: color 0.3s ease;
}

:deep(.article-body p) {
  margin-bottom: 1.5rem;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

:deep(.article-body img) {
  max-width: 100%;
  height: auto;
  border-radius: var(--border-radius-sm);
  margin: 1.5rem 0;
  box-shadow: var(--shadow-sm);
}

:deep(.article-body blockquote) {
  border-left: 4px solid var(--accent-primary);
  padding: 1rem 1.5rem;
  margin: 1.5rem 0;
  background: var(--bg-secondary);
  font-style: italic;
  color: var(--text-primary);
  border-radius: 0 var(--border-radius-sm) var(--border-radius-sm) 0;
  transition: all 0.3s ease;
}

:deep(.article-body ul),
:deep(.article-body ol) {
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
}

:deep(.article-body li) {
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

:deep(.article-body a) {
  color: var(--accent-primary);
  text-decoration: none;
  transition: var(--transition);
  text-underline-offset: 2px;

  &:hover {
    color: var(--accent-secondary);
    text-decoration: underline;
  }
}

:deep(.article-body code) {
  background: var(--bg-secondary);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
  color: var(--accent-primary);
  transition: all 0.3s ease;
}

:deep(.article-body pre) {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  padding: 1.5rem;
  border-radius: var(--border-radius-sm);
  overflow-x: auto;
  margin: 1.5rem 0;
  border: 1px solid var(--border-primary);
  transition: all 0.3s ease;
}

:deep(.article-body pre code) {
  background: none;
  padding: 0;
  color: inherit;
}

/* Tags */
.article-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 40px;
  padding: 20px 0;
  border-top: 1px solid var(--border-primary);
  border-bottom: 1px solid var(--border-primary);
  transition: border-color 0.3s ease;
}

.tags-label {
  font-weight: 500;
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  background: var(--bg-secondary);
  color: var(--text-primary);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  border: 1px solid var(--border-primary);
  text-decoration: none;
  transition: var(--transition);
  font-weight: 500;

  &:focus {
    outline: 2px solid var(--accent-primary);
    outline-offset: 2px;
  }

  &:hover {
    background: var(--accent-primary);
    color: var(--bg-primary);
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
  }
}

/* Author Bio */
.author-bio {
  display: flex;
  gap: 20px;
  padding: 30px;
  background: var(--bg-secondary);
  border-radius: var(--border-radius);
  margin-bottom: 40px;
  border-left: 4px solid var(--accent-primary);
  transition: all 0.3s ease;
}

.author-avatar {
  flex-shrink: 0;
}

.avatar-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--accent-primary);
  color: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.2rem;
}

.author-info {
  flex: 1;
}

.author-name {
  font-size: 1.3rem;
  margin: 0 0 0.5rem;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.author-role {
  color: var(--accent-primary);
  font-weight: 500;
  margin: 0 0 1rem;
  font-size: 0.95rem;
}

.author-bio-text {
  line-height: 1.6;
  color: var(--text-primary);
  margin: 0 0 1rem;
  transition: color 0.3s ease;
}

.author-social {
  display: flex;
  gap: 12px;
}

.social-link {
  color: var(--text-secondary);
  transition: var(--transition);
  padding: 8px;
  border-radius: 6px;
  background: var(--bg-primary);
  box-shadow: var(--shadow-sm);

  &:hover {
    color: var(--accent-primary);
    transform: translateY(-2px);
    box-shadow: var(--shadow);
  }

  .iconify {
    width: 18px;
    height: 18px;
  }
}

/* Sections */
.section-title {
  font-size: 1.6rem;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 10px;
  transition: color 0.3s ease;
}

.section-title i {
  color: var(--accent-primary);
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
  background: var(--bg-primary);
  border-radius: var(--border-radius-sm);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
  border: 1px solid var(--border-primary);

  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow);
  }
}

.attachment-link {
  display: flex;
  align-items: center;
  padding: 1rem;
  text-decoration: none;
  color: inherit;
  transition: var(--transition);

  &:focus {
    outline: 2px solid var(--accent-primary);
    outline-offset: 2px;
  }
}

.attachment-icon {
  width: 40px;
  height: 40px;
  background: var(--bg-secondary);
  border-radius: var(--border-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  color: var(--accent-primary);
  font-size: 1.2rem;
  flex-shrink: 0;
}

.attachment-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.attachment-name {
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.2rem;
  word-break: break-word;
  transition: color 0.3s ease;
}

.attachment-description {
  font-size: 0.8rem;
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

/* Related Posts */
.related-posts {
  margin-bottom: 40px;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.related-card {
  background: var(--bg-primary);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
  border: 1px solid var(--border-primary);

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }
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
  color: var(--text-primary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s ease;
}

.related-excerpt {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0 0 1rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s ease;
}

.related-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: var(--text-tertiary);
  transition: color 0.3s ease;
}

/* Newsletter */
.newsletter-section {
  margin: 40px 0;
}

.newsletter-card {
  background: linear-gradient(
    135deg,
    var(--accent-primary),
    var(--accent-secondary)
  );
  border-radius: var(--border-radius);
  overflow: hidden;
  color: var(--bg-primary);
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
  line-height: 1.6;
}

.newsletter-form {
  display: flex;
  max-width: 500px;
  margin: 0 auto;
  gap: 10px;
}

.newsletter-input {
  flex: 1;
  padding: 0.8rem 1rem;
  border: none;
  border-radius: var(--border-radius-sm);
  font-size: 1rem;
  min-width: 0;
  background: rgba(255, 255, 255, 0.9);

  &:focus {
    outline: 2px solid rgba(255, 255, 255, 0.5);
    outline-offset: 2px;
    background: white;
  }
}

.newsletter-btn {
  padding: 0 1.5rem;
  background: #222;
  color: white;
  border: none;
  border-radius: var(--border-radius-sm);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background: #000;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.loading-spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* SIDEBAR */
.sidebar {
  width: var(--sidebar-width);
  max-width: 350px;
  position: sticky;
  top: 20px;
  height: fit-content;
  max-height: calc(100vh - 40px);
  margin-bottom: 20px;
  align-self: flex-start;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--text-tertiary) transparent;
  scroll-behavior: smooth;
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
  background: var(--text-tertiary);
  border-radius: 10px;
  border: 2px solid transparent;
  background-clip: content-box;
  transition: var(--transition);

  &:hover {
    background: var(--accent-primary);
    border: 1px solid transparent;
    background-clip: content-box;
  }

  &:active {
    background: var(--accent-secondary);
  }
}

/* Table of Contents */
.toc-sidebar {
  background: var(--bg-primary);
  border-radius: var(--border-radius);
  padding: 24px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-primary);
  margin-bottom: 24px;
  transition: all 0.3s ease;
}

.toc-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-nav li {
  margin-bottom: 8px;
  position: relative;
}

.toc-nav a {
  display: block;
  padding: 8px 12px;
  color: var(--text-primary);
  text-decoration: none;
  border-radius: var(--border-radius-sm);
  transition: var(--transition);
  font-size: 0.9rem;
  line-height: 1.4;
  border-left: 3px solid transparent;

  &:hover {
    background: var(--bg-secondary);
    color: var(--accent-primary);
    border-left-color: var(--accent-primary);
  }

  &.active {
    background: var(--bg-secondary);
    color: var(--accent-primary);
    border-left-color: var(--accent-primary);
    font-weight: 500;
  }
}

.toc-level-3 {
  margin-left: 16px;
  font-size: 0.85rem;
}

.toc-level-4 {
  margin-left: 32px;
  font-size: 0.8rem;
}

/* Most Viewed Sidebar */
.most-viewed-sidebar {
  background: var(--bg-primary);
  border-radius: var(--border-radius);
  padding: 24px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-primary);
  transition: all 0.3s ease;
}

.sidebar-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--border-primary);
  transition: all 0.3s ease;
}

.sidebar-title i {
  color: var(--accent-primary);
  font-size: 1.1rem;
}

.sidebar-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar-item {
  transition: var(--transition);
  border-radius: var(--border-radius-sm);
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
}

.sidebar-link {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  text-decoration: none;
  color: inherit;
  background: var(--bg-secondary);
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--border-primary);
  transition: var(--transition);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    background: linear-gradient(
      135deg,
      var(--accent-primary),
      var(--accent-secondary)
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }
}

.sidebar-item:hover .sidebar-link {
  background: var(--bg-primary);
  border-color: var(--border-secondary);
  box-shadow: var(--shadow);
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
  border-radius: var(--border-radius-sm);
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
  min-width: 0;
}

.title {
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--text-primary);
  margin: 0 0 8px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 2.8em;
  transition: color 0.3s ease;
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
  color: var(--text-secondary);
  white-space: nowrap;
  transition: color 0.3s ease;
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
  background: rgba(33, 150, 243, 0.1);
  color: #2196f3;

  [data-theme="dark"] & {
    background: rgba(33, 150, 243, 0.2);
    color: #64b5f6;
  }
}

.threat-low {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;

  [data-theme="dark"] & {
    background: rgba(76, 175, 80, 0.2);
    color: #81c784;
  }
}

.threat-medium {
  background: rgba(255, 152, 0, 0.1);
  color: #ff9800;

  [data-theme="dark"] & {
    background: rgba(255, 152, 0, 0.2);
    color: #ffb74d;
  }
}

.threat-high {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;

  [data-theme="dark"] & {
    background: rgba(244, 67, 54, 0.2);
    color: #e57373;
  }
}

.threat-critical {
  background: rgba(156, 39, 176, 0.1);
  color: #9c27b0;
  font-weight: 600;

  [data-theme="dark"] & {
    background: rgba(156, 39, 176, 0.2);
    color: #ba68c8;
  }
}

.threat-badge.threat-info {
  background: #17a2b8;
  color: white;
}
.threat-badge.threat-low {
  background: #28a745;
  color: white;
}
.threat-badge.threat-medium {
  background: #ffc107;
  color: black;
}
.threat-badge.threat-high {
  background: #fd7e14;
  color: white;
}
.threat-badge.threat-critical {
  background: #dc3545;
  color: white;
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

/* RESPONSIVE DESIGN */
@media (max-width: 1200px) {
  .article-page {
    --sidebar-width: 320px;
    gap: 30px;
  }
}

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
    height: auto;
    max-height: none;
  }

  .toc-sidebar,
  .most-viewed-sidebar {
    display: inline-block;
    vertical-align: top;
    width: calc(50% - 12px);
    margin-right: 24px;
  }

  .toc-sidebar:last-child,
  .most-viewed-sidebar:last-child {
    margin-right: 0;
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

  .author-bio {
    flex-direction: column;
    text-align: center;
    padding: 20px;
  }

  .author-avatar {
    align-self: center;
  }

  .toc-sidebar,
  .most-viewed-sidebar {
    width: 100%;
    margin-right: 0;
    margin-bottom: 20px;
  }

  .attachments-grid,
  .related-grid {
    grid-template-columns: 1fr;
  }

  .newsletter-card {
    padding: 1.5rem;
  }

  .newsletter-form {
    flex-direction: column;
  }

  .newsletter-input {
    border-radius: var(--border-radius-sm);
    margin-bottom: 10px;
  }

  .newsletter-btn {
    border-radius: var(--border-radius-sm);
    padding: 0.8rem;
  }
}

@media (max-width: 640px) {
  .sidebar-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .meta-left {
    gap: 8px;
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

  .threat-level {
    font-size: 0.65rem;
    padding: 3px 6px;
  }
}

/* Print Styles */
@media print {
  .sidebar,
  .share-section,
  .newsletter-section,
  .reading-progress {
    display: none !important;
  }

  .article-page {
    display: block;
    padding: 0;
  }

  .content {
    max-width: 100%;
  }

  .article-title {
    font-size: 24pt;
    color: black;
  }

  .article-body {
    font-size: 12pt;
    line-height: 1.6;
    color: black;
  }

  a {
    color: black;
    text-decoration: underline;
  }

  .tag {
    background: white;
    color: black;
    border: 1px solid black;
  }
}
</style>
