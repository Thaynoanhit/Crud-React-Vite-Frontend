const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

const buildUrl = (path) => `${API_BASE_URL}${path}`

export const apiRequest = async (path, options = {}) => {
  const response = await fetch(buildUrl(path), options)
  const body = await response.json()

  if (!response.ok || !body.success) {
    throw new Error(body.error || body.message || 'Falha na comunicacao com a API')
  }

  return body
}
