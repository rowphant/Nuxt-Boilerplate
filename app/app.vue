<template>
  <UApp>
    <NuxtLayout>
      <Notifications />
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
import { onMounted, onBeforeMount } from "vue";
import { useAuthStore } from "./stores/auth";
import { useGlobalStore } from "./stores/settings";
import Notifications from "~/components/Notifications.vue";


onMounted(async () => {
  const globalsStore = useGlobalStore();
  await globalsStore.getSettings();

  const authStore = useAuthStore();
  await authStore.validateUser();
});
</script>
