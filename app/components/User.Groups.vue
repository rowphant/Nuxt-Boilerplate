<template>
  <!-- {{ user?.user_groups }} -->
  <div class="border-b-1 border-(--ui-border-muted) pb-4 mb-8">
    <UButton
      label="Create new group"
      color="neutral"
      variant="outline"
      icon="mingcute:add-line"
      class="cursor-pointer"
    />
    <UButton
      label="Request access to group"
      color="neutral"
      variant="outline"
      icon="mingcute:classify-add-2-fill"
      class="cursor-pointer"
    />
  </div>
  <div class="grid grid-cols-1 gap-8">
    <div
      v-for="(type, typeIndex) in user?.user_groups"
      :key="typeIndex"
      class="space-y-2 border-b-1 border-(--ui-border-muted)/50 pb-8"
    >
      <h3 class="text-lg text-secondary">
        {{ typeIndex.charAt(0).toUpperCase() + typeIndex.slice(1) }}
      </h3>
      <div class="space-y-2">
        <!-- No Entries -->
        <div v-if="type.length === 0" class="text-sm text-(--ui-text-muted)">
          <div v-if="['invitations', 'requests'].includes(typeIndex)">
            No open {{ typeIndex }}
          </div>
          <div v-else>No groups found.</div>
        </div>

        <!-- Groups list -->
        <div
          v-for="(group, groupIndex) in type"
          :key="groupIndex"
          class="rounded-lg p-4 border border-(--ui-border) bg-navbar/20 flex gap-4"
        >
          <div class="grow">
            <div class="flex gap-4 items-center">
              {{ group.title }}
              <Icon
                v-if="['admin', 'member'].includes(typeIndex)"
                :name="
                  group.public
                    ? 'material-symbols:visibility-outline-rounded'
                    : 'material-symbols:visibility-off-outline-rounded'
                "
                class="size-5"
              />
            </div>
            <div class="text-sm text-(--ui-text-muted)">ID: {{ group.id }}</div>
            <div class="text-sm text-(--ui-text-muted)">Members: {{ group.members }}</div>
            <div
              v-if="['invitations'].includes(typeIndex)"
              class="text-sm text-(--ui-text-muted)"
            >
              Invited by: {{ group.invited_by }}
            </div>
          </div>

          <div
            v-if="['invitations'].includes(typeIndex)"
            class="space-y-2 flex"
          >
            <div class="flex gap-2 justify-end items-end">
              <UButton
                label="Accept"
                color="success"
                variant="outline"
                icon="i-heroicons:check-circle-solid"
                class="cursor-pointer"
              />
              <UButton
                label="Decline"
                color="error"
                variant="outline"
                icon="i-heroicons:x-circle-solid"
                class="cursor-pointer"
              />
            </div>
          </div>
          <div v-if="['request'].includes(typeIndex)" class="space-y-2 flex">
            <div class="flex gap-2 justify-end items-end">
              <UButton
                label="Delete"
                color="error"
                variant="outline"
                icon="material-symbols:delete-outline-rounded"
                class="cursor-pointer"
              />
            </div>
          </div>
          <div v-if="['member'].includes(typeIndex)" class="space-y-2 flex">
            <div class="flex gap-2 justify-end items-end">
              <UButton
                label="Leave"
                color="error"
                variant="outline"
                icon="material-symbols:exit-to-app-rounded"
                class="cursor-pointer"
              />
            </div>
          </div>
          <div v-if="['admin'].includes(typeIndex)" class="space-y-2 flex">
            <div class="flex gap-2 justify-end items-end">
              <UButton
                label="Settings"
                color="neutral"
                variant="outline"
                icon="mingcute:settings-7-line"
                class="cursor-pointer"
              />
              <UButton
                label="Delete"
                color="error"
                variant="outline"
                icon="material-symbols:delete-outline-rounded"
                class="cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="space-y-2">
      <h3 class="text-lg">Admin</h3>
      <div
        class="bg-slate-950/50 rounded-lg p-4 border border-(--ui-border-muted)"
      >
        <div v-for="(value, index) in user?.user_groups.admin" :key="index">
          {{ value.title }}
        </div>
      </div>
    </div>

    <div class="">
      <h3 class="text-lg">Member</h3>
      <div class="border rounded-lg p-4">
        <div v-for="(value, index) in user?.user_groups.member" :key="index">
          {{ value.title }}
        </div>
      </div>
    </div>

    <div class="">
      <h3 class="text-lg">Invitations</h3>
      <div class="border rounded-lg p-4">
        <div
          v-for="(value, index) in user?.user_groups.invitations"
          :key="index"
        >
          {{ value.title }}
        </div>
      </div>
    </div>

    <div class="">
      <h3 class="text-lg">Requests</h3>
      <div class="border rounded-lg p-4">
        <div v-for="(value, index) in user?.user_groups.requests" :key="index">
          {{ value.title }}
        </div>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
const { user } = useUser();
console.log(user.value.user_groups);
</script>
