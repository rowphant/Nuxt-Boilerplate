<template>
  <ul>
    <li v-for="member in props.members" :key="member.id">
      <div class="border border-muted rounded-md flex p-2">
        <div class="grow flex flex-col text-sm">
          <div class="text-muted">{{ member.name }}</div>
          <div>{{ member.email }}</div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
const props = defineProps({
  members: {
    type: Array,
    required: true,
  },
});
</script>
