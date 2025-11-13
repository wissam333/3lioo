<template>
  <footer class="footer-section py-12 text-white">
    <div class="container">
      <div class="row">
        <!-- Left Column -->
        <div class="col-md-3 text-center text-md-center mb-4 mb-md-0">
          <NuxtImg
            src="/Icons1/Asset 36.png"
            alt="Glamour Touch Logo"
            class="footer-logo mb-3"
            @click="router.push('/')"
          />

          <div class="footer-icons mt-3">
            <div
              class="d-flex justify-content-start align-items-start flex-column"
            >
              <!-- social -->
              <div v-if="Socials && Socials.items && Socials.items.length > 0" class="social-icons" :class="locale === 'ar' ? 'ar' : ''">
                <a
                  :href="Socials.items[0].pageUrl"
                  v-if="Socials.items[0] && Socials.items[0].isActive"
                  target="_blank"
                  class="Social-item mx-2"
                  style=""
                >
                <Icon name="bi:instagram" size="25px" color="#ffffff" />

                </a>

                <a
                  :href="Socials.items[1].pageUrl"
                  v-if="Socials.items[1] && Socials.items[1].isActive"
                  target="_blank"
                  class="Social-item mx-2"
                  style=""
                >
                <Icon name="ri:facebook-fill" size="25px" color="#ffffff" />

                </a>

                <a
                  :href="Socials.items[2].pageUrl"
                  v-if="Socials.items[2] && Socials.items[2].isActive"
                  target="_blank"
                  class="Social-item mx-2"
                  style=""
                >
                <Icon name="ri:twitter-x-fill" size="25px" color="#ffffff" />

                </a>

                <a
                  :href="Socials.items[3].pageUrl"
                  v-if="Socials.items[3] && Socials.items[3].isActive"
                  target="_blank"
                  class="Social-item mx-2"
                  style=""
                >
                <Icon name="qlementine-icons:youtube-16" size="25px" color="#ffffff" />

                </a>
              </div>
            </div>
          </div>
        </div>
        <div
          class="col-md-3 d-flex justify-content-md-center align-items-center mb-md-0"
        >
          <ul class="list-unstyled footer-links text-start">
            <li>
              <NuxtLink to="/">{{ $t("Home") }}</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/About_us">
                {{ $i18n.locale === "ar" ? "من نحن" : "About Us" }}</NuxtLink
              >
            </li>
            <li>
              <NuxtLink to="/Products">{{ $t("Our Products") }}</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/Gallery">
                {{ $i18n.locale === "ar" ? "المعارض" : "Gallery" }}</NuxtLink
              >
            </li>
            <!-- <li>
              <NuxtLink to="/Website_Designing_Development">
                {{
                  $i18n.locale === "ar"
                    ? "تصميم وتطوير المواقع	"
                    : "Website Designing Development"
                }}</NuxtLink
              >
            </li> -->
          </ul>
        </div>
        <!-- Middle Column -->
        <div
          class="col-md-3 d-flex justify-content-md-center align-items-center mb-md-0"
        >
          <ul class="list-unstyled footer-links text-start">
            <li>
              <NuxtLink to="/Events">{{
                $i18n.locale === "ar" ? "الفعاليات" : "Events"
              }}</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/Marketing_Management">
                {{
                  $i18n.locale === "ar"
                    ? "إدارة التسويق"
                    : "Marketing Management"
                }}</NuxtLink
              >
            </li>

            <li>
              <NuxtLink to="/PR_Advertising">
                {{
                  $i18n.locale === "ar" ? "اعلانات PR	" : "PR Advertising"
                }}</NuxtLink
              >
            </li>
            <li>
              <NuxtLink to="/Printing_Solution">{{
                $i18n.locale === "ar" ? "حلول الطباعة" : "Printing Solution"
              }}</NuxtLink>
            </li>
            <!-- <li>
              <NuxtLink to="/Website_Designing_Development">
                {{
                  $i18n.locale === "ar"
                    ? "تصميم وتطوير المواقع	"
                    : "Website Designing Development"
                }}</NuxtLink
              >
            </li> -->
          </ul>
        </div>

        <!-- Right Column -->
        <div class="col-md-3 contact-column">
          <h5 class="section-title">{{ $t("get-in-touch") }}</h5>

          <div class="contact-info">
            <a
              href="tel:+971568430848"
              class="contact-item"
              :dir="$i18n.locale == 'ar' ? 'rtl' : 'ltr'"
            >
              <Icon name="material-symbols:call" size="23px" class="contact-icon mb-4" />

              <span
                v-html="
                  $i18n.locale === 'ar'
                    ? ContactsDetails?.description1
                    : ContactsDetails?.englishDescription1
                "
              ></span>
            </a>
            <a
              :href="`mailto:${'Arabia@glamourtouchevent.com'}`"
              class="contact-item"
              :dir="$i18n.locale == 'ar' ? 'rtl' : 'ltr'"
            >
              <!-- <NuxtImg
                src="/mdi-light--email-white.svg"
                alt="email"
                class="contact-icon mb-4"
              /> -->
              <Icon name="ic:baseline-mail" class="contact-icon mb-4" />

              <span
                v-html="
                  $i18n.locale === 'ar'
                    ? ContactsDetails?.description2
                    : ContactsDetails?.englishDescription2
                "
              ></span>
            </a>

            <a
              href="https://maps.google.com?q=Glamour+Touch+Event+Dubai+UAE"
              target="_blank"
              rel="noopener noreferrer"
              class="contact-item"
              :dir="$i18n.locale == 'ar' ? 'rtl' : 'ltr'"
            >
              <Icon name="material-symbols:location-on-rounded" size="23px" class="contact-icon mb-4" />

              <span
                v-html="
                  $i18n.locale === 'ar'
                    ? ContactsDetails?.description3
                    : ContactsDetails?.englishDescription3
                "
              ></span>
            </a>
          </div>

          <!-- <div class="subscribe-form">
            <input
              v-model="email"
              type="email"
              class="form-control email-input"
              :placeholder="$i18n.locale === 'ar' ? 'الإيميل' : 'Email Address'"
            />
            <button
              :disabled="disabled"
              @click="subscribe"
              class="btn btn-subscribe"
            >
              {{ $t("subscribe") }}
            </button>
          </div> -->
        </div>
      </div>
    </div>
  </footer>
  <SharedFooterCopyRight />
