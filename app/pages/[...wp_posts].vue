<template>
  <div class="space-y-8">
    <div v-if="paths.length > 1">
      <Post
        :postType="paths?.[0]"
        :id="!isNaN(Number(paths?.[1])) ? Number(paths?.[1]) : null"
        :slug="!isNaN(Number(paths?.[1])) ? null : paths?.[1]"
      />
    </div>
    <div v-else>
      <PostsList :postType="paths?.[0]" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import Post from "~/components/Post.vue";

const route = useRoute();
const paths = computed(() => {
  const pathParam = route.params.wp_posts;

  if (Array.isArray(pathParam)) {
    return pathParam.filter(Boolean);
  } else if (typeof pathParam === "string" && pathParam) {
    let segments = pathParam.split("/").filter((segment) => segment);
    segments.filter(Boolean);

    return segments;
  }
  return [];
});
</script>
