<template>
  <div class="flex flex-col justify-center items-center gap-8">
    <div v-if="!confirmedUser">
      <LoadingIndicator />
    </div>
    <div v-else>
      <div class="flex flex-col justify-center items-center gap-8">
        <div>
          <Icon
            v-if="confirmedUser.code === 200"
            name="pixelarticons:mood-happy"
            class="text-4xl text-primary"
          />
          <Icon
            v-else
            name="pixelarticons:mood-sad"
            class="text-4xl text-primary"
          />
        </div>
        <UBadge color="warning" variant="subtle" v-if="confirmedUser?.code !== 200">
          {{ confirmedUser?.message }}
        </UBadge>
        <UBadge color="success" variant="subtle" v-if="confirmedUser?.code === 200">
          {{ confirmedUser?.message }}
        </UBadge>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import LoadingIndicator from "~/components/LoadingIndicator.vue";

const { confirmUser } = useAuth();

const route = useRoute();
const authCode = route.query.act || route.query.code;
const confirmedUser = ref(false);
const loading = ref(true);

try {
  loading.value = true;
  const response = await confirmUser(authCode);
  confirmedUser.value = response;
  loading.value = false;
} catch (error) {
  console.log(error);
  loading.value = false;
}
</script>
