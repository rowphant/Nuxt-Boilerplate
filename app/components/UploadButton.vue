<template>
  <div class="w-full">
    <div
      v-if="props.loading"
      class="w-full h-full aspect-square bg-slate-800 btn-ghost p-2 border border-dashed border-neutral-500 flex flex-col justify-center items-center text-center rounded-md"
    >
      <span className="loading loading-spinner loading-lg"></span>
      <div>Files are beeing uploaded...</div>
    </div>
    <button
      v-if="!selectedFiles && !loading"
      :class="`btn bg-slate-800 btn-ghost p-2 w-full h-full aspect-square rounded-md border border-dashed border-neutral-500 hover:border-primary focus:border-primary focus:outline-none overflow-hidden`"
      @click="uploadButtonHandler"
    >
      <div class="flex flex-col items-center gap-6">
        <div class="flex flex-col items-center gap-2">
          <!-- <ArrowUpTrayIcon class="h-5 w-5" aria-hidden="true" /> -->
          <span class="font-light text-sm">Select files<br />to upload</span>
        </div>
      </div>
    </button>
    <div
      v-if="selectedFiles && !loading"
      :class="`p-4 btn_ rounded-btn bg-slate-800 p-1 w-full h-full aspect-square border border-dashed border-neutral-500 hover:border-primary focus:border-primary focus:outline-none overflow-hidden`"
    >
      <div
        class="w-full flex flex-col items-center justify-center gap-2 h-full"
      >
        <div class="font-light">
          {{ selectedFiles.length }}
          {{ selectedFiles.length == 1 ? "file" : "files" }} selected
        </div>
        <ul
          class="flex flex-row gap-1 p-1 rounded-full_ bg-slate-900 overflow-hidden join"
        >
          <li
            v-for="(file, index) in selectedFiles.slice(0, 3)"
            class="join-item"
          >
            <img :src="file" class="w-10_ h-10 rounded-full_ object-cover" />
          </li>
          <li v-if="selectedFiles.length > 2">
            <div class="w-6 h-10 rounded-full flex justify-center items-center">
              ...
            </div>
          </li>
        </ul>
        <div class="flex flex-row gap-1 join w-full">
          <UButton
            @click="onSubmitHandler"
            class="flex-grow join-item btn btn-outline_ btn-success btn-circle font-normal"
            aria-label="Upload files"
            variant="subtle"
            >Upload
          </UButton>
          <UButton
            @click="resetFiles"
            class="flex-grow join-item btn btn-outline_ btn-warning btn-circle font-normal"
            aria-label="Reset selection"
            variant="subtle"
            color="warning"
          >
            Reset
          </UButton>
        </div>
      </div>
    </div>
    <input
      multiple
      :disabled="loading"
      type="file"
      accept="image/x-png,image/jpeg"
      class="hidden"
      ref="fileInput"
      @change="selectFilesHandler"
    />
  </div>
</template>
<script setup>
import { ref } from "vue";
// import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/vue/20/solid";

const props = defineProps({
  submitHandler: { type: Function, default: () => {} },
  loading: { type: Boolean, default: false },
});

const fileInput = ref();
const selectedFiles = ref();

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
};

const uploadButtonHandler = () => {
  !selectedFiles.value && fileInput.value.click();
};

const onSubmitHandler = async () => {
  resetFiles();
  let index = 0;

  for (const file of fileInput.value.files) {
    const formData = new FormData();
    formData.append("async-upload", fileInput.value.files[index]);

    const data = await props.submitHandler(formData);

    console.log(fileInput.value.files);

    index++;
  }
};
</script>
