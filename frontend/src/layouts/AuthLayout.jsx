import React from "react";
import { createPortal } from "react-dom";
import { Outlet, useLocation } from "react-router-dom";
import AuthModal from "@/components/auth-modal";

const AuthLayout = () => {

  const location = useLocation();
  const modalType = location.pathname === '/login' ? 'login' :
    location.pathname === '/signup' ? 'signup' : null;
  return (
    <>
      <Outlet />
      {
        modalType && createPortal(
          <AuthModal type={modalType} />,
          document.getElementById('modal-root')
        )
      }
    </>
  ) 
}

export default AuthLayout;
