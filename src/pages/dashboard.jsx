import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/logout`,
        {},
        { withCredentials: true }
      );
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">
          UPI Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          Logout
        </button>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        {/* Profile */}
        <div
          onClick={() => navigate("/profile")}
          className="cursor-pointer bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
        >
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            👤 Profile
          </h2>
          <p className="text-sm text-gray-500">
            View your UPI profile details
          </p>
        </div>

        {/* Balance */}
        <div
          onClick={() => navigate("/balance")}
          className="cursor-pointer bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
        >
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            💰 Check Balance
          </h2>
          <p className="text-sm text-gray-500">
            View your linked account balance
          </p>
        </div>

        {/* Pay */}
        <div
          onClick={() => navigate("/pay")}
          className="cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg p-6 hover:scale-[1.02] transition"
        >
          <h2 className="text-lg font-semibold mb-2">
            💸 Pay
          </h2>
          <p className="text-sm opacity-90">
            Send money using UPI ID
          </p>
        </div>

        {/* Transactions */}
        <div
          onClick={() => navigate("/transactions")}
          className="cursor-pointer bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
        >
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            📜 Transactions
          </h2>
          <p className="text-sm text-gray-500">
            View your transaction history
          </p>
        </div>
        
      </div>

    </div>
  );
}

export default Dashboard;
