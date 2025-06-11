export default defineNuxtRouteMiddleware(async (to, from) => {
  const globalStore = useGlobalStore();
  if (!globalStore.settings) {
    // console.log("Fetching Settings...");
    await globalStore.getSettings();
  }

  // Fetch Wordpress Data
  const { wordpress, fetchWordpressData } = useWordpress();
  if (!wordpress.value) {
    // console.log("Fetching Wordpress Data...");
    await fetchWordpressData();
  }

  useHead({
    title: useGlobals().siteName,
    // meta: [
    //   {
    //     name: "description",
    //     content: wordpress.value?.description.replace(
    //       /(<([^>]+)>)/gi,
    //       ""
    //     ),
    //   },
    // ],
  });
});
