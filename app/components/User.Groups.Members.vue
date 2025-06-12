<template>
  <ul class="space-y-2">
    <li v-for="member in props.users" :key="member.id">
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
  users: {
    type: Array as () => { id: number; name: string; email: string }[],
    required: true,
  },
});

console.log("members: ", props.users);
</script>
