
import { motion } from "framer-motion";

const TransactionCard = ({ txn, currentVpa, onClick }) => {
  const isDebit = txn.payer_vpa === currentVpa;
  const counterparty = isDebit ? txn.payee_vpa : txn.payer_vpa;

  const statusColor =
    txn.status === "SUCCESS"
      ? "var(--color-success)"
      : txn.status === "FAILED"
      ? "var(--color-danger)"
      : "#eab308";

  return (
    <motion.div
      onClick={() => onClick(txn.id)}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="flex justify-between items-center p-4 rounded-xl cursor-pointer transition-colors"
      style={{
        backgroundColor: "var(--color-bg-card)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div className="flex gap-3 items-center">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
          style={{
            backgroundColor: isDebit ? "var(--color-danger-light)" : "var(--color-success-light)",
            color: isDebit ? "var(--color-danger)" : "var(--color-success)",
          }}
        >
          {isDebit ? "↑" : "↓"}
        </div>
        <div>
          <p className="font-medium text-sm" style={{ color: "var(--color-text)" }}>{counterparty}</p>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            {new Date(txn.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>₹{txn.amount}</p>
        <p className="text-xs font-medium" style={{ color: statusColor }}>{txn.status}</p>
      </div>
    </motion.div>
  );
};

export default TransactionCard;
