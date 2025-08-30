import React, { useState, useEffect } from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

interface ModuleDTO {
  id: string;
  name: string;
}

interface Props {
  data: Record<string, any>;
}

const moduleNamesMap: Record<string, string> = {
  analytics: "Analytics",
  timeTracker: "Time Tracker",
  calendar: "Calendar",
  companyNews: "Company News",
  task_tracker_base: "Task Tracker Base",
};

const DynamicTabs: React.FC<Props> = ({ data }) => {
  let modules: ModuleDTO[] = Object.keys(data)
    .filter((key) => moduleNamesMap[key] && data[key] === true)
    .map((key) => ({ id: key, name: moduleNamesMap[key] }));

  // Сортировка для вывода analytics первой
  modules = modules.sort((a, b) =>
    a.id === "analytics" ? -1 : b.id === "analytics" ? 1 : 0
  );

  const [activeKey, setActiveKey] = useState(modules[0]?.id || "");
  const [loadingStatus, setLoadingStatus] = useState<Record<string, boolean>>({});
  const [errorStatus, setErrorStatus] = useState<Record<string, string | null>>({});
  const [loadedData, setLoadedData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (activeKey && !loadedData[activeKey]) {
      // Пока что не делаем реальный запрос, имитация загрузки
      setLoadingStatus((prev) => ({ ...prev, [activeKey]: true }));
      setTimeout(() => {
        setLoadingStatus((prev) => ({ ...prev, [activeKey]: false }));
        // Пометить заглушку "В работе" вместо реальных данных
        setLoadedData((prev) => ({ ...prev, [activeKey]: { placeholder: "В работе" } }));
      }, 1000);
    }
  }, [activeKey]);

  const handleSelect = (k: string | null) => {
    if (k) {
      setActiveKey(k);
      if (!loadedData[k]) {
        // Заглушка — реальный запрос вставить сюда
        setLoadingStatus((prev) => ({ ...prev, [k]: true }));
        setTimeout(() => {
          setLoadingStatus((prev) => ({ ...prev, [k]: false }));
          setLoadedData((prev) => ({ ...prev, [k]: { placeholder: "В работе" } }));
        }, 1000);
      }
    }
  };

  return (
    <Tabs activeKey={activeKey} onSelect={handleSelect} className="mb-3">
      {modules.map((module) => (
        <Tab key={module.id} eventKey={module.id} title={module.name}>
          <div style={{ padding: 20, minHeight: 200 }}>
            {loadingStatus[module.id] && <p>Загрузка данных...</p>}
            {errorStatus[module.id] && (
              <p style={{ color: "red" }}>Ошибка: {errorStatus[module.id]}</p>
            )}
            {!loadingStatus[module.id] && !errorStatus[module.id] && loadedData[module.id] && (
              <>
                {/* TODO: Здесь заменить этот блок на отображение реальных данных */}
                <p>{loadedData[module.id].placeholder}</p>
              </>
            )}
            {!loadingStatus[module.id] &&
              !errorStatus[module.id] &&
              !loadedData[module.id] && <p>Нет данных для отображения</p>}
          </div>
        </Tab>
      ))}
    </Tabs>
  );
};

export default DynamicTabs;
