<template>
  <div
    class="flex gap-4 rounded-lg p-4 border border-(--ui-border) bg-navbar/20"
  >
    <div class="grow flex flex-col gap-2">
      <div class="flex gap-4 items-center">
        {{ group.title }}
        <Icon
          :name="
            group.status === 'publish'
              ? 'material-symbols:visibility-outline-rounded'
              : 'material-symbols:visibility-off-outline-rounded'
          "
          class="size-5"
        />
      </div>
      <ul class="flex items-center gap-4 text-xs text-muted">
        <li>
          <UButton
            @click="openModal('members')"
            color="neutral"
            variant="subtle"
            size="sm"
            class="cursor-pointer"
          >
            Admins: <span class="font-bold">{{ group.admins?.length }}</span>
          </UButton>
        </li>
        <li>
          <UButton
            @click="openModal('members')"
            color="neutral"
            variant="subtle"
            size="sm"
            class="cursor-pointer"
          >
            Members: <span class="font-bold">{{ group.member_count }}</span>
          </UButton>
        </li>
        <li>
          <UButton
            @click="openModal('requests')"
            color="neutral"
            variant="subtle"
            size="sm"
            class="cursor-pointer"
          >
            Requests: <span class="font-bold">{{ group.requests?.length }}</span>
          </UButton>
        </li>
        <li>
          <UButton
            @click="openModal('invitations')"
            color="neutral"
            variant="subtle"
            size="sm"
            class="cursor-pointer"
          >
            Invitations: <span class="font-bold">{{ group.invitations?.length }}</span>
          </UButton>
        </li>
      </ul>
    </div>

    <div class="space-y-2 flex">
      <div class="flex flex-col gap-4 items-end">
        <div class="flex gap-2">
          <UButton
            v-if="userCanAdmin(group.id)"
            label_="Settings"
            color="neutral"
            variant="outline"
            icon="mingcute:settings-7-line"
            icon_="material-symbols:more-horiz"
            class="cursor-pointer"
            @click="editGroupHandler"
          />
          <!-- <UButton
            v-if="userCanAdmin(group.id)"
            label="Invite members"
            color="neutral"
            variant="outline"
            icon="tabler:users-plus"
            class="cursor-pointer"
            @click="editGroupHandler"
          /> -->
        </div>
        <div class="flex gap-2">
          <UButton
            v-if="type === 'requests'"
            label="Delete request"
            color="warning"
            variant="outline"
            icon="material-symbols:close-rounded"
            class="cursor-pointer"
            @click="deleteRequest"
          />

          <!-- Invitations Actions -->
          <div v-if="type === 'invitations'" class="space-x-2">
            <UButton
              label="Accept"
              color="primary"
              variant="outline"
              icon="material-symbols:check-rounded"
              class="cursor-pointer"
              @click="userGroupInvitationAction('accept')"
              :loading="actionLoading"
            />
            <UButton
              label="Decline"
              color="warning"
              variant="outline"
              icon="material-symbols:close-rounded"
              class="cursor-pointer"
              @click="userGroupInvitationAction('decline')"
              :loading="actionLoading"
            />
          </div>

          <!-- Requests Actions -->
          <!-- <div v-if="type === 'requests'" class="space-x-2">
            <UButton
              label="Accept"
              color="primary"
              variant="outline"
              icon="material-symbols:check-rounded"
              class="cursor-pointer"
              @click="userGroupRequestAction('accept')"
              :loading="actionLoading"
            />
            <UButton
              label="Decline"
              color="warning"
              variant="outline"
              icon="material-symbols:close-rounded"
              class="cursor-pointer"
              @click="userGroupRequestAction('decline')"
              :loading="actionLoading"
            />
          </div> -->

          <UButton
            v-if="type === 'member'"
            label="Leave group"
            color="warning"
            variant="outline"
            icon="material-symbols:exit-to-app-rounded"
            class="cursor-pointer"
            @click="leaveGroup"
            :loading="loading"
          />
        </div>
      </div>
    </div>
  </div>

  <UModal
    :title="group?.id ? 'Group: ' + group?.title : 'Create user group'"
    :overlay="true"
    :ui="{ content: 'md:max-w-xl min-h-100' }"
    v-model:open="modal"
  >
    <template #body>
      <UTabs
        :items="items"
        variant="link"
        class="gap-4 w-full"
        :ui="{ trigger: 'grow cursor-pointer', content: 'pt-4' }"
        v-model="activeTabValue"
      >
        <template #settings="{ item }">
          <div class="flex flex-col gap-2">
            <UserGroupsForm
              :group="group"
              :onSubmit="userGroupsFormSubmitHandler"
            />
          </div>
        </template>

        <template #invitations="{ item }">
          <div class="flex flex-col gap-2">
            <UserGroupsInvitations
              :groupId="group.id"
              :invitations="group.invitations"
            />
          </div>
        </template>

        <template #requests="{ item }">
          <div class="flex flex-col gap-2">
            <UserGroupsRequests
              :groupId="group.id"
              :requests="group.requests"
            />
          </div>
        </template>

        <template #members="{ item }">
          <div class="flex flex-col gap-2">
            <UserGroupsMembers
              :groupId="group.id"
              :users="[...new Set([...group.members, ...group.admins])]"
            />
          </div>
        </template>
      </UTabs>
    </template>
    <!-- <template #footer>
          <div class="flex justify-end w-full gap-2">
            <UButton
              @click="() => {}"
              color="primary"
              class="cursor-pointer modal-close-button"
              :disabled="true"
              >Create user group</UButton
            >
          </div>
        </template> -->
  </UModal>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "nuxt/app";
