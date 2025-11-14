<template>
  <div>
    <h1>All Posts</h1>
    <pre>{{ posts }}</pre>
  </div>
</template>

<script setup>
const { data: posts, error } = await useAsyncData("posts", async () => {
  try {
    return await useContent("posts").sort({ date: -1 }).fetch();
  } catch (err) {
    console.error("Content fetch error:", err);
    return [];
  }
});

console.log("Posts:", posts.value);
</script>
