<template>
  <div
    :class="[
      'transition border border-muted rounded p-4 space-y-2 bg-(--color-navbar)/30 flex flex-col items-start gap-4',
      { 'opacity-50': props.fieldData.conditional_logic && !conditionsMet },
    ]"
  >
    <div class="w-full flex flex-row items-start gap-4">
      <div class="flex flex-col items-start gap-2_ w-80 min-w-80">
        <!-- <UBadge class="text-xs text-muted" color="neutral" variant="subtle">
          {{ index + 1 }}
        </UBadge> -->
        <h5 class="text-md grow flex gap-2">
          <div class="w-full flex flex-row gap-1">
            <span v-html="fieldData.label" />
            <div v-if="fieldData.required" class="text-primary font-bold">
              *
            </div>
          </div>
          <UTooltip
            v-if="fieldData.conditional_logic"
            text="Field has conditional logic"
          >
            <UBadge
              v-if="fieldData.conditional_logic"
              class="rounded-full w-5 aspect-square justify-center items-center"
              color="secondary"
              variant="subtle"
              size="xs"
            >
              C
            </UBadge>
          </UTooltip>
        </h5>
        <div
          v-if="fieldData.instructions"
          class="text-muted text-xs"
        >
        Instructions:<br/><span v-html="fieldData.instructions"></span>
      </div>
        <div
          v-if="Boolean(fieldData.multiple)"
          class="text-muted text-xs"
        >
        Multiple values allowed
      </div>
        <!-- <UBadge color="secondary" variant="subtle">{{ fieldData.type }}</UBadge>
        <UBadge
          color="warning"
          variant="subtle"
          v-if="fieldData.conditional_logic"
          >Conditional Logic</UBadge
        > -->
      </div>

      <!-- Form field -->
      <div
        class="flex flex-row gap-2 items-baseline w-full bg-muted/50 light:border border-muted rounded-xl p-2"
      >
        <UBadge
          v-if="fieldData.prepend"
          color="neutral"
          variant="ghost"
          size="lg"
          class="font-light"
        >
          {{ fieldData.prepend }}
        </UBadge>

        <div class="grow">
          <!-- Text -->
          <template v-if="fieldData.type === 'text'">
            <!-- v-bind="fieldData" -->
            <ACF_Text
              :modelValue="modelValue"
              :required="fieldData.required"
              :placeholder="fieldData.placeholder"
              :maxLength="fieldData.maxlength"
              @update:modelValue="handleFieldChange($event)"
            />
          </template>

          <!-- Textarea -->
          <template v-else-if="fieldData.type === 'textarea'">
            <ACF_Textarea
              :modelValue="modelValue"
              :required="fieldData.required"
              :placeholder="fieldData.placeholder"
              :rows="fieldData.rows"
              :maxRows="10"
              :autoresize="true"
              :maxLength="fieldData.maxlength"
              @update:modelValue="handleFieldChange($event)"
            />
          </template>

          <!-- Number -->
          <template v-else-if="fieldData.type === 'number'">
            <div class="flex justify-center">
              <ACF_Number
                :modelValue="modelValue"
                :required="fieldData.required"
                :placeholder="fieldData.placeholder"
                :step="fieldData?.step"
                :min="fieldData?.min"
                :max="fieldData?.max"
                :orientation="fieldData?.layout || 'horizontal'"
                @update:modelValue="handleFieldChange($event)"
              />
            </div>
          </template>

          <!-- Radio -->
          <template
            v-else-if="
              fieldData.type === 'radio' || fieldData.type === 'button_group'
            "
          >
            <ACF_Radio
              :allow_null="fieldData.allow_null"
              :choices="convertObjectToArray(fieldData.choices)"
              :layout="fieldData.layout || 'vertical'"
              :modelValue="modelValue || [{'label': null, 'value': null}]"
              :otherChoice="fieldData.other_choice"
              :required="fieldData.required"
              :returnFormat="fieldData.return_format"
              :save_other_choices="fieldData.save_other_choices"
              @update:modelValue="handleFieldChange($event)"
            />
          </template>

          <!-- Checkbox -->
          <template v-else-if="fieldData.type === 'checkbox'">
            <ACF_Checkbox
              :choices="convertObjectToArray(fieldData.choices)"
              :custom_choice_button_text="fieldData.custom_choice_button_text"
              :layout="fieldData.layout || 'vertical'"
              :modelValue="modelValue || [{'label': null, 'value': null}]"
              :required="fieldData.required"
              :returnFormat="fieldData.return_format"
              :saveCustom="fieldData.save_custom"
              :toggle="fieldData.toggle"
              @update:modelValue="handleFieldChange($event)"
            />
          </template>

          <!-- Select -->
          <template v-else-if="fieldData.type === 'select'">
            <ACF_Select
              :required="fieldData.required"
              :placeholder="fieldData.placeholder"
              :choices="convertObjectToArray(fieldData.choices)"
              :multiple="fieldData.multiple"
              :allowNull="fieldData.allow_null"
              :modelValue="modelValue"
              @update:modelValue="handleFieldChange($event)"
            />
          </template>

          <!-- True False / Switch -->
          <template v-else-if="fieldData.type === 'true_false'">
            <ACF_Switch
              :required="fieldData.required"
              :placeholder="fieldData.placeholder"
              :modelValue="modelValue"
              @update:modelValue="handleFieldChange($event)"
            />
          </template>

          <!-- Date picker -->
          <template v-else-if="fieldData.type === 'date_picker'">
            <ACF_DatePicker
              :required="fieldData.required"
              :placeholder="fieldData.placeholder"
              :modelValue="modelValue"
              @update:modelValue="handleFieldChange($event)"
            />
          </template>

          <!-- Unknown type -->
          <template v-else>
            <p class="text-sm text-gray-500">
              Unbekannter Feldtyp: {{ fieldData.type }}
            </p>
          </template>
        </div>

        <UBadge
          v-if="fieldData.append"
          color="neutral"
          variant="ghost"
          size="lg"
          class="font-light"
        >
          {{ fieldData.append }}
        </UBadge>
      </div>
    </div>

    <!-- Field data -->
    <div class="w-full hidden_" v-if="dev">
      <UAccordion
        :items="accItems"
        :ui="{
          trigger: 'p-2 cursor-pointer text-xs',
          item: 'border last:border transition data-[state=open]:border-primary data-[state=closed]:border-muted rounded',
          header: 'data-[state=open]:border-b border-muted',
        }"
      >
        <template #content="{ item }">
          <ConditionalLogicDetails :fieldData="fieldData" />
        </template>
      </UAccordion>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue";
