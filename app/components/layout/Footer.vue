<template>
  <footer class="grow-0 w-full bg-navbar">
    <div class="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 py-16">
      <div
        class="col-span-1"
        v-for="menu in props.menus"
        :key="menu.id || menu.title"
      >
        <Menu :title="menu.title" :items="menu.items" />
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import Menu from "@/components/Menu.vue";

const props = defineProps({
  menus: {
    type: Object,
    required: false,
  },
})
</script>
