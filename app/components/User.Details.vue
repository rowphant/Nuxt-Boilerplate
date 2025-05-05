<template>
  <div v-if="!user" class="loader" />

  <UForm v-if="user" class="space-y-4" :state="user" @submit="onSubmit">
    <UFormField label="ID">
      <UInput v-model="user.id" disabled />
    </UFormField>
    <UFormField label="Username">
      <UInput v-model="user.username" />
    </UFormField>
    <!-- <UFormField label="Nickname">
      <UInput v-model="user.nickname" disabled />
    </UFormField> -->
    <!-- <UFormField label="Slug">
      <UInput v-model="user.slug" disabled />
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
    <!-- <UFormField label="Locale">
      <UInput v-model="user.locale" disabled />
    </UFormField> -->

    <UButton type="submit" :loading="authStore.loading"> Submit </UButton>

    <div class="w-full">
      <UBadge v-if="error" color="warning">{{ error.message }}</UBadge>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const user = ref(authStore?.details);
const error = ref(null);

watch(
  () => authStore.details,
  (newDetails) => {
    user.value = newDetails;
  }
);

const onSubmit = async () => {
  if (user.value) {
    const response = await authStore.updateUserDetails(user.value);

    if (response?.data?.status !== 200) {
      error.value = response;
    }
  }
};
</script>
