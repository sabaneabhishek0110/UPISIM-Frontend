import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/dashboard.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import BalancePage from "./pages/BalancePage.jsx";
import PaySearchPage from "./pages/PaySearchPage.jsx";
import PayDetails from "./pages/PayDetails.jsx";
import PayPin from "./pages/PayPin.jsx";
import PaymentSuccessPage from "./pages/PaymentSuccessPage.jsx";
import PaymentFailedPage from "./pages/PaymentFailedPage.jsx";
import TransactionsPage from "./pages/TransactionsPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import ArchitecturePage from "./pages/ArchitecturePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";

const AppRoutes = () => (
  <Routes>
    <Route element={<Layout />}>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/architecture" element={<ArchitecturePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/balance" element={<BalancePage />} />
        <Route path="/pay">
          <Route index element={<PaySearchPage />} />
          <Route path="details" element={<PayDetails />} />
          <Route path="pin" element={<PayPin />} />
          <Route path="success" element={<PaymentSuccessPage />} />
          <Route path="failed" element={<PaymentFailedPage />} />
        </Route>
        <Route path="/transactions">
          <Route index element={<TransactionsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<LandingPage />} />
    </Route>
  </Routes>
);

export default AppRoutes;
