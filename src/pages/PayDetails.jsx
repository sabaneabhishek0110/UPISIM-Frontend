import React from "react";
import { useNavigate } from "react-router-dom";
import usePaymentStore from "../store/paymentStore";
import useAuthStore from "../store/authStore";

const PayDetails = () => {
  const navigate = useNavigate();

  const {
    receiver,
    amount,
    message,
    selectedAccount,
    status,
    setPaymentDetails,
    setStatus,
  } = usePaymentStore();


  // 🚨 Guard: direct access protection
  if (!receiver) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 font-medium">
          No receiver selected. Please search UPI ID first.
        </p>
      </div>
    );
  }

  const handlePayClick = () => {
    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setStatus("confirming");
    navigate("/pay/pin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-6">

        {/* Receiver */}
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">
            {receiver.name?.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-gray-800">{receiver.name}</p>
            <p className="text-sm text-gray-500">{receiver.upiId}</p>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="text-sm font-medium text-gray-600">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) =>
              setPaymentDetails({ amount: e.target.value, message })
            }
            placeholder="₹ 0.00"
            className="w-full mt-1 text-2xl font-semibold px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Message */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            Message (optional)
          </label>
          <input
            type="text"
            value={message}
            onChange={(e) =>
              setPaymentDetails({ amount, message: e.target.value })
            }
            placeholder="Add a note"
            className="w-full mt-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Debit Account */}
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">Paying from</p>
          <p className="font-medium text-gray-800">
            {selectedAccount?.bank}
          </p>
          <p className="text-sm text-gray-600">
            {selectedAccount?.vpa}
          </p>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePayClick}
          disabled={status === "confirming"}
          className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-60"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default PayDetails;
