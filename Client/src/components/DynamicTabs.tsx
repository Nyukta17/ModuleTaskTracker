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

  if (modules.length === 0) return <p>Нет доступных модулей для отображения.</p>;

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
            <ModuleDataLoader moduleId={module.id} />
          </div>
        </Tab>
      ))}
    </Tabs>
  );
};

interface ModuleDataLoaderProps {
  moduleId: string;
}

const ModuleDataLoader: React.FC<ModuleDataLoaderProps> = ({ moduleId }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(api.getCompanyModules + `/${moduleId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Ошибка загрузки: ${res.statusText}`);
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [moduleId]);

  if (loading) return <p>Загрузка данных...</p>;
  if (error) return <p style={{ color: "red" }}>Ошибка: {error}</p>;
  if (!data) return <p>В работе</p>;

  return <ModuleContent moduleId={moduleId} data={data} />;
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
