import { useEffect } from "react";
import { X } from "lucide-react";

const C = {
  bg: "#EDE8DE", sl: "#F8F4EC", sd: "#BFBAA8",
  gold: "#C4A04A", goldDark: "#9A7A28",
  fore: "#3D2314", muted: "#9B8268",
} as const;

interface ModalProps {
  title: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmLabel?: string;
  confirmColor?: string;
  children: React.ReactNode;
  width?: number;
}

export default function Modal({
  title, onClose, onConfirm, confirmLabel = "Save", confirmColor, children, width = 480,
}: ModalProps) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(17,9,5,0.65)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="flex flex-col rounded-2xl overflow-hidden"
        style={{
          width,
          background: C.bg,
          boxShadow: `-12px -12px 24px ${C.sl}, 12px 12px 24px ${C.sd}, 0 0 0 1px ${C.gold}25`,
          maxHeight: "90vh",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ borderBottom: `1px solid ${C.fore}10` }}
        >
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 15, fontWeight: 600, color: C.fore }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150"
            style={{ background: `${C.fore}10` }}
            onMouseEnter={(e) => (e.currentTarget.style.background = `${C.fore}20`)}
            onMouseLeave={(e) => (e.currentTarget.style.background = `${C.fore}10`)}
          >
            <X size={13} style={{ color: C.muted }} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto px-6 py-5">
          {children}
        </div>

        {/* Footer */}
        {onConfirm && (
          <div
            className="flex items-center justify-end gap-3 px-6 py-4 flex-shrink-0"
            style={{ borderTop: `1px solid ${C.fore}10` }}
          >
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl"
              style={{
                fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600,
                color: C.muted, background: C.bg,
                boxShadow: `-3px -3px 6px ${C.sl}, 3px 3px 6px ${C.sd}`,
              }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-5 py-2 rounded-xl"
              style={{
                fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 600,
                color: "#1A0C06",
                background: confirmColor
                  ? `linear-gradient(135deg, ${confirmColor} 0%, ${confirmColor}CC 100%)`
                  : `linear-gradient(135deg, ${C.gold} 0%, ${C.goldDark} 100%)`,
                boxShadow: `0 4px 14px ${confirmColor ?? C.gold}50`,
              }}
            >
              {confirmLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Reusable form field
export function Field({
  label, children,
}: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label style={{
        fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 600,
        color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em",
        display: "block", marginBottom: 6,
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 12,
  border: "none",
  outline: "none",
  background: C.bg,
  boxShadow: `inset -3px -3px 6px ${C.sl}, inset 3px 3px 6px ${C.sd}`,
  fontFamily: "'Montserrat', sans-serif",
  fontSize: 12,
  color: C.fore,
};
