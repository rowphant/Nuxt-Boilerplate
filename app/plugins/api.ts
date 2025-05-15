export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig()

  const apiFetch = async (path: string, opts: any = {}) => {
    const token = useCookie('authToken').value
    const headers = opts.headers || {}

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return await $fetch(`${runtimeConfig.public.apiBase}${path}`, {
      ...opts,
      headers,
    })
  }

  return {
    provide: { apiFetch },
  }
})