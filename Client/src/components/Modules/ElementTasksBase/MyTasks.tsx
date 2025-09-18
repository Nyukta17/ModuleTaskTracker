import  { useState, useEffect } from "react";
import { Container, Table, Button, Spinner } from "react-bootstrap";

type Task = {
  id: string;
  title: string;
  assignedUser: string;
  status: "NEW" | "IN_PROGRESS" | "TESTING" | "DONE";
};

const statuses: Task["status"][] = ["NEW", "IN_PROGRESS", "TESTING", "DONE"];



// Фейковый запрос для загрузки задач текущего пользователя
const fakeFetchMyTasks = (): Promise<Task[]> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: "1", title: "Первая задача", assignedUser: "Иванов", status: "NEW" },
        { id: "2", title: "Четвертая задача", assignedUser: "Иванов", status: "TESTING" },
        { id: "3", title: "Пятая задача", assignedUser: "Иванов", status: "IN_PROGRESS" },
      ]);
    }, 1000);
  });

const MyTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fakeFetchMyTasks().then((data) => {
      setTasks(data);
      setLoading(false);
    });
  }, []);

  const changeStatus = (taskId: string, direction: "forward" | "backward") => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;
        const currentIndex = statuses.indexOf(task.status);
        let newIndex = direction === "forward" ? currentIndex + 1 : currentIndex - 1;
        if (newIndex < 0) newIndex = 0;
        if (newIndex >= statuses.length) newIndex = statuses.length - 1;
        return { ...task, status: statuses[newIndex] };
      })
    );
  };

  return (
    <Container>
      <h3>Мои задачи</h3>
      {loading ? (
        <Spinner animation="border" />
      ) : tasks.length === 0 ? (
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
