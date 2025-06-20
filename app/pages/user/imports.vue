<template>
  <div class="max-w-4xl mx-auto space-y-8 rounded-lg">
    <h1 class="text-4xl">Imports</h1>
    <Imports/>
  </div>
</template>

<script setup lang="ts">
import Imports from "~/components/admin/imports.vue";

const { user } = useUser();

definePageMeta({
  requiresAuth: true,
});
</script>
