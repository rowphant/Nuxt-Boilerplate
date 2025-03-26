<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <Header />
    <!-- Content -->
    <div class="grow">
      <div class="container mx-auto">
        <slot />
      </div>
    </div>
    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from "@/components/layout/header.vue";
import Footer from "@/components/layout/footer.vue";
</script>
