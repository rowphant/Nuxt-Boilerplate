<template>
  <div class="flex flex-col gap-px text-xs">
    <div v-for="(value, key) in fieldData" :key="key">
      <div
        v-if="key === 'conditional_logic'"
        class="flex gap-2 bg-white/[2.5%]"
      >
        <div class="font-semibold min-w-30 p-1">{{ key }}</div>
        <div>
          <UBadge color="neutral" variant="subtle"
            >{{ fieldData.conditional_logic.length }} condition(s)</UBadge
          >
        </div>
        <div
          v-if="
            fieldData.conditional_logic &&
            fieldData.conditional_logic.length > 0
          "
          class="grow"
        >
          <div class="border border-muted rounded">
            <table class="w-full">
              <thead>
                <tr class="text-left text-xs">
                  <th class="w-1/4 p-1">Group Type</th>
                  <th class="w-1/4 p-1">Field Key</th>
                  <th class="w-1/4 p-1">Operator</th>
                  <th class="w-1/4 p-1">Value</th>
                </tr>
              </thead>
              <tbody>
                <template
                  v-for="(
                    conditionGroup, groupIndex
                  ) in fieldData.conditional_logic"
                  :key="groupIndex"
                >
                  <tr
                    v-for="(condition, condIndex) in conditionGroup"
                    :key="condIndex"
                    :class="{
                      'bg-white/5': groupIndex % 2 === 0,
                      'bg-white/[2.5%]': groupIndex % 2 !== 0,
                    }"
                  >
                    <td
                      v-if="condIndex === 0"
                      :rowspan="conditionGroup.length"
                      class="p-1"
                    >
                      <span v-if="conditionGroup.length > 1"
                        ><UBadge color="neutral" variant="subtle"
                          >OR</UBadge
                        ></span
                      >
                      <span v-else
                        ><UBadge color="neutral" variant="subtle"
                          >AND</UBadge
                        ></span
                      >
                    </td>
                    <td class="p-1">
                      <UBadge color="neutral" variant="subtle">{{
                        condition.field
                      }}</UBadge>
                    </td>
                    <td class="p-1">
                      <UBadge color="neutral" variant="subtle">{{
                        condition.operator
                      }}</UBadge>
                    </td>
                    <td class="p-1">
                      <UBadge color="neutral" variant="subtle">{{
                        condition.value
                      }}</UBadge>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
        <div v-else>
          <p>No specific conditional logic for this field.</p>
        </div>
      </div>
      <div v-if="key === 'content' || key === 'fields'" class="flex gap-2 bg-white/[2.5%]">
        <div class="font-semibold min-w-30 p-1">{{ key }}</div>
        <div class="p-1 relative w-full">
          <div
            class="truncated-text text-xs w-full flex flex-col items-start gap-1"
          >
            <UBadge color="neutral" variant="subtle"
              >Child items: {{ value.length }}</UBadge
            >
            {{
              JSON.stringify(value || "").slice(0, 100) +
              (JSON.stringify(value || "").length > 100 ? "..." : "")
            }}
          </div>
        </div>
      </div>
      <div v-else class="flex gap-2 bg-white/[2.5%]">
        <div class="font-semibold min-w-30 p-1">{{ key }}</div>
        <div class="p-1">
          <UBadge color="neutral" variant="subtle">{{ value || "-" }}</UBadge>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
  fieldData: Record<string, any> | null;
}>();
</script>

<style scoped></style>
