import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Modal, Form } from "react-bootstrap";
import ApiRoute from "../../../api/ApiRoute";
import { fetchCompanyUsers } from "../../Funcions/GetUsers";

const api = new ApiRoute();

type Task = {
  id: string;
  title: string;
  assignedUser: string | null;
  status: "NEW" | "IN_PROGRESS" | "TESTING" | "COMPLETED";
  description: string;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
};

const statuses: Task["status"][] = ["NEW", "IN_PROGRESS", "TESTING", "COMPLETED"];

interface MyComponentProps {
  projectHubId: string;
}

const KanbanBoard: React.FC<MyComponentProps> = ({ projectHubId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [users, setUsers] = useState<{ id: string; username: string }[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const token = localStorage.getItem("jwtToken");

  const changeTaskStatus = async (task: Task, newStatus: Task["status"]) => {
    if (!token) return;
    try {
      const updatedTask = { ...task, status: newStatus };
      const res = await fetch(api.updateTask(task.id), {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(updatedTask),
      });
      if (!res.ok) throw new Error("Ошибка обновления статуса");
      await fetchTasks();
    } catch (e: any) {
      setError(e.message);
    }
  };
  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    if (!token) {
      setError("Нет токена авторизации");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(api.getAllTasks() + `?hubId=${projectHubId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Ошибка загрузки задач");
      const data = await res.json();
      setTasks(data);
      setError(null);
    } catch (e: any) {
      setError(e.message || "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const fetchedUsers = await fetchCompanyUsers();
      setUsers(fetchedUsers);
    } finally {
      setLoadingUsers(false);
    }
  };

  const openView = (task: Task) => {
    setEditingTask(task);
    setIsEditMode(false);
  };
  const closeModal = () => {
    setEditingTask(null);
    setIsEditMode(false);
  };

  const handleInputChange = (field: keyof Task, value: string) => {
    if (editingTask) {
      setEditingTask({ ...editingTask, [field]: value });
    }
  };

  const handleSave = async () => {
    if (!editingTask || !token) return;

    try {
      const res = await fetch(api.updateTask(editingTask.id), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingTask),
      });
      if (!res.ok) throw new Error("Ошибка при сохранении задачи");

      await fetchTasks();
      closeModal();
    } catch (e: any) {
      setError(e.message);
    }
  };

  if (loading) return <div>Загрузка задач...</div>;

  if (error)
    return (
      <Container className="mt-3">
        <div className="text-danger">Ошибка: {error}</div>
      </Container>
    );

  return (
    <Container fluid>
    <h3>Канбан-доска задач</h3>
    <Row>
      {statuses.map((status) => (
        <Col key={status}>
          <h5 className="d-flex align-items-center">
            {status === "NEW"
              ? "Новые"
              : status === "IN_PROGRESS"
              ? "В работе"
              : status === "TESTING"
              ? "В тестировании"
              : "Выполнены"}
            {status === "COMPLETED" && (
              <Button
                variant="success"
                size="sm"
                className="ms-2"
                title="Отправить все выполненные задачи"
                onClick={() => {
                  // здесь ваша логика массовой отправки
                }}
              >
                ✔
              </Button>
            )}
          </h5>
          <div
            style={{
              minHeight: "400px",
              backgroundColor: "#f8f9fa",
              padding: "8px",
              borderRadius: "4px",
            }}
          >
            {tasks
              .filter((t) => t.status === status)
              .map((task) => (
                <Card
                  key={task.id}
                  className="mb-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => openView(task)}
                >
                  <Card.Body>
                    <Card.Title style={{ fontSize: "1rem" }}>{task.title}</Card.Title>
                    <Card.Text style={{ fontSize: "0.85rem", color: "#555" }}>
                      Исполнитель: {task.assignedUser || "Не назначен"}
                    </Card.Text>
                    <Card.Text style={{ fontSize: "0.75rem", color: "#666" }}>
                      Описание: {task.description}
                    </Card.Text>
                    <Card.Text style={{ fontSize: "0.7rem", color: "#999" }}>
                      Срок до: {new Date(task.dueDate).toLocaleDateString()}
                    </Card.Text>

                    <div>
                      {/* Кнопка назад по статусу */}
                      {task.status !== "NEW" && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            const currentIdx = statuses.indexOf(task.status);
                            if (currentIdx > 0) {
                              changeTaskStatus(task, statuses[currentIdx - 1]);
                            }
                          }}
                        >
                          ←
                        </Button>
                      )}

                      {/* Кнопка вперед по статусу */}
                      {task.status !== "COMPLETED" && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            const currentIdx = statuses.indexOf(task.status);
                            if (currentIdx < statuses.length - 1) {
                              changeTaskStatus(task, statuses[currentIdx + 1]);
                            }
                          }}
                        >
                          →
                        </Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              ))}
          </div>
        </Col>
      ))}
    </Row>


      <Modal show={!!editingTask} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? "Редактирование задачи" : "Просмотр задачи"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingTask && (
            <>
              {isEditMode ? (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Название</Form.Label>
                    <Form.Control
                      type="text"
                      value={editingTask.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Исполнитель</Form.Label>
                    <Form.Select
                      value={editingTask.assignedUser || ""}
                      onChange={(e) => handleInputChange("assignedUser", e.target.value)}
                      disabled={loadingUsers}
                    >
                      <option value="">Не назначен</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.username}>
                          {user.username}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Статус</Form.Label>
                    <Form.Select
                      value={editingTask.status}
                      onChange={(e) =>
                        handleInputChange("status", e.target.value as Task["status"])
                      }
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status === "NEW"
                            ? "Новая"
                            : status === "IN_PROGRESS"
                              ? "В работе"
                              : status === "TESTING"
                                ? "В тестировании"
                                : "Выполнена"}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Описание</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={editingTask.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Срок выполнения</Form.Label>
                    <Form.Control
                      type="date"
                      value={editingTask.dueDate ? editingTask.dueDate.substring(0, 10) : ""}
                      onChange={(e) => handleInputChange("dueDate", e.target.value)}
                    />
                  </Form.Group>
                </>
              ) : (
                <>
                  <p>
                    <strong>Задача:</strong> {editingTask.title}
                  </p>
                  <p>
                    <strong>Исполнитель:</strong> {editingTask.assignedUser || "Не назначен"}
                  </p>
                  <p>
                    <strong>Статус:</strong> {editingTask.status}
                  </p>
                  <p>
                    <strong>Описание:</strong> {editingTask.description}
                  </p>
                  <p>
                    <strong>Срок до:</strong>{" "}
                    {new Date(editingTask.dueDate).toLocaleDateString()}
                  </p>
                </>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {!isEditMode && (
            <Button variant="primary" onClick={() => setIsEditMode(true)}>
              Редактировать
            </Button>
          )}
          {isEditMode && (
            <>
              <Button variant="secondary" onClick={() => setIsEditMode(false)}>
                Отмена
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Сохранить
              </Button>
            </>
          )}
          <Button variant="secondary" onClick={closeModal}>
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default KanbanBoard;
