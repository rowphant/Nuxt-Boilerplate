export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig()

  const apiFetch = async (path: string, opts: any = {}) => {
    const token = useCookie('authToken').value
    const headers = opts.headers || {}
    const authOff = opts.useAuth || false

    if (token && !authOff) {
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