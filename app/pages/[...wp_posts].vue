<template>
  <div class="space-y-8">
    <h2 class="text-4xl">{{ post?.title?.rendered }}</h2>
    <div v-html="post?.content?.rendered"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const { fetchWpPost } = useWordpress();

const { data: post } = await useAsyncData(() => fetchWpPost());

console.log("post: ", post);

useHead({
  title: 'Mein Seitentitel',
  meta: [
    { name: 'description', content: 'Das ist eine Beschreibung dieser Seite.' },
    { property: 'og:title', content: 'Mein Seitentitel für Facebook/OG' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ]
})

definePageMeta({
  middleware: "wordpress",
  title: "test",
});
</script>
