import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import {jwtDecode} from "jwt-decode";
import ApiRoute from "../api/ApiRoute";

const api = new ApiRoute();

interface AuthFormProps {
  onLogin: (token: string, role: string) => void;
}

interface JwtPayload {
  sub: string; // или userId
  role: string; // имя роли в токене
  // другие поля токена, если есть
}

const AuthForm: React.FC<AuthFormProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = (token: string, role: string) => {
    // Здесь можно сохранять роль в localStorage или контекст, если нужно
    onLogin(token, role);
  };

  return (
    <div className="auth-container">
      <Form>
        {isLogin ? <SignIn onLogin={handleLogin} /> : <SignUp />}
        <Button
          variant="warning"
          className="auth-toggle-btn"
          onClick={() => setIsLogin(!isLogin)}
          style={{ display: "block", margin: "15px auto 0" }}
          type="button"
        >
          {isLogin ? "Перейти к регистрации" : "Перейти ко входу"}
        </Button>
      </Form>
    </div>
  );
};

const SignIn: React.FC<{ onLogin: (token: string, role: string) => void }> = ({
  onLogin,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
  setError(null);
  try {
    const response = await fetch(api.login(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      // credentials: "include" если используется сессия/куки
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.message || "Неверный логин или пароль");
      return;
    }

    const json = await response.json();
    const token = json.token || json;

    if (token) {
      localStorage.setItem("jwtToken", token);
      const decoded = jwtDecode<JwtPayload>(token);
      const role = decoded.role || "ROLE_USER";
      onLogin(token, role);
    } else {
      setError("Токен не получен");
    }
  } catch (err) {
    setError("Ошибка сети");
    console.error(err);
  }
};


  return (
    <>
      <h1>Вход</h1>
      <Form.Group>
        <Form.Control
          type="text"
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Control
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>
      <Button
        type="button"
        variant="success"
        onClick={handleLogin}
        style={{ marginTop: 10 }}
      >
        Войти
      </Button>
      {error && <div className="error-message">{error}</div>}
    </>
  );
};

const SignUp: React.FC = () => {
  const [username, setUsername] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    setError(null);
    setMessage("");

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }
    if (!username.trim()) {
      setError("Имя пользователя обязательно");
      return;
    }
    if (!company.trim()) {
      setError("Компания обязательна");
      return;
    }
    if (!email.trim()) {
      setError("Email обязателен");
      return;
    }
    if (!phone.trim()) {
      setError("phone обязателен");
      return;
    }
    if (password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      return;
    }

    const body = { username, company, email, password, phone };
    console.log("Отправляем тело:", body);

    try {
      const response = await fetch(api.register(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const text = await response.text();

      if (!response.ok) {
        setError(text || "Ошибка регистрации");
        console.error("Ошибка сервера при регистрации: ", text);
        return;
      }

      setMessage(text || "Регистрация прошла успешно");
    } catch (err) {
      setError("Ошибка сети");
      console.error(err);
    }
  };

  return (
    <>
      <h1>Регистрация</h1>
      <Form.Group>
        <Form.Control
          type="text"
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Control
          type="text"
          placeholder="Компания"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Control
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Control
          type="phone"
          placeholder="Номер телефона"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Control
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Control
          type="password"
          placeholder="Подтверждение пароля"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </Form.Group>
      {error && <div className="error-message">{error}</div>}
      {message && <div className="message">{message}</div>}
      <Button type="button" onClick={handleRegister} style={{ marginTop: 10 }}>
        Зарегистрироваться
      </Button>
    </>
  );
};

export default AuthForm;
