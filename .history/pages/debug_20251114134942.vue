<template>
  <div>
    <h1>Debug Content</h1>
    <pre>{{ posts }}</pre>
  </div>
</template>

<script setup>
import { queryContent } from "#content";

const posts = await queryContent("/posts").find();
console.log(posts);
</script>
