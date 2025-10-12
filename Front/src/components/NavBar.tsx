import { useEffect, useState } from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const payload = JSON.parse(jsonPayload);
        setUserRole(payload.role);
      } catch {
        setUserRole(null);
      }
    } else {
      setUserRole(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    
    navigate('/login');
  };

  const goToAdmin = () => {
    navigate('/admin');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">SmartNewsHub</Navbar.Brand>
        <Nav className="me-auto">
          <Button variant="outline-light" onClick={goToAdmin} className="me-2" hidden={userRole !== 'ROLE_ADMIN'}>
            Админ-панель
          </Button>
          <Button variant="outline-light" onClick={handleLogout}>
            Выход из аккаунта
          </Button>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;
