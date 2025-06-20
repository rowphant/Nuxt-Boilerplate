<template>
  <div class="flex gap-2 items-center">
    <UInputNumber
      :defaultValue="Number(modelValue)"
      @update:modelValue="emit('update:modelValue', $event)"
      :step="Number(step)"
      :min="Number(min)"
      :max="Number(max)"
      :orientation="orientation"
      :placeholder="placeholder || 'Enter a number'"
      :required="Boolean(required)"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const props = defineProps<{
  modelValue?: any;
  required?: boolean | number;
  placeholder?: string;
  step?: number | string;
  min?: number | string;
  max?: number | string;
  orientation?: "horizontal" | "vertical";
}>();

// WIP: Min and Max are not working...

const emit = defineEmits(["update:modelValue"]);
</script>
