<template>
  <!-- Fields list -->
  <div class="flex flex-col gap-4">
    <AcfFields
      :logic="wp_fields_logic"
      :fields="wp_fields_values"
      :callback="wpFieldsCallback"
    />
    <!-- Title -->
    <UFormField label="Title">
      <UInput
        v-model="post.title.rendered"
        size="xl"
        class="w-full"
        placeholder="Title"
        @update:modelValue="handleFieldChange('title', $event)"
      />
    </UFormField>

    <div v-for="acfFieldGroup in acfFieldGroups" :key="acfFieldGroup.id">
      <AcfFieldGroup
        :acfFieldGroup="acfFieldGroup"
        :post="post"
        :acfFieldsCallback="acfFieldsCallback"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import AcfFieldGroup from "./acf/AcfFieldGroup.vue";
import AcfFields from "./acf/AcfFields.vue";
import LoadingIndicator from "./LoadingIndicator.vue";

const props = defineProps<{
  post?: any;
  callback?: (data: any) => void;
}>();

const wp_fields_logic = ref({
  fields: [
    {
      key: "title",
      name: "title",
      type: "text",
      label: "Title",
    },
    {
      key: "status",
      name: "status",
      type: "radio",
      label: "Status",
      choices: {
        publish: "Published",
        draft: "Draft",
      },
    },
    // {
    //   key: "delete_post",
    //   name: "delete_post",
    //   type: "checkbox",
    //   label: "Delete Post",
    //   choices: {
    //     delete_post: "Delete Post",
    //   }
    // }
  ],
});

const wp_fields_values = ref({
  title: props.post.title.rendered,
  status: props.post.status,
});

const { getAcfFields } = useWordpress();
const acfFieldGroups = await getAcfFields(props.post.type);
const initialValue = ref(props.post);
// console.log("props.post: ", props.post);
console.log("acfFieldsGroup: ", acfFieldGroups);

type FormData = {
  title?: string;
  status?: string;
  acf?: Record<string, any>;
};

// console.log("props.post: ", props.post);

const formData = ref<FormData>({});

const handleFieldChange = (key: string, $event: any) => {
  if (!formData.value) {
    formData.value = {};
  }

  console.log("post.title.rendered: ", props.post.title.rendered);
  formData.value[key] = $event;
};

const wpFieldsCallback = (callbackData: {
  editedFields?: Record<
    string,
    { name: string; value: any; isEdited?: boolean }
  > | null;
}) => {
  console.log("callbackData: ", callbackData);
  if (!props.callback) {
    return;
  }

  if (!formData.value) {
    formData.value = {};
  }

  console.log("callbackData.editedFields: ", callbackData.editedFields);

  if (
    callbackData.editedFields
    // Object.keys(callbackData.editedFields).length > 0
  ) {
    Object.entries(callbackData.editedFields)
      .filter(([, field]) => field.isEdited)
      .forEach(([key, field]) => {
        formData.value[field.name] = field.value;
      });
  }
};

const acfFieldsCallback = (callbackData: {
  editedFields?: Record<
    string,
    { name: string; value: any; isEdited?: boolean }
  > | null;
}) => {
  if (!props.callback) {
    return;
  }

  if (!formData.value) {
    formData.value = {};
  }

  if (
    callbackData.editedFields &&
    Object.keys(callbackData.editedFields).length > 0
  ) {
    Object.entries(callbackData.editedFields)
      .filter(([, field]) => field.isEdited)
      .forEach(([key, field]) => {
        if (!formData.value.acf) {
          formData.value.acf = {};
        }
        formData.value.acf[field.name] = field.value;
      });
  }
};

watch(
  () => formData.value,
  (newValue) => {
    console.log("formData updated:", newValue);
    if (!props.callback) {
      return;
    }
    props.callback(newValue);
  },
  { deep: true}
);
</script>
