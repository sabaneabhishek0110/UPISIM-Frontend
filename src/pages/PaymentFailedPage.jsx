import { XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import usePaymentStore from "../store/paymentStore";

const PaymentFailedPage = () => {
  const navigate = useNavigate();
  const {failureReason,txnId,resetPayment} = usePaymentStore();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
        
        <XCircle className="mx-auto text-red-600" size={72} />

        <h1 className="mt-4 text-2xl font-semibold text-gray-800">
          Payment Failed
        </h1>

        {/* <p className="mt-2 text-gray-600">
          Something went wrong. Please try again.
        </p> */}

        <div className="mt-6 bg-red-50 rounded-xl p-4 text-sm text-gray-700">
          <p className="font-medium">Reason</p>
          <p className="text-red-500 font-semibold">{failureReason || "Insufficient balance / Network issue"}</p>
        </div>

        {txnId && (
          <div className="mt-4 bg-gray-50 rounded-xl p-4 text-left text-sm">
            <p className="font-medium text-gray-700">Transaction ID</p>
            <p className="text-gray-600 mt-1 break-all">
              {txnId}
            </p>
          </div>
        )}

        <div className="mt-6 space-y-3">
          <button
            onClick={() => {
                resetPayment();
                navigate("/pay")
            }}
            className="w-full bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition"
          >
            Try Again
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="w-full border border-gray-300 py-3 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedPage;
