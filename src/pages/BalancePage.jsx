import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import useBalanceStore from "../store/balanceStore";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";

const BalancePage = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);

  const { balance, loading, error, setError, fetchBalance, resetBalance } = useBalanceStore();

  const handleCheckBalance = async () => {
    if (pin.length !== 6) { setError("Enter a valid 6-digit UPI PIN"); return; }
    await fetchBalance(pin);
    setPin("");
  };

  useEffect(() => {
    resetBalance();
    return () => resetBalance();
  }, []);

  return (
    <PageTransition>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-8 w-full max-w-md border"
          style={{ backgroundColor: "var(--color-bg-card)", borderColor: "var(--color-border)" }}
        >
          <h2 className="text-2xl font-semibold text-center" style={{ color: "var(--color-text)" }}>
            Check Account Balance
          </h2>
          <p className="text-sm text-center mt-1" style={{ color: "var(--color-text-secondary)" }}>
            Enter UPI PIN to view balance
          </p>

          {/* PIN Input */}
          <div className="mt-6 relative">
            <input
              type={showPin ? "text" : "password"}
              value={pin}
              maxLength={6}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter 6-digit UPI PIN"
              className="w-full rounded-xl px-4 py-3 pr-12 border focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{
                backgroundColor: "var(--color-bg-secondary)",
                borderColor: "var(--color-border)",
                color: "var(--color-text)",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="absolute right-3 top-3"
              style={{ color: "var(--color-text-muted)" }}
            >
              {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 p-3 rounded-lg text-sm" style={{ backgroundColor: "var(--color-danger-light)", color: "var(--color-danger)" }}>
              {error}
            </div>
          )}

          {/* Balance */}
          {balance !== null && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-6 rounded-xl p-4 text-center"
              style={{ backgroundColor: "var(--color-success-light)" }}
            >
              <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>Available Balance</p>
              <p className="text-3xl font-bold mt-1" style={{ color: "var(--color-text)" }}>₹{balance}</p>
            </motion.div>
          )}

          {/* Buttons */}
          <div className="mt-6 space-y-3">
            <button
              onClick={handleCheckBalance}
              disabled={loading}
              className="w-full text-white py-3 rounded-xl font-semibold transition disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #4f46e5, #6366f1)" }}
            >
              {loading ? "Checking..." : "Check Balance"}
            </button>
            <button
              onClick={() => { resetBalance(); navigate("/dashboard"); }}
              className="w-full py-3 rounded-xl font-medium border transition"
              style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}
            >
              Back to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default BalancePage;
