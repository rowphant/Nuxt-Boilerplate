<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <Header :mainNav="mainNav" />
    <!-- Content -->
    <div class="grow flex justify-center items-stretch px-4">
      <div class="container max-w-4xl mx-auto grow py-20 space-y-8">
          <slot />
      </div>
    </div>
    <!-- Footer -->
    <Footer :menus="[menus.main, menus.social, menus.company]" />
  </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import Header from "~/components/layout/Header.vue";
import Footer from "~/components/layout/Footer.vue";

const menus = {
  main: {
    title: "Menu",
    items: [
      { label: "Home", to: "/" },
      { label: "Login", to: "/login" },
      { label: "Contact", to: "/contact" },
    ],
  },
  social: {
    title: "Social Media",
    items: [
      { label: "Twitter", to: "/" },
      { label: "Facebook", to: "/" },
      { label: "Instagram", to: "/" },
    ],
  },
  company: {
    title: "Company",
    items: [
      { label: "About us", to: "/" },
      { label: "Terms and conditions", to: "/" },
      { label: "Privacy policy", to: "/" },
      { label: "Imprint", to: "/" },
    ],
  },
};

const mainNav = ref<NavigationMenuItem[]>([
  {
    label: "Home",
    to: "/",
  },
  {
    label: "Contact",
    to: "/contact",
  },
]);
</script>
