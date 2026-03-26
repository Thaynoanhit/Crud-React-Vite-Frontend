import { apiRequest } from "./apiClient";

export const listarProdutos = async () => {
  const body = await apiRequest("/produtos");
  return body.data ?? [];
};

export const listarOrcamentos = async ({ page = 1, perPage = 10 } = {}) => {
  const searchParams = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  });

  const body = await apiRequest(`/orcamentos?${searchParams.toString()}`);
  const payload = body.data;

  if (Array.isArray(payload)) {
    return {
      items: payload,
      meta: {
        page,
        per_page: perPage,
        total: payload.length,
        total_pages: payload.length > 0 ? 1 : 0,
      },
    };
  }

  return {
    items: Array.isArray(payload?.data) ? payload.data : [],
    meta: {
      page: Number(payload?.meta?.page ?? page),
      per_page: Number(payload?.meta?.per_page ?? perPage),
      total: Number(payload?.meta?.total ?? 0),
      total_pages: Number(payload?.meta?.total_pages ?? 0),
    },
  };
};

export const criarOrcamento = async (payload) => {
  const body = await apiRequest("/orcamentos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return body;
};

export const atualizarOrcamento = async (id, payload) => {
  const body = await apiRequest(`/orcamentos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return body;
};

export const excluirOrcamento = async (id) => {
  const body = await apiRequest(`/orcamentos/${id}`, {
    method: "DELETE",
  });

  return body;
};
