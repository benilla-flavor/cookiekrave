import { useState } from "react";
import { Search, Plus, Pencil, Trash2, Clock, CheckCircle2, XCircle, Truck } from "lucide-react";
import { INITIAL_ORDERS, type Order, type OrderStatus } from "../store";
import Modal, { Field, inputStyle } from "../components/Modal";

const C = {
  bg: "#EDE8DE", sl: "#F8F4EC", sd: "#BFBAA8",
  gold: "#C4A04A", goldLight: "#E8CC7A", goldDark: "#9A7A28",
  cobalt: "#1B3A8F", fore: "#3D2314", foreMid: "#7A5030",
  muted: "#9B8268", alertRed: "#B83232", warningAmber: "#C47A1E",
  successGreen: "#2A6B3E",
} as const;

const sRaised  = { boxShadow: `-8px -8px 16px ${C.sl}, 8px 8px 16px ${C.sd}` };
const sPressed = { boxShadow: `inset -4px -4px 8px ${C.sl}, inset 4px 4px 8px ${C.sd}` };
const sSubtle  = { boxShadow: `-4px -4px 8px ${C.sl}, 4px 4px 8px ${C.sd}` };

const STATUS_CONFIG: Record<OrderStatus, { color: string; bg: string; icon: React.ElementType }> = {
  Pending:   { color: C.warningAmber, bg: `${C.warningAmber}18`, icon: Clock },
  Preparing: { color: C.cobalt,       bg: `${C.cobalt}18`,       icon: Clock },
  Ready:     { color: C.successGreen, bg: `${C.successGreen}18`, icon: CheckCircle2 },
  Delivered: { color: C.muted,        bg: `${C.muted}18`,        icon: Truck },
  Cancelled: { color: C.alertRed,     bg: `${C.alertRed}18`,     icon: XCircle },
};

const STATUSES: OrderStatus[] = ["Pending", "Preparing", "Ready", "Delivered", "Cancelled"];
const FILTERS: (OrderStatus | "All")[] = ["All", ...STATUSES];

const BLANK: Omit<Order, "id"> = {
  customer: "", avatar: "", items: "", total: "", status: "Pending", time: "Just now",
};

function initials(name: string) {
  return name.split(" ").map(w => w[0] ?? "").join("").toUpperCase().slice(0, 2);
}

