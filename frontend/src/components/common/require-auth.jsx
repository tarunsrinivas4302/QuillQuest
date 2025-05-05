import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "@/context/auth-context";
const RequireAuth = ({ children }) => {
  const { user, isAuthenticated } = useAuthContext();
  const location = useLocation();

  if (!user && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
