<template>

    <!-- modelValue: {{ modelValue }} -->
    <AcfPostsList :modelValue="modelValue" />
    <!-- <div
      v-for="item in modelValue"
      :key="item.id"
      
    >
      <AcfPostItem :modelValue="item" />
    </div> -->

</template>

<script lang="ts" setup>
import AcfPostItem from "../AcfPostItem.vue";
import AcfPostsList from "../AcfPostsList.vue";

defineProps<{
  modelValue?: any;
  required?: boolean | number;
  placeholder?: string;
  maxLength?: number | string;
  disabled?: boolean | number;
}>();

const emit = defineEmits(["update:modelValue"]);
</script>
