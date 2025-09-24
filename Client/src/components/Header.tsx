import React from "react";
import { Button } from "react-bootstrap";

interface HeaderProps {
  companyName: string;
  info: string;
  fullName: string;      // ФИО пользователя
  role: string | null;   // роль пользователя ("manager" или "employee" и т.п.)
  onCreateInviteLink: () => void;
  loading: boolean;
}

const Header: React.FC<HeaderProps> = ({ companyName, info, fullName, role, onCreateInviteLink, loading }) => {
  if (role === "employee") {
    // Вариант для сотрудников
    return (
      <header style={{ padding: '10px 20px', backgroundColor: '#e0f7fa', color: '#006064' }}>
        <div>
          <h3>Добро пожаловать, {fullName}</h3>
          <div>Ваша роль: сотрудник</div>
        </div>
      </header>
    );
  }

  // Вариант по умолчанию (например, для менеджеров и др.)
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', backgroundColor: '#f5f5f5' }}>
      <div>
        <h2>{companyName}</h2>
        <div>{info}</div>
        <div><strong>Пользователь:</strong> {fullName}</div>
      </div>
      <Button onClick={onCreateInviteLink} disabled={loading}>
        {loading ? "Создание..." : "Создать ссылку регистрации"}
      </Button>
    </header>
  );
};

// Функция для извлечения данных из токена JWT
function parseToken(token: string): { fullName: string; role: string | null } {
  try {
    const base64Payload = token.split('.')[1];
    const base64 = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    return {
      fullName: payload.fullName || "Неизвестный пользователь",
      role: payload.role || null,
    };
  } catch {
    return {
      fullName: "Неизвестный пользователь",
      role: null,
    };
  }
}


const ParentComponent: React.FC<{ token: string }> = ({ token }) => {
  const [loading, setLoading] = React.useState(false);
  const { fullName, role } = parseToken(token);

  const handleCreateInviteLink = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Ссылка создана");
    }, 1500);
  };

  return (
    <Header
      companyName="Компания ХХХ"
      info="Дополнительная информация"
      fullName={fullName}
      role={role}
      onCreateInviteLink={handleCreateInviteLink}
      loading={loading}
    />
  );
};

export default ParentComponent;
