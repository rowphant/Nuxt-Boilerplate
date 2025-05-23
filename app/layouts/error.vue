<template>
  <div class="text-center pt-20">
    <h1 class="text-4xl font-bold text-red-600">{{ error.statusCode }}</h1>
    <p class="text-lg mt-4">{{ error.statusMessage }}</p>
    <NuxtLink to="/" class="mt-6 inline-block text-blue-500 underline"
      >Zurück zur Startseite</NuxtLink
    >
  </div>
</template>

<script setup>
defineProps({ error: Object });
</script>
