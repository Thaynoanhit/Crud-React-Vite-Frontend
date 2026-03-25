export const calculateTotal = (itens = []) =>
  itens.reduce((acc, item) => acc + item.subtotal, 0)
