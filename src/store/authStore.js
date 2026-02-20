import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const useAuthStore = create(
  persist((set) => ({
      user: null,          // user object from backend
      isLoggedIn: false,   // boolean flag
      loading: false,       // auth check in progress

      setUser: (user) => set({ user, isLoggedIn: true, loading: false }),

      logout: () => set({ user: null, isLoggedIn: false, loading: false }),

      checkAuth: async () => {
        set({ loading: true });
        try {
          const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/me`, { withCredentials: true }); 
          
          set({ user: res.data, isLoggedIn: true, loading: false });
        } catch (error) {
          set({ user: null, isLoggedIn: false, loading: false });
        }
      },
    }),
    {
      name: "auth-storage"
    }
  )
);

export default useAuthStore;