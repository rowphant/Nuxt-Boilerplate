import { defineStore } from "pinia";

export const useGlobalStore = defineStore("global", {
  state: () => ({
    settings: null,
  }),

  actions: {
    async getSettings(username, password) {
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

      return data;
    },
  },
});
