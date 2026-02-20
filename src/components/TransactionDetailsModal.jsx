import { useEffect } from "react";
import useTransactionStore from "../store/transactionStore";

const TransactionDetailsModal = () => {
  const {
    selectedTransaction: txn,
    closeTransactionDetail,
    detailLoading
  } = useTransactionStore();

  useEffect(() => {
    // Disable background scroll
    document.body.style.overflow = "hidden";

    return () => {
      // Re-enable scroll when modal closes
      document.body.style.overflow = "auto";
    };
  }, []);

  if (detailLoading || !txn) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-xl rounded-2xl p-6 shadow-lg">
        <div className="flex tems-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Transaction Details</h3>
          <button onClick={closeTransactionDetail}>✕</button>
        </div>

        {[
          ["Amount", `₹${txn.amount}`],
          ["Status", txn.status],
          ["From", txn.payer_vpa],
          ["To", txn.payee_vpa],
          ["Transaction ID", txn.id],
          ["Date", new Date(txn.createdAt).toLocaleString()],
          txn.failureReason && ["Reason", txn.failureReason]
        ].map(
          (row, i) =>
            row && (
              <div key={i} className="flex py-2 border-b gap-2">
                <span className="text-gray-500">{row[0]} : </span>
                <span className="font-medium">{row[1]}</span>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default TransactionDetailsModal;
