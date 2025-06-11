<template>
  <div class="flex flex-col gap-8">
    <form @submit.prevent="submitHandler" class="max-w-content">
      <fieldset className="fieldset space-y-8">
        <input type="hidden" name="id" :value="Number(group?.id)" />
        <div class="flex flex-col space-y-4">
          <label
            for="username"
            class="relative input shadow-none text-left overflow-hidden p-0"
          >
            <UInput
              type="text"
              name="title"
              id="title"
              v-model="title"
              required
              placeholder="Group name"
              icon="material-symbols:drive-file-rename-outline-outline-rounded"
              class="w-full"
            />
          </label>
          <label
            for="status"
            class="relative input shadow-none text-left overflow-hidden p-0"
          >
            <USwitch
              name="status"
              v-model="status"
              label="Public"
              unchecked-icon="i-lucide-x"
              checked-icon="i-lucide-check"
            />
          </label>
        </div>
        <div class="flex gap-4 justify-end">
          <UButton
            type="submit"
            class="justify-center cursor-pointer"
            :icon="group?.id ? 'mingcute:send-plane-fill' : 'mingcute:add-line'"
            :loading="loading"
          >
            <span v-if="group?.id">Update user group</span>
            <span v-else>Create user group</span>
          </UButton>

          <UButton
            v-if="group?.id"
            color="warning"
            variant="outline"
            icon="material-symbols:delete-outline-rounded"
            class="cursor-pointer"
            @click="() => (deleteGroup = true)"
          />
        </div>

        <UAlert
          v-if="error"
          class="bg-error-400"
          :title="'Error ' + error?.data?.status || error?.code"
          color="error"
          icon="i-lucide-terminal"
          :description="error?.message"
        />
      </fieldset>
    </form>

    <!-- Delete group panel -->
    <div
      v-if="deleteGroup"
      class="border-2 border-warning-400 rounded-lg p-4"
      icon="i-lucide-terminal"
    >
      <div class="grow flex flex-col items-stretch gap-4">
        <div class="flex items-start gap-4">
          <div class="grow flex flex-col">
            <div class="font-bold text-warning">
              Are you sure you want to delete this group?
            </div>
            <div class="text-sm text-warning">
              Type the name of the group to confirm deletion.
            </div>
          </div>
          <UButton
            color="neutral"
            variant="outline"
            icon="material-symbols:close"
            class="cursor-pointer"
            size="xs"
            @click="() => (deleteGroup = false)"
          />
        </div>

        <label
          for="title-confirm"
          class="relative input shadow-none text-left overflow-hidden p-0"
        >
          <UInput
            type="text"
            name="title"
            id="title-confirm"
            color="warning"
            variant="outline"
            highlight
            v-model="titleConfirm"
            required
            :placeholder="'Type &#34;' + title + '&#34; to confirm deletion'"
            class="w-full"
          />
        </label>
        <div>
          <UButton
            :disabled="titleConfirm !== title"
            label="Delete group"
            :color="'error'"
            variant="solid"
            icon="material-symbols:delete-outline-rounded"
            class="cursor-pointer"
            @click="deleteGroupHandler"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
const { createUserGroup, editUserGroup, deleteUserGroup } = useUserGroups();
const deleteGroup = ref(false);

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  group: {
    type: Object,
    default: () => {},
  },
  onSubmit: {
    type: Function,
    default: () => {},
  },
});

const error = ref(null);

const title = ref(props.group?.title);
const titleConfirm = ref("");
const status = ref(props.group?.status === "publish");
const description = ref(props.group?.description);
const invitations = ref("");
const loading = ref(false);

const submitHandler = async (e) => {
  loading.value = true;
  const form = e.target;
  const data = new FormData(form);

  let values = Object.fromEntries(data.entries());

  if (!values.status) {
    values.status = "draft";
  } else {
    values.status = "publish";
  }

  if (props.group?.id) {
    const data = await editUserGroup(values);
    if (!data.id) {
      error.value = data.data;
    } else {
      props.onSubmit(data);
    }
  } else {
    const data = await createUserGroup(values);
    if (!data.id) {
      error.value = data.data;
    } else {
      props.onSubmit(data);
    }
  }

  loading.value = false;
};

const deleteGroupHandler = async () => {
  const data = await deleteUserGroup(props.group);

  if (!data.id) {
    error.value = data;
  } else {
    props.onSubmit(data);
  }
};
</script>
