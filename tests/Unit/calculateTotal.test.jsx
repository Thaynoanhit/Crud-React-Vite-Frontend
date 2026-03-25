import { describe, expect, it } from "vitest";
import { calculateTotal } from "../../src/utils/orcamento";

describe("calculateTotal", () => {
  it("deve somar os subtotais dos itens", () => {
    const total = calculateTotal([
      { subtotal: 20 },
      { subtotal: 35.5 },
      { subtotal: 4.5 },
    ]);

    expect(total).toBe(60);
  });
});
