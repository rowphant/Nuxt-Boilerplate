<template>
  <div class="max-w-xs mx-auto space-y-8 bg-navbar rounded-lg p-8">
    <h1 class="font-light text-2xl">Register</h1>
    <UForm
      :state="registerState"
      @submit="onSubmit"
      :loading="authStore.loading"
      class="flex flex-col gap-3"
    >
      <!-- Username -->
      <label for="username">
        <UInput
          type="text"
          name="username"
          id="username"
          v-model="registerState.username"
          required
          placeholder="Username"
          icon="heroicons-outline:user"
          class="w-full"
        />
      </label>

      <!-- Email -->

      <div>
        <UInput
          type="email"
          name="email"
          id="email"
          v-model="registerState.email"
          required
          placeholder="Email address"
          placeholder_=""
          icon="heroicons-outline:at-symbol"
          class="w-full"
        >
          <!-- <label :class="labelClasses">
              <span class="inline-flex bg-default px-1 ml-6">Email address</span>
            </label> -->
        </UInput>
        <div class="text-xs opacity-50">We won't share your email.</div>
      </div>

      <!-- Password -->
      <label for="password">
        <UInput
          name="password"
          id="password"
          v-model="registerState.password"
          required
          placeholder="Password"
          class="w-full"
          :type="showPassword ? 'text' : 'password'"
          :icon="
            showPassword
              ? 'heroicons-outline:lock-open'
              : 'heroicons-outline:lock-closed'
          "
          :ui="{ trailing: 'pe-1' }"
        >
          <template #trailing>
            <UButton
              color="neutral"
              variant="link"
              size="sm"
              :icon="
                showPassword
                  ? 'heroicons-outline:lock-open'
                  : 'heroicons-outline:lock-closed'
              "
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              :aria-pressed="showPassword"
              aria-controls="password"
              @click="showPassword = !showPassword"
            />
          </template>
        </UInput>
      </label>

      <!-- Confirm password -->
      <label for="confirm_password">
        <UInput
          name="confirm_password"
          id="confirm_password"
          v-model="registerState.confirm_password"
          required
          placeholder="Confirm password"
          class="w-full"
          :type="showPassword ? 'text' : 'password'"
          :icon="
            showPassword
              ? 'heroicons-outline:lock-open'
              : 'heroicons-outline:lock-closed'
          "
          :ui="{ trailing: 'pe-1' }"
        >
          <template #trailing>
            <UButton
              color="neutral"
              variant="link"
              size="sm"
              :icon="
                showPassword
                  ? 'heroicons-outline:lock-open'
                  : 'heroicons-outline:lock-closed'
              "
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              :aria-pressed="showPassword"
              aria-controls="password"
              @click="showPassword = !showPassword"
            />
          </template>
        </UInput>
      </label>
      <div class="w-full">
        <UBadge v-if="error" color="warning">{{ error.message }}</UBadge>
      </div>
      <UButton
        type="submit"
        :loading="authStore.loading"
        class="justify-center cursor-pointer mt-4"
      >
        Register
      </UButton>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useAuthStore } from "@/stores/auth";

const labelClasses =
  "pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal";
const authStore = useAuthStore();
const showPassword = ref(false);
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
