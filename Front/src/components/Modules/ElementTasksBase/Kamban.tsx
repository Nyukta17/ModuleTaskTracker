import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import ApiRoute from "../../../api/ApiRoute";

const api = new ApiRoute();

type Task = {
  id: string;
  title: string;
  assignedEmployeeName: string | null;
  status: "NEW" | "IN_PROGRESS" | "TESTING" | "APPROVED";
  description: string;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
};

const statuses: Task["status"][] = ["NEW", "IN_PROGRESS", "TESTING", "APPROVED"];

type KanbanBoardProps = {
  projectHubId: string;
};

const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectHubId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const fetchTasksFromBackend = async () => {
    const token = localStorage.getItem("jwtToken");
    try {
      const response = await fetch("", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Ошибка загрузки задач");
      }
      const data: Task[] = await response.json();
      setTasks(data);
      console.log(data)
    } catch (e: any) {
      setError(e.message || "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectHubId) {
      setLoading(true);
      fetchTasksFromBackend();
    }
  }, [projectHubId]);

  const changeStatus = async (taskId: string, direction: "forward" | "backward") => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const currentIndex = statuses.indexOf(task.status);
    let newIndex = direction === "forward" ? currentIndex + 1 : currentIndex - 1;
    newIndex = Math.min(Math.max(newIndex, 0), statuses.length - 1);
    const newStatus = statuses[newIndex];

    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch("", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Ошибка обновления статуса задачи");
      }

      setTasks(prev =>
        prev.map(t => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
    } catch (e: any) {
      alert(e.message || "Ошибка обновления");
    }
  };

  const openEdit = (task: Task) => setEditingTask(task);
  const closeEdit = () => setEditingTask(null);

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
        {statuses.map(status => (
          <Col key={status}>
            <h5>
              {status === "NEW"
                ? "Новые"
                : status === "IN_PROGRESS"
                ? "В работе"
                : status === "TESTING"
                ? "В тестировании"
                : "Выполнены"}
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
                .filter(t => t.status === status)
                .map(task => (
                  <Card
                    key={task.id}
                    className="mb-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => openEdit(task)}
                  >
                    <Card.Body>
                      <Card.Title style={{ fontSize: "1rem" }}>{task.title}</Card.Title>
                      <Card.Text style={{ fontSize: "0.85rem", color: "#555" }}>
                        Исполнитель: {task.assignedEmployeeName || "Не назначен"}
                      </Card.Text>
                      <Card.Text style={{ fontSize: "0.75rem", color: "#666" }}>
                        Описание: {task.description}
                      </Card.Text>
                      <Card.Text style={{ fontSize: "0.7rem", color: "#999" }}>
                        Срок до: {new Date(task.dueDate).toLocaleDateString()}
                      </Card.Text>
                      <div className="d-flex justify-content-between">
                        <Button
                          size="sm"
                          disabled={status === "NEW"}
                          onClick={e => {
                            e.stopPropagation();
                            changeStatus(task.id, "backward");
                          }}
                        >
                          ← Назад
                        </Button>
                        <Button
                          size="sm"
                          disabled={status === "APPROVED"}
                          onClick={e => {
                            e.stopPropagation();
                            changeStatus(task.id, "forward");
                          }}
                        >
                          Вперед →
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
            </div>
          </Col>
        ))}
      </Row>

      <Modal show={!!editingTask} onHide={closeEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Редактирование задачи</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingTask && (
            <>
              <p><strong>Задача:</strong> {editingTask.title}</p>
              <p><strong>Исполнитель:</strong> {editingTask.assignedEmployeeName || "Не назначен"}</p>
              <p><strong>Статус:</strong> {editingTask.status}</p>
              <p><strong>Описание:</strong> {editingTask.description}</p>
              <p><strong>Срок до:</strong> {new Date(editingTask.dueDate).toLocaleDateString()}</p>
            </>
          )}
          <div>Реализуйте здесь редактирование задачи позже</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeEdit}>Закрыть</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default KanbanBoard;