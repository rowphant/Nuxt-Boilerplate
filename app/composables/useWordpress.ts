export const useWordpress = () => {
  const wordpress = useState<any | null>("wordpress", () => null);
  const postTypes = useState<any | null>("postTypes", () => null);

  // Fetch Wordpress options for headless use
  const fetchWordpressData = async () => {
    const { $apiFetch } = useNuxtApp();

    try {
      const data = await $apiFetch("/wp-json", {
        method: "GET",
        authOff: true,
      });
      wordpress.value = data;
    } catch (e) {
      console.error("Fehler beim Laden von Wordpress", e);
    }
  };

  const fetchWpTypes = async () => {
    const { $apiFetch } = useNuxtApp();
    try {
      const data = await $apiFetch("/wp-json/wp/v2/types", {
        method: "GET",
      });
      postTypes.value = data;
    } catch (e) {
      console.error("Fehler beim Laden der Posttypen", e);
    }
  };

  const fetchWpPost = async (
    props: { postType?: string; slug?: string } = {}
  ) => {
    const params = useRoute().params.wp_posts || [];

    const postType = ref(
      props.postType || (!props.postType && params.length > 1)
        ? params?.[0]
        : "pages"
    );
    const slug = ref(
      props.slug || (!props.slug && params.length > 1)
        ? params?.[1]
        : params?.[0]
    );

    if (!slug) {
      return "No slug given";
    }

    try {
      const { $apiFetch } = useNuxtApp();
      const data = (await $apiFetch(
        "/wp-json/wp/v2/" + postType.value + "?slug=" + slug.value,
        {
          method: "GET",
        }
      )) as any[];

      const post = data[0];

      return post;
    } catch (e) {
      console.error("Fehler beim Laden der Posts", e);
      return e;
    }
  };

  return {
    wordpress,
    postTypes,
    fetchWordpressData,
    fetchWpTypes,
    fetchWpPost,
  };
};