</template>

<script setup>
const {
  public: { apiBase, api },
} = useRuntimeConfig();
const email = ref();
const { $awn } = useNuxtApp();
const { locale } = useI18n();
const Socials = ref(null);
watchEffect(() => {
    if(process.client) {
        if(useMenusSocial().value) {
          Socials.value = useMenusSocial().value
        }
    }
})
const router = useRouter();
// get ContactData

const { data: ContactsDetails, pending } = await useFetch(
    `${api.GetPagesDetail}/2`,
    {
    baseURL: apiBase,
    }
);
const disabled = ref(false);

// const subscribe = async () => {
//   if (email.value) {
//     disabled.value = true;
//     const response = await useFetch(`${api.Newsletters}`, {
//       method: "POST",
//       body: { email: email.value },
//       baseURL: apiBase,
//       headers: useSiteHeaders().headers,
//     })
//       .catch((error) => {
//         console.error("Error:", error);
//         $awn.warning("An error occurred. Please try again.");
//         disabled.value = false;
//       })
//       .then((res) => {
//         if (res && res.data) {
//           if (!res?.data?.value?.succeeded) {
//             $awn.warning(
//               locale.value === "ar"
//                 ? "هذا البريد الإلكتروني موجود بالفعل"
//                 : "This email already exists."
//             );
//             disabled.value = false;
//             return;
//           } else {
//             $awn.success(
//               locale.value === "ar"
//                 ? "تم ارسال طلب الاشتراك بنجاح"
//                 : "Subscription has been sent successfully."
//             );
//           }
//           email.value = "";
//         }
//       })
//       .finally(() => {
//         disabled.value = false;
//       });
//   }
// };
</script>

<style lang="scss" scoped>
@use "@/assets/scss/theme/variables.scss" as *;

.footer-section {
  background: url("/images1/Artboard 20-100.jpg");
  background-blend-mode: multiply;
  background-size: cover;
  background-position: center;
  position: relative;

  .footer-logo {
    width: 100%;
    height: 200px;
    object-fit: contain;

    cursor: pointer;
    @media (max-width: 991px) {
      height: 200px;
      object-fit: contain;
    }
  }
  .contact-column {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    margin-top: 20px;
    gap: 1.5rem;
  }

  .section-title {
    font-weight: 700;
    color: #fff;
    margin-bottom: 0.5rem;
    font-size: 1.25rem;
  }

  .contact-info {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    direction: ltr;
  }

  .contact-item {
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 0.95rem;
    text-decoration: none;
    transition: all 0.2s ease;
    padding: 0.25rem 0;
    
    p {
      margin-bottom: 0 !important;
      padding: 0 !important;
    }
  }
  p {
    margin-bottom: 0 !important;
    padding: 0 !important;
  }
  .contact-item:hover {
    color: #ff69b4; /* Gold color on hover */
    transform: translateX(5px);
  }

  .contact-icon {
    width: 20px;
    height: 20px;
    margin-right: 12px;

    color: white;
  }

  .subscribe-form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
  }

  .email-input {
    padding: 0.75rem;
    border-radius: 4px;
    border: 1px solid #ccc;
    background: rgba(255, 255, 255, 0.9);
  }

  .subscribe-btn {
    background-color: #d4af37; /* Gold color */
    color: #000;
    padding: 0.75rem;
    border: none;
    border-radius: 4px;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .subscribe-btn:hover {
    background-color: #c19b2c;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    .contact-column {
      align-items: flex-start;
      text-align: start;
    }

    .contact-item {
      justify-content: flex-start;
    }
  }
  .footer-subtitle {
    font-family: serif;
    font-size: 0.9rem;
    letter-spacing: 1px;
  }

  .footer-icons {
    a {
      color: #fff;
      font-size: 1.25rem;
      transition: color 0.3s;
      &:hover {
        color: #ff69b4;
      }
    }
  }
  .social-icons {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0px 20px 10px 22px;
    gap: 0 30px;

    .Social-item {
      svg,
      img {
        width: 30px;
        height: 30px;
        object-fit: contain;
        font-size: 30px;
        color: #fff;
        transition: all 0.5s ease-in;
      }
    }
  }
  .footer-links {
    li {
      margin-bottom: 1rem;
      a {
        color: #fff;
        text-decoration: none;
        transition: all 0.5s ease-in;
        display: inline-block;
        &:hover {
          transition: all 0.5s ease-in;

          text-decoration: none;
          color: #ff689e;
          transform: translateX(10px);
        }
      }
    }
  }

  .btn-subscribe {
    background-color: #ff689e;
    color: white;
    &:hover {
      background-color: #ff89b5;
    }
  }

  input[type="email"] {
    border: none;
    border-radius: 0;
    padding: 0.6rem 1rem;
  }
}
</style>
