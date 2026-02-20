import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthStore from "../store/authStore";
import userPaymentStore from "../store/paymentStore.js";

const PaySearchPage = () => {
  const navigate = useNavigate();
  const currUser = useAuthStore((state) => state.user);
  const {setReceiver,setSelectedAccount} = userPaymentStore();

  const [upiId, setUpiId] = useState("");
  const [searchRes, setSearchRes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!upiId) {
        setError("Please enter a UPI ID");
        return;
    }
    let valid = true;

    if(upiId.length<12){
        setError("Invalid UPI ID Format");
        valid = false;
    }
    const regex = /^\d{10}$/;
    const parts = upiId.split('@');
    if(parts.length !==2 || !regex.test(parts[0])){
        setError("Invalid UPI ID Format");
        valid = false;
    }
    if(!valid) return;
    if(upiId == currUser.vpa){
        setError("Cannot pay to your own UPI ID");
        return;
    }
    setLoading(true);
    setError("");
    setSearchRes(null);

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user`,
        {
          params: { vpa : upiId },
          withCredentials: true,
        }
      );
      if(res.data.vpa !== upiId || !res.data.vpa){
        setError("UPI ID not found");
        setLoading(false);
        return;
      }
      setSearchRes(res.data);
    } catch (err) {
      setError("UPI ID not found");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectReceiver = () => {
    console.log("selected user : ",searchRes);
    
    setReceiver(searchRes);
    setSelectedAccount({bank: currUser.bank, vpa: currUser.vpa});
    navigate("/pay/details");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200 p-8">

      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="mr-4 text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          Pay via UPI
        </h1>
      </div>

      {/* Search Box */}
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg">
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Enter UPI ID
        </label>

        <input
          type="text"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
          placeholder="example@upi"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleSearch}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
        >
          {loading ? "Searching..." : "Search"}
        </button>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm mt-4 text-center">
            {error}
          </p>
        )}
      </div>

      {/* searchRes Result */}
      {searchRes && (
        <div className="max-w-md mx-auto mt-6">
          <div
            onClick={handleSelectReceiver}
            className="cursor-pointer bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              {searchRes.name}
            </h3>
            <p className="text-sm text-gray-500">
              {searchRes.upiId}
            </p>
            <p className="mt-2 text-blue-600 text-sm">
              Tap to pay →
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaySearchPage;
