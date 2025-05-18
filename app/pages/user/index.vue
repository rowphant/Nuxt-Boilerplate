<template>
  <div class="max-w-4xl mx-auto space-y-8 rounded-lg">
    <h1 class="text-4xl">Profile</h1>
    <UserProfile />
  </div>
</template>

<script setup lang="ts">
import UserProfile from "~/components/User.Profile.vue";

definePageMeta({
  requiresAuth: true,
});
</script>
