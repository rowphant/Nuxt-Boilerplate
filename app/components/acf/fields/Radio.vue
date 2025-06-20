<template>
  <URadioGroup
    :items="choices"
    :modelValue="modelValue"
    :orientation_="layout"
    orientation="vertical"
    :required="Boolean(required)"
    variant="card"
    @update:modelValue="emit('update:modelValue', $event)"
    :ui="{
      item: 'transition-all cursor-pointer hover:border-primary/80 has-data-[state=checked]:ring-2 has-data-[state=checked]:ring-primary ring-inset transition',
    }"
  />
</template>

<script lang="ts" setup>
import type { RadioGroupItem } from "@nuxt/ui";
import { ref } from "vue";

const props = defineProps<{
  modelValue?: any;
  choices?: Array<{ label: string; value: string | number }>;
  layout?: "horizontal" | "vertical";
  required?: boolean | number;
}>();

const emit = defineEmits(["update:modelValue"]);
</script>
