<template>
  <header class="sticky top-0 w-full bg-base-200">
    <div class="container mx-auto">
      <nav class="navbar">
        <div class="navbar-start">
          <div class="logo placeholder">
            <div class="bg-neutral-focus rounded-full h-6 w-6">Logo</div>
          </div>
        </div>
        <div class="navbar-end">
          <ThemeSwitch />
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import ThemeSwitch from "@/components/ThemeSwitch/ThemeSwitch.vue";
</script>

<style scoped>
.logo {
  width: 2rem;
  height: 2rem;
}
</style>

