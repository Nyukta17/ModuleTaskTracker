import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button, Form, Alert, Container, Row, Col, Card } from "react-bootstrap";
import ApiRoute from "../api/ApiRoute";

const Registration: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const api = new ApiRoute();
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
    if (password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      return;
    }
    

    setLoading(true);
    try {
      const response = await fetch(api.registerEmployee(), {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          username,
          password,
          token
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        setError(text || "Ошибка регистрации");
        setLoading(false);
        return;
      }

      setMessage("Регистрация прошла успешно");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
    } catch (e) {
      setError("Ошибка сети");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!token) {
      setError("Отсутствует токен приглашения");
    }
  }, [token]);

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
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label>Имя пользователя</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Введите имя пользователя"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                    disabled={loading}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Пароль</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Введите пароль"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="confirmPassword">
                  <Form.Label>Подтверждение пароля</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Подтвердите пароль"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100" disabled={loading || !!error}>
                  {loading ? "Загрузка..." : "Зарегистрироваться"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Registration;
