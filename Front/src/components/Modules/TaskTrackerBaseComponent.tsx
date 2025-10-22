import { useState } from "react";
import { Tabs, Tab, Button } from "react-bootstrap";
import Tasks from "./ElementTasksBase/Tasks";
import Kamban from "./ElementTasksBase/Kamban";
import MyTasks from "./ElementTasksBase/MyTasks";

type TaskTrackerBaseComponentProps = {
  projectHubId: string;
};

const TaskTrackerBaseComponent: React.FC<TaskTrackerBaseComponentProps> = ({ projectHubId }) => {
  const [activeKey, setActiveKey] = useState("kamban");
  const [showTasks, setShowTasks] = useState(false);

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
      <Tabs
        activeKey={activeKey}
        onSelect={(k) => k && setActiveKey(k)}
        className="mb-3"
        id="Tasks_module"
      >
        <Tab eventKey="kamban" title="Kamban">
          <div style={{ padding: 20, minHeight: 400 }}>
            <Button variant="primary" className="mb-3" onClick={openTasks}>
              Создать задачу
            </Button>
            <Kamban projectHubId={projectHubId}/>
          </div>
        </Tab>

        {showTasks && (
          <Tab eventKey="tasks" title="Создание задачи" tabClassName="d-none">
            <div style={{ padding: 20, minHeight: 400 }}>
              <Button variant="secondary" className="mb-3" onClick={closeTasks}>
                Вернуться к Kamban
              </Button>
              <Tasks projectHubId={projectHubId} />
            </div>
          </Tab>
        )}

        <Tab eventKey="myTasks" title="Мои задачи">
          <div style={{ padding: 20, minHeight: 200 }}>
            <MyTasks hubId={projectHubId} />
          </div>
        </Tab>
      </Tabs>
    </>
  );
};

export default TaskTrackerBaseComponent;
