<template>
  <div v-if="processedFields.length > 0">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="flex flex-col gap-2">
        <div v-for="(item, index) in processedFields" :key="index">
          <div v-if="item.type === 'accordion'">
            <ACF_Accordion
              :formData="formData"
              :index="index"
              :fieldData="item"
              :setFieldEditedStatus="setFieldEditedStatus"
            />
          </div>
          <div v-else>
            <AcfField
              :fieldData="item"
              :index="index"
              :formData="formData"
              v-model="formData[item.key].value"
              @update:isEdited="setFieldEditedStatus(item.key, $event)"
              :dev="devMode"
            />
          </div>

          <!-- Field data -->
          <div class="w-full hidden_" v-if="devMode">
            <UAccordion
              :items="accItems"
              :ui="{
                trigger: 'p-2 cursor-pointer text-xs',
                item: 'border last:border transition data-[state=open]:border-primary data-[state=closed]:border-muted rounded',
                header: 'data-[state=open]:border-b border-muted',
              }"
            >
              <template #content>
                <!-- {{ item }} -->
                <!-- {{ item?.conditional_logic }} -->
                <ConditionalLogicDetails :fieldData="item" />
              </template>
            </UAccordion>
          </div>
        </div>
      </div>
      <!-- <div class="sticky bottom-0 left-0 right-0 p-4 z-99">
        <div class="rounded bg-primary">
          <UButton
            type="submit"
            class="w-full cursor-pointer"
            color="primary"
            variant="solid"
            size="xl"
          >
            Save Changes
          </UButton>
        </div>
      </div> -->
    </form>
  </div>
  <div v-else>
    <p>No conditional logic data available for this post type.</p>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from "vue";
import type { AccordionItem } from "@nuxt/ui";
import AcfField from "@/components/acf/AcfField.vue";
import ACF_Accordion from "@/components/acf/fields/Accordion.vue";
import ConditionalLogicDetails from "@/components/acf/ConditionalLogic.Details.vue";

const props = defineProps<{
  logic: {
    fields: Array<Record<string, any>>;
  };
  fields: Record<string, any> | Array<Record<string, any>>;
  callback: (data: any) => void;
}>();

const devMode = false;
const accItems = [
  {
    label: "Field details",
    // icon: "i-lucide-smile",
  },
] satisfies AccordionItem[];

// Der Typ für formData muss das verschachtelte Objekt widerspiegeln
const formData = ref<
  Record<
    string,
    {
      value?: any;
      isEdited?: boolean;
      key?: string;
      name: string;
      type?: string;
    }
  >
>({});
const processedFields = ref<Array<Record<string, any>>>([]);

/**
 * Initialisiert oder aktualisiert formData, um die { value, isEdited } Struktur zu gewährleisten.
 *
 * @param fieldName Der Name des Feldes.
 * @param initialValue Der initiale Wert des Feldes.
 */
const ensureFieldStructure = (
  fieldName: string,
  initialValue: any,
  key?: string
) => {
  // Wenn das Feld noch nicht existiert oder kein Objekt ist, initialisiere es korrekt
  if (
    !formData.value[key] ||
    typeof formData.value[key] !== "object" ||
    formData.value[key] === null
  ) {
    formData.value[key] = {
      value: props.fields?.[fieldName],
      // value: initialValue,
      name: fieldName,
      // key: key,
      isEdited: false,
    };
  } else {
    // Wenn es bereits existiert und ein Objekt ist, stelle sicher, dass 'value' und 'isEdited' vorhanden sind
    if (!("value" in formData.value[key])) {
      formData.value[key].value = initialValue;
    }
    if (!("isEdited" in formData.value[key])) {
      formData.value[key].isEdited = false;
    }
    // Optional: Aktualisiere den Wert nur, wenn er nicht bereits vom Benutzer geändert wurde
    // Dies hängt von der genauen Logik ab, wann du den Initialwert aktualisieren möchtest.
    // Für jetzt nehmen wir an, dass die API-Werte initial gesetzt werden sollen.
    // formData.value[fieldName].value = initialValue;
  }
};

