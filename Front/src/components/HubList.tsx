import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form, Modal } from "react-bootstrap";
import ApiRoute from "../api/ApiRoute";

interface ProjectHub {
  id: number;
  name: string;
  description?: string;
}
const api = new ApiRoute()

const HubList: React.FC = () => {
  const [hubs, setHubs] = useState<ProjectHub[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newHubName, setNewHubName] = useState("");
  const [newHubDescription, setNewHubDescription] = useState("");

  useEffect(() => {
    // Заглушка для загрузки проектов
    const fetchHubs = async () => {
      setHubs([
        { id: 1, name: "Проект Alpha", description: "Описание проекта Alpha" },
        { id: 2, name: "Проект Beta", description: "Описание проекта Beta" },
        { id: 3, name: "Проект Gamma", description: "Описание проекта Gamma" },
      ]);
    };
    fetchHubs();
  }, []);

  const openForm = () => setShowCreateForm(true);
  const closeForm = () => {
    setShowCreateForm(false);
    setNewHubName("");
    setNewHubDescription("");
  };

  const handleCreateHub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHubName.trim()) return;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(api.creaeProject(), {
        method: "POST",
        headers: {
          "Authorization": token ? `Bearer ${token}` : "",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: newHubName,
          description: newHubDescription,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Ошибка создания хаба", errorData);
        return;
      }

      const createdHub = await response.json();
      setHubs([...hubs, createdHub]);
      closeForm();

    } catch (error) {
      console.error("Ошибка сети при создании хаба", error);
    }
  };


  return (
    <Container className="mt-5">
      <h2 className="mb-4">Список хабов проектов</h2>
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {hubs.map((hub) => (
          <Col key={hub.id}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title className="fw-bold">{hub.name}</Card.Title>
                <Card.Text className="text-muted">{hub.description || "Без описания"}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
        {/* Карточка с кнопкой "+" */}
        <Col>
          <Card
            className="h-100 d-flex align-items-center justify-content-center shadow-sm text-center"
            style={{ cursor: "pointer" }}
            onClick={openForm}
          >
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
              <Button variant="outline-primary" size="lg" className="rounded-circle mb-3" style={{ width: "4rem", height: "4rem", fontSize: "2rem" }}>
                +
              </Button>
              <div className="fw-semibold text-primary">Создать хаб</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Модальное окно с формой */}
      <Modal show={showCreateForm} onHide={closeForm} centered>
        <Modal.Header closeButton>
          <Modal.Title>Создать новый хаб</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateHub}>
            <Form.Group controlId="hubName" className="mb-3">
              <Form.Label>Название</Form.Label>
              <Form.Control
                type="text"
                placeholder="Введите название хаба"
                value={newHubName}
                onChange={(e) => setNewHubName(e.target.value)}
                required
                autoFocus
              />
            </Form.Group>
            <Form.Group controlId="hubDescription" className="mb-3">
              <Form.Label>Описание</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Введите описание (необязательно)"
                value={newHubDescription}
                onChange={(e) => setNewHubDescription(e.target.value)}
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={closeForm} className="me-2">
                Отмена
              </Button>
              <Button variant="primary" type="submit">
                Создать
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default HubList;
