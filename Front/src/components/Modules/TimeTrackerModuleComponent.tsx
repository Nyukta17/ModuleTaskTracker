import React, { useState } from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Pomodoro from "./ElementsTimeTracker/Pomodoro";
import PrioritiTasks from "./ElementsTimeTracker/PrioritiTasks";
import TimeBoard from "./ElementsTimeTracker/TimeBoard";

interface MyProps{
  projectHubId: string;
}

const TimeTrackerModuleComponent: React.FC<MyProps> = ({projectHubId}) => {
  const [activeKey, setActiveKey] = useState<string>("pomodoro");
 

  return (
    <>
      <Tabs
        activeKey={activeKey}
        onSelect={(k) => k && setActiveKey(k)}
        className="mb-3"
        id="time-tracker-tabs"
      >
        <Tab eventKey="pomodoro" title="Техника Помидора">
          <div style={{ padding: 20, minHeight: 200 }}>
            <Pomodoro />
          </div>
        </Tab>
        <Tab eventKey="timeBoard" title="Доска Времени">
          <div style={{ padding: 20, minHeight: 200 }}>
            <TimeBoard hubId={projectHubId} />
          </div>
        </Tab>
        <Tab eventKey="prioritiTasks" title="Мои заметки">
          <div style={{ padding: 20, minHeight: 200 }}>
            <PrioritiTasks hubId={projectHubId} />
          </div>
        </Tab>
      </Tabs>
    </>
  );
};

export default TimeTrackerModuleComponent;