/**
 * Verarbeitet die eingehenden Felder und gruppiert sie in Akkordeons.
 * Initialisiert dabei auch formData mit den korrekten Strukturen.
 */
const processFields = (fields: Array<Record<string, any>>) => {
  let currentAccordion: Record<string, any> | null = null;
  const tempProcessedFields: Array<Record<string, any>> = [];

  // Temporäres Set, um zu verfolgen, welche Felder in den neuen Daten vorkommen
  const newFieldNames = new Set<string>();

  fields.forEach((field) => {
    if (field.type === "accordion") {
      currentAccordion = {
        type: "accordion",
        label: field.label,
        open: field.open === 1,
        content: [],
        ...field,
      };
      tempProcessedFields.push(currentAccordion);
    } else {
      if (currentAccordion) {
        currentAccordion.content.push(field);
      } else {
        tempProcessedFields.push(field);
      }

      if (field.key) {
        newFieldNames.add(field.key);
        // Hier rufen wir die neue Hilfsfunktion auf
        ensureFieldStructure(
          field.name,
          field.value !== undefined ? field.value : null,
          field.key
        );
      }
    }
  });

  // Optional: Bereinige formData von Feldern, die nicht mehr in `fields` vorhanden sind
  // Dies ist wichtig, wenn sich die API-Daten ändern und Felder entfernt werden.
  Object.keys(formData.value).forEach((key) => {
    if (!newFieldNames.has(key)) {
      delete formData.value[key];
    }
  });

  processedFields.value = tempProcessedFields;
};

// Felder initial verarbeiten, wenn die Komponente gemountet wird
onMounted(() => {
  if (props.logic && props.logic.fields) {
    processFields(props.logic.fields);
  }
  console.log("processedFields:", processedFields.value);
});

// Felder erneut verarbeiten, wenn sich die 'logic.fields' Prop ändert
watch(
  () => props.logic.fields,
  (newFields) => {
    if (newFields) {
      processFields(newFields);
    }
  },
  { deep: true }
);

// WICHTIG: Dieser Watcher gibt jede Änderung von formData in der Konsole aus!
watch(
  formData,
  (newValue) => {
    // console.log("formData updated:", newValue);

    // const editedFields = Object.entries(formData.value)
    //   .filter(([, data]) => data.isEdited)
    //   .map(([key, data]) => ({
    //     key: key,
    //     name: data.name,
    //     value: data.value,
    //     isEdited: data.isEdited,
    //   }));

    const editedFields = Object.fromEntries(
      Object.entries(formData.value)
        .filter(([, data]) => data.isEdited)
        // .map(([key, data]) => [key, data.value])
        .map(([key, data]) => {
          return [
            key,
            {
              // key: key,
              name: data.name,
              value: data.value,
              // isEdited: data.isEdited,
            },
          ];
        })
    );

    // console.log("Edited fields:", editedFields);
    props.callback({ editedFields: editedFields });
  },
  { deep: true }
); // 'deep: true' ist entscheidend, um Änderungen innerhalb des Objekts zu erkennen

// Methode zum Setzen des Bearbeitungsstatus
const setFieldEditedStatus = (key: string, isEdited: boolean) => {
  if (formData.value[key] && formData.value[key]?.type !== "accordion") {
    formData.value[key].isEdited = isEdited;
  } else {
    // Dies sollte nicht passieren, wenn ensureFieldStructure korrekt aufgerufen wird,
    // aber es ist eine gute Absicherung.
    console.warn(`Attempted to set isEdited for non-existent field: ${key}`);
  }
};

const handleSubmit = () => {
  console.log("Formulardaten gesammelt (beim Absenden):", formData.value);
  const editedFields = Object.fromEntries(
    Object.entries(formData.value)
      .filter(([, data]) => data.isEdited)
      .map(([key, data]) => [key, data.value]) // Gib nur den Wert der bearbeiteten Felder zurück
  );

  console.log("Edited fields:", editedFields);
};
</script>
