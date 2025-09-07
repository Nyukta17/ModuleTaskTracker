import React, { useState, useEffect } from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import ApiRoute from "../api/ApiRoute";

const api = new ApiRoute();

interface ModuleDTO {
  id: string;
  name: string;
}

interface Props {
  data: Record<string, boolean>;
}

const moduleNamesMap: Record<string, string> = {
  analytics: "Analytics",
  timeTracker: "Time Tracker",
  calendar: "Calendar",
  companyNews: "Company News",
  task_tracker_base: "Task Tracker Base",
};

const DynamicTabs: React.FC<Props> = ({ data }) => {
  let modules: ModuleDTO[] = Object.entries(data)
    .filter(([key, value]) => value && moduleNamesMap[key])
    .map(([key]) => ({ id: key, name: moduleNamesMap[key] }));

  modules.sort((a, b) =>
    a.id === "analytics" ? -1 : b.id === "analytics" ? 1 : 0
  );

  const [activeKey, setActiveKey] = useState<string>(modules[0]?.id || "");
  const [loadingStatus, setLoadingStatus] = useState<Record<string, boolean>>({});
  const [errorStatus, setErrorStatus] = useState<Record<string, string | null>>({});
  const [loadedData, setLoadedData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (activeKey && !loadedData[activeKey] && !loadingStatus[activeKey]) {
      setLoadingStatus((prev) => ({ ...prev, [activeKey]: true }));
      setErrorStatus((prev) => ({ ...prev, [activeKey]: null }));

      fetch(`/api/modules/${activeKey}`) // замените URL на ваш API
        .then((response) => {
          if (!response.ok) throw new Error(`Ошибка загрузки: ${response.statusText}`);
          return response.json();
        })
        .then((data) => {
          setLoadedData((prev) => ({ ...prev, [activeKey]: data }));
          setErrorStatus((prev) => ({ ...prev, [activeKey]: null }));
        })
        .catch((error) => {
          setErrorStatus((prev) => ({ ...prev, [activeKey]: error.message }));
          setLoadedData((prev) => ({ ...prev, [activeKey]: null }));
        })
        .finally(() => {
          setLoadingStatus((prev) => ({ ...prev, [activeKey]: false }));
        });
    }
  }, [activeKey, loadedData, loadingStatus]);

  const handleSelect = (key: string | null) => {
    if (key) setActiveKey(key);
  };

  if (modules.length === 0) return <p>Нет доступных модулей для отображения.</p>;

  return (
    <Tabs activeKey={activeKey} onSelect={handleSelect} className="mb-3" id="dynamic-tabs">
      {modules.map((module) => (
        <Tab eventKey={module.id} title={module.name} key={module.id}>
          <div style={{ padding: 20, minHeight: 200 }}>
            {loadingStatus[module.id] && <p>Загрузка данных...</p>}
            {errorStatus[module.id] && (
              <p style={{ color: "red" }}>Ошибка: {errorStatus[module.id]}</p>
            )}
            {!loadingStatus[module.id] && !errorStatus[module.id] && loadedData[module.id] && (
              <ModuleContent moduleId={module.id} data={loadedData[module.id]} />
            )}
            {!loadingStatus[module.id] && !errorStatus[module.id] && !loadedData[module.id] && (
              <p>В работе</p>
            )}
          </div>
        </Tab>
      ))}
    </Tabs>
  );
};

interface ModuleContentProps {
  moduleId: string;
  data: any;
}

const ModuleContent: React.FC<ModuleContentProps> = ({ moduleId, data }) => {
  
  switch (moduleId) {
    case "analytics":
      return <p>Analytics data: {JSON.stringify(data)}</p>;
    case "timeTracker":
      return <p>Time Tracker data: {JSON.stringify(data)}</p>;
    case "calendar":
      return <p>Calendar data: {JSON.stringify(data)}</p>;
    case "companyNews":
      return <p>Company News data: {JSON.stringify(data)}</p>;
    case "task_tracker_base":
      return <p>Task Tracker Base data: {JSON.stringify(data)}</p>;
    default:
      return <p>Модуль не реализован.</p>;
  }
};

export default DynamicTabs;
