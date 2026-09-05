import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Landing Page
import { LandingPage } from "@/pages/LandingPage";

// Auth Pages
import { Login } from "@/pages/auth/Login";
import { Register } from "@/pages/auth/Register";
import { ForgotPassword } from "@/pages/auth/ForgotPassword";
import { AuthCallback } from "@/pages/auth/AuthCallback";

// Farmer Pages
import { FarmerDashboard } from "@/pages/farmer/FarmerDashboard";
import { MarketPrices } from "@/pages/farmer/MarketPrices";
import { CreateProduceLot } from "@/pages/farmer/CreateProduceLot";
import { MyLots } from "@/pages/farmer/MyLots";
import { FindBuyers } from "@/pages/farmer/FindBuyers";
import { OfferManagement } from "@/pages/farmer/OfferManagement";
import { OrdersLogistics } from "@/pages/farmer/OrdersLogistics";
import { Payments } from "@/pages/farmer/Payments";
import { FarmerProfile } from "@/pages/farmer/FarmerProfile";
import { Disputes } from "@/pages/farmer/Disputes";
import { NotificationsPage } from "@/pages/farmer/NotificationsPage";

// Buyer Pages
import { BuyerDashboard } from "@/pages/buyer/BuyerDashboard";
import { Marketplace } from "@/pages/buyer/Marketplace";
import { BuyerOffers } from "@/pages/buyer/BuyerOffers";
import { BuyerOrders } from "@/pages/buyer/BuyerOrders";
import { BuyerProfile } from "@/pages/buyer/BuyerProfile";

// Admin Pages
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { VerificationQueue } from "@/pages/admin/VerificationQueue";
import { AdminAnalytics } from "@/pages/admin/AdminAnalytics";
import { UsersList } from "@/pages/admin/UsersList";

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Authenticated Layout with Role-Based Route Protection */}
            <Route element={<Layout />}>

              {/* ── Farmer Routes (Allowed role: farmer) ── */}
              <Route
                path="/farmer/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["farmer"]}>
                    <FarmerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/market"
                element={
                  <ProtectedRoute allowedRoles={["farmer"]}>
                    <MarketPrices />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/lots/create"
                element={
                  <ProtectedRoute allowedRoles={["farmer"]}>
                    <CreateProduceLot />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/lots"
                element={
                  <ProtectedRoute allowedRoles={["farmer"]}>
                    <MyLots />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/buyers"
                element={
                  <ProtectedRoute allowedRoles={["farmer"]}>
                    <FindBuyers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/offers"
                element={
                  <ProtectedRoute allowedRoles={["farmer"]}>
                    <OfferManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/orders"
                element={
                  <ProtectedRoute allowedRoles={["farmer"]}>
                    <OrdersLogistics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/payments"
                element={
                  <ProtectedRoute allowedRoles={["farmer"]}>
                    <Payments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/profile"
                element={
                  <ProtectedRoute allowedRoles={["farmer"]}>
                    <FarmerProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/disputes"
                element={
                  <ProtectedRoute allowedRoles={["farmer"]}>
                    <Disputes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/notifications"
                element={
                  <ProtectedRoute allowedRoles={["farmer"]}>
                    <NotificationsPage />
                  </ProtectedRoute>
                }
              />

              {/* ── Buyer Routes (Allowed role: buyer) ── */}
              <Route
                path="/buyer/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["buyer"]}>
                    <BuyerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/buyer/marketplace"
                element={
                  <ProtectedRoute allowedRoles={["buyer"]}>
                    <Marketplace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/buyer/offers"
                element={
                  <ProtectedRoute allowedRoles={["buyer"]}>
                    <BuyerOffers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/buyer/orders"
                element={
                  <ProtectedRoute allowedRoles={["buyer"]}>
                    <BuyerOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/buyer/payments"
                element={
                  <ProtectedRoute allowedRoles={["buyer"]}>
                    <Payments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/buyer/profile"
                element={
                  <ProtectedRoute allowedRoles={["buyer"]}>
                    <BuyerProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/buyer/disputes"
                element={
                  <ProtectedRoute allowedRoles={["buyer"]}>
                    <Disputes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/buyer/notifications"
                element={
                  <ProtectedRoute allowedRoles={["buyer"]}>
                    <NotificationsPage />
                  </ProtectedRoute>
                }
              />

              {/* ── Admin Routes (Allowed role: admin) ── */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/verification"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <VerificationQueue />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminAnalytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <UsersList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/disputes"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <Disputes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/notifications"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <NotificationsPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Catch All Redirect */}
            <Route path="*" element={<Navigate to="/farmer/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
