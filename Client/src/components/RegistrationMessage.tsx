import React, { useEffect, useState } from "react";
import { Form, Button, Alert, Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import ApiRoute from "../api/ApiRoute";
import RegistrationExpiredAlert from "./RegistrationExpiredAlert";
import {jwtDecode} from "jwt-decode";


const api = new ApiRoute();


const RegistrationForm: React.FC = () => {
  const location = useLocation();

  // Поля формы
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthday, setBirthday] = useState("");  // новое состояние для дня рождения

  // Состояние проверки токена и состояния формы
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  useEffect(() => {
    if (token) {
      fetch(api.CheckValidTokenForEmployee(), {
        method: "GET",
        headers: { Authorization: "Bearer " + token },
      })
        .then((res) => {
          if (!res.ok) throw new Error(res.statusText);
          return res.json();
        })
        .then((data) => setIsValid(data))
        .catch(() => setIsValid(false));
    } else {
      setIsValid(false);
    }
  }, [location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Валидация
    if (!lastName || !firstName || !middleName || !email || !password || !birthday) {
      setError("Пожалуйста, заполните все поля, включая день рождения.");
      setSubmitted(false);
      return;
    }

    setError("");
    setSubmitted(true);

    const companyId: number | null = token ? (jwtDecode(token) as any).companyId : null;
    fetch(api.CreateEmployee(), {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ companyId, lastName, firstName, middleName, email, password, birthday }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка сети");
        return res.text();
      })
      .then((data) => console.log("Успешный ответ:", data))
      .catch((err) => {
        console.error("Ошибка запроса:", err);
        setError("Ошибка при регистрации. Попробуйте позже.");
      });
  };

  if (isValid === null) {
    return <Container className="p-5 text-center">Проверка токена...</Container>;
  }

  if (isValid === false) {
    return (
      <Container className="p-5 text-center text-danger">
        <RegistrationExpiredAlert />
      </Container>
    );
  }

  return (
    <Container style={{ maxWidth: 500, padding: 20 }}>
      <h2 className="mb-4 text-center">Регистрация пользователей</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {submitted && <Alert variant="success">Регистрация прошла успешно!</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="lastName" className="mb-3">
          <Form.Label>Фамилия</Form.Label>
          <Form.Control
            type="text"
            placeholder="Введите фамилию"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="firstName" className="mb-3">
          <Form.Label>Имя</Form.Label>
          <Form.Control
            type="text"
            placeholder="Введите имя"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="middleName" className="mb-3">
          <Form.Label>Отчество</Form.Label>
          <Form.Control
            type="text"
            placeholder="Введите отчество"
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="email" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Введите email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="password" className="mb-4">
          <Form.Label>Пароль</Form.Label>
          <Form.Control
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="birthday" className="mb-4">
          <Form.Label>День рождения</Form.Label>
          <Form.Control
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
          />
        </Form.Group>

        <Button variant="success" type="submit" className="w-100">
          Зарегистрироваться
        </Button>
      </Form>
    </Container>
  );
};

export default RegistrationForm;
