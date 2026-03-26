import { afterEach, describe, expect, it, vi } from "vitest";
import { apiRequest } from "../../src/services/apiClient";

describe("apiRequest", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("retorna erro amigavel quando resposta de sucesso nao e JSON", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => "<html>ok</html>",
    });

    await expect(apiRequest("/orcamentos")).rejects.toThrow(
      "Resposta invalida da API",
    );
  });

  it("retorna erro com status quando resposta de erro nao e JSON", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 502,
      text: async () => "bad gateway",
    });

    await expect(apiRequest("/orcamentos")).rejects.toThrow(
      "Falha na comunicacao com a API (HTTP 502)",
    );
  });

  it("retorna payload quando envelope da API e valido", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({
          success: true,
          message: "",
          data: [{ id: 1 }],
          error: null,
        }),
    });

    const result = await apiRequest("/orcamentos");

    expect(result.data).toEqual([{ id: 1 }]);
  });
});
