import { formatCurrency, roundMoney, toNumber } from "../utils/currency";
import { getLinhaInfo } from "../utils/productLine";
import { ItemTable } from "./ItemTable";

export function OrcamentoForm({
  formData,
  produtos,
  kitsProntos,
  itens,
  total,
  loadingProdutos,
  salvandoOrcamento,
  orcamentoEmEdicao,
  onFieldChange,
  onSelecionarKit,
  onAdicionarItem,
  onAdicionarKit,
  onRemoverItem,
  onSubmit,
}) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit();
  };

  const kitSelecionadoDetalhes = kitsProntos.find(
    (kit) => kit.id === formData.kitSelecionado,
  );

  const totalEstimadoKit = (kitSelecionadoDetalhes?.itens ?? []).reduce(
    (acc, item) =>
      roundMoney(
        acc + toNumber(item.produto.valor) * toNumber(item.quantidade),
      ),
    0,
  );

  return (
    <section className="panel">
      <h2>Criar orcamento</h2>
      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          Nome do cliente
          <input
            type="text"
            value={formData.nomeCliente}
            onChange={(event) =>
              onFieldChange("nomeCliente", event.target.value)
            }
            placeholder="Ex.: Empresa XPTO"
          />
        </label>

        <label>
          Data
          <input
            type="text"
            value={formData.data}
            onChange={(event) => onFieldChange("data", event.target.value)}
            placeholder="DD/MM/AAAA"
            inputMode="numeric"
            maxLength={10}
          />
        </label>

        <div className="item-builder">
          <label>
            Produto
            <select
              value={formData.produtoSelecionado}
              onChange={(event) =>
                onFieldChange("produtoSelecionado", event.target.value)
              }
              disabled={loadingProdutos}
            >
              <option value="">Selecione...</option>
              {produtos.map((produto) => (
                <option key={produto.id} value={produto.id}>
                  {produto.nome} - {formatCurrency(produto.valor)}
                </option>
              ))}
            </select>
          </label>

          <label>
            Quantidade
            <input
              type="number"
              min="1"
              value={formData.quantidade}
              onChange={(event) =>
                onFieldChange("quantidade", event.target.value)
              }
            />
          </label>

          <button type="button" onClick={onAdicionarItem} className="btn">
            Adicionar item
          </button>
        </div>

        <div className="kit-builder">
          <label>
            Kit pronto
            <select
              value={formData.kitSelecionado}
              onChange={(event) => onSelecionarKit(event.target.value)}
              disabled={loadingProdutos || kitsProntos.length === 0}
            >
              <option value="">Selecione um kit...</option>
              {kitsProntos.map((kit) => (
                <option key={kit.id} value={kit.id}>
                  {kit.nome} ({kit.itens.length} itens)
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={onAdicionarKit}
            className="btn"
            disabled={loadingProdutos || kitsProntos.length === 0}
          >
            Adicionar kit
          </button>
        </div>

        {kitSelecionadoDetalhes ? (
          <div className="kit-preview" aria-live="polite">
            <strong>Resumo do {kitSelecionadoDetalhes.nome}</strong>
            <ul className="kit-preview-lista">
              {kitSelecionadoDetalhes.itens.map((item) => {
                const subtotal = roundMoney(
                  toNumber(item.produto.valor) * toNumber(item.quantidade),
                );
                const linhaInfo = getLinhaInfo(item.produto.nome);

                return (
                  <li key={item.produto.id}>
                    <span className="kit-preview-item-info">
                      <span
                        className={`kit-preview-linha kit-preview-linha-${linhaInfo.linhaClasse}`}
                      >
                        {linhaInfo.linha}
                      </span>
                      <span>
                        {item.quantidade}x {linhaInfo.nomeExibicao}
                      </span>
                    </span>
                    <span>{formatCurrency(subtotal)}</span>
                  </li>
                );
              })}
            </ul>
            <p className="kit-preview-total">
              Total estimado do kit:{" "}
              <strong>{formatCurrency(totalEstimadoKit)}</strong>
            </p>
          </div>
        ) : null}

        <ItemTable itens={itens} total={total} onRemoverItem={onRemoverItem} />

        <button
          type="submit"
          className="btn btn-primary"
          disabled={salvandoOrcamento}
        >
          {salvandoOrcamento
            ? "Salvando..."
            : orcamentoEmEdicao
              ? "Salvar alteracoes"
              : "Salvar orcamento"}
        </button>
      </form>
    </section>
  );
}
