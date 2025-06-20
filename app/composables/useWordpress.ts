import { useState } from "#app"; // Wichtig: useState aus Nuxt importieren

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
      const data = await $apiFetch("/wp-json/wp/v2/public-types", {
        method: "GET",
        // authOff: true,
      });
      // console.log("Fetched raw WP Types data:", data); // Debugging
      // Wichtig: Rückgabe der Daten an useAsyncData
      return data;
    } catch (e) {
      console.error("Fehler beim Laden der Posttypen", e);
      // Im Fehlerfall ein leeres Objekt zurückgeben, um Map-Fehler zu vermeiden
      return {};
    }
  };

  const fetchWpPost = async (
    config: { postType?: string; slug?: string } = {}
  ) => {
    // console.log("config: ", config);
    const postType = config?.postType || "pages"; // Standard auf 'pages' gesetzt
    const slug = config?.slug;

    const url = `/wp-json/wp/v2/${postType}${slug ? `?slug=${slug}` : ""}`;

    try {
      // console.log("fetching post...", url);
      const { $apiFetch } = useNuxtApp();
      const data = (await $apiFetch(url, {
        method: "GET",
      })) as any[];

      return data;
    } catch (e) {
      console.error("Fehler beim Laden der Posts", e);
      // return e; // Fehler werfen, damit useAsyncData ihn fangen kann
      throw e; // Besser: Fehler werfen, damit useAsyncData ihn in `error` ablegen kann
    }
  };

  const fetchWpPosts = async (
    postType: string,
    params?: [string, string][]
  ) => {
    const { $apiFetch } = useNuxtApp();
    const queryString = params
      ? params
          .map(
            (param) =>
              `${encodeURIComponent(param[0])}=${encodeURIComponent(
                param[1]
              )}`
          )
          .join("&")
      : "";
          
    try {
      const data = await $apiFetch(
        `/wp-json/wp/v2/${postType}${queryString ? "?" + queryString : ""}`,
        {
          method: "GET",
        }
      );
      // const totalPosts = data.headers.get("X-WP-Total");
      // console.log("Posts total:", data);
      return data;
    } catch (e) {
      console.error(`Fehler beim Laden der Posts für Typ "${postType}"`, e);
      throw e;
    }
  };

  // NEU: Funktion für die Textsuche
  const searchWpPosts = async (searchTerm: string, postType?: string) => {
    const { $apiFetch } = useNuxtApp();
    try {
      const data = await $apiFetch(
        `/wp-json/wp/v2/search?search=${encodeURIComponent(
          searchTerm
        )}&subtype=${postType}`,
        {
          method: "GET",
        }
      );
      // Die Suchergebnisse von Wordpress sind oft anders strukturiert (title, url, id).
      // Du musst sie möglicherweise hier oder in der aufrufenden Komponente
      // an das Format deiner PostListItem-Komponente anpassen.
      // Hier ein Beispiel, wie du die Daten umwandeln könntest, wenn sie nicht direkt passen:
      return data.map((item: any) => ({
        id: item.id,
        title: { rendered: item.title }, // Angepasst an `post.title.rendered`
        link: item.url, // Je nachdem, was PostListItem benötigt
        // ... weitere Eigenschaften, die du von PostListItem erwartest
        // Du musst hier ggf. die API-Antwort anpassen, da die Suche anders ist
        // Beispiel: Wenn PostListItem {id, title, excerpt} erwartet:
        // excerpt: { rendered: '...' } // Die Suche liefert oft keine Excerpts
      }));
    } catch (e) {
      console.error(`Fehler bei der Textsuche nach "${searchTerm}"`, e);
      throw e; // Fehler werfen
    }
  };

  const getAcfFields = async (postType: string, fieldGroupKey: string) => {
    const { $apiFetch } = useNuxtApp();
    try {
    const response = await $apiFetch(
      `/wp-json/wp/v2/acf-fields/post-type/${postType}?field_group_key=${fieldGroupKey || ''}`,
      {
        method: "GET",
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching conditional logic:", error);
  }
  };

  return {
    wordpress,
    postTypes,
    fetchWordpressData,
    fetchWpTypes,
    fetchWpPost,
    fetchWpPosts,
    searchWpPosts,
    getAcfFields
  };
};
