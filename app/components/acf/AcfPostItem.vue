<template>
  <div
    class="w-full p-4 rounded-md border border-muted flex flex-col gap-1 justify-stretch bg-navbar/30"
  >
    <div>{{ modelValue?.post_title }}</div>
    <div class="text-xs text-muted">
      <div>
        <div class="text-xs text-muted">ID: {{ modelValue.ID }}</div>
      </div>
      <div>
        <div>Status: {{ modelValue?.post_status }}</div>
      </div>
      <div>
        <div>Type: {{ modelValue?.post_type }}</div>
      </div>
      <div>
        <div>Author: {{ modelValue?.post_author }}</div>
      </div>
      <!-- <div class="text-xs">{{ item }}</div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ modelValue?: any }>();
</script>
