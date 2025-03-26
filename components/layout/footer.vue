<template>
  <footer class="grow-0 w-full bg-base-200">
    <div class="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 py-16">
      <div
        class="col-span-1"
        v-for="menu in menus"
        :key="menu.id || menu.title"
      >
        <Menu :title="menu.title" :items="menu.items" />
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import Menu from "@/components/menu.vue";

const menus = [
  {
    title: "Menu",
    items: [
      { label: "Home", to: "/" },
      { label: "About", to: "/" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Social Media",
    items: [
      { label: "Twitter", to: "/" },
      { label: "Facebook", to: "/" },
      { label: "Instagram", to: "/" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About us", to: "/" },
      { label: "Terms and conditions", to: "/" },
      { label: "Privacy policy", to: "/" },
      { label: "Imprint", to: "/" },
    ],
  },
];
</script>
