import React, { useState, useEffect } from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

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
  // Модули - ключи с true, имеющие отображаемое имя
  let modules: ModuleDTO[] = Object.entries(data)
    .filter(([key, value]) => value && moduleNamesMap[key])
    .map(([key]) => ({ id: key, name: moduleNamesMap[key] }));

  // Сортируем с analytics первым
  modules.sort((a, b) =>
    a.id === "analytics" ? -1 : b.id === "analytics" ? 1 : 0
  );

  // Активный ключ - первый модуль из массива либо пустой
  const [activeKey, setActiveKey] = useState<string>(modules[0]?.id || "");

  const [loadingStatus, setLoadingStatus] = useState<Record<string, boolean>>({});
  const [errorStatus, setErrorStatus] = useState<Record<string, string | null>>({});
  const [loadedData, setLoadedData] = useState<Record<string, any>>({});

  // Загрузка данных для активной вкладки (симуляция)
  useEffect(() => {
    if (activeKey && !loadedData[activeKey]) {
      setLoadingStatus((prev) => ({ ...prev, [activeKey]: true }));
      setTimeout(() => {
        setLoadingStatus((prev) => ({ ...prev, [activeKey]: false }));
        setLoadedData((prev) => ({ ...prev, [activeKey]: { placeholder: "В работе" } }));
      }, 1000);
    }
  }, [activeKey, loadedData]);

  // Обработчик переключения вкладок
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
            {errorStatus[module.id] && <p style={{ color: "red" }}>Ошибка: {errorStatus[module.id]}</p>}
            {!loadingStatus[module.id] && !errorStatus[module.id] && loadedData[module.id] && (
              <p>{loadedData[module.id].placeholder}</p>
            )}
            {!loadingStatus[module.id] && !errorStatus[module.id] && !loadedData[module.id] && (
              <p>Нет данных для отображения</p>
            )}
          </div>
        </Tab>
      ))}
    </Tabs>
  );
};

export default DynamicTabs;
