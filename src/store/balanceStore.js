import { create } from "zustand";

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
}));

export default useBalanceStore;
