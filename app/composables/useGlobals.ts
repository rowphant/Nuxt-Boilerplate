export function useGlobals() {
  const runtimeConfig = useRuntimeConfig();
  const { wordpress } = useWordpress();
  const siteName = ref(runtimeConfig.public.siteName || wordpress.value.name || 'Nuxt Boilerplate');

  return {
    siteName,
    wordpress,
  };
}
