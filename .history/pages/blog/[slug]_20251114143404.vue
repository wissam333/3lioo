<template>
  <div v-if="post" class="page-layout">
    <!-- Sidebar -->
    <div class="ad-sidebar">
      <div class="ad-container">
        <h2>{{ $i18n.locale === "ar" ? "الأكثر مشاهدة" : "Most Viewed" }}</h2>
        <div class="d-flex wrap">
          <div
            v-for="(news, index) in mostWatched"
            :key="news.slug"
            class="pcc mb-3"
          >
            <!-- <CardNews5 class="card-item-out" :index="index" :cardData="news" /> -->
          </div>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="main-content">
      <!-- Breadcrumb -->
      <div class="container">
        <div class="row path-links text-start pt-4">
          <h5 class="links-frame" dir="auto">
            <nuxt-link :to="localePath('/')">{{ $t("Home") }}</nuxt-link> /
            <nuxt-link :to="`/category/${post.category}`">{{
              post.category
            }}</nuxt-link>
          </h5>
        </div>
      </div>

      <!-- Title -->
      <div class="container">
        <h1 class="article-title">{{ post.title }}</h1>
        <p class="date-text">
          <i class="far fa-calendar-alt me-2"></i>{{ formatDate(post.date) }}
        </p>

        <!-- Social share -->
        <div class="social-share">
          <span>{{ $i18n.locale === "ar" ? "مشاركة" : "Share" }}:</span>
          <button @click="shareOnFacebook">Facebook</button>
          <button @click="shareOnTwitter">Twitter</button>
          <button @click="shareOnLinkedIn">LinkedIn</button>
          <button @click="shareOnWhatsApp">WhatsApp</button>
        </div>
      </div>

      <!-- Gallery -->
      <div v-if="galleryImages.length > 0" class="container mb-5">
        <Swiper
          :slides-per-view="1"
          :space-between="20"
          :pagination="{ clickable: true }"
          :navigation="true"
        >
          <SwiperSlide v-for="(img, idx) in galleryImages" :key="idx">
            <img :src="img.src" :alt="img.alt" class="w-100" />
          </SwiperSlide>
        </Swiper>
      </div>

      <!-- Content -->
      <div class="container">
        <div v-html="post.content"></div>
        <div v-if="post.image2">
          <img :src="post.image2" class="content-image" />
        </div>
        <div v-if="post.image3">
          <img :src="post.image3" class="content-image" />
        </div>
      </div>

      <!-- Attachments -->
      <div
        v-if="post.attachments?.length"
        class="container attachments-section"
      >
        <h2>{{ $t("Attachments") }}</h2>
        <div v-for="att in post.attachments" :key="att.name">
          <a :href="att.file" target="_blank">{{ att.name }}</a>
        </div>
      </div>

      <!-- Videos -->
      <div v-if="post.videos?.length" class="container video-section">
        <h2>{{ $t("Videos") }}</h2>
        <div v-for="vid in post.videos" :key="vid.url">
          <iframe
            :src="`https://www.youtube.com/embed/${vid.url}`"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const slug = route.params.slug;

const post = ref(null);
const mostWatched = ref([]);
const galleryImages = computed(() => {
  const imgs = [];
  if (post.value?.image1)
    imgs.push({ src: post.value.image1, alt: post.value.title });
  if (post.value?.images?.length)
    post.value.images.forEach((i) =>
      imgs.push({ src: i, alt: post.value.title })
    );
  return imgs;
});

// Fetch post
onMounted(async () => {
  try {
    const { data } = await useFetch(`/api/posts/${slug}`);
    post.value = data.value;

    // Record visit
    await $fetch(`/api/posts/${slug}/visit`);

    // Fetch most watched
    const { data: mw } = await useFetch("/api/posts/most-watched");
    mostWatched.value = mw.value.filter((p) => p.slug !== slug).slice(0, 5);
  } catch (err) {
    console.error(err);
  }
});

// Utilities
const formatDate = (d) => new Date(d).toLocaleDateString();
const shareOnFacebook = () =>
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`
  );
const shareOnTwitter = () =>
  window.open(`https://twitter.com/intent/tweet?url=${window.location.href}`);
const shareOnLinkedIn = () =>
  window.open(
    `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`
  );
const shareOnWhatsApp = () =>
  window.open(
    `https://wa.me/?text=${encodeURIComponent(window.location.href)}`
  );
</script>

<style scoped>
.page-layout {
  display: flex;
  gap: 2rem;
  max-width: 1400px;
  margin: auto;
}
.ad-sidebar {
  width: 30%;
  position: sticky;
  top: 100px;
}
.main-content {
  width: 70%;
}
.article-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}
.content-image {
  max-width: 100%;
  margin: 1rem 0;
}
.attachments-section a {
  display: block;
  margin-bottom: 0.5rem;
}
.video-section iframe {
  width: 100%;
  height: 400px;
  margin-bottom: 1rem;
}
@media (max-width: 992px) {
  .page-layout {
    flex-direction: column;
  }
  .ad-sidebar,
  .main-content {
    width: 100%;
  }
}
</style>
