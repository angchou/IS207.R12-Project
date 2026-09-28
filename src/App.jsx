import { Routes, Route } from "react-router-dom";

import ErrorLayout from "./layouts/ErrorLayout";
import ErrorPage from "./pages/ErrorPage";

import AuthLayout from "./layouts/AuthLayout";
import LoginPage from "./pages/AuthPage/LoginPage";

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />}></Route>
      </Route>

      <Route path="*" element={<ErrorPage />}></Route>
    </Routes>
  );
}

export default App;
