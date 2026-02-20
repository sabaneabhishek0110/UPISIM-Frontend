import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import usePaymentStore from "../store/paymentStore";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();

  const {
    receiver,
    amount,
    txnId,
    selectedAccount,
    resetPayment,
  } = usePaymentStore();

  useEffect(() => {
    if (!receiver || !amount) {
      navigate("/dashboard");
    }
  }, [receiver, amount, navigate]);

  const handleDone = () => {
    resetPayment();
    navigate("/dashboard");
  };

  if (!receiver || !amount) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 text-center space-y-6">

        {/* Animated Success Icon */}
        <div className="relative flex justify-center">
          {/* Pulse Ring */}
          <div className="absolute h-24 w-24 rounded-full bg-green-200 animate-ring" />
          
          {/* Tick */}
          <CheckCircleIcon className="h-20 w-20 text-green-500 animate-success z-10" />
        </div>

        {/* Success Message */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Payment Successful
          </h2>
          <p className="text-gray-500 mt-1">
            Your payment has been completed
          </p>
        </div>

        {/* Amount */}
        <div className="text-3xl font-bold text-gray-900">
          ₹{amount}
        </div>

        {/* Receiver Info */}
        <div className="bg-gray-50 rounded-xl p-4 text-left space-y-1">
          <p className="text-sm text-gray-500">Paid to</p>
          <p className="font-medium text-gray-800">{receiver.name}</p>
          <p className="text-sm text-gray-600">{receiver.vpa}</p>
        </div>

        {/* Transaction Id */}
        <div className="bg-gray-50 rounded-xl p-4 text-left space-y-1">
          <p className="text-sm text-gray-500">Transaction ID</p>
          <p className="font-medium text-gray-800">{txnId}</p>
        </div>

        {/* Account Info */}
        <div className="bg-gray-50 rounded-xl p-4 text-left space-y-1">
          <p className="text-sm text-gray-500">Debited from</p>
          <p className="font-medium text-gray-800">
            {selectedAccount?.bankName}
          </p>
          <p className="text-sm text-gray-600">
            {selectedAccount?.vpa}
          </p>
        </div>

        {/* Done Button */}
        <button
          onClick={handleDone}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
