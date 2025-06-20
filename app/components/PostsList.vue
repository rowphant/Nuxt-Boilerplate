<template>
  <div class="container mx-auto p-4 flex flex-col gap-4">
    <h1 class="text-3xl font-bold">Wordpress Posts</h1>

    <div class="flex flex-col gap-1">
      <!-- Search bar -->
      <div class="flex flex-col gap-2 bg-(--color-navbar)/80 rounded-lg p-4">
        <div
          class="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center w-full"
        >
          <template v-if="typesPending">
            <USkeleton class="h-10 w-full" />
          </template>
          <template v-else-if="typesError">
            <p class="text-red-500 text-sm">
              Fehler beim Laden der Post-Typen.
            </p>
          </template>
          <template v-else-if="availablePostTypes.length > 0">
            <USelectMenu
              v-model="selectedPostType"
              :items="availablePostTypes"
              placeholder="Post-Typ auswählen"
              class="w-full md:w-60 grow"
              :loading="typesPending"
            />
          </template>
          <template v-else>
            <p class="text-gray-500 text-sm">Keine Post-Typen verfügbar.</p>
          </template>

          <UInput
            v-model="searchText"
            placeholder="Nach Titel und Inhalt suchen..."
            icon="i-heroicons-magnifying-glass"
            class="w-full md:w-80"
            @keydown.enter="handleSearch"
          />
          <UButton @click="handleSearch">Suchen</UButton>
        </div>

        <!-- Meta info -->
        <div
          v-if="postsMeta"
          class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between bg-navbar/50 rounded-lg text-xs text-muted/80"
        >
          <div class="flex flex-row gap-2">
            <div>
              Total results: {{ postsMeta.totalPosts || 0 }}
              {{ selectedPostType?.label }}
            </div>
          </div>
          <div class="flex flex-row gap-2" v-if="postsMeta.totalPosts">
            <div>Seite:</div>
            <div>
              {{ postsMeta.currentPage }} von
              {{ postsMeta.totalPages }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="flex justify-center items-center">
      <LoadingIndicator />
    </div>

    <!-- Error -->
    <div v-else-if="postsError" class="text-red-500 text-center py-8">
      <p>Fehler beim Laden der Beiträge: {{ postsError.message }}</p>
    </div>

    <!-- No results -->
    <div
      v-else-if="!posts || posts.length === 0"
      class="text-center py-8 text-gray-600"
    >
      <p>Keine Beiträge gefunden.</p>
    </div>

    <!-- Results -->
    <ul v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-2">
      <li v-for="post in posts.items" :key="post.id">
        <PostListItem :post="post" />
      </li>
    </ul>

    <!-- Pagination -->
    <div v-if="postsMeta && postsMeta.totalPages > 1" class="flex justify-end">
      <UPagination
        v-model="postsMeta.currentPage"
        :total="postsMeta.totalPages"
        :items-per-page="postsMeta.perPage"
        show-edges
        variant="link"
        @update:page="paginate($event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import PostListItem from "@/components/PostListItem.vue";
import LoadingIndicator from "@/components/LoadingIndicator.vue";

const { fetchWpTypes, fetchWpPosts, searchWpPosts } = useWordpress();

// --- Zustand für die Filter ---
// Wichtig: Initialisiere mit einem leeren String oder einem bekannten Standard-Slug (z.B. 'post')
// Wenn du 'post' als Initialwert nimmst, muss sichergestellt sein, dass 'post' IMMER existiert
// und zuerst in availablePostTypes erscheint, oder die `onSuccess` Logik das übernimmt.
const selectedPostType = ref<{
  label?: string;
  value?: string;
  icon?: string;
}>();
const searchText = ref<string>("");
const currentPage = ref(1);
const postsPerPage = 2;

// const paginate = (page: number) => {
//   console.log("paginate: ", page);
//   //   postsMeta.value.currentPage = page;
//   currentPage.value = page;
//   refreshPosts();
// };

// --- Post-Typen laden (für die Dropdown-Liste) ---
const {
  data: postTypesRawData,
  pending: typesPending,
  error: typesError,
} = await useAsyncData(
  "wp-post-types",
  async () => {
    const data = await fetchWpTypes();

    // Setze einen Standard-Post-Typ, z.B. 'post'
    if (!selectedPostType.value && data && data.post) {
      // Überprüfe ob 'post' existiert
      selectedPostType.value = { label: "Post", value: "post" };
    } else if (!selectedPostType.value && Object.values(data).length > 0) {
      // Fallback: Setze den ersten verfügbaren Typ als Standard
      const firstType: any = Object.values(data)[0];
      selectedPostType.value = { label: firstType.name, value: firstType.slug };
    }
    return data;
  },
  {
    default: () => ({}), // Stelle sicher, dass `posts` immer ein Array ist
    // Bei einem Fehler im Post-Fetch
    onError: (err) => {
      console.error("Fehler beim Laden der Posts in useAsyncData:", err);
    },
  }
);

// const postsMeta = computed(() => {
//   if (posts?.value) {
//     return {
//       perPage: 2,
//       totalPosts: posts?.value?.pagination?.totalPosts,
//       totalPages: posts?.value?.pagination?.totalPages,
//       currentPage: currentPage.value,
//     };
//   }
//   return {};
// });

// Verfügbare Post-Typen für die USelectMenu Komponente
const availablePostTypes = computed(() => {
  if (postTypesRawData.value) {
    const mappedTypes = Object.values(postTypesRawData.value || {}).map(
      (typeData: any) => {
        return {
          label: typeData.name,
          value: typeData.slug,
          icon: typeData.icon,
        };
      }
    );

    if (!selectedPostType.value) {
      selectedPostType.value = { label: "Post", value: "post" };
    }

    // console.log("Gemappte Post Types für UI:", mappedTypes);

    return mappedTypes;
  }
  console.log("postTypesRawData.value ist noch leer oder null.");
  return [];
});

// --- Posts laden (mit Filtern) ---
const {
  data: posts,
  pending,
  error: postsError,
  refresh: refreshPosts,
} = await useAsyncData(
  "wp-posts-filtered",
  async () => {
    const currentSearchText = searchText.value.trim();
    const currentPostTypeSlug = selectedPostType.value?.value;

    if (!currentPostTypeSlug && !currentSearchText) {
      console.log(
        "Kein Post-Typ ausgewählt und kein Suchtext. Keine Posts geladen."
      );
      return [];
    }

    if (!currentPostTypeSlug) {
      console.log("Kein Post-Typ ausgewählt. Keine Posts geladen.");
      return [];
    }

    console.log("postTypesRawData.value: ", postTypesRawData.value);

    try {
      const postsData = await fetchWpPosts(
        postTypesRawData.value[currentPostTypeSlug].rest_base,
        [
          ["page", currentPage.value.toString()],
          ["per_page", postsPerPage.toString()],
          ["search", currentSearchText],
        ]
      );

      return postsData;
    } catch (err) {
      // Fehlerbehandlung hier, falls fetchWpPosts selbst einen Fehler wirft
      console.error("Fehler beim Fetchen der Posts:", err);
      throw err; // Werfe den Fehler weiter, damit useAsyncData ihn fängt
    }
  },
  {
    watch: [selectedPostType, searchText, currentPage], // currentPage hier beobachten!
    default: () => null, // Stelle sicher, dass `posts` anfangs null oder ein leeres Objekt ist
    onError: (err) => {
      console.error("Fehler beim Laden der Posts in useAsyncData:", err);
    },
  }
);

// --- Pagination Meta Daten ---
// Diese computed Property kann jetzt auf `posts` zugreifen, da `posts` bereits definiert ist.
const postsMeta = computed(() => {
  // Sicherstellen, dass posts.value existiert und pagination-Daten hat
  if (posts.value && posts.value.pagination) {
    return {
      perPage: postsPerPage, // Basierend auf deiner postsPerPage Konstante
      totalPosts: Number(posts.value.pagination.totalPosts) || 0,
      totalPages: Number(posts.value.pagination.totalPages) || 0,
      currentPage: currentPage.value, // Verwende den steuernden Ref für die aktuelle Seite
    };
  }
  // Standardwerte, wenn posts.value oder pagination noch nicht verfügbar sind
  return {
    perPage: postsPerPage,
    totalPosts: 0,
    totalPages: 0,
    currentPage: currentPage.value,
  };
});

const paginate = (page: number) => {
  console.log("paginate: ", page);
  currentPage.value = page; // currentPage ist der Ref, der den neuen Fetch triggert
  // refreshPosts(); // Nicht nötig, da `currentPage` im `watch`-Array von `useAsyncData` ist
};

const handleSearch = () => {
  console.log("handleSearch aufgerufen.");
  currentPage.value = 1; // Setze die Seite bei neuer Suche/Filterung auf 1 zurück
  // refreshPosts(); // Nicht nötig, da `searchText` und `currentPage` im `watch`-Array sind
};
</script>
