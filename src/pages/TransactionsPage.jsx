import { useEffect } from "react";
import TransactionCard from "../components/TransactionCard";
import TransactionDetailsModal from "../components/TransactionDetailsModal";
import useTransactionStore from "../store/transactionStore";

const TransactionsPage = () => {
  const {
    transactions,
    fetchTransactions,
    hasMore,
    loading,
    fetchTransactionDetail,
    selectedTransaction
  } = useTransactionStore();

  useEffect(() => {
    if (transactions.length === 0) {
      fetchTransactions();
      console.log("has more : ",hasMore);
      
    }
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>

      <div className="space-y-3">
        {transactions.map(txn => (
          <TransactionCard
            key={txn.id}
            txn={txn}
            onClick={fetchTransactionDetail}
          />
        ))}
      </div>

      {hasMore && (
        <button
          onClick={fetchTransactions}
          disabled={loading}
          className="w-full mt-6 py-3 bg-black text-white rounded-xl disabled:opacity-50"
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
  );
};

export default TransactionsPage;
