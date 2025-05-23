<template>
  <div v-if="error">
    <Error :error="{ statusCode: 404, statusMessage: 'Page not found' }" />
  </div>

  <div v-else class="space-y-8">
    <h2 class="text-4xl">{{ post?.title.rendered }}</h2>
    <div v-html="post?.content?.rendered"></div>
  </div>
</template>

<script setup lang="ts">
import Error from "~/components/layout/Error.vue";
const nuxtApp = useNuxtApp();
const { fetchWpPost } = useWordpress();
const { siteName } = useGlobals();
const { data: post, error } = await useAsyncData("post", async () => {
  const result = await fetchWpPost();

  if (!result) {
    const error = createError({
      statusCode: 404,
      statusMessage: "Beitrag nicht gefunden",
    });
    error.fatal = false; // wichtig – sonst stoppt Nuxt alles
    throw error;
  }

  return result ?? null;
});

useSeo({ title: post.value?.title.rendered });

definePageMeta({
  middleware: "wordpress",
});
</script>
