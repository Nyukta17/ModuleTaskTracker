import React, { Suspense, useEffect, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import NewsModuleComponent from "./Modules/NewsModuleComponent";
import CalendarModuleComponent from "./Modules/CalendarModuleComponent";
import AnalyticsModuleComponent from "./Modules/AnalyticsModuleComponent";
import TimeTrackerModuleComponent from "./Modules/TimeTrackerModuleComponent";
import TaskTrackerBaseComponent from "./Modules/TaskTrackerBaseComponent";

const moduleComponents: Record<string, React.FC<any>> = {
  NEWS: NewsModuleComponent,
  CALENDAR: CalendarModuleComponent,
  ANALYTICS: AnalyticsModuleComponent,
  TIME_TRACKER: TimeTrackerModuleComponent,
  BASE_MODULE: TaskTrackerBaseComponent,
};



interface Module {
  id?: number;
  name: string;
}

interface ModulesTabsProps {
  modules: Module[];
  projectHubId: string; // передаем сюда projectHubId для TaskTrackerBaseComponent
}

const ModulesTabs: React.FC<ModulesTabsProps> = ({ modules, projectHubId }) => {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const isBaseModuleAvailable = modules.some(m => m.name.toUpperCase() === "BASE_MODULE");
  const isNewsAvailable = modules.some(m => m.name.toUpperCase() === "NEWS");
  useEffect(() => {
    if (modules.length > 0 && modules[0].id !== undefined && modules[0].id !== null) {
      setActiveKey(modules[0].id.toString());
    } else {
      setActiveKey(null);
    }
  }, [modules]);

  if (modules.length === 0) {
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
        const key = mod.id?.toString() ?? `key-${index}`;
        const ModuleComponent = moduleComponents[mod.name.toUpperCase()];

        return (
          <Tab eventKey={key} title={mod.name} key={key}>
            <div style={{ padding: 10 }}>
              <Suspense fallback={<div>Загрузка модуля...</div>}>
                {ModuleComponent ? (
                  mod.name.toUpperCase() === "CALENDAR" ? (
                    <ModuleComponent
                      projectHubId={projectHubId}
                      isBaseModuleAvailable={isBaseModuleAvailable}
                      newsAvailable={isNewsAvailable}
                    />
                  ) : (
                    <ModuleComponent projectHubId={projectHubId} />
                  )
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
