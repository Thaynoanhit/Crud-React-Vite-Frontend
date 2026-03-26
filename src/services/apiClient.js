const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

const buildUrl = (path) => `${API_BASE_URL}${path}`;

const parseResponseBody = async (response) => {
  const rawBody = await response.text();

  if (!rawBody) {
    return null;
  }

  try {
    return JSON.parse(rawBody);
  } catch {
    return {
      rawBody,
      parseError: true,
    };
  }
};

export const apiRequest = async (path, options = {}) => {
  const response = await fetch(buildUrl(path), options);
  const body = await parseResponseBody(response);

  if (body?.parseError) {
    if (response.ok) {
      throw new Error("Resposta invalida da API");
    }

    throw new Error(`Falha na comunicacao com a API (HTTP ${response.status})`);
  }

  if (!body || typeof body !== "object") {
    if (response.ok) {
      throw new Error("Resposta vazia da API");
    }

    throw new Error(`Falha na comunicacao com a API (HTTP ${response.status})`);
  }

  if (!response.ok || !body.success) {
    throw new Error(
      body.error || body.message || "Falha na comunicacao com a API",
    );
  }

  return body;
};
