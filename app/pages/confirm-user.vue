<template>
  <div class="min-h-screen flex flex-col justify-center items-center gap-8">
    <div v-if="!confirmedUser">
      <LoadingIndicator />
    </div>
    <div v-else>
      <div class="flex flex-col justify-center items-center gap-8">
        <div v-if="confirmedUser.code === 200">
          <Icon name="mingcute:thumb-up-line" class="text-4xl text-primary" />
        </div>
        {{ confirmedUser?.message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import LoadingIndicator from "~/components/LoadingIndicator.vue";

const authStore = useAuthStore();

const route = useRoute();
const authCode = route.query.act || route.query.code;
const confirmedUser = ref(false);
const loading = ref(true);

try {
  loading.value = true;
  const response = await authStore.confirmUser(authCode);
  confirmedUser.value = response;
  loading.value = false;
} catch (error) {
  console.log(error);
  loading.value = false;
}
</script>
