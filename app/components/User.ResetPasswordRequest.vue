<template>
  <div class="max-w-xs mx-auto space-y-8 bg-navbar rounded-lg p-8">
    <h1 class="font-light text-2xl">Reset Password</h1>
    <div class="relative space-y-8">
      <form
        @submit.prevent="sendResetLink"
        :class="{ 'opacity-50': loading }"
        class="max-w-content space-y-4"
      >
        <fieldset className="fieldset space-y-2">
          <div>
            <!-- <label for="username" class="block text-sm font-medium text-gray-700"
            >Username</label
          > -->
            <div class="mt-1">
              <label
                for="email"
                class="relative input shadow-none text-left overflow-hidden p-0"
              >
                <UInput
                  type="text"
                  name="email"
                  id="email"
                  v-model="email"
                  required
                  placeholder="E-Mail"
                  icon="heroicons-outline:mail"
                  class="w-full"
                />
              </label>
            </div>
          </div>
        </fieldset>

        <div class="">
          <UButton
            type="submit"
            class="w-full justify-center cursor-pointer"
            color="primary"
            :disabled="disableSubmit"
            :label="countdownLabel"
            :loading="loadingButton"
          >
            {{ countdownLabel }}
          </UButton>
        </div>

        <div v-if="request?.success">
          <UBadge color="success">{{ request.message }}</UBadge>
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
const email = ref("");
const loading = ref(true);
const loadingButton = ref(false);
const request = ref(null);
const countdown = ref(null); // seconds
const countdownLabel = ref("Send Reset Link");
const disableSubmit = ref(true);

const handleCountdown = () => {
  const intervalId = setInterval(() => {
    countdown.value -= 1;

    countdownLabel.value = `Resend in ${countdown.value}s`;
    if (countdown.value === 0) {
      clearInterval(intervalId);
      disableSubmit.value = false;
      countdownLabel.value = "Send reset link";
      localStorage.removeItem("resetPasswordDate");
    }
  }, 1000);
};

onMounted(() => {
  const resetPasswordDate = localStorage?.getItem("resetPasswordDate");
  if (resetPasswordDate) {
    const savedDate = new Date(resetPasswordDate);
    const secondsElapsed = (Date.now() - savedDate.getTime()) / 1000;
    const secondsLeft = 60 - secondsElapsed;

    if (secondsLeft < 60) {
      countdown.value = Math.floor(secondsLeft);
      handleCountdown();
    } else {
      localStorage.removeItem("resetPasswordDate");
      disableSubmit.value = false;
      loading.value = false;
    }
  } else {
    disableSubmit.value = false;
    loading.value = false;
  }
});

async function sendResetLink() {
  loadingButton.value = true;
  disableSubmit.value = true;
  localStorage.setItem("resetPasswordDate", new Date().toISOString());

  countdown.value = 60;
  countdownLabel.value = `Resend in ${countdown.value}s`;

  handleCountdown();

  const { $apiFetch } = useNuxtApp();

  try {
    const response = await $apiFetch(`/wp-json/wp/v2/reset-password/request`, {
      method: "POST",
      body: JSON.stringify({
        email: email.value,
      }),
    });

    if (!response) {
      console.error("No response received");
      return;
    }

    request.value = response;
    loadingButton.value = false;
  } catch (e) {
    if (!e.data) {
      console.error("No error data received");
      return;
    }

    request.value = e.data;
    loadingButton.value = false;
  }
}
</script>
