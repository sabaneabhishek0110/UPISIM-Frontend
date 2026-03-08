import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import usePaymentStore from "../store/paymentStore";
import PageTransition from "../components/PageTransition";

const PayDetails = () => {
  const navigate = useNavigate();
  const { receiver, amount, message, selectedAccount, status, setPaymentDetails, setStatus } = usePaymentStore();

  if (!receiver) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <p className="font-medium" style={{ color: "var(--color-danger)" }}>
          No receiver selected. Please search UPI ID first.
        </p>
      </div>
    );
  }

  const handlePayClick = () => {
    if (!amount || Number(amount) <= 0) { alert("Please enter a valid amount"); return; }
    setStatus("confirming");
    navigate("/pay/pin");
  };

  const inputStyle = {
    backgroundColor: "var(--color-bg-secondary)",
    borderColor: "var(--color-border)",
    color: "var(--color-text)",
  };

  return (
    <PageTransition>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-2xl p-6 space-y-6 border"
          style={{ backgroundColor: "var(--color-bg-card)", borderColor: "var(--color-border)" }}
        >
          {/* Receiver */}
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full flex items-center justify-center text-white text-xl font-bold"
              style={{ background: "linear-gradient(135deg, #4f46e5, #6366f1)" }}>
              {receiver.name?.charAt(0)}
            </div>
            <div>
              <p className="font-semibold" style={{ color: "var(--color-text)" }}>{receiver.name}</p>
              <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{receiver.upiId}</p>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setPaymentDetails({ amount: e.target.value, message })}
              placeholder="₹ 0.00"
              className="w-full mt-1 text-2xl font-semibold px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={inputStyle}
            />
          </div>

          {/* Message */}
          <div>
            <label className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>Message (optional)</label>
            <input
              type="text"
              value={message}
              onChange={(e) => setPaymentDetails({ amount, message: e.target.value })}
              placeholder="Add a note"
              className="w-full mt-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={inputStyle}
            />
          </div>

          {/* Debit Account */}
          <div className="rounded-xl p-4" style={{ backgroundColor: "var(--color-bg-secondary)" }}>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Paying from</p>
            <p className="font-medium" style={{ color: "var(--color-text)" }}>{selectedAccount?.bank}</p>
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{selectedAccount?.vpa}</p>
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePayClick}
            disabled={status === "confirming"}
            className="w-full text-white py-3 rounded-xl font-semibold transition disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #4f46e5, #6366f1)" }}
          >
            Continue
          </button>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default PayDetails;