import ConditionalLogicDetails from "./ConditionalLogic.Details.vue";
import type { AccordionItem } from "@nuxt/ui";
import ACF_Text from "@/components/acf/fields/Text.vue";
import ACF_Textarea from "@/components/acf/fields/Textarea.vue";
import ACF_Number from "@/components/acf/fields/Number.vue";
import ACF_Select from "@/components/acf/fields/Select.vue";
import ACF_Radio from "@/components/acf/fields/Radio.vue";
import ACF_Switch from "@/components/acf/fields/Switch.vue";
import ACF_Checkbox from "@/components/acf/fields/Checkbox.vue";
import ACF_DatePicker from "@/components/acf/fields/DatePicker.vue";

const props = defineProps<{
  fieldData: Record<string, any>; // Besser den Typ als Record<string, any> definieren
  index: Number;
  modelValue?: any;
  formData?: any;
  dev?: boolean;
}>();

const emit = defineEmits(["update:modelValue", "update:isEdited"]); // Neues Event definiert

// Wir brauchen einen internen Zustand, um den initialen Wert zu speichern
const initialValue = ref(props.modelValue);
const isEdited = ref(false); // Lokaler Zustand für den Bearbeitungsstatus
const conditionsMet = ref(false);

// Überwache den modelValue von oben. Wenn er sich ändert, aber nicht durch eine
// Benutzerinteraktion, setzen wir isEdited auf false zurück (z.B. wenn Form zurückgesetzt wird)
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== initialValue.value) {
      // Optional: Hier könntest du komplexere Logik einfügen,
      // wann der "bearbeitet"-Status zurückgesetzt wird
      // isEdited.value = false; // Könnte hier zurückgesetzt werden, wenn der Wert von oben kommt
    }
  }
);

