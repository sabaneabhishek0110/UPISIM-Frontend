

const TransactionCard = ({ txn, onClick }) => {
  const isDebit = txn.type === "DEBIT";

  return (
    <div
      onClick={() => onClick(txn.id)}
      className="flex justify-between items-center bg-white p-4 rounded-xl shadow cursor-pointer hover:bg-gray-50"
    >
      <div className="flex gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center
          ${isDebit ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}
        >
          {isDebit ? "↑" : "↓"}
        </div>

        <div>
          <p className="font-medium">{txn.title}</p>
          <p className="text-sm text-gray-500">
            {new Date(txn.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="text-right">
        <p className="font-semibold">₹{txn.amount}</p>
        <p className={`text-sm ${
          txn.status === "SUCCESS"
            ? "text-green-600"
            : txn.status === "FAILED"
            ? "text-red-600"
            : "text-yellow-600"
        }`}>
          {txn.status}
        </p>
      </div>
    </div>
  );
};

export default TransactionCard;
