<template>
  <div class="flex flex-row flex-wrap gap-1 items-center">
    <UInput
      class="grow"
      :modelValue="modelValue"
      @update:modelValue="emit('update:modelValue', $event)"
      :placeholder="placeholder"
      :required="Boolean(required)"
      :maxlength="Number(maxLength) || undefined"
      :ui="{ trailing: 'pointer-events-none' }"
    >
    </UInput>

    <div class="w-full flex flex-row justify-end">
      <template v-if="Boolean(maxLength)">
        <div
          id="character-count"
          class="text-xs text-muted tabular-nums"
          aria-live="polite"
          role="status"
        >
          {{ modelValue?.length || 0 }}/{{ maxLength }}
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  modelValue?: any;
  required?: boolean | number;
  placeholder?: string;
  maxLength?: number | string;
}>();

const emit = defineEmits(["update:modelValue"]);
</script>
