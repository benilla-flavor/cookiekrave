import { useState } from "react";
import { ShieldCheck, User, Bell, Lock, Palette, Save, ChevronRight, Check } from "lucide-react";

const C = {
  bg: "#EDE8DE", sl: "#F8F4EC", sd: "#BFBAA8",
  gold: "#C4A04A", goldLight: "#E8CC7A", goldDark: "#9A7A28",
  cobalt: "#1B3A8F", fore: "#3D2314", foreMid: "#7A5030",
  muted: "#9B8268", alertRed: "#B83232", successGreen: "#2A6B3E",
} as const;

const sRaised  = { boxShadow: `-8px -8px 16px ${C.sl}, 8px 8px 16px ${C.sd}` };
const sPressed = { boxShadow: `inset -4px -4px 8px ${C.sl}, inset 4px 4px 8px ${C.sd}` };
const sSubtle  = { boxShadow: `-4px -4px 8px ${C.sl}, 4px 4px 8px ${C.sd}` };

const SECTIONS = [
  { id: "profile",       label: "Profile",       icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security",      label: "Security",      icon: Lock },
  { id: "appearance",    label: "Appearance",    icon: Palette },
] as const;

type Section = typeof SECTIONS[number]["id"];

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} role="switch" aria-checked={on}
      className="relative flex-shrink-0 transition-all duration-300"
      style={{
        width: 40, height: 22, borderRadius: 11,
        background: on ? C.cobalt : C.bg,
        boxShadow: on
          ? `inset -2px -2px 5px rgba(0,0,0,0.3), inset 2px 2px 5px rgba(0,0,0,0.2), 0 0 10px ${C.cobalt}40`
          : `inset -2px -2px 5px ${C.sl}, inset 2px 2px 5px ${C.sd}`,
      }}>
      <div className="absolute top-1 transition-all duration-300"
        style={{ width: 14, height: 14, borderRadius: "50%", background: on ? "#fff" : C.muted, left: on ? 22 : 4, boxShadow: "0 1px 4px rgba(0,0,0,0.25)" }} />
    </button>
  );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-4" style={{ borderBottom: `1px solid ${C.fore}08` }}>
      <div>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600, color: C.fore }}>{label}</p>
        {description && <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: C.muted, marginTop: 2 }}>{description}</p>}
      </div>
      {children}
    </div>
  );
}

const fieldStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px", borderRadius: 12, border: "none", outline: "none",
  background: C.bg, boxShadow: `inset -3px -3px 6px ${C.sl}, inset 3px 3px 6px ${C.sd}`,
  fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: C.fore,
};

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState<Section>("profile");
  const [saved, setSaved] = useState(false);

  // ── Profile state (controlled) ──────────────────────────────────────────
  const [profile, setProfile] = useState({
    displayName: "Baker Pro",
    email: "admin@cookiekrave.co",
    phone: "+1 (555) 000-0000",
    bakeryName: "Cookie Krave",
  });
  const [savedProfile, setSavedProfile] = useState({ ...profile });

  // ── Notifications state ─────────────────────────────────────────────────
  const [notifs, setNotifs] = useState({ orders: true, lowStock: true, dailyReport: false, marketing: false });

  // ── Security state ──────────────────────────────────────────────────────
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [pwError, setPwError] = useState("");
  const [twoFA, setTwoFA] = useState(false);

  // ── Appearance state ────────────────────────────────────────────────────
  const [activeTheme, setActiveTheme] = useState("Warm Parchment");

  const handleSave = () => {
    // Profile validation
    if (activeSection === "profile") {
      if (!profile.displayName.trim() || !profile.email.trim()) return;
      setSavedProfile({ ...profile });
    }
    // Security validation
    if (activeSection === "security") {
      if (passwords.next && passwords.next !== passwords.confirm) {
        setPwError("New passwords do not match.");
        return;
      }
      setPwError("");
      setPasswords({ current: "", next: "", confirm: "" });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const P = (k: keyof typeof profile, v: string) => setProfile(p => ({ ...p, [k]: v }));

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
        <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-200"
          style={{
            background: saved ? `linear-gradient(135deg, ${C.successGreen} 0%, #34A85A 100%)` : `linear-gradient(135deg, ${C.gold} 0%, ${C.goldDark} 100%)`,
            boxShadow: `0 4px 14px ${saved ? C.successGreen : C.gold}50`,
          }}>
          {saved ? <Check size={13} style={{ color: "#fff" }} /> : <Save size={13} style={{ color: "#1A0C06" }} />}
          <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 600, color: saved ? "#fff" : "#1A0C06" }}>
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
              <button key={id} onClick={() => setActiveSection(id)}
                className="flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-left"
                style={{ background: active ? `${C.gold}18` : C.bg, ...(active ? { boxShadow: `0 0 0 1.5px ${C.gold}40, ${sRaised.boxShadow}` } : sSubtle), borderLeft: active ? `2.5px solid ${C.gold}` : "2.5px solid transparent" }}>
                <div className="flex items-center gap-2.5">
                  <Icon size={14} style={{ color: active ? C.gold : C.muted }} />
                  <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: active ? 600 : 400, color: active ? C.fore : C.muted }}>{label}</span>
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
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 600, color: C.fore }}>{savedProfile.displayName}</span>
              </div>
              <div className="px-2 py-0.5 rounded-full w-fit" style={{ background: `${C.gold}20` }}>
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 9, fontWeight: 700, color: C.goldDark, textTransform: "uppercase", letterSpacing: "0.08em" }}>Administrator</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content panel */}
        <div className="flex-1 rounded-2xl p-6 overflow-auto" style={{ background: C.bg, ...sRaised }}>

          {/* ── Profile ── */}
          {activeSection === "profile" && (
            <div>
              <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 15, fontWeight: 600, color: C.fore, marginBottom: 20 }}>Profile Settings</h2>
              <div className="flex items-center gap-4 mb-6 pb-6" style={{ borderBottom: `1px solid ${C.fore}08` }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${C.gold}50, ${C.goldDark}70)`, border: `2px solid ${C.gold}55`, fontSize: 28 }}>
                  👨‍🍳
                </div>
                <div>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, fontWeight: 600, color: C.fore }}>{savedProfile.displayName}</p>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: C.muted }}>{savedProfile.email}</p>
                </div>
              </div>

              {([
                { label: "Display Name",  key: "displayName" as const, type: "text" },
                { label: "Email Address", key: "email"       as const, type: "email" },
                { label: "Phone",         key: "phone"       as const, type: "tel" },
                { label: "Bakery Name",   key: "bakeryName"  as const, type: "text" },
              ]).map(f => (
                <div key={f.key} className="mb-4">
                  <label style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    value={profile[f.key]}
                    onChange={e => P(f.key, e.target.value)}
                    style={fieldStyle}
                  />
                </div>
              ))}
            </div>
          )}

          {/* ── Notifications ── */}
          {activeSection === "notifications" && (
            <div>
              <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 15, fontWeight: 600, color: C.fore, marginBottom: 20 }}>Notification Preferences</h2>
              <SettingRow label="New Order Alerts" description="Get notified when a new order is placed">
                <Toggle on={notifs.orders} onToggle={() => setNotifs(n => ({ ...n, orders: !n.orders }))} />
              </SettingRow>
              <SettingRow label="Low Stock Warnings" description="Alert when inventory falls below threshold">
                <Toggle on={notifs.lowStock} onToggle={() => setNotifs(n => ({ ...n, lowStock: !n.lowStock }))} />
              </SettingRow>
              <SettingRow label="Daily Summary Report" description="Receive end-of-day performance summary">
                <Toggle on={notifs.dailyReport} onToggle={() => setNotifs(n => ({ ...n, dailyReport: !n.dailyReport }))} />
              </SettingRow>
              <SettingRow label="Marketing Emails" description="Promotions and product updates">
                <Toggle on={notifs.marketing} onToggle={() => setNotifs(n => ({ ...n, marketing: !n.marketing }))} />
              </SettingRow>
            </div>
          )}

          {/* ── Security ── */}
          {activeSection === "security" && (
            <div>
              <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 15, fontWeight: 600, color: C.fore, marginBottom: 20 }}>Security</h2>
              {([
                { label: "Current Password",     key: "current"  as const },
                { label: "New Password",          key: "next"     as const },
                { label: "Confirm New Password",  key: "confirm"  as const },
              ]).map(f => (
                <div key={f.key} className="mb-4">
                  <label style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>
                    {f.label}
                  </label>
                  <input type="password" value={passwords[f.key]}
                    onChange={e => setPasswords(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder="••••••••" style={fieldStyle} />
                </div>
              ))}
              {pwError && <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: C.alertRed, marginBottom: 12 }}>{pwError}</p>}

              <div className="mt-4 p-4 rounded-xl flex items-center justify-between" style={{ background: `${C.cobalt}10`, border: `1px solid ${C.cobalt}25` }}>
                <div>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 600, color: C.cobalt }}>Two-Factor Authentication</p>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: C.muted, marginTop: 4 }}>
                    {twoFA ? "2FA is enabled on your account." : "Add an extra layer of security."}
                  </p>
                </div>
                <button onClick={() => setTwoFA(v => !v)} className="px-4 py-2 rounded-lg flex-shrink-0"
                  style={{ background: twoFA ? C.alertRed : C.cobalt, color: "#fff", fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 600 }}>
                  {twoFA ? "Disable 2FA" : "Enable 2FA"}
                </button>
              </div>
            </div>
          )}

          {/* ── Appearance ── */}
          {activeSection === "appearance" && (
            <div>
              <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 15, fontWeight: 600, color: C.fore, marginBottom: 20 }}>Appearance</h2>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: C.muted, marginBottom: 16 }}>Choose your dashboard theme</p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { name: "Warm Parchment", bg: "#EDE8DE", accent: C.gold },
                  { name: "Dark Roast",     bg: "#1C1008", accent: C.gold },
                  { name: "Cobalt Cream",   bg: "#E8EDF8", accent: C.cobalt },
                ].map(theme => {
                  const isActive = activeTheme === theme.name;
                  return (
                    <div key={theme.name} onClick={() => setActiveTheme(theme.name)}
                      className="p-3 rounded-xl cursor-pointer transition-all duration-200"
                      style={{ background: theme.bg, border: isActive ? `2px solid ${theme.accent}` : "2px solid transparent", boxShadow: isActive ? `0 0 12px ${theme.accent}40` : "0 2px 8px rgba(0,0,0,0.1)" }}>
                      <div className="w-full h-10 rounded-lg mb-2" style={{ background: theme.accent, opacity: 0.3 }} />
                      <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 600, color: isActive ? theme.accent : "#888", textAlign: "center" }}>{theme.name}</p>
                      {isActive && <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 9, color: theme.accent, textAlign: "center", marginTop: 2 }}>Active</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
