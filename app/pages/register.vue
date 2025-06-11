<template>
  <Register/>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { useRouter } from "vue-router";
import { useGlobalStore } from "~/stores/settings";

import Register from "~/components/User.Register.vue";
import LoadingIndicator from "~/components/LoadingIndicator.vue";

const router = useRouter();
const globalStore = useGlobalStore();

watch(
  () => globalStore.settings,
  () => {
    if (globalStore.settings.user_registration === 0) {
      router.push("/");
    }
  }
);
</script>
