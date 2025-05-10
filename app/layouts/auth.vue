<template>
  <!-- <ClientOnly> -->
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <Header />
    <!-- Content -->
    <div
      v-if="authStore.loading !== false"
      class="grow flex justify-center items-center"
    >
      <div>
        <LoadingIndicator />
      </div>
    </div>

    <div v-else>
      <div v-if="authStore.isLoggedIn" class="grow">
        <div class="container mx-auto grow place-content-center">
          <slot />
        </div>
      </div>
      <div v-else>
        <div
          class="grow container mx-auto min-h-screen flex flex-col gap-8 justify-center items-center"
        >
          <div class="text-3xl">You are not logged in</div>
          <UButton to="/login">Log in here</UButton>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
  <!-- </ClientOnly> -->
</template>

<script setup lang="ts">
import Header from "~/components/layout/Header.vue";
import Footer from "~/components/layout/Footer.vue";
import { useAuthStore } from "@/stores/auth";
import LoadingIndicator from "~/components/LoadingIndicator.vue";
import { ClientOnly } from "#components";

const authStore = useAuthStore();

console.log("authStore.isLoggedIn: ", useAuthStore().isLoggedIn);
// console.log(authStore.user);
</script>
