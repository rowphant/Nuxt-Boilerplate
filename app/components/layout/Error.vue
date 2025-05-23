<template>
  <div class="place-items-center">
    <div class="font-light text-xl">Oopsie!</div>
    <div class="text-8xl text-accent font-bold my-4">
      Error {{ props.error?.statusCode }}
    </div>
    <div class="text-3xl font-light text-center">
      {{ props.error?.statusMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps({
  error: Object as () => NuxtError,
});
</script>
