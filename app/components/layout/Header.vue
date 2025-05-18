<template>
  <header class="sticky z-99 top-0 w-full bg-navbar">
    <div class="container mx-auto">
      <nav class="flex items-center">
        <div class="py-2">
            <NuxtLink to="/">
              <div class="rounded-md border border-(--ui-border-muted) px-4 py-2">Nuxt Boilerplate</div>
            </NuxtLink>
        </div>
        <div class="grow flex justify-end items-center space-x-8">
          <UNavigationMenu :items="mainNav" />
          <div class="flex space-x-2">
            <HeaderUsermenu />
            <ColorModeButton />
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
// import ThemeSwitch from "@/components/ThemeSwitch/ThemeSwitch.vue";
import type { NavigationMenuItem } from '@nuxt/ui'
import HeaderUsermenu from "~/components/layout/Header.Usermenu.vue";
import ColorModeButton from "~/components/ColorModeButton.vue";

const props = defineProps({
  mainNav: {
    type: Object,
    required: false,
  },
});
</script>

<style scoped>
.logo {
  width: 2rem;
  height: 2rem;
}
</style>
