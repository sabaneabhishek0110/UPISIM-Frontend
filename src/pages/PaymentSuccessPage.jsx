import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import usePaymentStore from "../store/paymentStore";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import PageTransition from "../components/PageTransition";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const { receiver, amount, txnId, selectedAccount, resetPayment } = usePaymentStore();

  useEffect(() => {
    if (!receiver || !amount) navigate("/dashboard");
  }, [receiver, amount, navigate]);

  const handleDone = () => { resetPayment(); navigate("/dashboard"); };

  if (!receiver || !amount) return null;

  const infoBox = { backgroundColor: "var(--color-bg-secondary)", borderRadius: "0.75rem", padding: "1rem", textAlign: "left" };

  return (
    <PageTransition>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md rounded-2xl p-6 text-center space-y-6 border"
          style={{ backgroundColor: "var(--color-bg-card)", borderColor: "var(--color-border)" }}
        >
          {/* Success Icon */}
          <div className="relative flex justify-center">
            <div className="absolute h-24 w-24 rounded-full animate-ring" style={{ backgroundColor: "var(--color-success)", opacity: 0.2 }} />
            <CheckCircleIcon className="h-20 w-20 animate-success z-10" style={{ color: "var(--color-success)" }} />
          </div>

          <div>
            <h2 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>Payment Successful</h2>
            <p className="mt-1" style={{ color: "var(--color-text-secondary)" }}>Your payment has been completed</p>
          </div>

          <div className="text-3xl font-bold" style={{ color: "var(--color-text)" }}>₹{amount}</div>

          <div style={infoBox} className="space-y-1">
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Paid to</p>
            <p className="font-medium" style={{ color: "var(--color-text)" }}>{receiver.name}</p>
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{receiver.vpa}</p>
          </div>

          <div style={infoBox} className="space-y-1">
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Transaction ID</p>
            <p className="font-medium break-all" style={{ color: "var(--color-text)" }}>{txnId}</p>
          </div>

          <div style={infoBox} className="space-y-1">
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Debited from</p>
            <p className="font-medium" style={{ color: "var(--color-text)" }}>{selectedAccount?.bankName}</p>
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{selectedAccount?.vpa}</p>
          </div>

          <button
            onClick={handleDone}
            className="w-full text-white py-3 rounded-xl font-semibold transition"
            style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}
          >
            Done
          </button>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default PaymentSuccessPage;
