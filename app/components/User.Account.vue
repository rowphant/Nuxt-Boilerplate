<template>
  <div v-if="!user" class="loader" />

  <div v-if="user" class="space-y-4">
    <div class="flex items-baseline gap-2">
      <label class="w-[150px]">Account ID</label>
      <div class="opacity-80">{{ user.id }}</div>
    </div>
    <div class="flex items-baseline gap-2">
      <label class="w-[150px]">Locale</label>
      <div class="opacity-80">{{ user.locale }}</div>
    </div>
    <div class="flex items-baseline gap-2">
      <label class="w-[150px]">Registered Date</label>
      <div class="opacity-80">{{ user.registered_date }}</div>
    </div>
    <div class="flex items-baseline gap-2">
      <label class="w-[150px]">Roles</label>
      <ul class="opacity-80">
        <li v-for="role in user.roles" :key="role">
          {{ role }}
        </li>
      </ul>
    </div>
    <div class="flex items-baseline gap-2">
      <label class="w-[150px]">Capabilities</label>
      <ul class="opacity-80">
        <li v-for="(value, key) in user.capabilities" :key="key">
          {{ key }}: {{ value }}
        </li>
      </ul>
    </div>
    <div class="flex items-baseline gap-2">
      <label class="w-[150px]">Extra Capabilities</label>
      <ul class="opacity-80">
        <li v-for="(value, key) in user.extra_capabilities" :key="key">
          {{ key }}: {{ value }}
        </li>
      </ul>
    </div>
    <div class="flex items-baseline gap-2">
      <label class="w-[150px]">Avatar Urls</label>
      <ul class="opacity-80">
        <li v-for="(value, key) in user.avatar_urls" :key="key">
          {{ key }}: {{ value }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const user = ref(authStore?.details);

watch(
  () => authStore.details,
  (newDetails) => {
    user.value = newDetails;
  }
);
</script>
