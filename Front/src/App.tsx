// App.tsx
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import HubList from "./components/HubList";

// Заглушка HubList (замените на реальный компонент)


// Компонент ProtectedRoute, который проверяет наличие токена
const ProtectedRoute: React.FC<{ token: string | null }> = ({ token }) => {
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("jwtToken"));
  const [role, setRole] = useState<string | null>(null);

  // Функция входа - получает токен и роль из AuthForm
  const handleLogin = (newToken: string, newRole: string) => {
    localStorage.setItem("jwtToken", newToken);
    setToken(newToken);
    setRole(newRole);
  };

  // Функция выхода
  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    setToken(null);
    setRole(null);
  };

  // Если нужно, можно добавить проверку валидности токена здесь
  // useEffect(() => {...}, [token]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Маршрут входа - "/" или "/login" */}
        <Route path="/" element={token ? <Navigate to="/hublist" replace /> : <AuthForm onLogin={handleLogin} />} />
        <Route path="/login" element={token ? <Navigate to="/hublist" replace /> : <AuthForm onLogin={handleLogin} />} />

        {/* Защищённый маршрут для HubList */}
        <Route element={<ProtectedRoute token={token} />}>
          <Route path="/hublist" element={<HubList />} />
        </Route>

        {/* Редирект всех прочих путей на вход */}
        <Route path="*" element={<Navigate to={token ? "/hublist" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
