import { useState } from "react";
import {
  Search, Home, ShoppingBag, Package, Archive,
  Users, BarChart2, ShieldCheck,
  CheckCircle2, AlertTriangle, TrendingUp,
  Bell, ChefHat, User,
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import OrdersPage from "./pages/OrdersPage";
import ProductsPage from "./pages/ProductsPage";
import InventoryPage from "./pages/InventoryPage";
import CustomersPage from "./pages/CustomersPage";
import ReportsPage from "./pages/ReportsPage";
import AdminPage from "./pages/AdminPage";

// ── Design tokens ──────────────────────────────────────────────────────────
const C = {
  bg:           "#EDE8DE",
  sl:           "#F8F4EC",
  sd:           "#BFBAA8",
  sidebar:      "#2C1810",
  sidebarEnd:   "#1C0E08",
  gold:         "#C4A04A",
  goldLight:    "#E8CC7A",
  goldDark:     "#9A7A28",
  cobalt:       "#1B3A8F",
  cobaltHover:  "#2547B0",
  fore:         "#3D2314",
  foreMid:      "#7A5030",
  muted:        "#9B8268",
  alertRed:     "#B83232",
  warningAmber: "#C47A1E",
  successGreen: "#2A6B3E",
} as const;

const sRaised  = { boxShadow: `-8px -8px 16px ${C.sl}, 8px 8px 16px ${C.sd}` };
const sSubtle  = { boxShadow: `-4px -4px 8px ${C.sl}, 4px 4px 8px ${C.sd}` };
const sPressed = { boxShadow: `inset -4px -4px 8px ${C.sl}, inset 4px 4px 8px ${C.sd}` };

const sparkData = [
  { v: 1200 }, { v: 1450 }, { v: 1100 }, { v: 1600 }, { v: 1350 }, { v: 1800 },
];

// ── AlertCard ──────────────────────────────────────────────────────────────
function AlertCard({ icon: Icon, iconColor, iconBg, title, subtitle, dot }: {
  icon: React.ElementType; iconColor: string; iconBg: string;
  title: string; subtitle: string; dot: string;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-200"
      style={{ background: C.bg, ...sRaised, ...(hov ? { boxShadow: `-6px -6px 12px ${C.sl}, 6px 6px 12px ${C.sd}, 0 0 0 1.5px ${C.gold}45` } : {}) }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: iconBg }}>
        <Icon size={16} style={{ color: iconColor }} />
      </div>
      <div className="flex-1 min-w-0">
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 600, color: C.fore, lineHeight: 1.3 }}>{title}</p>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: C.muted, marginTop: 1, lineHeight: 1.3 }}>{subtitle}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-2 h-2 rounded-full" style={{ background: dot, boxShadow: `0 0 5px ${dot}` }} />
        <button className="px-3 py-1 rounded-lg text-xs font-semibold"
          style={{ background: C.cobalt, color: "#FFF", fontFamily: "'Montserrat', sans-serif", fontSize: 10, boxShadow: `0 2px 8px ${C.cobalt}50` }}>
          View
        </button>
      </div>
    </div>
  );
}

// ── VerticalBar ────────────────────────────────────────────────────────────
const BAR_H = 130;

