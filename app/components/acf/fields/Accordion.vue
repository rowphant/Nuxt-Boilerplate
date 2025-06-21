<template>
  <div class="relative">
    <UAccordion
      :items="[
        {
          label: `${fieldData.label} ${
            Boolean(fieldData.conditional_logic) ? '*' : ''
          }`,
          icon: 'i-lucide-box',
        },
      ]"
      :ui="{
        trigger:
          'p-4 cursor-pointer text-lg font-light_ text-primary dark:bg-red-400_',
        item: 'bg-(--color-navbar)/30_ transition border last:border transition data-[state=open]:border-(--ui-border-muted) data-[state=closed]:border-muted rounded',
        header: 'sticky -top-6 z-[11] rounded backdrop-blur-sm bg-muted/50',
        content: 'p-4 z-[10] relative ',
      }"
      :disabled="props.fieldData.conditional_logic && !conditionsMet"
      v-model="active"
    >
      <template #content>
        <div class="space-y-2 z-[10] relative">
          <div
            v-for="(field, fieldIndex) in fieldData.content"
            :key="fieldIndex"
          >
            <AcfField
              :fieldData="field"
              :index="fieldIndex"
              :formData="formData"
              v-model="formData[field.key].value"
              @update:isEdited="setFieldEditedStatus(field.key, $event)"
              :dev="true"
            />
          </div>
        </div>
      </template>
    </UAccordion>
  </div>
</template>
<script lang="ts" setup>
import type { AccordionItem } from "@nuxt/ui";
const props = defineProps<{
  fieldData: {
    label: string;
    content: Record<string, any>[];
    conditional_logic?: any;
  };
  // NEU: Empfängt das gesamte formData-Objekt
  formData: Record<string, { value: any; isEdited: boolean }>;
  // NEU: Empfängt die setFieldEditedStatus Funktion
  setFieldEditedStatus: (key: string, isEdited: boolean) => void;
  active?: string;
  closeOnDisable?: boolean;
}>();

const active = ref(props.active || "");
const conditionsMet = ref(false);

if (props.fieldData.conditional_logic) {
  watch(
    () => props?.formData,
    (newVal) => {
      const { checkConditionalLogic } = useACF();
      const metAllConditions = checkConditionalLogic(
        props.formData,
        props.fieldData.conditional_logic
      );

      if (metAllConditions) {
        conditionsMet.value = true;
      } else {
        conditionsMet.value = false;
        if (
          props.closeOnDisable !== false ||
          props.closeOnDisable === undefined ||
          props.closeOnDisable === null ||
          !props.closeOnDisable
        ) {
          active.value = "";
        }
      }
    },
    {
      immediate: true,
      deep: true,
    }
  );
}
</script>
