<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-start gap-2">
      <div class="grow">
        <div class="flex gap-4 items-center">
          {{ group.title.rendered }}
        </div>
      </div>
      <UButton
        label="Request access"
        color="neutral"
        variant="subtle"
        size="sm"
        class="cursor-pointer min-w-48 justify-center"
        :loading="loading"
        @click="requestAccess(group)"
        :disabled="fetchResponse && !fetchResponse?.success"
        v-if="!fetchResponse?.success"
      />
      <UButton
        label="Request sent"
        color="success"
        variant="subtle"
        disabled
        size="sm"
        icon="material-symbols:check-rounded"
        class="min-w-48 justify-center"
        v-if="fetchResponse?.success" />
    </div>
  </div>
  <div>
    <UBadge
      v-if="fetchResponse && !fetchResponse?.success"
      color="warning"
      variant="subtle"
      class="mt-2"
    >
      {{ fetchResponse.message }}
    </UBadge>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  group: {
    type: Object,
    required: true,
  },
});

const loading = ref(false);
const fetchResponse = ref(null);

const requestAccess = async (group: any) => {
  loading.value = true;

  try {
    const { addGroupRequest } = useUserGroups();
    const response = await addGroupRequest(group.id);

    fetchResponse.value = response.data || response;

    if (response?.success) {
      const { fetchUser } = useUser();
      await fetchUser();
    }

    console.log(fetchResponse.value);
  } catch (error) {
    fetchResponse.value = error;
    console.error("Error:", error);
  } finally {
    loading.value = false;
  }
};
</script>
