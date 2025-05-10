<template>
  <div class="relative flex flex-col gap-2">
    <div class="rounded-md overflow-hidden w-50 border">
      <img
        class="cursor-pointer rounded-md overflow-hidden aspect-square object-cover w-full"
        :src="selectedFiles?.[0] || authStore.user.profile_image?.sizes?.medium || authStore.user.avatar_urls?.['96']"
      />
      <div
      v-if="fileInput?.files?.[0]?.uploaded"
        class="w-10 h-10 rounded-full bg-success text-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex place-items-center place-content-center"
      >
        <UIcon name="material-symbols:check-rounded" class="size-5" />
      </div>
    </div>
    <div class="p-2 w-full absolute bottom-0 flex justify-end gap-2">
      <!-- <UButtonGroup class="gap-1 w-full"> -->
      <UTooltip :delay-duration="0" text="Select new image">
        <UButton
          class="cursor-pointer rounded-full ring-1"
          color="neutral"
          icon="material-symbols:edit-outline-rounded"
          aria-label="Edit image"
          name="edit"
          @click="uploadButtonHandler"
        />
      </UTooltip>
      <UTooltip
        :delay-duration="0"
        text="Delete current image"
        v-if="authStore.user.profile_image"
      >
        <UButton
          class="cursor-pointer rounded-full text-error ring-1"
          color="neutral"
          icon="material-symbols:delete-outline"
          aria-label="Delete image"
        />
      </UTooltip>
      <UTooltip :delay-duration="0" text="Reset selection" v-if="selectedFiles">
        <UButton
          class="cursor-pointer rounded-full ring-1"
          color="neutral"
          icon="material-symbols:reset-image"
          aria-label="Delete image"
          @click="resetFiles"
        />
      </UTooltip>
      <UTooltip :delay-duration="0" text="Save selection" v-if="selectedFiles">
        <UButton
          class="cursor-pointer rounded-full ring-1 ring-success-700"
          color="success"
          icon="material-symbols:check-rounded"
          aria-label="Save selection"
          @click="onSubmitHandler"
          :loading="loading"
        />
      </UTooltip>

      <input
        :multiple="multiple"
        :disabled="loading"
        type="file"
        accept="image/x-png,image/jpeg"
        class="hidden"
        ref="fileInput"
        @change="selectFilesHandler"
      />
      <!-- </UButtonGroup> -->
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();

const props = defineProps({
  loading: { type: Boolean, default: false },
  multiple: { type: Boolean, default: true },
  uploadedFiles: { type: Array, default: () => [] },
});

const fileInput = ref();
const selectedFiles = ref();
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

const selectFilesHandler = async (event) => {
  selectedFiles.value = await getBase64Urls(event.target);
};

const resetFiles = () => {
  selectedFiles.value = null;
  fileInput.value.value = "";
};

const uploadButtonHandler = () => {
  fileInput.value.click();
};

const onSubmitHandler = async () => {
  let index = 0;
  loading.value = true;

  for (const file of fileInput.value.files) {
    const formData = new FormData();
    formData.append("async-upload", fileInput.value.files[index]);

    const data = await authStore.uploadUserImage(formData);

    if (data.id) {
      fileInput.value.files[index].uploaded = true;
      const updateUser = await authStore.updateUserDetails({profile_image: data.id});
      console.log("updateUser: ", updateUser);
    } else {
      fileInput.value.files[index].uploaded = false;
    }

    index++;
  }

  // await authStore.validateUser();
  loading.value = false;

  // console.log(fileInput.value.files);
  // resetFiles();
};
</script>
