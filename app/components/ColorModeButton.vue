<script setup>
const colorMode = useColorMode()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set(_isDark) {
    colorMode.preference = _isDark ? 'dark' : 'light'
  }
})
</script>

<template>
  <ClientOnly v-if="!colorMode?.forced">
    <UButton
      :icon="isDark ? 'i-lucide-sun' : 'i-lucide-moon'"
      color="neutral"
      variant="outline"
      :square="true"
      class="w-10 h-10 rounded-full cursor-pointer place-items-center place-content-center"
      @click="isDark = !isDark"
    />

    <template #fallback>
      <div class="size-8 aspect-square" />
    </template>
  </ClientOnly>
</template>
