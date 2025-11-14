<script setup>
const posts = await queryCollection('posts').path('/content/posts').first()


console.log(posts)
</script>
