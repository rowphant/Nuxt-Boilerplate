export const useAuth = () => {
  const authToken = useCookie("authToken", { path: "/" });
  const isAuthenticated = computed(
    async () => !!authToken.value && (await validateToken())
  );

  // Auto-Init: Fallback for Client, if Cookie is lost
  if (process.client && !authToken.value) {
    const tokenFromStorage = localStorage.getItem("authToken");
    if (tokenFromStorage) {
      authToken.value = tokenFromStorage;
    }
  }

  const login = async (username: string, password: string) => {
    const { $apiFetch } = useNuxtApp();

    const data = await $apiFetch("/wp-json/jwt-auth/v1/token", {
      method: "POST",
      body: { username, password },
    });

    authToken.value = data.token;

    if (process.client) {
      localStorage.setItem("authToken", data.token);
    }
  };

  const logout = () => {
    const { user } = useUser();
    authToken.value = null;
    if (process.client) {
      localStorage.removeItem("authToken");
    }
    navigateTo("/login");
    user.value = null;
  };

  const validateToken = async () => {
    const { $apiFetch } = useNuxtApp();

    try {
      const response = await $apiFetch("/wp-json/jwt-auth/v1/token/validate", {
        method: "POST",
      });

      return response;
    } catch (error) {
      console.error("Error validating token:", error);
      return error;
    }
  };

  const register = async (
    username: String,
    email: String,
    password: String
  ) => {
    const { $apiFetch } = useNuxtApp();

    try {
      const response = await $apiFetch("/wp-json/wp/v2/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      return response;
    } catch (error) {
      return error;
    }
  };

  const confirmUser = async (authCode: String) => {
    const { $apiFetch } = useNuxtApp();
    try {
      const response = await $apiFetch("/wp-json/wp/v2/confirm-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: authCode }),
      });

      return response;
    } catch (e) {
      console.error("Error confirming user:", e);
      return e;
    }
  };

  return { authToken, isAuthenticated, login, logout, validateToken, register, confirmUser };
};
