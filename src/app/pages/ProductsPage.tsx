import { useState } from "react";
import { Search, Plus, Pencil, Trash2, Star } from "lucide-react";
import { INITIAL_PRODUCTS, type Product, type Category } from "../store";
import Modal, { Field, inputStyle } from "../components/Modal";

const C = {
  bg: "#EDE8DE", sl: "#F8F4EC", sd: "#BFBAA8",
  gold: "#C4A04A", goldLight: "#E8CC7A", goldDark: "#9A7A28",
  cobalt: "#1B3A8F", fore: "#3D2314", foreMid: "#7A5030",
  muted: "#9B8268", alertRed: "#B83232", successGreen: "#2A6B3E",
} as const;

const sRaised  = { boxShadow: `-8px -8px 16px ${C.sl}, 8px 8px 16px ${C.sd}` };
const sPressed = { boxShadow: `inset -4px -4px 8px ${C.sl}, inset 4px 4px 8px ${C.sd}` };
const sSubtle  = { boxShadow: `-4px -4px 8px ${C.sl}, 4px 4px 8px ${C.sd}` };

const BADGE_COLORS: Record<string, { bg: string; color: string }> = {
  "Best Seller": { bg: `${C.gold}22`,         color: C.goldDark },
  "Popular":     { bg: `${C.cobalt}18`,        color: C.cobalt },
  "New":         { bg: `${C.successGreen}18`,  color: C.successGreen },
  "Limited":     { bg: `${C.alertRed}15`,      color: C.alertRed },
};

