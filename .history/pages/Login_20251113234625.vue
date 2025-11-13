<template>
  <div class="login nav-margin">
    <div class="container">
      <h1 class="page-title color text-center">
        {{ $t("Log In") }}
      </h1>
      <div class="row justify-center mb-10">
        <div class="col-lg-6">
          <div class="box">
            <VForm
              class="row"
              :validation-schema="schema"
              :initial-values="initialValues"
              v-slot="{ meta: formMeta }"
              @submit="handleSubmit"
            >
              <div>
                <ElementsFormVTextInput
                  border_color="11118a"
                  color="11118a"
                  type="email"
                  name="email"
                  id="email"
                  :label="$t('Email')"
                  :placeholder="$t('Email')"
                  astricts="true"
                />
              </div>
              <div class="">
                <ElementsFormVTextInput
                  border_color="11118a"
                  color="11118a"
                  type="password"
                  name="password"
                  id="password"
                  :label="$t('password')"
                  :placeholder="$t('password')"
                  autocomplete="false"
                  :activePasswordEye="true"
                  astricts="true"
                />
              </div>

              <!-- For Error -->
              <div v-if="hasError" class="mt-5">
                <div class="alert-danger text-center">
                  <ul class="list-unstyled mb-0">
                    <li
                      class="p-2"
                      v-for="(error, index) in errorMessage"
                      :key="index"
                    >
                      {{ error }}
                    </li>
                  </ul>
                </div>
              </div>
              <!-- For Error -->

              <!-- Button -->
              <div class="mt-5">
                <button
                  type="submit"
                  :value="$t('login')"
                  class="btn login-btn w-100 text-center"
                  :class="{ gradient: formMeta.valid }"
                  :disabled="!formMeta.valid || isLoading"
                >
                  <span class="text-white w-100" v-if="!isLoading">{{
                    $t("Login")
                  }}</span>
                  <span class="text-white w-100" v-else>{{
                    $t("loading...")
                  }}</span>
                </button>
              </div>
              <!-- Button -->
            </VForm>
            <!-- {{ route.query }} -->
            <p class="my-5 new-account">
              <span>
                {{
                  $i18n.locale === "ar"
                    ? "ليس لديك حساب؟ إنشاء  حساب"
                    : "Don't have an account? Create a"
                }}
                <nuxt-link to="/Register/Student">{{
                  $i18n.locale === "ar" ? " طالب" : "Student "
                }}</nuxt-link>

                <span>{{ $i18n.locale === "ar" ? " أو " : " or " }}</span>

                <nuxt-link to="/Register/Parent">{{
                  $i18n.locale === "ar" ? "ولي أمر" : "Parent"
                }}</nuxt-link>

                <span>{{ $i18n.locale === "ar" ? "" : " Account" }}</span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { object, string, ref as yupRef } from "yup";
import { configure, validate } from "vee-validate";
const { $awn } = useNuxtApp();
const { locale } = useI18n();
const {
  public: { apiBase, api },
} = useRuntimeConfig();

// definePageMeta({
//   middleware: ["not-authorize"],
// });

const isLoading = ref(false);
const hasError = ref(false);
const errorMessage = ref("");

// Handle Form Submit ===============================================
const handleSubmit = async (values, actions) => {
  isLoading.value = true;
  hasError.value = false;
};

// configure validate ===============================================
configure({
  validateOnBlur: true, // controls if `blur` events should trigger validation with `handleChange` handler
  validateOnChange: true, // controls if `change` events should trigger validation with `handleChange` handler
  validateOnInput: false, // controls if `input` events should trigger validation with `handleChange` handler
  validateOnModelUpdate: true, // controls if `update:modelValue` events should trigger validation with `handleChange` handler
});
// schema ===============================================
const schema = object({
  email: string()
    .required(
      locale.value === "ar" ? " البريد الإلكتروني مطلوب" : "Email is required"
    )
    .email()
    .label("Email"),

  password: string()
    .required(
      locale.value === "ar" ? "كلمة المرور مطلوبة" : "Password is required"
    )
    .min(6)
    .label("Your Password"),
});

// initial values ===============================================
const initialValues = {
  email: "",
  password: "",
};
</script>

<style lang="scss" scoped>
@use "@/assets/scss/theme/variables.scss" as *;

.box {
  border-radius: 15px;
  box-shadow: 0 0 16px #11111a1a;
  height: 100%;
  overflow: hidden;
  text-align: center;
  transition: all 0.3s ease-in-out;
  padding: 2rem 1rem;
}
.login-btn {
  background: $main;
}
.new-account {
  a {
    text-decoration: underline;
    font-weight: bold;
    color: $main;
  }
}
</style>
