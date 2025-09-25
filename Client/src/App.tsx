import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import HubList from './components/HubList';
import Workspace from './components/WorkSpace';
import RegistrationMessage from './components/RegistrationMessage';
import Create__project from './components/Create-project';

function App() {
  
  const [token, setToken] = useState(() => localStorage.getItem('jwtToken') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!token);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  
  const handleLogin = (newToken: string) => {
    localStorage.setItem('jwtToken', newToken);
    setToken(newToken);
    setIsAuthenticated(true);
    setRedirectPath('/hublist');  
  };

  const handleSelectProject = (project: any) => {
    setSelectedProject(project);
    setRedirectPath(`/hub/${project.id}`);
  };

  return (
    <Router>
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
              <Workspace module={selectedProject} role={null} />
            ) : (
              <Navigate to="/hublist" replace />
            )
          }
        />
        <Route path="/register" element={<RegistrationMessage />} />
        <Route path="/create-project" element={<Create__project/>}/>
      </Routes>
    </Router>
  );
}

export default App;