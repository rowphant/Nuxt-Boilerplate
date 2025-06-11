<template>
  <div class="">
    <UInput
      v-model="searchTerm"
      icon="i-lucide-search"
      placeholder="Suche nach Gruppen..."
      variant="outline"
      size="xl"
      class="mb-4 w-full font-light"
      :ui="{ base: 'py-4' }"
      :loading="loading"
      :disabled="loading"
    />

    <div v-if="loading" class="flex justify-center py-4">
      <UProgress animation="carousel" />
    </div>

    <div
      v-else-if="groups.length > 0"
      class="space-y-2 max-h-80 overflow-y-auto"
    >
      <div
        v-for="group in groups"
        :key="group.id"
        class="rounded-lg p-4 border border-(--ui-border) bg-navbar/20"
      >
        <UserGroupsSearchItem :group="group" />
      </div>
    </div>

    <div
      v-else-if="searchTerm.length >= 2 && !loading"
      class="py-4 text-center text-gray-500"
    >
      No groups found for "{{ searchTerm }}".
    </div>

    <div
      v-else-if="searchTerm.length > 0 && searchTerm.length < 2 && !loading"
      class="py-4 text-center text-gray-500"
    >
      Type at least 2 characters to search for groups.
    </div>

    <div v-else class="py-4 text-center text-gray-500">
      Start typing to search for groups.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useDebounceFn } from "@vueuse/core";
import UserGroupsSearchItem from "./User.Groups.Search.Item.vue";

// Suchbegriff, der an das Eingabefeld gebunden ist
const searchTerm = ref("");
// Gefundene Gruppen
const groups = ref<Array<any>>([]);
// Ladezustand
const loading = ref(false);

// Debounce-Funktion für die Suche
const debouncedSearch = useDebounceFn(async () => {
  if (searchTerm.value.length < 2) {
    // Mindestens 2 Zeichen für die Suche
    groups.value = [];
    loading.value = false;
    return;
  }

  loading.value = true;
  try {
    const { searchGroups } = useUserGroups();

    const response = await searchGroups(searchTerm.value);
    const data = response;
    console.log(data);
    groups.value = data;
  } catch (error) {
    console.error("Fehler beim Abrufen der Gruppen:", error);
    groups.value = [];
  } finally {
    loading.value = false;
  }
}, 500); // 0.5 Sekunden Verzögerung

// Überwache Änderungen am Suchbegriff und starte die debounced Suche
watch(searchTerm, () => {
  debouncedSearch();
});
</script>
