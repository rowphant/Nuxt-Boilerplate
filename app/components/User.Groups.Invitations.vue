<template>
  <div class="space-y-4">
    <div class="flex flex-col gap-2">
      <div class="text-muted_ text-sm">Invite members</div>
      <UForm class="flex gap-2" @submit="addGroupInvitation" :state="invitation">
        <UInput
          ref="emailInput"
          type="email"
          color="neutral"
          placeholder="Type email address"
          class="grow"
          v-model="invitation.email"
        >
        </UInput>
        <UButton
          type="submit"
          color="primary"
          variant="outline"
          class="cursor-pointer"
          icon="tabler:users-plus"
          :loading="loading"
          >Invite member</UButton
        >
      </UForm>
      <UBadge
        v-if="addGroupInvitationResponse && !addGroupInvitationResponse?.success"
        color="warning"
        variant="subtle"
      >
        {{ addGroupInvitationResponse?.message }}
      </UBadge>
      <UBadge
        v-if="addGroupInvitationResponse && addGroupInvitationResponse?.success"
        color="success"
        variant="subtle"
      >
        {{ addGroupInvitationResponse?.message }}
      </UBadge>
    </div>
    <div class="flex flex-col gap-2">
      <div class="text-muted_ text-sm">Open invitations</div>
      <ul class="flex flex-wrap gap-2">
        <li v-for="invitation in props.invitations">
          <!-- <UButtonGroup> -->
          <UBadge color="info" variant="outline" class="p-0">
            <div class="px-2 py-1">
              {{ invitation }}
            </div>
            <UTooltip
              :delay-duration="0"
              text="Delete invitation"
              :ui="{ content: 'text-neutral' }"
            >
              <UButton
                :disabled="loading"
                icon="material-symbols:close"
                size="sm"
                color="info"
                variant="subtle"
                class="rounded-l-none cursor-pointer"
                @click="deleteGroupInvitation(invitation)"
              />
            </UTooltip>
          </UBadge>
          <!-- </UButtonGroup> -->
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";

const props = defineProps({
  groupId: {
    type: Number,
    default: null,
  },
  invitations: {
    type: Array,
    default: null,
  },
});

const invitation = reactive({
  email: "",
});
const loading = ref(false);
const addGroupInvitationResponse = ref<{ message: string; success: boolean } | null>(
  null
);
const deleteGroupInvitationResponse = ref<{
  message: string;
  success: boolean;
} | null>(null);
const emailInput = ref(null);

const addGroupInvitation = async () => {
  loading.value = true;
  console.log("addGroupInvitation: ", invitation.email);
  const { addGroupInvitation } = useUserGroups();
  const response = await addGroupInvitation(props.groupId, invitation.email);

  const { fetchUser } = useUser();
  await fetchUser();

  invitation.email = "";
  addGroupInvitationResponse.value = response;
  loading.value = false;
};

const deleteGroupInvitation = async (email: string) => {
  loading.value = true;
  console.log("deleteGroupInvitation: ", email);
  const { deleteGroupInvitation } = useUserGroups();
  const response = await deleteGroupInvitation(props.groupId, email);

  console.log("response: ", response);
  
  const { fetchUser } = useUser();
  await fetchUser();
  
  deleteGroupInvitationResponse.value = response;
  loading.value = false;
};
</script>
