import React, { useState } from "react";
import { Button, Card, Container, Form, InputGroup, ListGroup, Row, Col, Alert } from "react-bootstrap";
import ApiRoute from "../api/ApiRoute";

const AdminPanel: React.FC = () => {
    const [regLink, setRegLink] = useState<string>("");
    const [newUserName, setNewUserName] = useState("");
    const [newUserEmail, setNewUserEmail] = useState("");
    const [newUserRole, setNewUserRole] = useState("ROLE_USER");
    const [message, setMessage] = useState<string | null>(null);
    const api = new ApiRoute();
    const token = localStorage.getItem("jwtToken");
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`

    const generateRegistrationLink = async () => {
        setMessage(null);
        try {
            // Пустой fetch, чтобы вызвать API генерации ссылки
            const response = await fetch(api.generateRegLink(), {
                method: "POST",
                headers,
                body: JSON.stringify({}), // пустое тело
            });
            if (!response.ok) {
                setMessage("Ошибка при генерации ссылки");
                return;
            }
            const data = await response.text();
            setRegLink(data || "");
        } catch {
            setMessage("Ошибка сети при генерации ссылки");
        }
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        try {
            await fetch("/api/admin/add-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: newUserName, email: newUserEmail, role: newUserRole }),
            });
            setMessage("Пользователь добавлен (запрос отправлен)");
            setNewUserName("");
            setNewUserEmail("");
            setNewUserRole("ROLE_USER");
        } catch {
            setMessage("Ошибка сети при добавлении пользователя");
        }
    };

    // Пустой список пользователей, запрос не реализован, пока просто заглушка
    const users = [];

    return (
        <Container className="mt-4">
            <h1>Админ-панель</h1>
            {message && <Alert variant="info">{message}</Alert>}

            <Card className="mb-4 p-3">
                <h4>Генерация ссылки для регистрации</h4>
                <InputGroup className="mb-3">
                    <Form.Control readOnly value={regLink || ""} placeholder="Ссылка будет показана здесь" />
                    <Button variant="primary" onClick={generateRegistrationLink}>
                        Сгенерировать
                    </Button>
                </InputGroup>
            </Card>

            <Card className="mb-4 p-3">
                <h4>Добавить нового пользователя</h4>
                <Form onSubmit={handleAddUser}>
                    <Row className="mb-3">
                        <Col>
                            <Form.Control
                                placeholder="Имя пользователя"
                                value={newUserName}
                                onChange={e => setNewUserName(e.target.value)}
                                required
                            />
                        </Col>
                        <Col>
                            <Form.Control
                                placeholder="Email"
                                value={newUserEmail}
                                onChange={e => setNewUserEmail(e.target.value)}
                                type="email"
                                required
                            />
                        </Col>
                        <Col>
                            <Form.Select value={newUserRole} onChange={e => setNewUserRole(e.target.value)}>
                                <option value="ROLE_USER">Пользователь</option>
                                <option value="ROLE_ADMIN">Администратор</option>
                            </Form.Select>
                        </Col>
                        <Col md="auto">
                            <Button type="submit">Добавить</Button>
                        </Col>
                    </Row>
                </Form>
            </Card>

            <Card className="p-3">
                <h4>Список пользователей</h4>
                <ListGroup>
                    {users.length === 0 && (
                        <ListGroup.Item>Пользователи не загружены</ListGroup.Item>
                    )}
                    {/* Здесь позже будет рендер списка пользователей с кнопками редактирования ролей */}
                </ListGroup>
            </Card>
        </Container>
    );
};

export default AdminPanel;