export default function OrdersPage() {
  const [orders, setOrders]   = useState<Order[]>(INITIAL_ORDERS);
  const [filter, setFilter]   = useState<OrderStatus | "All">("All");
  const [search, setSearch]   = useState("");
  const [modal, setModal]     = useState<"add" | "edit" | "delete" | null>(null);
  const [selected, setSelected] = useState<Order | null>(null);
  const [form, setForm]       = useState<Omit<Order, "id">>(BLANK);

  const nextId = () => {
    const nums = orders.map(o => parseInt(o.id.replace("#", ""), 10)).filter(Boolean);
    return `#${Math.max(0, ...nums) + 1}`;
  };

  const visible = orders.filter(o => {
    const mf = filter === "All" || o.status === filter;
    const ms = search === "" || o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase());
    return mf && ms;
  });

  const openAdd = () => { setForm(BLANK); setModal("add"); };
  const openEdit = (o: Order) => { setSelected(o); setForm({ customer: o.customer, avatar: o.avatar, items: o.items, total: o.total, status: o.status, time: o.time }); setModal("edit"); };
  const openDelete = (o: Order) => { setSelected(o); setModal("delete"); };

  const handleAdd = () => {
    if (!form.customer.trim()) return;
    setOrders(prev => [{ ...form, id: nextId(), avatar: initials(form.customer), time: "Just now" }, ...prev]);
    setModal(null);
  };

  const handleEdit = () => {
    if (!selected) return;
    setOrders(prev => prev.map(o => o.id === selected.id ? { ...o, ...form, avatar: initials(form.customer) } : o));
    setModal(null);
  };

  const handleDelete = () => {
    if (!selected) return;
    setOrders(prev => prev.filter(o => o.id !== selected.id));
    setModal(null);
  };

  const F = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="flex flex-col h-full px-7 pt-6 pb-7 gap-5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 26, fontWeight: 700, color: C.gold, letterSpacing: "0.05em", textShadow: `0 2px 14px ${C.gold}55` }}>
            Orders
          </h1>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: C.muted, marginTop: 3 }}>
            {orders.length} orders · {orders.filter(o => o.status === "Pending" || o.status === "Preparing").length} active
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: C.bg, ...sPressed, width: 200 }}>
            <Search size={13} style={{ color: C.muted }} />
            <input type="text" placeholder="Search orders…" value={search} onChange={e => setSearch(e.target.value)}
              className="bg-transparent outline-none border-none flex-1"
              style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: C.fore }} />
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
            style={{ background: `linear-gradient(135deg, ${C.gold} 0%, ${C.goldDark} 100%)`, boxShadow: `0 4px 14px ${C.gold}50` }}>
            <Plus size={13} style={{ color: "#1A0C06" }} />
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 600, color: "#1A0C06" }}>New Order</span>
          </button>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
        {FILTERS.map(f => {
          const active = filter === f;
          return (
            <button key={f} onClick={() => setFilter(f)} className="px-4 py-1.5 rounded-full transition-all duration-200"
              style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: active ? 600 : 400,
                background: active ? C.gold : C.bg, color: active ? "#1A0C06" : C.muted,
                ...(active ? { boxShadow: `0 2px 10px ${C.gold}50` } : sSubtle) }}>
              {f}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="flex-1 rounded-2xl overflow-hidden flex flex-col" style={{ background: C.bg, ...sRaised }}>
        <div className="grid px-5 py-3 flex-shrink-0"
          style={{ gridTemplateColumns: "80px 1fr 1fr 80px 110px 90px 72px", borderBottom: `1px solid ${C.fore}10` }}>
          {["Order", "Customer", "Items", "Total", "Status", "Time", ""].map(h => (
            <span key={h} style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</span>
          ))}
        </div>
        <div className="flex-1 overflow-auto">
          {visible.map((order, i) => {
            const cfg = STATUS_CONFIG[order.status];
            const Icon = cfg.icon;
            return (
              <div key={order.id} className="grid px-5 py-3 items-center group transition-all duration-150"
                style={{ gridTemplateColumns: "80px 1fr 1fr 80px 110px 90px 72px",
                  borderBottom: i < visible.length - 1 ? `1px solid ${C.fore}08` : "none" }}
                onMouseEnter={e => (e.currentTarget.style.background = `${C.gold}08`)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 500, color: C.cobalt }}>{order.id}</span>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${C.gold}20`, fontSize: 9, fontWeight: 700, color: C.goldDark, fontFamily: "'Montserrat', sans-serif" }}>
                    {order.avatar}
                  </div>
                  <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: C.fore }}>{order.customer}</span>
                </div>
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: C.muted }}>{order.items}</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 500, color: C.fore }}>{order.total}</span>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit" style={{ background: cfg.bg }}>
                  <Icon size={10} style={{ color: cfg.color }} />
                  <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 600, color: cfg.color }}>{order.status}</span>
                </div>
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: C.muted }}>{order.time}</span>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => openEdit(order)} className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                    style={{ background: `${C.cobalt}15` }}
                    onMouseEnter={e => (e.currentTarget.style.background = `${C.cobalt}30`)}
                    onMouseLeave={e => (e.currentTarget.style.background = `${C.cobalt}15`)}>
                    <Pencil size={11} style={{ color: C.cobalt }} />
                  </button>
                  <button onClick={() => openDelete(order)} className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                    style={{ background: `${C.alertRed}15` }}
                    onMouseEnter={e => (e.currentTarget.style.background = `${C.alertRed}30`)}
                    onMouseLeave={e => (e.currentTarget.style.background = `${C.alertRed}15`)}>
                    <Trash2 size={11} style={{ color: C.alertRed }} />
                  </button>
                </div>
              </div>
            );
          })}
          {visible.length === 0 && (
            <div className="flex items-center justify-center h-32">
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: C.muted }}>No orders match your filter.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {modal === "add" && (
        <Modal title="New Order" onClose={() => setModal(null)} onConfirm={handleAdd} confirmLabel="Create Order">
          <Field label="Customer Name"><input style={inputStyle} value={form.customer} onChange={e => F("customer", e.target.value)} placeholder="e.g. Jane Smith" /></Field>
          <Field label="Items"><input style={inputStyle} value={form.items} onChange={e => F("items", e.target.value)} placeholder="e.g. Choc Chunk ×12" /></Field>
          <Field label="Total"><input style={inputStyle} value={form.total} onChange={e => F("total", e.target.value)} placeholder="e.g. $36.00" /></Field>
          <Field label="Status">
            <select style={inputStyle} value={form.status} onChange={e => F("status", e.target.value as OrderStatus)}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
        </Modal>
      )}

      {/* Edit Modal */}
      {modal === "edit" && selected && (
        <Modal title={`Edit Order ${selected.id}`} onClose={() => setModal(null)} onConfirm={handleEdit} confirmLabel="Save Changes">
          <Field label="Customer Name"><input style={inputStyle} value={form.customer} onChange={e => F("customer", e.target.value)} /></Field>
          <Field label="Items"><input style={inputStyle} value={form.items} onChange={e => F("items", e.target.value)} /></Field>
          <Field label="Total"><input style={inputStyle} value={form.total} onChange={e => F("total", e.target.value)} /></Field>
          <Field label="Status">
            <select style={inputStyle} value={form.status} onChange={e => F("status", e.target.value as OrderStatus)}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
        </Modal>
      )}

      {/* Delete Modal */}
      {modal === "delete" && selected && (
        <Modal title="Delete Order" onClose={() => setModal(null)} onConfirm={handleDelete}
          confirmLabel="Delete" confirmColor={C.alertRed}>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: C.fore }}>
            Are you sure you want to delete order <strong>{selected.id}</strong> for <strong>{selected.customer}</strong>?
          </p>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: C.muted, marginTop: 8 }}>This action cannot be undone.</p>
        </Modal>
      )}
    </div>
  );
}
