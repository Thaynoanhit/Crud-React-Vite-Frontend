import { formatCurrency } from "../utils/currency";

export function ProdutosManager({
  produtos,
  nomeProduto,
  valorProduto,
  produtoEmEdicao,
  onNomeChange,
  onValorChange,
  onSalvarProduto,
  onEditarProduto,
  onExcluirProduto,
  onCancelarEdicao,
}) {
  return (
    <section className="panel">
      <h2>Produtos</h2>
      <p className="produtos-extra-hint">
        Cadastro e edicao local apenas para apoiar demonstracao no frontend.
      </p>

      <div className="produto-extra-form">
        <label>
          Nome do produto
          <input
            type="text"
            value={nomeProduto}
            onChange={(event) => onNomeChange(event.target.value)}
            placeholder="Ex.: Entrada | Mouse sem fio"
          />
        </label>

        <label>
          Valor do produto
          <input
            type="text"
            inputMode="decimal"
            value={valorProduto}
            onChange={(event) => onValorChange(event.target.value)}
            placeholder="Ex.: 199,90"
          />
        </label>

        <div className="produto-extra-actions">
          <button type="button" className="btn" onClick={onSalvarProduto}>
            {produtoEmEdicao ? "Salvar alteracoes" : "Adicionar produto"}
          </button>
          {produtoEmEdicao ? (
            <button type="button" className="btn" onClick={onCancelarEdicao}>
              Cancelar
            </button>
          ) : null}
        </div>
      </div>

      <ul className="produtos-extra-lista">
        {produtos.map((produto) => (
          <li key={produto.id}>
            <span>
              {produto.nome} - {formatCurrency(produto.valor)}
            </span>
            <div className="row-actions">
              <button
                type="button"
                className="btn"
                onClick={() => onEditarProduto(produto)}
              >
                Editar
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => onExcluirProduto(produto.id)}
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
