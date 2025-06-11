<template>
  <div class="border-b-1 border-(--ui-border-muted) pb-4 mb-8 space-x-2">
    <!-- Create group -->
    <UButton
      label="Create group"
      color="neutral"
      variant="outline"
      icon="mingcute:add-line"
      class="cursor-pointer"
      @click="createGroupHandler"
    />

    <!-- Request group access -->
    <UButton
      label="Find group"
      color="neutral"
      variant="outline"
      icon="i-lucide-search"
      class="cursor-pointer"
      @click="searchGroupModal"
    />
  </div>

  <!-- Groups -->
  <div class="grid grid-cols-1 gap-8">
    <!-- Group Author -->
    <div class="space-y-2 border-b-1 border-(--ui-border-muted)/50 pb-8">
      <h3 class="text-lg text-secondary">Group Author</h3>
      <div class="space-y-2">
        <div
          v-if="user.group_author?.length > 0"
          v-for="(group, groupIndex) in user.group_author"
          :key="groupIndex"
          type="author"
        >
          <UserGroupsItem :group="group" />
        </div>
        <div v-else>No groups found.</div>
      </div>
    </div>

    <!-- Group Admin -->
    <div class="space-y-2 border-b-1 border-(--ui-border-muted)/50 pb-8">
      <h3 class="text-lg text-secondary">Group Admin</h3>
      <div class="space-y-2">
        <div
          v-if="user.group_admin?.length > 0"
          v-for="(group, groupIndex) in user.group_admin"
          :key="groupIndex"
          type="admin"
        >
          <UserGroupsItem :group="group" />
        </div>
        <div v-else>No groups found.</div>
      </div>
    </div>

    <!-- Group Member -->
    <div class="space-y-2 border-b-1 border-(--ui-border-muted)/50 pb-8">
      <h3 class="text-lg text-secondary">Group Member</h3>
      <div class="space-y-2">
        <div
          v-if="user.group_member?.length > 0"
          v-for="(group, groupIndex) in user.group_member"
          :key="groupIndex"
        >
          <UserGroupsItem :group="group" type="member"/>
        </div>
        <div v-else>No groups found.</div>
      </div>
    </div>

    <!-- Group Invitations -->
    <div class="space-y-2 border-b-1 border-(--ui-border-muted)/50 pb-8">
      <h3 class="text-lg text-secondary">Group Invitations</h3>
      <div class="space-y-2">
        <div
          v-if="user.group_invitations?.length > 0"
          v-for="(group, groupIndex) in user.group_invitations"
          :key="groupIndex"
        >
          <UserGroupsItem :group="group" type="invitations" />
        </div>
        <div v-else>No groups found.</div>
      </div>
    </div>

    <!-- Group Requests -->
    <div class="space-y-2 border-b-1 border-(--ui-border-muted)/50 pb-8">
      <h3 class="text-lg text-secondary">Group Requests</h3>
      <div class="space-y-2">
        <div
          v-if="user.group_requests?.length > 0"
          v-for="(group, groupIndex) in user.group_requests"
          :key="groupIndex"
        >
          <UserGroupsItem :group="group" type="requests" />
        </div>
        <div v-else>No groups found.</div>
      </div>
    </div>
  </div>

  <!-- Modal Create/Edit group -->
  <UModal
    title="Create user group"
    :overlay="true"
    :ui="{ content: 'md:max-w-xl' }"
    v-model:open="modalUserGroup"
  >
    <template #body>
      <div class="flex flex-col gap-8">
        <div class="flex flex-col gap-2">
          <UserGroupsForm
            :group="currentGroup"
            :onSubmit="userGroupsFormSubmitHandler"
          />
        </div>
      </div>
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

  <!-- Modal Find group -->
  <UModal
    :title="'Find user group and request access'"
    :overlay="true"
    :ui="{
      content: 'md:max-w-xl',
      body_: 'p-0 sm:p-0',
      header: 'hidden sm:p-0 min-h-0',
    }"
    v-model:open="modalFindGroup"
  >
    <template #body>
      <UserGroupsSearch />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import UserGroupsItem from "./User.Groups.Item.vue";
import UserGroupsForm from "./User.Groups.Form.vue";
import UserGroupsSearch from "./User.Groups.Search.vue";
import UserGroupsInvitations from "./User.Groups.Invitations.vue";

const { user, fetchUser } = useUser();

const modalUserGroup = ref(false);
const modalFindGroup = ref(false);
const currentGroup = ref<Record<string, any>>({});

console.log("user: ", user.value);

const createGroupHandler = () => {
  currentGroup.value = null;
  modalUserGroup.value = true;
};

const userGroupsFormSubmitHandler = async (response) => {
  // Close modal and fetch user
  if (response?.id) {
    modalUserGroup.value = false;
    await fetchUser();
  }
};

const searchGroupModal = () => {
  modalFindGroup.value = true;
};
</script>
