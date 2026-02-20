import { Routes, Route } from "react-router-dom";
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
import TransactionDetailsModal from "./components/TransactionDetailsModal.jsx";

const AppRoutes = () => (

    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* This are the protected routes */}
      <Route element={<ProtectedRoute />} >
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
          <Route path=":txnId" element={<TransactionDetailsModal />} />
        </Route>
      </Route>

      <Route path="*" element={<Login />} />

    </Routes>
);

export default AppRoutes;
