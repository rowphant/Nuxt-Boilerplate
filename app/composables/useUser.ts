export const useUser = () => {
  const user = useState("currentUser", () => null);

  const fetchUser = async () => {
    const { $apiFetch } = useNuxtApp();
    try {
      const data = await $apiFetch("/wp-json/wp/v2/users/me", {
        method: "POST",
      });
      user.value = data;
    } catch (e) {
      console.error("Fehler beim Laden des Benutzers", e);
      user.value = null;
    }
  };

  const updateUser = async (payload: Record<string, unknown>) => {
    const { $apiFetch } = useNuxtApp();
    const { user } = useUser();
    try {
      const data = await $apiFetch("/wp-json/wp/v2/users/me", {
        method: "POST", // bei WP meist POST für Update
        body: payload,
      });

      user.value = data; // Direkt aktualisieren
      return data;
    } catch (e) {
      console.error("Fehler beim Aktualisieren des Benutzers", e);
      return e;
    }
  };

  const clearUser = () => {
    user.value = null;
  };

  /**
   * Upload user image
   */
  const uploadUserImage = async (formData) => {
    const { $apiFetch } = useNuxtApp();

    try {
      const response = await $apiFetch("/wp-json/wp/v2/user-image", {
        method: "POST",
        body: formData,
      });

      return response;
    } catch (e) {
      console.error("Error uploading image:", e);
      return e;
    }
  };

  return { user, fetchUser, clearUser, updateUser, uploadUserImage };
};
