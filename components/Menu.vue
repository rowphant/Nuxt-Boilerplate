<script setup lang="ts">
defineProps<{
  title: string;
  items: {
    label: string;
    to: string;
  }[];
}>();
</script>

<template>
  <nav class="flex flex-col gap-3">
    <h2 class="font-light uppercase">{{ title }}</h2>
    <ul class="flex flex-col gap-1">
      <li v-for="item in items" :key="item.to">
        <NuxtLink :to="item.to" class="opacity-75 link link-hover text-sm font-light">{{ item.label }}</NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped></style>

