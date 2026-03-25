import "./App.css";
import { FeedbackMessage } from "./components/FeedbackMessage";
import { OrcamentoForm } from "./components/OrcamentoForm";
import { OrcamentosList } from "./components/OrcamentosList";
import { PageHeader } from "./components/PageHeader";
import { useOrcamentoPage } from "./hooks/useOrcamentoPage";

function App() {
  const {
    nomeCliente,
    setNomeCliente,
    data,
    setData,
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
  } = useOrcamentoPage();

  const irParaPaginaAnterior = () => {
    if (paginacao.page > 1) {
      carregarOrcamentos(paginacao.page - 1);
    }
  };

  const irParaProximaPagina = () => {
    if (paginacao.total_pages > 0 && paginacao.page < paginacao.total_pages) {
      carregarOrcamentos(paginacao.page + 1);
    }
  };

  const handleFieldChange = (field, value) => {
    const handlers = {
      nomeCliente: setNomeCliente,
      data: setData,
      produtoSelecionado: setProdutoSelecionado,
      quantidade: setQuantidade,
    };

    handlers[field]?.(value);
  };

  return (
    <main className="app">
      <PageHeader />
      <FeedbackMessage erro={erro} sucesso={sucesso} />

      <section className="kpi-grid">
        <article className="kpi-card">
          <span>Itens no rascunho</span>
          <strong>{itens.length}</strong>
        </article>
        <article className="kpi-card">
          <span>Total do rascunho</span>
          <strong>
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(total)}
          </strong>
        </article>
        <article className="kpi-card">
          <span>Orcamentos cadastrados</span>
          <strong>{paginacao.total}</strong>
        </article>
      </section>

      <section className="dashboard-grid">
        <OrcamentoForm
          formData={{ nomeCliente, data, produtoSelecionado, quantidade }}
          produtos={produtos}
          itens={itens}
          total={total}
          loadingProdutos={loadingProdutos}
          salvandoOrcamento={salvandoOrcamento}
          onFieldChange={handleFieldChange}
          onAdicionarItem={adicionarItem}
          onRemoverItem={removerItem}
          onSubmit={salvarOrcamento}
        />
        <OrcamentosList
          orcamentos={orcamentos}
          loadingOrcamentos={loadingOrcamentos}
          onAtualizar={carregarOrcamentos}
          paginacao={paginacao}
          onPaginaAnterior={irParaPaginaAnterior}
          onProximaPagina={irParaProximaPagina}
          onSelecionarPagina={selecionarPagina}
        />
      </section>
    </main>
  );
}

export default App;