const BLANK: Omit<Product, "id"> = {
  emoji: "🍪", name: "", category: "Classic", price: "", perDozen: null,
  rating: 4.5, sold: 0, available: true, badge: null,
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState<"All" | Category>("All");
  const [modal, setModal]       = useState<"add" | "edit" | "delete" | null>(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const [form, setForm]         = useState<Omit<Product, "id">>(BLANK);

  const nextId = () => Math.max(0, ...products.map(p => p.id)) + 1;

  const visible = products.filter(p => {
    const mc = category === "All" || p.category === category;
    const ms = search === "" || p.name.toLowerCase().includes(search.toLowerCase());
    return mc && ms;
  });

  const openAdd  = () => { setForm(BLANK); setModal("add"); };
  const openEdit = (p: Product) => { setSelected(p); setForm({ emoji: p.emoji, name: p.name, category: p.category, price: p.price, perDozen: p.perDozen, rating: p.rating, sold: p.sold, available: p.available, badge: p.badge }); setModal("edit"); };
  const openDelete = (p: Product) => { setSelected(p); setModal("delete"); };

  const handleAdd = () => {
    if (!form.name.trim()) return;
    setProducts(prev => [...prev, { ...form, id: nextId() }]);
    setModal(null);
  };
  const handleEdit = () => {
    if (!selected) return;
    setProducts(prev => prev.map(p => p.id === selected.id ? { ...p, ...form } : p));
    setModal(null);
  };
  const handleDelete = () => {
    if (!selected) return;
    setProducts(prev => prev.filter(p => p.id !== selected.id));
    setModal(null);
  };

  const F = (k: keyof typeof form, v: unknown) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="flex flex-col h-full px-7 pt-6 pb-7 gap-5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 26, fontWeight: 700, color: C.gold, letterSpacing: "0.05em", textShadow: `0 2px 14px ${C.gold}55` }}>
            Products
          </h1>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: C.muted, marginTop: 3 }}>
            {products.length} products · {products.filter(p => p.available).length} available
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: C.bg, ...sPressed, width: 190 }}>
            <Search size={13} style={{ color: C.muted }} />
            <input type="text" placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)}
              className="bg-transparent outline-none border-none flex-1"
              style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: C.fore }} />
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
            style={{ background: `linear-gradient(135deg, ${C.gold} 0%, ${C.goldDark} 100%)`, boxShadow: `0 4px 14px ${C.gold}50` }}>
            <Plus size={13} style={{ color: "#1A0C06" }} />
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 600, color: "#1A0C06" }}>Add Product</span>
          </button>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {(["All", "Classic", "Specialty"] as const).map(cat => {
          const active = category === cat;
          return (
            <button key={cat} onClick={() => setCategory(cat)} className="px-5 py-2 rounded-xl transition-all duration-200"
              style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: active ? 600 : 400,
                background: active ? C.gold : C.bg, color: active ? "#1A0C06" : C.muted,
                ...(active ? { boxShadow: `0 2px 10px ${C.gold}50` } : sSubtle) }}>
              {cat}
            </button>
          );
        })}
      </div>

      {/* Product grid */}
      <div className="flex-1 overflow-auto">
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
          {visible.map(product => {
            const badge = product.badge ? BADGE_COLORS[product.badge] : null;
            return (
              <div key={product.id} className="p-4 rounded-2xl flex flex-col gap-3 transition-all duration-200"
                style={{ background: C.bg, ...sRaised }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = `-10px -10px 20px ${C.sl}, 10px 10px 20px ${C.sd}, 0 0 0 1.5px ${C.gold}35`)}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = `-8px -8px 16px ${C.sl}, 8px 8px 16px ${C.sd}`)}>
                {/* Emoji + badge */}
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: C.bg, ...sPressed, fontSize: 28 }}>
                    {product.emoji}
                  </div>
                  {badge && (
                    <span className="px-2 py-0.5 rounded-full"
                      style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 9, fontWeight: 700, background: badge.bg, color: badge.color }}>
                      {product.badge}
                    </span>
                  )}
                </div>
                <div>
                  <p style={{ fontFamily: "'Cinzel', serif", fontSize: 12, fontWeight: 600, color: C.fore, lineHeight: 1.3 }}>{product.name}</p>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: C.muted, marginTop: 2 }}>{product.category}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={10} fill={C.gold} style={{ color: C.gold }} />
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 500, color: C.fore }}>{product.rating}</span>
                  <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: C.muted }}>· {product.sold.toLocaleString()} sold</span>
                </div>
                <div className="flex items-center justify-between mt-auto pt-2" style={{ borderTop: `1px solid ${C.fore}10` }}>
                  <div>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 500, color: C.fore }}>{product.price}</span>
                    {product.perDozen && (
                      <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 9, color: C.muted, marginLeft: 4 }}>/ {product.perDozen} doz</span>
                    )}
                  </div>
                  <div className="w-2 h-2 rounded-full"
                    style={{ background: product.available ? C.successGreen : C.alertRed, boxShadow: `0 0 5px ${product.available ? C.successGreen : C.alertRed}` }} />
                </div>
                {/* Actions */}
                <div className="flex gap-2 pt-1" style={{ borderTop: `1px solid ${C.fore}08` }}>
                  <button onClick={() => openEdit(product)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all"
                    style={{ background: `${C.cobalt}12`, fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 600, color: C.cobalt }}
                    onMouseEnter={e => (e.currentTarget.style.background = `${C.cobalt}25`)}
                    onMouseLeave={e => (e.currentTarget.style.background = `${C.cobalt}12`)}>
                    <Pencil size={10} /> Edit
                  </button>
                  <button onClick={() => openDelete(product)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all"
                    style={{ background: `${C.alertRed}12`, fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 600, color: C.alertRed }}
                    onMouseEnter={e => (e.currentTarget.style.background = `${C.alertRed}25`)}
                    onMouseLeave={e => (e.currentTarget.style.background = `${C.alertRed}12`)}>
                    <Trash2 size={10} /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {(modal === "add" || modal === "edit") && (
        <Modal title={modal === "add" ? "Add Product" : `Edit: ${selected?.name}`}
          onClose={() => setModal(null)}
          onConfirm={modal === "add" ? handleAdd : handleEdit}
          confirmLabel={modal === "add" ? "Add Product" : "Save Changes"}>
          <div className="grid grid-cols-2 gap-x-4">
            <Field label="Emoji"><input style={inputStyle} value={form.emoji} onChange={e => F("emoji", e.target.value)} placeholder="🍪" /></Field>
            <Field label="Category">
              <select style={inputStyle} value={form.category} onChange={e => F("category", e.target.value as Category)}>
                <option value="Classic">Classic</option>
                <option value="Specialty">Specialty</option>
              </select>
            </Field>
          </div>
          <Field label="Product Name"><input style={inputStyle} value={form.name} onChange={e => F("name", e.target.value)} placeholder="e.g. Chocolate Chunk" /></Field>
          <div className="grid grid-cols-2 gap-x-4">
            <Field label="Price (each)"><input style={inputStyle} value={form.price} onChange={e => F("price", e.target.value)} placeholder="$3.00" /></Field>
            <Field label="Price per Dozen"><input style={inputStyle} value={form.perDozen ?? ""} onChange={e => F("perDozen", e.target.value || null)} placeholder="$32.00" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-x-4">
            <Field label="Rating (0–5)"><input style={inputStyle} type="number" min={0} max={5} step={0.1} value={form.rating} onChange={e => F("rating", parseFloat(e.target.value))} /></Field>
            <Field label="Badge">
              <select style={inputStyle} value={form.badge ?? ""} onChange={e => F("badge", e.target.value || null)}>
                <option value="">None</option>
                {Object.keys(BADGE_COLORS).map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Available">
            <select style={inputStyle} value={form.available ? "yes" : "no"} onChange={e => F("available", e.target.value === "yes")}>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </Field>
        </Modal>
      )}

      {/* Delete Modal */}
      {modal === "delete" && selected && (
        <Modal title="Delete Product" onClose={() => setModal(null)} onConfirm={handleDelete} confirmLabel="Delete" confirmColor={C.alertRed}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: C.fore }}>
            Delete <strong>{selected.name}</strong>? This cannot be undone.
          </p>
        </Modal>
      )}
    </div>
  );
}
