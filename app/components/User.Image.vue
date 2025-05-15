<template>
  <div class="max-w-48 relative flex flex-col gap-2 w-full">
    <UButton
      class="relative overflow-hidden border p-0_ cursor-pointer aspect-square flex flex-col justify-center items-center w-full"
      :loading="loading"
      :color="
        !loading && selectedFiles.length === 1 && selectedFiles[0].error
          ? 'error'
          : 'neutral'
      "
      variant="outline"
    >
      <div v-if="loading">Uploading file</div>
      <div v-if="!loading && selectedFiles.length === 1">
        <div v-if="selectedFiles[0].error">
          <div class="text-sm">
            {{ selectedFiles[0].error.data.message }}
          </div>
        </div>
      </div>
      <!-- {{ previewImage.media_details.sizes.medium.source_url }} -->
      {{ selectedFiles.length }}
      <img
        v-if="
          !loading && (mediaLibrary || (!selectedFiles.length && !mediaLibrary))
        "
        class="absolute top-0 left-0 z-[-1]_ aspect-square object-cover w-full"
        :src="
          previewImage?.media_details.sizes?.medium?.source_url ||
          user.profile_image?.sizes?.medium ||
          user.avatar_urls?.['96']
        "
      />

      <!-- <div
        v-if="fileInput?.files?.[0]?.uploaded"
        class="w-10 h-10 rounded-full bg-success text-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex place-items-center place-content-center"
      >
        <UIcon name="material-symbols:check-rounded" class="size-5" />
      </div> -->
    </UButton>
    <div class="p-2 w-full absolute bottom-0 flex justify-end gap-2">
      <!-- <UButtonGroup class="gap-1 w-full"> -->
      <UModal
        v-if="mediaLibrary"
        fullscreen_
        title="Select image from media library"
        description="Select an existing image from the media library or upload a new one."
        :overlay="true"
        :ui="{ content: 'md:max-w-6xl' }"
        v-model:open="modalOpen"
      >
        <UTooltip :delay-duration="0" text="Select new image">
          <UButton
            class="cursor-pointer rounded-full ring-1"
            color="neutral"
            icon="material-symbols:edit-outline-rounded"
            aria-label="Edit image"
            name="edit"
          />
        </UTooltip>
        <template #body>
          <UserMedia
            :onSelect="selectedFilesHandler"
            :selectedFiles="selectedFiles"
          />
        </template>
        <template #footer>
          <div class="flex justify-end w-full gap-2">
            <UButton
              @click="saveLibrarySelection"
              color="primary"
              class="cursor-pointer modal-close-button"
              :disabled="!selectedFiles.length"
              >Save</UButton
            >
          </div>
        </template>
      </UModal>

      <!-- Edit Image (without media library) -->
      <UTooltip v-else :delay-duration="0" text="Select new image">
        <UButton
          class="cursor-pointer rounded-full ring-1"
          color="neutral"
          icon="material-symbols:edit-outline-rounded"
          aria-label="Edit image"
          name="edit"
          @click="editImageHandler"
        />
      </UTooltip>

      <!-- Reset Image -->
      <UTooltip
        :delay-duration="0"
        text="Reset selection"
        v-if="selectedFiles.length"
      >
        <UButton
          class="cursor-pointer rounded-full ring-1"
          color="neutral"
          icon="material-symbols:reset-image"
          aria-label="Delete image"
          @click="resetFiles"
        />
      </UTooltip>

      <!-- Save Image -->
      <!-- <UTooltip
        :delay-duration="0"
        text="Save selection"
        v-if="selectedFiles.length"
      >
        <UButton
          class="cursor-pointer rounded-full ring-1 ring-success-700"
          color="success"
          icon="material-symbols:check-rounded"
          aria-label="Save selection"
          @click="onSubmitHandler"
          :loading="loading"
        />
      </UTooltip> -->

      <input
        :multiple="false"
        :disabled="loading"
        type="file"
        accept="image/x-png,image/jpeg"
        class="hidden"
        ref="fileInput"
        @change="onSubmitHandler"
      />
      <!-- </UButtonGroup> -->
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import UserMedia from "~/components/User.Media.vue";

const { user, uploadUserImage } = useUser();

const props = defineProps({
  loading: { type: Boolean, default: false },
  multiple: { type: Boolean, default: false },
  uploadedFiles: { type: Array, default: () => [] },
  mediaLibrary: { type: Boolean, default: false },
  changeImageCallback: { type: Function, default: () => {} },
});

const modalOpen = ref(false);
const fileInput = ref();
const selectedFiles = ref([]);
const previewImage = ref();
const loading = ref();

const getBase64Urls = async (fileInput) => {
  // Array für die Base64-URLs
  const base64Urls = [];

  // Prüfen, ob der File-Input-Element vorhanden ist
  if (!fileInput || !fileInput.files) {
    return base64Urls;
  }

  // Alle ausgewählten Dateien durchlaufen
  for (const file of fileInput.files) {
    // FileReader-Instanz erstellen
    const reader = new FileReader();

    // FileReader-Event-Handler für "onload" definieren
    reader.onload = function () {
      // Base64-codierte URL der Datei in das Array hinzufügen
      base64Urls.push(reader.result);
    };

    // Die Datei als Data-URL lesen
    reader.readAsDataURL(file);
  }

  // Promise zurückgeben, das das Array mit den Base64-URLs enthält
  return new Promise((resolve) => {
    // Sobald alle Dateien gelesen wurden, das Array mit den URLs zurückgeben
    setTimeout(() => resolve(base64Urls), 100);
  });
};

const selectedFilesHandler = (files) => {
  selectedFiles.value = files;
};

const resetFiles = () => {
  selectedFiles.value = [];
  fileInput.value.value = "";
};

const editImageHandler = () => {
  fileInput.value.click();
};

const onSubmitHandler = async () => {
  let index = 0;
  loading.value = true;

  for (const file of fileInput.value.files) {
    const formData = new FormData();
    formData.append("async-upload", fileInput.value.files[index]);

    const data = await uploadUserImage(formData);

    if (data.id) {
      selectedFiles.value[index] = {
        ...selectedFiles.value[index],
        data: data,
      };

      props.changeImageCallback(selectedFiles.value[0]);
    } else {
      selectedFiles.value[index] = {
        ...selectedFiles.value[index],
        error: data,
      };
    }

    index++;
  }

  loading.value = false;
};

const saveLibrarySelection = () => {
  previewImage.value = selectedFiles.value[0];
  props.changeImageCallback(selectedFiles.value[0]);
  closeModal();
};

const closeModal = () => {
  modalOpen.value = false;
};
</script>
