<template>
  <div class="flex flex-row flex-wrap gap-1 items-center">
    <UTextarea
      :modelValue="modelValue"
      @update:modelValue="emit('update:modelValue', $event)"
      :placeholder="placeholder"
      :rows="Number(rows) || undefined"
      :maxrows="Number(maxRows) || undefined"
      :autoresize="Boolean(autoresize)"
      :maxlength="Number(maxLength) || undefined"
      class="w-full"
      :ui="{ trailing: 'pointer-events-none' }"
      :trailing="Boolean(maxLength || trailing)"
    >
  </UTextarea>
  <div class="w-full flex flex-row justify-end">
    <template v-if="Boolean(maxLength || trailing)">
      <div
        id="character-count"
        class="text-xs text-muted tabular-nums"
        aria-live="polite"
        role="status"
      >
        {{ modelValue?.length || 0 }}/{{ String(maxLength) }}
      </div>
    </template>
  </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  modelValue?: any;
  placeholder?: string;
  color?: string;
  variant?: string;
  size?: string;
  required?: boolean | number;
  disabled?: boolean | number;
  rows?: number | string;
  maxRows?: number | string;
  hightlight?: boolean | number;
  icon?: string;
  loading?: boolean | number;
  autoresize?: boolean | number;
  maxLength?: number | string;
  trailing?: boolean | number;
}>();

const emit = defineEmits(["update:modelValue"]);
</script>
