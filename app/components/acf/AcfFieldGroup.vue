<template>
  <div
    v-if="acfFieldGroup?.active"
    class="rounded-lg border border-muted/50 p-4 flex flex-col items-start gap-4"
  >
    <div>
      <div class="text-muted text-sm">Group</div>
      <div
        color="neutral"
        variant="ghost"
        class="text-2xl flex flex-col items-start gap-0"
      >
        {{ acfFieldGroup.title }}
      </div>
    </div>
    <!-- <ConditionalLogicDetails :fieldData="acfFieldGroup" /> -->
    <div class="w-full">
      <AcfFields
        :logic="acfFieldGroup"
        :fields="post.acf"
        :callback="acfFieldsCallback"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import ConditionalLogicDetails from './ConditionalLogic.Details.vue';
defineProps({
  acfFieldGroup: Object,
  post: Object,
  acfFieldsCallback: Function,
})
</script>
