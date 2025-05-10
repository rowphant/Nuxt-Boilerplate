<template>
  <div class="grid grid-cols-2 gap-4">
    <UForm
      v-if="user"
      class="max-w-content space-y-4"
      :state="user"
      @submit="onSubmit"
    >
      <div class="space-y-4">
        <UFormField label="ID">
          <UInput v-model="user.id" disabled icon="mingcute:hashtag-line"/>
        </UFormField>
        <UFormField label="Username">
          <UInput v-model="user.username" icon="heroicons-outline:user" />
        </UFormField>
        <!-- <UFormField label="Nickname">
             <UInput v-model="form.nickname" disabled />
           </UFormField> -->
        <!-- <UFormField label="Slug">
             <UInput v-model="form.slug" disabled />
           </UFormField> -->
        <UFormField label="First name">
          <UInput v-model="user.first_name" icon="heroicons-outline:user" />
        </UFormField>
        <UFormField label="Last name">
          <UInput v-model="user.last_name" icon="heroicons-outline:user" />
        </UFormField>
        <UFormField label="E-Mail">
          <UInput v-model="user.email" icon="heroicons-outline:at-symbol" />
        </UFormField>
        <UFormField label="Description">
          <UInput v-model="user.description" icon="material-symbols:drive-file-rename-outline-outline"/>
        </UFormField>
      </div>

      <UButton type="submit" :loading="authStore.loading"> Submit </UButton>

      <div class="w-full">
        <UBadge v-if="error" color="warning">{{ error.message }}</UBadge>
      </div>
    </UForm>

    <div
      v-if="user && settings?.user_profile_image"
      class="max-w-content flex flex-col items-start gap-4"
    >
      <label>Profile image</label>
      <UserImage />
    </div>
  </div>
</template>

<script setup lang="ts">
import { UButton } from "#components";
import { ref, watch } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useGlobalStore } from "~/stores/settings";
import UserImage from "~/components/User.Image.vue";

const authStore = useAuthStore();
const { settings } = useGlobalStore();
console.log(settings);
const user = ref(authStore?.user);

const form = ref<{
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  description: string;
}>({
  id: 0,
  username: "",
  first_name: "",
  last_name: "",
  email: "",
  description: "",
});
const error = ref(null);

const processingFiles = ref([]);

const onSubmit = async () => {
  if (user.value) {
    console.log(user.value);
    const response = await authStore.updateUserDetails(user.value);

    if (response?.data?.status !== 200) {
      error.value = response;
    }
  }
};
</script>
