<template>
  <div class="flex flex-col justify-center items-center gap-8">
    <div v-if="useGlobalStore().loading !== false">
      <LoadingIndicator />
    </div>
    <div v-else>
      <UserLogin />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from "~/stores/settings";
import UserLogin from "~/components/User.Login.vue";
import LoadingIndicator from "~/components/LoadingIndicator.vue";
</script>
