import { formatCurrency } from "../utils/currency";
import { getLinhaInfo } from "../utils/productLine";

export function ItemTable({ itens, total, onRemoverItem }) {
  return (
    <div className="itens-wrapper">
      <table>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Qtd</th>
            <th>Unitario</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {itens.length === 0 ? (
            <tr>
              <td colSpan="5" className="empty-state">
                Nenhum item adicionado.
              </td>
            </tr>
          ) : (
            itens.map((item, index) => {
              const linhaInfo = getLinhaInfo(item.produto);

              return (
                <tr key={`${item.produto_id}-${index}`}>
                  <td>
                    <span className="item-produto-info">
                      <span
                        className={`kit-preview-linha kit-preview-linha-${linhaInfo.linhaClasse}`}
                      >
                        {linhaInfo.linha}
                      </span>
                      <span>{linhaInfo.nomeExibicao}</span>
                    </span>
                  </td>
                  <td>{item.quantidade}</td>
                  <td>{formatCurrency(item.valor)}</td>
                  <td>{formatCurrency(item.subtotal)}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => onRemoverItem(index)}
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3">Total</td>
            <td>{formatCurrency(total)}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
