import React from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import { ShopProvider } from "./components/ShopState";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import Home from "./pages/website/Home";
import FishCatalogue from "./pages/website/FishCatalogue";
import ProductDetails from "./pages/website/ProductDetails";
import WishlistPage from "./pages/website/WishlistPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageProducts from "./pages/admin/ManageProducts";
import ProductForm from "./pages/admin/ProductForm";
import ManageEnquiries from "./pages/admin/ManageEnquiries";

function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <CartDrawer />
    </>
  );
}
function AnimatedRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/pets" element={<FishCatalogue category="fish" />} />
        <Route path="/fish" element={<FishCatalogue category="fish" />} />
        <Route path="/plants" element={<FishCatalogue category="plants" />} />
        <Route
          path="/aquarium-products"
          element={<FishCatalogue category="aquarium" />}
        />
        <Route
          path="/products"
          element={<FishCatalogue category="aquarium" />}
        />
        <Route path="/search" element={<FishCatalogue category="all" />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Route>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="enquiries" element={<ManageEnquiries />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/:id/edit" element={<ProductForm edit />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
export default function App() {
  return (
    <ShopProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <AnimatedRoutes />
      </BrowserRouter>
    </ShopProvider>
  );
}
