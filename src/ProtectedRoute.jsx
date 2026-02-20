import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "./store/authStore";

const ProtectedRoute = () => {
  const { isLoggedIn, loading } = useAuthStore();

  if (loading) {
    return <p className="p-8">Checking authentication...</p>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; 
};

export default ProtectedRoute;
