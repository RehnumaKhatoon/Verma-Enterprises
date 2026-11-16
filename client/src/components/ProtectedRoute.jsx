import React from "react";
import { Navigate, Outlet } from "react-router-dom";
export default function ProtectedRoute() {
  return localStorage.getItem("aqua_admin_token") ? (
    <Outlet />
  ) : (
    <Navigate to="/admin/login" replace />
  );
}
