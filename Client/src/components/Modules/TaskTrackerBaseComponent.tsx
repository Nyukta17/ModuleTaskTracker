import { useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import Tasks from "./ElementTasksBase/Tasks";
import Kamban from "./ElementTasksBase/Kamban";
import MyTasks from "./ElementTasksBase/MyTasks";

type TaskTrackerBaseComponentProps = {
  projectHubId: string;
};

const TaskTrackerBaseComponent: React.FC<TaskTrackerBaseComponentProps> = ({ projectHubId }) => {
  const [activeKey, setActiveKey] = useState("tasks");
  return (
    <>
      <Tabs
        activeKey={activeKey}
        onSelect={(k) => k && setActiveKey(k)}
        className="md-3"
        id="Tasks_module"
      >
        <Tab eventKey="tasks" title="Tasks">
          <div style={{ padding: 20, minHeight: 200 }}>
            <Tasks />
          </div>
        </Tab>
        <Tab eventKey="timeBoard" title="Kamban">
          <div style={{ padding: 20, minHeight: 200 }}>
            <Kamban projectHubId={projectHubId} />
          </div>
        </Tab>
        <Tab eventKey="prioritiTasks" title="Мои задачи">
          <div style={{ padding: 20, minHeight: 200 }}>
            <MyTasks hubId={projectHubId} />
            {/* передаем prop hubId в MyTasks */}
          </div>
        </Tab>
      </Tabs>
    </>
  );
};

export default TaskTrackerBaseComponent;
