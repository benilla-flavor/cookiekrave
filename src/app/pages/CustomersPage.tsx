import { useState } from "react";
import { Search, Plus, Pencil, Trash2, Star, ShoppingBag } from "lucide-react";
import { INITIAL_CUSTOMERS, type Customer, type Tier } from "../store";
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

const TIER_CONFIG: Record<Tier, { color: string; bg: string; icon: string }> = {
  Gold:   { color: C.goldDark,  bg: `${C.gold}22`,              icon: "👑" },
  Silver: { color: "#7A8A9A",   bg: "rgba(120,138,154,0.15)",   icon: "⭐" },
  Bronze: { color: "#A0724A",   bg: "rgba(160,114,74,0.15)",    icon: "🥉" },
};

const TIERS: Tier[] = ["Gold", "Silver", "Bronze"];

function initials(name: string) {
  return name.split(" ").map(w => w[0] ?? "").join("").toUpperCase().slice(0, 2);
}

const BLANK: Omit<Customer, "id"> = {
  name: "", avatar: "", email: "", orders: 0, spent: "$0.00",
  tier: "Bronze", lastOrder: "Today", fav: "",
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [search, setSearch]       = useState("");
  const [tier, setTier]           = useState<"All" | Tier>("All");
  const [modal, setModal]         = useState<"add" | "edit" | "delete" | null>(null);
  const [selected, setSelected]   = useState<Customer | null>(null);
  const [form, setForm]           = useState<Omit<Customer, "id">>(BLANK);

  const nextId = () => Math.max(0, ...customers.map(c => c.id)) + 1;

  const visible = customers.filter(c => {
    const mt = tier === "All" || c.tier === tier;
    const ms = search === "" || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    return mt && ms;
  });

  const openAdd    = () => { setForm(BLANK); setModal("add"); };
  const openEdit   = (c: Customer) => { setSelected(c); setForm({ name: c.name, avatar: c.avatar, email: c.email, orders: c.orders, spent: c.spent, tier: c.tier, lastOrder: c.lastOrder, fav: c.fav }); setModal("edit"); };
  const openDelete = (c: Customer) => { setSelected(c); setModal("delete"); };

  const handleAdd = () => {
    if (!form.name.trim()) return;
    setCustomers(prev => [...prev, { ...form, id: nextId(), avatar: initials(form.name) }]);
    setModal(null);
  };
  const handleEdit = () => {
    if (!selected) return;
    setCustomers(prev => prev.map(c => c.id === selected.id ? { ...c, ...form, avatar: initials(form.name) } : c));
    setModal(null);
  };
  const handleDelete = () => {
    if (!selected) return;
    setCustomers(prev => prev.filter(c => c.id !== selected.id));
    setModal(null);
  };

  const F = (k: keyof typeof form, v: unknown) => setForm(p => ({ ...p, [k]: v }));

  const goldCount = customers.filter(c => c.tier === "Gold").length;
  const totalSpent = customers.reduce((sum, c) => sum + parseFloat(c.spent.replace(/[$,]/g, "") || "0"), 0);
  const avgOrder = customers.length ? (totalSpent / customers.reduce((s, c) => s + c.orders, 0)).toFixed(0) : "0";

  const STATS = [
    { label: "Total Customers",  value: String(customers.length), icon: "👥", color: C.cobalt },
    { label: "Gold Members",     value: String(goldCount),        icon: "👑", color: C.goldDark },
    { label: "Avg. Order Value", value: `$${avgOrder}`,           icon: "💰", color: C.successGreen },
    { label: "Repeat Rate",      value: "78%",                    icon: "🔄", color: C.cobalt },
  ];

  return (
    <div className="flex flex-col h-full px-7 pt-6 pb-7 gap-5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 26, fontWeight: 700, color: C.gold, letterSpacing: "0.05em", textShadow: `0 2px 14px ${C.gold}55` }}>
            Customers
          </h1>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: C.muted, marginTop: 3 }}>
            {customers.length} registered customers
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: C.bg, ...sPressed, width: 200 }}>
            <Search size={13} style={{ color: C.muted }} />
            <input type="text" placeholder="Search customers…" value={search} onChange={e => setSearch(e.target.value)}
              className="bg-transparent outline-none border-none flex-1"
              style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: C.fore }} />
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
            style={{ background: `linear-gradient(135deg, ${C.gold} 0%, ${C.goldDark} 100%)`, boxShadow: `0 4px 14px ${C.gold}50` }}>
            <Plus size={13} style={{ color: "#1A0C06" }} />
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 600, color: "#1A0C06" }}>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 flex-shrink-0">
        {STATS.map(s => (
          <div key={s.label} className="p-4 rounded-2xl flex items-center gap-3" style={{ background: C.bg, ...sRaised }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: C.bg, ...sPressed }}>{s.icon}</div>
            <div>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 18, fontWeight: 500, color: s.color, lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: C.muted, marginTop: 2 }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tier filter */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {(["All", ...TIERS] as const).map(t => {
          const active = tier === t;
          return (
            <button key={t} onClick={() => setTier(t)} className="px-4 py-1.5 rounded-full transition-all duration-200"
              style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: active ? 600 : 400,
                background: active ? C.gold : C.bg, color: active ? "#1A0C06" : C.muted,
                ...(active ? { boxShadow: `0 2px 10px ${C.gold}50` } : sSubtle) }}>
              {t}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="flex-1 rounded-2xl overflow-hidden flex flex-col" style={{ background: C.bg, ...sRaised }}>
        <div className="grid px-5 py-3 flex-shrink-0"
          style={{ gridTemplateColumns: "1fr 1fr 70px 90px 80px 1fr 72px", borderBottom: `1px solid ${C.fore}10` }}>
          {["Customer", "Email", "Orders", "Spent", "Tier", "Favourite", ""].map(h => (
            <span key={h} style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</span>
          ))}
        </div>
        <div className="flex-1 overflow-auto">
          {visible.map((customer, i) => {
            const tierCfg = TIER_CONFIG[customer.tier];
            return (
              <div key={customer.id} className="grid px-5 py-3 items-center transition-all duration-150"
                style={{ gridTemplateColumns: "1fr 1fr 70px 90px 80px 1fr 72px",
                  borderBottom: i < visible.length - 1 ? `1px solid ${C.fore}08` : "none" }}
                onMouseEnter={e => (e.currentTarget.style.background = `${C.gold}08`)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${C.gold}20`, fontSize: 10, fontWeight: 700, color: C.goldDark, fontFamily: "'Montserrat', sans-serif" }}>
                    {customer.avatar}
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: C.fore }}>{customer.name}</p>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: C.muted }}>{customer.lastOrder}</p>
                  </div>
                </div>
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: C.muted }}>{customer.email}</span>
                <div className="flex items-center gap-1">
                  <ShoppingBag size={10} style={{ color: C.cobalt }} />
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: C.fore }}>{customer.orders}</span>
                </div>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 500, color: C.fore }}>{customer.spent}</span>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit" style={{ background: tierCfg.bg }}>
                  <span style={{ fontSize: 10 }}>{tierCfg.icon}</span>
                  <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 600, color: tierCfg.color }}>{customer.tier}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={10} fill={C.gold} style={{ color: C.gold }} />
                  <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: C.muted }}>{customer.fav}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => openEdit(customer)} className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                    style={{ background: `${C.cobalt}15` }}
                    onMouseEnter={e => (e.currentTarget.style.background = `${C.cobalt}30`)}
                    onMouseLeave={e => (e.currentTarget.style.background = `${C.cobalt}15`)}>
                    <Pencil size={11} style={{ color: C.cobalt }} />
                  </button>
                  <button onClick={() => openDelete(customer)} className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
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
        <Modal title={modal === "add" ? "Add Customer" : `Edit: ${selected?.name}`}
          onClose={() => setModal(null)}
          onConfirm={modal === "add" ? handleAdd : handleEdit}
          confirmLabel={modal === "add" ? "Add Customer" : "Save Changes"}>
          <Field label="Full Name"><input style={inputStyle} value={form.name} onChange={e => F("name", e.target.value)} placeholder="e.g. Jane Smith" /></Field>
          <Field label="Email"><input style={inputStyle} type="email" value={form.email} onChange={e => F("email", e.target.value)} placeholder="jane@email.com" /></Field>
          <div className="grid grid-cols-2 gap-x-4">
            <Field label="Tier">
              <select style={inputStyle} value={form.tier} onChange={e => F("tier", e.target.value as Tier)}>
                {TIERS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Total Spent"><input style={inputStyle} value={form.spent} onChange={e => F("spent", e.target.value)} placeholder="$0.00" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-x-4">
            <Field label="Order Count"><input style={inputStyle} type="number" min={0} value={form.orders} onChange={e => F("orders", parseInt(e.target.value) || 0)} /></Field>
            <Field label="Last Order"><input style={inputStyle} value={form.lastOrder} onChange={e => F("lastOrder", e.target.value)} placeholder="Today" /></Field>
          </div>
          <Field label="Favourite Product"><input style={inputStyle} value={form.fav} onChange={e => F("fav", e.target.value)} placeholder="e.g. Chocolate Chunk" /></Field>
        </Modal>
      )}

      {/* Delete Modal */}
      {modal === "delete" && selected && (
        <Modal title="Delete Customer" onClose={() => setModal(null)} onConfirm={handleDelete} confirmLabel="Delete" confirmColor={C.alertRed}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: C.fore }}>
            Delete <strong>{selected.name}</strong>? All their data will be removed.
          </p>
        </Modal>
      )}
    </div>
  );
}
