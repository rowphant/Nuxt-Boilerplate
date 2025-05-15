<template>
  <div class="max-w-xs mx-auto space-y-8 bg-navbar rounded-lg p-8">
    <h1 class="font-light text-2xl">Login</h1>
    <form @submit.prevent="handleLogin" class="max-w-content">
      <fieldset className="fieldset space-y-2">
        <div>
          <!-- <label for="username" class="block text-sm font-medium text-gray-700"
            >Username</label
          > -->
          <div class="mt-1">
            <label
              for="username"
              class="relative input shadow-none text-left overflow-hidden p-0"
            >
              <UInput
                type="text"
                name="username"
                id="username"
                v-model="username"
                required
                placeholder="Username"
                icon="heroicons-outline:user"
                class="w-full"
              />
            </label>
          </div>
        </div>

        <div>
          <!-- <label for="password" class="block text-sm font-medium text-gray-700"
            >Password</label
          > -->
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
                placeholder="Password"
                icon="heroicons-outline:lock-closed"
                class="w-full"
              />
            </label>
          </div>
        </div>

        <div
          class="text-right text-xs"
          v-if="useGlobalStore().settings?.reset_password"
        >
          <ULink as="a" to="/reset-password">Forgot your password?</ULink>
        </div>
      </fieldset>

      <div class="">
        <UButton
          type="submit"
          class="mt-4 w-full justify-center cursor-pointer"
          :loading="loading"
        >
          Login
        </UButton>
      </div>
    </form>
    <div
      class="text-right flex flex-col text-xs"
      v-if="useGlobalStore().settings?.user_registration"
    >
      <div class="text-xs text-muted">You don't have an account?</div>
      <!-- <NuxtLink to="/register" class="text-xs font-bold_"
          >Register here</NuxtLink
        > -->
      <ULink as="a" to="/register">Register here</ULink>
    </div>

    <div v-if="responseData?.data?.status > 200">
      <UBadge color="error" class="flex_ flex-col_ items-start_">
        <div v-html="responseData?.message"></div>
      </UBadge>
    </div>

    <!-- <div v-if="isAuthenticated">
      Eingeloggt ✔️ <button @click="logout">Logout</button>
    </div> -->
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useGlobalStore } from "~/stores/settings";

const { login, logout, isAuthenticated } = useAuth();
const { user } = useUser();

const { settings } = useGlobalStore();

const username = ref("");
const password = ref("");
const responseData = ref({});
const loading = ref(false);

const handleLogin = async () => {
  try {
    await login(username.value, password.value);
    navigateTo("/user");
  } catch (error) {
    console.error("Login fehlgeschlagen", error);
  }
};
</script>
