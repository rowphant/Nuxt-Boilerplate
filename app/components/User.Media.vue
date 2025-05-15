<template>
  <div class="flex flex-col gap-4">
    <div v-if="loading" class="place-self-center">
      <LoadingIndicator />
    </div>
    <div v-else>
      <div
        class="grid gap-4 grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(150px,1fr))]"
      >
        <UButton
          color="neutral"
          variant="outline"
          class="rounded-md overflow-hidden aspect-square flex flex-col gap-2 justify-center items-center cursor-pointer"
          @click="$refs.fileInput.click()"
        >
          <div class="flex flex-col gap-2 items-center">
            <Icon name="heroicons:arrow-up-tray-20-solid" class="size-5" />
            Upload files
          </div>

          <!-- Input field for file upload -->
          <input
            :disabled="loading"
            type="file"
            accept="image/x-png,image/jpeg"
            class="hidden"
            ref="fileInput"
            @change="selectFilesHandler"
          />
        </UButton>
        <UButton
          v-for="(file, index) in uploadFiles"
          :key="file.name"
          :disabled="true"
          :loading="uploading && !file.data?.id && !file.error"
          :icon="
            file.data?.id
              ? 'material-symbols:check-rounded'
              : file.error
              ? 'material-symbols:error-rounded'
              : null
          "
          :color="file.data?.id ? 'success' : file.error ? 'error' : 'neutral'"
          variant="subtle"
          :class="[
            'bg-center bg-cover rounded-md overflow-hidden relative aspect-square flex flex-col gap-2 justify-center items-center cursor-pointer',
            file.data?.id ? 'border-info border' : '',
          ]"
          @click="addToSelectedFiles(file)"
          :style="{
            backgroundImage: file.data?.id
              ? `url(${file.data.sizes.medium.url})`
              : '',
          }"
        >
          <div>
            <div v-if="file.error" class="text-xs">
              {{ file.error.data.message }}
            </div>
          </div>
        </UButton>
        <div
          v-if="libraryFiles.length === 0"
          class="text-center text-gray-500 col-span-full"
        >
          No files found in the media library.
        </div>
        <UButton
          variant="outline"
          color="neutral"
          v-if="libraryFiles.length > 0"
          v-for="file in libraryFiles"
          :key="file.id"
          :class="[
            'p-0 rounded-lg overflow-hidden relative aspect-square bg-center bg-cover cursor-pointer transition-all',
            selectedFiles.includes(file) || props.selectedFiles.map((f) => f.id).includes(file.id)
              ? 'inset-ring-2 inset-ring-primary'
              : 'inset-ring-0',
          ]"
          @click="addToSelectedFiles(file)"
          :style="{
            backgroundImage: `url(${file.media_details.sizes.medium.source_url})`,
          }"
        >
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import LoadingIndicator from "~/components/LoadingIndicator.vue";

const props = defineProps({
  onSelect: {
    type: Function,
    default: () => {},
  },
  selectedFiles: {
    type: Array,
    default: () => [],
  },
});

const { user, uploadUserImage } = useUser();
const fileInput = ref();
const uploadFiles = ref<File[]>([]);
const uploadedFilesCount = ref(0);
const libraryFiles = ref<File[]>([]);
const selectedFiles = ref<File[]>([]);
const loading = ref(false);
const uploading = ref(false);

const getMedia = async () => {
  loading.value = true;

  const { $config, $apiFetch } = useNuxtApp();
  const apiBase = $config.public.apiBase;
  console.log("user: ", user.value);

  try {
    const response = await $apiFetch(
      `/wp-json/wp/v2/media?author=${user.value.id}`
    );
    
    libraryFiles.value = response;
  } catch (error) {
    console.error("Error fetching media:", error);
  } finally {
    loading.value = false;
  }
};

const selectFilesHandler = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const filesArray = Array.from(target.files);
    uploadFiles.value = [...uploadFiles.value, ...filesArray];
    console.log("uploadFiles:", uploadFiles.value);

    // Upload files
    await uploadHandler();
  }
};

const uploadHandler = async () => {
  console.log("uploadHandler");

  uploading.value = true;

  for (
    let index = uploadedFilesCount.value;
    index < uploadFiles.value.length;
    index++
  ) {
    console.log("index: ", index);
    const file = uploadFiles.value[index];
    const formData = new FormData();
    // formData.append("async-upload", fileInput.value.files[index]);
    formData.append("async-upload", uploadFiles.value[index]);

    const data = await uploadUserImage(formData);

    console.log("data: ", data);

    if (data.id) {
      //   uploadFiles.value[index].data = {...data};
      uploadFiles.value[index] = {
        ...uploadFiles.value[index],
        data: data,
      };
    } else {
      //   uploadFiles.value[index].error = {...data};
      uploadFiles.value[index] = {
        ...uploadFiles.value[index],
        error: data,
      };
    }

    uploadedFilesCount.value++;
  }

  //   fileInput.value.value = null;
  uploading.value = false;
};

const addToSelectedFiles = (file: File) => {
  const multiple = false; // Set to true if you want to allow multiple selections

  const fileExists = selectedFiles.value.some((f) => f.id === file.id);

  // Check if the file is already selected
  if (!fileExists) {
    if (!multiple) {
      selectedFiles.value = [];
    }
    selectedFiles.value.push(file);
  } else {
    console.log("File already selected");
    // If already selected, remove it
    selectedFiles.value = selectedFiles.value.filter((f) => f !== file);
  }

  props.onSelect(selectedFiles.value);
};

onMounted(() => {
  getMedia();
});
</script>
