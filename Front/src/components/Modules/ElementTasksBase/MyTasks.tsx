import { useState, useEffect } from "react";
import { Container, Table, Button, Spinner, Modal } from "react-bootstrap";
import ApiRoute from "../../../api/ApiRoute";

const api = new ApiRoute();

type Task = {
  id: string;
  title: string;
  description:string;
  assignedUser: string;
  status: "NEW" | "IN_PROGRESS" | "TESTING" | "COMPLETED";
  dueDate: string; // добавлено поле срока
};

const statuses: Task["status"][] = ["NEW", "IN_PROGRESS", "TESTING", "COMPLETED"];

interface MyTasksProps {
  hubId: string;
  isActive: boolean;
}

const MyTasks: React.FC<MyTasksProps> = ({ hubId, isActive }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!hubId || !isActive) return;
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) throw new Error("Токен не найден");
        const response = await fetch(
          api.getTaskUsers() + `?hubId=${encodeURIComponent(hubId)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("Ошибка загрузки задач");
        const data: Task[] = await response.json();
        setTasks(data);
        setError(null);
      } catch (e: any) {
        setError(e.message || "Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [hubId, isActive]);

  const changeStatus = async (
    taskId: string,
    direction: "forward" | "backward"
  ) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const currentIndex = statuses.indexOf(task.status);
    let newIndex = direction === "forward" ? currentIndex + 1 : currentIndex - 1;
    if (newIndex < 0) newIndex = 0;
    if (newIndex >= statuses.length) newIndex = statuses.length - 1;
    const newStatus = statuses[newIndex];

    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) throw new Error("Токен не найден");

      const updatedTask = { ...task, status: newStatus };

      const response = await fetch(api.updateTask(taskId), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) throw new Error("Ошибка обновления статуса задачи");

      setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));
    } catch (e: any) {
      alert(e.message || "Ошибка обновления");
    }
  };

  if (loading)
    return (
      <Container className="mt-3">
        <Spinner animation="border" />
      </Container>
    );

  if (error)
    return (
      <Container className="mt-3">
        <div className="text-danger">Ошибка: {error}</div>
      </Container>
    );

  return (
    <Container>
      <h3>Мои задачи</h3>
      {tasks.length === 0 ? (
        <p>Нет задач, назначенных на вас.</p>
      ) : (
        <>
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th style={{ width: "50%" }}>Название</th>
                <th style={{ width: "20%", whiteSpace: "nowrap" }}>Статус</th>
                <th style={{ width: "30%", whiteSpace: "nowrap" }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(({ id, title, status }) => (
                <tr key={id} onClick={() => setSelectedTask(tasks.find(t => t.id === id) || null)} style={{ cursor: "pointer" }}>
                  <td>{title}</td>
                  <td style={{ width: "20%", whiteSpace: "nowrap" }}>{status}</td>
                  <td style={{ width: "30%", whiteSpace: "nowrap" }}>
                    <Button
                      size="sm"
                      variant="warning"
                      disabled={status === "NEW"}
                      onClick={(e) => {
                        e.stopPropagation();
                        changeStatus(id, "backward");
                      }}
                      className="me-2"
                    >
                      ← Назад
                    </Button>
                    <Button
                      size="sm"
                      variant="success"
                      disabled={status === "COMPLETED"}
                      onClick={(e) => {
                        e.stopPropagation();
                        changeStatus(id, "forward");
                      }}
                    >
                      Вперед →
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Modal show={!!selectedTask} onHide={() => setSelectedTask(null)}>
            <Modal.Header closeButton>
              <Modal.Title>Информация о задаче</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedTask && (
                <>
                  <p><strong>Цель задачи:</strong> {selectedTask.description}</p>
                  <p><strong>Срок выполнения:</strong> {new Date(selectedTask.dueDate).toLocaleDateString()}</p>
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setSelectedTask(null)}>
                Закрыть
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </Container>
  );
};

export default MyTasks;
