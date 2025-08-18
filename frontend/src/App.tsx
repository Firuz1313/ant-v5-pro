import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { DataProvider } from "@/contexts/DataContext";
import Layout from "@/components/Layout";
import AdminLayout from "@/components/AdminLayout";

// Main pages
import DeviceSelection from "@/pages/DeviceSelection";
import ProblemsPage from "@/pages/ProblemsPage";
import DiagnosticPage from "@/pages/DiagnosticPage";
import SuccessPage from "@/pages/SuccessPage";
import Index from "@/pages/Index";
import ApiTest from "@/pages/ApiTest";
import TVInterfaceDemo from "@/pages/TVInterfaceDemo";
import NotFound from "@/pages/NotFound";

// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import DeviceManager from "@/pages/admin/DeviceManager";
import ProblemsManager from "@/pages/admin/ProblemsManager";
import StepsManager from "@/pages/admin/StepsManager";
import RemoteBuilder from "@/pages/admin/RemoteBuilder";
import TVInterfaceBuilder from "@/pages/admin/TVInterfaceBuilder";
import UsersManager from "@/pages/admin/UsersManager";
import SystemSettings from "@/pages/admin/SystemSettings";

function App() {
  return (
    <DataProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <Layout>
                <Index />
              </Layout>
            }
          />
          <Route
            path="/devices"
            element={
              <Layout>
                <DeviceSelection />
              </Layout>
            }
          />
          <Route
            path="/problems/:deviceId"
            element={
              <Layout>
                <ProblemsPage />
              </Layout>
            }
          />
          <Route
            path="/diagnostic/:deviceId/:problemId"
            element={
              <Layout>
                <DiagnosticPage />
              </Layout>
            }
          />
          <Route
            path="/success/:deviceId/:sessionId"
            element={
              <Layout>
                <SuccessPage />
              </Layout>
            }
          />

          {/* API Test page */}
          <Route
            path="/api-test"
            element={
              <Layout>
                <ApiTest />
              </Layout>
            }
          />

          {/* TV Interface Demo page */}
          <Route
            path="/tv-interface-demo"
            element={
              <Layout>
                <TVInterfaceDemo />
              </Layout>
            }
          />

          {/* Legacy redirect - old problems page */}
          <Route
            path="/problems"
            element={<Navigate to="/devices" replace />}
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/devices"
            element={
              <AdminLayout>
                <DeviceManager />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/problems"
            element={
              <AdminLayout>
                <ProblemsManager />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/steps"
            element={
              <AdminLayout>
                <StepsManager />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/remotes"
            element={
              <AdminLayout>
                <RemoteBuilder />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/tv-interfaces"
            element={
              <AdminLayout>
                <TVInterfaceBuilder />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminLayout>
                <UsersManager />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <AdminLayout>
                <SystemSettings />
              </AdminLayout>
            }
          />

          {/* 404 Route */}
          <Route
            path="*"
            element={
              <Layout>
                <NotFound />
              </Layout>
            }
          />
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;
