<template>
  <div class="py-20">
    <div class="mx-auto space-y-8 rounded-lg">
      <h1 class="text-4xl">Account</h1>
      <UserAccount />
    </div>
  </div>
</template>

<script setup lang="ts">
import UserAccount from "~/components/User.Account.vue";

definePageMeta({
  layout: 'auth'
})
</script>
