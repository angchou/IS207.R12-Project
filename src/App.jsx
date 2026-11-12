import { Routes, Route } from "react-router-dom";

import ErrorLayout from "./layouts/ErrorLayout";
import ErrorPage from "./pages/ErrorPage";

import AuthLayout from "./layouts/AuthLayout";
import LoginPage from "./pages/AuthPage/LoginPage";
import RegisterPage from "./pages/AuthPage/RegisterPage";
import ForgotPasswordPage from "./pages/AuthPage/ForgotPasswordPage";

import CustomerLayout from "./layouts/CustomerLayout";
import CustomerHomePage from "./pages/Customer/CustomerHomePage";
import CustomerMenuPage from "./pages/Customer/CustomerMenuPage";
import CustomerCartPage from "./pages/Customer/CustomerCartPage";
import CustomerCheckoutPage from "./pages/Customer/CustomerCheckoutPage";
import CustomerOrderHistoryPage from "./pages/Customer/CustomerOrderHistoryPage";
import CustomerRatingPage from "./pages/Customer/CustomerRatingPage";

import AdminLayout from "./layouts/AdminLayout";
import AdminHomePage from "./pages/Admin/AdminHomePage";
import AdminSettingPage from "./pages/Admin/AdminSettingPage";
import AdminProductPage from "./pages/Admin/AdminProductPage";
import AdminAddOnPage from "./pages/Admin/AdminAddOnPage";
import AdminComboPage from "./pages/Admin/AdminComboPage";
import AdminEmployeePage from "./pages/Admin/AdminEmployeePage";

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="reset-password" element={<ForgotPasswordPage />} />
      </Route>

      <Route path="" element={<CustomerLayout />}>
        <Route path="home" element={<CustomerHomePage />} />
        <Route path="menu" element={<CustomerMenuPage />} />
        <Route path="cart" element={<CustomerCartPage />} />
        <Route path="checkout" element={<CustomerCheckoutPage />} />
        <Route path="history" element={<CustomerOrderHistoryPage />} />
        <Route path="rating" element={<CustomerRatingPage />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route path="home" element={<AdminHomePage />} />
        <Route path="add_on" element={<AdminAddOnPage />} />
        <Route path="product" element={<AdminProductPage />} />
        <Route path="combo" element={<AdminComboPage />} />
        <Route path="setting" element={<AdminSettingPage />} />
        <Route path="employee" element={<AdminEmployeePage />} />
      </Route>

      <Route path="*" element={<ErrorPage />}></Route>
    </Routes>
  );
}

export default App;
