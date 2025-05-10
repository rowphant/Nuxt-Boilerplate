<template>
  <!-- <div v-if="!user" class="loader" /> -->

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
      <label class="w-[150px]">Account acitvated</label>
      <div class="opacity-80">{{ user.account_activated }}</div>
    </div>
    <div class="flex items-baseline gap-2">
      <label class="w-[150px]">Roles</label>
      <ul class="opacity-80">
        <li v-for="role in user.roles" :key="role">
          {{ role }}
        </li>
      </ul>
    </div>
    <div class="flex items-baseline gap-2 items-start" v-if="settings?.user_profile_image">
      <label class="min-w-[150px]">Profile image</label>
      <img
        class_="cursor-pointer"
        :src="user.profile_image.sizes?.thumbnail"
      />
      <ul class="opacity-80 text-xs">
        <li
          v-for="(imageValue, imageKey) in user.profile_image"
          :key="imageKey"
        >
          <!-- {{ image }} -->
          <div v-if="typeof imageValue === 'object'">
            <ul class="space-y-2">
              <li
                v-for="(value, key) in imageValue"
                :key="key"
                class="p-2 rounded-md bg-slate-800"
              >
                <div class="font-bold min-w-[150px] w-[150px]">{{ key }}:</div>
                {{ value }}
              </li>
            </ul>
          </div>
          <span v-else>{{ imageKey }}: {{ imageValue }}</span>
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
import { useGlobalStore } from "~/stores/settings";

const { settings } = useGlobalStore();
const authStore = useAuthStore();
const user = ref(authStore?.user);

watch(
  () => authStore.user,
  (newValue) => {
    user.value = newValue;
  }
);
</script>
