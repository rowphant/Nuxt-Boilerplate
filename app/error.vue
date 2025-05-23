<template>
  <div>
    <!-- <h2>{{ error.statusCode }}</h2>
    <button @click="handleError">Clear errors</button> -->
    <Error :error="error" />
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'
import Error from '~/components/layout/Error.vue';

const props = defineProps({
  error: Object as () => NuxtError,
})

// const handleError = () => clearError({ redirect: '/' })
</script>