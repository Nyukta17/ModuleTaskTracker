import React, { Suspense, useEffect, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import NewsModuleComponent from "./Modules/NewsModuleComponent";
import CalendarModuleComponent from "./Modules/CalendarModuleComponent";
import AnalyticsModuleComponent from "./Modules/AnalyticsModuleComponent";
import TimeTrackerModuleComponent from "./Modules/TimeTrackerModuleComponent";

const moduleComponents: Record<string, React.FC> = {
  NEWS: NewsModuleComponent,
  CALENDAR: CalendarModuleComponent,
  ANALYTICS: AnalyticsModuleComponent,
  TIME_TRACKER: TimeTrackerModuleComponent,
};

interface Module {
  id?: number; // id теперь необязательный, чтобы проверить
  name: string;
}

interface ModulesTabsProps {
  modules: Module[];
}

const ModulesTabs: React.FC<ModulesTabsProps> = ({ modules }) => {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  useEffect(() => {
    if (modules.length > 0 && modules[0].id !== undefined && modules[0].id !== null) {
      setActiveKey(modules[0].id.toString());
    } else {
      setActiveKey(null);
    }
  }, [modules]);

  if (!modules.length) {
    return <div>Нет модулей для отображения</div>;
  }

  return (
    <Tabs
      id="modules-tabs"
      activeKey={activeKey || undefined}
      onSelect={(k) => setActiveKey(k)}
      className="mb-3"
      mountOnEnter
      unmountOnExit
    >
      {modules.map((mod, index) => {
        // Используем индекс если id отсутствует, но лучше иметь id
        const key = mod.id !== undefined && mod.id !== null ? mod.id.toString() : `key-${index}`;

        const eventKey = key;
        const ModuleComponent = moduleComponents[mod.name.toUpperCase()];

        return (
          <Tab eventKey={eventKey} title={mod.name} key={key}>
            <div style={{ padding: "10px" }}>
              <Suspense fallback={<div>Загрузка модуля...</div>}>
                {ModuleComponent ? (
                  <ModuleComponent />
                ) : (
                  <div>Компонент для модуля "{mod.name}" не найден</div>
                )}
              </Suspense>
            </div>
          </Tab>
        );
      })}
    </Tabs>
  );
};

export default ModulesTabs;
