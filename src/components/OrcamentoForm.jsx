import { formatCurrency } from '../utils/currency'
import { ItemTable } from './ItemTable'

export function OrcamentoForm({
  formData,
  produtos,
  itens,
  total,
  loadingProdutos,
  salvandoOrcamento,
  onFieldChange,
  onAdicionarItem,
  onRemoverItem,
  onSubmit,
}) {
  const handleSubmit = async (event) => {
    event.preventDefault()
    await onSubmit()
  }

  return (
    <section className="panel">
      <h2>Criar orcamento</h2>
      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          Nome do cliente
          <input
            type="text"
            value={formData.nomeCliente}
            onChange={(event) => onFieldChange('nomeCliente', event.target.value)}
            placeholder="Ex.: Empresa XPTO"
          />
        </label>

        <label>
          Data
          <input
            type="text"
            value={formData.data}
            onChange={(event) => onFieldChange('data', event.target.value)}
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
              onChange={(event) => onFieldChange('produtoSelecionado', event.target.value)}
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
              onChange={(event) => onFieldChange('quantidade', event.target.value)}
            />
          </label>

          <button type="button" onClick={onAdicionarItem} className="btn">
            Adicionar item
          </button>
        </div>

        <ItemTable itens={itens} total={total} onRemoverItem={onRemoverItem} />

        <button type="submit" className="btn btn-primary" disabled={salvandoOrcamento}>
          {salvandoOrcamento ? 'Salvando...' : 'Salvar orcamento'}
        </button>
      </form>
    </section>
  )
}
