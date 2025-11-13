<template>
  
  <div class="bg-white w-100 global d-flex justify-center align-items-center flex-column " style=""  >
    <NuxtImg 
      src="/logo/full_logo.png"
      format="webp" 
      width="300"
      preload
    />
      <Icon class="mt-5" name="eos-icons:bubble-loading" size="150px" style="color: #ca3e70;"/>
  </div>
  </template>
  
  <script setup>

  </script>
  
<style lang="scss">
.global {
  height: 100vh;
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
}
</style>
