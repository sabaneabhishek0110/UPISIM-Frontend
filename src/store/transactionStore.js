import { create } from "zustand";
import {fetchTransactionsApi,fetchTransactionByIdApi} from "../services/transactionService";

const LIMIT = 10;

const useTransactionStore = create((set, get) => ({
  transactions: [],
  offset: 0,
  hasMore: true,
  loading: false,

  selectedTransaction: null,
  detailLoading: false,

  fetchTransactions: async () => {
    const { offset, hasMore, loading } = get();
    if (!hasMore || loading) return;

    set({ loading: true });

    const data = await fetchTransactionsApi(LIMIT, offset);

    set({
      transactions: [...get().transactions, ...data],
      offset: offset + LIMIT,
      hasMore: data.length === LIMIT,
      loading: false
    });
  },

  fetchTransactionDetail: async (id) => {
    set({ detailLoading: true });
    const txn = await fetchTransactionByIdApi(id);
    set({ selectedTransaction: txn, detailLoading: false });
  },

  closeTransactionDetail: () => {
    set({ selectedTransaction: null });
  },

  resetTransactions: () => {
    set({
      transactions: [],
      offset: 0,
      hasMore: true
    });
  }
}));

export default useTransactionStore;
