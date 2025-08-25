// import { Navigate, useLocation } from "react-router-dom";
// import { useAuthContext } from "@/context/auth-context";
// const RequireAuth = ({ children }) => {
//   const { user, isAuthenticated } = useAuthContext();
//   const location = useLocation();
//   console.log("RequireAuth", user, isAuthenticated, location.pathname);
//   // if (!user && !isAuthenticated) {
//   //   return <Navigate to="/login" state={{ from: location }} replace />;
//   // }

//   return children;
// };

// export default RequireAuth;

import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuthContext } from "@/context/auth-context";

const RequireAuth = () => {
  const { user, isAuthenticated } = useAuthContext();
  const location = useLocation();

  if (!user && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />; // ← this is key
};

export default RequireAuth;
