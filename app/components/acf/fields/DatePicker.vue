<template>
  <div class="flex flex-row gap-2 w-full justify-between">
    <div
      v-for="(item, index) in displayFormats"
      :style="{ flex: `${100 / displayFormats.length}%` }"
      :key="item"
      class="grow shrink-0"
    >
      <UFormField v-if="['d', 'D'].includes(item)" label="Day" :disabled="disabled">
        <USelectMenu :items="days" class="w-full"/>
      </UFormField>

      <UFormField v-if="['m', 'M'].includes(item)" label="Month" :disabled="disabled">
        <USelectMenu :items="months" class="w-full" />
      </UFormField>

      <UFormField v-if="['y', 'Y'].includes(item)" label="Year" :disabled="disabled">
        <USelectMenu :items="years" class="w-full" />
      </UFormField>
    </div>
  </div>

  <!-- <UPopover>
    <UButton
      color="neutral"
      variant="subtle"
      icon="i-lucide-calendar"
      class="w-full"
    >
      {{
        modelValue
          ? df.format(modelValue.toDate(getLocalTimeZone()))
          : "Select a date"
      }}
    </UButton>

    <template #content>
      <UCalendar
        class="p-2"
        :modelValue="modelValue"
        @update:modelValue="emit('update:modelValue', $event)"
      />
    </template>
  </UPopover> -->
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
} from "@internationalized/date";

const df = new DateFormatter("en-US", {
  dateStyle: "medium",
});

const props = defineProps<{
  modelValue?: any;
  layout?: "horizontal" | "vertical";
  display_format?: string;
  disabled?: boolean;
}>();

// WICHTIG: Synchronisiere den internen Wert mit dem modelValue Prop
const emit = defineEmits(["update:modelValue"]);

const displayFormats = computed(() => props.display_format?.split("/") || []);
const days = ref(Array.from({ length: 31 }, (_, i) => (i + 1).toString()));
const months = ref([
  { label: "January", id: "01" },
  { label: "February", id: "02" },
  { label: "March", id: "03" },
  { label: "April", id: "04" },
  { label: "May", id: "05" },
  { label: "June", id: "06" },
  { label: "July", id: "07" },
  { label: "August", id: "08" },
  { label: "September", id: "09" },
  { label: "October", id: "10" },
  { label: "November", id: "11" },
  { label: "December", id: "12" },
]);
const years = ref(
  Array.from({ length: new Date().getFullYear() - 1980 + 1 }, (_, i) =>
    (new Date().getFullYear() - i).toString()
  )
);
const dayValue = ref<string | null>(null);
const monthValue = ref<string | null>(null);
const yearValue = ref<string | null>(null);
</script>
