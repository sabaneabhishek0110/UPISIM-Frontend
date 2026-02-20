import { create } from "zustand";

const usePaymentStore = create((set) => ({
    receiver: null,          // { name, upiId, userId }
    amount: "",
    message: "",
    selectedAccount: null,   // default debit account
    status: "idle",          // idle | confirming | success | failed
    failureReason: "",
    txnId : "",          // transaction ID from backend

    setReceiver: (receiver) =>
        set({ receiver }),

    setPaymentDetails: ({ amount, message }) =>
        set({
        amount,
        message,
        }),

    setSelectedAccount: (account) =>
        set({ selectedAccount: account }),

    setStatus: (status) =>
        set({ status }),

    setFailureReason: (reason) =>
        set({ 
            status : "failed",
            failureReason: reason 
        }),

    setTxnId: (txnId) =>
        set({ txnId }),

    resetPayment: () =>
        set({
        receiver: null,
        amount: "",
        message: "",
        selectedAccount: null,
        status: "idle",
    }),
}));

export default usePaymentStore;
