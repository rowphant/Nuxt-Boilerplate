<template>
  <div>
    <UDropdownMenu
      v-if="authStore.user"
      :items="itemsLoggedIn"
      :ui="{
        content: 'w-48',
      }"
    >
      <UButton
        color="neutral"
        variant="outline"
        :loading="authStore.loading"
        class="rounded-full cursor-pointer w-10 h-10 place-items-center place-content-center"
      >
        <div v-if="authStore.user.profile_image">
          <UAvatar
            class_="cursor-pointer"
            :src="authStore.user.profile_image.sizes.thumbnail"
          />
        </div>
      </UButton>
    </UDropdownMenu>

    <UDropdownMenu
      v-if="!authStore?.user"
      :items="itemsLoggedOut"
      :ui="{
        content: 'w-48',
      }"
    >
      <UButton
        icon="mingcute:user-3-line"
        color="neutral"
        variant="outline"
        class="w-10 h-10 rounded-full cursor-pointer place-items-center place-content-center"
      />
    </UDropdownMenu>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
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
