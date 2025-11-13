<template>
  <div id="ncms"></div>
</template>

<script setup>
onMounted(async () => {
  // Wait for component to be fully mounted
  await nextTick()
  
  const CMS = await import('decap-cms')
  
  // Ensure the element exists
  const element = document.getElementById('ncms')
  if (element) {
    CMS.init()
    
    if (typeof CMS.registerPreviewStyle === 'function') {
      CMS.registerPreviewStyle('/admin-preview.css')
    }
  }
})
</script>

<style scoped>
#ncms {
  height: 100vh;
  width: 100%;
}
</style>