<template>
  <div class="py-20">
    <div class="mx-auto space-y-8 rounded-lg ">
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
