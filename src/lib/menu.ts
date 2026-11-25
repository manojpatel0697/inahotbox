export type Variant = { label: string; price: number };
export type Dish = {
  id: string; title: string; veg: boolean; tag: string; desc: string;
  category: "signature" | "mains" | "sides" | "desserts";
  price?: number; variants?: Variant[]; img: string;
};
const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=400&q=75`;
export const DISHES: Dish[] = [
  { id: "chicken-biryani", title: "Wafa’s Signature Chicken Dum Biryani Box", veg: false, tag: "Bestseller", category: "signature",
    desc: "Aged basmati sealed with bone-in chicken, fried onions & family garam masala, slow-dummed in pure ghee.",
    variants: [{ label: "Single 650g", price: 360 }, { label: "Double 1.2kg", price: 680 }], img: u("photo-1563379091339-03b21ab4a4f8") },
  { id: "mutton-pepper", title: "Tellicherry Mutton Pepper Roast & Parotta Box", veg: false, tag: "Chef's Signature", category: "signature",
    desc: "Tender mutton roasted dark with crushed Tellicherry pepper, curry leaves & coconut slivers.", price: 440, img: u("photo-1545247181-516773cae754") },
  { id: "ghee-roast", title: "Kundapur Chicken Ghee Roast & Neer Dosa Box", veg: false, tag: "Serves 1–2", category: "mains",
    desc: "Fiery byadgi-chilli masala, tamarind & ghee clinging to every piece, with soft lacy neer dosas.", price: 390, img: u("photo-1603894584373-5ac82b2ae398") },
  { id: "paneer-makhani", title: "Char-Grilled Paneer Makhani & Garlic Naan Box", veg: true, tag: "Serves 1–2", category: "mains",
    desc: "Smoky tandoor paneer in a velvety tomato-butter gravy, finished with kasuri methi.", price: 320, img: u("photo-1631452180519-c014fe946bc7") },
  { id: "subz-biryani", title: "Saffron Subz Dum Pukht Biryani Box", veg: true, tag: "Serves 1–2", category: "signature",
    desc: "Seasonal vegetables layered with saffron milk, mint & rose water, sealed under dough.",
    variants: [{ label: "Single 650g", price: 290 }, { label: "Double 1.2kg", price: 550 }], img: u("photo-1642821373181-696a54913e93") },
  { id: "korma", title: "Homestyle Coconut Chicken Korma (500ml Tub)", veg: false, tag: "Serves 2–3", category: "mains",
    desc: "Mild, fragrant korma of cashew & fresh coconut milk — Sunday-lunch comfort.", price: 350, img: u("photo-1588166524941-3bf61a9c41db") },
  { id: "parotta", title: "Hand-Layered Malabar Parottas (Set of 2)", veg: true, tag: "Add-on", category: "sides",
    desc: "Flaky, buttery coils, hand-slapped and griddled to order.", price: 80, img: u("photo-1565557623262-b51c2513a641") },
  { id: "custard", title: "Baked Vanilla Bean Caramel Custard Tub", veg: true, tag: "Serves 2", category: "desserts",
    desc: "Silky baked custard with real vanilla bean under a bittersweet caramel pool.", price: 160, img: u("photo-1470124182917-cc6e71b22ecc") },
];

export type CartItem = { key: string; title: string; variant?: string; price: number; qty: number };

export const PHONE = "919999999999";

export function buildMessage(items: CartItem[], d: { name: string; slot: string; area: string; notes: string }) {
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const lines = items.map(i => `• ${i.qty}x ${i.title}${i.variant ? ` (${i.variant})` : ""} — ₹${(i.price * i.qty).toLocaleString("en-IN")}`);
  return `Hi Wafa! I'd like to place an order from *In A Hot Box* 🍱

*ORDER SUMMARY:*
${lines.join("\n")}

*Estimated Total: ₹${total.toLocaleString("en-IN")}* (+ Porter/Dunzo delivery)

*Name:* ${d.name || "-"}
*Slot:* ${d.slot || "-"}
*Area:* ${d.area || "-"}
*Notes:* ${d.notes || "-"}

Please confirm availability & share UPI details!`;
}
export const waLink = (msg: string) => `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;
