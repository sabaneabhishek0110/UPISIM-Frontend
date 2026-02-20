import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import usePaymentStore from "../store/paymentStore";
import axios from "axios";

const PayPin = () => {
  const navigate = useNavigate();

  const {
    receiver,
    amount,
    message,
    selectedAccount,
    setStatus,
    setFailureReason,
    setTxnId,
    resetPayment,
    
  } = usePaymentStore();

  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  // 🚨 Guard: illegal access
  if (!receiver || !amount || !selectedAccount) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 font-medium">
          Invalid payment flow. Please start again.
        </p>
      </div>
    );
  }

  const handlePay = async () => {
    if (pin.length !== 6) {
      alert("Enter a valid 6-digit UPI PIN");
      return;
    }

    try {
      setLoading(true);
      setStatus("confirming");

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/payment/initiate`,
        {
          payeeVpa: receiver.vpa,
          amount,
          pin,
          message
        },
        { withCredentials: true }
      );
      console.log("Success : ",res.data);
      
      setTxnId(res.data.psp_txn_id);
      setStatus("success");
      navigate("/pay/success");
    } catch (err) {
      console.error(err);
      const res = err.response?.data;
      setStatus("failed");
      setFailureReason(res?.failureReason || "Payment failed Please try again.");
      setTxnId(res?.psp_txn_id || null);
      navigate("/pay/failed");
    } finally {
      setLoading(false);
      setPin("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-6">

        {/* Amount */}
        <div className="text-center">
          <p className="text-gray-500">Paying</p>
          <p className="text-3xl font-bold text-gray-800">₹{amount}</p>
        </div>

        {/* Receiver */}
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
            {receiver.name?.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-gray-800">{receiver.name}</p>
            <p className="text-sm text-gray-500">{receiver.vpa}</p>
          </div>
        </div>

        {/* PIN Input */}
        <div className="text-center">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Enter UPI PIN
          </label>
          <input
            type="password"
            inputMode="numeric"
            maxLength={6}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            className="tracking-[0.5em] text-center text-2xl px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="••••••"
          />
        </div>

        {/* Account Info */}
        <div className="bg-gray-50 rounded-xl p-4 text-sm">
          <p className="text-gray-500">Debiting from</p>
          <p className="font-medium text-gray-800">
            {selectedAccount.bank}
          </p>
          <p className="text-gray-600">
            {selectedAccount.vpa}
          </p>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? "Processing..." : "Pay"}
        </button>

        {/* Cancel */}
        <button
          onClick={() => {
            resetPayment();
            navigate("/dashboard");
          }}
          className="w-full text-gray-500 text-sm hover:underline"
        >
          Cancel Payment
        </button>
      </div>
    </div>
  );
};

export default PayPin;
