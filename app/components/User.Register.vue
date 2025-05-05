<template>
  <div class="py-20">
    <div class="max-w-md mx-auto space-y-8 bg-navbar rounded-lg p-8">
      <h1 class="text-4xl">Register</h1>
      <UForm
        class="space-y-4"
        :state="registerState"
        @submit="onSubmit"
        :loading="authStore.loading"
      >
        <UFormField label="Username">
          <UInput v-model="registerState.username" />
        </UFormField>
        <UFormField label="Email address">
          <UInput v-model="registerState.email" type="email" />
        </UFormField>
        <UFormField label="Password">
          <UInput v-model="registerState.password" type="password" />
        </UFormField>
        <UFormField label="Confirm Password">
          <UInput v-model="registerState.confirm_password" type="password" />
        </UFormField>
        <div class="w-full">
          <UBadge v-if="error" color="warning">{{ error.message }}</UBadge>
        </div>
        <UButton type="submit" :loading="authStore.loading"> Register </UButton>
      </UForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const registerState = ref({
  username: "",
  email: "",
  password: "",
  confirm_password: "",
});
const error = ref(null);

watch(
  () => authStore.error,
  (newError) => {
    error.value = newError;
  }
);

const onSubmit = async () => {
  try {
    await authStore.register(
      registerState.value.username,
      registerState.value.email,
      registerState.value.password
    );
  } catch (e) {
    error.value = e;
  }
};
</script>
