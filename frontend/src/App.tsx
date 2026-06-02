import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProtectedRoute, GuestRoute } from "@/components/common/ProtectedRoute";

import ShowcasePage from "@/pages/ShowcasePage";
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import DashboardPage from "@/pages/DashboardPage";
import DeviceDetailPage from "@/pages/DeviceDetailPage";
import ProductsPage from "@/pages/ProductsPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import SettingsPage from "@/pages/SettingsPage";
import FamilyPage from "@/pages/FamilyPage";
import AlertsPage from "@/pages/AlertsPage";
import InsightsPage from "@/pages/InsightsPage";
import NotificationsPage from "@/pages/NotificationsPage";
import TrackingPage from "@/pages/TrackingPage";
import NotFoundPage from "@/pages/NotFoundPage";

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
};

function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} {...pageTransition}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <PageTransition>{children}</PageTransition>
      <Footer />
    </>
  );
}

function AuthLayout({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}

export default function App() {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <>
      <Routes>
        <Route path="/showcase" element={<ShowcasePage />} />

        <Route
          path="/login"
          element={
            <AuthLayout>
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            </AuthLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthLayout>
              <GuestRoute>
                <SignupPage />
              </GuestRoute>
            </AuthLayout>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <AuthLayout>
              <GuestRoute>
                <ForgotPasswordPage />
              </GuestRoute>
            </AuthLayout>
          }
        />
        <Route
          path="/reset-password"
          element={
            <AuthLayout>
              <GuestRoute>
                <ResetPasswordPage />
              </GuestRoute>
            </AuthLayout>
          }
        />

        <Route
          path="/"
          element={
            <AppLayout>
              <HomePage />
            </AppLayout>
          }
        />
        <Route
          path="/products"
          element={
            <AppLayout>
              <ProductsPage />
            </AppLayout>
          }
        />
        <Route
          path="/products/:slug"
          element={
            <AppLayout>
              <ProductDetailPage />
            </AppLayout>
          }
        />
        <Route
          path="/about"
          element={
            <AppLayout>
              <AboutPage />
            </AppLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <AppLayout>
              <ContactPage />
            </AppLayout>
          }
        />

        <Route
          path="/dashboard"
          element={
            <AppLayout>
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            </AppLayout>
          }
        />
        <Route
          path="/devices/:id"
          element={
            <AppLayout>
              <ProtectedRoute>
                <DeviceDetailPage />
              </ProtectedRoute>
            </AppLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <AppLayout>
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            </AppLayout>
          }
        />
        <Route
          path="/family"
          element={
            <AppLayout>
              <ProtectedRoute>
                <FamilyPage />
              </ProtectedRoute>
            </AppLayout>
          }
        />
        <Route
          path="/track/:deviceId"
          element={
            <AppLayout>
              <ProtectedRoute>
                <TrackingPage />
              </ProtectedRoute>
            </AppLayout>
          }
        />
        <Route
          path="/insights"
          element={
            <AppLayout>
              <ProtectedRoute>
                <InsightsPage />
              </ProtectedRoute>
            </AppLayout>
          }
        />
        <Route
          path="/notifications"
          element={
            <AppLayout>
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            </AppLayout>
          }
        />
        <Route
          path="/alerts"
          element={
            <AppLayout>
              <ProtectedRoute>
                <AlertsPage />
              </ProtectedRoute>
            </AppLayout>
          }
        />

        <Route
          path="*"
          element={
            <AppLayout>
              <NotFoundPage />
            </AppLayout>
          }
        />
      </Routes>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            color: "hsl(var(--foreground))",
            fontFamily: "Geist Variable, sans-serif",
          },
        }}
      />
    </>
  );
}
