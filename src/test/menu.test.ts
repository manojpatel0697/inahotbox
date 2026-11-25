import { describe, expect, it } from "vitest";
import { buildMessage, waLink } from "@/lib/menu";
describe("WhatsApp order", () => {
  it("itemizes lines and totals", () => {
    const m = buildMessage([
      { key: "a", title: "Wafa’s Signature Chicken Dum Biryani Box", variant: "Single 650g", price: 360, qty: 2 },
      { key: "b", title: "Baked Vanilla Bean Caramel Custard Tub", price: 160, qty: 1 },
    ], { name: "Rohan", slot: "Tomorrow Pre-Order", area: "HSR", notes: "" });
    expect(m).toContain("• 2x Wafa’s Signature Chicken Dum Biryani Box (Single 650g) — ₹720");
    expect(m).toContain("*Estimated Total: ₹880*");
    expect(waLink(m).startsWith("https://wa.me/919999999999?text=")).toBe(true);
  });
});
