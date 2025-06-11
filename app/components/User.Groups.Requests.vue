<template>
  <div v-if="!requests.length" class="text-muted text-center">No requests found</div>
  <ul v-else class="flex flex-col gap-2">
    <li v-for="request in props.requests" :key="request">
      <div class="border border-muted rounded-md flex p-2">
        <div class="grow flex flex-col text-sm">
          <div class="text-muted">{{ request.name }}</div>
          <div>{{ request.email }}</div>
        </div>

        <div class="space-x-2">
          <UButton
            label="Accept"
            color="primary"
            variant="outline"
            icon="material-symbols:check-rounded"
            class="cursor-pointer"
            @click="requestAction('accept', request.id)"
            :loading="loading"
          />
          <UButton
            label="Decline"
            color="warning"
            variant="outline"
            icon="material-symbols:close-rounded"
            class="cursor-pointer"
            @click="requestAction('decline', request.id)"
            :loading="loading"
          />
        </div>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
const props = defineProps({
  groupId: {
    type: String,
    required: true,
  },
  requests: {
    type: Array as () => { id: number; name: string; email: string }[],
    required: true,
  },
});

const loading = ref(false);

const requestAction = async (action, userId) => {
  loading.value = true;

  const { groupRequestAction } = useUserGroups();
  const response = await groupRequestAction(props.groupId, userId, action);
  const { fetchUser } = useUser();
  await fetchUser();

  loading.value = false;
};
</script>