interface Condition {
  field: string;
  operator: string;
  value: string;
}

// console.log("props.formData: ", props.formData);
const checkConditionalLogic = () => {
  // console.log("Conditional logic: ", props.fieldData.conditional_logic[0][0]);
  // console.log("props.formData: ", props.formData);

  // Verwende 'some' um zu prüfen, ob irgendeine Bedingungsgruppe zutrifft
  return props.fieldData.conditional_logic.some((conditionGroup: any) => {
    // console.log("conditionGroup: ", conditionGroup);

    // Verwende 'every' um zu prüfen, ob ALLE Bedingungen INNERHALB einer Gruppe zutreffen
    const groupComply = conditionGroup.every((condition: Condition) => {
      // console.log("condition: ", condition);
      const fieldValue = props.formData[condition.field].value;
      let comply = false;

      switch (condition.operator) {
        case "!=empty":
          comply =
            fieldValue !== "" &&
            fieldValue !== null &&
            typeof fieldValue !== "undefined";
          break;
        case "==empty": //
          comply =
            String(fieldValue) === "" ||
            String(fieldValue) === null ||
            typeof fieldValue === "undefined";
          break;
        case "==contains": //
          comply = String(fieldValue).includes(String(condition.value));
          break;
        case "==": //
          return String(fieldValue) === String(condition.value);
        case "!=": //
          return String(fieldValue) !== String(condition.value);
        case ">":
          return Number(fieldValue) > Number(condition.value);
        case "<":
          return Number(fieldValue) < Number(condition.value);
        case ">=":
          return Number(fieldValue) >= Number(condition.value);
        case "<=":
          return Number(fieldValue) <= Number(condition.value);
        default:
          comply = false; // Standardfall
          break;
      }
      return comply;
    });

    // console.log("complyGroups: ", groupComply);
    return groupComply;
  });
};

if (props.fieldData.conditional_logic) {
  watch(
    () => props.formData,
    (newVal) => {
      const metAllConditions = checkConditionalLogic();

      if (metAllConditions) {
        conditionsMet.value = true;
      } else {
        conditionsMet.value = false;
      }
      // console.log("metAllConditions: ", metAllConditions);
    },
    {
      immediate: true,
      deep: true,
    }
  );
}

const handleFieldChange = (newValue: any) => {
  // console.log("Field value changed:", newValue);
  // Emittiere den neuen Wert nach oben (standard v-model Event)
  emit("update:modelValue", newValue);

  // Setze isEdited auf true, wenn sich der Wert vom initialen Wert unterscheidet
  // Beachte, dass dies nur für einfache Typen funktioniert. Für Objekte/Arrays
  // bräuchtest du eine tiefere Gleichheitsprüfung.
  if (newValue !== initialValue.value) {
    isEdited.value = true;
  } else {
    isEdited.value = false; // Zurücksetzen, wenn der Wert wieder initial ist
  }
  // Emittiere den isEdited Status nach oben
  emit("update:isEdited", isEdited.value);
};

const accItems = [
  {
    label: "Field details",
    // icon: "i-lucide-smile",
  },
] satisfies AccordionItem[];

const convertObjectToArray = (inputObject) => {
  return Object.entries(inputObject).map(([value, label]) => ({
    label: label,
    value: value,
  }));
};

// console.log("ConditionalLogic.Item.vue props:", props.fieldData);
</script>
