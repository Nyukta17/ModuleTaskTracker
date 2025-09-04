import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import HubList from './components/HubList';
import Workspace from './components/WorkSpace';

function App() {
  // Состояния приложения
  const [token, setToken] = useState(() => localStorage.getItem('jwtToken') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!token);
  const [selectedProject, setSelectedProject] = useState(null);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  // Обработчик успешного логина
  const handleLogin = (newToken: string) => {
    localStorage.setItem('jwtToken', newToken);
    setToken(newToken);
    setIsAuthenticated(true);
    setRedirectPath('/hublist');  // Запускаем навигацию через Navigate
  };

  // Обработчик выбора проекта
  const handleSelectProject = (project: any) => {
    setSelectedProject(project);
    setRedirectPath(`/hub/${project.id}`); // Навигация через состояние
  };

  return (
    <Router>
      {/* Навигация через Navigate, если redirectPath установлен */}
      {redirectPath && <Navigate to={redirectPath} replace />}
      
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/hublist" replace /> : <Navigate to="/authform" replace />
          }
        />
        <Route path="/authform" element={<AuthForm onLogin={handleLogin} />} />
        <Route
          path="/hublist"
          element={
            isAuthenticated ? (
              <HubList token={token} onSelectProject={handleSelectProject} />
            ) : (
              <Navigate to="/authform" replace />
            )
          }
        />
        <Route
          path="/hub/:id"
          element={
            isAuthenticated && selectedProject ? (
              <Workspace module={selectedProject} />
            ) : (
              <Navigate to="/hublist" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
