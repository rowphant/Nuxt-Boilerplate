<template>
  <div class="max-w-xs mx-auto space-y-8 bg-navbar rounded-lg p-8">
    <div class="text-center">
      <h1 class="font-light text-2xl">Reset Password</h1>
    </div>
    <div class="relative space-y-8">
      <form
        @submit.prevent="resetPassword"
        :class="{ 'opacity-50': loading }"
        class="max-w-content space-y-4"
      >
        <fieldset className="fieldset space-y-2">
          <div class="mt-1">
            <label
              for="password"
              class="relative input shadow-none text-left overflow-hidden p-0"
            >
              <UInput
                type="password"
                name="password"
                id="password"
                v-model="password"
                required
                placeholder="New password"
                icon="heroicons-outline:lock-closed"
                class="w-full"
              />
            </label>
          </div>
          <div class="mt-1">
            <label
              for="password_confirm"
              class="relative input shadow-none text-left overflow-hidden p-0"
            >
              <UInput
                type="password"
                name="password_confirm"
                id="password_confirm"
                v-model="passwordConfirm"
                required
                placeholder="Confirm new password"
                icon="heroicons-outline:lock-closed"
                class="w-full"
              />
            </label>
          </div>
        </fieldset>

        <div class="">
          <UButton
            type="submit"
            class="mt-4 w-full justify-center cursor-pointer"
            color="neutral"
            :disabled="disableSubmit"
            :label="countdownLabel"
            :loading="loadingButton"
          >
            {{ countdownLabel }}
          </UButton>
        </div>

        <div
          v-if="
            (request?.data?.status && request?.data.status === 200) ||
            request?.success
          "
        >
          <UBadge color="success">{{ request?.message }}</UBadge>
        </div>
        <div v-if="request?.data?.status && request?.data?.status !== 200">
          <UBadge color="error">{{ request?.message }}</UBadge>
        </div>
      </form>
      <div
        class="absolute top-0 left-0 w-full h-full flex justify-center items-center"
        v-show="loading"
      >
        <LoadingIndicator />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import LoadingIndicator from "~/components/LoadingIndicator.vue";

const props = defineProps({
  code: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

const email = ref("");
const password = ref("");
const passwordConfirm = ref("");
const loading = ref(true);
const loadingButton = ref(false);
const request = ref(null);
const countdownLabel = ref("Reset password");
const disableSubmit = ref(true);

onMounted(() => {
  disableSubmit.value = false;
  loading.value = false;
});

async function resetPassword() {
  if (password.value !== passwordConfirm.value) {
    password.value = "";
    passwordConfirm.value = "";
    request.value = {
      data: {
        status: 400,
      },
      message: "Password and Password Confirm do not match",
    };
  } else {
    loadingButton.value = true;
    disableSubmit.value = true;
    const { $config } = useNuxtApp();
    const apiBase = $config.public?.apiBase;

    if (!apiBase) {
      console.error("API base is not defined");
      return;
    }

    try {
      const response = await $fetch(
        `${apiBase}/wp-json/wp/v2/reset-password/confirm`,
        {
          method: "POST",
          body: JSON.stringify({
            user_id: props.userId,
            code: props.code,
            new_password: password.value,
          }),
        }
      );

      if (!response) {
        console.error("No response received");
        return;
      }

      request.value = response;
      loadingButton.value = false;
    } catch (error) {
      if (!error.data) {
        console.error("No error data received");
        return;
      }

      request.value = error.data;
      loadingButton.value = false;
    }
  }
}
</script>
