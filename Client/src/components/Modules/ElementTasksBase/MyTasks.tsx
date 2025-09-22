import  { useState, useEffect } from "react";
import { Container, Table, Button, Spinner } from "react-bootstrap";
import ApiRoute from "../../../api/ApiRoute";
const api = new ApiRoute
type Task = {
  id: string;
  title: string;
  assignedUser: string;
  status: "NEW" | "IN_PROGRESS" | "TESTING" | "DONE";
};

const statuses: Task["status"][] = ["NEW", "IN_PROGRESS", "TESTING", "DONE"];

const MyTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function parseJwt(token: any) {
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

  // Загрузка задач при монтировании
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const id = parseJwt(token).companyId;
        const response = await fetch(api.getMyTask(id), {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json"
          }
        });
        if (!response.ok) {
          throw new Error("Ошибка загрузки задач");
        }
        const data: Task[] = await response.json();
        setTasks(data);
        
      } catch (e: any) {
        setError(e.message || "Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Обновление статуса задачи и отправка на сервер
  const changeStatus = async (taskId: string, direction: "forward" | "backward") => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const currentIndex = statuses.indexOf(task.status);
    let newIndex = direction === "forward" ? currentIndex + 1 : currentIndex - 1;
    if (newIndex < 0) newIndex = 0;
    if (newIndex >= statuses.length) newIndex = statuses.length - 1;
    const newStatus = statuses[newIndex];

    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(api.updateTaskStatus(taskId), {
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
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
    } catch (e: any) {
      alert(e.message || "Ошибка обновления");
    }
  };

  if (loading) return (
    <Container className="mt-3">
      <Spinner animation="border" />
    </Container>
  );

  if (error) return (
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
        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>Название</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(({ id, title, status }) => (
              <tr key={id}>
                <td>{title}</td>
                <td>{status}</td>
                <td>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={status === "NEW"}
                    onClick={() => changeStatus(id, "backward")}
                    className="me-2"
                  >
                    ← Назад
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    disabled={status === "DONE"}
                    onClick={() => changeStatus(id, "forward")}
                  >
                    Вперед →
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default MyTasks;
