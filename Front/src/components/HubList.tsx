import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Card, Button, Form, Modal, Dropdown } from "react-bootstrap";
import ApiRoute from "../api/ApiRoute";
import { useNavigate } from "react-router-dom";

interface ProjectHub {
  id: number;
  name: string;
  description?: string;
  projectStatus?: string;
}

const allModules = ["NEWS", "CALENDAR", "ANALYTICS", "TIME_TRACKER"];
const allStatuses = ["ACTIVE", "CLOSED", "ARCHIVED"];

const api = new ApiRoute();

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

const HubList: React.FC = () => {
  const [hubs, setHubs] = useState<ProjectHub[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newHubName, setNewHubName] = useState("");
  const [newHubDescription, setNewHubDescription] = useState("");
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
 
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [activeHub, setActiveHub] = useState<ProjectHub | null>(null);
  const [newStatus, setNewStatus] = useState<string>("ACTIVE");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const payload = token ? parseJwt(token) : null;
    if (payload && payload.role) {
      setUserRole(payload.role);
    } else {
      setUserRole(null);
    }
  }, []);

  const fetchHubs = useCallback(async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(api.getAllProjects(), {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        console.error("Ошибка получения списка хабов");
        return;
      }

      const hubsData: ProjectHub[] = await response.json();

      // Отобразить только активные хабы
      const activeHubs = hubsData.filter(hub => hub.projectStatus === "ACTIVE");

      setHubs(activeHubs);
    } catch (error) {
      console.error("Ошибка сети при получении хабов", error);
    }
  }, []);

  useEffect(() => {
    fetchHubs();
  }, [fetchHubs]);

  const goToHub = (hubId: number, hubName: string) => {
    navigate(`/hub/${hubId}`, { state: { projectName: hubName } });
  };

  const openForm = () => setShowCreateForm(true);
  const closeForm = () => {
    setShowCreateForm(false);
    setNewHubName("");
    setNewHubDescription("");
    setSelectedModules([]);
  };

  const toggleModule = (moduleName: string) => {
    setSelectedModules(prev =>
      prev.includes(moduleName)
        ? prev.filter(m => m !== moduleName)
        : [...prev, moduleName]
    );
  };

  const handleCreateHub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHubName.trim()) return;

    try {
      const token = localStorage.getItem("jwtToken");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const modulesToSend = selectedModules.includes("BASE_MODULE")
        ? selectedModules
        : ["BASE_MODULE", ...selectedModules];

      const response = await fetch(api.creaeProject(), {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: newHubName,
          description: newHubDescription,
          modules: modulesToSend,
        }),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: "Ошибка сервера или пустой ответ" };
        }
        console.error("Ошибка создания хаба", errorData);
        return;
      }

      await fetchHubs();
      closeForm();
    } catch (error) {
      console.error("Ошибка сети при создании хаба", error);
    }
  };

 

  const openStatusModal = (hub: ProjectHub) => {
    setActiveHub(hub);
    setNewStatus(hub.projectStatus || "ACTIVE");
    setShowStatusModal(true);
  };

  const closeStatusModal = () => {
    setShowStatusModal(false);
    setActiveHub(null);
  };

  // Передаем объект с полем status как строкой, чтобы backend успешно десериализовал
  const handleConfirmStatusChange = async () => {
    if (!activeHub) return;

    try {
      const token = localStorage.getItem("jwtToken");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(api.changeStatus(activeHub.id), {
        method: "PUT",
        headers,
        body: JSON.stringify(newStatus ), // Передаем как объект с полем status
      });

      if (!response.ok) {
        console.error("Ошибка при обновлении статуса");
        return;
      }

      await fetchHubs();
      closeStatusModal();
    } catch (error) {
      console.error("Ошибка сети при обновлении статуса", error);
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Список активных хабов проектов</h2>

      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {hubs.map(hub => (
          <Col key={hub.id}>
            <Card className="h-100 shadow-sm">
              <Card.Body
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest('.dropdown')) {
                    e.stopPropagation();
                  } else {
                    goToHub(hub.id, hub.name);
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <Card.Title className="fw-bold d-flex justify-content-between align-items-center">
                  {hub.name}
                  {userRole === "ROLE_ADMIN" && (
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="secondary"
                        id={`dropdown-status-${hub.id}`}
                        size="sm"
                      >
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => openStatusModal(hub)}>
                          Изменить статус
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                </Card.Title>
                <Card.Text className="text-muted">{hub.description || "Без описания"}</Card.Text>
                {hub.projectStatus && (
                  <div>
                    <strong>Статус: </strong> {hub.projectStatus}
                  </div>
                )}
              </Card.Body>



            </Card>
          </Col>
        ))}
        {userRole === "ROLE_ADMIN" && (
          <Col>
            <Card
              className="h-100 d-flex align-items-center justify-content-center shadow-sm text-center"
              style={{ cursor: "pointer" }}
              onClick={openForm}
            >
              <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                <Button
                  variant="outline-primary"
                  size="lg"
                  className="rounded-circle mb-3"
                  style={{ width: "4rem", height: "4rem", fontSize: "2rem" }}
                >
                  +
                </Button>
                <div className="fw-semibold text-primary">Создать хаб</div>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>

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

            <Form.Group controlId="hubModules" className="mb-3">
              <Form.Label>Выберите модули</Form.Label>
              {allModules.map((module) => (
                <Form.Check
                  key={module}
                  type="checkbox"
                  label={module}
                  checked={selectedModules.includes(module)}
                  onChange={() => toggleModule(module)}
                />
              ))}
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

      <Modal show={showStatusModal} onHide={closeStatusModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Изменить статус проекта</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="selectStatus">
            <Form.Label>Выберите новый статус</Form.Label>
            <Form.Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              {allStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeStatusModal}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleConfirmStatusChange}>
            Подтвердить
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default HubList;
