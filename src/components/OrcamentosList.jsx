import { formatCurrency } from "../utils/currency";
import { isoToBrDate } from "../utils/date";

export function OrcamentosList({
  orcamentos,
  loadingOrcamentos,
  onAtualizar,
  onEditarOrcamento,
  onExcluirOrcamento,
  paginacao,
  onPaginaAnterior,
  onProximaPagina,
  onSelecionarPagina,
}) {
  const paginaAtual = Number(paginacao?.page ?? 1);
  const totalPaginas = Number(paginacao?.total_pages ?? 0);
  const totalItens = Number(paginacao?.total ?? 0);
  const opcoesPagina = Array.from(
    { length: totalPaginas },
    (_, index) => index + 1,
  );
  const temPaginaAnterior = paginaAtual > 1;
  const temProximaPagina = totalPaginas > 0 && paginaAtual < totalPaginas;

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Orcamentos salvos</h2>
        <button
          type="button"
          className="btn"
          onClick={onAtualizar}
          disabled={loadingOrcamentos}
        >
          {loadingOrcamentos ? "Atualizando..." : "Atualizar lista"}
        </button>
      </div>
      {loadingOrcamentos ? (
        <div className="loading-cards" role="status" aria-live="polite">
          <span className="visually-hidden">Carregando orcamentos</span>
          <span className="loading-line"></span>
          <span className="loading-line"></span>
          <span className="loading-line"></span>
        </div>
      ) : (
        <ul className="orcamentos-lista">
          {orcamentos.length === 0 ? (
            <li className="empty-state">Nenhum orcamento cadastrado ainda.</li>
          ) : (
            orcamentos.map((orcamento) => (
              <li key={orcamento.id}>
                <span className="orcamento-info">
                  <strong>{orcamento.nome_cliente}</strong> -{" "}
                  {isoToBrDate(orcamento.data_solicitacao)} -{" "}
                  {formatCurrency(orcamento.total)}
                </span>
                <div className="row-actions">
                  <button
                    type="button"
                    className="btn"
                    onClick={() => onEditarOrcamento(orcamento)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => onExcluirOrcamento(orcamento.id)}
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      )}

      <div className="pagination-bar">
        <p className="pagination-status">
          Pagina {totalPaginas === 0 ? 0 : paginaAtual} de {totalPaginas} |
          Total: {totalItens}
        </p>
        <div className="pagination-controls">
          <label className="pagination-jump-control" htmlFor="ir-para-pagina">
            Ir para pagina
            <select
              id="ir-para-pagina"
              value={totalPaginas > 0 ? paginaAtual : ""}
              onChange={(event) => onSelecionarPagina(event.target.value)}
              disabled={loadingOrcamentos || totalPaginas <= 1}
            >
              {totalPaginas === 0 ? (
                <option value="">-</option>
              ) : (
                opcoesPagina.map((pagina) => (
                  <option key={pagina} value={pagina}>
                    {pagina}
                  </option>
                ))
              )}
            </select>
          </label>
          <div className="pagination-actions">
            <button
              type="button"
              className="btn"
              onClick={onPaginaAnterior}
              disabled={loadingOrcamentos || !temPaginaAnterior}
            >
              Anterior
            </button>
            <button
              type="button"
              className="btn"
              onClick={onProximaPagina}
              disabled={loadingOrcamentos || !temProximaPagina}
            >
              Proxima
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
