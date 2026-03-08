import { create } from "zustand";
import axios from "axios";

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

    initiatePayment: async ({ payeeVpa, amount, pin, message }) => {
        set({ status: "confirming" });
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/payment/initiate`,
                { payeeVpa, amount, pin, message },
                { withCredentials: true }
            );
            const pspTxnId = res.data.pspTxnId;
            set({ txnId: pspTxnId, status: "processing" });

            // Poll for final status
            const POLL_INTERVAL = 2000;
            const MAX_POLLS = 60;
            for (let i = 0; i < MAX_POLLS; i++) {
                await new Promise((r) => setTimeout(r, POLL_INTERVAL));
                const statusRes = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/payment/status/${pspTxnId}`,
                    { withCredentials: true }
                );
                const txnStatus = statusRes.data.status;
                if (txnStatus === "SUCCESS") {
                    set({ status: "success" });
                    return { success: true, data: statusRes.data };
                }
                if (txnStatus === "FAILED" || txnStatus === "REVERSED") {
                    set({
                        status: "failed",
                        failureReason: statusRes.data.failureReason || "Payment failed. Please try again.",
                    });
                    return { success: false, data: statusRes.data };
                }
                // Still PROCESSING / PENDING — keep polling
            }
            // Timed out waiting
            set({ status: "failed", failureReason: "Payment timed out. Please check transaction history." });
            return { success: false, data: null };
        } catch (err) {
            const data = err.response?.data;
            set({
                status: "failed",
                failureReason: data?.failureReason || "Payment failed. Please try again.",
                txnId: data?.psp_txn_id || "",
            });
            return { success: false, data };
        }
    },
}));

export default usePaymentStore;
