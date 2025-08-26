
import { useState } from 'react'
import './App.css'
import AuthForm from './components/AuthForm'
import MainMenu from './components/MainMenu'

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";


function isTokenValid(token:string){
  try{
    const decoded:{exp: number}=jwtDecode(token);
    if(!decoded.exp) return false;
    const expTime = decoded.exp * 1000;
    return Date.now() < expTime;
  } catch (error) {
    return false;
  }
  
}


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("jwtToken");
    return token?isTokenValid(token):false;
  });

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/MainMenu" replace /> : <Navigate to="/AuthForm" replace />} 
        />
        <Route 
          path="/MainMenu" 
          element={isAuthenticated ? <MainMenu /> : <Navigate to="/AuthForm" replace />} 
        />
        <Route path="/AuthForm" element={<AuthForm />} />
      </Routes>
    </Router>
  );
}

export default App
