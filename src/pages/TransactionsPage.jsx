import { useEffect } from "react";
import { motion } from "framer-motion";
import TransactionCard from "../components/TransactionCard";
import TransactionDetailsModal from "../components/TransactionDetailsModal";
import useTransactionStore from "../store/transactionStore";
import useAuthStore from "../store/authStore";
import PageTransition from "../components/PageTransition";

const TransactionsPage = () => {
  const {
    transactions,
    fetchTransactions,
    hasMore,
    loading,
    fetchTransactionDetail,
    selectedTransaction,
  } = useTransactionStore();

  const currentVpa = useAuthStore((s) => s.user?.vpa);

  useEffect(() => {
    if (transactions.length === 0) fetchTransactions();
  }, []);

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--color-text)" }}>
          Transaction History
        </h2>

        <div className="space-y-3">
          {transactions.map((txn, i) => (
            <motion.div
              key={txn.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <TransactionCard txn={txn} currentVpa={currentVpa} onClick={fetchTransactionDetail} />
            </motion.div>
          ))}
        </div>

        {hasMore && (
          <button
            onClick={fetchTransactions}
            disabled={loading}
            className="w-full mt-6 py-3 rounded-xl font-medium text-white transition disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #4f46e5, #6366f1)" }}
          >
            {loading ? "Loading..." : "Show More"}
          </button>
        )}

        {selectedTransaction && (
          <div className="flex justify-center mt-10">
            <div className="relative">
              <TransactionDetailsModal />
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default TransactionsPage;
