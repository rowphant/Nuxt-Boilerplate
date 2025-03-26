<script setup lang="ts">
import type { NuxtError } from "#app";
import Error from "@/components/layout/error.vue";

const props = defineProps({
  error: Object as () => NuxtError,
});

const handleError = () => clearError({ redirect: "/" });
</script>

<template>
  <NuxtLayout name="404">
    <Error />
    <!-- <h2>{{ error.statusCode }}</h2>
    <button @click="handleError">Clear errors</button> -->
  </NuxtLayout>
</template>
