import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet} from "react-router-dom";
import AuthForm from "./components/AuthForm";
import HubList from "./components/HubList";
import { jwtDecode } from "jwt-decode";
import Hub from "./components/Hub";
import AdminPanel from "./components/AdminPanel";
import Registration from "./components/Registration";
import NavBar from "./components/NavBar";

interface TokenPayload {
  exp: number;
}

const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;

  try {
    const decoded = jwtDecode<TokenPayload>(token);
    if (!decoded.exp) return false;

    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch {
    return false;
  }
};

const ProtectedRoute: React.FC<{ token: string | null; onLogout: () => void }> = ({ token, onLogout }) => {
  if (!token || !isTokenValid(token)) {
    onLogout();
    // Редирект на страницу входа
    return <Navigate to="/login" replace />;
  }
  // Рендер вложенных маршрутов если авторизован
  return <Outlet />;
};

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("jwtToken"));

  const handleLogin = (newToken: string) => {
    localStorage.setItem("jwtToken", newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    setToken(null);
  };

  return (
    <BrowserRouter>
      {token && <NavBar setToken={setToken} />}
      <Routes>
        <Route path="/register" element={<Registration />} />
        <Route
          path="/"
          element={token ? <Navigate to="/hublist" replace /> : <AuthForm onLogin={handleLogin} />}
        />
        <Route
          path="/login"
          element={token ? <Navigate to="/hublist" replace /> : <AuthForm onLogin={handleLogin} />}
        />
        <Route element={<ProtectedRoute token={token} onLogout={handleLogout} />}>
          <Route path="/hublist" element={<HubList />} />
          <Route path="/hub/:id" element={<Hub />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Route>
        <Route path="*" element={<Navigate to={token ? "/hublist" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
