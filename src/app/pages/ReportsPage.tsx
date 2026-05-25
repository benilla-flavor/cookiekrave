import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Package } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

const C = {
  bg: "#EDE8DE", sl: "#F8F4EC", sd: "#BFBAA8",
  gold: "#C4A04A", goldLight: "#E8CC7A", goldDark: "#9A7A28",
  cobalt: "#1B3A8F", cobaltHover: "#2547B0",
  fore: "#3D2314", foreMid: "#7A5030",
  muted: "#9B8268", alertRed: "#B83232", successGreen: "#2A6B3E",
} as const;

const sRaised = { boxShadow: `-8px -8px 16px ${C.sl}, 8px 8px 16px ${C.sd}` };
const sPressed = { boxShadow: `inset -4px -4px 8px ${C.sl}, inset 4px 4px 8px ${C.sd}` };

const WEEKLY_REVENUE = [
  { day: "Mon", revenue: 1200, orders: 18 },
  { day: "Tue", revenue: 1450, orders: 22 },
  { day: "Wed", revenue: 1100, orders: 16 },
  { day: "Thu", revenue: 1680, orders: 25 },
  { day: "Fri", revenue: 2100, orders: 31 },
  { day: "Sat", revenue: 2450, orders: 38 },
  { day: "Sun", revenue: 1800, orders: 27 },
];

const TOP_PRODUCTS = [
  { name: "Choc Chunk",   sales: 1240, revenue: 3720 },
  { name: "Snickerdoodle", sales: 980, revenue: 2695 },
  { name: "PB Cookie",    sales: 890,  revenue: 2670 },
  { name: "Sugar Cookie", sales: 760,  revenue: 1900 },
  { name: "Oatmeal",      sales: 670,  revenue: 1843 },
];

const KPI_CARDS = [
  { label: "Weekly Revenue",  value: "$11,780", change: "+14%", up: true,  icon: DollarSign, color: C.cobalt },
  { label: "Total Orders",    value: "177",     change: "+8%",  up: true,  icon: ShoppingBag, color: C.gold },
  { label: "New Customers",   value: "12",      change: "+3%",  up: true,  icon: Users,       color: C.successGreen },
  { label: "Avg Order Value", value: "$66.55",  change: "-2%",  up: false, icon: Package,     color: C.warningAmber },
] as const;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 rounded-xl" style={{ background: C.bg, boxShadow: `-4px -4px 8px ${C.sl}, 4px 4px 8px ${C.sd}`, border: `1px solid ${C.gold}20` }}>
      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 600, color: C.muted, marginBottom: 4 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: p.color }}>
          {p.dataKey === "revenue" ? `$${p.value.toLocaleString()}` : `${p.value} orders`}
        </p>
      ))}
    </div>
  );
};

export default function ReportsPage() {
  return (
    <div className="flex flex-col h-full px-7 pt-6 pb-7 gap-5 overflow-auto">
      {/* Header */}
      <div className="flex-shrink-0">
        <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 26, fontWeight: 700, color: C.gold, letterSpacing: "0.05em", textShadow: `0 2px 14px ${C.gold}55` }}>
          Reports
        </h1>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: C.muted, marginTop: 3 }}>
          Week of May 19 – 25, 2026
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4 flex-shrink-0">
        {KPI_CARDS.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="p-4 rounded-2xl flex flex-col gap-3" style={{ background: C.bg, ...sRaised }}>
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${kpi.color}18`, ...sPressed }}>
                  <Icon size={15} style={{ color: kpi.color }} />
                </div>
                <span
                  className="flex items-center gap-0.5 text-xs font-semibold"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 700, color: kpi.up ? C.successGreen : C.alertRed }}
                >
                  {kpi.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {kpi.change}
                </span>
              </div>
              <div>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 22, fontWeight: 500, color: C.fore, lineHeight: 1 }}>{kpi.value}</p>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: C.muted, marginTop: 4 }}>{kpi.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-5 flex-shrink-0" style={{ minHeight: 220 }}>
        {/* Revenue line chart */}
        <div className="p-5 rounded-2xl flex flex-col gap-3" style={{ background: C.bg, ...sRaised }}>
          <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 13, fontWeight: 600, color: C.fore, letterSpacing: "0.04em" }}>
            Revenue This Week
          </h3>
          <div style={{ flex: 1, minHeight: 150 }}>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={WEEKLY_REVENUE} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={`${C.fore}08`} />
                <XAxis dataKey="day" tick={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontFamily: "'DM Mono', monospace", fontSize: 9, fill: C.muted }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="revenue" stroke={C.cobalt} strokeWidth={2.5} dot={{ fill: C.cobalt, r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders bar chart */}
        <div className="p-5 rounded-2xl flex flex-col gap-3" style={{ background: C.bg, ...sRaised }}>
          <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 13, fontWeight: 600, color: C.fore, letterSpacing: "0.04em" }}>
            Orders Per Day
          </h3>
          <div style={{ flex: 1, minHeight: 150 }}>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={WEEKLY_REVENUE} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={`${C.fore}08`} />
                <XAxis dataKey="day" tick={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, fill: C.muted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontFamily: "'DM Mono', monospace", fontSize: 9, fill: C.muted }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="orders" fill={C.gold} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top products */}
      <div className="p-5 rounded-2xl flex flex-col gap-4 flex-shrink-0" style={{ background: C.bg, ...sRaised }}>
        <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 13, fontWeight: 600, color: C.fore, letterSpacing: "0.04em" }}>
          Top Products This Week
        </h3>
        <div className="flex flex-col gap-3">
          {TOP_PRODUCTS.map((p, i) => {
            const maxSales = TOP_PRODUCTS[0].sales;
            const pct = (p.sales / maxSales) * 100;
            return (
              <div key={p.name} className="flex items-center gap-4">
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.muted, width: 16, textAlign: "right" }}>
                  {i + 1}
                </span>
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: C.fore, width: 110, flexShrink: 0 }}>
                  {p.name}
                </span>
                <div className="flex-1" style={{ height: 10, borderRadius: 10, background: C.bg, ...sPressed }}>
                  <div
                    style={{
                      width: `${pct}%`, height: "100%", borderRadius: 10,
                      background: i === 0
                        ? `linear-gradient(90deg, ${C.gold}, ${C.goldLight})`
                        : `linear-gradient(90deg, ${C.cobalt}, ${C.cobaltHover})`,
                      transition: "width 0.6s",
                    }}
                  />
                </div>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.muted, width: 50, textAlign: "right" }}>
                  {p.sales}
                </span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 500, color: C.fore, width: 60, textAlign: "right" }}>
                  ${p.revenue.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


