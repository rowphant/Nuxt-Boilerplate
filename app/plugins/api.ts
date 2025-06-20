import { useTokenName } from "./utils";

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig();
  const tokenName = useTokenName();

  const apiFetch = async (path: string, opts: any = {}) => {
    const token = useCookie(tokenName).value;
    const headers = opts.headers || {};
    const authOff = opts.authOff || false;

    let pagination = {
      totalPosts: 0,
      totalPages: 0,
    };

    if (token && !authOff) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await $fetch(`${runtimeConfig.public.apiBase}${path}`, {
      ...opts,
      headers,
      onResponse(context) {
        pagination = {
          totalPosts: Number(context.response.headers.get("X-WP-Total")),
          totalPages: Number(context.response.headers.get("X-WP-TotalPages")),
        };
      },
    });
    // console.log("pagination:", pagination);

    if (pagination.totalPosts > 0) {
      console.log("pagination:", pagination);
      return {
        pagination,
        items: response,
      };
    }

    return response;
  };

  return {
    provide: { apiFetch },
  };
});