import type { TabsItem } from "@nuxt/ui";
import UserGroupsRequests from "~/components/User.Groups.Requests.vue";
import UserGroupsMembers from "~/components/User.Groups.Members.vue";

const props = defineProps({
  group: {
    type: Object,
    required: true,
  },
  type: {
    type: String,
    required: false,
    default: null,
  },
});

const items: TabsItem[] = [
  {
    label: "Settings",
    value: "settings", // Hinzugefügt
    slot: "settings" as const,
  },
  {
    label: "Invitations",
    value: "invitations", // Hinzugefügt
    slot: "invitations" as const,
  },
  {
    label: "Requests",
    value: "requests", // Hinzugefügt
    slot: "requests" as const,
  },
  {
    label: "Members",
    value: "members", // Hinzugefügt
    slot: "members" as const,
  },
] satisfies TabsItem[];

const modal = ref(false);
const loading = ref(false);
const actionLoading = ref(false);

const userCanAdmin = (groupId) => {
  const { user } = useUser();
  const groupsIds = [
    ...user.value.group_author.map((group: { id: Number }) => group.id),
    ...user.value.group_admin.map((group: { id: Number }) => group.id),
  ];

  const uniqueGroupsIds = [...new Set(groupsIds)];

  return uniqueGroupsIds.includes(groupId);
};

const editGroupHandler = () => {
  openModal();
};

const userGroupsFormSubmitHandler = async (response) => {
  // Close modal and fetch user
  if (response?.id) {
    modal.value = false;
    const { fetchUser } = useUser();
    await fetchUser();
  }
};

const userGroupInvitationAction = async (action) => {
  actionLoading.value = true;

  const { user, fetchUser } = useUser();
  const { invitationAction } = useUserGroups();
  const response = await invitationAction(
    props.group.id,
    user.value.id,
    action
  );

  await fetchUser();

  actionLoading.value = false;
};

const userGroupRequestAction = async (action) => {
  actionLoading.value = true;

  const { user, fetchUser } = useUser();
  const { groupRequestAction } = useUserGroups();
  const response = await groupRequestAction(
    props.group.id,
    user.value.id,
    action
  );

  await fetchUser();

  actionLoading.value = false;
};

const deleteRequest = async () => {
  actionLoading.value = true;
  const { user, fetchUser } = useUser();
  const { deleteGroupRequest } = useUserGroups();
  const response = await deleteGroupRequest(props.group.id, user.value.id);

  await fetchUser();
  actionLoading.value = false;
};

const leaveGroup = async () => {
  loading.value = true;
  const { user, fetchUser } = useUser();
  const { removeGroupMember } = useUserGroups();
  const response = await removeGroupMember(props.group.id, user.value.id);

  await fetchUser();
  loading.value = false;
};

const activeTabValue = ref("settings");

const active = computed({
  get() {
    return activeTabValue.value;
  },
  set(tab) {
    activeTabValue.value = tab;
  },
});

const openModal = (slot?: string) => {
  modal.value = true;

  const tabExists = items.some((item) => item.value === slot);
  activeTabValue.value = tabExists && slot ? slot : items[0].slot;
};
</script>
