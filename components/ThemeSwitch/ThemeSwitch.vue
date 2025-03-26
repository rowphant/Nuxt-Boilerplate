<script setup>
import { useTheme } from "@/composables/useTheme";

const { theme, setTheme } = useTheme();

const toggleTheme = () => {
  setTheme(theme.value === "light" ? "dark" : "light");
};
</script>

<template>
  <button class="btn btn-outline rounded-lg bg-transparent hover:btn-accent text-base-content" @click="toggleTheme">
    {{ theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode" }}
  </button>
</template>
