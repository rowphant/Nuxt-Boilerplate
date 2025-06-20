<template>
  <div class="rounded border border-muted/50 p-4 text-sm">
    <ul class="flex gap-2 items-center">
      <li class="w-3/12">
        <h4 class="font-semibold">{{ post?.title.rendered }}</h4>
      </li>
      <li class="w-3/12 relative">
        <div v-html="post?.excerpt?.rendered" class="truncated-text" />
      </li>
      <li v-if="post.status">
        <div class="flex gap-1">
          <UBadge v-if="post.status === 'publish'" color="success" variant="subtle">
            Published
          </UBadge>
          <UBadge v-else="post.status === 'draft'" color="info" variant="subtle">
            Draft
          </UBadge>
          <UBadge v-else color="neutral" variant="subtle">
            {{ post.status }}
          </UBadge>
        </div>
      </li>
      <li class="grow"></li>
      <li v-if="user?.roles.includes('administrator')" class="">
        <PostEditModal :post="post" />
      </li>
      <!-- {{ post }} -->
    </ul>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';

const props = defineProps({
  post: Object,
});
const { user } = useUser();

// console.log("post: ", props.post);

</script>

<style scoped>
.truncated-text > * {
  white-space: nowrap; /* Verhindert Zeilenumbruch */
  overflow: hidden; /* Versteckt überlaufenden Inhalt */
  text-overflow: ellipsis; /* Fügt "..." hinzu */
  display: -webkit-box; /* **MUSS DA SEIN** */
  -webkit-box-orient: vertical; /* **MUSS DA SEIN** */
  -webkit-line-clamp: 3; /* **MUSS DA SEIN** (Anzahl der Zeilen) */
  line-height: 1.2em; /* Stelle sicher, dass dies zur line-height deines Textes passt */
  max-height: calc(3 * 1.2em);
  margin: 0; /* Entfernt Standard-Margin von p */
  display: block;
}
</style>
