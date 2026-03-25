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
const LINE_ORDER = {
  Entrada: 1,
  Intermediario: 2,
  "Alto Desempenho": 3,
};

const KIT_CATALOG = [
  {
    id: "kit-escritorio",
    nome: "Kit Escritorio",
    itens: [
      { match: "Mouse USB", quantidade: 1 },
      { match: "Teclado Membrana", quantidade: 1 },
      { match: "Webcam Full HD", quantidade: 1 },
    ],
  },
  {
    id: "kit-gamer",
    nome: "Kit Gamer",
    itens: [
      { match: "Mouse Gamer RGB", quantidade: 1 },
      { match: "Teclado Mecanico RGB", quantidade: 1 },
      { match: "Headset Gamer 7.1", quantidade: 1 },
      { match: "Monitor 24 144Hz", quantidade: 1 },
    ],
  },
  {
    id: "kit-workstation",
    nome: "Kit Workstation",
    itens: [
      { match: "Processador Ryzen 5 5600", quantidade: 1 },
      { match: "Placa Mae B550", quantidade: 1 },
      { match: "Memoria RAM 32GB DDR5", quantidade: 1 },
      { match: "SSD NVMe 2TB", quantidade: 1 },
      { match: "Monitor 27 QHD 165Hz", quantidade: 1 },
    ],
  },
];

const normalizeText = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const getProductLine = (nome) => {
  if (!nome || !nome.includes("|")) return "";
  return nome.split("|")[0].trim();
};

export const useOrcamentoPage = () => {
  const [nomeCliente, setNomeCliente] = useState("");
  const [data, setData] = useState(initialDate());
  const [produtoSelecionado, setProdutoSelecionado] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [kitSelecionado, setKitSelecionado] = useState("");

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

  const produtosOrdenados = useMemo(() => {
    return [...produtos].sort((a, b) => {
      const lineA = getProductLine(a.nome);
      const lineB = getProductLine(b.nome);
      const rankA = LINE_ORDER[lineA] ?? Number.MAX_SAFE_INTEGER;
      const rankB = LINE_ORDER[lineB] ?? Number.MAX_SAFE_INTEGER;

      if (rankA !== rankB) {
        return rankA - rankB;
      }

      const priceA = toNumber(a.valor);
      const priceB = toNumber(b.valor);
      if (priceA !== priceB) {
        return priceA - priceB;
      }

      return String(a.nome).localeCompare(String(b.nome), "pt-BR");
    });
  }, [produtos]);

  const kitsDisponiveis = useMemo(() => {
    return KIT_CATALOG.map((kit) => {
      const itensResolvidos = kit.itens.map((itemKit) => {
        const produto = produtosOrdenados.find((produtoAtual) =>
          normalizeText(produtoAtual.nome).includes(
            normalizeText(itemKit.match),
          ),
        );

        return {
          ...itemKit,
          produto,
        };
      });

      const faltantes = itensResolvidos
        .filter((item) => !item.produto)
        .map((item) => item.match);

      return {
        id: kit.id,
        nome: kit.nome,
        disponivel: faltantes.length === 0,
        faltantes,
        itens: itensResolvidos
          .filter((item) => item.produto)
          .map((item) => ({
            produto: item.produto,
            quantidade: item.quantidade,
          })),
      };
    });
  }, [produtosOrdenados]);

  const kitsProntos = useMemo(
    () => kitsDisponiveis.filter((kit) => kit.disponivel),
    [kitsDisponiveis],
  );

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
    const produto = produtosOrdenados.find((item) => item.id === produtoId);

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

  const adicionarKit = () => {
    setErro("");
    setSucesso("");

    if (!kitSelecionado) {
      setErro("Selecione um kit antes de adicionar");
      return;
    }

    const kit = kitsDisponiveis.find((item) => item.id === kitSelecionado);

    if (!kit || !kit.disponivel) {
      const faltantes =
        kit?.faltantes?.join(", ") || "produtos nao encontrados";
      setErro(`Nao foi possivel montar o kit. Faltando: ${faltantes}`);
      return;
    }

    setItens((state) => {
      const nextState = [...state];

      for (const itemKit of kit.itens) {
        const valor = toNumber(itemKit.produto.valor);
        const indexExistente = nextState.findIndex(
          (itemAtual) => itemAtual.produto_id === itemKit.produto.id,
        );

        if (indexExistente === -1) {
          nextState.push({
            produto_id: itemKit.produto.id,
            produto: itemKit.produto.nome,
            valor,
            quantidade: itemKit.quantidade,
            subtotal: itemKit.quantidade * valor,
          });
          continue;
        }

        const itemExistente = nextState[indexExistente];
        const novaQuantidade = itemExistente.quantidade + itemKit.quantidade;

        nextState[indexExistente] = {
          ...itemExistente,
          quantidade: novaQuantidade,
          subtotal: novaQuantidade * itemExistente.valor,
        };
      }

      return nextState;
    });

    setKitSelecionado("");
    setSucesso(`${kit.nome} adicionado com sucesso`);
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
    setKitSelecionado("");
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
    kitSelecionado,
    setKitSelecionado,
    produtos: produtosOrdenados,
    kitsProntos,
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
    adicionarKit,
    removerItem,
    salvarOrcamento,
    carregarOrcamentos,
    selecionarPagina,
  };
};
