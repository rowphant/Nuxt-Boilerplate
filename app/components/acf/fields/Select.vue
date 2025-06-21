<template>
  <div class="flex flex-row gap-1">
    <USelect
      color="primary"
      :items="choices"
      :placeholder="placeholder || 'Wählen Sie eine Option'"
      :multiple="Boolean(multiple)"
      class="w-full"
      :modelValue="modelValue"
      @update:modelValue="emit('update:modelValue', $event)"
      :disabled="disabled"
    />
    <UButton
      v-if="allowNull"
      @click="clickDelete"
      color="neutral"
      variant="outline"
      icon="lucide:x"
      
      :class="['transition-all p-0 min-h-8 h-8 cursor-pointer flex justify-center items-center text-muted',
        modelValue?.length > 0 ? 'min-w-8 w-8' : 'min-w-0 w-0 opacity-0'
      ]"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const props = defineProps<{
  modelValue?: any;
  choices: Array<{ label: string; value: string | number }>;
  value?: string | number;
  placeholder?: string;
  required?: boolean | number;
  multiple?: boolean | number | string;
  allowNull?: boolean | number | string;
  disabled?: boolean;
}>();

const emit = defineEmits(["update:modelValue"]);

const clickDelete = () => {
  console.log("clickDelete");
  emit("update:modelValue", null);
};
</script>
