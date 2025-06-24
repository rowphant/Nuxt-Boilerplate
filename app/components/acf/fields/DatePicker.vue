<template>
  <div class="flex flex-row gap-1 w-full justify-between items-end">
    <div
      v-for="(item, index) in displayFormats"
      :style="{ flex: `${100 / displayFormats.length}%` }"
      :key="item"
      class="grow shrink-0"
    >
      <UFormField
        v-if="['d', 'D'].includes(item)"
        label="Day"
        :disabled="Boolean(disabled)"
      >
        <USelectMenu
          v-model="selectedDay"
          :items="selectableDays"
          class="w-full"
          placeholder="Day"
        />
      </UFormField>

      <UFormField
        v-if="['m', 'M'].includes(item)"
        label="Month"
        :disabled="Boolean(disabled)"
      >
        <USelectMenu
          v-model="selectedMonthObject"
          :items="selectableMonths"
          class="w-full"
          placeholder="Select month"
        />
      </UFormField>

      <UFormField
        v-if="['y', 'Y'].includes(item)"
        label="Year"
        :disabled="Boolean(disabled)"
      >
        <USelectMenu
          v-model="selectedYear"
          :items="selectableYears"
          class="w-full"
          placeholder="Select year"
        />
      </UFormField>
    </div>
    <div
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
            @click="clearDate"
            :disabled="Boolean(disabled)"
          >
          </UButton>
        </UTooltip>
      </div>
    </div>
  </div>

  <!-- <UBadge color="neutral" variant="subtle">
    dateObject: {{ dateObject }}
  </UBadge>
  <UBadge color="neutral" variant="subtle">
    displayFormats: {{ displayFormats }}
  </UBadge>
  <UBadge color="neutral" variant="subtle">
    Neues Datum: {{ dayValue }}. {{ monthValue }}. {{ yearValue }}
  </UBadge>
  <UBadge color="neutral" variant="subtle">
    modelValue: {{ modelValue }}
  </UBadge>
  <UBadge color="neutral" variant="subtle">
    Aktuelle Auswahl: {{ selectedDay }}. {{ selectedMonthObject?.label }} (ID: {{ selectedMonthObject?.id }}). {{ selectedYear }}
  </UBadge>

  <UBadge color="neutral" variant="subtle">
    Emitted Value: {{ composedDateString }}
  </UBadge> -->
</template>

<script lang="ts" setup>
import { ref, computed, watch } from "vue";

// Interface für die Monats-Objekte, damit TypeScript weiß, welche Eigenschaften sie haben
interface MonthItem {
  label: string;
  id: number;
}

const props = defineProps<{
  modelValue?: string; // modelValue ist jetzt ein String
  layout?: "horizontal" | "vertical";
  displayFormat?: string;
  disabled?: boolean | number;
  required?: boolean | number;
  placeholder?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const displayFormats = computed(() => props.displayFormat?.split("/") || []);

// Sicherstellen, dass Tage immer zweistellig sind
const selectableDays = ref(
  Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, "0"))
);
const selectableMonths = ref<MonthItem[]>([
  { label: "January", id: 1 },
  { label: "February", id: 2 },
  { label: "March", id: 3 },
  { label: "April", id: 4 },
  { label: "May", id: 5 },
  { label: "June", id: 6 },
  { label: "July", id: 7 },
  { label: "August", id: 8 },
  { label: "September", id: 9 },
  { label: "October", id: 10 },
  { label: "November", id: 11 },
  { label: "December", id: 12 },
]);
const selectableYears = ref(
  Array.from({ length: new Date().getFullYear() - 1980 + 1 }, (_, i) =>
    (new Date().getFullYear() - i).toString()
  )
);

// selectedMonthObject speichert jetzt das komplette Monats-Objekt
const selectedDay = ref<string | null>(null);
const selectedMonthObject = ref<MonthItem | null>(null); // Initial null, wird dann gesetzt
const selectedYear = ref<string | null>(null);

// Funktion zum Parsen und Setzen der internen Werte
const parseAndSetValues = (dateString?: string) => {
  console.log("parseAndSetValues");
  // console.log("dateString: ", dateString);
  // console.log("modelValue: ", props.modelValue);
  // console.log("selectedDay.value: ", selectedDay.value);
  // console.log("selectedMonthObject.value: ", selectedMonthObject.value);
  // console.log("selectedYear.value: ", selectedYear.value);

  if (dateString && dateString.length === 8) {
    const yearStr = dateString.substring(0, 4);
    const monthIdStr = dateString.substring(4, 6);
    const dayStr = dateString.substring(6, 8);

    selectedDay.value = dayStr;
    selectedYear.value = yearStr;

    // Suche das passende Monats-Objekt anhand der ID
    const monthId = parseInt(monthIdStr);
    selectedMonthObject.value =
      selectableMonths.value.find((m) => m.id === monthId) || null;
  } else if (
    selectedDay.value ||
    selectedMonthObject.value ||
    selectedYear.value
  ) {
    // Setze Standardwerte, wenn kein gültiges modelValue vorhanden ist
    // selectedDay.value = selectedDay.value || selectableDays.value[0] || null;
    // selectedMonthObject.value =
    //   selectedMonthObject.value || selectableMonths.value[0] || null; // Das erste Monats-Objekt als Standard
    // selectedYear.value = selectedYear.value || selectableYears.value[0] || null;
  }
};

// Initialisiere beim Setup direkt mit der Funktion
console.log("props.modelValue: ", props.modelValue);
props.modelValue && parseAndSetValues(props.modelValue);

// Erstelle ein Date-Objekt aus den ausgewählten Werten
const dateObject = computed(() => {
  // Sicherstellen, dass alle Werte vorhanden sind
  if (
    !selectedYear.value ||
    selectedMonthObject.value === null ||
    !selectedDay.value
  ) {
    return null;
  }
  const year = parseInt(selectedYear.value);
  const month = selectedMonthObject.value.id - 1; // Monate sind 0-indiziert
  const day = parseInt(selectedDay.value);

  // Date validation
  const date = new Date(year, month, day);
  if (
    date.getFullYear() === year &&
    date.getMonth() === month &&
    date.getDate() === day
  ) {
    return date;
  }
  return null; // Ungültiges Datum
});

// Zusammengesetzter String im Format JJJJMMTT, der an den Parent emittiert wird
const composedDateString = computed(() => {
  if (dateObject.value) {
    const year = dateObject.value.getFullYear();
    // Monat muss wieder zweistellig formatiert werden
    const month = (dateObject.value.getMonth() + 1).toString().padStart(2, "0");
    const day = dateObject.value.getDate().toString().padStart(2, "0");
    return `${year}${month}${day}`;
  }
  return "";
});

const clearDate = () => {
  console.log("clearDate");
  selectedDay.value = null;
  selectedMonthObject.value = null;
  selectedYear.value = null;
};

watch([selectedDay, selectedMonthObject, selectedYear], () => {
  if (
    selectedDay.value === null &&
    selectedMonthObject.value === null &&
    selectedYear.value === null
  ) {
    emit("update:modelValue", "");
  } else {
    selectedDay.value = selectedDay.value || selectableDays.value[0] || null;
    selectedMonthObject.value =
      selectedMonthObject.value || selectableMonths.value[0] || null;
    selectedYear.value = selectedYear.value || selectableYears.value[0] || null;

    emit("update:modelValue", composedDateString.value);
  }
});

watch(
  () => props.modelValue,
  (newValue) => {
    console.log("modelValue changed:", newValue);
    parseAndSetValues(newValue);
  }
);
</script>
