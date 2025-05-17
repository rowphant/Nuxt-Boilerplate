<template>
  <div class="py-12">
    <div class="max-w-4xl mx-auto space-y-10">
      <h1 class="text-4xl">Groups</h1>
      <UserGroups />
    </div>
  </div>
</template>

<script setup lang="ts">
import UserGroups from "~/components/User.Groups.vue";

definePageMeta({
  requiresAuth: true
});
</script>
