<template>
<div>
    <UButton
        class="cursor-pointer rounded-full_"
        color="neutral"
        variant="subtle"
        icon="material-symbols:edit-square-outline-rounded"
        @click="openModal"
        />

        <UModal
    :title="post?.id ? 'Post: ' + post?.title?.rendered || post?.title || 'not title found' : 'Add post'"
    :overlay="true"
    :ui="{ content: 'md:max-w-4xl min-h-100' }"
    v-model:open="modal"
  >
    <template #body>
        <PostEditForm :post="post" :callback="modalCallback"/>
      </template>
      <template #footer>
            <div class="flex justify-end w-full gap-2">
              <UButton
                @click="() => {}"
                color="primary"
                class="cursor-pointer modal-close-button"
                :disabled="true"
                >Save post</UButton
              >
            </div>
          </template>
  </UModal>
</div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router'; // Import useRoute for accessing route parameters
import PostEditForm from '@/components/PostEditForm.vue';

const props = defineProps<{
    post?: any;
}>();

// console.log("props.post: ", props.post);
const modal = ref(false); // Reactive reference for modal visibility
const route = useRoute(); // Get the current route object

// console.log("props.post: ", props.post);
// Function to handle opening the modal via button click
const openModal = () => {
  // Use Nuxt's router to update the query parameter to 'edit=true'
  // This will trigger the watchEffect below to open the modal
  const nuxtApp = useNuxtApp();
  nuxtApp.$router.push({ query: { ...route.query, edit: 'true' } });
  modal.value = true;
  // The modal will now open automatically via the watch effect, no direct modal.value = true needed here
};

// Watch for changes in the 'edit' query parameter
// This effect runs immediately after component setup and whenever route.query.edit changes
watch(() => route.query.edit, (newEditValue) => {
  if (newEditValue === 'true') {
    modal.value = true; // Open the modal if 'edit' parameter is 'true'
  } else {
    modal.value = false; // Close the modal otherwise (e.g., if 'edit' is removed or set to something else)
  }
}, { immediate: true }); // 'immediate: true' makes it run on initial component load

watch(modal, (newModalValue) => {
  // If modal is closed (newModalValue is false) and 'edit' parameter is still present in URL
  if (!newModalValue && route.query.edit === 'true') {
    const nuxtApp = useNuxtApp();
    const newQuery = { ...route.query };
    delete newQuery.edit; // Remove the 'edit' parameter from the new query object
    // Use router.replace to update the URL without adding a new entry to the browser history
    nuxtApp.$router.replace({ query: newQuery });
  }
});

const modalCallback = (
  callbackData: {
    editedFields?: Record<string, { name: string; value: any; isEdited?: boolean }> | null;
  }
) => {
  // console.log("modal callback data: ", callbackData);
};
</script>