import { useState } from "react";
import { AlertTriangle, Plus, Pencil, Trash2, RefreshCw } from "lucide-react";
import { INITIAL_INVENTORY, type InventoryItem, type InvCategory, type StockLevel } from "../store";
import Modal, { Field, inputStyle } from "../components/Modal";

const C = {
  bg: "#EDE8DE", sl: "#F8F4EC", sd: "#BFBAA8",
  gold: "#C4A04A", goldLight: "#E8CC7A", goldDark: "#9A7A28",
  cobalt: "#1B3A8F", cobaltHover: "#2547B0",
  fore: "#3D2314", foreMid: "#7A5030",
  muted: "#9B8268", alertRed: "#B83232", warningAmber: "#C47A1E",
  successGreen: "#2A6B3E",
} as const;

const sRaised  = { boxShadow: `-8px -8px 16px ${C.sl}, 8px 8px 16px ${C.sd}` };
const sPressed = { boxShadow: `inset -4px -4px 8px ${C.sl}, inset 4px 4px 8px ${C.sd}` };
const sSubtle  = { boxShadow: `-4px -4px 8px ${C.sl}, 4px 4px 8px ${C.sd}` };

const LEVEL_CONFIG: Record<StockLevel, { color: string; bg: string; label: string }> = {
  Critical: { color: C.alertRed,     bg: `${C.alertRed}15`,     label: "Critical" },
  Low:      { color: C.warningAmber, bg: `${C.warningAmber}15`, label: "Low Stock" },
  OK:       { color: C.cobalt,       bg: `${C.cobalt}15`,       label: "OK" },
  Full:     { color: C.successGreen, bg: `${C.successGreen}15`, label: "Full" },
};

function getLevel(qty: number, max: number, reorder: number): StockLevel {
  const pct = qty / max;
  if (pct <= 0.2) return "Critical";
  if (qty <= reorder) return "Low";
  if (pct >= 0.95) return "Full";
  return "OK";
}

const BLANK: Omit<InventoryItem, "id"> = {
  emoji: "📦", name: "", qty: 0, unit: "pcs", max: 100, reorder: 20, category: "Ingredients",
};

const INV_CATEGORIES: InvCategory[] = ["Ingredients", "Packaging", "Supplies"];

