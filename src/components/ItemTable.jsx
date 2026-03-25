import { formatCurrency } from '../utils/currency'

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
            itens.map((item, index) => (
              <tr key={`${item.produto_id}-${index}`}>
                <td>{item.produto}</td>
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
            ))
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
  )
}
