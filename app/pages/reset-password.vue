<template>
  <div class="py-20">
    <UserResetPasswordRequest v-if="!code" />
    <UserResetPassword v-else :code="code" :userId="userId" />
  </div>
</template>

<script setup lang="ts">
import UserResetPasswordRequest from "~/components/User.ResetPasswordRequest.vue";
import UserResetPassword from "~/components/User.ResetPassword.vue";

const route = useRoute();
const code = ref(route.query.code);
const userId = ref(route.query.user_id);
</script>
