<template>
  <div class="flex flex-row flex-wrap_ gap-1 items-end">
    <USelect
      color="primary"
      :items="choices"
      :placeholder="placeholder || 'Wählen Sie eine Option'"
      :multiple="Boolean(multiple)"
      class="grow"
      :modelValue="modelValue"
      @update:modelValue="emit('update:modelValue', $event)"
      :disabled="Boolean(disabled)"
    />

    <div class="hidden_">
      <div
        v-if="allowNull"
        :class="[
          'transition-all',
          modelValue?.length > 0 ? 'scale-none delay-100' : 'scale-0',
        ]"
      >
        <div
          :class="[
            'transition-all p-0 min-h-8 h-8 cursor-pointer flex justify-center items-center text-muted',
            modelValue?.length > 0 ? 'min-w-8 w-8' : 'min-w-0 w-0 delay-100',
          ]"
        >
          <UTooltip
            :delay-duration="0"
            text="Reset date"
            :ui="{ content: 'text-neutral' }"
          >
            <UButton
              color="neutral"
              variant="outline"
              icon="i-heroicons-x-mark-20-solid"
              class="cursor-pointer"
              @click="clickDelete"
              :disabled="Boolean(disabled)"
            >
            </UButton>
          </UTooltip>
        </div>
      </div>
    </div>
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
  disabled?: boolean | number | string;
}>();

const emit = defineEmits(["update:modelValue"]);

const clickDelete = () => {
  emit("update:modelValue", null);
};
</script>
