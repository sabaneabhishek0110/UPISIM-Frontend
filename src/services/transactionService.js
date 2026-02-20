import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
  withCredentials: true
});

export const fetchTransactionsApi = async (limit, offset) => {
  console.log(`Here : ${import.meta.env.VITE_BACKEND_URL}`);
  const res = await API.get(`/account/transactions`, {
    params: { limit, offset }
  });
  console.log("Data : ",res.data.trasactions??[]);
  
  return res.data.transactions??[];
};

export const fetchTransactionByIdApi = async (id) => {
  const res = await API.get(`/account/transactions/${id}`);
  // console.log("Transaction Details : ",res.data.transaction);
  
  return res.data.transaction;
};
