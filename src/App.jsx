import { useEffect } from "react";
import useAuthStore from "./store/authStore";
import AppRoutes from "./routes.jsx";

function App() {
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const loading = useAuthStore((s) => s.loading);

  useEffect(() => {
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--color-bg)" }}>
        <div className="h-10 w-10 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--color-accent)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  return <AppRoutes />;
}

export default App;