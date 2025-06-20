<template>
  <!-- Fields list -->
  <div class="flex flex-col gap-4">
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
      <div
        class="rounded-lg border border-muted/50 p-4 flex flex-col items-start gap-4"
      >
        <UBadge color="neutral" variant="outline">
          <div class="text-muted">Field group:</div>
          <div>{{ acfFieldGroup.title }}</div>
        </UBadge>
        <div class="w-full">
          <AcfFields
            :logic="acfFieldGroup"
            :fields="post.acf"
            :callback="acfFieldsCallback"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  post?: any;
  callback?: (data: any) => void;
}>();

const { getAcfFields } = useWordpress();
const acfFieldGroups = await getAcfFields(props.post.type);
const initialValue = ref(props.post);
console.log("props.post: ", props.post);
console.log("acfFields: ", acfFieldGroups);

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

  console.log("initial Value: ", initialValue.value[key]?.rendered || initialValue.value[key]);
  console.log("props.post initial Value: ", props.post[key]?.rendered || props.post[key]);
  
  console.log("post.title.rendered: ", props.post.title.rendered)
  formData.value[key] = $event;
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
    Object.entries(callbackData.editedFields).forEach(([key, field]) => {
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
  { deep: true }
);
</script>
