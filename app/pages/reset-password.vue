<template>
  <div
    class="flex flex-col justify-center items-center"
    v-if="!globalStore.settings || globalStore.settings.reset_password === 0"
  >
    <LoadingIndicator />
  </div>
  <div v-else>
    <UserResetPasswordRequest v-if="!code" />
    <UserResetPassword v-else :code="code" :userId="userId" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useGlobalStore } from "~/stores/settings";
import { useRouter } from "vue-router";
import UserResetPasswordRequest from "~/components/User.ResetPasswordRequest.vue";
import UserResetPassword from "~/components/User.ResetPassword.vue";
import LoadingIndicator from "~/components/LoadingIndicator.vue";

const router = useRouter();
const globalStore = useGlobalStore();

watch(
  () => globalStore.settings,
  () => {
    if (globalStore.settings.reset_password === 0) {
      router.push("/");
    }
  }
);

const route = useRoute();
const code = ref(route.query.code);
const userId = ref(route.query.user_id);
</script>
