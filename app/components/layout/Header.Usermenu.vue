<template>
  <div>
    <UDropdownMenu
      v-if="authStore.isLoggedIn"
      :items="itemsLoggedIn"
      :ui="{
        content: 'w-48',
      }"
    >
      <UButton icon="mingcute:user-3-fill" color="neutral" variant="outline" />
    </UDropdownMenu>

    <UDropdownMenu
      v-if="!authStore || !authStore.isLoggedIn"
      :items="itemsLoggedOut"
      :ui="{
        content: 'w-48',
      }"
    >
      <UButton icon="mingcute:user-3-line" color="neutral" variant="outline" />
    </UDropdownMenu>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "/stores/auth";
import type { DropdownMenuItem } from "@nuxt/ui";
const authStore = useAuthStore();

const itemsLoggedOut = ref<DropdownMenuItem[][]>([
  [
    {
      label: "Login",
      icon: "mingcute:entrance-line",
      to: "/login",
    },
    {
      label: "Register",
      icon: "mingcute:user-add-2-fill",
      to: "/register",
    },
  ],
]);

const itemsLoggedIn = ref<DropdownMenuItem[][]>([
  [
    {
      label: "Profile",
      icon: "mingcute:user-3-fill",
      to: "/user",
    },
    {
      label: "Account",
      icon: "mingcute:user-setting-fill",
      to: "/user/account",
    },
    {
      label: "Logout",
      icon: "mingcute:align-arrow-right-line",
      onClick: () => authStore.logout(),
    },
  ],
]);
</script>
