import { useState } from "react";
import { ShieldCheck, User, Bell, Lock, Palette, Save, ChevronRight } from "lucide-react";

const C = {
  bg: "#EDE8DE", sl: "#F8F4EC", sd: "#BFBAA8",
  gold: "#C4A04A", goldLight: "#E8CC7A", goldDark: "#9A7A28",
  cobalt: "#1B3A8F", fore: "#3D2314", foreMid: "#7A5030",
  muted: "#9B8268", alertRed: "#B83232", successGreen: "#2A6B3E",
} as const;

const sRaised = { boxShadow: `-8px -8px 16px ${C.sl}, 8px 8px 16px ${C.sd}` };
const sPressed = { boxShadow: `inset -4px -4px 8px ${C.sl}, inset 4px 4px 8px ${C.sd}` };
const sSubtle = { boxShadow: `-4px -4px 8px ${C.sl}, 4px 4px 8px ${C.sd}` };

const SECTIONS = [
  { id: "profile",       label: "Profile",       icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security",      label: "Security",      icon: Lock },
  { id: "appearance",    label: "Appearance",    icon: Palette },
] as const;

type Section = typeof SECTIONS[number]["id"];

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="relative flex-shrink-0 transition-all duration-300"
      style={{
        width: 40, height: 22, borderRadius: 11,
        background: on ? C.cobalt : C.bg,
        ...sPressed,
        boxShadow: on
          ? `inset -2px -2px 5px rgba(0,0,0,0.3), inset 2px 2px 5px rgba(0,0,0,0.2), 0 0 10px ${C.cobalt}40`
          : `inset -2px -2px 5px ${C.sl}, inset 2px 2px 5px ${C.sd}`,
      }}
      aria-checked={on}
      role="switch"
    >
      <div
        className="absolute top-1 transition-all duration-300"
        style={{
          width: 14, height: 14, borderRadius: "50%",
          background: on ? "#fff" : C.muted,
          left: on ? 22 : 4,
          boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
        }}
      />
    </button>
  );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-4" style={{ borderBottom: `1px solid ${C.fore}08` }}>
      <div>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: C.fore }}>{label}</p>
        {description && (
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: C.muted, marginTop: 2 }}>{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState<Section>("profile");
  const [notifs, setNotifs] = useState({ orders: true, lowStock: true, dailyReport: false, marketing: false });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col h-full px-7 pt-6 pb-7 gap-5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 26, fontWeight: 700, color: C.gold, letterSpacing: "0.05em", textShadow: `0 2px 14px ${C.gold}55` }}>
            Admin
          </h1>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: C.muted, marginTop: 3 }}>
            Settings &amp; configuration
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-200"
          style={{
            background: saved
              ? `linear-gradient(135deg, ${C.successGreen} 0%, #34A85A 100%)`
              : `linear-gradient(135deg, ${C.gold} 0%, ${C.goldDark} 100%)`,
            boxShadow: `0 4px 14px ${saved ? C.successGreen : C.gold}50`,
          }}
        >
          <Save size={13} style={{ color: "#1A0C06" }} />
          <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 600, color: "#1A0C06" }}>
            {saved ? "Saved!" : "Save Changes"}
          </span>
        </button>
      </div>

      <div className="flex gap-5 flex-1 overflow-hidden">
        {/* Sidebar nav */}
        <div className="flex flex-col gap-1 flex-shrink-0" style={{ width: 180 }}>
          {SECTIONS.map(({ id, label, icon: Icon }) => {
            const active = activeSection === id;
            return (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className="flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-left"
                style={{
                  background: active ? `${C.gold}18` : C.bg,
                  ...(active ? { boxShadow: `0 0 0 1.5px ${C.gold}40, ${sRaised.boxShadow}` } : sSubtle),
                  borderLeft: active ? `2.5px solid ${C.gold}` : "2.5px solid transparent",
                }}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={14} style={{ color: active ? C.gold : C.muted }} />
                  <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: active ? 600 : 400, color: active ? C.fore : C.muted }}>
                    {label}
                  </span>
                </div>
                <ChevronRight size={12} style={{ color: active ? C.gold : C.muted }} />
              </button>
            );
          })}

          {/* Role badge */}
          <div className="mt-auto pt-4">
            <div className="p-3 rounded-xl" style={{ background: C.bg, ...sPressed }}>
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={13} style={{ color: C.gold }} />
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 600, color: C.fore }}>Baker Pro</span>
              </div>
              <div
                className="px-2 py-0.5 rounded-full w-fit"
                style={{ background: `${C.gold}20` }}
              >
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 9, fontWeight: 700, color: C.goldDark, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Administrator
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content panel */}
        <div className="flex-1 rounded-2xl p-6 overflow-auto" style={{ background: C.bg, ...sRaised }}>

          {activeSection === "profile" && (
            <div>
              <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 15, fontWeight: 600, color: C.fore, marginBottom: 20 }}>Profile Settings</h2>
              {/* Avatar */}
              <div className="flex items-center gap-4 mb-6 pb-6" style={{ borderBottom: `1px solid ${C.fore}08` }}>
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${C.gold}50, ${C.goldDark}70)`, border: `2px solid ${C.gold}55`, fontSize: 28 }}
                >
                  👨‍🍳
                </div>
                <div>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 600, color: C.fore }}>Baker Pro</p>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: C.muted }}>admin@cookiekrave.co</p>
                  <button className="mt-1 px-3 py-1 rounded-lg" style={{ background: C.bg, ...sSubtle, fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: C.cobalt, fontWeight: 600 }}>
                    Change Photo
                  </button>
                </div>
              </div>
              {/* Fields */}
              {[
                { label: "Display Name", value: "Baker Pro" },
                { label: "Email Address", value: "admin@cookiekrave.co" },
                { label: "Phone", value: "+1 (555) 000-0000" },
                { label: "Bakery Name", value: "Cookie Krave" },
              ].map((field) => (
                <div key={field.label} className="mb-4">
                  <label style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>
                    {field.label}
                  </label>
                  <input
                    defaultValue={field.value}
                    className="w-full px-4 py-2.5 rounded-xl outline-none"
                    style={{ background: C.bg, ...sPressed, fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: C.fore, border: "none" }}
                  />
                </div>
              ))}
            </div>
          )}

          {activeSection === "notifications" && (
            <div>
              <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 15, fontWeight: 600, color: C.fore, marginBottom: 20 }}>Notification Preferences</h2>
              <SettingRow label="New Order Alerts" description="Get notified when a new order is placed">
                <Toggle on={notifs.orders} onToggle={() => setNotifs((n) => ({ ...n, orders: !n.orders }))} />
              </SettingRow>
              <SettingRow label="Low Stock Warnings" description="Alert when inventory falls below threshold">
                <Toggle on={notifs.lowStock} onToggle={() => setNotifs((n) => ({ ...n, lowStock: !n.lowStock }))} />
              </SettingRow>
              <SettingRow label="Daily Summary Report" description="Receive end-of-day performance summary">
                <Toggle on={notifs.dailyReport} onToggle={() => setNotifs((n) => ({ ...n, dailyReport: !n.dailyReport }))} />
              </SettingRow>
              <SettingRow label="Marketing Emails" description="Promotions and product updates">
                <Toggle on={notifs.marketing} onToggle={() => setNotifs((n) => ({ ...n, marketing: !n.marketing }))} />
              </SettingRow>
            </div>
          )}

          {activeSection === "security" && (
            <div>
              <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 15, fontWeight: 600, color: C.fore, marginBottom: 20 }}>Security</h2>
              {[
                { label: "Current Password", placeholder: "••••••••" },
                { label: "New Password", placeholder: "••••••••" },
                { label: "Confirm New Password", placeholder: "••••••••" },
              ].map((field) => (
                <div key={field.label} className="mb-4">
                  <label style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>
                    {field.label}
                  </label>
                  <input
                    type="password"
                    placeholder={field.placeholder}
                    className="w-full px-4 py-2.5 rounded-xl outline-none"
                    style={{ background: C.bg, ...sPressed, fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: C.fore, border: "none" }}
                  />
                </div>
              ))}
              <div className="mt-6 p-4 rounded-xl" style={{ background: `${C.cobalt}10`, border: `1px solid ${C.cobalt}25` }}>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 600, color: C.cobalt }}>Two-Factor Authentication</p>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: C.muted, marginTop: 4 }}>Add an extra layer of security to your account.</p>
                <button className="mt-3 px-4 py-2 rounded-lg" style={{ background: C.cobalt, color: "#fff", fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 600 }}>
                  Enable 2FA
                </button>
              </div>
            </div>
          )}

          {activeSection === "appearance" && (
            <div>
              <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 15, fontWeight: 600, color: C.fore, marginBottom: 20 }}>Appearance</h2>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: C.muted, marginBottom: 16 }}>Choose your dashboard theme</p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { name: "Warm Parchment", bg: "#EDE8DE", accent: C.gold, active: true },
                  { name: "Dark Roast",     bg: "#1C1008", accent: C.gold, active: false },
                  { name: "Cobalt Cream",   bg: "#E8EDF8", accent: C.cobalt, active: false },
                ].map((theme) => (
                  <div
                    key={theme.name}
                    className="p-3 rounded-xl cursor-pointer transition-all duration-200"
                    style={{
                      background: theme.bg,
                      border: theme.active ? `2px solid ${theme.accent}` : `2px solid transparent`,
                      boxShadow: theme.active ? `0 0 12px ${theme.accent}40` : `0 2px 8px rgba(0,0,0,0.1)`,
                    }}
                  >
                    <div className="w-full h-10 rounded-lg mb-2" style={{ background: theme.accent, opacity: 0.3 }} />
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 600, color: theme.active ? theme.accent : "#888", textAlign: "center" }}>
                      {theme.name}
                    </p>
                    {theme.active && (
                      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 9, color: theme.accent, textAlign: "center", marginTop: 2 }}>Active</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
