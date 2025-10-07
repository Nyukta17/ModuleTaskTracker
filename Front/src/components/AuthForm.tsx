import React, { useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
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
    onLogin(token, role);
  };

  return (
    <div className="auth-container">
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
    </div>
  );
};

const SignIn: React.FC<{ onLogin: (token: string, role: string) => void }> = ({
  onLogin,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(api.login(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
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
    <Container>
      <Row className="justify-content-center mt-5">
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card>
            <Card.Body>
              <h3 className="mb-4 text-center">Вход</h3>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="formUsername">
                  <Form.Label>Имя пользователя</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Введите имя пользователя"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Пароль</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Введите пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Войти
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

const SignUp: React.FC = () => {
  const [username, setUsername] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

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
      setError("Телефон обязателен");
      return;
    }
    if (password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      return;
    }

    const body = { username, company, email, phone, password };

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const text = await response.text();

      if (!response.ok) {
        setError(text || "Ошибка регистрации");
        return;
      }

      setMessage(text || "Регистрация прошла успешно");

      // Очистить поля формы после успешной регистрации
      setUsername("");
      setCompany("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
    } catch (e) {
      setError("Ошибка сети");
      console.error(e);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col xs={12} sm={8} md={6} lg={5}>
          <Card>
            <Card.Body>
              <h3 className="mb-4 text-center">Регистрация</h3>
              {error && <Alert variant="danger">{error}</Alert>}
              {message && <Alert variant="success">{message}</Alert>}
              <Form onSubmit={handleRegister}>
                <Form.Group className="mb-3" controlId="formUsername">
                  <Form.Label>Имя пользователя</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Введите имя пользователя"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formCompany">
                  <Form.Label>Компания</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Введите название компании"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Введите Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPhone">
                  <Form.Label>Телефон</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Введите номер телефона"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Пароль</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Введите пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formConfirmPassword">
                  <Form.Label>Подтвердите пароль</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Подтверждение пароля"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Зарегистрироваться
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthForm;
