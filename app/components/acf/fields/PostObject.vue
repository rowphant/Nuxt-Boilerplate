<template>
  <AcfPostsList :modelValue="modelValue" />
  <!-- <div class="flex flex-row flex-wrap gap-1 items-center">
    <AcfPostItem :modelValue="modelValue" />
  </div> -->
</template>

<script lang="ts" setup>
import AcfPostItem from '../AcfPostItem.vue';

defineProps<{
  modelValue?: any;
  required?: boolean | number;
  placeholder?: string;
  maxLength?: number | string;
  disabled?: boolean | number;
}>();

const emit = defineEmits(["update:modelValue"]);
</script>
