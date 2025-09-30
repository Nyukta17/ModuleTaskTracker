import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import HubList from "./components/HubList";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: string;
  role: string;      // например "ROLE_ADMIN"
  companyId: number;
  exp: number;
}

type UserRole = "ADMIN" | "USER";  // Для HubList

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("jwtToken"));
  const [role, setRole] = useState<UserRole | null>(null);
  const [companyId, setCompanyId] = useState<number | null>(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded: JwtPayload = jwtDecode(token);
        // Преобразуем "ROLE_ADMIN" в "ADMIN"
        const parsedRole = decoded.role.replace("ROLE_", "") as UserRole;
        setRole(parsedRole);
        setCompanyId(decoded.companyId);
      } catch (error) {
        console.error("Invalid token", error);
        setToken(null);
        localStorage.removeItem("jwtToken");
      }
    } else {
      setRole(null);
      setCompanyId(null);
    }
  }, [token]);

  const handleLogin = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("jwtToken", newToken);
  };

  const handleLogout = () => {
    setToken(null);
    setRole(null);
    setCompanyId(null);
    localStorage.removeItem("jwtToken");
  };

  // Отдельный компонент Logout
  const Logout: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const navigate = useNavigate();

    useEffect(() => {
      onLogout();
      navigate("/", { replace: true });
    }, [navigate, onLogout]);

    return <div>Выход...</div>;
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            token ? (
              <Navigate to="/hublist" replace />
            ) : (
              <AuthForm onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/hublist"
          element={
            token && role && companyId ? (
              <HubList role={role} companyId={companyId} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
      </Routes>
    </Router>
  );
}

export default App;
