import { roundMoney, toNumber } from "./currency";

export const calculateTotal = (itens = []) =>
  roundMoney(itens.reduce((acc, item) => acc + toNumber(item.subtotal), 0));