function VerticalBar({ sections, total, typeLabel }: {
  sections: { value: number; gradient: string; label: string; color: string }[];
  total: number; typeLabel: string;
}) {
  // Build stacked segments from bottom up, each as a % of total height
  let bottomPct = 0;
  const segs = sections.map(s => {
    const heightPct = (s.value / total) * 100;
    const seg = { ...s, heightPct, bottomPct };
    bottomPct += heightPct;
    return seg;
  });

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Bar track */}
      <div style={{ width: 52, height: BAR_H, borderRadius: 16, overflow: "hidden", background: C.bg, ...sPressed, position: "relative" }}>
        {segs.map((s, i) => (
          <div key={i} style={{
            position: "absolute",
            bottom: `${s.bottomPct}%`,
            left: 0, right: 0,
            height: `${s.heightPct}%`,
            background: s.gradient,
            // Only round the top of the topmost segment
            borderRadius: i === segs.length - 1 ? "14px 14px 0 0" : 0,
          }} />
        ))}
      </div>
      {/* Value label */}
      <div className="text-center">
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 500, color: C.fore }}>
          {sections.map(s => s.value).join("/")}
        </span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.muted }}>/{total}</span>
      </div>
      {/* Legend */}
      <div className="flex flex-col gap-0.5 items-start">
        {sections.map(s => (
          <div key={s.label} className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: C.muted }}>{s.label}</span>
          </div>
        ))}
      </div>
      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 600, color: C.foreMid, textAlign: "center" }}>{typeLabel}</p>
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────
export default function App() {
  const [activeNav, setActiveNav] = useState("Home");

  const navItems = [
    { icon: Home,        label: "Home" },
    { icon: ShoppingBag, label: "Orders" },
    { icon: Package,     label: "Products" },
    { icon: Archive,     label: "Inventory" },
    { icon: Users,       label: "Customers" },
    { icon: BarChart2,   label: "Reports" },
    { icon: ShieldCheck, label: "Admin" },
  ];

  const stockItems = [
    { emoji: "🍫", name: "Chocolate Chunk",    value: 15, total: 100, unit: "bags", status: "Low Stock",        statusColor: C.alertRed,     gradient: `linear-gradient(90deg, ${C.alertRed} 0%, #E07A1A 100%)`,         threshold: 25 },
    { emoji: "🥣", name: "Specialty Dough Mix", value: 28, total: 100, unit: "bags", status: "Below Threshold", statusColor: C.warningAmber, gradient: `linear-gradient(90deg, ${C.warningAmber} 0%, ${C.goldLight} 100%)`, threshold: 30 },
  ];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: C.bg }}>

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col py-6 px-3 flex-shrink-0"
        style={{ width: 184, background: `linear-gradient(180deg, ${C.sidebar} 0%, ${C.sidebarEnd} 100%)`, borderRight: `1px solid ${C.gold}18` }}>

        {/* Logo */}
        <div className="flex flex-col items-center gap-1.5 mb-7 px-1">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-1"
            style={{ background: `linear-gradient(135deg, ${C.gold} 0%, ${C.goldDark} 100%)`, boxShadow: `0 4px 18px ${C.gold}55, 0 0 0 1px ${C.goldLight}30` }}>
            <ChefHat size={20} style={{ color: "#1A0C06" }} />
          </div>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 14, fontWeight: 700, color: C.gold, letterSpacing: "0.14em", lineHeight: 1.25, textAlign: "center", textShadow: `0 0 20px ${C.gold}65` }}>Cookie</div>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 14, fontWeight: 400, color: C.goldLight, letterSpacing: "0.20em", lineHeight: 1.25, textAlign: "center" }}>Krave</div>
          <div className="w-full mt-1" style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.gold}45, transparent)` }} />
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-0.5 flex-1">
          {navItems.map(({ icon: Icon, label }) => {
            const active = activeNav === label;
            return (
              <button key={label} onClick={() => setActiveNav(label)}
                className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl transition-all duration-200 text-left"
                style={{ background: active ? `${C.gold}20` : "transparent", borderLeft: active ? `2.5px solid ${C.gold}` : "2.5px solid transparent" }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = `${C.gold}10`; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>
                <Icon size={15} style={{ color: active ? C.gold : "#7A5A3A", filter: active ? `drop-shadow(0 0 5px ${C.gold}90)` : "none", flexShrink: 0 }} />
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: active ? 600 : 400, color: active ? C.goldLight : "#8A6A4A", letterSpacing: active ? "0.02em" : "0" }}>
                  {label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Profile */}
        <div className="pt-4" style={{ borderTop: `1px solid ${C.gold}1E` }}>
          <button className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl transition-all duration-200"
            style={{ background: "transparent" }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = `${C.gold}14`; el.style.boxShadow = `0 0 18px ${C.gold}28`; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = "transparent"; el.style.boxShadow = "none"; }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${C.gold}50, ${C.goldDark}70)`, border: `1.5px solid ${C.gold}55` }}>
              <User size={13} style={{ color: C.goldLight }} />
            </div>
            <div className="text-left">
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 600, color: C.goldLight, lineHeight: 1.3 }}>Baker Pro</p>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: "#7A5A3A" }}>Admin</p>
            </div>
          </button>
        </div>
      </div>

      {/* ── Main Panel ──────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ background: C.bg }}>

        {/* Sub-pages */}
        {activeNav !== "Home" && (
          <div className="flex-1 overflow-hidden">
            {activeNav === "Orders"    && <OrdersPage />}
            {activeNav === "Products"  && <ProductsPage />}
            {activeNav === "Inventory" && <InventoryPage />}
            {activeNav === "Customers" && <CustomersPage />}
            {activeNav === "Reports"   && <ReportsPage />}
            {activeNav === "Admin"     && <AdminPage />}
          </div>
        )}

        {/* ── Home ──────────────────────────────────────────────────────── */}
        {activeNav === "Home" && <>
          {/* Header */}
          <div className="flex items-center justify-between px-7 pt-6 pb-4">
            <div>
              <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 26, fontWeight: 700, color: C.gold, letterSpacing: "0.05em", lineHeight: 1.2, textShadow: `0 2px 14px ${C.gold}55` }}>
                Dashboard
              </h1>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: C.muted, marginTop: 3 }}>
                Monday, May 25, 2026
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: C.bg, ...sPressed, width: 205 }}>
                <Search size={13} style={{ color: C.muted }} />
                <input type="text" placeholder="Search orders, products…" className="bg-transparent outline-none border-none flex-1"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: C.fore }} />
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center relative cursor-pointer" style={{ background: C.bg, ...sRaised }}>
                <Bell size={15} style={{ color: C.foreMid }} />
                <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: C.alertRed, boxShadow: `0 0 4px ${C.alertRed}` }} />
              </div>
            </div>
          </div>

          {/* Card grid */}
          <div className="flex-1 px-7 pb-7 grid grid-cols-2 gap-5 overflow-auto">

            {/* Card 1: Pending Orders */}
            <div className="p-5 rounded-2xl flex flex-col gap-4" style={{ background: C.bg, ...sRaised }}>
              <div className="flex items-center justify-between">
                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 13, fontWeight: 600, color: C.fore, letterSpacing: "0.04em" }}>Pending Orders</h3>
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 600, background: `${C.cobalt}18`, color: C.cobalt, padding: "2px 8px", borderRadius: 999 }}>Live</span>
              </div>
              <div className="flex gap-5 justify-center items-end flex-1 pb-1">
                <VerticalBar
                  sections={[
                    { value: 85, gradient: `linear-gradient(180deg, ${C.cobaltHover} 0%, ${C.cobalt} 100%)`, label: "Classic",   color: C.cobalt },
                    { value: 35, gradient: `linear-gradient(180deg, ${C.goldLight} 0%, ${C.gold} 100%)`,    label: "Specialty", color: C.gold },
                  ]}
                  total={120} typeLabel="Volume by Type"
                />
                <div className="self-stretch w-px mb-6" style={{ background: `${C.fore}12` }} />
                <VerticalBar
                  sections={[{ value: 42, gradient: `linear-gradient(180deg, #34A85A 0%, #1F6E3A 100%)`, label: "In Prep", color: "#34A85A" }]}
                  total={50} typeLabel="Prep Progress"
                />
              </div>
            </div>

            {/* Card 2: Today at a Glance */}
            <div className="p-5 rounded-2xl flex flex-col gap-3" style={{ background: C.bg, ...sRaised, border: `1px solid ${C.gold}22` }}>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 13, fontWeight: 600, color: C.fore, letterSpacing: "0.04em" }}>Today at a Glance</h3>
              <div className="flex items-center justify-between px-4 py-4 rounded-2xl"
                style={{ background: C.bg, boxShadow: `inset -3px -3px 7px ${C.sl}, inset 3px 3px 7px ${C.sd}, 0 0 0 1.5px ${C.gold}38` }}>
                <div>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Active Orders</p>
                  <p style={{ fontFamily: "'Cinzel', serif", fontSize: 34, fontWeight: 700, color: C.gold, lineHeight: 1.1, marginTop: 3, textShadow: `0 0 28px ${C.gold}65` }}>24</p>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${C.gold}1A`, ...sSubtle }}>
                  <ShoppingBag size={20} style={{ color: C.gold }} />
                </div>
              </div>
              <div className="flex flex-col px-4 py-3 rounded-2xl gap-2 flex-1"
                style={{ background: C.bg, boxShadow: `inset -3px -3px 7px ${C.sl}, inset 3px 3px 7px ${C.sd}, 0 0 0 1.5px ${C.cobalt}28` }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Today's Revenue</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <p style={{ fontFamily: "'Cinzel', serif", fontSize: 26, fontWeight: 700, color: C.fore, lineHeight: 1.1 }}>$1,800</p>
                      <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 700, color: C.successGreen }}>↑ 12%</span>
                    </div>
                  </div>
                  <TrendingUp size={16} style={{ color: C.cobalt, marginTop: 4 }} />
                </div>
                <div style={{ height: 52, marginTop: "auto" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparkData}>
                      <Line type="monotone" dataKey="v" stroke={C.cobalt} strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Card 3: Low Stock Alerts */}
            <div className="p-5 rounded-2xl flex flex-col gap-4" style={{ background: C.bg, ...sRaised }}>
              <div className="flex items-center justify-between">
                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 13, fontWeight: 600, color: C.fore, letterSpacing: "0.04em" }}>Low Stock Alerts</h3>
                <span className="flex items-center gap-1"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 600, background: `${C.alertRed}15`, color: C.alertRed, padding: "2px 8px", borderRadius: 999 }}>
                  <AlertTriangle size={9} /> 2 Critical
                </span>
              </div>
              <div className="flex flex-col gap-5 flex-1 justify-center">
                {stockItems.map(item => (
                  <div key={item.name} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: C.bg, ...sSubtle, fontSize: 16 }}>{item.emoji}</div>
                        <div>
                          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 600, color: C.fore }}>{item.name}</p>
                          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 600, color: item.statusColor }}>{item.status}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 500, color: C.fore }}>{item.value}</span>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.muted }}>/{item.total} {item.unit}</span>
                      </div>
                    </div>
                    <div className="relative" style={{ height: 10, borderRadius: 10, background: C.bg, ...sPressed }}>
                      <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                        style={{ width: `${(item.value / item.total) * 100}%`, background: item.gradient }} />
                      <div className="absolute top-1/2 -translate-y-1/2 w-px rounded-full z-10"
                        style={{ left: `${item.threshold}%`, height: 18, background: `${C.alertRed}80` }} />
                    </div>
                    <div className="flex justify-between">
                      <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 9, color: C.muted }}>0</span>
                      <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 9, color: `${C.alertRed}90` }}>← threshold at {item.threshold}%</span>
                      <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 9, color: C.muted }}>100</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 4: Recent Alerts */}
            <div className="p-5 rounded-2xl flex flex-col gap-4" style={{ background: C.bg, ...sRaised }}>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 13, fontWeight: 600, color: C.fore, letterSpacing: "0.04em" }}>Recent Alerts</h3>
              <div className="flex flex-col gap-3 flex-1 justify-center">
                <AlertCard icon={CheckCircle2} iconColor={C.successGreen} iconBg={`${C.successGreen}18`}
                  title="Order #3421 Complete — View" subtitle="Completed 2 min ago · Ready for pickup" dot={C.successGreen} />
                <AlertCard icon={AlertTriangle} iconColor={C.warningAmber} iconBg={`${C.warningAmber}18`}
                  title="White Chocolate Low — View" subtitle="Stock at 18% · Reorder needed" dot={C.warningAmber} />
                <AlertCard icon={ChefHat} iconColor={C.cobalt} iconBg={`${C.cobalt}18`}
                  title="Oatmeal Raisin Batch 4A — View" subtitle="Batch ready for oven · 12 dozen" dot={C.cobalt} />
              </div>
            </div>

          </div>
        </>}
      </div>
    </div>
  );
}
