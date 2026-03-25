import { formatCurrency } from "../utils/currency";
import { isoToBrDate } from "../utils/date";

export function OrcamentosList({
  orcamentos,
  loadingOrcamentos,
  onAtualizar,
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
        <div className="loading-cards">
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
                <strong>{orcamento.nome_cliente}</strong> -{" "}
                {isoToBrDate(orcamento.data_solicitacao)} -{" "}
                {formatCurrency(orcamento.total)}
              </li>
            ))
          )}
        </ul>
      )}

      <div className="pagination-bar">
        <div className="pagination-info">
          <span>
            Pagina {totalPaginas === 0 ? 0 : paginaAtual} de {totalPaginas} |
            Total: {totalItens}
          </span>
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
        </div>
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
    </section>
  );
}
