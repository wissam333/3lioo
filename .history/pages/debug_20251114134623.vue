<template>
  <pre>{{ posts }}</pre>
</template>

<script setup>
const posts = await queryContent().find()
console.log(posts)

</script>
