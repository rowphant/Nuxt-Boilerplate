<template>
  <div>
    <UDropdownMenu
      v-if="user?.id"
      :items="itemsLoggedIn"
      :ui="{
        content: 'w-48',
      }"
    >
      <UButton
        color="neutral"
        variant="outline"
        :loading_="loading !== false"
        :icon_="!user.profile_image ? 'mingcute:user-3-fill' : null"
        class="rounded-full cursor-pointer w-10 h-10 place-items-center place-content-center"
      >
        <div v-if="user.profile_image || user.avatar_urls">
          <UAvatar
            class_="cursor-pointer"
            :src="
              user.profile_image.sizes?.thumbnail ||
              user.avatar_urls?.['96']
            "
          />
        </div>
      </UButton>
    </UDropdownMenu>
    <UDropdownMenu
      v-if="!user?.id"
      :items="itemsLoggedOut"
      :ui="{
        content: 'w-48',
      }"
    >
      <UButton
        :loading_="loading !== false"
        icon="mingcute:user-3-line"
        color="neutral"
        variant="outline"
        class="w-10 h-10 rounded-full cursor-pointer place-items-center place-content-center"
      />
    </UDropdownMenu>
  </div>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
const { logout } = useAuth();
const { user } = useUser();
const loading = ref(false);

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
      label: "Groups",
      icon: "mingcute:group-3-fill",
      to: "/user/groups",
    },
    {
      label: "Account",
      icon: "mingcute:settings-7-line",
      to: "/user/account",
    },
    {
      label: "Logout",
      icon: "mingcute:align-arrow-right-line",
      onClick: () => logout(),
    },
  ],
]);
</script>
