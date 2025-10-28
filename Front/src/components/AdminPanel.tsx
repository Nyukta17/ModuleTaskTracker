import React, { useState, useEffect } from "react";
import { Button, Card, Container, Form, InputGroup, ListGroup, Alert, Modal } from "react-bootstrap";
import ApiRoute from "../api/ApiRoute";

const AdminPanel: React.FC = () => {
  const [regLink, setRegLink] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [users, setUsers] = useState<{ id: number; username: string; role: string }[]>([]);
  const [userSearch, setUserSearch] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<typeof users>([]);
  const [projects, setProjects] = useState<{ id: number; name: string; projectStatus: string }[]>([]);
  const [closedCount, setClosedCount] = useState<number>(0);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [activeProject, setActiveProject] = useState<{ id: number; projectStatus: string } | null>(null);
  const [newStatus, setNewStatus] = useState<string>("ARCHIVED");

  const api = new ApiRoute();
  const token = localStorage.getItem("jwtToken");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  // Генерация ссылки
  const generateRegistrationLink = async () => {
    setMessage(null);
    try {
      const response = await fetch(api.generateRegLink(), {
        method: "POST",
        headers,
        body: JSON.stringify({}),
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

  // Загрузка пользователей
  const fetchUsers = async () => {
    setMessage(null);
    try {
      const response = await fetch(api.getUsers(), { headers });
      if (!response.ok) {
        setMessage("Ошибка при загрузке пользователей");
        return;
      }
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch {
      setMessage("Ошибка сети при загрузке пользователей");
    }
  };

  // Загрузка проектов (заархивированных) и количества закрытых
  const fetchProjectsAndClosedCount = async () => {
    setMessage(null);
    try {
      const projectsResponse = await fetch(api.getArchivedProjects(), { headers });
      if (!projectsResponse.ok) {
        setMessage("Ошибка при загрузке архивированных проектов");
        return;
      }
      const projectsData = await projectsResponse.json();

      const closedCountResponse = await fetch(api.getClosedProjectsCount(), { headers });
      if (!closedCountResponse.ok) {
        setMessage("Ошибка при загрузке количества закрытых проектов");
        return;
      }
      const closedCountData = await closedCountResponse.json();
      setProjects(projectsData);
      setClosedCount(closedCountData || 0);
    } catch {
      setMessage("Ошибка сети при загрузке данных");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchProjectsAndClosedCount();
  }, []);

  // Фильтрация пользователей по строке поиска
  useEffect(() => {
    if (!userSearch.trim()) {
      setFilteredUsers(users);
    } else {
      const lowered = userSearch.toLowerCase();
      setFilteredUsers(
        users.filter((user) =>
          user.username.toLowerCase().includes(lowered) || user.role.toLowerCase().includes(lowered)
        )
      );
    }
  }, [userSearch, users]);

  // Открытие модалки изменения статуса
  const openStatusModal = (project: { id: number; projectStatus: string }) => {
    setActiveProject(project);
    setNewStatus(project.projectStatus);
    setShowStatusModal(true);
  };

  // Закрытие модалки
  const closeStatusModal = () => {
    setShowStatusModal(false);
    setActiveProject(null);
  };

  // Подтверждение смены статуса
  const handleConfirmStatusChange = async () => {
    if (!activeProject) return;
    try {
      const response = await fetch(api.changeStatus(activeProject.id), {
        method: "PUT",
        headers,
        body: JSON.stringify( newStatus ),
      });
      if (!response.ok) {
        setMessage("Ошибка при обновлении статуса");
        return;
      }
      await fetchProjectsAndClosedCount();
      closeStatusModal();
      setMessage("Статус обновлен успешно");
    } catch {
      setMessage("Ошибка сети при обновлении статуса");
    }
  };

  // Изменение роли пользователя на сервере
  const changeUserRole = async (userId: number, newRole: string) => {
    try {
      const response = await fetch(api.changeUserRole(userId), {
        method: "PUT",
        headers,
        body: JSON.stringify( newRole ),
      });
      if (!response.ok) {
        setMessage("Ошибка при обновлении роли пользователя");
        return;
      }
      await fetchUsers();
      setMessage("Роль пользователя успешно обновлена");
    } catch {
      setMessage("Ошибка сети при обновлении роли пользователя");
    }
  };

  return (
    <Container className="mt-4">
      <h1>Админ-панель</h1>
      {message && <Alert variant="info">{message}</Alert>}

      {/* Генерация ссылки */}
      <Card className="mb-4 p-3">
        <h4>Генерация ссылки для регистрации</h4>
        <InputGroup className="mb-3">
          <Form.Control readOnly value={regLink || ""} placeholder="Ссылка будет показана здесь" />
          <Button variant="primary" onClick={generateRegistrationLink}>
            Сгенерировать
          </Button>
        </InputGroup>
      </Card>

      {/* Поиск пользователей */}
      <Card className="mb-4 p-3">
        <h4>Список пользователей</h4>
        <Form.Control
          type="text"
          placeholder="Поиск пользователей по имени или роли"
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
          className="mb-3"
        />
        <ListGroup style={{ maxHeight: "300px", overflowY: "auto" }}>
          {filteredUsers.length === 0 ? (
            <ListGroup.Item>Пользователи не найдены</ListGroup.Item>
          ) : (
            filteredUsers.map((user) => (
              <ListGroup.Item key={user.id} className="d-flex justify-content-between align-items-center">
                <div>
                  <h4>{user.username}</h4>
                  <div>{user.role}</div>
                </div>
                <Form.Select
                  value={user.role}
                  onChange={(e) => changeUserRole(user.id, e.target.value)}
                  style={{ width: "150px" }}
                  aria-label={`Изменить роль пользователя ${user.username}`}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="DEVELOPER">DEVELOPER</option>
                  <option value="QA">QA</option>
                </Form.Select>
              </ListGroup.Item>
            ))
          )}
        </ListGroup>
      </Card>


      {/* Заархивированные проекты */}
      <Card className="mb-4 p-3">
        <h4>Заархивированные проекты</h4>
        <ListGroup>
          {projects.length === 0 ? (
            <ListGroup.Item>Архив пуст</ListGroup.Item>
          ) : (
            projects.map((project) => (
              <ListGroup.Item
                key={project.id}
                className="d-flex justify-content-between align-items-center"
              >
                <span>
                  {project.name} — <em>{project.projectStatus}</em>
                </span>
                <Button variant="outline-primary" size="sm" onClick={() => openStatusModal(project)}>
                  Изменить статус
                </Button>
              </ListGroup.Item>
            ))
          )}
        </ListGroup>
      </Card>

      {/* Закрытые проекты количество */}
      <Card className="p-3">
        <h4>Закрытые проекты: {closedCount}</h4>
      </Card>

      {/* Модальное окно для изменения статуса */}
      <Modal show={showStatusModal} onHide={closeStatusModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Изменить статус проекта</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="selectStatus">
            <Form.Label>Выберите новый статус</Form.Label>
            <Form.Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
              {["ACTIVE", "CLOSED", "ARCHIVED"].map((status) => (
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

export default AdminPanel;
