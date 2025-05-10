<template>
  <!-- <div v-if="!user" class="loader" /> -->
  <UForm v-if="user" class="space-y-4" :state="user" @submit="onSubmit">
    <div class="flex flex-row gap-4 grid grid-cols-2">
      <div class="space-y-4 rounded-lg border p-4">
        <UFormField label="ID">
          <UInput v-model="user.id" disabled />
        </UFormField>
        <UFormField label="Username">
          <UInput v-model="user.username" />
        </UFormField>
        <!-- <UFormField label="Nickname">
          <UInput v-model="form.nickname" disabled />
        </UFormField> -->
        <!-- <UFormField label="Slug">
          <UInput v-model="form.slug" disabled />
        </UFormField> -->
        <UFormField label="First name">
          <UInput v-model="user.first_name" />
        </UFormField>
        <UFormField label="Last name">
          <UInput v-model="user.last_name" />
        </UFormField>
        <UFormField label="E-Mail">
          <UInput v-model="user.email" />
        </UFormField>
        <UFormField label="Description">
          <UInput v-model="user.description" />
        </UFormField>
      </div>
    </div>

    <!-- <UFormField label="Locale">
      <UInput v-model="form.locale" disabled />
    </UFormField> -->

    <UButton type="submit" :loading="authStore.loading"> Submit </UButton>

    <div class="w-full">
      <UBadge v-if="error" color="warning">{{ error.message }}</UBadge>
    </div>
  </UForm>

  <div
    v-if="user && settings?.user_profile_image"
    class="border rounded-lg p-4 flex flex-col items-start gap-4"
  >
    <label>Profile image</label>
    <img
      class="cursor-pointer rounded-md overflow-hidden"
      :src="user.profile_image?.sizes.thumbnail"
    />
    <UploadButton :submitHandler="uploadSubmitHandler" />
    <!-- <UButtonGroup class="gap-1">
      <UButton class="cursor-pointer" variant="outline" color="neutral"
        >Change image</UButton
      >
      <UButton class="cursor-pointer" variant="subtle" color="neutral"
        >Upload new image</UButton
      >
    </UButtonGroup> -->
  </div>
</template>

<script setup lang="ts">
import { UButton } from "#components";
import { ref, watch } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useGlobalStore } from "~/stores/settings";
import UploadButton from "./UploadButton.vue";

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

const uploadSubmitHandler = async (formData: FormData) => {
  for (const pair of formData.entries()) {
    // const key = pair[0];
    // const value = pair[1];
    // const index = processingFiles.value.length;

    // value && processingFiles.value.push(value);

    const data = await authStore.uploadUserImage(formData);

    // if (data.file) {
    //   processingFiles.value[index] = data.file;
    // }

    console.log("response data: ", data);
    console.log("uploadSubmitHandler: ", formData);
  }
  // const { uploadUserImage } = useAuthStore();
  // const upload = await uploadUserImage(formData);

  // return upload;
};

const onSubmit = async () => {
  if (user.value) {
    console.log(user.value)
    const response = await authStore.updateUserDetails(user.value);

    if (response?.data?.status !== 200) {
      error.value = response;
    }
  }
};
</script>
