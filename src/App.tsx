import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async"; // ✅ Added for SEO
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import { Layout } from "./components/Layout";
import { AdminLayout } from "./components/AdminLayout";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Sell from "./pages/Sell";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Categories from "./pages/admin/Categories";
import Orders from "./pages/admin/Orders";
import Customers from "./pages/admin/Customers";
import Payments from "./pages/admin/Payments";
import Shipping from "./pages/admin/Shipping";
import Coupons from "./pages/admin/Coupons";
import Inventory from "./pages/admin/Inventory";
import CMS from "./pages/admin/CMS";
import Marketing from "./pages/admin/Marketing";
import Reports from "./pages/admin/Reports";
import UserRoles from "./pages/admin/UserRoles";
import Settings from "./pages/admin/Settings";
import NotFound from "./pages/NotFound";
import MyOrders from "@/pages/MyOrders";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <HelmetProvider> {/* ✅ Wrap BrowserRouter in HelmetProvider */}
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* ----- User Pages ----- */}
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/shop" element={<Layout><Shop /></Layout>} />
                <Route path="/product/:slug" element={<Layout><ProductDetail /></Layout>} />
                <Route path="/cart" element={<Layout><Cart /></Layout>} />
                <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
                <Route path="/sell" element={<Layout><Sell /></Layout>} />
                <Route path="/about" element={<Layout><About /></Layout>} />
                <Route path="/contact" element={<Layout><Contact /></Layout>} />
                <Route path="/auth" element={<Layout><Auth /></Layout>} />
                <Route path="/orders" element={<Layout><MyOrders /></Layout>} />

                {/* ----- Admin Pages ----- */}
                <Route path="/admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
                <Route path="/admin/products" element={<AdminLayout><Products /></AdminLayout>} />
                <Route path="/admin/categories" element={<AdminLayout><Categories /></AdminLayout>} />
                <Route path="/admin/orders" element={<AdminLayout><Orders /></AdminLayout>} />
                <Route path="/admin/customers" element={<AdminLayout><Customers /></AdminLayout>} />
                <Route path="/admin/payments" element={<AdminLayout><Payments /></AdminLayout>} />
                <Route path="/admin/shipping" element={<AdminLayout><Shipping /></AdminLayout>} />
                <Route path="/admin/coupons" element={<AdminLayout><Coupons /></AdminLayout>} />
                <Route path="/admin/inventory" element={<AdminLayout><Inventory /></AdminLayout>} />
                <Route path="/admin/cms" element={<AdminLayout><CMS /></AdminLayout>} />
                <Route path="/admin/marketing" element={<AdminLayout><Marketing /></AdminLayout>} />
                <Route path="/admin/reports" element={<AdminLayout><Reports /></AdminLayout>} />
                <Route path="/admin/user-roles" element={<AdminLayout><UserRoles /></AdminLayout>} />
                <Route path="/admin/settings" element={<AdminLayout><Settings /></AdminLayout>} />

                {/* ----- 404 Page ----- */}
                <Route path="*" element={<Layout><NotFound /></Layout>} />
              </Routes>
            </BrowserRouter>
          </HelmetProvider>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
