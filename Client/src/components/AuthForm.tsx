import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import '../style/authoForm.css';
import ApiRoute from "../api/ApiRoute";

const api = new ApiRoute;

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
  const [isEmployee, setIsEmployee] = useState(false);
  return (
    <>
      {isEmployee ? <SignInEmployee onLogin={onLogin} /> : <SignInCompany onLogin={onLogin} setIsEmployee={setIsEmployee} />}
      <Form.Group style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
        <Form.Check
          type="switch"
          id="employee-switch"
          label="Вход как сотрудник"
          checked={isEmployee}
          onChange={() => setIsEmployee(!isEmployee)}
        />
      </Form.Group>
    </>
  );
};

const SignInCompany: React.FC<{ onLogin: (token: string) => void, setIsEmployee: (val: boolean) => void }> = ({ onLogin }) => {
  const [companyOrEmail, setCompanyOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const authenticate = async () => {
    try {
      const bodyData: Record<string, string> = { password };

      if (companyOrEmail.includes("@")) {
        bodyData.email = companyOrEmail;
      } else {
        bodyData.company = companyOrEmail;
      }

      const response = await fetch(api.SingIn(), { // ваш API путь
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
      <h1>Вход руководителя</h1>
      <Form.Group>
        <Form.Control
          type="text"
          value={companyOrEmail}
          onChange={(e) => setCompanyOrEmail(e.target.value)}
          placeholder="Компания или Email"
        />
      </Form.Group>
      <Form.Group>
        <Form.Control
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
        />
      </Form.Group>
      <Button onClick={authenticate} style={{ marginTop: '10px' }}>Войти</Button>
      {error && <div className="error-message">{error}</div>}
    </>
  );
};

const SignInEmployee: React.FC<SignInProps> = ({ onLogin }) => {
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const validateFullName = (name: string): boolean => {
    const parts = name.trim().split(" ");
    if (parts.length !== 3) return false;
    return parts.every(part => /^[А-ЯЁ][а-яё]+$/.test(part));
  };

  const parseFullName = (name: string) => {
    const parts = name.trim().split(" ");
    return { lastName: parts[0], firstName: parts[1], middleName: parts[2] };
  };

  const handleSubmit = async () => {
    if (!validateFullName(fullName)) {
      setError("Введите полное ФИО из трех слов, каждое с заглавной буквы");
      return;
    }

    const names = parseFullName(fullName);

    try {
      setError(null);
      const response = await fetch(api.SingInEmployee(), { // ваш API путь
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: names.firstName,
          lastName: names.lastName,
          middleName: names.middleName,
          password: password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Ошибка при входе");
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
    } catch (e) {
      setError("Ошибка сети");
      console.error(e);
    }
  };

  return (
    <>
      <h1>Вход сотрудника</h1>
      <Form.Group>
        <Form.Control
          type="text"
          value={fullName}
          placeholder="Введите ФИО"
          onChange={(e) => setFullName(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Control
          type="password"
          value={password}
          placeholder="Пароль"
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>
      <Button onClick={handleSubmit} style={{ marginTop: '10px' }}>Войти</Button>
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
      const response = await fetch(api.SingUp(), { // ваш API путь
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
      <h1>Регистрация</h1>
      <input
        type="text"
        name="company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        placeholder="Компания"
      />
      <input
        type="email"
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
