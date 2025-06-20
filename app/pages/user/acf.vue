<template>
  <div class="acf-conditional-logic">
    <h2 class="text-primary text-xl">Advanced Custom Fields</h2>
    <AcfFields :logic="logic" :postType="postType"/>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import AcfFields from "@/components/acf/AcfFields.vue";

const route = useRoute();
const postType = ref(route.query.postType as string);
const logic = ref<any[]>([]);
const fieldGroupKey = 'group_640cb78342fea';

const fetchCL = async () => {
  // console.log("Fetching conditional logic for post type:", postType.value);
  try {
    const response = await $fetch(
      // `http://localhost:8181/wp-json/wp/v2/acf-conditional-logic/post-type/${postType.value}`,
      `http://localhost:8181/wp-json/wp/v2/acf-fields/post-type/${postType.value}?field_group_key=${fieldGroupKey}`,
      {
        method: "GET",
      }
    );
    return response?.[fieldGroupKey];
  } catch (error) {
    console.error("Error fetching conditional logic:", error);
  }
};

const fetchLogic = await fetchCL();
if (fetchLogic) {
  logic.value = fetchLogic;
}

// Prüfen, ob das Objekt leer ist
if (Object.keys(logic.value).length === 0) {
  console.warn("No conditional logic found for post type:", postType.value);
}
</script>
