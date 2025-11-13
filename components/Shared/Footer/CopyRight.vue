<template>
  <div class="c">
    <p>
      &copy;
      <span class="name">
        {{
          $i18n.locale === "ar"
            ? " Glamour Touch Event."
            : "Glamour Touch Event."
        }}
      </span>
      {{ new Date().getFullYear() }}.
      {{
        $i18n.locale === "ar" ? " كل الحقوق محفوظة." : "All Rights Reserved."
      }}
    </p>
  </div>
</template>
<script setup></script>
<style lang="scss" scoped>
@use "@/assets/scss/theme/variables.scss" as *;

.c {
  color: $main;
  font-size: 15px;
  text-align: center;
  padding-bottom: 0px;
  margin: 0px 0px 0px 0px;
  padding-top: 20px;
  // background: linear-gradient(to left, $main, $second, $main);
  background: #fff;
  border-top: $main solid 1px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    width: 100vw;
    font-size: 13px;
  }

  .name {
    color: $main;
    font-weight: bold;
  }
}
</style>
