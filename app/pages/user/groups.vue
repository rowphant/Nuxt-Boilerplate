<template>
  <div class="py-20">
    <div class="mx-auto space-y-8">
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
