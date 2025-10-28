import React, { useState, useEffect } from "react";
import { Tabs, Tab, Button } from "react-bootstrap";
import Tasks from "./ElementTasksBase/Tasks";
import Kamban from "./ElementTasksBase/Kamban";
import MyTasks from "./ElementTasksBase/MyTasks";
import { jwtDecode } from "jwt-decode";

type TaskTrackerBaseComponentProps = {
  projectHubId: string;
};

const TaskTrackerBaseComponent: React.FC<TaskTrackerBaseComponentProps> = ({ projectHubId }) => {
  const [activeKey, setActiveKey] = useState("kamban");
  const [showTasks, setShowTasks] = useState(false);
  const [userRole, setUserRole] = useState<any>(null);

  // Получение роли пользователя из токена
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        const decoded = jwtDecode<{ role: string }>(token);
        setUserRole(decoded.role);
      } catch {
        setUserRole(null);
      }
    }
  }, []);

  const openTasks = () => {
    setShowTasks(true);
    setActiveKey("tasks");
  };

  const closeTasks = () => {
    setShowTasks(false);
    setActiveKey("kamban");
  };

  return (
    <>
      <Tabs activeKey={activeKey} onSelect={(k) => k && setActiveKey(k)} className="mb-3" id="Tasks_module">
        <Tab eventKey="kamban" title="Kamban">
          <div style={{ padding: 20, minHeight: 400 }}>
            {/* Показываем кнопку только если роль не ROLE_USERS */}
            {userRole !== "ROLE_USERS" && (
              <Button variant="primary" className="mb-3" onClick={openTasks}>
                Создать задачу
              </Button>
            )}
            <Kamban projectHubId={projectHubId} isActive={activeKey === 'kamban'} />
          </div>
        </Tab>

        {showTasks && (
          <Tab eventKey="tasks" title="Создание задачи" tabClassName="d-none">
            <div style={{ padding: 20, minHeight: 400 }}>
              <Button variant="success" className="mb-3" onClick={closeTasks}>
                Вернуться к Kamban
              </Button>
              <Tasks projectHubId={projectHubId} />
            </div>
          </Tab>
        )}

        <Tab eventKey="myTasks" title="Мои задачи">
          <div style={{ padding: 20, minHeight: 200 }}>
            <MyTasks hubId={projectHubId} isActive={activeKey === "myTasks"} />
          </div>
        </Tab>
      </Tabs>
    </>
  );
};

export default TaskTrackerBaseComponent;
