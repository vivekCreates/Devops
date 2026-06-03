import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import Loader from "../components/Loader";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading, hasInitialized } = useAuthStore();

  // Wait for the initial session check before deciding
  if (!hasInitialized || isLoading) {
    return (
      <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <Loader />
      </div>
    );
  }

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/signin" replace />
  );
};

export default ProtectedRoute;