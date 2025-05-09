<template>
  <div class="py-20">
    <div class="max-w-md_ mx-auto space-y-8 bg-navbar_ rounded-lg p-8_">
      <h1 class="text-4xl">Profile</h1>
      <UserProfile />
    </div>
  </div>
</template>

<script setup lang="ts">
import UserProfile from "~/components/User.Profile.vue";

definePageMeta({
  layout: 'auth'
})
</script>
