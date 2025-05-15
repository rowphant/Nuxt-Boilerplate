import { defineStore } from "pinia";

export const useGlobalStore = defineStore("global", {
  state: () => ({
    loading: null,
    settings: null,
  }),

  actions: {
    async getSettings(username, password) {
      console.log("Fetching settings...");
      this.loading = true;
      const { $config } = useNuxtApp();
      const apiBase = $config.public.apiBase;
      const response = await fetch(apiBase + "/wp-json/headless-wp/v1/options", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        this.settings = data;
      }

      this.loading = false;
      return data;
    },
  },
});
