<template>
  <UApp>
    <Notifications />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
import Notifications from "~/components/Notifications.vue";

const { fetchWordpressData } = useWordpress();
await fetchWordpressData();

const { wordpress } = useWordpress();
if (wordpress.value) {
  useHead({
    title: wordpress.value?.name,
    meta: [
      {
        name: "description",
        content: wordpress.value?.description.replace(/(<([^>]+)>)/gi, ''),
      },
    ],
  });
}
</script>
