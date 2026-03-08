import { useState } from "react";
import { Info, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";

const u1 = {
  phone:    import.meta.env.VITE_TEST_USER1_PHONE,
  password: import.meta.env.VITE_TEST_USER1_PASSWORD,
  pin:      import.meta.env.VITE_TEST_USER1_PIN,
  upi:      import.meta.env.VITE_TEST_USER1_UPI,
};
const u2 = {
  phone:    import.meta.env.VITE_TEST_USER2_PHONE,
  password: import.meta.env.VITE_TEST_USER2_PASSWORD,
  pin:      import.meta.env.VITE_TEST_USER2_PIN,
  upi:      import.meta.env.VITE_TEST_USER2_UPI,
};

/** Given the logged-in user's VPA, return {self, other} user objects */
const resolveUsers = (currentVpa) => {
  if (!currentVpa) return { self: u1, other: u2 };
  const isU1 = u1.upi === currentVpa;
  return isU1 ? { self: u1, other: u2 } : { self: u2, other: u1 };
};

const CopyBtn = ({ value }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={copy}
      className="ml-1 p-0.5 rounded transition-opacity hover:opacity-80"
      title="Copy"
    >
      {copied
        ? <Check size={11} style={{ color: "#22c55e" }} />
        : <Copy size={11} style={{ color: "var(--color-accent)" }} />}
    </button>
  );
};

const Row = ({ label, value }) => (
  <div className="flex items-center gap-1.5 flex-wrap">
    <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
      {label}:
    </span>
    <code
      className="text-xs font-mono px-1.5 py-0.5 rounded"
      style={{ backgroundColor: "rgba(99,102,241,0.12)", color: "var(--color-accent)" }}
    >
      {value}
    </code>
    <CopyBtn value={value} />
  </div>
);

/**
 * variant options:
 *   "login"  → shows both users' phone + password (currentUserVpa not needed)
 *   "pin"    → shows only the CURRENT user's UPI PIN (pass currentUserVpa)
 *   "pay"    → shows only the OTHER user's UPI ID  (pass currentUserVpa)
 */
const TestBanner = ({ variant = "login", currentUserVpa }) => {
  const [open, setOpen] = useState(true);
  const { self, other } = resolveUsers(currentUserVpa);

  return (
    <div
      className="w-full mb-6 rounded-xl overflow-hidden border"
      style={{
        backgroundColor: "rgba(99,102,241,0.06)",
        borderColor: "rgba(99,102,241,0.25)",
      }}
    >
      {/* Header row */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-4 py-2.5 text-left"
      >
        <Info size={14} style={{ color: "var(--color-accent)", flexShrink: 0 }} />
        <span className="flex-1 text-xs font-semibold" style={{ color: "var(--color-accent)" }}>
          Test Credentials
        </span>
        {open
          ? <ChevronUp size={13} style={{ color: "var(--color-text-muted)" }} />
          : <ChevronDown size={13} style={{ color: "var(--color-text-muted)" }} />}
      </button>

      {/* Collapsible body */}
      {open && (
        <div
          className="px-4 pb-3 pt-0.5 border-t"
          style={{ borderColor: "rgba(99,102,241,0.15)" }}
        >
          {/* LOGIN — show both users side by side */}
          {variant === "login" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              {[{ label: "User 1", u: u1 }, { label: "User 2", u: u2 }].map(({ label, u }) => (
                <div key={label} className="space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-wide mt-2" style={{ color: "var(--color-text-muted)" }}>
                    {label}
                  </p>
                  <Row label="Phone"    value={u.phone} />
                  <Row label="Password" value={u.password} />
                </div>
              ))}
            </div>
          )}

          {/* PIN — show only the current user's PIN */}
          {variant === "pin" && (
            <div className="space-y-1.5 mt-2">
              <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>
                Your UPI PIN
              </p>
              <Row label="PIN" value={self.pin} />
            </div>
          )}

          {/* PAY — show only the OTHER user's UPI ID */}
          {variant === "pay" && (
            <div className="space-y-1.5 mt-2">
              <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>
                Recipient (other test user)
              </p>
              <Row label="UPI ID" value={other.upi} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TestBanner;
