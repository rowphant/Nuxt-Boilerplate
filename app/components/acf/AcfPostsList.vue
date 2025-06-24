<template>
  <div class="flex flex-row flex-wrap gap-1 items-center">
    <template v-if="Array.isArray(modelValue)">
      <AcfPostItem v-for="item in modelValue" :modelValue="item" :key="item.ID" />
    </template>
    <template v-else>
      <AcfPostItem :modelValue="modelValue" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import AcfPostItem from "./AcfPostItem.vue";

defineProps<{
  modelValue?: any;
  required?: boolean | number;
  placeholder?: string;
  maxLength?: number | string;
  disabled?: boolean | number;
}>();

const emit = defineEmits(["update:modelValue"]);
</script>
