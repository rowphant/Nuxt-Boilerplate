<template>
  <USwitch
    :modelValue="props.modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    size="xl"
    unchecked-icon="i-lucide-x"
    checked-icon="i-lucide-check"
    class="border-2 light:has-data-[state=checked]:border-primary border-transparent light:border-(--ui-text-muted)/50 w-fit rounded-full"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean;
  label?: string;
  instructions?: string;
  value?: boolean;
  required?: boolean | number;
}>();

const emit = defineEmits(['update:modelValue']);
</script>
