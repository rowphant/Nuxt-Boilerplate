<template>
  <div class="min-h-screen place-items-center place-content-center">
    <div class="place-items-center place-content-center text-center">
      <div class="font-light text-xl">Oopsie!</div>
      <div class="text-8xl text-accent font-bold my-4">
        Error {{ props.error?.statusCode }}
      </div>
      <div class="text-3xl font-light text-center">
        The site you're looking for<br />is not available.
      </div>
      <div class="font-light opacity-50">Go out and read a book.</div>
      <div class="w-full">
        <div class="border p-6 mt-8 rounded-lg w-full">
          <pre class=""><code class="px-8 w-full text-xs whitespace-pre-wrap">{{props.error?.message}}</code></pre>
        </div>
      </div>
      <!-- <div class="pt-4">
      <ThemeSwitch />
    </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps({
  error: Object as () => NuxtError,
});

console.log(props.error);
</script>
