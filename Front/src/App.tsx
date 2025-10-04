// App.tsx
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import HubList from "./components/HubList";
import { jwtDecode } from "jwt-decode";
import Hub from "./components/Hub";


interface TokenPayload {
  exp: number;
}

const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;

  try {
    const decoded = jwtDecode<TokenPayload>(token);
    if (!decoded.exp) return false;

    const currentTime = Date.now() / 1000; // в секундах
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

const ProtectedRoute: React.FC<{ token: string | null; onLogout: () => void }> = ({ token, onLogout }) => {
  if (!token || !isTokenValid(token)) {
    onLogout(); // очистить токен при невалидности
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("jwtToken"));
  

  // Функция входа - записывает токен и роль
  const handleLogin = (newToken: string) => {
    localStorage.setItem("jwtToken", newToken);
    setToken(newToken);
   
  };

  // Функция выхода - удаляет токен и роль
  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    setToken(null);
    
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Маршрут входа */}
        <Route path="/" element={token ? <Navigate to="/hublist" replace /> : <AuthForm onLogin={handleLogin} />} />
        <Route path="/login" element={token ? <Navigate to="/hublist" replace /> : <AuthForm onLogin={handleLogin} />} />

        {/* Защищённый маршрут */}
        <Route element={<ProtectedRoute token={token} onLogout={handleLogout} />}>
          <Route path="/hublist" element={<HubList />} />
        </Route>

        {/* Редирект всех прочих путей */}
        <Route path="*" element={<Navigate to={token ? "/hublist" : "/login"} replace />} />
        <Route path="/hub/:id" element={<Hub/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
