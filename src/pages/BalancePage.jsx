import { useEffect, useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import useBalanceStore from "../store/balanceStore";
import { useNavigate } from "react-router-dom";

const BalancePage = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);

  const {
    balance,
    loading,
    error,
    setBalance,
    setLoading,
    setError,
    resetBalance,
  } = useBalanceStore();

  const handleCheckBalance = async () => {
    if (pin.length !== 6) {
      setError("Enter a valid 6-digit UPI PIN");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/account/balance`,
        { pin },
        { withCredentials: true }
      );

      setBalance(res.data.balance);
    } catch (err) {
      setError(
        err.response?.data?.failureReason || "Unable to fetch balance"
      );
    } finally {
      setLoading(false);
      setPin("");
    }
  };

  useEffect(() => {
    resetBalance(); //run when page get loads
    return () =>{
      resetBalance(); //runs when page get exit
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Check Account Balance
        </h2>

        <p className="text-sm text-gray-500 text-center mt-1">
          Enter UPI PIN to view balance
        </p>

        {/* PIN Input */}
        <div className="mt-6 relative">
          <input
            type={showPin ? "text" : "password"}
            value={pin}
            maxLength={6}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            placeholder="Enter 6-digit UPI PIN"
            className="w-full border rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => setShowPin(!showPin)}
            className="absolute right-3 top-3 text-gray-500"
          >
            {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Balance */}
        {balance !== null && (
          <div className="mt-6 bg-green-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600">Available Balance</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              ₹{balance}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-6 space-y-3">
          <button
            onClick={handleCheckBalance}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {loading ? "Checking..." : "Check Balance"}
          </button>

          <button
            onClick={() => {
              resetBalance();
              navigate("/dashboard");
            }}
            className="w-full border border-gray-300 py-3 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default BalancePage;
