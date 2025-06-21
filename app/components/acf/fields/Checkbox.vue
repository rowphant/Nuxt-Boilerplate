<template>
  <UCheckboxGroup
    :items="choices"
    :modelValue="modelValue"
    orientation="vertical"
    :required="Boolean(required)"
    variant="card"
    @update:modelValue="handleUpdate"
    :disabled="disabled"
    :ui="{
      item: 'transition-all cursor-pointer hover:border-primary/80 has-data-[state=checked]:ring-2 has-data-[state=checked]:ring-primary ring-inset transition',
    }"
  />
</template>

<script lang="ts" setup>
import { ref } from "vue";

const props = defineProps<{
  modelValue?: any;
  choices?: Array<{ label: string; value: string | number }>;
  layout?: "horizontal" | "vertical";
  required?: boolean | number;
  disabled?: boolean;
}>();

const emit = defineEmits(["update:modelValue"]);

// Interner Zustand, der immer ein Array sein wird
const internalValue = ref<string[]>([]);

// WICHTIG: Synchronisiere den internen Wert mit dem modelValue Prop
// watch(
//   () => props.modelValue,
//   (newValue) => {
//     console.log("modelValue changed:", newValue);
//   },
//   { immediate: true }
// ); // Sofort ausführen beim Laden der Komponente

// Handler für das update:modelValue Event von UCheckboxGroup
const handleUpdate = (newValue: (string | number)[]) => { // Typisierung für newValue angepasst
  console.log("handleUpdate: ", newValue); // Hier siehst du die ausgewählten Werte
  // Gib den neuen Wert über das 'update:modelValue'-Event an die Elternkomponente weiter
  emit("update:modelValue", newValue);
};
</script>
