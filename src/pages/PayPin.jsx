import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import usePaymentStore from "../store/paymentStore";
import PageTransition from "../components/PageTransition";
import TestBanner from "../components/TestBanner";

const PayPin = () => {
  const navigate = useNavigate();
  const { receiver, amount, message, selectedAccount, initiatePayment, resetPayment } = usePaymentStore();
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  if (!receiver || !amount || !selectedAccount) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <p className="font-medium" style={{ color: "var(--color-danger)" }}>
          Invalid payment flow. Please start again.
        </p>
      </div>
    );
  }

  const handlePay = async () => {
    if (pin.length !== 6) { alert("Enter a valid 6-digit UPI PIN"); return; }
    setLoading(true);
    const result = await initiatePayment({ payeeVpa: receiver.vpa, amount, pin, message });
    setLoading(false);
    setPin("");
    navigate(result.success ? "/pay/success" : "/pay/failed");
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md rounded-2xl p-8 space-y-6 text-center border"
          style={{ backgroundColor: "var(--color-bg-card)", borderColor: "var(--color-border)" }}
        >
          <div className="flex justify-center">
            <div className="h-16 w-16 border-4 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: "var(--color-accent)", borderTopColor: "transparent" }} />
          </div>
          <p className="text-xl font-semibold" style={{ color: "var(--color-text)" }}>Processing Payment</p>
          <p style={{ color: "var(--color-text-secondary)" }}>Sending ₹{amount} to {receiver.name}</p>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Please do not close this page</p>
        </motion.div>
      </div>
    );
  }

  const inputStyle = {
    backgroundColor: "var(--color-bg-secondary)",
    borderColor: "var(--color-border)",
    color: "var(--color-text)",
  };

  return (
    <PageTransition>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <TestBanner variant="pin" currentUserVpa={selectedAccount?.vpa} />
          <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-2xl p-6 space-y-6 border"
          style={{ backgroundColor: "var(--color-bg-card)", borderColor: "var(--color-border)" }}
        >
          {/* Amount */}
          <div className="text-center">
            <p style={{ color: "var(--color-text-secondary)" }}>Paying</p>
            <p className="text-3xl font-bold" style={{ color: "var(--color-text)" }}>₹{amount}</p>
          </div>

          {/* Receiver */}
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold"
              style={{ background: "linear-gradient(135deg, #4f46e5, #6366f1)" }}>
              {receiver.name?.charAt(0)}
            </div>
            <div>
              <p className="font-semibold" style={{ color: "var(--color-text)" }}>{receiver.name}</p>
              <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{receiver.vpa}</p>
            </div>
          </div>

          {/* PIN Input */}
          <div className="text-center">
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>
              Enter UPI PIN
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              className="tracking-[0.5em] text-center text-2xl px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••"
              style={inputStyle}
            />
          </div>

          {/* Account Info */}
          <div className="rounded-xl p-4 text-sm" style={{ backgroundColor: "var(--color-bg-secondary)" }}>
            <p style={{ color: "var(--color-text-muted)" }}>Debiting from</p>
            <p className="font-medium" style={{ color: "var(--color-text)" }}>{selectedAccount.bank}</p>
            <p style={{ color: "var(--color-text-secondary)" }}>{selectedAccount.vpa}</p>
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full text-white py-3 rounded-xl font-semibold transition disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #4f46e5, #6366f1)" }}
          >
            Pay
          </button>

          <button
            onClick={() => { resetPayment(); navigate("/dashboard"); }}
            className="w-full text-sm hover:underline"
            style={{ color: "var(--color-text-muted)" }}
          >
            Cancel Payment
          </button>
        </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default PayPin;
