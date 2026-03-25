import { useEffect, useMemo, useState } from "react";
import {
  criarOrcamento,
  listarOrcamentos,
  listarProdutos,
} from "../services/orcamentoService";
import { toNumber } from "../utils/currency";
import {
  brToApiDate,
  getTodayBrDate,
  isValidBrDate,
  normalizeBrDateInput,
} from "../utils/date";
import { calculateTotal } from "../utils/orcamento";

const initialDate = () => getTodayBrDate();
const DEFAULT_PER_PAGE = 10;

export const useOrcamentoPage = () => {
  const [nomeCliente, setNomeCliente] = useState("");
  const [data, setData] = useState(initialDate());
  const [produtoSelecionado, setProdutoSelecionado] = useState("");
  const [quantidade, setQuantidade] = useState(1);

  const [produtos, setProdutos] = useState([]);
  const [itens, setItens] = useState([]);
  const [orcamentos, setOrcamentos] = useState([]);
  const [paginacao, setPaginacao] = useState({
    page: 1,
    per_page: DEFAULT_PER_PAGE,
    total: 0,
    total_pages: 0,
  });

  const [loadingProdutos, setLoadingProdutos] = useState(false);
  const [loadingOrcamentos, setLoadingOrcamentos] = useState(false);
  const [salvandoOrcamento, setSalvandoOrcamento] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const total = useMemo(() => calculateTotal(itens), [itens]);

  const carregarOrcamentos = async (pagina, itensPorPagina) => {
    const paginaSolicitada = Number(pagina);
    const perPageSolicitado = Number(itensPorPagina);
    const paginaAtual =
      Number.isInteger(paginaSolicitada) && paginaSolicitada > 0
        ? paginaSolicitada
        : paginacao.page;
    const perPageAtual =
      Number.isInteger(perPageSolicitado) && perPageSolicitado > 0
        ? perPageSolicitado
        : paginacao.per_page;

    setLoadingOrcamentos(true);
    setErro("");
    try {
      const { items, meta } = await listarOrcamentos({
        page: paginaAtual,
        perPage: perPageAtual,
      });

      setOrcamentos(items);
      setPaginacao((state) => ({
        ...state,
        ...meta,
      }));
    } catch (error) {
      setErro(error.message || "Erro inesperado ao carregar orcamentos");
    } finally {
      setLoadingOrcamentos(false);
    }
  };

  const selecionarPagina = async (valor) => {
    const novaPagina = Number(valor);

    if (!Number.isInteger(novaPagina) || novaPagina <= 0) {
      return;
    }

    await carregarOrcamentos(novaPagina);
  };

  useEffect(() => {
    const carregarDadosIniciais = async () => {
      setLoadingProdutos(true);
      setLoadingOrcamentos(true);
      setErro("");

      try {
        const [produtosData, { items, meta }] = await Promise.all([
          listarProdutos(),
          listarOrcamentos({
            page: 1,
            perPage: DEFAULT_PER_PAGE,
          }),
        ]);

        setProdutos(produtosData);
        setOrcamentos(items);
        setPaginacao((state) => ({
          ...state,
          ...meta,
        }));
      } catch (error) {
        setErro(error.message || "Erro inesperado ao carregar dados iniciais");
      } finally {
        setLoadingProdutos(false);
        setLoadingOrcamentos(false);
      }
    };

    carregarDadosIniciais();
  }, []);

  const adicionarItem = () => {
    setErro("");
    setSucesso("");

    const produtoId = Number(produtoSelecionado);
    const quantidadeNumerica = Number(quantidade);
    const produto = produtos.find((item) => item.id === produtoId);

    if (!produto) {
      setErro("Selecione um produto valido antes de adicionar");
      return;
    }

    if (Number.isNaN(quantidadeNumerica) || quantidadeNumerica <= 0) {
      setErro("A quantidade deve ser maior que zero");
      return;
    }

    const subtotal = quantidadeNumerica * toNumber(produto.valor);
    setItens((state) => [
      ...state,
      {
        produto_id: produto.id,
        produto: produto.nome,
        valor: toNumber(produto.valor),
        quantidade: quantidadeNumerica,
        subtotal,
      },
    ]);
    setProdutoSelecionado("");
    setQuantidade(1);
  };

  const removerItem = (index) => {
    setItens((state) => state.filter((_, itemIndex) => itemIndex !== index));
  };

  const limparFormulario = () => {
    setNomeCliente("");
    setData(initialDate());
    setItens([]);
    setProdutoSelecionado("");
    setQuantidade(1);
  };

  const atualizarData = (value) => {
    setData(normalizeBrDateInput(value));
  };

  const salvarOrcamento = async () => {
    setErro("");
    setSucesso("");

    if (!nomeCliente.trim()) {
      setErro("Informe o nome do cliente");
      return false;
    }

    if (!data) {
      setErro("Informe a data do orcamento");
      return false;
    }

    if (!isValidBrDate(data)) {
      setErro("Informe a data no formato DD/MM/AAAA");
      return false;
    }

    if (itens.length === 0) {
      setErro("Adicione ao menos um item ao orcamento");
      return false;
    }

    setSalvandoOrcamento(true);
    try {
      const payload = {
        nomeCliente: nomeCliente.trim(),
        data: brToApiDate(data),
        itens: itens.map((item) => ({
          produto_id: item.produto_id,
          quantidade: item.quantidade,
        })),
      };

      const resposta = await criarOrcamento(payload);
      limparFormulario();
      setSucesso(resposta.message || "Orcamento salvo com sucesso");
      await carregarOrcamentos(paginacao.page);
      return true;
    } catch (error) {
      setErro(error.message || "Erro inesperado ao salvar orcamento");
      return false;
    } finally {
      setSalvandoOrcamento(false);
    }
  };

  return {
    nomeCliente,
    setNomeCliente,
    data,
    setData: atualizarData,
    produtoSelecionado,
    setProdutoSelecionado,
    quantidade,
    setQuantidade,
    produtos,
    itens,
    total,
    orcamentos,
    paginacao,
    loadingProdutos,
    loadingOrcamentos,
    salvandoOrcamento,
    erro,
    sucesso,
    adicionarItem,
    removerItem,
    salvarOrcamento,
    carregarOrcamentos,
    selecionarPagina,
  };
};
