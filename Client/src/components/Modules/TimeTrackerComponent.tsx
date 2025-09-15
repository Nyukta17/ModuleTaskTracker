import React, { useState } from "react"
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Pomodoro from "./ElementsTimeTracker/Pomodoro";
import PrioritiTasks from "./ElementsTimeTracker/PrioritiTasks";
import TimeBoard from "./ElementsTimeTracker/TimeBoard";
const TimeTrackerComponent: React.FC = () => {
    const [activeKey, setActiveKey] = useState("pomodoro");
    return (<>
        <Tabs
            activeKey={activeKey}
            onSelect={(k) => k && setActiveKey(k)}
            className="mb-3"
            id="time-tracker-tabs"
        >
            <Tab eventKey="pomodoro" title="Техника Помидора">
                <div style={{ padding: 20, minHeight: 200 }}>
                    <Pomodoro/>
                </div>
            </Tab >
            <Tab eventKey="timeBoard" title="Доска Времени">
                <div style={{ padding: 20, minHeight: 200 }}>
                    <TimeBoard/>
                </div>
            </Tab>
            <Tab eventKey="prioritiTasks" title="Мои заметки">
                <div style={{ padding: 20, minHeight: 200 }}>
                    <PrioritiTasks/>
                </div>
            </Tab>

        </Tabs>
    </>)
}
export default TimeTrackerComponent