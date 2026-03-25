import "@testing-library/jest-dom/vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "../../src/App";
import {
  criarOrcamento,
  listarOrcamentos,
  listarProdutos,
} from "../../src/services/orcamentoService";

vi.mock("../../src/services/orcamentoService", () => ({
  listarProdutos: vi.fn(),
  listarOrcamentos: vi.fn(),
  criarOrcamento: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();

  listarProdutos.mockResolvedValue([
    { id: 1, nome: "Mouse", valor: 10 },
    { id: 2, nome: "Teclado", valor: 20 },
  ]);

  listarOrcamentos.mockResolvedValue({
    items: [],
    meta: {
      page: 1,
      per_page: 10,
      total: 0,
      total_pages: 0,
    },
  });

  criarOrcamento.mockResolvedValue({
    message: "Orcamento criado com sucesso",
  });
});

afterEach(() => {
  cleanup();
});

describe("fluxo do formulario de orcamento", () => {
  it("deve adicionar e remover item com recalculo de total", async () => {
    render(<App />);

    await waitFor(() => {
      expect(listarProdutos).toHaveBeenCalledTimes(1);
    });

    const produtoSelect = screen.getAllByLabelText("Produto")[0];
    const quantidadeInput = screen.getAllByLabelText("Quantidade")[0];
    const tabelaItens = screen.getByRole("table");

    fireEvent.change(produtoSelect, {
      target: { value: "1" },
    });
    fireEvent.change(quantidadeInput, {
      target: { value: "2" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Adicionar item" }));

    expect(screen.getByText("Mouse")).toBeInTheDocument();
    expect(tabelaItens).toHaveTextContent("20,00");

    fireEvent.click(screen.getByRole("button", { name: "Remover" }));

    expect(screen.getByText("Nenhum item adicionado.")).toBeInTheDocument();
  });

  it("deve salvar orcamento e limpar formulario", async () => {
    render(<App />);

    await waitFor(() => {
      expect(listarProdutos).toHaveBeenCalledTimes(1);
    });

    const nomeInput = screen.getAllByPlaceholderText("Ex.: Empresa XPTO")[0];
    const dataInput = screen.getByPlaceholderText("DD/MM/AAAA");
    const produtoSelect = screen.getAllByLabelText("Produto")[0];
    const quantidadeInput = screen.getAllByLabelText("Quantidade")[0];

    fireEvent.change(nomeInput, {
      target: { value: "Cliente Teste" },
    });
    fireEvent.change(dataInput, {
      target: { value: "25/03/2026" },
    });
    fireEvent.change(produtoSelect, {
      target: { value: "2" },
    });
    fireEvent.change(quantidadeInput, {
      target: { value: "3" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Adicionar item" }));

    fireEvent.click(screen.getByRole("button", { name: "Salvar orcamento" }));

    await waitFor(() => {
      expect(criarOrcamento).toHaveBeenCalledWith({
        nomeCliente: "Cliente Teste",
        data: "2026-03-25",
        itens: [{ produto_id: 2, quantidade: 3 }],
      });
    });

    expect(nomeInput).toHaveValue("");
    expect(screen.getByText("Nenhum item adicionado.")).toBeInTheDocument();
    expect(
      screen.getByText("Orcamento criado com sucesso"),
    ).toBeInTheDocument();
  });
});
