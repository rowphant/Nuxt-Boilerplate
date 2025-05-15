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
          <UInput v-model="form.id" disabled icon="mingcute:hashtag-line" />
        </UFormField>
        <UFormField label="Username">
          <UInput
            v-model="form.username"
            icon="heroicons-outline:user"
            disabled
          />
        </UFormField>
        <!-- <UFormField label="Nickname">
             <UInput v-model="form.nickname" disabled />
           </UFormField> -->
        <!-- <UFormField label="Slug">
             <UInput v-model="form.slug" disabled />
           </UFormField> -->
        <UFormField label="First name">
          <UInput v-model="form.first_name" icon="heroicons-outline:user" />
        </UFormField>
        <UFormField label="Last name">
          <UInput v-model="form.last_name" icon="heroicons-outline:user" />
        </UFormField>
        <UFormField label="E-Mail">
          <UInput v-model="form.email" icon="heroicons-outline:at-symbol" />
        </UFormField>
        <UFormField label="Description">
          <UInput
            v-model="form.description"
            icon="material-symbols:drive-file-rename-outline-outline"
          />
        </UFormField>
      </div>

      <UButton
        type="submit"
        :loading_="loading"
        class="cursor-pointer"
      >
        Submit
      </UButton>

      <div class="w-full">
        <UBadge v-if="error?.message" color="warning">{{
          error?.message
        }}</UBadge>
        <UBadge v-if="success" color="success">Successfully saved</UBadge>
      </div>
    </UForm>
    <div
      v-if="user && globalStore.settings.user_profile_image"
      class="max-w-content flex flex-col items-start gap-4"
    >
      <label>Profile image</label>
      <UserImage
        :mediaLibrary="true"
        :changeImageCallback="changeImageCallback"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { UButton } from "#components";
import { ref, watch } from "vue";
import { useGlobalStore } from "~/stores/settings";
import UserImage from "~/components/User.Image.vue";

const globalStore = useGlobalStore();
const { user, updateUser } = useUser();

const form = ref<{
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  description: string;
  profile_image: number;
}>({});

watch(
  () => user.value,
  (newValue) => {
    if (!newValue) return;

    form.value = {
      id: newValue?.id,
      username: newValue?.username,
      first_name: newValue?.first_name,
      last_name: newValue?.last_name,
      email: newValue?.email,
      description: newValue?.description,
      profile_image: newValue?.profile_image.id || null,
    };
  },
  { immediate: true }
);

const error = ref(null);
const success = ref(null);
const processingFiles = ref([]);

const changeImageCallback = (image) => {
  console.log("Image changed", image);
  if (image?.id) {
    form.value.profile_image = image.id;
  } else {
    form.value.profile_image = null;
  }
};

const onSubmit = async () => {
  const changedFields = Object.entries(form.value).reduce(
    (acc, [key, value]) => {
      if (key === "profile_image") {
        if (value !== user?.profile_image?.id) {
          acc[key] = value;
        }
      } else if (value !== user?.[key]) {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, unknown>
  );

  if (Object.keys(changedFields).length > 0) {
    const response = await updateUser(changedFields);

    if (!response?.id) {
      error.value = response;
    } else {
      success.value = response.id;
    }
  }
};
</script>
