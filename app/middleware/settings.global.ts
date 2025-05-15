export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log("Global Middleware for settings");
  const globalStore = useGlobalStore();

  if (!globalStore.settings) {
    await globalStore.getSettings();
  }
});
