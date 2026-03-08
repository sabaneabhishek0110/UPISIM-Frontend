import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useTransactionStore from "../store/transactionStore";

const TransactionDetailsModal = () => {
  const {
    selectedTransaction: txn,
    closeTransactionDetail,
    detailLoading,
  } = useTransactionStore();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  if (detailLoading || !txn) return null;

  const statusColor =
    txn.status === "SUCCESS" ? "var(--color-success)"
    : txn.status === "FAILED" ? "var(--color-danger)"
    : "#eab308";

  const rows = [
    ["Amount", `₹${txn.amount}`],
    ["Status", txn.status, statusColor],
    ["From", txn.payer_vpa],
    ["To", txn.payee_vpa],
    ["Transaction ID", txn.id],
    ["Date", new Date(txn.createdAt).toLocaleString()],
    txn.failureReason && ["Reason", txn.failureReason, "var(--color-danger)"],
  ].filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={closeTransactionDetail}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className="w-full max-w-lg rounded-2xl p-6 shadow-2xl"
        style={{
          backgroundColor: "var(--color-bg-card)",
          border: "1px solid var(--color-border)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold" style={{ color: "var(--color-text)" }}>Transaction Details</h3>
          <button
            onClick={closeTransactionDetail}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text-muted)" }}
          >
            ✕
          </button>
        </div>

        <div className="space-y-0">
          {rows.map((row, i) => (
            <div
              key={i}
              className="flex justify-between py-3 border-b"
              style={{ borderColor: "var(--color-border)" }}
            >
              <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>{row[0]}</span>
              <span
                className="text-sm font-medium text-right max-w-[60%] break-all"
                style={{ color: row[2] || "var(--color-text)" }}
              >
                {row[1]}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TransactionDetailsModal;
