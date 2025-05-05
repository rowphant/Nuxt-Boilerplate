import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isLoggedIn: false,
    token: null,
    user: null,
    confirmed: null,
    // authenticated: false,
    loading: null,
    details: {
      id: null,
      username: null,
      name: null,
      first_name: null,
      last_name: null,
      email: null,
      description: null,
      locale: null,
      nickname: null,
      slug: null,
      roles: null,
      registered_date: null,
      capabilities: null,
      extra_capabilities: null,
      avatar_urls: null,
    },
  }),

  actions: {
    async login(username, password) {
      const { $config } = useNuxtApp();
      const apiBase = $config.public.apiBase;
      const response = await fetch(
        apiBase + "/wp-json/jwt-auth/v1/token",
        {
          method: "POST",
          body: JSON.stringify({
            username,
            password,
          }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      localStorage.removeItem("token");

      if (response.ok) {
        const data = await response.json();

        this.isLoggedIn = true;
        this.token = data.token;
        this.user = data.user_display_name;
        localStorage.setItem("token", data.token);

        await this.getUserDetails();
      }
    },

    async getUserDetails() {
      const { $config } = useNuxtApp();
      const apiBase = $config.public.apiBase;
      const token = localStorage.getItem("token");
      const fields = [
        "id",
        "username",
        "name",
        "first_name",
        "last_name",
        "email",
        "description",
        "locale",
        "nickname",
        "slug",
        "roles",
        "registered_date",
        "capabilities",
        "extra_capabilities",
        "avatar_urls",
      ];

      if (token) {
        const response = await $fetch(
          `${apiBase}/wp-json/wp/v2/users/me?${fields
            .map((field) => `_fields[]=${field}`)
            .join("&")}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.id) {
          this.details = response;
        }
      }
    },

    async updateUserDetails(user) {
      this.loading = true;
      const { $config } = useNuxtApp();
      const apiBase = $config.public.apiBase;
      const token = localStorage.getItem("token");
      try {
        const response = await $fetch(
          `${apiBase}/wp-json/wp/v2/users/${user.id}`,
          {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response?.id) {
          this.details = response;
        }
        this.loading = false;

        return response;
      } catch (error) {
        this.loading = false;
        return error.data;
      }
    },

    async logout() {
      console.log("logging out");
      this.isLoggedIn = false;
      this.token = null;
      this.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigateTo("/");
    },

    async validateUser() {
      this.loading = true;
      const { $config } = useNuxtApp();
      const apiBase = $config.public.apiBase;
      const token = localStorage.getItem("token");

      if (token) {
        const response = await $fetch(
          apiBase + "/wp-json/jwt-auth/v1/token/validate",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response?.data?.status === 200) {
          this.isLoggedIn = true;
          this.token = token;

          await this.getUserDetails();
        } else {
          console.error("Error logging in:", response.status);
          this.logout();
        }

        this.loading = false;
      } else {
        this.isLoggedIn = false;
        this.token = false;
        this.loading = false;
      }
    },
    
    async register(username, email, password) {
      this.loading = true;
      const { $config } = useNuxtApp();
      const apiBase = $config.public.apiBase;

      try {
        const response = await $fetch(
          apiBase + "/wp-json/wp/v2/users/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username,
              email,
              password,
            }),
          }
        );

        if (response.id) {
          await this.login(username, password);
        }

        this.loading = false;

        return response;
      } catch (error) {
        this.loading = false;
        return error.data;
      }
    },
  },
});
