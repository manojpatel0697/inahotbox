import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  X,
  Check,
  Instagram,
  Copy,
  ChevronDown,
  Flame,
  Clock,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { DISHES, buildMessage, waLink, type CartItem, type Dish } from "@/lib/menu";

const HERO =
  "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=1200&q=80";

export const Route = createFileRoute("/")({
  component: Index,
});

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const W = "max-w-6xl mx-auto px-5 md:px-8";

function DietMark({ veg }: { veg: boolean }) {
  return (
    <span
      aria-label={veg ? "Veg" : "Non-veg"}
      className={`inline-flex h-4 w-4 items-center justify-center rounded-[3px] border-[1.5px] ${veg ? "border-coriander" : "border-nonveg"}`}
    >
      <span className={`h-2 w-2 rounded-full ${veg ? "bg-coriander" : "bg-nonveg"}`} />
    </span>
  );
}

function Stepper({
  qty,
  onDec,
  onInc,
  dark,
}: {
  qty: number;
  onDec: () => void;
  onInc: () => void;
  dark?: boolean;
}) {
  return (
    <div
      className={`inline-flex items-center rounded-full text-xs font-semibold ${dark ? "bg-ink text-cream" : "border border-border bg-card text-ink"}`}
    >
      <button
        onClick={onDec}
        aria-label="Decrease"
        className="px-3 py-1.5 transition-opacity hover:opacity-70"
      >
        <Minus className="h-3 w-3" />
      </button>
      <span className="min-w-6 text-center tabular-nums">{qty}</span>
      <button
        onClick={onInc}
        aria-label="Increase"
        className="px-3 py-1.5 transition-opacity hover:opacity-70"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
}

const CATS = [
  { id: "all", label: "All" },
  { id: "signature", label: "Signature" },
  { id: "mains", label: "Mains" },
  { id: "sides", label: "Sides" },
  { id: "desserts", label: "Desserts" },
] as const;

const SLOTS = [
  "Today Lunch (12:30–2 PM)",
  "Today Dinner (7:30–9:30 PM)",
  "Tomorrow Pre-Order",
];

const KILO: Record<string, number> = {
  "Chicken Dum Biryani": 1450,
  "Mutton Biryani": 1850,
  "Paneer Makhani": 1450,
};

const TRUST_BADGES = [
  { icon: Flame, label: "Made to order", sub: "Fresh every batch" },
  { icon: Clock, label: "Pre-order 3 hrs", sub: "Lunch & dinner slots" },
  { icon: MapPin, label: "All Bengaluru", sub: "Porter & Dunzo" },
];

function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [cat, setCat] = useState<string>("all");
  const [vegOnly, setVegOnly] = useState(false);
  const [sizes, setSizes] = useState<Record<string, number>>({});
  const [kiloDish, setKiloDish] = useState("Chicken Dum Biryani");
  const [kiloW, setKiloW] = useState(1);
  const [form, setForm] = useState({
    name: "",
    slot: SLOTS[0]!,
    area: "",
    notes: "",
  });

  const count = cart.reduce((s, i) => s + i.qty, 0);
  const total = cart.reduce((s, i) => s + i.qty * i.price, 0);
  const qtyOf = (key: string) => cart.find((i) => i.key === key)?.qty ?? 0;

  const change = (item: Omit<CartItem, "qty">, d: number) =>
    setCart((c) => {
      const ex = c.find((i) => i.key === item.key);
      if (!ex) return d > 0 ? [...c, { ...item, qty: d }] : c;
      return c
        .map((i) => (i.key === item.key ? { ...i, qty: i.qty + d } : i))
        .filter((i) => i.qty > 0);
    });

  const dishes = useMemo(
    () => DISHES.filter((d) => (cat === "all" || d.category === cat) && (!vegOnly || d.veg)),
    [cat, vegOnly],
  );

  const itemFor = (d: Dish): Omit<CartItem, "qty"> => {
    const v = d.variants?.[sizes[d.id] ?? 0];
    return {
      key: v ? `${d.id}:${v.label}` : d.id,
      title: d.title,
      ...(v ? { variant: v.label } : {}),
      price: v ? v.price : d.price!,
    };
  };

  const msg = buildMessage(cart, form);
  const kiloPrice = KILO[kiloDish]! * kiloW;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Announcement bar */}
      <div className="bg-ink py-2.5 text-center text-[11px] font-medium uppercase tracking-[0.14em] text-cream/80">
        Bengaluru Small-Batch Kitchen
        <span className="mx-2.5 opacity-40">·</span>
        Pre-order 3 hrs prior
        <span className="mx-2.5 hidden opacity-40 sm:inline">·</span>
        <span className="hidden sm:inline">Porter &amp; Dunzo Delivery</span>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
        <div className={`${W} flex h-16 items-center justify-between md:h-20`}>
          <a href="#top" className="group leading-none">
            <div className="font-serif text-xl font-semibold tracking-tight text-ink transition-opacity group-hover:opacity-80 md:text-2xl">
              In A Hot Box
            </div>
            <div className="mt-0.5 text-[10px] font-semibold tracking-[0.22em] text-terracotta">
              BY WAFA · BLR
            </div>
          </a>

          <nav className="hidden gap-8 md:flex">
            {[
              ["Menu", "#menu"],
              ["Party Platters", "#platters"],
              ["How It Works", "#kitchen"],
            ].map(([l, h]) => (
              <a
                key={h}
                href={h}
                className="text-xs font-semibold uppercase tracking-[0.14em] text-umber transition-colors hover:text-ink"
              >
                {l}
              </a>
            ))}
          </nav>

          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2.5 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-cream transition-all hover:bg-ink-soft"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Your Box</span>
            {count > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta px-1.5 text-[10px] font-bold">
                {count}
              </span>
            )}
            <span className="tabular-nums">{inr(total)}</span>
          </button>
        </div>
      </header>

      <main id="top">
        {/* Hero */}
        <section className={`${W} grid items-center gap-10 pt-10 pb-16 md:pt-20 md:pb-28 lg:grid-cols-12 lg:gap-16`}>
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-terracotta/30 bg-terracotta/8 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta">
              <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />
              Small-batch home kitchen · Bengaluru
            </div>

            <h1 className="mt-6 font-serif text-4xl leading-[1.07] tracking-[-0.025em] text-ink sm:text-5xl lg:text-[56px]">
              Homestyle feasts,
              <br />
              slow-cooked &amp; packed{" "}
              <em className="font-medium text-terracotta not-italic">hot</em>
              <br />
              from Wafa&apos;s kitchen.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-umber md:text-[17px]">
              Crafted daily in limited batches with family spice blends, pure desi ghee, and
              zero artificial colours. Built for comforting weekday meals and effortless house
              parties.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#menu"
                className="inline-flex items-center gap-2 rounded-full bg-terracotta px-7 py-3.5 text-sm font-semibold text-cream transition-all hover:bg-primary-hover"
              >
                Order Today's Menu
                <ChevronDown className="h-4 w-4" />
              </a>
              <a
                href="#platters"
                className="inline-flex items-center rounded-full border border-ink/20 bg-background px-7 py-3.5 text-sm font-semibold text-ink transition-all hover:border-ink/50"
              >
                Plan a Party Order
              </a>
            </div>

            {/* Trust badges */}
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-border pt-8">
              {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col gap-1.5">
                  <Icon className="h-4 w-4 text-terracotta" />
                  <div className="text-xs font-semibold text-ink">{label}</div>
                  <div className="text-[11px] text-umber">{sub}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] border border-border shadow-sm">
              <img
                src={HERO}
                alt="Chicken dum biryani in a copper handi"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/60 to-transparent" />
              {/* Kitchen status chip */}
              <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/10 bg-background/95 p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coriander opacity-70" />
                      <span className="relative h-2.5 w-2.5 rounded-full bg-coriander" />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-ink">Kitchen Open Today</div>
                      <div className="text-[11px] text-umber">Lunch &amp; Dinner Slots</div>
                    </div>
                  </div>
                  <span className="rounded-full border border-border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-umber">
                    FSSAI
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Menu */}
        <section id="menu" className={`${W} scroll-mt-24 py-20 md:py-28`}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta">
                Today's batch
              </p>
              <h2 className="mt-2 font-serif text-3xl tracking-tight text-ink md:text-[44px]">
                Fresh &amp; <em className="font-normal">ready to order</em>
              </h2>
            </div>
            <p className="text-xs text-umber">Prepared fresh per order · Prices in INR (₹)</p>
          </div>

          {/* Filter bar */}
          <div className="sticky top-16 z-30 mt-8 md:top-20">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-background/97 px-4 py-3 shadow-sm backdrop-blur-md">
              <div className="flex gap-1 overflow-x-auto">
                {CATS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCat(c.id)}
                    className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                      cat === c.id
                        ? "bg-ink text-cream"
                        : "text-umber hover:bg-oat hover:text-ink"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              <button
                role="switch"
                aria-checked={vegOnly}
                onClick={() => setVegOnly((v) => !v)}
                className="flex items-center gap-2 text-xs font-semibold text-ink"
              >
                <DietMark veg />
                Veg only
                <span
                  className={`relative h-5 w-9 rounded-full transition-colors ${vegOnly ? "bg-coriander" : "bg-border"}`}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${vegOnly ? "left-[18px]" : "left-0.5"}`}
                  />
                </span>
              </button>
            </div>
          </div>

          {/* Dish grid */}
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            {dishes.length === 0 ? (
              <p className="col-span-full py-16 text-center font-serif text-lg italic text-umber">
                No dishes match the current filter.
              </p>
            ) : (
              dishes.map((d) => {
                const it = itemFor(d);
                const q = qtyOf(it.key);
                return (
                  <article
                    key={d.id}
                    className="group flex gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:border-terracotta/40 hover:shadow-sm sm:gap-5"
                  >
                    {/* Image */}
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-border bg-photo sm:h-28 sm:w-28">
                      <img
                        src={d.img}
                        alt={d.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-center gap-2">
                        <DietMark veg={d.veg} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-umber">
                          {d.tag}
                        </span>
                      </div>
                      <h3 className="mt-1.5 font-serif text-[17px] font-semibold leading-snug text-ink sm:text-lg">
                        {d.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-umber sm:text-[13px]">
                        {d.desc}
                      </p>

                      {d.variants && (
                        <div className="mt-3 inline-flex w-fit rounded-full border border-border bg-background p-0.5 text-[11px] font-semibold">
                          {d.variants.map((v, i) => (
                            <button
                              key={v.label}
                              onClick={() => setSizes((s) => ({ ...s, [d.id]: i }))}
                              className={`rounded-full px-3 py-1 transition-all ${
                                (sizes[d.id] ?? 0) === i
                                  ? "bg-ink text-cream"
                                  : "text-umber hover:text-ink"
                              }`}
                            >
                              {v.label}
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="mt-auto flex items-center justify-between pt-4">
                        <span className="text-base font-bold tabular-nums text-ink">
                          {inr(it.price)}
                        </span>
                        {q > 0 ? (
                          <Stepper
                            dark
                            qty={q}
                            onDec={() => change(it, -1)}
                            onInc={() => change(it, 1)}
                          />
                        ) : (
                          <button
                            onClick={() => change(it, 1)}
                            className="rounded-full border border-terracotta px-5 py-1.5 text-xs font-bold text-terracotta transition-all hover:bg-terracotta hover:text-cream"
                          >
                            + Add
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>

        {/* Party Platters */}
        <section id="platters" className="scroll-mt-20 border-y border-border bg-oat py-20 md:py-28">
          <div className={W}>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta">
                  Party orders
                </p>
                <h2 className="mt-2 max-w-xl font-serif text-3xl tracking-tight text-ink md:text-[44px]">
                  Hosting? We&apos;ve got{" "}
                  <em className="font-normal text-terracotta">you covered.</em>
                </h2>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-umber">
                Generous kilo-based feasts in party-ready hot trays. Pre-order 24 hours ahead.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
              {[
                {
                  key: "cozy",
                  title: "The Cozy Gathering",
                  guests: "5–6 Guests",
                  price: 2499,
                  items: [
                    "1.5kg Biryani",
                    "1 Starter",
                    "1 Curry",
                    "Raita, Salan & Dessert",
                  ],
                },
                {
                  key: "feast",
                  title: "The House Party Feast",
                  guests: "10–12 Guests",
                  price: 4699,
                  popular: true,
                  items: [
                    "3kg Biryani",
                    "2 Starters",
                    "2 Curries",
                    "Breads",
                    "Raita, Salan & Dessert",
                  ],
                },
              ].map((p) => {
                const it = { key: p.key, title: p.title, variant: p.guests, price: p.price };
                const q = qtyOf(p.key);
                return (
                  <div
                    key={p.key}
                    className={`relative flex flex-col rounded-2xl border bg-card p-7 transition-shadow hover:shadow-md ${
                      p.popular ? "border-terracotta" : "border-border"
                    }`}
                  >
                    {p.popular && (
                      <span className="absolute -top-3.5 left-6 rounded-full bg-terracotta px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-cream shadow-sm">
                        Most Popular
                      </span>
                    )}
                    <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-umber">
                      {p.guests}
                    </div>
                    <h3 className="mt-2 font-serif text-2xl font-semibold text-ink">{p.title}</h3>
                    <div className="mt-3 font-serif text-3xl font-semibold text-ink">
                      {inr(p.price)}
                    </div>
                    <ul className="mt-6 space-y-2.5 border-t border-border pt-6 text-sm text-umber">
                      {p.items.map((i) => (
                        <li key={i} className="flex gap-2.5">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" />
                          {i}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto pt-8">
                      {q > 0 ? (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-umber">In your box</span>
                          <Stepper
                            dark
                            qty={q}
                            onDec={() => change(it, -1)}
                            onInc={() => change(it, 1)}
                          />
                        </div>
                      ) : (
                        <button
                          onClick={() => change(it, 1)}
                          className={`w-full rounded-full py-3 text-sm font-bold transition-all ${
                            p.popular
                              ? "bg-terracotta text-cream hover:bg-primary-hover"
                              : "border border-ink/20 text-ink hover:border-ink/50"
                          }`}
                        >
                          + Add to Box
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Custom kilo builder */}
              <div className="flex flex-col rounded-2xl border border-border bg-card p-7 transition-shadow hover:shadow-md">
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-umber">
                  Build your own
                </div>
                <h3 className="mt-2 font-serif text-2xl font-semibold text-ink">
                  Custom Kilo Party Tray
                </h3>
                <div className="mt-3 font-serif text-3xl font-semibold tabular-nums text-ink">
                  {inr(kiloPrice)}
                </div>

                <div className="mt-6 space-y-5 border-t border-border pt-6">
                  <div>
                    <div className="mb-2.5 text-xs font-semibold text-umber">Dish Type</div>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(KILO).map((k) => (
                        <button
                          key={k}
                          onClick={() => setKiloDish(k)}
                          className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                            kiloDish === k
                              ? "border-ink bg-ink text-cream"
                              : "border-border text-umber hover:border-ink/30 hover:text-ink"
                          }`}
                        >
                          {k}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="mb-2.5 text-xs font-semibold text-umber">Weight</div>
                    <div className="flex gap-2">
                      {[1, 2].map((w) => (
                        <button
                          key={w}
                          onClick={() => setKiloW(w)}
                          className={`rounded-full border px-5 py-1.5 text-xs font-semibold transition-all ${
                            kiloW === w
                              ? "border-ink bg-ink text-cream"
                              : "border-border text-umber hover:text-ink"
                          }`}
                        >
                          {w}kg
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    change(
                      {
                        key: `kilo:${kiloDish}:${kiloW}`,
                        title: `Custom Kilo Tray — ${kiloDish}`,
                        variant: `${kiloW}kg`,
                        price: kiloPrice,
                      },
                      1,
                    );
                    toast.success("Kilo tray added to your box 🎉");
                  }}
                  className="mt-auto pt-8"
                >
                  <span className="flex w-full items-center justify-center rounded-full border border-ink/20 py-3 text-sm font-bold text-ink transition-all hover:border-ink/50">
                    + Add Kilo Tray
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="kitchen" className={`${W} scroll-mt-20 py-20 md:py-28`}>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta">
              How it works
            </p>
            <h2 className="mt-2 font-serif text-3xl tracking-tight text-ink md:text-[44px]">
              Three steps to your{" "}
              <em className="font-normal">hot box.</em>
            </h2>
          </div>
          <div className="mt-12 grid gap-10 border-t border-border pt-10 md:grid-cols-3">
            {[
              [
                "01",
                "Curate Your Box",
                "Pick from today's fresh batch or add a party platter — mix and match freely.",
              ],
              [
                "02",
                "One-Tap WhatsApp Order",
                "Your itemized slip opens in Wafa's WhatsApp. No logins, no app fees.",
              ],
              [
                "03",
                "Cooked & Dispatched Hot",
                "Confirm via UPI; we dispatch via Porter or Dunzo across all Bengaluru.",
              ],
            ].map(([n, t, d]) => (
              <div key={n} className="flex flex-col gap-3">
                <div className="font-serif text-6xl font-light text-border">{n}</div>
                <h3 className="font-serif text-xl font-semibold text-ink">{t}</h3>
                <p className="text-sm leading-relaxed text-umber">{d}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        className={`border-t border-cream/10 bg-ink pt-20 text-cream ${count > 0 ? "pb-28" : "pb-10"}`}
      >
        <div className={W}>
          <div className="grid gap-12 md:grid-cols-3">
            <div>
              <div className="font-serif text-3xl font-semibold tracking-tight">In A Hot Box</div>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-footer-muted">
                Small-batch home kitchen crafted with love by Wafa in Bengaluru.
              </p>
              <a
                href="https://instagram.com/inahotboxblr"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-cream/20 px-4 py-2 text-xs font-medium transition-all hover:border-cream/50"
              >
                <Instagram className="h-3.5 w-3.5" />
                @inahotboxblr
              </a>
            </div>
            <FooterCol
              title="Kitchen Hours"
              rows={[
                ["Lunch Slot", "12:30 PM – 2:00 PM"],
                ["Dinner Slot", "7:30 PM – 9:30 PM"],
                ["Party Orders", "24 hrs advance"],
              ]}
            />
            <FooterCol
              title="Delivery & Hygiene"
              rows={[
                ["Delivery", "Porter / Dunzo · All Bengaluru"],
                ["Pickup", "Self-pickup available"],
                ["Hygiene", "FSSAI Registered Kitchen"],
              ]}
            />
          </div>
          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-6 text-xs text-footer-muted sm:flex-row">
            <span>© 2026 In A Hot Box · Bengaluru. All rights reserved.</span>
            <a
              href="https://theramify.in"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-cream"
            >
              Website crafted by Theramify
            </a>
          </div>
        </div>
      </footer>

      {/* Sticky cart bar */}
      {count > 0 && !open && (
        <div className="fixed inset-x-4 bottom-5 z-40 mx-auto flex max-w-2xl animate-slide-up items-center justify-between gap-3 rounded-2xl border border-cream/10 bg-ink p-3.5 pl-5 text-cream shadow-2xl">
          <div className="leading-tight">
            <div className="text-[11px] text-footer-muted">
              {count} {count === 1 ? "item" : "items"}
            </div>
            <div className="font-bold tabular-nums">{inr(total)}</div>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="rounded-xl bg-coriander px-5 py-2.5 text-sm font-bold text-cream transition-all hover:bg-coriander-hover"
          >
            Review & Order<span className="hidden sm:inline"> on WhatsApp</span> →
          </button>
        </div>
      )}

      {/* Cart drawer */}
      {open && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-ink/50 backdrop-blur-[2px] animate-in fade-in"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-x-0 bottom-0 flex max-h-[94vh] flex-col rounded-t-3xl border-t border-border bg-background shadow-2xl animate-in slide-in-from-bottom duration-300 md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-[460px] md:rounded-none md:border-l md:border-t-0">
            {/* Drawer header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-terracotta">
                  Order Slip
                </div>
                <div className="mt-0.5 font-serif text-2xl font-semibold text-ink">Your Box</div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close cart"
                className="rounded-full border border-border p-2 transition-all hover:border-ink hover:bg-oat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Drawer body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <ShoppingBag className="h-10 w-10 text-border" />
                  <p className="mt-4 font-serif text-lg italic text-umber">
                    Your box is empty.
                  </p>
                  <p className="mt-1 text-sm text-umber/70">Add something warm from the menu.</p>
                </div>
              ) : (
                <>
                  <ul className="divide-y divide-dashed divide-border">
                    {cart.map((i) => (
                      <li key={i.key} className="py-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-serif font-semibold leading-snug text-ink">
                              {i.title}
                            </div>
                            <div className="mt-0.5 text-xs text-umber">
                              {i.variant ? `${i.variant} · ` : ""}
                              {inr(i.price)} each
                            </div>
                          </div>
                          <button
                            onClick={() => change(i, -i.qty)}
                            aria-label="Remove item"
                            className="mt-0.5 shrink-0 text-umber transition-colors hover:text-terracotta"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <Stepper
                            qty={i.qty}
                            onDec={() => change(i, -1)}
                            onInc={() => change(i, 1)}
                          />
                          <span className="font-semibold tabular-nums text-ink">
                            {inr(i.price * i.qty)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Order form */}
                  <div className="mt-6 space-y-4 border-t border-border pt-6">
                    <Field label="Your Name">
                      <input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g., Rohan"
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Preferred Delivery Slot">
                      <div className="flex flex-wrap gap-2">
                        {SLOTS.map((s) => (
                          <button
                            key={s}
                            onClick={() => setForm({ ...form, slot: s })}
                            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                              form.slot === s
                                ? "border-ink bg-ink text-cream"
                                : "border-border bg-card text-umber hover:text-ink"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </Field>
                    <Field label="Bengaluru Locality">
                      <input
                        value={form.area}
                        onChange={(e) => setForm({ ...form, area: e.target.value })}
                        placeholder="e.g., Indiranagar, Koramangala, HSR"
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Kitchen Notes (Optional)">
                      <textarea
                        rows={2}
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        placeholder="e.g., Medium spicy, extra raita"
                        className={inputCls}
                      />
                    </Field>
                  </div>
                </>
              )}
            </div>

            {/* Drawer footer */}
            {cart.length > 0 && (
              <div className="border-t border-border bg-background px-6 py-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-umber">Subtotal</span>
                  <span className="font-serif text-2xl font-semibold tabular-nums text-ink">
                    {inr(total)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-umber">
                  Delivery charges (Porter/Dunzo) added at checkout
                </p>
                <a
                  href={waLink(msg)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-coriander py-4 text-sm font-bold text-cream transition-all hover:bg-coriander-hover"
                >
                  Send Order on WhatsApp · {inr(total)}
                </a>
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(msg);
                    toast.success("Order slip copied to clipboard!");
                  }}
                  className="mt-2 flex w-full items-center justify-center gap-2 py-2.5 text-xs font-semibold text-umber transition-colors hover:text-ink"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy order slip
                </button>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-ink outline-none transition-all placeholder:text-umber/50 focus:border-terracotta focus:ring-2 focus:ring-terracotta/15";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-ink">{label}</span>
      {children}
    </label>
  );
}

function FooterCol({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <div>
      <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-terracotta">
        {title}
      </div>
      <dl className="mt-5 space-y-4">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="text-xs text-footer-muted">{k}</dt>
            <dd className="mt-0.5 font-serif text-lg">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
