import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";

interface HeadersProps{
    companyName: string;
    info ?: string
}

const Header: React.FC<HeadersProps> = ({companyName, info}) =>{
    return (
    <Navbar bg="light" expand="lg" className="mb-3">
      <Container>
        <Navbar.Brand href="#home">{companyName}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="justify-content-start">
            { }
          </Nav>
          <Navbar.Text>{info || "Информация о компании"}</Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header