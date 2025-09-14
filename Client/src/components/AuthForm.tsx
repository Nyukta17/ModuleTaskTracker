import { useState } from "react";
import { Button } from "react-bootstrap";
import ApiRoute from "../api/ApiRoute";
import { useNavigate } from 'react-router-dom';
import '../style/authoForm.css';

const api = new ApiRoute();

interface AuthFormProps {
  onLogin: (token: string) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onLogin }) => {
  const [isLog, setIsLog] = useState(true);

  return (
    <>
      <div className="auth-container">
        {isLog ? <SignIn onLogin={onLogin} /> : <SignUp />}
      </div>
      <div style={{ textAlign: 'center', marginTop: '15px' }}>
        <Button variant="secondary" onClick={() => setIsLog(!isLog)}>
          {isLog ? "Перейти к регистрации" : "Перейти ко входу"}
        </Button>
      </div>
    </>
  );
};

interface SignInProps {
  onLogin: (token: string) => void;
}

const SignIn: React.FC<SignInProps> = ({ onLogin }) => {
  const [companyOrEmail, setCompanyOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const Authentication = async () => {
    try {
      const bodyData: Record<string, string> = { password };
      if (companyOrEmail.includes("@")) {
        bodyData.email = companyOrEmail;
      } else {
        bodyData.company = companyOrEmail;
      }

      const response = await fetch(api.SingIn(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Неверный логин или пароль");
        return;
      }

      const token = await response.text();

      if (token) {
        localStorage.setItem("jwtToken", token);
        onLogin(token);
        navigate("/hublist");
      } else {
        setError("Токен не получен");
      }
    } catch (error) {
      setError("Ошибка при входе");
      console.error("Ошибка при входе:", error);
    }
  };

  return (
    <>
      <h1>Вход</h1>
      <input
        type="text"
        name="CompanyOrEmail"
        value={companyOrEmail}
        onChange={(e) => setCompanyOrEmail(e.target.value)}
        placeholder="Компания или Email"
      />
      <input
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Пароль"
      />
      <Button onClick={Authentication}>Войти</Button>
      {error && <div className="error-message">{error}</div>}
    </>
  );
};

const SignUp: React.FC = () => {
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (confirmPassword && value !== confirmPassword) {
      setError("Пароли не совпадают");
    } else {
      setError(null);
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (password !== value) {
      setError("Пароли не совпадают");
    } else {
      setError(null);
    }
  };

  const Registration = async () => {
    try {
      const response = await fetch(api.SingUp(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Ошибка регистрации");
        return;
      }

      const text = await response.text();
      setMessage(text);
    } catch (error) {
      setError("Ошибка при регистрации");
      console.log("Ошибка при регистрации: ", error);
    }
  };

  return (
    <>
      <h1>Регистрации</h1>
      <input
        type="text"
        name="company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        placeholder="Компания"
      />
      <input
        type="text"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => handlePasswordChange(e.target.value)}
      />
      <input
        type="password"
        placeholder="Подтверждение пароля"
        value={confirmPassword}
        onChange={(e) => handleConfirmPasswordChange(e.target.value)}
      />
      {error && <div className="error-message">{error}</div>}
      <Button onClick={Registration}>Зарегистрироваться</Button>
      {message && <div className="message">{message}</div>}
    </>
  );
};

export default AuthForm;
