<template>
  <div class="text-4xl" v-if="post">
    {{ post.title.rendered }}
    <div v-if="user?.roles.includes('administrator')" class="">
      <PostEditModal :post="post" />
    </div>
  </div>
  <!-- <div v-html="post.excerpt.rendered"></div>
 <div v-html="post.content.rendered"></div> -->
  <!-- {{post}} -->
</template>

<script setup lang="ts">
const { user } = useUser();
const { fetchWpPosts } = useWordpress();

const props = defineProps({
  id: Number,
  slug: String,
  postType: String,
});
console.log("props: ", props);

const {
  data: post,
  error,
  pending,
} = await useAsyncData(
  `post-${props.id || props.slug}`,
  async () => {
    if (props.id) {
      return await fetchWpPosts(`${props.postType}/${props.id}`, [
        ["acf_format", "standard"],
      ]);
    } else {
      const fetchPost = await fetchWpPosts(props.postType, [
        ["slug", String(props.slug)],
        ["acf_format", "standard"],
      ]);

      // console.log('load slug')

      if (Array.isArray(fetchPost?.items)) {
        return fetchPost?.items[0] || [];
      } else {
        return fetchPost;
      }
    }
  },
  {
    onerror: (err) => {
      console.error("Fehler beim Laden der Posts in useAsyncData:", err);
    },
  }
);
</script>
