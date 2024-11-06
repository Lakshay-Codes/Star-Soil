import { App as AntdApp } from "antd";
import PrivateLayout from "./layout/private-layout";
import PublicLayout from "./layout/public-layout";
import LoginPage from "./pages/auth/login";
import PublicPlanetsPage from "./pages/public/planets/index";
import RegisterPage from "./pages/auth/register";
import HomePage from "./pages/private/home";
import PlanetPage from "./pages/private/admin/planets/index";
import UsersList from "./pages/private/admin/users";
import PlanetForm from "./pages/private/admin/planets/planet-form/index";
import AdminPaymentsPage from "./pages/private/admin/payments";
import AdminReportsPage from "./pages/private/admin/reports";
import PlanetInfoPage from "./pages/private/planet-info/index";
import PaymentPage from "./pages/private/user/payments/index";
import ProfilePage from "./pages/private/user/profile";
import ReportsPage from "./pages/private/user/reports";
import ThemeProvider from "./providers/theme-provider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <AntdApp>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <PrivateLayout>
                  <HomePage />
                </PrivateLayout>
              }
            />
            <Route
              path="/home"
              element={
                <PublicLayout>
                  <PublicPlanetsPage />
                </PublicLayout>
              }
            />
            <Route
              path="/login"
              element={
                <PublicLayout>
                  <LoginPage />
                </PublicLayout>
              }
            />
            <Route
              path="/register"
              element={
                <PublicLayout>
                  <RegisterPage />
                </PublicLayout>
              }
            />
            <Route
              path="/admin/planets"
              element={
                <PrivateLayout>
                  <PlanetPage />
                </PrivateLayout>
              }
            />
            <Route
              path="/admin/planets/create"
              element={
                <PrivateLayout>
                  <PlanetForm />
                </PrivateLayout>
              }
            />
            <Route
              path="/admin/planets/edit/:id"
              element={
                <PrivateLayout>
                  <PlanetForm />
                </PrivateLayout>
              }
            />
            <Route
              path="/planet/:id"
              element={
                <PrivateLayout>
                  <PlanetInfoPage />
                </PrivateLayout>
              }
            />
            <Route
              path="/user/payments"
              element={
                <PrivateLayout>
                  <PaymentPage />
                </PrivateLayout>
              }
            />
            <Route
              path="/user/reports"
              element={
                <PrivateLayout>
                  <ReportsPage />
                </PrivateLayout>
              }
            />
            <Route
              path="/user/profile"
              element={
                <PrivateLayout>
                  <ProfilePage />
                </PrivateLayout>
              }
            />
            <Route
              path="/admin/payments"
              element={
                <PrivateLayout>
                  <AdminPaymentsPage />
                </PrivateLayout>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <PrivateLayout>
                  <AdminReportsPage />
                </PrivateLayout>
              }
            />
            <Route
              path="/admin/users"
              element={
                <PrivateLayout>
                  <UsersList />
                </PrivateLayout>
              }
            />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AntdApp>
  );
}

export default App;