export default function InventoryPage() {
  const [items, setItems]         = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [catFilter, setCatFilter] = useState<"All" | InvCategory>("All");
  const [modal, setModal]         = useState<"add" | "edit" | "delete" | "reorder" | null>(null);
  const [selected, setSelected]   = useState<InventoryItem | null>(null);
  const [form, setForm]           = useState<Omit<InventoryItem, "id">>(BLANK);

  const nextId = () => Math.max(0, ...items.map(i => i.id)) + 1;

  const enriched = items.map(i => ({ ...i, level: getLevel(i.qty, i.max, i.reorder) }));
  const critical  = enriched.filter(i => i.level === "Critical" || i.level === "Low");
  const visible   = enriched.filter(i => catFilter === "All" || i.category === catFilter);

  const openAdd    = () => { setForm(BLANK); setModal("add"); };
  const openEdit   = (i: InventoryItem) => { setSelected(i); setForm({ emoji: i.emoji, name: i.name, qty: i.qty, unit: i.unit, max: i.max, reorder: i.reorder, category: i.category }); setModal("edit"); };
  const openDelete = (i: InventoryItem) => { setSelected(i); setModal("delete"); };
  const openReorder = () => setModal("reorder");

  const handleAdd = () => {
    if (!form.name.trim()) return;
    setItems(prev => [...prev, { ...form, id: nextId() }]);
    setModal(null);
  };
  const handleEdit = () => {
    if (!selected) return;
    setItems(prev => prev.map(i => i.id === selected.id ? { ...i, ...form } : i));
    setModal(null);
  };
  const handleDelete = () => {
    if (!selected) return;
    setItems(prev => prev.filter(i => i.id !== selected.id));
    setModal(null);
  };
  const handleReorder = () => {
    // Bump all critical/low items to their max
    setItems(prev => prev.map(i => {
      const lvl = getLevel(i.qty, i.max, i.reorder);
      return (lvl === "Critical" || lvl === "Low") ? { ...i, qty: i.max } : i;
    }));
    setModal(null);
  };

  const F = (k: keyof typeof form, v: unknown) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="flex flex-col h-full px-7 pt-6 pb-7 gap-5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 26, fontWeight: 700, color: C.gold, letterSpacing: "0.05em", textShadow: `0 2px 14px ${C.gold}55` }}>
            Inventory
          </h1>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: C.muted, marginTop: 3 }}>
            {items.length} items · {critical.length} need attention
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={openReorder} className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: C.bg, ...sSubtle }}>
            <RefreshCw size={13} style={{ color: C.foreMid }} />
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: C.foreMid }}>Reorder All</span>
          </button>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
            style={{ background: `linear-gradient(135deg, ${C.gold} 0%, ${C.goldDark} 100%)`, boxShadow: `0 4px 14px ${C.gold}50` }}>
            <Plus size={13} style={{ color: "#1A0C06" }} />
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 600, color: "#1A0C06" }}>Add Item</span>
          </button>
        </div>
      </div>

      {/* Alert banner */}
      {critical.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl flex-shrink-0"
          style={{ background: `${C.alertRed}10`, border: `1px solid ${C.alertRed}30` }}>
          <AlertTriangle size={14} style={{ color: C.alertRed, flexShrink: 0 }} />
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: C.alertRed }}>
            <strong>{critical.length} items</strong> below threshold: {critical.map(i => i.name).join(", ")}
          </p>
          <button onClick={openReorder} className="ml-auto px-3 py-1 rounded-lg flex-shrink-0"
            style={{ background: C.alertRed, color: "#fff", fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 600 }}>
            Reorder All
          </button>
        </div>
      )}

      {/* Category filter */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {(["All", ...INV_CATEGORIES] as const).map(cat => {
          const active = catFilter === cat;
          return (
            <button key={cat} onClick={() => setCatFilter(cat)} className="px-4 py-1.5 rounded-full transition-all duration-200"
              style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: active ? 600 : 400,
                background: active ? C.gold : C.bg, color: active ? "#1A0C06" : C.muted,
                ...(active ? { boxShadow: `0 2px 10px ${C.gold}50` } : sSubtle) }}>
              {cat}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="flex-1 rounded-2xl overflow-hidden flex flex-col" style={{ background: C.bg, ...sRaised }}>
        <div className="grid px-5 py-3 flex-shrink-0"
          style={{ gridTemplateColumns: "40px 1fr 90px 70px 80px 120px 90px 72px", borderBottom: `1px solid ${C.fore}10` }}>
          {["", "Item", "Qty", "Max", "Reorder", "Level", "Category", ""].map(h => (
            <span key={h} style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</span>
          ))}
        </div>
        <div className="flex-1 overflow-auto">
          {visible.map((item, i) => {
            const cfg = LEVEL_CONFIG[item.level];
            const pct = Math.min((item.qty / item.max) * 100, 100);
            const barColor =
              item.level === "Critical" ? `linear-gradient(90deg, ${C.alertRed}, #E07A1A)` :
              item.level === "Low"      ? `linear-gradient(90deg, ${C.warningAmber}, ${C.goldLight})` :
              item.level === "Full"     ? `linear-gradient(90deg, ${C.successGreen}, #34A85A)` :
              `linear-gradient(90deg, ${C.cobalt}, ${C.cobaltHover})`;
            return (
              <div key={item.id} className="grid px-5 py-3 items-center transition-all duration-150"
                style={{ gridTemplateColumns: "40px 1fr 90px 70px 80px 120px 90px 72px",
                  borderBottom: i < visible.length - 1 ? `1px solid ${C.fore}08` : "none" }}
                onMouseEnter={e => (e.currentTarget.style.background = `${C.gold}08`)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <span style={{ fontSize: 18 }}>{item.emoji}</span>
                <div>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: C.fore }}>{item.name}</p>
                  <div className="mt-1.5" style={{ height: 5, borderRadius: 5, background: C.bg, ...sPressed, width: 120 }}>
                    <div style={{ width: `${pct}%`, height: "100%", borderRadius: 5, background: barColor, transition: "width 0.5s" }} />
                  </div>
                </div>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 500, color: C.fore }}>
                  {item.qty} <span style={{ color: C.muted, fontSize: 10 }}>{item.unit}</span>
                </span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.muted }}>{item.max}</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.muted }}>{item.reorder}</span>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit" style={{ background: cfg.bg }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} />
                  <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 600, color: cfg.color }}>{cfg.label}</span>
                </div>
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: C.muted }}>{item.category}</span>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => openEdit(item)} className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                    style={{ background: `${C.cobalt}15` }}
                    onMouseEnter={e => (e.currentTarget.style.background = `${C.cobalt}30`)}
                    onMouseLeave={e => (e.currentTarget.style.background = `${C.cobalt}15`)}>
                    <Pencil size={11} style={{ color: C.cobalt }} />
                  </button>
                  <button onClick={() => openDelete(item)} className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                    style={{ background: `${C.alertRed}15` }}
                    onMouseEnter={e => (e.currentTarget.style.background = `${C.alertRed}30`)}
                    onMouseLeave={e => (e.currentTarget.style.background = `${C.alertRed}15`)}>
                    <Trash2 size={11} style={{ color: C.alertRed }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {(modal === "add" || modal === "edit") && (
        <Modal title={modal === "add" ? "Add Inventory Item" : `Edit: ${selected?.name}`}
          onClose={() => setModal(null)}
          onConfirm={modal === "add" ? handleAdd : handleEdit}
          confirmLabel={modal === "add" ? "Add Item" : "Save Changes"}>
          <div className="grid grid-cols-2 gap-x-4">
            <Field label="Emoji"><input style={inputStyle} value={form.emoji} onChange={e => F("emoji", e.target.value)} placeholder="📦" /></Field>
            <Field label="Category">
              <select style={inputStyle} value={form.category} onChange={e => F("category", e.target.value as InvCategory)}>
                {INV_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Item Name"><input style={inputStyle} value={form.name} onChange={e => F("name", e.target.value)} placeholder="e.g. Chocolate Chips" /></Field>
          <div className="grid grid-cols-3 gap-x-4">
            <Field label="Quantity"><input style={inputStyle} type="number" min={0} value={form.qty} onChange={e => F("qty", parseInt(e.target.value) || 0)} /></Field>
            <Field label="Max"><input style={inputStyle} type="number" min={1} value={form.max} onChange={e => F("max", parseInt(e.target.value) || 1)} /></Field>
            <Field label="Reorder At"><input style={inputStyle} type="number" min={0} value={form.reorder} onChange={e => F("reorder", parseInt(e.target.value) || 0)} /></Field>
          </div>
          <Field label="Unit"><input style={inputStyle} value={form.unit} onChange={e => F("unit", e.target.value)} placeholder="lbs, pcs, bags…" /></Field>
        </Modal>
      )}

      {/* Delete Modal */}
      {modal === "delete" && selected && (
        <Modal title="Delete Item" onClose={() => setModal(null)} onConfirm={handleDelete} confirmLabel="Delete" confirmColor={C.alertRed}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: C.fore }}>
            Delete <strong>{selected.name}</strong> from inventory? This cannot be undone.
          </p>
        </Modal>
      )}

      {/* Reorder Confirm Modal */}
      {modal === "reorder" && (
        <Modal title="Reorder Low Stock" onClose={() => setModal(null)} onConfirm={handleReorder} confirmLabel="Confirm Reorder" confirmColor={C.cobalt}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: C.fore }}>
            This will restock all <strong>{critical.length} low/critical items</strong> to their maximum quantity:
          </p>
          <ul className="mt-3 flex flex-col gap-1">
            {critical.map(i => (
              <li key={i.id} style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: C.muted }}>
                {i.emoji} {i.name} — {i.qty} → {i.max} {i.unit}
              </li>
            ))}
          </ul>
        </Modal>
      )}
    </div>
  );
}
