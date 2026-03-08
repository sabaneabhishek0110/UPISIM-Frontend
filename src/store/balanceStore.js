import { create } from "zustand";
import axios from "axios";

const useBalanceStore = create((set) => ({
  balance: null,
  loading: false,
  error: null,

  setBalance: (balance) => set({ balance }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  resetBalance: () =>
    set({
      balance: null,
      loading: false,
      error: null,
    }),

  fetchBalance: async (pin) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/account/balance`,
        { pin },
        { withCredentials: true }
      );
      set({ balance: res.data.balance, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.failureReason || "Unable to fetch balance",
        loading: false,
      });
    }
  },
}));

export default useBalanceStore;
