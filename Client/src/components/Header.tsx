import React from "react";
import { Button } from "react-bootstrap";

interface HeaderProps {
  companyName: string;
  info: string;
  onCreateInviteLink: () => void;
  loading: boolean;
}

const Header: React.FC<HeaderProps> = ({ companyName, info, onCreateInviteLink, loading }) => {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', backgroundColor: '#f5f5f5' }}>
      <div>
        <h2>{companyName}</h2>
        <div>{info}</div>
      </div>
      <Button onClick={onCreateInviteLink} disabled={loading}>
        {loading ? "Создание..." : "Создать ссылку регистрации"}
      </Button>
    </header>
  );
};

export default Header;