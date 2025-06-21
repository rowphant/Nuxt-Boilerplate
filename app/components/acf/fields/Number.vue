<template>
  <div class="flex gap-2 items-center grow">
    <UInputNumber
      :defaultValue="Number(modelValue)"
      @update:modelValue="emit('update:modelValue', $event)"
      :step="Number(step)"
      :min="min.length > 0 ? Number(min) : undefined"
      :max="max.length > 0 ? Number(max) : undefined"
      :orientation="orientation"
      :placeholder="placeholder || 'Enter a number'"
      :required="Boolean(required)"
      class="w-full font-semibold"
      :disabled="disabled"
    />
    {{ min.length > 0 ? Number(min) : undefined }}
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
  disabled?: boolean;
}>();

// WIP: Min and Max are not working...

const emit = defineEmits(["update:modelValue"]);
</script>
