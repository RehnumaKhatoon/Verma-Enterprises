import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, Mail, Package, Plus } from "lucide-react";
import { logout } from "../services/authService";

export default function AdminLayout() {
  const navigate = useNavigate();
  function signout() {
    logout();
    navigate("/admin/login");
  }
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <NavLink to="/admin" className="admin-brand">
          <img
            src="/images/verma-enterprises-logo.webp"
            alt="Verma Enterprises"
          />
          {/* <small>THE BACK OFFICE</small> */}
        </NavLink>
        <span className="admin-nav-label">YOUR LITTLE SHOP</span>
        <NavLink end to="/admin" className="admin-nav-link">
          <LayoutDashboard size={17} />
          Overview
        </NavLink>
        <NavLink to="/admin/products" className="admin-nav-link">
          <Package size={17} />
          All products
        </NavLink>
        <NavLink to="/admin/enquiries" className="admin-nav-link">
          <Mail size={17} />
          Customer enquiries
        </NavLink>
        <NavLink to="/admin/products/new" className="admin-nav-link">
          <Plus size={17} />
          Add a product
        </NavLink>
        <div className="sidebar-bottom">
          <span className="admin-user">
            <span className="admin-user-avatar">V</span>
            <span>
              <strong>Verma Admin</strong>
              <small>SHOP ADMIN</small>
            </span>
          </span>
          <button onClick={signout}>
            <LogOut size={16} /> Sign out
          </button>
          <NavLink className="back-store" to="/">
            ← Back to the storefront
          </NavLink>
        </div>
      </aside>
      <div className="admin-main">
        <nav className="admin-mobile-nav">
          <NavLink end to="/admin">
            Overview
          </NavLink>
          <NavLink to="/admin/products">Products</NavLink>
          <NavLink to="/admin/enquiries">Enquiries</NavLink>
          <NavLink to="/admin/products/new">+ Add</NavLink>
          <button onClick={signout}>Sign out</button>
        </nav>
        <header className="admin-topbar">
          <span>
            <span className="admin-live" /> YOUR SHOP IS LOOKING GOOD
          </span>
          <span>
            VERMA ENTERPRISES <i>✳</i> ADMIN
          </span>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
