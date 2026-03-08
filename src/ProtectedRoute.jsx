import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "./store/authStore";

const ProtectedRoute = () => {
  const { isLoggedIn, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--color-accent)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
