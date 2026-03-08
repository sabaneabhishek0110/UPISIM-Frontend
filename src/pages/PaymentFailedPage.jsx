import { XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import usePaymentStore from "../store/paymentStore";
import PageTransition from "../components/PageTransition";

const PaymentFailedPage = () => {
  const navigate = useNavigate();
  const { failureReason, txnId, resetPayment } = usePaymentStore();

  return (
    <PageTransition>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md rounded-2xl p-8 text-center border"
          style={{ backgroundColor: "var(--color-bg-card)", borderColor: "var(--color-border)" }}
        >
          <XCircle className="mx-auto" size={72} style={{ color: "var(--color-danger)" }} />

          <h1 className="mt-4 text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
            Payment Failed
          </h1>

          <div className="mt-6 rounded-xl p-4 text-sm" style={{ backgroundColor: "var(--color-danger-light)" }}>
            <p className="font-medium" style={{ color: "var(--color-text-secondary)" }}>Reason</p>
            <p className="font-semibold" style={{ color: "var(--color-danger)" }}>
              {failureReason || "Insufficient balance / Network issue"}
            </p>
          </div>

          {txnId && (
            <div className="mt-4 rounded-xl p-4 text-left text-sm" style={{ backgroundColor: "var(--color-bg-secondary)" }}>
              <p className="font-medium" style={{ color: "var(--color-text-secondary)" }}>Transaction ID</p>
              <p className="mt-1 break-all" style={{ color: "var(--color-text-muted)" }}>{txnId}</p>
            </div>
          )}

          <div className="mt-6 space-y-3">
            <button
              onClick={() => { resetPayment(); navigate("/pay"); }}
              className="w-full text-white py-3 rounded-xl font-medium transition"
              style={{ backgroundColor: "var(--color-danger)" }}
            >
              Try Again
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full py-3 rounded-xl font-medium border transition"
              style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}
            >
              Go to Home
            </button>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default PaymentFailedPage;
