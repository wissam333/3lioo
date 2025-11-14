<template>
  <div v-if="post" class="article-page">
    <!-- ===== Sidebar (Most Viewed) ===== -->
    <aside class="sidebar">
      <h2 class="sidebar-title">
        {{ $i18n.locale === "ar" ? "الأكثر مشاهدة" : "Most Viewed" }}
      </h2>

      <div class="sidebar-list">
        <div
          v-for="(item, index) in mostWatched"
          :key="item.slug"
          class="sidebar-item"
        >
          <!-- Your card component -->
          <!-- <CardNews5 :index="index" :cardData="item" /> -->
          <nuxt-link :to="`/blog/${item.title}`" class="sidebar-link">
            <span class="count">{{ index + 1 }}.</span>
            <span class="title">{{ item.title }}</span>
          </nuxt-link>
        </div>
      </div>
    </aside>

    <!-- ===== Main Content ===== -->
    <main class="content">
      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <nuxt-link to="/">{{ $t("Home") }}</nuxt-link>
        <span>/</span>
        <nuxt-link :to="`/category/${post.category}`">
          {{ post.category }}
        </nuxt-link>
      </div>

      <!-- Title -->
      <h1 class="article-title">{{ post.title }}</h1>
      <p class="article-date">
        <i class="far fa-calendar-alt"></i>
        {{ formatDate(post.date) }}
      </p>

      <!-- Social Share -->
      <div class="share-section">
        <span>{{ $i18n.locale === "ar" ? "مشاركة" : "Share" }}:</span>
        <button @click="shareOnFacebook">Facebook</button>
        <button @click="shareOnTwitter">Twitter</button>
        <button @click="shareOnLinkedIn">LinkedIn</button>
        <button @click="shareOnWhatsApp">WhatsApp</button>
      </div>

      <!-- Gallery -->
      <div v-if="galleryImages.length > 0" class="gallery">
        <Swiper
          :slides-per-view="1"
          :space-between="20"
          :pagination="{ clickable: true }"
          :navigation="true"
        >
          <SwiperSlide v-for="(img, idx) in galleryImages" :key="idx">
            <img :src="img.src" :alt="img.alt" class="gallery-image" />
          </SwiperSlide>
        </Swiper>
      </div>

      <!-- Body Content -->
      <article class="article-body">
        <div v-html="post.content"></div>

        <img v-if="post.image2" :src="post.image2" class="article-image" />

        <img v-if="post.image3" :src="post.image3" class="article-image" />
      </article>

      <!-- Attachments -->
      <section v-if="post.attachments?.length" class="attachments">
        <h2>{{ $t("Attachments") }}</h2>
        <div v-for="att in post.attachments" :key="att.name">
          <a :href="att.file" target="_blank">{{ att.name }}</a>
        </div>
      </section>

      <!-- Videos -->
      <section v-if="post.videos?.length" class="videos">
        <h2>{{ $t("Videos") }}</h2>
        <div v-for="vid in post.videos" :key="vid.url">
          <iframe
            :src="`https://www.youtube.com/embed/${vid.url}`"
            allowfullscreen
          ></iframe>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

// Route params
const route = useRoute();
const slug = route.params.slug;

// States
const post = ref(null);
const mostWatched = ref([]);
const galleryImages = ref([]);

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

// Increase visit count
const increaseVisit = async () => {
  try {
    await $fetch(`/api/posts/${slug}/visit`, { method: "POST" });
  } catch (err) {
    console.error("Failed to update visit count", err);
  }
};

// On load
onMounted(async () => {
  await fetchPost();
  await fetchMostWatched();
  await increaseVisit();
});

// Share buttons
const shareOnFacebook = () => {
  const url = encodeURIComponent(window.location.href);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
};

const shareOnTwitter = () => {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(post.value?.title || "");
  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`);
};

const shareOnLinkedIn = () => {
  const url = encodeURIComponent(window.location.href);
  window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}`);
};

const shareOnWhatsApp = () => {
  const text = encodeURIComponent(
    `${post.value?.title} - ${window.location.href}`
  );
  window.open(`https://wa.me/?text=${text}`);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>

<style scoped>
.article-page {
  display: flex;
  gap: 40px;
  padding: 40px 20px;
  max-width: 1200px;
  margin: auto;
}

/* MAIN ARTICLE */
.article-content {
  width: 70%;
}

.article-header h1 {
  font-size: 36px;
  font-weight: 900;
  margin-bottom: 10px;
}

.article-meta {
  display: flex;
  gap: 15px;
  color: #666;
  font-size: 14px;
  margin-bottom: 25px;
}

/* FEATURED IMAGE */
.main-article-image {
  width: 100%;
  border-radius: 16px;
  margin-bottom: 25px;
  object-fit: cover;
}

/* GALLERY */
.gallery {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.gallery img {
  width: 32%;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.2s ease;
}

.gallery img:hover {
  transform: scale(1.03);
}

/* SHARE BUTTONS */
.share-buttons {
  margin-top: 30px;
}

.share-buttons h3 {
  font-size: 20px;
  margin-bottom: 15px;
}

.share-buttons .buttons {
  display: flex;
  gap: 12px;
}

.share-buttons button {
  padding: 10px 18px;
  background: #f2f2f2;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: 0.2s ease;
}

.share-buttons button:hover {
  background: #e0e0e0;
}

/* SIDEBAR */
.sidebar {
  width: 30%;
  padding-left: 20px;
}

.sidebar h3 {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 20px;
}

.sidebar .post-card {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  cursor: pointer;
  transition: 0.2s ease;
}

.sidebar .post-card:hover {
  transform: translateX(4px);
}

.sidebar .post-card img {
  width: 90px;
  height: 70px;
  object-fit: cover;
  border-radius: 8px;
}

.sidebar .post-info {
  display: flex;
  flex-direction: column;
}

.sidebar .post-info h4 {
  margin: 0;
  font-size: 15px;
}

.sidebar .post-info span {
  font-size: 12px;
  color: #777;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .article-page {
    flex-direction: column;
  }

  .article-content,
  .sidebar {
    width: 100%;
  }

  .gallery img {
    width: 100%;
  }

  .gallery {
    flex-direction: column;
  }
}
</style>
