import React, { useState } from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import CompanyNewsComponent from "./Modules/CompanyNewsComponent";
import CalendarComponent from "./Modules/CalendarComponent";
import TimeTrackerComponent from "./Modules/TimeTrackerComponent";
import TaskTrackerBaseComponent from "./Modules/TaskTrackerBaseComponent";

interface ModuleDTO {
  id: string;
  name: string;
}

interface Props {
  data: Record<string, boolean>;
  projectHubId: string; // добавляем пропс с id хаба
}

const moduleNamesMap: Record<string, string> = {
  analytics: "Analytics",
  timeTracker: "Time Tracker",
  calendar: "Calendar",
  companyNews: "Company News",
  task_tracker_base: "Task Tracker Base",
};

const DynamicTabs: React.FC<Props> = ({ data, projectHubId }) => {
  let modules: ModuleDTO[] = Object.entries(data)
    .filter(([key, value]) => value && moduleNamesMap[key])
    .map(([key]) => ({ id: key, name: moduleNamesMap[key] }));

  modules.sort((a, b) =>
    a.id === "analytics" ? -1 : b.id === "analytics" ? 1 : 0
  );

  const [activeKey, setActiveKey] = useState<string>(modules[0]?.id || "");

  if (modules.length === 0) return <p>Нет доступных модулей для отображения.</p>;

  const renderTabContent = (moduleId: string) => {
    switch (moduleId) {
      // case "analytics":
      //   return <AnalyticsComponent />;
      case "timeTracker":
        return <TimeTrackerComponent />;
      case "calendar":
        return <CalendarComponent />;
      case "companyNews":
        return <CompanyNewsComponent />;
      case "task_tracker_base":
        return <TaskTrackerBaseComponent projectHubId={projectHubId} />;
      default:
        return <p>Модуль не реализован.</p>;
    }
  };

  return (
    <Tabs
      activeKey={activeKey}
      onSelect={(k) => k && setActiveKey(k)}
      className="mb-3"
      id="dynamic-tabs"
    >
      {modules.map((module) => (
        <Tab eventKey={module.id} title={module.name} key={module.id}>
          <div style={{ padding: 20, minHeight: 200 }}>
            {renderTabContent(module.id)}
          </div>
        </Tab>
      ))}
    </Tabs>
  );
};

export default DynamicTabs;
