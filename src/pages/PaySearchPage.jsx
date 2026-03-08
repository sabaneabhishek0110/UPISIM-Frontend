import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useAuthStore from "../store/authStore";
import userPaymentStore from "../store/paymentStore.js";
import PageTransition from "../components/PageTransition";
import TestBanner from "../components/TestBanner";

const PaySearchPage = () => {
  const navigate = useNavigate();
  const currUser = useAuthStore((state) => state.user);
  const lookupUser = useAuthStore((state) => state.lookupUser);
  const { setReceiver, setSelectedAccount } = userPaymentStore();

  const [upiId, setUpiId] = useState("");
  const [searchRes, setSearchRes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!upiId) { setError("Please enter a UPI ID"); return; }
    const parts = upiId.split("@");
    if (upiId.length < 12 || parts.length !== 2 || !/^\d{10}$/.test(parts[0])) {
      setError("Invalid UPI ID Format"); return;
    }
    if (upiId === currUser.vpa) { setError("Cannot pay to your own UPI ID"); return; }
    setLoading(true); setError(""); setSearchRes(null);
    try {
      const data = await lookupUser(upiId);
      if (data.vpa !== upiId || !data.vpa) { setError("UPI ID not found"); setLoading(false); return; }
      setSearchRes(data);
    } catch { setError("UPI ID not found"); } finally { setLoading(false); }
  };

  const handleSelectReceiver = () => {
    setReceiver(searchRes);
    setSelectedAccount({ bank: currUser.bank, vpa: currUser.vpa });
    navigate("/pay/details");
  };

  return (
    <PageTransition>
      <div className="max-w-lg mx-auto px-4 py-10">
        <TestBanner variant="pay" currentUserVpa={currUser?.vpa} />
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-colors hover:bg-opacity-80"
            style={{ borderColor: "var(--color-border)", color: "var(--color-accent)", backgroundColor: "var(--color-accent-light)" }}
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
            Pay via UPI
          </h1>
        </div>

        {/* Search Box */}
        <div className="rounded-xl p-6 border" style={{ backgroundColor: "var(--color-bg-card)", borderColor: "var(--color-border)" }}>
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>
            Enter UPI ID
          </label>
          <input
            type="text"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="example@upi"
            className="w-full rounded-lg px-4 py-2 mb-4 border focus:outline-none focus:ring-2 focus:ring-indigo-500"
            style={{
              backgroundColor: "var(--color-bg-secondary)",
              borderColor: "var(--color-border)",
              color: "var(--color-text)",
            }}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full text-white py-2 rounded-lg transition disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #4f46e5, #6366f1)" }}
          >
            {loading ? "Searching..." : "Search"}
          </button>
          {error && (
            <p className="text-sm mt-4 text-center" style={{ color: "var(--color-danger)" }}>{error}</p>
          )}
        </div>

        {/* Result */}
        {searchRes && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <div
              onClick={handleSelectReceiver}
              className="cursor-pointer rounded-xl p-5 border transition-shadow hover:shadow-lg"
              style={{ backgroundColor: "var(--color-bg-card)", borderColor: "var(--color-border)" }}
            >
              <h3 className="text-lg font-semibold" style={{ color: "var(--color-text)" }}>{searchRes.name}</h3>
              <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{searchRes.upiId}</p>
              <p className="mt-2 text-sm" style={{ color: "var(--color-accent)" }}>Tap to pay →</p>
            </div>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
};

export default PaySearchPage;
